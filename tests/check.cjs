const fs=require('fs'),vm=require('vm'),assert=require('assert');
class Element {
 constructor(){this.children=[];this.dataset={};this.attrs={};this.style={setProperty(){}};this.dots=[];this.listeners={};this.classList={toggle(){}};}
 set innerHTML(v){this.html=v;if(v.includes('class="dots"'))this.dots=[new Element(),new Element(),new Element()];}
 append(child){child.parent=this;this.children.push(child)}
 get lastElementChild(){return this.children.at(-1)}
 remove(){this.parent.children.splice(this.parent.children.indexOf(this),1)}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,v){this.listeners[k]=v}
 querySelector(s){return this.reveal ||= new Element()}
 querySelectorAll(s){return s==='.dots i'?this.dots:[]}
}
const elements=Object.fromEntries(['#advanced-mode','#pieces','#sauce-options','#topping-options','#clear','#sauce','#sentence','#pizza','#announcement'].map(id=>[id,new Element()]));
const root={querySelector:s=>elements[s],querySelectorAll:s=>s==='[data-sauce]'?elements['#sauce-options'].children:[]};
let frames=new Map(), frameId=0, reduce=false;
const context={requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId},cancelAnimationFrame:id=>frames.delete(id),window:{matchMedia:()=>({matches:reduce})},document:{querySelector:s=>s==='#builder'?root:elements[s],createElement:()=>new Element()}};
vm.createContext(context);
for(const file of ['config.js','builder.js'])vm.runInContext(fs.readFileSync('apps/pizza/'+file,'utf8'),context);
const app=context.window.pizzaBuilder;
const expectedOrder=['cheese','pepperoni','sausage','tomatoes','green-peppers','mushrooms','onions','pineapples','corn'];
assert.deepEqual(Array.from(app.config.toppings,x=>x.id),expectedOrder);
assert.deepEqual(Array.from(app.buttons.keys()),expectedOrder);
expectedOrder.forEach((id,i)=>assert.equal(app.groups.get(id).style.zIndex,i+1));
[...expectedOrder].reverse().forEach(id=>app.setLevel(id,1));
expectedOrder.forEach((id,i)=>assert.equal(app.groups.get(id).style.zIndex,i+1));
app.clear();
assert.equal(app.config.toppings.length,9);assert(app.config.toppings.some(x=>x.id==='sausage'));assert(app.config.toppings.some(x=>x.id==='pepperoni'));assert.equal(app.state.sauce,null);assert.equal(elements['#sauce'].hidden,true);assert.equal(app.config.toppings[0].id,'cheese');
for(const item of app.config.toppings){
 const button=app.buttons.get(item.id),group=app.groups.get(item.id);
 button.listeners.click();assert.equal(group.children.length,item.counts[1]);
 const first=group.children.slice(),styles=first.map(x=>x.style.cssText);
 button.listeners.click();assert.equal(group.children.length,item.counts[2]);
 first.forEach((x,i)=>{assert.equal(group.children[i],x);assert.equal(x.style.cssText,styles[i])});
 button.listeners.click();assert.equal(group.children.length,item.counts[3]);
 button.listeners.click();assert.equal(group.children.length,0);
 for(const p of app.placements(item))assert(Math.hypot(p.x-50,p.y-50)<=37);
}
for(const sauce of app.config.sauces){app.setSauce(sauce.id);assert.equal(app.state.sauce,sauce.id);assert.equal(elements['#sauce-options'].children.filter(x=>x.attrs['aria-pressed']==='true').length,1)}
app.setSauce('tomato');assert.equal(elements['#sauce'].hidden,false);assert(elements['#sauce'].html.includes('sauce-reveal'));
const surface=elements['#sauce'];
const step=t=>{const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(t))};
step(0);assert.equal(surface.reveal.attrs['stroke-width'],'0');
step(200);const early=surface.reveal.attrs.d;assert(early.startsWith('M50.00 50.00 L'));assert.equal((early.match(/M/g)||[]).length,1);
step(900);assert(surface.reveal.attrs.d.startsWith(early));
step(1900);assert.equal(surface.reveal.attrs['stroke-width'],'19');assert.equal(frames.size,0);
app.setSauce('bbq');assert.equal(frames.size,1);
app.setSauce('none');assert.equal(frames.size,0);assert.equal(elements['#sauce'].hidden,true);
reduce=true;app.setSauce('alfredo');assert.equal(frames.size,0);assert.equal(surface.reveal.attrs['stroke-width'],'19');reduce=false;
app.setSauce('none');assert.equal(elements['#sauce'].hidden,true);app.setLevel('cheese',1);assert.equal(elements['#sentence'].textContent,'I want cheese with no sauce.');
for(const item of app.config.toppings)app.setLevel(item.id,3);
app.clear();assert.equal(app.state.sauce,null);assert([...app.groups.values()].every(x=>x.children.length===0));assert.equal(elements['#sentence'].textContent,'I want …. '.trim());
console.log('PASS: continuous spiral progression, animation cancellation, reduced motion, all nine topping cycles, cumulative counts, preserved piece identity and placement, boundary limits, sauce selection, and full reset.');

