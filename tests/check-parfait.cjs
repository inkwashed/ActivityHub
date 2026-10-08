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
const elements=Object.fromEntries(['#layer-number','#layer-previous','#layer-next','#clear-slot','#layer-conversation','#base-options','#ice-cream','#drizzle','#advanced-mode','#pieces','#sauce-options','#topping-options','#clear','#sauce','#sentence','#parfait','#announcement'].map(id=>[id,new Element()]));
const slots=[new Element(),new Element()];slots.forEach((b,i)=>b.dataset.layerSlot=String(i));
const root={querySelector:s=>elements[s],querySelectorAll:s=>s==='[data-layer-slot]'?slots:s==='[data-sauce]'?elements['#sauce-options'].children:[]};
let frames=new Map(), frameId=0, reduce=false;
const context={requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId},cancelAnimationFrame:id=>frames.delete(id),window:{matchMedia:()=>({matches:reduce})},document:{querySelector:s=>s==='#builder'?root:elements[s],createElement:()=>new Element()}};
vm.createContext(context);
for(const file of ['apps/parfait/config.js','shared/builder.js','shared/layer-builder.js','apps/parfait/builder.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const app=context.window.parfaitBuilder;


assert.equal(app.state.layers.length,4);
assert.equal(app.buttons.size,9);
app.chooseTopping('strawberries');assert.equal(app.activeSlot,1);
app.chooseTopping('strawberries');
assert.equal(elements['#sentence'].textContent,'I want strawberries\nwith no syrup.');
assert.equal(app.groups.get('strawberries').children.length,6);
app.goLayer(1);app.chooseTopping('apples');app.chooseTopping('bananas');
assert.equal(app.groups.get('apples').children.length,3);
assert.equal(app.groups.get('bananas').children.length,3);
app.goLayer(1);app.chooseTopping('peaches');app.chooseTopping('peaches');
app.goLayer(1);app.chooseTopping('cherries');app.chooseTopping('melons');
assert.equal(elements['#sentence'].textContent,'I want strawberries,\napples and bananas,\npeaches,\ncherries and melons\nwith no syrup.');
const saved=JSON.stringify(app.state.layers);
app.advancedMode=true;app.updateSentence();assert.equal(JSON.stringify(app.state.layers),saved);
assert.equal(elements['#layer-conversation'].hidden,false);
app.goLayer(-1);assert(elements['#layer-conversation'].textContent.includes('What do you want?')||elements['#layer-conversation'].textContent.includes('OK, next?'));
app.activeSlot=0;app.chooseTopping('apples');assert.equal(app.state.layers[2][0],'apples');
assert.equal(app.state.layers[1][0],'apples');
app.setBase('mint');app.setSauce('chocolate');assert(elements['#sentence'].textContent.includes('mint chocolate chip ice cream'));
assert(elements['#sentence'].textContent.endsWith('with chocolate syrup.'));
assert.equal((elements['#ice-cream'].html.match(/class="ice-scoop /g)||[]).length,2);
app.clear();assert(app.state.layers.every(row=>row.every(value=>value===null)));
assert.equal(elements['#sentence'].textContent,'I want ….');assert.equal(app.state.base,null);assert.equal(app.state.sauce,null);
assert.equal(elements['#ice-cream'].html,'');assert.equal(elements['#drizzle'].html,'');
console.log('PASS: paired layers, repeated fruit, mixed-row counts, summary, editing, mode preservation, ice cream/syrup, and reset.');
