const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const memory=new Map(),events={},docEvents={};let pending;
const context={window:{addEventListener:(k,f)=>events[k]=f},document:{addEventListener:(k,f)=>docEvents[k]=f},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},setTimeout:f=>(pending=f,1),clearTimeout:()=>{}};
vm.runInNewContext(fs.readFileSync('shared/autosave.js','utf8'),context);
let value={n:1},restored;
context.window.ActivityAutosave.connect('one',{capture:()=>value,restore:x=>restored=x});
value={n:2};docEvents.pointerup();pending();assert.equal(JSON.parse(memory.get('letseigo.app.one')).value.n,2);
context.window.ActivityAutosave.connect('one',{capture:()=>value,restore:x=>restored=x});assert.equal(restored.n,2);
value={n:0};events.pagehide();assert.equal(JSON.parse(memory.get('letseigo.app.one')).value.n,0);
memory.set('letseigo.app.bad','broken JSON');assert.doesNotThrow(()=>context.window.ActivityAutosave.connect('bad',{capture:()=>({}),restore:()=>assert.fail()}));
memory.set('letseigo.app.future',JSON.stringify({version:99,value:{}}));assert.equal(context.window.ActivityAutosave.read('letseigo.app.future',1),null);
context.localStorage.setItem=()=>{throw Error('blocked')};assert.doesNotThrow(()=>events.pagehide());
console.log('PASS: local autosave debounce, reload, reset, pagehide, corrupt/versioned data, and blocked storage.');
// Exercise restoration against the actual builders/editor using their existing mock fixtures.
for(const [file,name] of [['tests/check-creative.cjs','pizza'],['tests/check-parfait-creative.cjs','parfait']]){
 let source=fs.readFileSync(file,'utf8');
 const extra=`
 context.document.getElementById=()=>null;
 vm.runInContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
 const autoBuilder=context.window.${name}Builder;
 if(autoBuilder.creative.active)autoBuilder.creative.switchMode(false);
 const autoAdapter=context.window.BuilderAutosave.adapter(autoBuilder);
 autoBuilder.creative.switchMode(true);autoBuilder.creative.add(autoBuilder.config.toppings[0].id);
 const autoPiece=autoBuilder.creative.items.at(-1);autoPiece.x=43;autoPiece.y=44;autoPiece.rotate=30;autoPiece.flip=true;
 const autoSaved=JSON.parse(JSON.stringify(autoAdapter.capture()));
 autoBuilder.clear();autoBuilder.creative.switchMode(false);autoBuilder.clear();
 autoAdapter.restore(autoSaved);
 assert.equal(autoBuilder.creative.active,true);
 assert.equal(autoBuilder.creative.items.length,autoSaved.items.length);
 assert.equal(autoBuilder.creative.items.at(-1).rotate,30);
 assert.equal(autoBuilder.creative.items.at(-1).flip,true);
 assert.equal(autoBuilder.creative.items.at(-1).x,43);
 assert.equal(autoBuilder.creative.items.at(-1).y,44);
 autoBuilder.creative.switchMode(false);
 assert.equal(JSON.stringify(autoBuilder.state),JSON.stringify(autoSaved.learn));
 autoBuilder.clear();const cleared=JSON.parse(JSON.stringify(autoAdapter.capture()));autoAdapter.restore(cleared);
 assert.equal(autoBuilder.creative.active,false);
 assert.equal(JSON.stringify(autoBuilder.state),JSON.stringify(cleared.learn));
 console.log('PASS: ${name} LEARN/PLAY autosave round trip, transforms, mode, and reset.');
 `;
 const end=source.lastIndexOf('`,{require,console});');assert(end>=0);
 source=source.slice(0,end)+extra+source.slice(end);
 vm.runInNewContext(source,{require,console});
}
vm.runInNewContext(fs.readFileSync('tests/check-sandwich.cjs','utf8')+`
context.document.getElementById=()=>null;
vm.runInContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
const auto=context.window.BuilderAutosave.adapter(b);
b.activeSlot=1;b.chooseTopping('banana');b.state.slots[1].source='Ecuador';b.advancedMode=true;
const saved=JSON.parse(JSON.stringify(auto.capture()));b.clear();auto.restore(saved);
assert.equal(b.state.slots[1].source,'Ecuador');assert.equal(b.activeSlot,1);assert.equal(b.advancedMode,true);
saved.learn.slots[1].source='not a source';auto.restore(saved);assert.equal(b.state.slots[1].source,null);
console.log('PASS: Sandwich slots, sources, difficulty and validation.');
`,{require,console});
vm.runInNewContext(fs.readFileSync('tests/check-builder-lab.cjs','utf8')+`
context.document.getElementById=id=>elements['#'+id];
elements['#example-choice'].options=[{value:'a plate'},{value:'a picnic tray'}];elements['#sentence-example'].options=[{value:'live'},{value:'stress'}];
vm.runInContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
const auto=context.window.BuilderAutosave.adapter(b);b.slots.choose('tomato');b.slots.active=2;b.slots.choose('onion');elements['#example-choice'].value='a picnic tray';
const saved=JSON.parse(JSON.stringify(auto.capture()));b.clear();auto.restore(saved);
assert.equal(b.slots.items[2].id,'onion');assert.equal(b.slots.active,2);assert.equal(elements['#example-choice'].value,'a picnic tray');
console.log('PASS: Lab slots and dropdown restore.');
`,{require,console});
// Profile Pic adapter uses only configured parts/colors and restores its tab.
{
 class El{constructor(){this.children=[];this.dataset={};this.style={};this.listeners={}}append(...x){this.children.push(...x)}setAttribute(){}addEventListener(k,f){this.listeners[k]=f}querySelectorAll(){return []}focus(){}}
 const nodes=Object.fromEntries(['tabs','panels','portrait','announcement','clear'].map(k=>['#'+k,new El()]));let adapter,photo;
 const ctx={window:{ActivityHubI18n:{t:x=>x},renderAvatar:s=>JSON.stringify(s),ActivityAutosave:{connect:(id,a)=>adapter=a},BuilderPhoto:x=>photo=x},document:{querySelector:id=>nodes[id],createElement:()=>new El()}};
 vm.runInNewContext(fs.readFileSync('apps/avatar/config.js','utf8'),ctx);
 vm.runInNewContext(fs.readFileSync('apps/avatar/app.js','utf8'),ctx);
 const saved={state:{...ctx.window.AvatarConfig.defaults,hair:'curly',skin:ctx.window.AvatarConfig.palettes.skin[2]},active:'colors'};
 adapter.restore(saved);assert.equal(photo.builder().hair,'curly');assert.equal(adapter.capture().active,'colors');
 nodes['#clear'].listeners.click();assert.equal(adapter.capture().state.hair,ctx.window.AvatarConfig.defaults.hair);
 adapter.restore({state:{hair:'invalid',skin:'bad'},active:'bad'});assert.equal(adapter.capture().active,'face');assert.equal(adapter.capture().state.skin,ctx.window.AvatarConfig.defaults.skin);
 console.log('PASS: Profile Pic appearance, tab, reset, and invalid choices.');
}
