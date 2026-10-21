const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});try{
const p=await browser.newPage({viewport:{width:1024,height:768}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.env.BLOG_BASE_URL||'http://127.0.0.1:8776')+'/myblog/NH6-5/');await p.fill('[data-field=item]','my hat');await p.check('#writing-mode');assert.equal(await p.locator('.ink-pad').count(),4);assert.equal(await p.locator('.ink-canvas:visible').count(),4);
for(const viewport of [{width:1024,height:768},{width:390,height:844},{width:844,height:390}]){
 await p.setViewportSize(viewport);
 const check=await p.evaluate(()=>{
  const area=document.querySelector('#blog-handwriting'),panel=document.querySelector('#blog-preview');
  const controls=['#show-help','#writing-mode'].map(s=>document.querySelector(s));
  const before=controls.map(e=>e.getBoundingClientRect().top);
  area.scrollTop=area.scrollHeight;
  return {scrolled:area.scrollTop>0,stable:controls.every((e,i)=>e.getBoundingClientRect().top===before[i]),panelFits:panel.scrollHeight<=panel.clientHeight+1,areaHeight:area.clientHeight};
 });
 assert.ok(check.scrolled&&check.stable&&check.panelFits&&check.areaHeight>0,JSON.stringify({viewport,check}));
}
await p.setViewportSize({width:1024,height:768});
const read=()=>p.evaluate(()=>ActivityAutosave.read('letseigo.app.world-blog',1));
async function draw(locator){await locator.scrollIntoViewIfNeeded();const box=await locator.boundingBox();await p.mouse.move(box.x+box.width*.15,box.y+box.height*.45);await p.mouse.down();await p.mouse.move(box.x+box.width*.35,box.y+box.height*.65,{steps:10});await p.mouse.up();}
await draw(p.locator('.ink-canvas').first());assert.equal((await read()).ink[0].length,1);await p.locator('.ink-pad').first().getByRole('button',{name:'Undo',exact:true}).click();assert.equal((await read()).ink[0].length,0);await draw(p.locator('.ink-canvas').first());
await p.locator('.ink-pad').first().getByRole('button',{name:'Eraser',exact:true}).click();await draw(p.locator('.ink-canvas').first());assert.equal((await read()).ink[0].length,0);await p.locator('.ink-pad').first().getByRole('button',{name:'Undo',exact:true}).click();assert.equal((await read()).ink[0].length,1);await p.locator('.ink-pad').first().getByRole('button',{name:'Pen',exact:true}).click();await p.uncheck('#show-help');assert.equal((await read()).ink[0].length,1);await p.uncheck('#writing-mode');assert.equal(await p.locator('[data-field=item]').inputValue(),'my hat');await p.check('#writing-mode');await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>[...document.querySelectorAll('.ink-canvas')].filter(c=>!c.hidden).length===8);await draw(p.locator('.ink-pad').first().locator('canvas').nth(1));assert.ok((await read()).ink[0][1][0][0]>408);
await p.reload();assert.ok(await p.locator('#writing-mode').isChecked());assert.equal((await read()).ink[0].length,2);await p.setViewportSize({width:1024,height:768});await p.click('#tab-design');assert.equal(await p.locator('.design-ink').count(),4);await p.selectOption('#design-picker','ink:0');assert.ok(await p.locator('#design-taller').isDisabled());await p.click('#design-down');assert.ok((await read()).inkLayout);await p.click('#share');await p.waitForFunction(()=>document.querySelector('#blog-snapshot').naturalWidth>0);await p.locator('#blog-snapshot').screenshot({path:'work/ink-share.png'});await p.keyboard.press('Escape');await p.click('#tab-write');await p.screenshot({path:'work/ink-post.png'});
const before=JSON.stringify(await read());await p.goto((process.env.BLOG_BASE_URL||'http://127.0.0.1:8776')+'/myblog/journal/');await p.waitForFunction(()=>document.querySelector('#entry-image').naturalWidth>0);assert.equal(JSON.stringify(await read()),before);assert.deepEqual(errors,[]);console.log('PASS writing strokes, undo, two-line combination, modes, help, reload, layout, Share and Journal.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
