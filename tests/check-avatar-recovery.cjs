/* Real persistence/recovery/autosave code; injected rendering/storage failures. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function fixture(saved){
 const memory=new Map(saved?[['letseigo.app.avatar',JSON.stringify({version:1,value:saved})]]:[]),events={},span={dataset:{}},messages=[];
 let current,fail=0,writeFails=false,mutateBeforeFailure=true;
 const button={querySelector:()=>span,addEventListener(){}};
 const context={window:{addEventListener:(e,f)=>events[e]=f},document:{addEventListener(){},querySelector:()=>button},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>{if(writeFails)throw Error('storage unavailable');memory.set(k,v)}},console:{error(){}},setTimeout,clearTimeout,queueMicrotask};
 vm.createContext(context);
 for(const file of ['config.js','../../shared/autosave.js','../../shared/builder-autosave.js','persistence.js'])vm.runInContext(fs.readFileSync('apps/avatar/'+file,'utf8'),context);
 const defaults={...context.window.AvatarConfig.defaults};current={state:{...defaults},active:'face'};
 const connect=()=>context.window.AvatarPersistence({capture:()=>current,apply:value=>{if(mutateBeforeFailure)current=value;if(fail-->0)throw Error('render failure');current=value},categories:['face','eyes','hair','clothes','design'],announce:t=>messages.push(t)});
 return {connect,defaults,memory,events,messages,span,get current(){return current},set current(v){current=v},fail:n=>fail=n,writeFail:v=>writeFails=v,beforeFailure:v=>mutateBeforeFailure=v};
}
const f=fixture(),session=f.connect(),r=session.recovery;
f.current.state.face='slim';f.current.state.hairColor='#123456';session.flush();const original=f.memory.get('letseigo.app.avatar');
r.press();assert.equal(f.span.textContent,'Restore');assert.equal(f.current.state.face,'classic');assert.equal(JSON.parse(f.memory.get('letseigo.app.avatar')).value.state.face,'classic');
f.current.active='hair';r.refresh();assert.equal(f.span.textContent,'Restore','tab change retains snapshot');r.press();assert.equal(f.current.state.face,'slim');assert.equal(f.current.active,'hair');assert.equal(f.current.state.hairColor,'#123456');assert.equal(f.messages.at(-1),'Avatar restored.');
r.press();f.current.state.face='round';r.refresh();assert.equal(f.span.textContent,'Reset','new creation discards snapshot');
r.press();r.press();assert.equal(f.current.state.face,'round');
// Clear/render failures before and after mutation; repeated restore failures and pagehide.
for(const partial of [false,true]){
 f.beforeFailure(partial);session.flush();const persisted=f.memory.get('letseigo.app.avatar');f.fail(1);r.press();assert.equal(r.canSave(),false);assert.equal(f.span.textContent,'Restore');assert.equal(f.current.state.face,'round','rollback restores previous avatar');
 f.events.pagehide();assert.equal(f.memory.get('letseigo.app.avatar'),persisted);
 f.current.state.face='slim';r.refresh();assert.equal(f.span.textContent,'Restore','failed recovery survives later changes');
 f.fail(2);r.press();assert.equal(r.canSave(),false,'failed restore and rollback protect storage');f.events.pagehide();assert.equal(f.memory.get('letseigo.app.avatar'),persisted);
 f.fail(0);r.press();assert.equal(r.canSave(),true);assert.equal(f.current.state.face,'round');
}
// Failed storage writes leave persisted avatar intact and later flush retries the actual state.
f.writeFail(true);const before=f.memory.get('letseigo.app.avatar');r.press();assert.equal(f.memory.get('letseigo.app.avatar'),before);assert.equal(f.span.textContent,'Restore');r.press();assert.equal(f.current.state.face,'round');f.writeFail(false);session.flush();assert.equal(JSON.parse(f.memory.get('letseigo.app.avatar')).value.state.face,'round');
// Default reset creates no pointless recovery, reload does not resurrect transient snapshots.
const empty=fixture(),e=empty.connect();e.recovery.press();assert.equal(empty.span.textContent,'Reset');
const old={state:{...f.defaults,clothes:'none',hairColor:'#abcdef'},active:'mouth'},legacy=fixture(old);legacy.connect();assert.equal(legacy.current.state.clothes,'tee');assert.equal(legacy.current.active,'eyes');assert.equal(legacy.current.state.hairColor,'#abcdef');
const broken=fixture(JSON.parse(original).value),record=broken.memory.get('letseigo.app.avatar');broken.fail(1);const b=broken.connect();b.flush();broken.events.pagehide();assert.equal(broken.memory.get('letseigo.app.avatar'),record);assert.match(broken.messages.at(-1),/Reload/);
const reload=fixture(JSON.parse(record).value);reload.connect();assert.equal(reload.current.state.face,'slim');assert.equal(reload.span.textContent,'Reset');
console.log('PASS: avatar normal recovery, tab independence, edit invalidation, failures/rollback/retry/pagehide, blocked storage, legacy saves and reload protection.');
