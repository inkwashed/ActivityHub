const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
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
    assert.equal(await page.locator('.blog-animal-card').count(), 33);
    assert.equal(await page.locator('[data-animal=przewalskis-horses]').count(),0);
    assert.equal(await page.locator('[data-animal=bornean-orangutans]').count(),0);
    assert.deepEqual((await page.locator('.blog-habitat-group h2').allTextContents()).slice(0,2),['The Ice','The Sea']);
    await page.getByRole('button',{name:'Filter animals'}).click();
    const animalFilters=page.getByRole('dialog',{name:'Filter animals'});
    await animalFilters.getByLabel('Habitat').selectOption('forests');
    await animalFilters.getByLabel('Problem').selectOption('global warming');
    await animalFilters.getByRole('button',{name:'Done'}).click();
    assert.equal(await page.locator('[data-animal=komodo-dragons]').count(),1);
    assert.equal(await page.locator('[data-animal=sea-turtles]').count(),0);
    await page.getByRole('button',{name:'Filter animals'}).click();
    await animalFilters.getByRole('button',{name:'Clear filters'}).click();
    await animalFilters.getByRole('button',{name:'Done'}).click();
    assert.equal(await page.locator('.blog-animal-card').count(),33);

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
      assert.equal(await page.locator('.blog-sentence-dialog .blog-animal-notes').count(),1);
      await page.locator('.blog-sentence-dialog [data-sentence]').fill(sentence);
      await page.locator('.blog-sentence-close').click();
    }
    await page.check('#writing-mode');
    assert.equal(await page.locator('.ink-pad:visible').count(), 4);
    assert.equal(await rows.first().isVisible(), false);
    await page.locator('.ink-select').first().click();
    assert.equal(await page.locator('.blog-sentence-dialog .blog-animal-notes').count(),1);
    await page.locator('.blog-sentence-close').click();
    assert.equal(await page.locator('#blog-preview .blog-animal-notes').count(),1);

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
    assert.deepEqual(await page.getByRole('tab').allTextContents(), ['Read', 'Write', 'Design']);
    await page.locator('#blog-custom-open').click();
    const uploads=page.getByRole('dialog',{name:'Uploaded images',exact:true});
    const photo=fs.readFileSync(path.join(__dirname,'../myblog/NH6-6/art/sea-turtles.webp'));
    await uploads.locator('#blog-upload').setInputFiles(Array.from({length:3},(_,i)=>({name:`photo-${i}.webp`,mimeType:'image/webp',buffer:photo})));
    await uploads.locator('.blog-image-row').nth(2).waitFor();
    assert.equal(await uploads.locator('#blog-upload').isDisabled(),true);
    assert.deepEqual(await uploads.locator('.blog-image-row > span').allTextContents(),['Image 1','Image 2','Image 3']);
    await uploads.getByRole('button',{name:'Done',exact:true}).click();
    await openIllustrations.click();
    await illustrations.getByRole('button',{name:'sea turtles: Problem',exact:true}).click();
    await illustrations.getByRole('button',{name:'sea turtles: Action',exact:true}).click();
    await illustrations.getByRole('button',{name:'Done',exact:true}).click();
    assert.equal(await page.locator('#design-grid img').count(),6);
    const photoNames=await page.locator('#design-picker option[value^="photo:"]').allTextContents();
    assert.deepEqual(photoNames,['Bookmark 1','Image 1','Image 2','Image 3','Bookmark 2','Bookmark 3']);
    await page.getByRole('button',{name:'Select Bookmark 1',exact:true}).click();
    const selectedBlock=page.locator('.design-block.is-selected');
    const selectedArea=await selectedBlock.locator('.design-select').boundingBox();
    const grid=await page.locator('#design-grid').boundingBox();
    const start={x:selectedArea.x+selectedArea.width/2,y:selectedArea.y+selectedArea.height/2};
    const other=await page.getByRole('button',{name:'Select Image 1',exact:true}).boundingBox();
    const originalColumn=await selectedBlock.evaluate(block=>block.style.gridColumnStart);
    await page.mouse.move(start.x,start.y);
    await page.mouse.down();
    await page.mouse.move(grid.x-12,start.y);
    assert.equal(await selectedBlock.evaluate(block=>block.classList.contains('is-invalid-drop')),true);
    await page.mouse.up();
    assert.equal(await selectedBlock.evaluate(block=>block.style.gridColumnStart),originalColumn);
    await selectedBlock.locator('.design-select').evaluate(button=>{
      button.addEventListener('pointerdown',event=>{button.dataset.testPointer=event.pointerId;},{once:true});
    });
    await page.mouse.move(start.x,start.y);
    await page.mouse.down();
    await page.mouse.move(other.x+other.width/2,other.y+other.height/2);
    assert.equal(await page.locator('.design-drag-preview img').isVisible(),true);
    assert.equal(await selectedBlock.evaluate(block=>block.classList.contains('is-picked-up')),true);
    assert.equal(await page.locator('.design-drop-target').isVisible(),true);
    await selectedBlock.locator('.design-select').evaluate(button=>{
      button.dispatchEvent(new PointerEvent('pointerup',{pointerId:Number(button.dataset.testPointer),bubbles:true,clientX:-1,clientY:-1}));
    });
    await page.mouse.up();
    assert.equal(await selectedBlock.evaluate(block=>block.style.gridColumnStart),'3');
    assert.equal(await page.locator('.design-drag-preview').count(),0);


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
    assert.equal(await page.locator('#design-grid img').count(),6);

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
