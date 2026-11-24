/* Run against a local static server with SCHOOL_TOUR_BASE_URL and Playwright on NODE_PATH. */
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');
const { runInNewContext } = require('node:vm');

const expected = [
  ['library', 'We can read books here.'],
  ['classroom', 'We sit at our own desks and study together.'],
  ['computer', 'Everyone can use a computer here.'],
  ['music', 'We can sing and play the piano here.'],
  ['art', 'We use brushes and paint to make pictures.'],
  ['science', 'We look at tiny things with a microscope.'],
  ['cooking', 'We use a stove to make food.'],
  ['lunch', 'We eat together at the long tables.'],
  ['nurse', 'If we feel sick, we can lie down on a bed here.'],
  ['teachers', 'Teachers sit together to plan their lessons.'],
  ['principal', 'The head of our school meets visitors here.'],
  ['office', 'Visitors stop at the window to get a pass.'],
  ['entrance', 'We put our outdoor shoes in cubbies here.'],
  ['restroom', 'There are toilets and sinks here.'],
  ['playground', 'We can go down the slide outside.'],
  ['gym', 'We can shoot baskets on an indoor court.']
];

function verifyLocalFiles() {
  const entry = pathToFileURL(resolve(__dirname, '../apps/school-tour/index.html'));
  const html = readFileSync(entry, 'utf8');
  const local = path => {
    const url = new URL(path, entry);
    assert.equal(url.protocol, 'file:', path);
    return url;
  };
  for (const [, path] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const url = local(path);
    if (url.pathname.endsWith('/')) url.pathname += 'index.html';
    assert.ok(readFileSync(url).length, path);
  }
  const sandbox = { window: {} };
  runInNewContext(readFileSync(local('rooms.js'), 'utf8'), sandbox);
  const { rooms } = sandbox.window.SchoolTour;
  assert.deepEqual(Array.from(rooms, room => [room.id, room.clue]), expected);
  const assets = rooms.flatMap(room => [room.art, room.hint.art, room.audio.model, room.audio.clue]);
  const urls = Array.from(assets, local).sort((a, b) => a.pathname < b.pathname ? -1 : 1);
  const hash = createHash('sha256');
  for (const url of urls) hash.update(readFileSync(url));
  const version = hash.digest('hex').slice(0, 12);
  assert.ok(urls.every(url => url.searchParams.get('v') === version), 'Stale media asset versions');
}

