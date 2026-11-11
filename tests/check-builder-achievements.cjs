const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const data=new Map(),events=[];let fail=false;
const window={dispatchEvent:event=>events.push(event.type),ActivityAutosave:{read:key=>data.get(key),write:(key,version,value)=>{if(fail)return false;data.set(key,JSON.parse(JSON.stringify(value)));return true;}}};
vm.runInNewContext(fs.readFileSync('shared/achievements.js','utf8'),{window,Event:class{constructor(type){this.type=type;}}});const a=window.ActivityAchievements;
const empty=()=>({learn:{toppings:{cheese:0}},play:false,items:[]});
for(const badge of a.builderBadges){
 let state=badge.id==='my-town'?{blocks:[null,null]}:empty();
 const adapter=a.builderAdapter(badge.id,{capture:()=>state,restore:raw=>{state=raw;}});
 adapter.onSave(state);assert.equal(a.builderProgress(badge.id).count,0);
 state.selected=1;state.hard=true;adapter.onSave(state);assert.equal(a.builderProgress(badge.id).count,0);
 if(badge.id==='my-town')state.blocks[0]='house';else state.learn.toppings.cheese=1;
 adapter.onSave(state);assert.equal(a.builderProgress(badge.id).count,1);
 state=badge.id==='my-town'?{blocks:[null,null]}:empty();adapter.onSave(state);assert.equal(a.builderProgress(badge.id).count,1);
 adapter.restore(badge.id==='my-town'?{blocks:['house',null]}:{learn:{toppings:{cheese:1}},play:false,items:[]});adapter.onSave(state);assert.equal(a.builderProgress(badge.id).count,1);
}
assert.equal(a.recordBuilder('builder-lab'),false);assert.equal(a.recordBuilder('pizza',NaN),false);
const ledger=data.get(a.key);const start=ledger.builders.pizza.lastSession;
assert.equal(a.recordBuilder('pizza',start+1799999),false);assert.equal(a.recordBuilder('pizza',start+1800000),true);
for(let i=3;i<=20;i++){a.recordBuilder('pizza',start+(i-1)*1800000);assert.equal(a.builderProgress('pizza').rank.id,i<5?'green':i<10?'bronze':i<15?'silver':i<20?'gold':'diamond');}
a.recordBlog({id:'lesson',mode:'free'},{fields:{body:'x'.repeat(100)}});assert.equal(a.builderProgress('pizza').count,20);assert.equal(a.blogProgress().count,1);
fail=true;assert.equal(a.recordBuilder('pizza',start+21*1800000),false);assert.equal(a.builderProgress('pizza').count,20);fail=false;
// Restoration establishes the baseline; a later edit to PLAY earns a new family badge.
data.clear();let state={learn:{toppings:{}},play:false,items:[]};const adapter=a.builderAdapter('pizza',{capture:()=>state,restore:raw=>{state=raw;}});
adapter.restore({learn:{toppings:{cheese:1}},play:false,items:[]});adapter.onSave(state);assert.equal(a.builderProgress('pizza').count,0);
state.play=true;adapter.onSave(state);assert.equal(a.builderProgress('pizza').count,0);
state.items.push({id:1,topping:'cheese',x:50,y:50});fail=true;adapter.onSave(state);assert.equal(a.builderProgress('pizza').count,0);fail=false;adapter.onSave(state);assert.equal(a.builderProgress('pizza').count,1);
console.log('Builder badges: five families, meaningful edits, passive restore, settings, reset persistence, cooldown, thresholds, mixed ledger and failed-write retry passed.');
