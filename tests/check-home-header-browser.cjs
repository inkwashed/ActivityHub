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


  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/');let cases=0;
  for(const theme of themes)for(const language of ['en','ja'])for(const width of [1440,1194,768,390,320]){
   await page.setViewportSize({width,height:844});await page.evaluate(({theme,language})=>{ActivityTheme.set(theme);ActivityHubI18n.setLanguage(language,false);document.querySelector('.home-scroll').scrollTo({top:0,behavior:'instant'});},{theme,language});
   const tagline=await page.locator('.intro-topline .eyebrow').boundingBox(),report=await page.locator('.home-report').boundingBox();
   if(width>=768)assert.ok(Math.abs((tagline.y+tagline.height/2)-(report.y+report.height/2))<1,'tagline/report share a row');
   const intro=await page.locator('.intro').boundingBox(),topline=await page.locator('.intro-topline').boundingBox();assert.ok(Math.abs(report.x+report.width-intro.x-intro.width)<1,'report aligns with full intro right edge');assert.ok(Math.abs(topline.y-intro.y-12)<1,'intro top padding stays compact');
   if(width>=1000){const feedback=await page.locator('.home-feedback').boundingBox();assert.ok(report.y+report.height<=feedback.y);}
   const header=page.locator('.home-header'),initial=await header.boundingBox();assert.ok(initial.height<=(width<=380?120:60),'compact header at '+width);
   for(const selector of ['#language','#home-profile','.page-qr-button']){if(await page.locator(selector).count()){const b=await page.locator(selector).boundingBox();assert.ok(b.width>=44&&b.height>=44);}}
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.evaluate(()=>document.querySelector('.home-scroll').scrollTo({top:1200,behavior:'instant'}));assert.ok(Math.abs((await header.boundingBox()).y)<1);assert.ok(await page.locator('.home-scroll').evaluate(el=>el.scrollTop>0));assert.equal(await page.evaluate(()=>document.scrollingElement.scrollTop),0);
   const region=await page.locator('.home-scroll').boundingBox();assert.ok(Math.abs(region.y-initial.height)<1);assert.ok(region.y+region.height<=844);assert.ok(await page.locator('.home-scroll').evaluate(el=>el.scrollWidth<=el.clientWidth+1));
   await page.click('#home-profile');assert.equal(await page.locator('#profile-dialog').evaluate(el=>el.open),true);await page.keyboard.press('Escape');
   await page.click('#language');assert.equal(await page.locator('#language-dialog').evaluate(el=>el.open),true);await page.keyboard.press('Escape');
   await page.goto(base+'/#lets-try-2');await page.waitForFunction(()=>document.querySelector('#lets-try-2').getBoundingClientRect().top>=document.querySelector('.home-header').getBoundingClientRect().bottom);
   cases++;
  }
  await page.setViewportSize({width:320,height:568});await page.addStyleTag({content:'.home-header{font-size:150%}.wordmark{font-size:30px}'});
  await page.waitForFunction(()=>Math.abs(document.querySelector('.home-scroll').getBoundingClientRect().top-document.querySelector('.home-header').getBoundingClientRect().bottom)<1);
  await page.goto(base+'/#lets-try-2');await page.locator('.skip-link').focus();assert.ok((await page.locator('.skip-link').boundingBox()).y>=0);await page.keyboard.press('Enter');
  assert.ok((await page.locator('#activities').boundingBox()).y>=(await page.locator('.home-header').boundingBox()).height-1);
  await page.setViewportSize({width:1194,height:834});await page.evaluate(()=>{ActivityTheme.set('blue');document.querySelector('.home-scroll').scrollTo({top:900,behavior:'instant'});});
  if(process.env.THEME_SCREENSHOTS)await page.screenshot({path:path.join(process.env.THEME_SCREENSHOTS,'home-sticky-header.png')});
  await page.locator('.home-scroll').focus();const scrollBefore=await page.locator('.home-scroll').evaluate(el=>el.scrollTop);await page.keyboard.press('PageDown');await page.waitForFunction(before=>document.querySelector('.home-scroll').scrollTop>before,scrollBefore);
  assert.equal(await page.locator('.ah-copyright').evaluate(el=>!!el.closest('.home-scroll')),true);
  const scrollbar=await page.locator('.home-scroll').evaluate(el=>getComputedStyle(el).scrollbarColor);assert.notEqual(scrollbar,'auto');
  await page.click('#home-profile');assert.equal(await page.locator('#profile-dialog').evaluate(el=>getComputedStyle(el).scrollbarColor),scrollbar);await page.keyboard.press('Escape');
  await page.emulateMedia({forcedColors:'active'});assert.equal(await page.locator('.home-scroll').evaluate(el=>getComputedStyle(el).scrollbarColor),'auto');await page.emulateMedia({forcedColors:'none'});
  await page.goto(base+'/apps/pizza/');assert.equal(await page.locator('.builder-menu-scroll').evaluate(el=>getComputedStyle(el).scrollbarColor),scrollbar);
  await page.goto(base+'/myblog/NH1-5/');assert.equal(await page.locator('.blog-panel').first().evaluate(el=>getComputedStyle(el).scrollbarColor),scrollbar);
  assert.deepEqual(errors,[]);console.log(`PASS homepage header: ${cases} theme/language/width cases; compact height, 44px controls, separate content scrolling and fixed header, Profile/language dialogs, hash targets, wrapped header sizing, shared scrollbar colors/forced colors, keyboard content scrolling and keyboard skip link.`);
 }finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());}
})().catch(error=>{console.error(error);process.exitCode=1;});
