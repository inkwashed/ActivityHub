const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
(async()=>{let browser;const root=path.resolve(__dirname,'..');const server=http.createServer((req,res)=>{let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));try{if(!file.startsWith(root+path.sep)&&file!==root)throw Error();if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});
try{await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const id of ['pizza','sandwich','parfait','class-supplies','my-town']){
 await page.goto(base+'/apps/'+id+'/');await page.waitForTimeout(350);assert.equal(await page.evaluate(id=>ActivityAchievements.builderProgress(id).count,id),0,id+' starts empty');
 const selector=id==='my-town'?'#place-options button':'.topping-button:visible';
 if(id==='my-town')await page.locator('#blocks button').first().click();
 await page.locator(selector).first().click();await page.waitForTimeout(400);
 assert.equal(await page.evaluate(id=>ActivityAchievements.builderProgress(id).count,id),1,id+' first edit');
 await page.reload();await page.waitForTimeout(400);assert.equal(await page.evaluate(id=>ActivityAchievements.builderProgress(id).count,id),1,id+' reload');
 await page.locator('#clear').click();await page.waitForTimeout(350);assert.equal(await page.evaluate(id=>ActivityAchievements.builderProgress(id).count,id),1,id+' reset');
}
await page.goto(base+'/');await page.click('#home-profile');assert.equal(await page.locator('.profile-badge:visible').count(),5);
await page.click('#sandwich-badge');assert.equal(await page.textContent('#blog-badge-label'),'My First Sandwich');assert.equal(await page.textContent('#badge-description'),'Make a sandwich in Little Sandwich Shop.');
assert.match(await page.locator('#sandwich-badge img').getAttribute('src'),/apps\/sandwich\/icon.svg/);
assert.equal(await page.textContent('#badge-progress'),'1/5');assert.equal(await page.getAttribute('#badge-detail-icon','src'),await page.locator('#sandwich-badge img').getAttribute('src'));
await page.click('#pizza-badge');assert.equal(await page.getAttribute('#sandwich-badge','aria-expanded'),'false');assert.equal(await page.getAttribute('#pizza-badge','aria-expanded'),'true');
await page.evaluate(()=>{const key=ActivityAchievements.key,raw=ActivityAutosave.read(key,1);raw.builders.pizza.lastSession=Date.now()-1800001;ActivityAutosave.write(key,1,raw);});
await page.goto(base+'/apps/pizza/');await page.locator('.topping-button:visible').first().click();await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>ActivityAchievements.builderProgress('pizza').count),2);
await page.goto(base+'/');await page.evaluate(()=>{const key=ActivityAchievements.key,raw=ActivityAutosave.read(key,1);for(const value of Object.values(raw.builders))value.count=20;ActivityAutosave.write(key,1,raw);});await page.click('#home-profile');await page.click('#pizza-badge');
for(const width of [1133,390,320]){await page.setViewportSize({width,height:844});assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));}
assert.equal(await page.textContent('#badge-progress'),'20/20');assert.equal(await page.getAttribute('#badge-detail-icon','src'),await page.locator('#pizza-badge img').getAttribute('src'));await page.screenshot({path:'/tmp/builder-badges.png'});await page.evaluate(()=>ActivityHubI18n.setLanguage('ja'));assert.equal(await page.textContent('#blog-badge-label'),'ダイヤモンドピザ');
assert.deepEqual(errors,[]);console.log('Browser: all five builder edits, reset/reload persistence, cooldown expiry, shared grid/details, original/ranked icons, mobile and Japanese passed.');
}finally{await browser?.close();await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error);process.exitCode=1;});
