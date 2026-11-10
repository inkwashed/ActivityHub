const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const logs=[],label={dataset:{},textContent:''},button={querySelector:()=>label,addEventListener(){}},doc={querySelector:()=>button,addEventListener(){}};
const context={window:{},document:doc,console:{error:m=>logs.push(m)}};
vm.runInNewContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
let data={play:false,learn:{toppings:{fruit:1}},items:[],hard:false},writes=0,fail=false;
const b={config:{independentDifficulty:true},creative:{active:false},clear:()=>{data.learn.toppings.fruit=0},announce(){}};
const storage={capture:()=>data,restore:raw=>{data=raw;if(fail){fail=false;data.learn.toppings.fruit=99;throw Error('fixture')}}};
const recovery=context.window.BuilderReset.install(b,storage,()=>writes++);
recovery.press();assert.equal(label.textContent,'Restore');fail=true;recovery.press();
assert.equal(label.textContent,'Restore');assert.equal(data.learn.toppings.fruit,0,'partial restore rolled back');assert.equal(writes,1,'failed restore never flushes');assert.equal(b.restoreFailed,true);assert.equal(logs.length,1);
recovery.refresh();assert.equal(label.textContent,'Restore');recovery.press();assert.equal(data.learn.toppings.fruit,1);assert.equal(label.textContent,'Reset');assert.equal(b.restoreFailed,false);
// Startup restore exceptions must not overwrite the saved snapshot on pagehide.
const saved=JSON.stringify({version:1,value:{items:[{x:42}]}}),memory=new Map([['letseigo.app.test',saved]]),events={};
const ctx={window:{addEventListener:(n,f)=>events[n]=f},document:{addEventListener(){}},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},console:{error:m=>logs.push(m)},clearTimeout(){},setTimeout(){}};
vm.runInNewContext(fs.readFileSync('shared/autosave.js','utf8'),ctx);
let reported=false;ctx.window.ActivityAutosave.connect('test',{capture:()=>({items:[]}),restore:()=>{throw Error('fixture')},onRestoreError:()=>reported=true});events.pagehide();assert.equal(memory.get('letseigo.app.test'),saved);assert(reported);
console.log('PASS: partial Restore rollback, retry retention, save inhibition and startup snapshot protection.');
// Clear can fail before mutation, midway, or after mutation during capture.
for(const modeName of ['learn','play'])for(const point of ['before','partial','after','capture']){
 let active=modeName,state={learn:[1,2],play:[3,4]},failAt=point,postClear=false,flushed=0;
 const original=JSON.stringify(state),other=modeName==='learn'?'play':'learn';
 const r=context.window.BuilderReset.connect({button,mode:()=>active,
  capture:()=>{if(postClear&&failAt==='capture'){failAt=null;throw Error('capture')}return state[active]},
  hasCreation:v=>v.length>0,clear:()=>{
   if(failAt==='before'){failAt=null;throw Error('before')}
   state[active].pop();if(failAt==='partial'){failAt=null;throw Error('partial')}
   state[active]=[];postClear=true;if(failAt==='after'){failAt=null;throw Error('after')}
  },restore:(v,key)=>{state[key]=v},after:()=>flushed++});
 r.press();assert.equal(label.textContent,'Restore',point);assert.equal(r.canSave(),false);assert.equal(flushed,0);
 r.refresh();assert.equal(label.textContent,'Restore','partial render cannot invalidate recovery');
 active=other;r.press();r.press();assert.equal(r.canSave(),false,'other-mode recovery cannot unblock failed mode');
 active=modeName;r.refresh();r.press();assert.equal(r.canSave(),true);assert.equal(JSON.stringify(state),original);
 r.press();assert.equal(label.textContent,'Restore');r.press();assert.equal(JSON.stringify(state),original,'later Reset and Restore work');
}
// A failed retry must retain the original snapshot, not the partially restored data.
{
 let state=[1,2],fails=2;
 const r=context.window.BuilderReset.connect({button,mode:()=> 'play',capture:()=>state,hasCreation:()=>true,
 clear:()=>{state=[];throw Error('clear')},restore:v=>{state=[99];if(fails--)throw Error('retry');state=v}});
 r.press();r.press();r.refresh();r.press();r.press();assert.equal(JSON.stringify(state),'[1,2]');assert(r.canSave());
}
console.log('PASS: clear fault stages, both modes, cross-mode save blocking, retry and original recovery retention.');

// Real autosave gate: synchronous flush, queued save and pagehide cannot write partial state.
{
 let state=[1,2],r,session,queued;const store=new Map(),events={};
 const c={window:{addEventListener:(n,f)=>events[n]=f},document:{querySelector:()=>button,addEventListener(){}},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},console:{error(){}},setTimeout:f=>{queued=f},clearTimeout(){}};
 vm.runInNewContext(fs.readFileSync('shared/autosave.js','utf8'),c);
 vm.runInNewContext(fs.readFileSync('shared/builder-autosave.js','utf8'),c);
 session=c.window.ActivityAutosave.connect('failure',{capture:()=>state,restore:v=>{state=v},canSave:()=>r?.canSave()!==false});
 session.flush();const original=store.get('letseigo.app.failure');
 r=c.window.BuilderReset.connect({button,mode:()=> 'play',capture:()=>state,hasCreation:()=>true,clear:()=>{state=[];session.flush();throw Error('clear')},restore:v=>{state=v},after:session.flush});
 r.press();events.pagehide();session.flush();assert.equal(store.get('letseigo.app.failure'),original);
 r.press();assert(r.canSave());assert.equal(store.get('letseigo.app.failure'),original);
}
console.log('PASS: actual autosave preserves persisted data during and after a failed clear.');
