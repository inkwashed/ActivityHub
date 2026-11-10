/* Data/behavior regression checks in a mock DOM; not visual/device evidence. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element {
 constructor(){this.children=[];this.dataset={};this.attrs={};this.style={setProperty(){}};this.listeners={};this.classList={toggle(){}};this.value='';this.nodes={}}
 set innerHTML(v){this.html=v;this.children=[]}get innerHTML(){return this.html}
 append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n)}}add(n){this.append(n);if(this.children.length===1)this.value=n.value}
 replaceChildren(){this.children=[]}get lastElementChild(){return this.children.at(-1)}
 remove(){this.parent.children.splice(this.parent.children.indexOf(this),1)}setAttribute(k,v){this.attrs[k]=v}addEventListener(k,v){this.listeners[k]=v}
 querySelector(s){if(s==='.learn-color-hit')return this.children.find(x=>x.className==='learn-color-hit')||null;return this.nodes[s] ||= new Element()}querySelectorAll(s){return s==='.piece'?this.children.filter(x=>x.className==='piece'):s==='.learn-color-hit'?this.children.flatMap(x=>x.children.filter(y=>y.className==='learn-color-hit')):[]}
 getBoundingClientRect(){return {left:0,top:0,width:500,height:500}}
}
const ids=['advanced-mode','pieces','sauce-options','topping-options','clear','sentence','supplies-scene','announcement','case-art','case-select','color-target','item-color','free-tools','piece-picker','free-mode','piece-picker-wrap','free-info-dialog','free-info','free-info-close','free-info-title','mode-help-text'];
const elements=Object.fromEntries(ids.map(id=>['#'+id,new Element()]));elements['.builder-play-area']=new Element();elements['.color-row']=new Element();
const root={querySelector:s=>elements[s],querySelectorAll:()=>[],classList:{toggle(){}}};
const ready=[];let adapter;
const context=vm.createContext({Option:class extends Element{constructor(text,value){super();this.textContent=text;this.value=value}},window:{PieceGestures:class{bindSurface(){}bind(){}cancel(){}},BuilderPhoto(){},ActivityAutosave:{connect(id,a){assert.equal(id,'class-supplies');adapter=a}}},document:{querySelector:s=>s==='#builder'?root:elements[s],getElementById:()=>null,querySelectorAll:()=>[],createElement:()=>new Element(),addEventListener:(name,fn)=>{if(name==='DOMContentLoaded')ready.push(fn)}}});
for(const file of ['apps/class-supplies/config.js','shared/builder.js','shared/creative-builder.js','apps/class-supplies/app.js','apps/class-supplies/sharing.js','shared/builder-autosave.js','apps/class-supplies/saving.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
ready.forEach(fn=>fn());const b=context.window.suppliesBuilder;
for(const item of b.config.toppings)assert.equal(item.size,item.creativeSize*item.defaultScale);
const colorButtons=elements['#item-color'].children;assert.equal(colorButtons.length,10);
b.advancedMode=true;b.updateSentence();elements['#case-select'].listeners.click();colorButtons[0].listeners.click();assert.equal(b.palette().case,'red');assert.equal(colorButtons[0].attrs['aria-pressed'],'true');assert.equal(colorButtons.filter(x=>x.attrs['aria-pressed']==='true').length,1);
assert.match(elements['#sentence'].textContent,/a red pencil case/);assert.equal(elements['.color-row'].hidden,false);b.advancedMode=false;b.updateSentence();assert.equal(elements['.color-row'].hidden,false);
assert.equal(b.buttons.size,12);assert.equal(elements['#sentence'].textContent,'I have a pencil case.');
b.chooseTopping('eraser');assert.match(elements['#sentence'].textContent,/an eraser/);b.chooseTopping('eraser');assert.equal(b.state.toppings.eraser,0);
b.chooseTopping('pencil');const penHit=b.groups.get('pencil').children[0].querySelector('.learn-color-hit');penHit.listeners.click({stopPropagation(){}});assert.equal(elements['#color-target'].value,'pencil');assert.equal(b.state.toppings.pencil,1);elements['#case-select'].listeners.click();assert.equal(elements['#color-target'].value,'case');
b.palette().pencil='purple';b.refreshColors();const learn=b.state;
b.advancedMode=true;b.creative.switchMode(true);assert.equal(b.creative.items.length,0);b.chooseTopping('pen');assert.equal(b.creative.items.at(-1).scale,1.3);b.creative.edit('duplicate');b.creative.edit('right');b.creative.edit('flip');colorButtons[3].listeners.click();assert.equal(b.creative.items[0].color,'blue');assert.equal(b.creative.items[1].color,'green');assert.match(elements['#sentence'].textContent,/a blue pen and a green pen/);
assert.equal(b.creative.items.length,2);assert.equal(b.creative.items[1].rotate,105);assert.equal(b.creative.items[1].flip,true);
const saved=JSON.parse(JSON.stringify(adapter.capture()));b.clear();assert.equal(b.creative.items.length,0);b.creative.switchMode(false);assert.equal(b.state,learn);assert.equal(b.state.toppings.pencil,1);assert.equal(b.palette().pencil,'purple');
adapter.restore(saved);assert.equal(b.creative.active,true);assert.equal(b.creative.items.length,2);assert.equal(b.creative.items[1].rotate,105);assert.equal(b.creative.items[1].color,'green');
const svg=context.window.renderSupplies(b);assert.match(svg,/rotate\(105\) scale\(-1 1\)/);assert.match(svg,/#75a481/);assert.match(svg,/width="900" height="900"/);assert.match(svg,/desk-grain/);
elements['.builder-play-area'].getBoundingClientRect=()=>({left:-250,top:0,width:1000,height:500});const wide=context.window.renderSupplies(b);assert.match(wide,/viewBox="-5 -5 110 110"/);
elements['.builder-play-area'].getBoundingClientRect=()=>({left:0,top:-250,width:500,height:1000});const tall=context.window.renderSupplies(b);assert.match(tall,/viewBox="-5 -5 110 110"/);assert.match(svg,/stroke-width="2.2"/);
b.clear();const cleared=JSON.parse(JSON.stringify(adapter.capture()));adapter.restore(cleared);assert.equal(b.creative.items.length,0);b.creative.switchMode(false);assert.equal(b.state.toppings.pencil,1);
adapter.restore({learn:{toppings:{pencil:99,unknown:1}},items:[{topping:'unknown'}],palettes:{learn:{pencil:'<bad>'}}});assert.equal(b.creative.items.length,0);assert.equal(b.state.toppings.unknown,undefined);assert.notEqual(b.palette().pencil,'<bad>');
b.clear();
for(const item of b.config.toppings){b.chooseTopping(item.id);b.chooseTopping(item.id);assert.equal(b.state.toppings[item.id],0)}
console.log('PASS: supply toggles, articles, independent modes/colors, PLAY transforms, export art, restore/reset and invalid data.');

b.creative.select(null);b.creative.clearFromBackground({button:0,target:{closest:()=>null}});assert.equal(elements['#color-target'].value,'');assert.ok(colorButtons.every(button=>button.disabled));

let audioAttempts=0;
context.window.BuilderPronunciation=class{constructor(){audioAttempts++;throw new Error('Device audio unavailable')}};
b.pronunciation=null;
for(let i=0;i<3;i++)b.updateSentence();
assert.equal(audioAttempts,1);assert.match(elements['#sentence'].textContent,/I have/);
console.log('PASS: Class Supplies uses shared audio fallback without repeated initialization.');

// Selecting a different question must stop queued audio even when inventory is unchanged.
const question=new Element();elements['[data-pronunciation-question]']=question;
let stopped=0;
b.pronunciation={available:false,stop(){stopped++},recording:text=>text!=='Do you have a …?'};
b.creative.active=false;b.state.toppings.pencil=1;b.state.toppings.eraser=1;
elements['#color-target'].value='pencil';b.refreshColorSelection();
assert.equal(question.textContent,'Do you have a pencil?');assert.equal(question.disabled,false);
const beforeSelection=stopped;b.refreshColorSelection();assert.equal(stopped,beforeSelection);
elements['#color-target'].value='eraser';b.refreshColorSelection();
assert.equal(question.textContent,'Do you have an eraser?');assert.equal(stopped,beforeSelection+1);
elements['#color-target'].value='';b.refreshColorSelection();
assert.equal(question.textContent,'Do you have a …?');assert.equal(question.disabled,true);assert.equal(stopped,beforeSelection+2);
console.log('PASS: question selection changes cancel queued audio; unchanged questions do not.');

for(const play of [false,true]){
 b.creative.switchMode(play);b.clear();b.resetRecovery.refresh();b.chooseTopping('pen');
 if(play){b.creative.items[0].color='brown';b.creative.items[0].rotate=105;b.creative.items[0].flip=true;}
 b.palette().case='pink';const before=JSON.parse(JSON.stringify(adapter.capture()));
 b.resetRecovery.press();b.creative.switchMode(!play);b.resetRecovery.refresh();b.creative.switchMode(play);b.resetRecovery.refresh();b.resetRecovery.press();
 const after=JSON.parse(JSON.stringify(adapter.capture()));
 assert.deepEqual(after.palettes,before.palettes);assert.equal(after.play,play);
 if(play)assert.deepEqual(after.items.map(({id,...item})=>item),before.items.map(({id,...item})=>item));else assert.deepEqual(after.learn,before.learn);
 b.resetRecovery.press();b.chooseTopping('pencil');b.resetRecovery.refresh();
 const comparable=()=>{const value=JSON.parse(JSON.stringify(adapter.capture()));value.selected=value.items.findIndex(x=>x.id===value.selected);value.items.forEach(x=>delete x.id);return JSON.stringify(value)};const current=comparable();b.resetRecovery.press();b.resetRecovery.press();assert.equal(comparable(),current);
}
for(const play of [false,true])for(const point of ['before','after']){
 b.creative.switchMode(play);b.clear();b.resetRecovery.refresh();b.chooseTopping('pen');
 const before=JSON.parse(JSON.stringify(adapter.capture())),clear=b.clear;
 b.clear=function(){if(point==='after')clear.call(this);throw Error('injected clear')};
 b.resetRecovery.press();b.clear=clear;
 assert.equal(adapter.canSave(),false);b.resetRecovery.refresh();b.resetRecovery.press();assert.equal(adapter.canSave(),true);
 const after=JSON.parse(JSON.stringify(adapter.capture()));
 if(play)assert.deepEqual(after.items.map(({id,...x})=>x),before.items.map(({id,...x})=>x));else assert.deepEqual(after.learn,before.learn);
}
console.log('PASS: Class Supplies whole-creation recovery in both modes, per-item colors/transforms, palettes and new-item invalidation.');

// Prototype exports the full editable extent without bringing toolbar markup.
b.exportFrame=()=>({left:-30,top:-12,side:160});
const expandedPhoto=context.window.renderSupplies(b);
assert.match(expandedPhoto,/viewBox="-30 -12 160 160"/);
assert.match(expandedPhoto,/<clipPath id="desk-frame"><rect x="-30" y="-12" width="160" height="160"/);
assert(!expandedPhoto.includes('free-tools'));
delete b.exportFrame;
console.log('PASS: prototype expanded export frame and clipping exclude toolbar.');
// Independent difficulty uses one language policy and survives both mode switches
// and the same adapter used by reload/Restore. Existing builders remain opt-out.
for(const play of [false,true])for(const hard of [false,true]){
 b.creative.switchMode(play);elements['#advanced-mode'].checked=hard;elements['#advanced-mode'].listeners.change();
 assert.equal(b.advancedMode,hard);assert.equal(elements['#advanced-mode'].disabled,false);
 const captured=adapter.capture();assert.equal(captured.hard,hard);
 b.creative.switchMode(!play);assert.equal(b.advancedMode,hard);b.creative.switchMode(play);
 adapter.restore(JSON.parse(JSON.stringify(captured)));assert.equal(b.advancedMode,hard);assert.equal(b.creative.active,play);
 assert.equal(elements['.color-row'].hidden,false);
}
b.creative.switchMode(true);b.clear();b.chooseTopping('pen');b.creative.items[0].color='red';b.chooseTopping('pen');b.creative.items[1].color='blue';
elements['#advanced-mode'].checked=false;elements['#advanced-mode'].listeners.change();assert.match(elements['#sentence'].textContent,/2 pens/);assert.doesNotMatch(elements['#sentence'].textContent,/red|blue/);
elements['#advanced-mode'].checked=true;elements['#advanced-mode'].listeners.change();assert.match(elements['#sentence'].textContent,/a red pen and a blue pen/);
const toggle=b.creative.difficulty;b.creative.difficulty=null;b.creative.switchMode(false);b.creative.switchMode(true);b.creative.difficulty=toggle;
console.log('PASS: all four build/difficulty combinations, language grouping, autosave round trips and optional difficulty control.');

for(const play of [false,true])for(const hard of [false,true]){
 b.creative.switchMode(play);b.advancedMode=hard;b.clear();b.resetRecovery.refresh();b.chooseTopping('pen');
 b.resetRecovery.press();b.creative.switchMode(!play);b.advancedMode=!hard;b.chooseTopping('pencil');
 b.creative.switchMode(play);b.resetRecovery.refresh();b.resetRecovery.press();
 assert.equal(b.advancedMode,!hard,'Supplies Restore keeps current difficulty');
 assert(play?b.creative.items.some(x=>x.topping==='pen'):b.state.toppings.pen);
 b.resetRecovery.press();b.chooseTopping('marker');b.resetRecovery.refresh();
}
