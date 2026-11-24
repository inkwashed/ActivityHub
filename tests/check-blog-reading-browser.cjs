const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');

const lesson = name => pathToFileURL(path.join(__dirname, '..', 'myblog', name, 'index.html')).href;
const draft = 'Let’s save the sea turtles.\nSea turtles live in the sea.\nPlastic is a big problem.\nWe can bring our own bags.';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH
  });
  try {
    const context = await browser.newContext({ locale: 'en-US', offline: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(lesson('NH6-6'));
    assert.equal(await page.locator('.blog-animal-card').count(), 36);
    await page.setViewportSize({ width: 320, height: 568 });
    assert.equal(await page.locator('.blog-read-footer').innerText(), 'My Encyclopedia - Animals');
    const scrollCheck=await page.locator('.blog-read-content').evaluate(content=>{
      const heading=content.previousElementSibling,footer=content.nextElementSibling;
      const top=heading.getBoundingClientRect().top,bottom=footer.getBoundingClientRect().bottom;
      content.scrollTop=content.scrollHeight;
      return content.scrollTop>0 && top===heading.getBoundingClientRect().top && bottom===footer.getBoundingClientRect().bottom;
    });
    assert.ok(scrollCheck, 'The cards scroll independently of the heading and footer.');

    for (const [width, height] of [[320, 568], [768, 1024], [1024, 768], [1366, 900]]) {
      await page.setViewportSize({ width, height });
      for (const tab of ['#tab-read', '#tab-write']) {
        await page.click(tab);
        const fit = await page.locator('[role=tabpanel]:visible').evaluate(panel => ({
          panel: panel.scrollWidth - panel.clientWidth,
          page: document.documentElement.scrollWidth - innerWidth
        }));
        assert.ok(fit.panel <= 1 && fit.page <= 1, JSON.stringify(fit));
      }
    }
    await page.click('#tab-read');
    await page.click('[data-animal=tigers]');
    assert.equal(await page.locator('.blog-profile-category').innerText(), 'Animal');
    await page.getByRole('button', { name: 'All animals', exact: true }).click();
    await page.click('[data-animal=sea-turtles]');
    assert.equal(await page.locator('.blog-profile-category').innerText(), 'Sea animal');
    assert.deepEqual(await page.locator('#blog-read h2').allTextContents(), [
      'Where do sea turtles live?', 'What’s the problem?', 'What can we do for the sea turtles?'
    ]);
    await page.waitForFunction(() => [...document.querySelectorAll('#blog-read img')].every(img => img.naturalWidth > 0));
    await page.getByRole('button',{name:'Bookmark animal',exact:true}).click();

    await page.locator('#tab-read').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#tab-write').getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#tab-write').evaluate(el => el.matches(':focus-visible')), true);
    const rows=page.locator('[data-sentence]');
    assert.equal(await rows.count(), 4);
    assert.deepEqual(await rows.evaluateAll(inputs=>inputs.map(input=>input.value)), ['', '', '', '']);
    assert.deepEqual(await page.locator('#blog-sentences .sentence-ghost').allTextContents().then(lines=>lines.map(line=>line.replace(/\u200b/g,''))), [
      'Let’s save the sea turtles.',
      'Sea turtles live in the sea.',
      'Plastic pollution is a big problem.',
      'We can use eco-friendly bags.'
    ]);
    const habitat=rows.nth(1);
    await habitat.press('Enter');
    const expanded=page.getByRole('dialog',{name:'Sentence 2'});
    await expanded.locator('[data-sentence]').fill('North Atlantic right whales ');
    assert.equal((await expanded.locator('.sample-frame,.sample-variable').allTextContents()).join(''),'live in the sea.');
    assert.equal(await expanded.locator('[data-sentence]').count(),1);
    await expanded.getByRole('checkbox',{name:'Show Help?'}).uncheck();
    assert.equal(await expanded.locator('.sample-frame').count(),0);
    await page.keyboard.press('Escape');
    assert.equal(await expanded.isVisible(),true);
    await expanded.getByRole('button',{name:'Done',exact:true}).click();
    assert.equal(await expanded.isVisible(),false);
    assert.equal(await page.locator('#show-help').isChecked(),false);
    assert.equal(await rows.nth(1).evaluate(input=>document.activeElement===input),true);
    await habitat.click();
    await expanded.locator('[data-sentence]').fill('');
    await expanded.getByRole('button',{name:'Done',exact:true}).click();
    await page.uncheck('#show-help');
    assert.equal(await page.locator('#blog-sentences .sample-frame').count(), 0);
    await page.check('#show-help');
    assert.equal(await page.locator('.blog-animal-notes td').count(), 3);
    assert.equal(await page.getByRole('heading',{name:'My Notes'}).isVisible(), true);
    assert.deepEqual(await page.locator('.blog-notes-table thead th').allTextContents(), ['Animal','Habitat','Problem','Action']);
    assert.equal(await page.locator('.blog-animal-notes').count(), 1);
    for (const [i,sentence] of draft.split('\n').entries()) {
      await rows.nth(i).click();
      await page.locator('.blog-sentence-dialog [data-sentence]').fill(sentence);
      await page.locator('.blog-sentence-close').click();
    }
    await page.check('#writing-mode');
    assert.equal(await page.locator('.ink-pad:visible').count(), 4);
    assert.equal(await rows.first().isVisible(), false);
    await page.uncheck('#writing-mode');

    await page.click('#tab-read');
    assert.match(await page.locator('#blog-read h1').innerText(), /sea turtles/);
    await page.getByRole('button', { name: 'All animals', exact: true }).click();
    await page.click('[data-animal=giant-pandas]');
    await page.locator('.blog-keep-note').click();
    await page.click('#tab-write');
    const groups = page.locator('.blog-animal-notes');
    assert.equal(await groups.count(), 2);
    assert.match(await groups.nth(0).innerText(), /sea turtles/);
    assert.match(await groups.nth(1).innerText(), /giant pandas[\s\S]*forest loss/);
    await groups.nth(1).locator('button').click();
    assert.equal(await groups.count(), 1);
    await page.click('#tab-read');
    assert.equal(await page.locator('.blog-keep-note').getAttribute('aria-pressed'),'false');
    await page.click('#tab-write');
    assert.deepEqual(await rows.evaluateAll(inputs=>inputs.map(input=>input.value)), draft.split('\n'));

    await page.click('#tab-design');
    const design = await page.locator('#design-grid').innerText();
    assert.match(design.replace(/\s+/g, ' '), /Plastic is a big problem/);
    assert.doesNotMatch(design, /eco-friendly|forest loss|plastic in the sea/);
    const openIllustrations=page.getByRole('button',{name:'Images',exact:true});
    const illustrations=page.getByRole('dialog',{name:'Images',exact:true});
    await openIllustrations.click();
    assert.equal(await illustrations.getByRole('button',{pressed:false}).count(),3);
    const habitatImage=illustrations.getByRole('button',{name:'sea turtles: Habitat',exact:true});
    assert.equal(await habitatImage.locator('.blog-bookmark-indicator').textContent(),'+');
    await habitatImage.click();
    assert.equal(await habitatImage.getAttribute('aria-pressed'),'true');
    assert.equal(await habitatImage.locator('.blog-bookmark-indicator').textContent(),'−');
    assert.equal(await page.locator('#design-grid img').count(),1);
    await illustrations.getByRole('button',{name:'Done',exact:true}).click();
    assert.equal(await openIllustrations.evaluate(button=>document.activeElement===button),true);
    await page.click('#share');
    await page.waitForFunction(() => document.querySelector('#blog-snapshot').naturalWidth > 0);
    assert.equal(await page.locator('#download-photo').isVisible(), true);
    await page.keyboard.press('Escape');
    await page.reload();
    assert.match(await page.locator('#blog-read h1').innerText(), /giant pandas/);
    await page.click('#tab-write');
    assert.deepEqual(await rows.evaluateAll(inputs=>inputs.map(input=>input.value)), draft.split('\n'));
    assert.equal(await page.locator('.blog-remove-note').count(), 1);
    await page.click('#tab-design');
    await openIllustrations.click();
    assert.equal(await habitatImage.getAttribute('aria-pressed'),'true');
    assert.equal(await page.locator('#design-grid img').count(),1);

    await page.goto(lesson('NH1-5'));
    assert.deepEqual(await page.getByRole('tab').allTextContents(), ['Write', 'Photos', 'Design']);
    await page.fill('#blog-body', 'Writing-only smoke test.');
    await page.reload();
    assert.equal(await page.locator('#blog-body').inputValue(), 'Writing-only smoke test.');
    assert.deepEqual(errors, []);
    console.log('PASS: offline Read/Write, art, notes by animal, draft reload, keyboard, PNG preview, and writing-only blog.');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
