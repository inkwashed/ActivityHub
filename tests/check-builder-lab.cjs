const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
class Element{
 constructor(){this.children=[];this.dataset={};this.attrs={};this.style={setProperty(){}};this.listeners={};this.classList={toggle(){}};this.dots=[]}
 set innerHTML(v){this.html=v;this.children=[];if(v.includes('class="dots"'))this.dots=Array.from({length:3},()=>new Element())}
 append(...nodes){nodes.forEach(n=>{n.parent=this;this.children.push(n)})}replaceChildren(){this.children=[]}get lastElementChild(){return this.children.at(-1)}
 remove(){this.parent.children.splice(this.parent.children.indexOf(this),1)}setAttribute(k,v){this.attrs[k]=v}addEventListener(k,v){this.listeners[k]=v}focus(){}showModal(){this.open=true}close(){this.open=false}
 querySelector(){return this.child||=new Element()}querySelectorAll(s){return s==='.dots i'?this.dots:s==='button'?this.children:[]}
}
const ids=['advanced-mode','pieces','sauce-options','topping-options','clear','sentence','lab-scene','announcement','example-choice','slot-pieces','sentence-example','lab-slots','slot-options','free-tools','piece-picker','free-mode','piece-picker-wrap','free-info-dialog','free-info','free-info-close','free-info-title','mode-help-text','sample-share','share','sample-caption','close-share'];
const elements=Object.fromEntries(ids.map(x=>['#'+x,new Element()]));elements['#example-choice'].value='a plate';elements['#sentence-example'].value='live';
const root={querySelector:s=>elements[s],querySelectorAll:()=>[],classList:{toggle(){}}};
const context=vm.createContext({window:{PieceGestures:class{bindSurface(){}bind(){}cancel(){}}},document:{querySelector:s=>s==='#builder'?root:elements[s],querySelectorAll:()=>[],createElement:()=>new Element(),addEventListener(){}}});
for(const file of ['apps/sandwich/config.js','shared/builder.js','shared/creative-builder.js','shared/builder-slots.js','_dev/builder/lab.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const b=context.window.labBuilder;
assert.equal(b.buttons.size,16);assert.equal(elements['#slot-options'].children.length,4);
b.slots.choose('tomato');b.slots.choose('lettuce');assert.equal(b.slots.items[0].id,'lettuce');assert.equal(b.slots.active,0);
b.slots.active=1;b.slots.choose('onion');b.slots.items[1].source='test';b.slots.swap(0);assert.equal(b.slots.items[0].source,'test');assert.equal(b.slots.active,0);
b.slots.controls[0].clear.listeners.click();assert.equal(b.slots.items[0],null);
for(let i=1;i<=4;i++){b.buttons.get('tomato').listeners.click();assert.equal(b.state.toppings.tomato,i%4)}
b.buttons.get('cheese').listeners.click();const learn=b.state;b.creative.switchMode(true);b.buttons.get('tomato').listeners.click();b.creative.edit('duplicate');assert.equal(b.creative.items.length,2);b.clear();assert.equal(b.creative.items.length,0);b.creative.switchMode(false);assert.equal(b.state,learn);assert.equal(b.state.toppings.cheese,1);
elements['#sentence-example'].value='stress';b.updateSentence();assert(elements['#sentence'].textContent.length>400);elements['#sentence-example'].value='live';b.clear();assert.equal(b.slots.active,0);assert(b.slots.items.every(x=>x===null));assert.equal(elements['#sentence'].textContent,'I want ….');
elements['#share'].listeners.click();assert(elements['#sample-share'].open);elements['#close-share'].listeners.click();assert(!elements['#sample-share'].open);
const pager=new Element(),prev=new Element(),next=new Element(),status=new Element();pager.dataset.pageSize='4';pager.querySelector=s=>({'[data-choice-list]':elements['#topping-options'],'[data-choice-previous]':prev,'[data-choice-next]':next,'[data-choice-status]':status}[s]);context.document.querySelectorAll=()=>[pager];vm.runInContext(fs.readFileSync('shared/choice-pager.js','utf8'),context);
assert.equal(elements['#topping-options'].children.filter(x=>!x.hidden).length,4);next.listeners.click();assert.equal(status.textContent,'2 / 4');elements['#topping-options'].choicePager.setExpanded(true);assert.equal(elements['#topping-options'].children.filter(x=>!x.hidden).length,16);
console.log('PASS: lab slots/metadata swaps, quantity cycle, four-across paging, PLAY editing/reset isolation, output fixtures and sample Share.');
