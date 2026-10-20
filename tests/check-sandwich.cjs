const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
 constructor(){this.children=[];this.dataset={};this.style={setProperty(){}};this.attrs={};this.listeners={};this.classList={toggle(){}};}
 append(...children){this.children.push(...children);} replaceChildren(){this.children=[];}
 setAttribute(k,v){this.attrs[k]=v;} addEventListener(k,v){this.listeners[k]=v;} focus(){}
 set innerHTML(value){this.html=value;this.children=[];}
 querySelector(){return new Element();} querySelectorAll(){return [];}
}
const elements=Object.fromEntries(['#slots','#source-choice','#source-section','#source-label','#source-sentence','#advanced-mode','#pieces','#sauce-options','#topping-options','#clear','#sentence','#sandwich','#announcement'].map(id=>[id,new Element()]));
const root={querySelector:s=>elements[s],querySelectorAll:()=>[]};
const context=vm.createContext({window:{},document:{querySelector:s=>s==='#builder'?root:elements[s],createElement:()=>new Element(),addEventListener(){}}});
for(const file of ['apps/sandwich/config.js','shared/builder.js','apps/sandwich/model.js','apps/sandwich/builder.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const b=context.window.sandwichBuilder;
assert.equal(b.config.toppings.length,16);
assert.equal(b.state.slots.length,3);
for(const [i,id] of ['bacon','lettuce','tomato'].entries()){b.activeSlot=i;b.chooseTopping(id);}
assert.equal(elements['#sentence'].textContent,'My sandwich is a BLT. B is for bacon. L is for lettuce. T is for tomato.');
assert.deepEqual(Array.from(elements['#source-choice'].children,x=>x.value),['','Kumamoto','Hokkaido','Aichi']);
elements['#source-choice'].listeners.change({target:{value:'Kumamoto'}});
assert.equal(elements['#source-sentence'].textContent,'');
assert.ok(!elements['#sentence'].textContent.includes('from'));
elements['#advanced-mode'].listeners.change();
b.advancedMode=true;b.updateSentence();
assert.equal(elements['#sentence'].textContent,"My sandwich is a BLT. B is for bacon. It's from …. L is for lettuce. It's from …. T is for tomato. It's from Kumamoto.");
b.advancedMode=false;b.updateSentence();
elements['#source-choice'].listeners.change({target:{value:'Italy'}});assert.equal(elements['#source-sentence'].textContent,'');
b.chooseTopping('banana');assert.equal(b.state.slots[2].source,null);
assert.deepEqual(Array.from(elements['#source-choice'].children,x=>x.value),['','the Philippines','Ecuador','Mexico']);
b.activeSlot=0;b.chooseTopping('apple');assert.match(elements['#sentence'].textContent,/My sandwich is an ALB/);
b.clear();assert.equal(elements['#sentence'].textContent,'My sandwich is ….');assert.equal(elements['#source-section'].hidden,true);
const svg=context.window.SandwichLesson.svg([{topping:'bacon'}],b.config);assert.match(svg,/<svg/);assert.ok(!svg.includes('NaN'));
console.log('PASS: 16 PDF ingredients, three editable slots, BLT/initials, source options and validation, replacement/reset, export SVG.');
for(const id of ['#free-tools','#piece-picker','#free-mode','#piece-picker-wrap','#free-info-dialog','#free-info','#free-info-close','#free-info-title','#mode-help-text'])elements[id]=new Element();
root.classList={toggle(){}};
Element.prototype.remove=function(){};
context.window.PieceGestures=class{bindSurface(){}bind(){}cancel(){}};
vm.runInContext(fs.readFileSync('shared/creative-builder.js','utf8'),context);
vm.runInContext(fs.readFileSync('apps/sandwich/creative.js','utf8'),context);
b.chooseTopping('bacon');const learn=b.state;
b.creative.switchMode(true);b.chooseTopping('tomato');
assert.equal(b.selectedPiece().topping,'tomato');
elements['#source-choice'].listeners.change({target:{value:'Aichi'}});
assert.equal(b.selectedPiece().source,undefined);assert.equal(elements['#source-section'].hidden,true);
b.creative.edit('duplicate');assert.equal(b.selectedPiece().source,undefined);assert.equal(elements['#source-section'].hidden,true);
b.chooseTopping('lettuce');assert.equal(b.selectedPiece().topping,'lettuce');
assert.equal(elements['#source-section'].hidden,true);assert.equal(elements['#source-sentence'].textContent,'');
b.creative.edit('delete');assert.equal(b.selectedPiece().topping,'tomato');
b.creative.switchMode(false);assert.equal(b.state,learn);assert.equal(b.state.slots[0].topping,'bacon');
b.creative.switchMode(true);assert.equal(b.creative.items.length,2);b.clear();assert.equal(b.creative.items.length,0);assert.equal(elements['#source-section'].hidden,true);
b.creative.switchMode(false);assert.equal(b.state.slots[0].topping,'bacon');
console.log('PASS: PLAY hides/ignores source selection, duplication, deletion fallback, independent mode state/reset.');

// Returning from PLAY restores the selected LEARN difficulty.
b.advancedMode=true;b.updateSentence();b.creative.switchMode(true);
assert.equal(b.advancedMode,false);assert.equal(elements['#advanced-mode'].disabled,true);
b.creative.switchMode(false);assert.equal(b.advancedMode,true);assert.equal(elements['#advanced-mode'].disabled,false);
console.log('PASS: EASY omits locations, HARD interleaves sources, missing-source prompt, PLAY difficulty restoration.');

b.creative.switchMode(true);b.creative.add('bread');
assert.equal(b.selectedPiece().topping,'bread');assert.equal(elements['#source-section'].hidden,true);
assert.ok(!elements['#sentence'].textContent.includes('B is for bread'));
const breadPhoto=context.window.SandwichLesson.svg(b.creative.orderedItems(),b.config,true);
assert.ok(!breadPhoto.includes('NaN'));assert.ok(breadPhoto.includes('translate(0 45)'));
b.creative.edit('duplicate');assert.equal(b.creative.items.length,2);b.clear();assert.equal(b.creative.items.length,0);
console.log('PASS: editable PLAY bread, export inclusion, no source/initial, duplicate and reset.');

const filling=[{topping:'bacon'},{topping:'lettuce'},{topping:'tomato'}];
const before=JSON.stringify(filling),lesson=context.window.SandwichLesson;
const live=lesson.svg(filling,b.config),photo=lesson.svg(filling,b.config,false,true);
assert.ok(live.includes('translate(50 30)'));assert.ok(photo.includes('translate(50 46)'));
assert.ok(!live.includes('picnic-background'));assert.ok(photo.includes('picnic-background'));
assert.equal(JSON.stringify(filling),before);
const placed=[{topping:'tomato',x:26,y:38,scale:1.3,rotate:25,flip:true}];
for(const svg of [lesson.svg(placed,b.config,true),lesson.svg(placed,b.config,true,true)])assert.ok(svg.includes('translate(26 38) rotate(25) scale(-1 1)'));
console.log('PASS: photo-only LEARN compression, picnic backdrop, immutable state and unchanged PLAY transforms.');

b.creative.switchMode(false);b.clear();
assert.ok(b.swapControls.every(button=>button.disabled));
b.chooseTopping('bacon');b.state.slots[0].source='Italy';
b.activeSlot=1;b.chooseTopping('tomato');b.state.slots[1].source='Aichi';
b.swapSlots(0);
assert.equal(b.activeSlot,0);
assert.equal(b.state.slots[0].topping,'tomato');assert.equal(b.state.slots[0].source,'Aichi');
assert.equal(b.state.slots[1].topping,'bacon');assert.equal(b.state.slots[1].source,'Italy');
b.swapSlots(1);assert.equal(b.state.slots[1],null);assert.equal(b.state.slots[2].source,'Italy');
assert.equal(b.activeSlot,0);
console.log('PASS: adjacent swaps preserve sources, follow selection, support empty slots and disable identical pairs.');

// Live mode changes preserve the bread coordinate system; only Share compacts it.
const learnBase=lesson.svg([],b.config),playBase=lesson.svg([],b.config,true);
for(const rendered of [learnBase,playBase,lesson.svg(filling,b.config)]){
 assert.ok(!rendered.includes('translate(5 10) scale(.9)'));
 assert.ok(rendered.includes(lesson.bread(70)));
 assert.ok(!rendered.includes('cx="50" cy="83" rx="44" ry="8"'));
}
assert.ok(lesson.svg(filling,b.config).includes(lesson.bread(13)));
assert.ok(photo.includes('translate(5 10) scale(.9)'));
console.log('PASS: identical live bread scale across modes, safe top bread and separate Share framing.');

let failedAudioAttempts=0;
context.window.BuilderPronunciation=class{constructor(){failedAudioAttempts++;throw new Error('Unavailable voice service')}};
b.creative=null;b.pronunciation=null;
for(let i=0;i<4;i++)b.clear();
assert.equal(failedAudioAttempts,1);
assert.ok(elements['#sentence'].textContent);
assert.ok(elements['#pieces'].html.includes('<svg'));
console.log('PASS: audio setup failure preserves sentence/artwork and is not retried by Reset.');
