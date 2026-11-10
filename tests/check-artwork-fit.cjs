const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{},document:{querySelector:()=>null}};
vm.runInNewContext(fs.readFileSync('shared/builder-workspace.js','utf8'),context);
const fit=context.window.BuilderArtworkFit.fit;
const base={left:100,right:400,top:80,bottom:350};
assert.deepEqual({...fit([base],500,400)},{scale:1,x:0,y:0});
assert.deepEqual({...fit([base],390,400)},{scale:1,x:-16,y:0});
assert.deepEqual({...fit([base],500,330)},{scale:1,x:0,y:-26});
const wide={left:-20,right:540,top:30,bottom:200};
const result=fit([base,wide],400,300);
assert(result.scale<1);assert(Math.abs(result.scale-388/560)<1e-10);
for(const b of [base,wide]){
 assert(b.left*result.scale+result.x>=6-1e-8);
 assert(b.right*result.scale+result.x<=394+1e-8);
 assert(b.top*result.scale+result.y>=6-1e-8);
 assert(b.bottom*result.scale+result.y<=294+1e-8);
}
assert.equal(fit([base],500,400).scale,1,'returning to a roomy viewport recovers preferred scale');
console.log('PASS: full-frame preference, minimum translation, composition union, proportional last-resort scaling and restored scale.');

const tiny=fit([{left:0,right:500,top:0,bottom:500},{left:480,right:520,top:480,bottom:520,minWidth:44,minHeight:44}],150,150);
assert(500*tiny.scale+22+tiny.x<=144+1e-8,'minimum touch area survives scene scaling');
// Pizza-only bottom rail option centers the actual base after proportional fit.
for(const width of [343,537]){
 const b={left:width/2-180,right:width/2+180,top:22,bottom:382};
 const f=fit([b],width,290,6,{target:width/2,anchor:width/2});
 assert(Math.abs((b.left+b.right)/2*f.scale+f.x-width/2)<1e-8);
 assert(b.bottom*f.scale+f.y<=284+1e-8);
}
console.log('PASS: opted-in bottom toolbar fitting centers after scale without losing clearance.');
