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
const elements=Object.fromEntries(['#swap-fruit','#clear-slot','#layer-conversation','#base-options','#ice-cream','#drizzle','#advanced-mode','#pieces','#sauce-options','#topping-options','#clear','#sauce','#sentence','#parfait','#announcement'].map(id=>[id,new Element()]));
const slots=[new Element(),new Element()];slots.forEach((b,i)=>b.dataset.layerSlot=String(i));
const clears=[new Element(),new Element()];clears.forEach((b,i)=>b.dataset.clearSlot=String(i));
Element.prototype.focus=function(){};
const root={querySelector:s=>elements[s],querySelectorAll:s=>s==='[data-clear-slot]'?clears:s==='[data-layer-slot]'?slots:s==='[data-sauce]'?elements['#sauce-options'].children:[]};
let frames=new Map(), frameId=0, reduce=false;
const context={requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId},cancelAnimationFrame:id=>frames.delete(id),window:{matchMedia:()=>({matches:reduce})},document:{querySelector:s=>s==='#builder'?root:elements[s],createElement:()=>new Element()}};
vm.createContext(context);
for(const file of ['apps/parfait/config.js','shared/builder.js','shared/layer-builder.js','apps/parfait/builder.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const app=context.window.parfaitBuilder;


assert.equal(app.state.layers.length,1);
assert.equal(app.config.layerLayout.rows[0].y,39);
assert.equal(app.config.layerLayout.pieceSize,21);
assert.equal(app.config.toppings.find(x=>x.id==='melons').layerSize,34.5);
assert.equal(app.activeSlot,0);
app.chooseTopping('bananas');app.chooseTopping('apples');
assert.equal(app.activeSlot,0);assert.equal(app.state.layers[0][0],'apples');assert.equal(app.state.layers[0][1],null);
slots[1].listeners.click();app.chooseTopping('cherries');app.chooseTopping('strawberries');
assert.equal(app.activeSlot,1);assert.equal(app.state.layers[0][0],'apples');
slots[0].listeners.click();app.chooseTopping('peaches');app.chooseTopping('apples');
assert.equal(app.activeSlot,0);assert.equal(app.state.layers[0][1],'strawberries');
assert.equal(app.groups.get('apples').children.length,3);
assert.equal(app.groups.get('strawberries').children.length,3);
const depth=piece=>Number(piece.style.cssText.match(/z-index:(\d+)/)[1]);
assert.deepEqual(app.groups.get('apples').children.map(depth),[1,3,5]);
assert.deepEqual(app.groups.get('strawberries').children.map(depth),[2,4,6]);
assert.equal(elements['#sentence'].textContent,'I want apples and strawberries\nwith no syrup.');
elements['#swap-fruit'].listeners.click();assert.equal(app.state.layers[0][0],'strawberries');assert.equal(app.state.layers[0][1],'apples');elements['#swap-fruit'].listeners.click();
app.goLayer(1);assert.equal(app.activeLayer,0);
app.advancedMode=true;app.updateSentence();assert.equal(elements['#layer-conversation'].hidden,true);assert(elements['#layer-conversation'].textContent.endsWith('B: OK!'));
app.activeSlot=0;app.chooseTopping('strawberries');
assert.equal(app.groups.get('strawberries').children.length,6);
assert.equal(app.groups.get('apples').children.length,0);
assert.equal(clears[0].hidden,false);clears[0].listeners.click();assert.equal(app.state.layers[0][0],null);assert.equal(clears[0].hidden,true);assert.equal(app.state.layers[0][1],'strawberries');assert.equal(app.activeSlot,0);
app.setBase('mint');app.setSauce('chocolate');assert(elements['#sentence'].textContent.includes('mint chocolate chip ice cream'));
assert(elements['#sentence'].textContent.endsWith('with chocolate syrup.'));
assert.equal((elements['#ice-cream'].html.match(/class="scoop-syrup"/g)||[]).length,2);
assert.equal(elements['#drizzle'].html,'');
assert.equal((elements['#ice-cream'].html.match(/class="ice-scoop /g)||[]).length,2);
app.clear();assert(app.state.layers.every(row=>row.every(value=>value===null)));
assert.equal(elements['#sentence'].textContent,'I want ….');assert.equal(app.state.base,null);assert.equal(app.state.sauce,null);
assert.equal(elements['#ice-cream'].html,'');assert.equal(elements['#drizzle'].html,'');
console.log('PASS: paired layers, repeated fruit, mixed-row counts, summary, editing, mode preservation, ice cream/syrup, and reset.');
