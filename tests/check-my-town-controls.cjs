const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class El{
 constructor(){this.children=[];this.style={setProperty(){}};this.attrs={};this.dataset={};this.classList={toggle(){},remove(){}};this.listeners={};this.textContent='';}
 append(x){this.children.push(x)}setAttribute(k,v){this.attrs[k]=v}removeAttribute(k){delete this.attrs[k]}addEventListener(k,f){this.listeners[k]=f}querySelector(){return null}showModal(){this.open=true}close(){this.open=false;this.listeners.close?.()}focus(){this.focused=true}
}
const els=new Map(),get=s=>{if(!els.has(s))els.set(s,new El());return els.get(s)};
let lang='en',writes=0,stored,session;
const context={window:{addEventListener(){},ActivityHubI18n:{t:s=>lang==='ja'?({'Street':'交差点','North side of tracks':'線路の北側','Empty block':'空き区画'}[s]||s):s}},document:{querySelector:get,createElement:()=>new El(),addEventListener(){},body:new El()},console:{error(){}},queueMicrotask:f=>f()};
context.window.FoodBuilder={prototype:{setSentence(text){get('#sentence').textContent=text}}};context.window.BuilderPhoto=()=>{};
context.window.ActivityAutosave={connect(id,adapter){session=adapter;return {flush(){if(adapter.canSave()){stored=JSON.stringify(adapter.capture());writes++}}}}};
vm.createContext(context);for(const f of ['apps/my-town/model.js','apps/my-town/art.js','shared/builder-autosave.js','apps/my-town/app.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context);
assert.equal(get('#blocks').children[0].attrs['aria-pressed'],'true');
assert.equal(get('#place-options').children[0].disabled,false);
get('#place-options').children[0].onclick();assert.equal(JSON.parse(stored).blocks[0],'house');assert.match(get('#sentence').textContent,/house/);
assert.equal(get('#blocks').children[1].attrs['aria-pressed'],'true');
get('#blocks').children[0].onclick();
const reset=()=>get('#clear').listeners.click({preventDefault(){},stopImmediatePropagation(){}});
assert.equal(get('#town-tools').hidden,false);assert.equal(get('#remove').disabled,false);
const original=stored;reset();assert(!get('#sentence').textContent.includes('house'));reset();assert.equal(stored,original);
get('#route-mode').onchange({target:{checked:true}});assert.equal(get('#nodes').children[17].attrs['aria-current'],'location');assert.equal(get('#town-tools').hidden,true);
lang='ja';get('#route-mode').onchange({target:{checked:true}});assert.match(get('#nodes').children[17].attrs['aria-label'],/交差点/);
get('#mode-info').onclick();assert(get('#mode-help').open);get('#mode-help-close').onclick();assert(get('#mode-info').focused);
// Fail after the state mutation but during rendering; persisted town must survive.
get('#route-mode').onchange({target:{checked:false}});
const map=context.window.TownArt.map;context.window.TownArt.map=()=>{throw Error('render failure')};const prior=stored;
reset();assert.equal(session.canSave(),false);assert.equal(stored,prior);assert(get('#announcement').textContent.includes('Restore'));
context.window.TownArt.map=map;reset();assert.equal(session.canSave(),true);assert.equal(stored,prior);
console.log('PASS: actual My Town controls, local recovery/save guard, render failure retry, current-node language and help focus return.');

// Duplicate scans the entire map in row-major order, including gaps before selection.
get('#blocks').children[5].onclick();get('#place-options').children[0].onclick();get('#blocks').children[5].onclick();
get('#duplicate').onclick();assert.equal(JSON.parse(stored).blocks[1],'house');assert.equal(get('#blocks').children[1].attrs['aria-pressed'],'true');
get('#blocks').children[0].onclick();get('#remove').onclick();get('#blocks').children[5].onclick();get('#duplicate').onclick();assert.equal(JSON.parse(stored).blocks[0],'house');
while(!get('#duplicate').disabled)get('#duplicate').onclick();
assert.equal(JSON.parse(stored).blocks.filter(Boolean).length,12);const full=stored;get('#duplicate').onclick();assert.equal(stored,full);
get('#remove').onclick();assert.equal(get('#blocks').children[10].attrs['aria-pressed'],'true','delete selects previous landmark');
get('#blocks').children[0].onclick();assert.equal(get('#duplicate').disabled,false,'space available again');
get('#duplicate').onclick();assert.equal(JSON.parse(stored).blocks.filter(Boolean).length,12);
console.log('PASS: duplicate fills earliest gap, selects copy, disables on full/empty selection, and re-enables after deletion.');

// Directional moves reuse the map's swap operation and follow the moved landmark.
get('#blocks').children[0].onclick();get('#place-options').children[1].onclick();get('#blocks').children[0].onclick();
assert.equal(get('#move-up').disabled,true);assert.equal(get('#move-left').disabled,true);
get('#move-right').onclick();assert.equal(JSON.parse(stored).blocks[1],'park');assert.equal(JSON.parse(stored).blocks[0],'house');assert.equal(get('#blocks').children[1].attrs['aria-pressed'],'true');
get('#move-down').onclick();assert.equal(JSON.parse(stored).blocks[5],'park');assert.equal(get('#blocks').children[5].attrs['aria-pressed'],'true');
get('#blocks').children[6].onclick();get('#remove').onclick();assert.equal(get('#blocks').children[5].attrs['aria-pressed'],'true');
get('#blocks').children[5].onclick();get('#move-right').onclick();assert.equal(JSON.parse(stored).blocks[5],null);assert.equal(JSON.parse(stored).blocks[6],'park');
get('#move-down').onclick();get('#move-right').onclick();assert.equal(get('#blocks').children[11].attrs['aria-pressed'],'true');assert.equal(get('#move-down').disabled,true);assert.equal(get('#move-right').disabled,true);
const edge=stored;get('#move-right').onclick();assert.equal(stored,edge);
console.log('PASS: directional moves, occupied swaps, empty moves, selection following and edge guards.');

// Palette placement advances one block, including occupied blocks and row boundaries.
session.restore(context.window.TownModel.initial());get('#blocks').children[0].onclick();
for(let i=0;i<12;i++){
 get('#place-options').children[i].onclick();
 assert.equal(JSON.parse(stored).blocks[i],context.window.TownModel.places[i]);
 assert.equal(get('#blocks').children[Math.min(i+1,11)].attrs['aria-pressed'],'true');
}
get('#blocks').children[3].onclick();get('#place-options').children[0].onclick();
assert.equal(JSON.parse(stored).blocks[3],'house');assert.equal(get('#blocks').children[4].attrs['aria-pressed'],'true');
assert.equal(JSON.parse(stored).blocks[4],context.window.TownModel.places[4],'advance does not overwrite next block');
reset();reset();assert.equal(get('#blocks').children[4].attrs['aria-pressed'],'true','Restore retains advanced selection');
console.log('PASS: palette auto-advance across all rows, final-block stop, manual selection and Restore selection.');

// Delete walks backward over gaps without wrapping to later landmarks.
const deletionState=context.window.TownModel.initial();deletionState.blocks[1]='house';deletionState.blocks[6]='park';deletionState.blocks[9]='library';session.restore(deletionState);
get('#blocks').children[9].onclick();get('#remove').onclick();assert.equal(get('#blocks').children[6].attrs['aria-pressed'],'true');
get('#remove').onclick();assert.equal(get('#blocks').children[1].attrs['aria-pressed'],'true');
get('#remove').onclick();assert.equal(get('#blocks').children[1].attrs['aria-pressed'],'true');assert.equal(get('#remove').disabled,true);assert.equal(JSON.parse(stored).blocks.filter(Boolean).length,0);
console.log('PASS: deletion selects preceding occupied landmark, skips gaps and stops without wrapping.');

const keyState=context.window.TownModel.initial();keyState.blocks[0]='house';keyState.blocks[2]='park';session.restore(keyState);get('#blocks').children[2].onclick();
let prevented=false;const keyTarget={closest:s=>s==='[data-block]'?{}:null};
const key=(value,extra={})=>{prevented=false;get('#builder').listeners.keydown({key:value,target:keyTarget,preventDefault(){prevented=true},...extra})};
const beforeKeys=stored;
for(const extra of [{repeat:true},{ctrlKey:true},{metaKey:true},{altKey:true},{isComposing:true},{target:{isContentEditable:true}},{target:{closest:()=>({})}}]){key('Delete',extra);assert.equal(stored,beforeKeys);}
get('#route-mode').onchange({target:{checked:true}});key('Backspace');assert.equal(stored,beforeKeys);get('#route-mode').onchange({target:{checked:false}});
key('Delete');assert(prevented);assert.equal(JSON.parse(stored).blocks[2],null);assert.equal(get('#blocks').children[0].attrs['aria-pressed'],'true');assert(get('#blocks').children[0].focused);
key('Backspace');assert(prevented);assert.equal(JSON.parse(stored).blocks[0],null);key('Backspace');assert.equal(prevented,false);
console.log('PASS: Delete/Backspace parity, backward selection, keyboard focus, and repeat/editable/modifier/ROUTE safeguards.');
