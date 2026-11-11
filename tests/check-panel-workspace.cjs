const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
const classes=()=>({add(){},toggle(){}});
const rootListeners={};const listeners={};const output={setAttribute(){}};
const column={classList:classes(),scrollHeight:800,clientHeight:500,scrollTop:120,querySelector:()=>({classList:classes()}),append:x=>column.output=x,addEventListener(){}};
const scene={dataset:{}},safe=rect(0,0,336,400),full=rect(0,0,400,400);
const surface={querySelector:()=>({firstElementChild:scene}),getBoundingClientRect:()=>safe,fitArtwork(){}};
const frame={querySelector:()=>surface,getBoundingClientRect:()=>full};
const root={classList:classes(),querySelector:s=>s.includes('choices')?column:s==='.builder-output'?output:frame,addEventListener:(name,fn,capture)=>{rootListeners[name+(capture?'Capture':'')]=fn}};
const item={id:1,x:90,y:50,node:{querySelector:()=>({getBoundingClientRect:()=>rect(350,180,44,44)})}};
let synced=0;const editor={options:{},items:[item],selected:1,active:true,picker:{addEventListener:(event,fn)=>listeners[event]=fn},tools:{getBoundingClientRect:()=>rect(346,3,44,394)},pizza:{getBoundingClientRect:()=>rect(0,0,400,400)},paint(){},sync(){synced++}};
const window={addEventListener(){}};vm.runInNewContext(fs.readFileSync('shared/builder-panel-workspace.js','utf8'),{window,getComputedStyle:()=>({overflowY:'auto'}),document:{currentScript:null},ResizeObserver:class{observe(){}},MutationObserver:class{observe(){}},requestAnimationFrame:fn=>fn()});
const builder={root,creative:editor};window.BuilderPanelWorkspace(builder);
const click={target:{closest:()=>column}};rootListeners.clickCapture(click);column.scrollTop=0;rootListeners.click(click);assert.equal(column.scrollTop,120,'choice update preserves panel scroll and refreshes cue');
assert.equal(column.output,output);assert.equal(editor.options.placementBounds(),frame);assert.equal(scene.dataset.builderPlacement,'full');
listeners.change();assert.equal(item.x,74);assert.equal(item.y,50);assert.equal(synced,1);
// No movement on picker selection of a visible piece.
item.node.querySelector=()=>({getBoundingClientRect:()=>rect(120,180,44,44)});listeners.change();assert.equal(synced,1);
for(const map of [{x:3,y:3,width:94,height:94},{x:12,y:0,width:376,height:249.6},{x:5,y:10,width:90,height:90}]){
 const area=rect(-40,-200,620,900),scene=rect(20,50,400,400),base={left:0,top:0,side:100};
 const f=window.BuilderPanelWorkspace.photoFrame(area,scene,map,base);
 assert.ok(f.left-1e-9<=map.x+(area.left-scene.left)/scene.width*map.width);
 assert.ok(f.top-1e-9<=map.y+(area.top-scene.top)/scene.height*map.height);
 assert.ok(f.left+f.side+1e-9>=map.x+(area.right-scene.left)/scene.width*map.width);
 assert.ok(f.top+f.side+1e-9>=map.y+(area.bottom-scene.top)/scene.height*map.height);
 assert.ok(f.left<=0&&f.top<=0&&f.left+f.side>=100&&f.top+f.side>=100);
}
console.log('PASS: shared column relocation, independent full placement, minimal picker recovery and square export union in all three food coordinate systems.');
const symmetric=window.BuilderPanelWorkspace.photoFrame(rect(-10,-5,120,140),rect(0,0,100,100),{x:0,y:0,width:100,height:100},{left:0,top:0,side:100,center:{x:50,y:50}});
assert.deepEqual({...symmetric},{left:-35,top:-35,side:170});
console.log('PASS: optional centered export expands symmetrically from raw editing bounds, without double padding.');
// Hidden/zero-size geometry must not damage picker recovery positions or exports.
const validSceneRect=editor.pizza.getBoundingClientRect;
item.node.querySelector=()=>({getBoundingClientRect:()=>rect(350,180,44,44)});
const before={x:item.x,y:item.y};
for(const bad of [0,NaN,Infinity]){
 editor.pizza.getBoundingClientRect=()=>rect(0,0,bad,400);
 listeners.change();assert.deepEqual({x:item.x,y:item.y},before);
 const base={left:-5,top:-5,side:110};
 assert.deepEqual(JSON.parse(JSON.stringify(window.BuilderPanelWorkspace.photoFrame(full,rect(0,0,bad,400),{x:0,y:0,width:100,height:100},base))),base);
}
editor.pizza.getBoundingClientRect=validSceneRect;
listeners.change();assert.equal(synced,2);
console.log('PASS: invalid picker/export geometry preserves coordinates and baseline; valid recovery resumes.');
