/* Run with Playwright on NODE_PATH; CHROME_PATH may select installed Chrome. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..'),themes=['green','blue','maroon','gold','purple'];
(async()=>{
 let server,browser;
 try{
  let base=process.env.BLOG_BASE_URL;
  if(!base){server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));try{if(!file.startsWith(root+path.sep)&&file!==root)throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[ext]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));base='http://127.0.0.1:'+server.address().port;}
  browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+'/');assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.theme')),null);
  await page.click('#home-profile');await page.fill('#profile-name','Theme regression');
  const savedProfile=await page.evaluate(()=>localStorage.getItem('letseigo.profile'));
  await page.evaluate(()=>localStorage.setItem('letseigo.app.theme-test','creation sentinel'));
  const radio=page.locator('[data-theme-picker] input');assert.equal(await radio.count(),5);
  await radio.first().focus();await page.keyboard.press('ArrowRight');assert.equal(await radio.nth(1).isChecked(),true);assert.equal(await page.evaluate(()=>ActivityTheme.current),'blue');
  assert.equal(await radio.nth(1).evaluate(el=>el.matches(':focus-visible')),true);
  assert.equal(await radio.nth(1).evaluate(el=>getComputedStyle(el.nextElementSibling).outlineStyle),'solid');
  await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');assert.equal(await radio.last().isChecked(),true);
  await page.keyboard.press('Tab');assert.ok(!(await radio.last().evaluate(el=>el===document.activeElement)));
  await page.keyboard.press('Escape');assert.equal(await page.locator('#home-profile').evaluate(el=>el===document.activeElement),true);
  let paints=0;await page.route('**/shared/tokens.css*',async route=>{await page.waitForFunction(()=>document.documentElement.dataset.ahTheme==='purple');paints++;await route.continue();});await page.reload();await page.unroute('**/shared/tokens.css*');assert.ok(paints>0);
  const peer=await context.newPage();await peer.goto(base+'/apps/pizza/');await page.evaluate(()=>ActivityTheme.set('gold'));await peer.waitForFunction(()=>ActivityTheme.current==='gold');await peer.close();
  const paths=['/','/apps/pizza/','/apps/parfait/','/apps/class-supplies/','/apps/avatar/','/apps/my-town/','/myblog/NH1-5/','/myblog/NH6-5/','/apps/post/'];
  let cases=0;
  for(const theme of themes){
   await page.goto(base+'/');await page.click('#home-profile');await page.locator(`input[name=color-theme][value=${theme}]`).check();assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.theme')),theme);await page.reload();assert.equal(await page.evaluate(()=>ActivityTheme.current),theme);
   await page.goto(base+'/apps/pizza/');
   const sauce=page.locator('#sauce-options button').first();await sauce.click();await sauce.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
   assert.equal(await sauce.getAttribute('aria-pressed'),'true');assert.equal(await sauce.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
   await page.locator('#advanced-mode').check();assert.equal(await page.locator('#advanced-mode').isChecked(),true);
   await page.locator('#free-mode').check();await page.locator('#topping-options button').first().click();
   assert.equal(await page.locator('.free-piece').count()>0,true);
   await page.click('#language');assert.equal(await page.locator('#language-dialog').evaluate(el=>el.open),true);await page.keyboard.press('Escape');
   await page.goto(base+'/');await page.setViewportSize({width:390,height:844});await page.click('#home-profile');
   await page.addStyleTag({content:'#profile-dialog{font-size:150%}'});assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));await page.keyboard.press('Escape');
   for(const viewport of [{width:1133,height:744},{width:768,height:1024},{width:390,height:844}]){
    await page.setViewportSize(viewport);
    for(const url of paths){await page.goto(base+url);assert.equal(await page.evaluate(()=>ActivityTheme.current),theme);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${theme} ${url} horizontal overflow`);cases++;
     if(url==='/'){
      await page.click('#home-profile');assert.equal(await page.locator('input[name=color-theme]:checked').inputValue(),theme);
      assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
      for(const label of await page.locator('.ah-theme-option').all()){const b=await label.boundingBox();assert.ok(b.width>=44&&b.height>=44);}
      if(process.env.THEME_SCREENSHOTS&&viewport.width===768)await page.screenshot({path:path.join(process.env.THEME_SCREENSHOTS,theme+'-profile.png')});
      await page.keyboard.press('Escape');
     }else if(process.env.THEME_SCREENSHOTS&&viewport.width===1133&&['/apps/pizza/','/myblog/NH1-5/','/apps/post/'].includes(url))await page.screenshot({path:path.join(process.env.THEME_SCREENSHOTS,theme+'-'+url.split('/').filter(Boolean).pop()+'.png')});
    }
   }
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.profile')),savedProfile);assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.app.theme-test')),'creation sentinel');
  await page.goto(base+'/');await page.click('#home-profile');await context.setOffline(true);await page.locator('input[value=purple]').check();assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.theme')),'purple');await context.setOffline(false);
  await page.evaluate(()=>ActivityHubI18n.setLanguage('ja'));assert.match(await page.locator('input[value=purple]').getAttribute('aria-label'),/パープル/);
  // No SW is installed: test local-file support rather than claiming offline HTTP reload support.
  const local=await browser.newContext({offline:true});const file=await local.newPage();await file.goto('file://'+path.join(root,'index.html'));await file.click('#home-profile');await file.locator('input[value=blue]').check();await file.reload();assert.equal(await file.evaluate(()=>ActivityTheme.current),'blue');await file.goto('file://'+path.join(root,'apps/pizza/index.html'));assert.equal(await file.evaluate(()=>ActivityTheme.current),'blue');await local.close();
  const unavailable=await browser.newContext();await unavailable.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Unavailable','SecurityError');}});});const blocked=await unavailable.newPage();await blocked.goto(base+'/');await blocked.click('#home-profile');await blocked.locator('input[value=maroon]').check();assert.equal(await blocked.evaluate(()=>ActivityTheme.current),'maroon');assert.match(await blocked.locator('.ah-theme-status').textContent(),/could not be saved/);await unavailable.close();
  assert.deepEqual(errors,[]);console.log(`PASS browser: ${cases} theme/page/viewport cases; Profile keyboard/focus/targets/enlarged text, Builder selection/PLAY/HARD/dialog, reload, pre-style restore, cross-tab, navigation, save isolation, Japanese, blocked storage, loaded-page offline selection, offline local-file reload/navigation.`);
 }finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());}
})().catch(error=>{console.error(error);process.exitCode=1;});
