const fs=require('node:fs'),vm=require('node:vm');
vm.runInNewContext(fs.readFileSync('tests/check.cjs','utf8')+`
reduce=false;app.clear();app.setSauce('tomato',false);app.setLevel('cheese',3,false,{animate:false});
const pieces=[...app.groups.values()].flatMap(g=>g.children);
const tick=now=>{const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(now));};
app.animateRestoredCreation();assert(pieces.every(p=>p.style.visibility==='hidden'));
tick(0);tick(1800);assert(pieces.every(p=>p.style.visibility==='hidden'));
tick(1900);tick(1916);assert.equal(pieces.filter(p=>p.className.includes('replaying')).length,12);
for(let time=2100;time<10000;time+=180)tick(time);
assert.equal(frames.size,0);assert(pieces.every(p=>p.style.visibility===''));
app.animateRestoredCreation();app.setLevel('corn',1);assert(pieces.every(p=>p.style.visibility===''));assert.equal(app.restorePieces,null);
app.setSauce('none',false);app.animateRestoredCreation();tick(11000);assert(pieces.some(p=>p.className.includes('replaying')));app.cancelRestoreAnimation();
reduce=true;app.animateRestoredCreation();assert.equal(app.restorePieces,null);
console.log('PASS: sauce before toppings, bounded batches, completion, editing cancellation, no sauce and reduced motion.');
`,{require,console});
