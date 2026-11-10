const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
// Exercise the real opt-in workspace path, including a pizza-stage without #pizza.
const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height});
let safeWidth=536,active=true,extra=[];
class E{
 constructor(){this.children=[];this.style={setProperty(){}};this.dataset={};this.clientHeight=140;this.scrollHeight=100;}
 append(n){if(n.parent)n.parent.children.splice(n.parent.children.indexOf(n),1);n.parent=this;this.children.push(n)}
 before(n){n.parent=this.parent;this.parent.children.splice(this.parent.children.indexOf(this),0,n)}
 getBoundingClientRect(){return rect(0,0,this.className==='builder-art-area'?safeWidth:600,450)}
}
const kitchen=new E(),scene=new E(),order=new E(),tools=new E();kitchen.append(scene);kitchen.append(order);
const svg={getClientRects:()=>[1],getBBox:()=>({x:140,y:20,width:320,height:300}),getScreenCTM:()=>({})};
const base={matches:()=>false,querySelector:s=>{assert.equal(s,':scope > svg');return svg}};
scene.hasAttribute=s=>s==='data-builder-fit';scene.matches=s=>s==='.pizza-stage';scene.querySelector=()=>null;
scene.querySelectorAll=s=>s==='[data-builder-fit-base]'?[base]:s==='[data-builder-fixed-hit]'?extra:[];
kitchen.querySelector=s=>s==='.order'?order:s==='#source-sentence'?null:scene;
const root={querySelector:s=>s==='#free-tools'?tools:kitchen,classList:{contains:()=>active}};
vm.runInNewContext(fs.readFileSync('shared/builder-workspace.js','utf8'),{
 window:{addEventListener(){}},document:{querySelector:()=>root,createElement:()=>new E()},
 DOMPoint:class{constructor(x,y){this.x=x;this.y=y}matrixTransform(){return this}},
 ResizeObserver:class{observe(){}},MutationObserver:class{observe(){}},requestAnimationFrame(){},cancelAnimationFrame(){}
});
const surface=kitchen.children[0].children[0],composition=surface.children[0];
assert.equal(composition.dataset.fit,'preserve');assert.equal(composition.dataset.scale,'1.0000');
safeWidth=450;surface.fitArtwork();assert.equal(composition.dataset.fit,'shift');assert.match(composition.style.cssText,/left:-16px/);
extra=[{getClientRects:()=>[1],getBoundingClientRect:()=>rect(5,15,500,330)}];surface.fitArtwork();
assert.equal(composition.dataset.fit,'scale');assert(Number(composition.dataset.scale)<1,'complete interactive composition drives fitting');
extra=[];base.querySelector=()=>null;base.getBoundingClientRect=()=>rect(30,20,540,410);surface.fitArtwork();
assert.equal(composition.dataset.fit,'scale','Lab full-rectangle base must fit as a whole, not its first ingredient');
active=false;surface.fitArtwork();assert.equal(composition.style.cssText,'width:600px;height:450px;left:0;top:0','LEARN always recovers original full frame');
kitchen.children[0].querySelector=()=>({getBoundingClientRect:()=>rect(0,0,600,300)});surface.fitArtwork();
assert.equal(composition.style.cssText,'width:600px;height:300px;left:0;top:0','optional preferred budget preserves artwork when editing frame grows');
console.log('PASS: opt-in SVG base, transparent margins, fixed selection bounds, minimum shift, last-resort scale and unchanged LEARN frame.');

active=true;scene.dataset.builderPlacement='full';extra=[];base.querySelector=()=>svg;
scene.querySelectorAll=selector=>{if(selector==='[data-builder-fit-base]')return [base];if(selector==='[data-builder-fixed-hit]')return [];throw Error('Full-frame placement must not feed movable pieces into base fitting: '+selector)};
safeWidth=536;surface.fitArtwork();assert.equal(composition.dataset.fit,'preserve');
const fittedStyle=composition.style.cssText;
for(const invalid of [0,NaN,Infinity]){safeWidth=invalid;surface.fitArtwork();assert.equal(composition.style.cssText,fittedStyle,'unavailable geometry retains last valid fit');}
safeWidth=536;surface.fitArtwork();assert.equal(composition.dataset.fit,'preserve');
