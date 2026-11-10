const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
// Exercise the real adapters against each engine's existing fixture.
for(const [file,name,nested] of [['check-creative.cjs','pizza',true],['check-parfait-creative.cjs','parfait',true],['check-sandwich.cjs','sandwich',false],['check-builder-lab.cjs','lab',false]]){
 let source=fs.readFileSync('tests/'+file,'utf8').replace('b.creative=null;','const retainedEditor=b.creative;b.creative=null;');
 const extra=`
 {
 context.document.getElementById=id=>elements['#'+id]||null;
 for(const id of ['example-choice','sentence-example'])if(elements['#'+id])elements['#'+id].options=[{value:'a plate'},{value:'live'}];
 vm.runInContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
 const rb=context.window.${name}Builder;
 if(!rb.creative)rb.creative=retainedEditor;
 if(rb.creative.active)rb.creative.switchMode(false);
 const storage=context.window.BuilderAutosave.adapter(rb);
 const label={dataset:{},textContent:''},button={querySelector:()=>label,addEventListener(){}};
 const previousQuery=context.document.querySelector;context.document.querySelector=s=>s==='#clear'?button:previousQuery(s);
 let writes=0;const recovery=context.window.BuilderReset.install(rb,storage,()=>writes++);rb.resetRecovery=recovery;
 const semantic=()=>{const r=JSON.parse(JSON.stringify(storage.capture()));r.items=r.items.map(({id,...x})=>x);delete r.selected;return r};
 for(const play of [false,true])for(const initialHard of [false,true]){
  rb.creative.switchMode(play);rb.advancedMode=initialHard;rb.clear();recovery.refresh();
  if(play){rb.creative.add(rb.config.toppings[0].id);rb.creative.add(rb.config.toppings[1].id);const item=rb.creative.items[0];item.rotate=30;item.flip=true;rb.creative.select(item.id);rb.creative.edit('top');}
  else if(rb.slots)rb.slots.choose(rb.config.toppings[0].id);
  else if(rb.chooseTopping)rb.chooseTopping(rb.config.toppings[0].id);
  else rb.setLevel(rb.config.toppings[0].id,1,false);
  if(rb.config.sourcesByType){const type=rb.config.toppings[0];rb.state.origins={[type.id]:type.sources[0]};rb.updateSentence();}
  recovery.refresh();const before=semantic();const selected=rb.creative.items.find(x=>x.id===rb.creative.selected)?.topping;
  recovery.press();assert.equal(label.textContent,'Restore');
  rb.clear();recovery.refresh();assert.equal(label.textContent,'Restore','empty reset cannot destroy recovery');
  rb.creative.switchMode(!play);recovery.refresh();assert.equal(label.textContent,'Reset');
  if(!play)rb.creative.add(rb.config.toppings[1].id);
  else if(rb.slots)rb.slots.choose(rb.config.toppings[1].id);
  else if(rb.chooseTopping)rb.chooseTopping(rb.config.toppings[1].id);
  else rb.setLevel(rb.config.toppings[1].id,1,false);
  rb.advancedMode=!initialHard;const otherMode=semantic();
  rb.creative.switchMode(play);recovery.refresh();assert.equal(label.textContent,'Restore');
  const difficultyAtRestore=rb.advancedMode;recovery.press();assert.equal(label.textContent,'Reset');
  const after=semantic();
  assert.equal(rb.advancedMode,rb.config.independentDifficulty?difficultyAtRestore:play?false:before.hard,"Restore follows independent difficulty policy");
  assert.equal(JSON.stringify(play?after.learn:after.items),JSON.stringify(play?otherMode.learn:otherMode.items),'other mode edits survive Restore');
  assert.equal(JSON.stringify(play?after.items:after.learn),JSON.stringify(play?before.items:before.learn));
  if(play)assert.equal(rb.creative.items.find(x=>x.id===rb.creative.selected)?.topping,selected);
  else {if(before.activeSlot!==undefined)assert.equal(after.activeSlot,before.activeSlot);assert.equal(JSON.stringify(after.slots),JSON.stringify(before.slots));}
  recovery.press();assert.equal(label.textContent,'Restore');
  if(play)rb.creative.add(rb.config.toppings[1].id);
  else if(rb.slots)rb.slots.choose(rb.config.toppings[1].id);
  else if(rb.chooseTopping)rb.chooseTopping(rb.config.toppings[1].id);
  else rb.setLevel(rb.config.toppings[1].id,1,false);
  recovery.refresh();assert.equal(label.textContent,'Reset','adding starts a new creation');
 }
 // Exercise failures in actual app clear paths, including sentence/render hooks.
 for(const play of [false,true])for(const point of ['before','render','after']){
  rb.creative.switchMode(play);rb.clear();recovery.refresh();
  if(play)rb.creative.add(rb.config.toppings[0].id);
  else if(rb.slots)rb.slots.choose(rb.config.toppings[0].id);
  else if(rb.chooseTopping)rb.chooseTopping(rb.config.toppings[0].id);
  else rb.setLevel(rb.config.toppings[0].id,1,false);
  recovery.refresh();const original=semantic(),clear=rb.clear,sentence=rb.updateSentence;
  rb.clear=function(){if(point==='before')throw Error('injected before clear');clear.call(this);if(point==='after')throw Error('injected after clear')};
  if(point==='render')rb.updateSentence=function(){throw Error('injected render')};
  recovery.press();rb.clear=clear;rb.updateSentence=sentence;
  assert.equal(label.textContent,'Restore');assert.equal(storage.canSave(),false);
  recovery.refresh();recovery.press();assert.equal(storage.canSave(),true);
  assert.equal(JSON.stringify(play?semantic().items:semantic().learn),JSON.stringify(play?original.items:original.learn));
 }
 rb.creative.switchMode(true);rb.clear();recovery.refresh();
 rb.creative.add(rb.config.toppings[0].id);
 for(let i=1;i<125;i++)rb.creative.items.push({...rb.creative.items[0],id:i+1});
 recovery.press();recovery.press();assert.equal(rb.creative.items.length,125,'temporary recovery retains every item beyond persisted-save cap');
 assert(writes>=6);console.log('PASS: ${name} Reset/Restore, mode isolation, empty protection, new item and autosave flush.');
 }
 `;
 if(nested){const end=source.lastIndexOf('`,{require,console});');source=source.slice(0,end)+extra+source.slice(end);}else source+=extra;
 vm.runInNewContext(source,{require,console});
}
