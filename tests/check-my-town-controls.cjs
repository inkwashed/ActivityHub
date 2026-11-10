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
vm.createContext(context);for(const f of ['apps/mytown/model.js','apps/mytown/art.js','shared/builder-autosave.js','apps/mytown/app.js'])vm.runInContext(fs.readFileSync(f,'utf8'),context);
get('#blocks').children[0].onclick();get('#place-options').children[0].onclick();assert.match(get('#sentence').textContent,/house/);
const reset=()=>get('#clear').listeners.click({preventDefault(){},stopImmediatePropagation(){}});
const original=stored;reset();assert(!get('#sentence').textContent.includes('house'));reset();assert.equal(stored,original);
get('#route-mode').onchange({target:{checked:true}});assert.equal(get('#nodes').children[17].attrs['aria-current'],'location');
lang='ja';get('#route-mode').onchange({target:{checked:true}});assert.match(get('#nodes').children[17].attrs['aria-label'],/交差点/);
get('#mode-info').onclick();assert(get('#mode-help').open);get('#mode-help-close').onclick();assert(get('#mode-info').focused);
// Fail after the state mutation but during rendering; persisted town must survive.
get('#route-mode').onchange({target:{checked:false}});
const map=context.window.TownArt.map;context.window.TownArt.map=()=>{throw Error('render failure')};const prior=stored;
reset();assert.equal(session.canSave(),false);assert.equal(stored,prior);assert(get('#announcement').textContent.includes('Restore'));
context.window.TownArt.map=map;reset();assert.equal(session.canSave(),true);assert.equal(stored,prior);
console.log('PASS: actual My Town controls, local recovery/save guard, render failure retry, current-node language and help focus return.');
