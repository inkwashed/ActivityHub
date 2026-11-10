const fs=require('node:fs'),vm=require('node:vm');
let fixture=fs.readFileSync('tests/check-sandwich.cjs','utf8').replace('b.creative=null;','const savedEditor=b.creative;b.creative=null;');
fixture+=`
b.creative=savedEditor;
context.document.getElementById=id=>elements['#'+id]||null;
vm.runInContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
const store=context.window.BuilderAutosave.adapter(b);
for(const play of [false,true]){
 b.creative.switchMode(play);b.clear();b.chooseTopping('tomato');
 elements['#source-choice'].listeners.change({target:{value:play?'Aichi':'Kumamoto'}});
 if(play)b.creative.edit('duplicate');else {b.activeSlot=1;b.chooseTopping('tomato');}
 for(const hard of [false,true]){
  b.advancedMode=hard;b.updateSentence();const text=elements['#sentence'].textContent;
  assert.equal(text.includes('from'),hard);
  if(hard)assert(text.includes(play?'Aichi':'Kumamoto'));
  assert.equal((text.match(/T is for tomato/g)||[]).length,1);
  const snapshot=JSON.parse(JSON.stringify(store.capture()));store.restore(snapshot);
  assert.equal(b.creative.active,play);assert.equal(b.advancedMode,hard);assert.equal(elements['#sentence'].textContent,text);
 }
}
b.creative.switchMode(false);assert.equal(b.state.origins.tomato,'Kumamoto');
b.creative.switchMode(true);assert.equal(b.state.origins.tomato,'Aichi');
elements['#source-choice'].listeners.change({target:{value:''}});b.advancedMode=true;b.updateSentence();assert(elements['#sentence'].textContent.includes('from …'));
const raw=JSON.parse(JSON.stringify(store.capture()));raw.free.origins.tomato='not a configured source';store.restore(raw);assert.equal(b.state.origins.tomato,null);
console.log('PASS: Sandwich four combinations, duplicate origins, source validation, missing origins, reload and mode isolation.');
`;
vm.runInNewContext(fixture,{require,console});