const toggle=elements['#advanced-mode'];
const sentence=()=>elements['#sentence'].textContent;
const advanced=value=>{toggle.checked=value;toggle.listeners.change()};
for(const sauce of app.config.sauces){
 app.clear();app.setSauce(sauce.id);assert.equal(sentence(),`I want a pizza with ${sauce.label}.`);
 app.setLevel('pepperoni',1);assert.equal(sentence(),`I want pepperoni with ${sauce.label}.`);
 advanced(true);assert.equal(sentence(),`I want a little bit of pepperoni with ${sauce.label}.`);
 app.setLevel('pepperoni',3);assert.equal(sentence(),`I want a lot of pepperoni with ${sauce.label}.`);
 app.setLevel('pepperoni',2);assert.equal(sentence(),`I want some pepperoni with ${sauce.label}.`);
 for(const level of [1,2,3]){
  for(const item of app.config.toppings)app.setLevel(item.id,level);
  assert.equal(sentence(),`I want ${['','a little bit of','some of','a lot of'][level]} everything with ${sauce.label}.`);
 }
 advanced(false);assert.equal(sentence(),`I want everything with ${sauce.label}.`);
 app.setLevel('cheese',1);assert.equal(sentence(),`I want everything with ${sauce.label}.`);
 advanced(true);assert(!sentence().includes('everything'));assert(sentence().includes('a little bit of cheese'));
 app.setLevel('corn',0);assert(!sentence().includes('everything'));
 advanced(false);
}
app.clear();app.setLevel('pepperoni',1);advanced(true);assert.equal(sentence(),'I want a little bit of pepperoni.');
const before=app.groups.get('pepperoni').children[0];advanced(false);assert.equal(app.groups.get('pepperoni').children[0],before);
advanced(true);app.clear();assert.equal(app.advancedMode,true);assert.equal(sentence(),'I want ….');
console.log('PASS: basic/advanced sentences, all sauce options, uniform and mixed everything cases, partial selections, live toggle without moving toppings, and mode preserved after clear.');

app.clear();advanced(true);
for(const id of ['pepperoni','sausage','mushrooms'])app.setLevel(id,1);
for(const id of ['green-peppers','corn'])app.setLevel(id,2);
for(const id of ['cheese','tomatoes','pineapples'])app.setLevel(id,3);
assert.equal(sentence(),'I want a little bit of pepperoni, sausage, and mushrooms, some green peppers and corn, and a lot of cheese, tomatoes, and pineapples.');
app.setSauce('tomato');assert(sentence().endsWith('with tomato sauce.'));
app.clear();app.setLevel('cheese',1);app.setLevel('corn',1);assert.equal(sentence(),'I want a little bit of cheese and corn.');
app.setLevel('corn',3);assert.equal(sentence(),'I want a little bit of cheese and a lot of corn.');
app.setLevel('cheese',0);assert.equal(sentence(),'I want a lot of corn.');
app.setLevel('corn',2);assert.equal(sentence(),'I want some corn.');
advanced(false);assert.equal(sentence(),'I want corn.');
console.log('PASS: grouped amounts, list punctuation, empty groups, sauce suffix, and unchanged Basic Mode.');
