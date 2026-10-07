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
const elements=Object.fromEntries(['#base-options','#ice-cream','#drizzle','#advanced-mode','#pieces','#sauce-options','#topping-options','#clear','#sauce','#sentence','#parfait','#announcement'].map(id=>[id,new Element()]));
const root={querySelector:s=>elements[s],querySelectorAll:s=>s==='[data-sauce]'?elements['#sauce-options'].children:[]};
let frames=new Map(), frameId=0, reduce=false;
const context={requestAnimationFrame:fn=>{frames.set(++frameId,fn);return frameId},cancelAnimationFrame:id=>frames.delete(id),window:{matchMedia:()=>({matches:reduce})},document:{querySelector:s=>s==='#builder'?root:elements[s],createElement:()=>new Element()}};
vm.createContext(context);
for(const file of ['apps/parfait/config.js','shared/builder.js','apps/parfait/builder.js'])vm.runInContext(fs.readFileSync(file,'utf8'),context);
const app=context.window.parfaitBuilder;

assert.equal(elements['#sentence'].textContent,'I want ….');
assert.equal(app.buttons.size,9);
for(const topping of app.config.toppings){
 app.setLevel(topping.id,1); const first=app.groups.get(topping.id).children[0];
 app.setLevel(topping.id,2); assert.equal(app.groups.get(topping.id).children[0],first);
 assert.equal(app.groups.get(topping.id).children.length,6);
 app.setLevel(topping.id,3);assert.equal(app.groups.get(topping.id).children.length,10);
 app.setLevel(topping.id,0);assert.equal(app.groups.get(topping.id).children.length,0);
}
app.setLevel('strawberries',1);app.setLevel('bananas',2);
assert.equal(elements['#sentence'].textContent,'I want strawberries and bananas.');
app.advancedMode=true;app.updateSentence();
assert.equal(elements['#sentence'].textContent,'I want a little bit of strawberries and some bananas.');
app.config.toppings.forEach(t=>app.setLevel(t.id,2));
assert.equal(elements['#sentence'].textContent,'I want some of everything.');
app.clear();assert.equal(elements['#sentence'].textContent,'I want ….');
assert.equal(app.positions.size,0);
console.log('PASS: parfait fruit cycles, retained pieces, grouped language, everything, and reset.');

app.setBase('vanilla');app.setSauce('chocolate');app.setLevel('strawberries',1);app.advancedMode=false;app.updateSentence();
assert.equal(elements['#sentence'].textContent,'I want vanilla ice cream and strawberries with chocolate syrup.');
assert(elements['#drizzle'].html.includes('syrup-middle'));
assert(!elements['#drizzle'].html.includes('drizzle-line'));
app.setBase('mint');assert.equal((elements['#ice-cream'].html.match(/class="ice-scoop /g)||[]).length,2);assert(elements['#ice-cream'].html.includes('with-chips'));
app.setSauce('none');assert.equal(elements['#drizzle'].html,'');
app.setBase('none');assert.equal(elements['#ice-cream'].html,'');
app.setBase('strawberry');app.setSauce('caramel');app.clear();
assert.equal(app.state.base,null);assert.equal(app.state.sauce,null);
assert.equal(elements['#ice-cream'].html,'');assert.equal(elements['#drizzle'].html,'');
assert.equal(elements['#sentence'].textContent,'I want ….');
console.log('PASS: ice cream/syrup sentences, removal, chip rendering, and cream-base reset.');

assert(fs.readFileSync('apps/parfait/index.html','utf8').includes('class="whipped-base"'));
app.clear();
app.setLevel('bananas',1);app.setLevel('strawberries',1);app.setLevel('apples',1);app.setLevel('melons',1);
assert.deepEqual(Array.from(app.selectionOrder),['bananas','strawberries','apples','melons']);
const fruit=id=>app.config.toppings.find(t=>t.id===id);
assert(app.placements(fruit('bananas'))[0].y>app.placements(fruit('strawberries'))[0].y);
assert(app.placements(fruit('melons'))[0].y<0);
assert(app.placements(fruit('strawberries')).every(p=>p.rotate>=178&&p.rotate<=182));
const piece=app.groups.get('bananas').children[0];
app.setLevel('bananas',3);assert.equal(app.groups.get('bananas').children[0],piece);
const points=app.placements(fruit('bananas'));
const gap=points[1].x-points[0].x;
assert(points.slice(1).every((p,i)=>Math.abs(p.x-points[i].x-gap)<1e-9));
app.setLevel('strawberries',0);assert.deepEqual(Array.from(app.selectionOrder),['bananas','apples','melons']);
app.setLevel('strawberries',1);assert.equal(app.selectionOrder.at(-1),'strawberries');
app.clear();assert.equal(app.selectionOrder.length,0);
console.log('PASS: click-ordered layers, even rows, point-up strawberries, removal/re-addition, and reset.');
