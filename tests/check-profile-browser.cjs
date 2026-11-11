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

  await page.goto(base+'/');
  await page.evaluate(()=>{localStorage.setItem('letseigo.profile',JSON.stringify({version:1,value:{name:'Existing name',extra:'preserve'}}));localStorage.setItem('letseigo.app.profile-test','creation sentinel');});
  await page.reload();await page.click('#home-profile');
  assert.equal(await page.locator('#profile-name-text').textContent(),'Existing name');assert.equal(await page.locator('#profile-name').isVisible(),false);
  const before=await page.evaluate(()=>localStorage.getItem('letseigo.profile'));
  await page.click('#edit-profile-name');assert.equal(await page.locator('#profile-name').evaluate(el=>el===document.activeElement),true);
  await page.fill('#profile-name','Draft only');assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.profile')),before);
  await page.click('#cancel-profile-name');assert.equal(await page.locator('#profile-name-text').textContent(),'Existing name');
  await page.click('#edit-profile-name');await page.fill('#profile-name','Discard with Escape');await page.keyboard.press('Escape');assert.equal(await page.locator('#profile-dialog').evaluate(el=>el.open),true);assert.equal(await page.locator('#edit-profile-name').evaluate(el=>el===document.activeElement),true);
  await page.click('#edit-profile-name');await page.fill('#profile-name','Close draft');await page.click('#close-profile');await page.click('#home-profile');assert.equal(await page.locator('#profile-name-text').textContent(),'Existing name');
  await page.click('#edit-profile-name');await page.fill('#profile-name','  New name  ');await page.keyboard.press('Enter');assert.equal(await page.locator('#profile-name-text').textContent(),'New name');
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('letseigo.profile')).value),{name:'New name',extra:'preserve'});
  await page.reload();await page.click('#home-profile');assert.equal(await page.locator('#profile-name-text').textContent(),'New name');
  await page.click('#edit-profile-name');await page.fill('#profile-name','');await page.keyboard.press('Enter');assert.equal(await page.locator('#profile-name-text').textContent(),'Add your name');
  const long='<img src=x onerror=alert(1)>'.repeat(3).slice(0,80);
  await page.click('#edit-profile-name');await page.fill('#profile-name',long);await page.keyboard.press('Enter');assert.equal(await page.locator('#profile-name-text').textContent(),long);assert.equal(await page.locator('#profile-name-text img').count(),0);
  const peer=await context.newPage();await peer.goto(base+'/');await peer.evaluate(()=>localStorage.setItem('letseigo.profile',JSON.stringify({version:1,value:{name:'Other tab'}})));await page.waitForFunction(()=>document.querySelector('#profile-name-text').textContent==='Other tab');
  await page.click('#edit-profile-name');await page.fill('#profile-name','Keep typing');await peer.evaluate(()=>localStorage.setItem('letseigo.profile',JSON.stringify({version:1,value:{name:'Latest saved'}})));await page.waitForFunction(()=>document.querySelector('#profile-name-text').textContent==='Latest saved');assert.equal(await page.inputValue('#profile-name'),'Keep typing');await page.click('#cancel-profile-name');assert.equal(await page.locator('#profile-name-text').textContent(),'Latest saved');await peer.close();
  let cases=0;
  for(const theme of themes)for(const language of ['en','ja'])for(const viewport of [{width:1133,height:744},{width:768,height:1024},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
   await page.setViewportSize(viewport);await page.evaluate(({theme,language})=>{ActivityTheme.set(theme);ActivityHubI18n.setLanguage(language,false)},{theme,language});
   const portrait=await page.locator('#profile-selfie').boundingBox(),name=await page.locator('.profile-name-field').boundingBox(),picker=await page.locator('.profile-preferences').boundingBox();
   assert.ok(name.x>=portrait.x+portrait.width);assert.ok(Math.abs(name.y-portrait.y)<1,'Name must align to avatar top');
   const badges=await page.locator('.profile-badges').boundingBox();
   if(viewport.width>600){assert.ok(badges.x>=name.x+name.width);assert.ok(Math.abs(badges.y-portrait.y)<1);}
   else assert.ok(badges.y>=Math.max(portrait.y+portrait.height,name.y+name.height));
   assert.ok(picker.y>=badges.y+badges.height);assert.ok(picker.y>=portrait.y+portrait.height);assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
   await page.click('#edit-profile-name');await page.fill('#profile-name',long);assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));await page.click('#cancel-profile-name');cases++;
  }
  await page.evaluate(()=>ActivityAchievements.recordBlog({id:'profile-layout-check',mode:'free'},{fields:{body:'a'.repeat(110)}}));
  await page.click('#blog-badge');assert.equal(await page.locator('#blog-badge').getAttribute('aria-expanded'),'true');
  for(const width of [1133,768,390,320]){await page.setViewportSize({width,height:744});assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));assert.equal(await page.locator('#badge-detail').isVisible(),true);const identity=await page.locator('.profile-identity').boundingBox(),detail=await page.locator('#badge-detail').boundingBox(),themeRow=await page.locator('.profile-preferences').boundingBox();assert.ok(detail.y>=identity.y+identity.height);assert.ok(Math.abs(detail.x-identity.x)<1&&Math.abs(detail.width-identity.width)<1);assert.ok(themeRow.y>=detail.y+detail.height);}
  await page.setViewportSize({width:1133,height:744});await page.evaluate(()=>{ActivityTheme.set('blue');ActivityHubI18n.setLanguage('en',false)});
  if(process.env.THEME_SCREENSHOTS)await page.screenshot({path:path.join(process.env.THEME_SCREENSHOTS,'profile-id-card.png')});
  await page.click('#edit-profile-name');await page.fill('#profile-name','Failed write draft');
  await page.evaluate(()=>{window.profileWrite=ActivityAutosave.write;ActivityAutosave.write=()=>false;});await page.locator('#profile-name-editor button[type=submit]').click();assert.equal(await page.inputValue('#profile-name'),'Failed write draft');assert.equal(await page.locator('#profile-name-editor').isVisible(),true);assert.match(await page.locator('#profile-name-status').textContent(),/could not be saved/);await page.evaluate(()=>ActivityAutosave.write=window.profileWrite);await page.click('#cancel-profile-name');
  await page.setViewportSize({width:320,height:568});await page.addStyleTag({content:'#profile-dialog{font-size:150%}#profile-name-text{font-size:2rem}'});assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
  await page.keyboard.press('Escape');assert.equal(await page.locator('#home-profile').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('letseigo.app.profile-test')),'creation sentinel');assert.deepEqual(errors,[]);

  for(const route of ['NH1-5','NH2-4','NH6-5','journal']){
   const app=await context.newPage();app.on('pageerror',e=>errors.push(e.message));
   await app.goto(base+'/myblog/'+route+'/');
   assert.equal(await app.locator('#fullscreen').count(),0);
   await app.click('#home-profile');
   const appAvatar=await app.locator('#profile-selfie').boundingBox(),appName=await app.locator('.profile-name-field').boundingBox(),appBadges=await app.locator('.profile-badges').boundingBox();
   assert.ok(Math.abs(appName.y-appAvatar.y)<1);assert.ok(appBadges.x>=appName.x+appName.width);
   await app.click('#edit-profile-name');
   await app.fill('#profile-name','Profile '+route);await app.locator('#profile-name-editor button[type=submit]').click();
   await app.locator('input[name=color-theme][value=green]').check();
   assert.equal(await app.evaluate(()=>ActivityTheme.current),'green');
   assert.ok(await app.locator('#profile-dialog a').evaluate(el=>el.href.endsWith('/apps/avatar/')));
   await app.click('#close-profile');
   if(route!=='journal')assert.equal(await app.locator('#blog-author-name').textContent(),'Profile '+route);
   await app.setViewportSize({width:390,height:844});await app.click('#home-profile');
   assert.ok(await app.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
   await app.close();
  }
  const local=await browser.newPage();await local.goto('file://'+path.join(root,'myblog/NH1-5/index.html'));
  await local.click('#home-profile');assert.ok(await local.locator('#profile-selfie img').evaluate(img=>img.complete&&img.naturalWidth>0));
  await local.close();assert.deepEqual(errors,[]);
  console.log(`PASS Profile: ${cases} theme/language/viewport cases; left avatar/right name, explicit Save, Enter, Cancel/Escape/close discard, safe text, persistence, storage failure, concurrent-tab drafts, record/creation preservation and enlarged text.`);
 }finally{await browser?.close();await new Promise(resolve=>server?server.close(resolve):resolve());}
})().catch(error=>{console.error(error);process.exitCode=1;});
