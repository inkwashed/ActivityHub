const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
class Element{
 constructor(){this.children=[];this.props={};this.style={setProperty:(k,v)=>this.props[k]=v};this.clientHeight=140;this.long=false;}
 append(node){if(node.parent)node.parent.children.splice(node.parent.children.indexOf(node),1);node.parent=this;this.children.push(node);}
 before(node){const p=this.parent;node.parent=p;p.children.splice(p.children.indexOf(this),0,node);}
 get scrollHeight(){return this.long?(parseInt(this.props['--output-font-size'])>17?170:136):100;}
}
const kitchen=new Element(),scene=new Element(),order=new Element(),source=new Element();
kitchen.append(scene);kitchen.append(order);kitchen.append(source);
kitchen.querySelector=s=>s==='.order'?order:s==='#source-sentence'?source:scene;
const root={querySelector:()=>kitchen},queue=[];let changed,resized;
vm.runInNewContext(fs.readFileSync('shared/builder-workspace.js','utf8'),{
 document:{querySelector:()=>root,createElement:()=>new Element()},window:{ResizeObserver:true,addEventListener(){}},
 requestAnimationFrame:fn=>queue.push(fn),MutationObserver:class{constructor(fn){changed=fn}observe(){}},ResizeObserver:class{constructor(fn){resized=fn}observe(){}}
});
const [frame,output]=kitchen.children;
assert.equal(frame.className,'builder-play-area');assert.equal(frame.children[0],scene);
assert.deepEqual(output.children,[order,source]);queue.shift()();
assert.equal(output.props['--output-font-size'],'21px');
output.long=true;changed();resized();assert.equal(queue.length,1);queue.shift()();
assert.equal(output.props['--output-font-size'],'17px');assert.equal(frame.children[0],scene);
output.long=false;changed();queue.shift()();assert.equal(output.props['--output-font-size'],'21px');
Object.defineProperty(output,'scrollHeight',{get:()=>300});changed();queue.shift()();
assert.equal(output.props['--output-font-size'],'16px');assert.equal(output.tabIndex,0);
console.log('PASS: stable scene, source placement, bounded fitting, font restoration and accessible long-text fallback.');
