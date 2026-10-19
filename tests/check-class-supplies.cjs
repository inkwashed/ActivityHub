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
for(const file of ['apps/class-supplies/config.js','shared/builder.js','shared/creative-builder.js','apps/class-supplies/app.js','shared/builder-autosave.js','apps/class-supplies/saving.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
ready.forEach(fn=>fn());const b=context.window.suppliesBuilder;
for(const item of b.config.toppings)assert.equal(item.size,item.creativeSize*item.defaultScale);
const colorButtons=elements['#item-color'].children;assert.equal(colorButtons.length,10);
b.advancedMode=true;b.updateSentence();colorButtons[0].listeners.click();assert.equal(b.palette().case,'red');assert.equal(colorButtons[0].attrs['aria-pressed'],'true');assert.equal(colorButtons.filter(x=>x.attrs['aria-pressed']==='true').length,1);
assert.match(elements['#sentence'].textContent,/a red pencil case/);assert.equal(elements['.color-row'].hidden,false);b.advancedMode=false;b.updateSentence();assert.equal(elements['.color-row'].hidden,true);
assert.equal(b.buttons.size,12);assert.equal(elements['#sentence'].textContent,'I have a pencil case.');
b.chooseTopping('eraser');assert.match(elements['#sentence'].textContent,/an eraser/);b.chooseTopping('eraser');assert.equal(b.state.toppings.eraser,0);
b.chooseTopping('pencil');const penHit=b.groups.get('pencil').children[0].querySelector('.learn-color-hit');penHit.listeners.click({stopPropagation(){}});assert.equal(elements['#color-target'].value,'pencil');assert.equal(b.state.toppings.pencil,1);elements['#case-select'].listeners.click();assert.equal(elements['#color-target'].value,'case');
b.palette().pencil='purple';b.refreshColors();const learn=b.state;
b.creative.switchMode(true);assert.equal(b.creative.items.length,0);b.chooseTopping('pen');assert.equal(b.creative.items.at(-1).scale,1.3);b.creative.edit('duplicate');b.creative.edit('right');b.creative.edit('flip');colorButtons[3].listeners.click();assert.equal(b.creative.items[0].color,'blue');assert.equal(b.creative.items[1].color,'green');assert.match(elements['#sentence'].textContent,/1 blue pen and 1 green pen/);
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
