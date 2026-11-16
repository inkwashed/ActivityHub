/* Rendered browser follow-up: requires Playwright, Chrome and local HTTP permission. */
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
(async()=>{let browser;const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));try{if(!file.startsWith(root+path.sep))throw Error('path');if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
try{
 const base=process.env.BUILDER_BASE_URL||await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',()=>resolve('http://127.0.0.1:'+server.address().port))});
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const context=await browser.newContext({locale:'en-US'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const routes=[['/apps/pizza/','pizzaBuilder'],['/apps/parfait/','parfaitBuilder'],['/apps/sandwich/','sandwichBuilder'],['/apps/class-supplies/','suppliesBuilder'],['/apps/paper-craft/','craftBuilder'],['/_dev/builder/','labBuilder']];
 let layouts=0;
 for(const [route,key] of routes){
  await page.setViewportSize({width:1133,height:744});await page.goto(base+route);await page.waitForFunction(key=>window[key]?.creative,key);
  const ids=await page.evaluate(key=>{const b=window[key],c=b.creative;c.switchMode(true);b.clear();const group=c.catalog.filter(x=>(x.layer||0)===(c.catalog[0].layer||0));for(const type of [group[0],group[1],group[0]])c.add(type.id);c.select(c.items[0].id);return c.orderedItems().map(x=>x.id)},key);
  assert.equal(await page.locator('#free-tools button').count(),9);assert.equal(await page.getByRole('button',{name:'Move to top of group',exact:true}).count(),0);
  const forward=page.getByRole('button',{name:'Move forward one layer',exact:true}),backward=page.getByRole('button',{name:'Move backward one layer',exact:true});assert.ok(await backward.isDisabled());
  const state=await page.evaluate(key=>window[key].creative.items.map(({id,x,y,scale,rotate,flip})=>({id,x,y,scale,rotate,flip})),key);
  await forward.click();assert.deepEqual(await page.evaluate(key=>window[key].creative.orderedItems().map(x=>x.id),key),[ids[1],ids[0],ids[2]]);
  await backward.click();assert.deepEqual(await page.evaluate(key=>window[key].creative.orderedItems().map(x=>x.id),key),ids);
  await forward.click();await forward.click();assert.ok(await forward.isDisabled());assert.deepEqual(await page.evaluate(key=>window[key].creative.items.slice().sort((a,b)=>a.id-b.id).map(({id,x,y,scale,rotate,flip})=>({id,x,y,scale,rotate,flip})),key),state.slice().sort((a,b)=>a.id-b.id));
  await page.evaluate(()=>ActivityHubI18n.setLanguage('ja'));assert.equal(await page.locator('#free-tools button[title="1つ前に移動"]').count(),1);await page.evaluate(()=>ActivityHubI18n.setLanguage('en'));
  for(const viewport of [{width:1440,height:900},{width:1133,height:599},{width:768,height:1024},{width:390,height:844},{width:320,height:568},{width:844,height:360}]){
   await page.setViewportSize(viewport);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   const layout=await page.evaluate(()=>{const f=document.querySelector('.builder-play-area').getBoundingClientRect();return {frame:{left:f.left,right:f.right,top:f.top,bottom:f.bottom},buttons:[...document.querySelectorAll('#free-tools button')].map(b=>{const r=b.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}}),overflow:document.documentElement.scrollWidth>innerWidth}});
   assert.equal(layout.overflow,false,route+' horizontal overflow '+JSON.stringify(viewport));for(const b of layout.buttons){assert.ok(b.width>=44&&b.height>=44);assert.ok(b.left>=layout.frame.left-1&&b.right<=layout.frame.right+1&&b.top>=layout.frame.top-1&&b.bottom<=layout.frame.bottom+1,route+' tools outside frame '+JSON.stringify(viewport));}layouts++;
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS: six rendered builders, one-step buttons, ordering, disabled boundaries, unchanged transforms, Japanese labels, '+layouts+' toolbar layouts.');
}finally{await browser?.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1});
