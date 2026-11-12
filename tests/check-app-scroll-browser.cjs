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



  await page.emulateMedia({reducedMotion:'reduce'});
  const routes=['/apps/pizza/','/apps/parfait/','/apps/sandwich/','/apps/class-supplies/','/apps/avatar/','/apps/my-town/','/apps/post/','/myblog/NH1-5/','/myblog/NH2-4/','/myblog/NH6-5/','/myblog/journal/','/_dev/builder/'];
  const measurements=[];let cases=0;
  for(const route of routes)for(const viewport of [{width:1133,height:744},{width:768,height:1024},{width:390,height:844},{width:844,height:360}]){
   await page.setViewportSize(viewport);await page.goto(base+route);await page.waitForTimeout(100);
   const header=page.locator('body>header'),before=await header.boundingBox();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1),route+' document overflow '+JSON.stringify(viewport));
   measurements.push(await page.evaluate(({route,viewport})=>({route:route.split('/').filter(Boolean).pop(),viewport,header:document.querySelector('header').getBoundingClientRect().toJSON(),boxes:[...document.querySelectorAll('main,.builder-play-area,.pantry,#town-map,#portrait')].map(el=>({selector:el.id||el.className,rect:el.getBoundingClientRect().toJSON()}))}),{route,viewport}));
   await page.evaluate(()=>{const el=[...document.querySelectorAll('.app-scroll,.blog-panel,#blog-sentences,#blog-handwriting,.journal-contents')].find(el=>el.getBoundingClientRect().height>0&&['auto','scroll'].includes(getComputedStyle(el).overflowY));if(el)el.dataset.nativeScrollAudit='';});
   const target=page.locator('[data-native-scroll-audit]');assert.equal(await target.count(),1,route+' native scroller');
   assert.ok((await target.boundingBox()).y>=before.y+before.height-1,route+' scroller below header');
   await target.evaluate(el=>{const extra=document.createElement('div');extra.dataset.scrollFixture='';extra.style.cssText='height:2000px;min-height:2000px;flex-shrink:0';el.append(extra);el.tabIndex=0;el.dataset.scrollTest='';el.scrollTop=600;});
   for(const theme of themes){
    await page.evaluate(theme=>ActivityTheme.set(theme),theme);
    assert.notEqual(await target.evaluate(el=>getComputedStyle(el).scrollbarColor),'auto');assert.equal(await target.evaluate(el=>getComputedStyle(el).scrollbarColor),await page.evaluate(()=>getComputedStyle(document.documentElement).scrollbarColor));
    assert.ok(Math.abs((await header.boundingBox()).y)<1,route+' header stays separate');cases++;
   }
   assert.ok(await target.evaluate(el=>el.scrollTop>0));assert.equal(await page.evaluate(()=>document.scrollingElement.scrollTop),0);
   await target.focus();const oldScroll=await target.evaluate(el=>el.scrollTop);await page.keyboard.press('PageDown');await page.waitForFunction(old=>document.querySelector('[data-scroll-test]').scrollTop>old,oldScroll,{timeout:3000}).catch(async()=>{throw Error(route+' '+JSON.stringify(viewport)+' keyboard '+JSON.stringify(await target.evaluate(el=>({scroll:el.scrollTop,height:el.clientHeight,total:el.scrollHeight,focused:el===document.activeElement}))))});
   await target.evaluate(el=>{el.querySelector('[data-scroll-fixture]').remove();el.scrollTop=0;});
   if(await page.locator('.app-scroll').count()&&await page.locator('.ah-copyright').count())assert.equal(await page.locator('.ah-copyright').evaluate(el=>!!el.closest('.app-scroll')),true);
   const jump=page.locator('.builder-jump button:visible');
   if(await jump.count()){
    await page.locator('[data-jump-section=choices]').evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('.builder-jump button').textContent.includes(ActivityHubI18n.t('Back to activity')));
    await jump.click();assert.ok((await page.locator('[data-jump-section=activity]').boundingBox()).y>=before.height-1);
   }
   await page.evaluate(()=>ActivityHubI18n.setLanguage('ja',false));assert.ok(Math.abs((await header.boundingBox()).y)<1);
   const toggle=page.locator('#free-mode');if(await toggle.count()){await toggle.check();await toggle.uncheck();}
  }
  if(process.env.THEME_SCREENSHOTS){await page.setViewportSize({width:390,height:844});await page.goto(base+'/apps/pizza/');await page.locator('.app-scroll').evaluate(el=>el.scrollTop=450);await page.screenshot({path:path.join(process.env.THEME_SCREENSHOTS,'app-scroll-phone.png')});}
  fs.writeFileSync(process.env.APP_SCROLL_MEASUREMENTS||path.join(require('node:os').tmpdir(),'app-scroll-after.json'),JSON.stringify(measurements));
  assert.deepEqual(errors,[]);console.log(`PASS app shells: ${cases} scrollbar theme/page/viewport cases across 12 entrypoints; real forced overflow, root/header isolation, keyboard scrolling, builder jumps, Japanese, mode changes and footer containment.`);
 }finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());}
})().catch(error=>{console.error(error);process.exitCode=1;});