async function verify(browser, origin) {
  verifyLocalFiles();
  const context = await browser.newContext({ viewport: { width: 1133, height: 744 }, locale: 'en-US' });
  try {
    await context.addInitScript(() => {
      let draws = 0;
      Math.random = () => {
        const index = 15 - draws++ % 15;
        return draws > 15 && index >= 8 ? (index - 8 + .5) / (index + 1) : .999;
      };
      window.schoolTourPlayback = [];
      const BrowserAudio = window.Audio;
      window.Audio = function () {
        const audio = new BrowserAudio();
        audio.addEventListener('playing', () => window.schoolTourPlayback.push(audio.src));
        return audio;
      };
    });
    await context.route('**/*', route => route.request().url().startsWith(origin + '/')
      ? route.continue() : route.abort('internetdisconnected'));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
    page.on('request', request => { if (!request.url().startsWith(origin + '/')) errors.push(request.url()); });
    await page.goto(origin + '/apps/school-tour/');
    const room = id => page.locator(`button[data-room="${id}"]`);
    const mode = name => page.locator(`button[data-mode="${name}"]`);
    const shown = selector => page.locator(selector).isVisible();
    const text = selector => page.locator(selector).textContent();
    const verifyImage = (image, filename, width, height) => image.evaluate(async (element, expectedImage) => {
      await element.decode();
      return new URL(element.currentSrc).pathname.endsWith('/art/' + expectedImage.filename)
        && element.naturalWidth === expectedImage.width
        && element.naturalHeight === expectedImage.height;
    }, { filename, width, height });
    const play = async (kind, id) => {
      const prior = await page.evaluate(() => window.schoolTourPlayback.length);
      await page.locator(`[data-audio="${kind}"]`).click();
      await page.waitForFunction(({ prior, kind, id }) => {
        const path = window.schoolTourPlayback.at(-1)?.split('?')[0];
        return window.schoolTourPlayback.length > prior && path?.endsWith(`/${id}-${kind}.mp3`);
      }, { prior, kind, id });
    };

    assert.equal(await page.locator('[data-room]').count(), 16);
    assert.equal(await text('#model p:first-child'), 'This is the library.');
    await room('library').focus();
    assert.equal(await room('library').evaluate(button => getComputedStyle(button).outlineStyle), 'solid');
    await page.keyboard.press('Enter');
    await play('model', 'library');
    await page.locator('#favorite').click();
    assert.match(await text('#partner-answer'), /This is my favorite place\. This is the library\./);

    const mapPositions = () => page.locator('[data-room]').evaluateAll(buttons =>
      buttons.map(button => [button.dataset.room, button.offsetLeft, button.offsetTop]));
    const learnPositions = await mapPositions();
    await mode('quiz').click();
    assert.deepEqual(await mapPositions(), learnPositions);
    assert.equal(await page.locator('[data-room][aria-pressed="true"]').count(), 0);
    assert.equal(await shown('#detail'), false);
    assert.equal(await text('#clue'), expected[0][1]);
    await play('clue', 'library');
    await page.locator('#hint-toggle').click();
    assert.equal(await page.locator('#hint').getAttribute('alt'), '');
    assert.ok(await verifyImage(page.locator('#hint'), 'library-hint.webp', 120, 120));
    await play('clue', 'library');

    await room('gym').click();
    assert.equal(await text('#feedback'), 'Try another place.');
    assert.equal(await room('gym').locator('.room-mark').textContent(), '×');
    assert.equal(await shown('#next'), false);
    await mode('learn').click();
    assert.equal(await shown('#partner'), true);
    await room('music').click();
    await page.locator('#favorite').click();
    assert.equal(await room('library').locator('.room-mark').isVisible(), false);
    await mode('quiz').click();
    assert.equal(await text('#clue'), expected[0][1]);
    assert.equal(await text('#feedback'), 'Try another place.');

    for (let question = 0; question < expected.length; question++) {
      const [id, clue] = expected[question];
      assert.equal(await text('#clue'), clue);
      assert.equal(await page.locator('[data-room][aria-pressed="true"]').count(), 0);
      assert.deepEqual(await mapPositions(), learnPositions);
      const label = await room(id).locator('.room-name').textContent();
      assert.ok(!clue.toLowerCase().includes(label));
      if (!(await shown('#hint'))) await page.locator('#hint-toggle').click();
      assert.ok(await verifyImage(page.locator('#hint'), id + '-hint.webp', 120, 120), id);
      assert.ok(await verifyImage(room(id).locator('img'), id + '.webp', 480, 220), id);
      await room(id).click();
      assert.equal(await text('#feedback'), 'That’s right!');
      assert.equal(await text('#room-title'), label);
      assert.ok(await verifyImage(page.locator('#scene'), id + '.webp', 480, 220), id);
      assert.equal(await text('#model p:first-child'), `This is the ${label}.`);
      assert.equal(await page.locator('[data-room][aria-pressed="true"]').count(), 1);
      assert.equal(await text('#clue'), clue);
      if (question === 0) await play('model', 'library');
      await page.locator('#next').click();
      if (question % 8 === 7) {
        assert.equal(await text('#feedback'), 'Round complete!');
        assert.equal(await shown('#detail'), false);
        await page.locator('#next').click();
      }
    }

    await mode('learn').click();
    await page.locator('#language').click();
    await page.locator('[data-language="ja"]').click();
    await page.keyboard.press('Escape');
    assert.equal(await text('#map-title'), '学校の地図');
    assert.equal(await text('#model p:first-child'), 'This is the music room.');
    await page.locator('[data-room] img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
    for (const [width, height] of [[1133, 744], [1024, 768], [768, 1024], [390, 844], [320, 568], [1440, 900]]) {
      await page.setViewportSize({ width, height });
      for (const name of ['learn', 'quiz']) {
        await mode(name).click();
        const layout = await page.evaluate(() => {
          const scroll = document.querySelector('.app-scroll');
          const map = document.querySelector('.map').getBoundingClientRect();
          const panel = document.querySelector('.side section:not([hidden])').getBoundingClientRect();
          const targets = [...document.querySelectorAll('[data-room]')].map(button => button.getBoundingClientRect());
          return {
            fits: scroll.scrollWidth <= scroll.clientWidth,
            sideBySide: map.right <= panel.left,
            imagesFit: [...document.querySelectorAll('[data-room] img')].every(image =>
              Math.abs(image.clientWidth * 220 / 480 - image.clientHeight) <= 1),
            targetsFit: targets.every(({ width, height }) => width >= 44 && height >= 44),
            separated: targets.every((a, i) => targets.slice(i + 1).every(b =>
              a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top))
          };
        });
        assert.deepEqual(layout, { fits: true, sideBySide: width >= 740, imagesFit: true, targetsFit: true, separated: true }, `${width}×${height}, ${name}`);
      }
    }
    await page.setViewportSize({ width: 320, height: 568 });
    await mode('learn').click();
    await room('principal').click();
    assert.equal(await page.locator('#room-title').evaluate(el => el === document.activeElement), true);
    await page.locator('#back-to-room').click();
    assert.equal(await room('principal').evaluate(el => el === document.activeElement), true);
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    assert.equal(await page.locator('.app-scroll').evaluate(el => el.scrollWidth <= el.clientWidth), true);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
}

module.exports = { verify, verifyLocalFiles };
if (require.main === module) {
  const { chromium } = require('playwright');
  (async () => {
    const origin = process.env.SCHOOL_TOUR_BASE_URL;
    assert.ok(origin, 'Set SCHOOL_TOUR_BASE_URL to a local server for the ActivityHub checkout.');
    const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
    try {
      await verify(browser, origin);
      console.log('School Tour passed two complete rounds, audio, language, keyboard and responsive checks.');
    } finally {
      await browser.close();
    }
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
