const fs=require('fs'),vm=require('vm'),assert=require('assert');
class El{constructor(){this.dataset={};this.events={};this.hidden=false;this.open=false;this.children={}}addEventListener(k,f){this.events[k]=f}querySelector(k){return this.children[k] ||= new El()}removeAttribute(k){delete this[k]}showModal(){this.open=true}close(){this.open=false;this.events.close?.()}}
const els=Object.fromEntries(['#share-dialog','#language-dialog','#pizza-photo','#download-photo','#share-status','#language','#share','#sentence'].map(k=>[k,new El()]));els['#sentence'].textContent='I want cheese with tomato sauce.';
let texts=[],fonts=[],canvas;
let svg, revoked=[],drawn=false,blobbed=false;
const context2d={measureText:s=>({width:s.length*16}),fillRect(){},drawImage(){drawn=true},save(){},restore(){},fillText(...args){texts.push(args);fonts.push(this.font)}};
const builder={config:{sauces:[{id:'tomato',color:'#cc452c'}],toppings:[{id:'cheese',counts:[0,1,2,3],size:9,art:'<svg viewBox="0 0 64 64"><path fill="#ffe99d" d="M0 0L64 64"/></svg>'}]},state:{sauce:'tomato',toppings:{cheese:1}},placements:()=>[{x:40,y:60,rotate:30,scale:1}]};
class Img{set src(s){svg=decodeURIComponent(s.split(',')[1]);Promise.resolve().then(()=>this.onload())}}
const ctx={window:{pizzaBuilder:builder},document:{querySelector:s=>els[s],createElement:()=>(canvas={getContext:()=>context2d,toBlob:f=>{blobbed=true;f({type:'image/png'})}})},Image:Img,URL:{createObjectURL:()=> 'blob:photo',revokeObjectURL:u=>revoked.push(u)}};
vm.runInNewContext(fs.readFileSync('shared/language-dialog.js','utf8'),ctx);
vm.runInNewContext(fs.readFileSync('shared/builder-photo.js','utf8'),ctx);

vm.runInNewContext(fs.readFileSync('apps/pizza/sharing.js','utf8'),ctx);
(async()=>{els['#language'].events.click();assert(els['#language-dialog'].open);
await els['#share'].events.click();assert(drawn&&blobbed);assert.equal(fonts.at(-1),'28px Arial','Credit uses export pixels large enough for scaled previews');assert.deepEqual(texts.at(-1),["Let's EiGo! ・ Little Pizza Kitchen",50,canvas.height-24,900]);assert(svg.includes('id="oak-counter"'));assert(svg.indexOf('id="oak-counter"')<svg.indexOf('<circle'));assert(svg.includes('translate(40.6 59.4)'));assert(svg.includes('#edbc5e'));assert.equal(els['#download-photo'].href,'blob:photo');assert.equal(els['#pizza-photo'].hidden,false);assert.equal(builder.state.toppings.cheese,1);builder.creative={active:true,items:[{topping:'cheese',x:60,y:40,rotate:45,scale:1.5,flip:true}]};await els['#share'].events.click();assert(svg.includes('translate(59.4 40.6) rotate(45) scale(-1.5 1.5)'));els['#sentence'].textContent='Go straight for two blocks. '.repeat(50);await els['#share'].events.click();const credit=texts.at(-1),lastSentence=texts.at(-2);assert(credit[2]-lastSentence[2]>=56,'Credit clears long sentence');els['#share-dialog'].close();assert.deepEqual(revoked,['blob:photo','blob:photo','blob:photo']);assert(els['#download-photo'].hidden);console.log('PASS: photo composition, PNG export flow, preview/download, cleanup, language dialog, and preserved builder state.');})();

for(const app of ['pizza','parfait','sandwich','class-supplies','my-town']){
 const html=fs.readFileSync(`apps/${app}/index.html`,'utf8');
 const source=fs.readFileSync(`apps/${app}/${app==='my-town'?'app':'sharing'}.js`,'utf8');
 const brand=html.match(/<span lang="en">([^<]+)<\/span>/)[1];
 const name=source.match(/appName:'([^']+)'/)[1];
 assert.equal(name.toUpperCase(),brand,'Export credit matches visible app title: '+app);
}
