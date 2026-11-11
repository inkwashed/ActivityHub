/* Real-browser regression. Requires Playwright; CHROME_PATH may select local Chrome. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
(async()=>{
 const root=path.resolve(__dirname,'..');let server,browser;
 try{
  server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));try{if(!file.startsWith(root+path.sep))throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file))}catch{res.writeHead(404);res.end()}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const context=await browser.newContext({reducedMotion:'reduce',acceptDownloads:true}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/apps/avatar/`);
  await page.waitForSelector('#portrait svg');
  const choices=page.locator('[data-jump-section=choices]');
  for(const [width,height] of [[739,380],[740,380],[739,381],[740,381],[1024,300],[1280,380],[1280,381],[768,1024],[1024,768],[1440,900],[390,844],[320,568]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(80);
   const stacked=width<740||height<=380;
   assert.deepEqual(await page.locator('#tabs').evaluate(el=>({vertical:getComputedStyle(el).overflowY,bar:getComputedStyle(el).scrollbarWidth})),{vertical:'hidden',bar:'none'},`no nested tab scrollbars ${width}x${height}`);
   assert.equal(await page.locator('.builder-jump').isVisible(),stacked,`jump ${width}x${height}`);
   const bounds=await page.locator('#portrait').boundingBox();assert(Math.abs(bounds.width-bounds.height)<1,`square ${width}x${height}`);assert(bounds.width>200,`usable portrait ${width}x${height}`);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`no page overflow ${width}x${height}`);
   if(stacked){
    await page.locator('.builder-jump button').click();await page.waitForTimeout(70);assert.equal(await page.evaluate(()=>document.activeElement.dataset.jumpSection),'choices');
    assert.match(await page.locator('.builder-jump button').innerText(),/Back/);await page.locator('.builder-jump button').click();assert.equal(await page.evaluate(()=>document.activeElement.dataset.jumpSection),'activity');
   }
   await page.locator('#tab-eyes').click();await choices.evaluate(el=>el.scrollTop=0);await page.waitForTimeout(80);
   let metrics=await choices.evaluate(el=>({cue:el.classList.contains('has-more'),hidden:el.scrollHeight-el.clientHeight-el.scrollTop>2,scroll:getComputedStyle(el).overflowY==='auto',width:el.clientWidth,full:el.scrollWidth}));
   assert.equal(metrics.cue,metrics.hidden&&metrics.scroll,`accurate cue ${width}x${height}`);assert(metrics.full<=metrics.width+1,`choices do not overflow horizontally ${width}x${height}`);
   await choices.evaluate(el=>el.scrollTop=el.scrollHeight);await page.waitForTimeout(80);assert.equal(await choices.evaluate(el=>el.classList.contains('has-more')),false);
   await page.locator('[data-part=mouth]').last().focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-part=mouth]').last().getAttribute('aria-pressed'),'true');
   await page.locator('#share').focus();assert.equal(await page.locator('#share').evaluate(el=>el.getBoundingClientRect().bottom<=innerHeight+1),true,`final action reachable ${width}x${height}`);
   await page.locator('#tab-design').click();await page.waitForTimeout(80);
   metrics=await choices.evaluate(el=>({cue:el.classList.contains('has-more'),hidden:el.scrollHeight-el.clientHeight-el.scrollTop>2,scroll:getComputedStyle(el).overflowY==='auto'}));assert.equal(metrics.cue,metrics.hidden&&metrics.scroll,'short content clears cue');
  }
  console.log('PASS: responsive squares, 739/740 and 380/381 boundaries, short windows, section focus/navigation, accurate overflow cues and final actions.');
  await page.setViewportSize({width:1024,height:768});
  for(const lang of ['en','ja'])for(const theme of ['blue','green','purple','gold','maroon']){
   await page.evaluate(({lang,theme})=>{ActivityHubI18n.setLanguage(lang);ActivityTheme.set(theme)},{lang,theme});
   await page.locator('#tab-eyes').click();await page.locator('#eyelashes-toggle').check();await page.locator('#eyelashes-toggle').uncheck();
   const snapshot=await page.locator('#tabs').ariaSnapshot();assert(snapshot.includes('tab '));assert.equal(await page.locator('#tabs [tabindex="0"]').count(),1);
   await page.locator('#tab-eyes').focus();await page.keyboard.press('End');assert.equal(await page.evaluate(()=>document.activeElement.id),'tab-design');await page.keyboard.press('Home');assert.equal(await page.evaluate(()=>document.activeElement.id),'tab-face');
   await page.locator('[data-part=face][data-value=slim]').click();await page.locator('#clear').click();assert.equal(await page.locator('#clear span').getAttribute('data-i18n'),'Restore');await page.locator('#clear').click();assert.equal(await page.locator('[data-part=face][data-value=slim]').getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#share span').innerText(),lang==='en'?'Save':'保存');
  }
  await page.locator('#tab-eyes').click();
  await page.locator('[data-custom-color=eyeColor]').fill('#aabbcc');
  assert.match(await page.locator('[data-custom-color=eyeColor]').getAttribute('aria-describedby'),/custom-status/);
  assert(await page.locator('[data-custom-color=eyeColor]').evaluate(el=>el.parentElement.classList.contains('is-custom')));
  await page.locator('#tab-face').click();await page.waitForTimeout(250);
  const protectedSave=await page.evaluate(()=>localStorage.getItem('letseigo.app.avatar'));
  await page.evaluate(()=>{const render=window.renderAvatar;window.renderAvatar=(...args)=>{window.renderAvatar=render;throw Error('one render failure')}});
  await page.locator('#clear').click();assert.equal(await page.locator('#clear span').getAttribute('data-i18n'),'Restore');
  await page.evaluate(()=>dispatchEvent(new Event('pagehide')));assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.app.avatar')),protectedSave);
  await page.locator('#clear').click();assert.equal(await page.locator('[data-part=face][data-value=slim]').getAttribute('aria-pressed'),'true');
  console.log('PASS: real-page rendering failure protects saved avatar and Restore retries successfully; custom-color accessible description/selection.');
  // Simulate text-only enlargement including the app's px-sized text.
  await page.setViewportSize({width:740,height:600});
  await page.evaluate(()=>{for(const el of document.querySelectorAll('button,legend,h2,label,.question'))el.style.fontSize=parseFloat(getComputedStyle(el).fontSize)*2+'px'});
  for(const tab of ['face','eyes','hair','clothes','design']){
   await page.locator('#tab-'+tab).click();await page.locator('#share').focus();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   assert(await choices.evaluate(el=>el.scrollWidth<=el.clientWidth+1),'enlarged choices fit');
  }
  await page.reload();await page.waitForSelector('#portrait svg');
  await page.locator('#tab-face').click();assert.equal(await page.locator('[data-part=face][data-value=slim]').getAttribute('aria-pressed'),'true','save survives reload');
  await page.locator('#share').click();await page.waitForSelector('#download-photo:not([hidden])');
  const image=await page.locator('#avatar-photo').evaluate(el=>({w:el.naturalWidth,h:el.naturalHeight}));assert.deepEqual(image,{w:800,h:800});
  const downloadPromise=page.waitForEvent('download');await page.locator('#download-photo').click();const download=await downloadPromise;assert.equal(download.suggestedFilename(),'my-profile-pic.png');assert.equal(await download.failure(),null);
  await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'share');
  for(const lang of ['en','ja']){
   await page.evaluate(lang=>ActivityHubI18n.setLanguage(lang),lang);
   await page.locator('.page-qr-trigger').click();assert.equal(await page.locator('#page-qr-link').inputValue(),'https://letseigo.com/apps/avatar/');
   assert(await page.locator('.page-qr-image').evaluate(el=>el.complete&&el.naturalWidth>0));
   assert.match(await page.locator('.page-qr-trigger').getAttribute('aria-label'),/Share|共有/);
   const qrDownload=page.waitForEvent('download');await page.locator('.page-qr-actions a').click();assert.equal((await qrDownload).suggestedFilename(),'letseigo-avatar-qr.png');
   await page.keyboard.press('Escape');assert(await page.locator('.page-qr-trigger').evaluate(el=>el===document.activeElement));
  }
  // Export errors remain local and retryable.
  await page.evaluate(()=>{window.originalToBlob=HTMLCanvasElement.prototype.toBlob;HTMLCanvasElement.prototype.toBlob=()=>{throw Error('test canvas failure')}});
  await page.locator('#share').click();await page.waitForFunction(()=>document.querySelector('#share-status').textContent&&!document.querySelector('#share-status').textContent.includes('…'));
  assert(await page.locator('#download-photo').isHidden());await page.keyboard.press('Escape');
  await page.evaluate(()=>HTMLCanvasElement.prototype.toBlob=window.originalToBlob);
  await page.locator('#share').click();await page.waitForSelector('#download-photo:not([hidden])');await page.keyboard.press('Escape');
  console.log('PASS: QR public-only link/image/download/focus in both languages and PNG failure/retry.');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>ActivityHubI18n.setLanguage('en'));await page.setViewportSize({width:1024,height:768});await page.locator('#tab-eyes').click();
  if(process.env.AVATAR_SCREENSHOT)await page.screenshot({path:process.env.AVATAR_SCREENSHOT,fullPage:true});
  console.log('PASS: both languages, five themes, keyboard/ARIA states, enlarged text, persistence, 800px PNG download and dialog focus return.');
  for(const app of ['apps/pizza','apps/parfait','apps/sandwich','apps/class-supplies','_dev/builder']){
   await page.goto(`http://127.0.0.1:${server.address().port}/${app}/`);await page.waitForTimeout(120);
   const column=page.locator('.builder-menu-scroll');assert.equal(await column.count(),1,app);
   await column.locator('button:visible').first().click();await page.waitForTimeout(100); // Let the existing choice-edit scroll-preservation frame settle.
   await column.evaluate(el=>el.scrollTop=el.scrollHeight);await page.waitForTimeout(60);assert.equal(await column.evaluate(el=>el.classList.contains('has-more')),false,app+' bottom cue clears');
   await page.setViewportSize({width:1024,height:300});await page.waitForTimeout(60);assert.equal(await column.evaluate(el=>el.classList.contains('has-more')),false,app+' page flow has no overflow cue');
   await page.setViewportSize({width:1024,height:768});
  }
  assert.deepEqual(errors,[]);console.log('PASS: shared scroll helper smoke checks across all five existing panel-adapter consumers.');
 }finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve())}
})().catch(error=>{console.error(error);process.exitCode=1});
