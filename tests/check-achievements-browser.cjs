const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.BLOG_BASE_URL||'http://127.0.0.1:8776';
 await page.goto(base+'/myblog/NH1-5/');await page.fill('#blog-body','Writing practice. '.repeat(8));await page.waitForTimeout(400);
 assert.equal(await page.evaluate(()=>ActivityAchievements.blogProgress().count),1);
 await page.fill('#blog-body','');await page.waitForTimeout(400);await page.reload();assert.equal(await page.evaluate(()=>ActivityAchievements.blogProgress().count),1);
 await page.goto(base+'/myblog/NH6-5/');for(const field of ['item','country','continent'])await page.fill(`[data-field=${field}]`,'yes');await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>ActivityAchievements.blogProgress().count),1);
 await page.fill('[data-field=description]','nice');await page.waitForTimeout(400);assert.equal(await page.evaluate(()=>ActivityAchievements.blogProgress().count),2);
 await page.goto(base+'/');await page.click('#home-profile');await page.click('#blog-badge');assert.match(await page.textContent('#badge-detail'),/2 blog entries/);
 await page.evaluate(()=>{for(let i=0;i<18;i++)ActivityAchievements.recordBlog({id:'test-'+i,mode:'free'},{fields:{body:'a'.repeat(100)}});});
 assert.match(await page.getAttribute('#blog-badge-icon','src'),/diamond/);assert.equal(await page.getAttribute('#blog-badge','aria-expanded'),'true');
 assert.ok(await page.locator('#profile-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth));
 await page.screenshot({path:'/tmp/achievement-profile.png'});
 await page.evaluate(()=>ActivityHubI18n.setLanguage('ja'));assert.equal(await page.textContent('#blog-badge-label'),'かけだしジャーナリスト');assert.match(await page.getAttribute('#blog-badge','aria-label'),/ダイヤモンド/);
 assert.deepEqual(errors,[]);console.log('Browser: writing awards, permanent credit, ES attempts, profile expansion, diamond, mobile fit and Japanese passed.');
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
