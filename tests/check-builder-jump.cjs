const fs=require('fs'),vm=require('vm'),assert=require('assert');
let top=900,reduce=false,focused,scrolled;
const section=name=>({focus(){focused=name},scrollIntoView(options){scrolled={name,...options}},getBoundingClientRect:()=>({top})});
const activity=section('activity'),choices=section('choices'),events={};let button;
const context={window:{innerHeight:800,matchMedia:()=>({matches:reduce}),addEventListener:(name,fn)=>events[name]=fn},document:{querySelector:s=>s.includes('activity')?activity:choices,createElement:tag=>{const el={append(){},addEventListener:(name,fn)=>el[name]=fn};if(tag==='button')button=el;return el},body:{append(){}},addEventListener:(name,fn)=>events[name]=fn},requestAnimationFrame:fn=>fn()};
vm.runInNewContext(fs.readFileSync('shared/builder-jump.js','utf8'),context);
assert(button.textContent.includes('Jump to choices'));button.click();assert.equal(focused,'choices');assert.equal(scrolled.behavior,'smooth');
top=10;events.resize();assert(button.textContent.includes('Back to activity'));reduce=true;button.click();assert.equal(focused,'activity');assert.equal(scrolled.behavior,'auto');
console.log('PASS: jump direction, keyboard focus destination, and reduced-motion behavior.');
