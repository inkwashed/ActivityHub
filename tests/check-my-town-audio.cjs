/* Question refresh/cancellation and vocabulary metadata in the actual app fixture. */
const fs=require('node:fs'),vm=require('node:vm');
let source=fs.readFileSync('tests/check-my-town-controls.cjs','utf8');
source=source.replace("get('#sentence').textContent=text", "get('#sentence').textContent=text;this.pronunciation||={available:false,recording:t=>t==='What do you have in your town?'||t==='Where is the park?',stop(){get('#question').stops=(get('#question').stops||0)+1},labels(){get('#question').setAttribute('aria-label','Listen: '+get('#question').textContent)}};context.voiceCatalog=this.config.toppings");
source+=`\nassert.equal(context.voiceCatalog.find(x=>x.label==='library').countPlural,'libraries');
get('#route-mode').onchange({target:{checked:false}});assert.equal(get('#question').disabled,false);assert.equal(get('#question').attrs['aria-label'],'Listen: What do you have in your town?');
get('#route-mode').onchange({target:{checked:true}});assert.equal(get('#question').disabled,true);const before=get('#question').stops||0;
session.restore({topology:3,blocks:['park',...Array(11).fill(null)],route:[17],facing:0,destination:0});assert.equal(get('#question').textContent,'Where is the park?');assert.equal(get('#question').disabled,false);assert.ok(get('#question').stops>before);console.log('PASS: Town plural listening names, changing questions cancel playback and recording-only questions stay enabled.');`;
vm.runInNewContext(source,{require,console});
