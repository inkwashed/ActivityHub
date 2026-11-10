// Operation counts are mocked work counts, not device frame-rate measurements.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
vm.runInNewContext(fs.readFileSync('tests/check-class-supplies.cjs','utf8').replace('PieceGestures:class{bindSurface','PieceGestures:class{constructor(options){this.options=options}bindSurface')+`
 b.creative.switchMode(true);b.clear();for(let i=0;i<120;i++)b.creative.add('pen');
 const ed=b.creative;let paints=0,sorts=0;const paint=ed.paint.bind(ed),ordered=ed.orderedItems.bind(ed);
 ed.paint=(...args)=>{paints++;return paint(...args)};
 ed.orderedItems=(...args)=>{if(!ed.syncOrder)sorts++;return ordered(...args)};
 const item=ed.items[0];item.scale+=.1;ed.gestures.options.change(item,true);
 assert.equal(paints,1);assert.equal(sorts,1);
 ed.items.forEach((piece,i)=>assert.equal(piece.node.style.zIndex,i+1));
 paints=0;item.color='brown';b.refreshColors();assert.equal(paints,1);
 paints=0;b.refreshColors();assert.equal(paints,0,'unchanged colors do not repaint');
 console.log('PASS: 120-piece pinch: 1 paint / 1 sort; color changes repaint only changed pieces.');
`,{require,console});
let source=fs.readFileSync('tests/check-parfait-creative.cjs','utf8').replace('context.document.addEventListener=function(){};',"let workspaceReady;context.document.addEventListener=(name,fn)=>{if(name==='builder:workspace-ready')workspaceReady=fn};");
const end=source.lastIndexOf('`,{require,console});');
source=source.slice(0,end)+`
 const b=context.window.parfaitBuilder;const originalSentence=b.setSentence.bind(b);let sentenceWrites=0;
 b.setSentence=(...args)=>{sentenceWrites++;return originalSentence(...args)};
 for(const play of [false,true])for(const hard of [false,true]){
  b.creative.switchMode(play);b.advancedMode=hard;sentenceWrites=0;b.updateSentence();
  assert.equal(sentenceWrites,1,'one sentence rendering per update');
 }
 const surface={contains:()=>true,addEventListener(){}};workspaceReady({detail:surface});
 let resizePaints=0;const realPaint=b.creative.paint.bind(b.creative);b.creative.paint=(...args)=>{resizePaints++;return realPaint(...args)};
 surface.repaintArtwork();assert.equal(resizePaints,b.creative.items.length);
 b.creative.switchMode(false);resizePaints=0;surface.repaintArtwork();assert.equal(resizePaints,0);
 b.creative.switchMode(true);surface.repaintArtwork();assert(resizePaints>=b.creative.items.length);
 console.log('PASS: Parfait renders once in all four mode/difficulty combinations.');
`+source.slice(end);
vm.runInNewContext(source,{require,console});
const w={};vm.runInNewContext(fs.readFileSync('shared/builder-workspace.js','utf8'),{window:w,document:{querySelector:()=>null}});
let queue=new Map(),id=0,fits=0,paints=0,active=true;
const layout=w.BuilderLayoutCoordinator({fit:()=>fits++,repaint:()=>{if(active)paints+=120},request:fn=>{queue.set(++id,fn);return id},cancel:i=>queue.delete(i)});
for(let i=0;i<12;i++)layout.schedule();assert.equal(queue.size,1);[...queue.values()][0]();
assert.equal(fits,1);assert.equal(paints,120);assert.equal(queue.size,0);
active=false;layout.schedule();[...queue.values()][0]();assert.equal(fits,2);assert.equal(paints,120);
console.log('PASS: 12 geometry notifications coalesce to 1 fit / 1 repaint pass; inactive callback skips pieces.');
