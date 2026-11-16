/* Exercise real CreativeBuilder consumers through their existing mock fixtures. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
module.exports=(b,context,name,appStorage)=>{
 const c=b.creative;if(!c.active)c.switchMode(true);b.clear();
 assert.equal(c.actions.has('top'),false);assert.equal(c.actions.size,9);
 assert.equal(c.actions.get('forward').disabled,true);assert.equal(c.actions.get('backward').disabled,true);
 assert.equal(c.actions.get('forward').attrs['data-i18n-aria-label'],'Move forward one layer');
 assert.ok(c.actions.get('forward').html.includes('/layer-up.svg'));assert.ok(c.actions.get('backward').html.includes('/layer-down.svg'));
 const groups=new Map();for(const type of c.catalog){const key=type.layer||0;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(type)}
 const types=[...groups.values()].find(x=>x.length>1),a=types[0].id,d=types[1].id;
 for(const id of [a,d,a])c.add(id);
 const original=[...c.orderedItems()],chosen=original[0];chosen.rotate=45;chosen.flip=true;c.paint(chosen);c.select(chosen.id);
 const physical=()=>JSON.stringify([...c.items].sort((x,y)=>x.id-y.id).map(({id,topping,x,y,scale,rotate,flip,color})=>({id,topping,x,y,scale,rotate,flip,color})));
 const before=physical();c.actions.get('forward').listeners.click();assert.equal(c.orderedItems()[1],chosen);assert.equal(c.selected,chosen.id);assert.equal(physical(),before);
 c.edit('backward');assert.deepEqual(Array.from(c.orderedItems(),x=>x.id),original.map(x=>x.id));assert.equal(c.actions.get('backward').disabled,true);
 c.edit('backward');assert.equal(c.orderedItems()[0],chosen);c.edit('forward');c.edit('forward');assert.equal(c.orderedItems().at(-1),chosen);assert.equal(c.actions.get('forward').disabled,true);
 c.edit('forward');assert.equal(physical(),before);
 c.orderedItems().forEach((x,i)=>assert.equal(x.node.style.zIndex,i+1));
 assert.deepEqual(Array.from(c.picker.children.slice(1),x=>String(x.value)),Array.from(c.orderedItems(),x=>String(x.id)));
 const expected=Array.from(c.orderedItems(),x=>x.topping);const colors=JSON.stringify(c.orderedItems().map(x=>x.color));
 // Production exporters must emit transform groups in exactly this order.
 const exportFiles={pizza:'apps/pizza/sharing.js',parfait:'apps/parfait/sharing.js',sandwich:'apps/sandwich/sharing.js',supplies:'apps/class-supplies/sharing.js'};
 if(exportFiles[name]){
  let renderer;const photo=context.window.BuilderPhoto;context.window.BuilderPhoto=options=>{renderer=options.render};
  vm.runInContext(fs.readFileSync(exportFiles[name],'utf8'),context);context.window.BuilderPhoto=photo;
  c.items.forEach((x,i)=>x.rotate=17+i*19);c.items.forEach(x=>c.paint(x));
  const svg=renderer(b);let from=0;for(const x of c.orderedItems()){const token='rotate('+x.rotate,at=svg.indexOf(token,from);assert.ok(at>=from,name+' export order '+token);from=at+token.length;}
 }
 // Round-trip the real save adapter and Reset/Restore without disturbing LEARN.
 context.document.getElementById ||= ()=>null;
 if(!context.window.BuilderAutosave)vm.runInContext(fs.readFileSync('shared/builder-autosave.js','utf8'),context);
 c.switchMode(false);const storage=appStorage||context.window.BuilderAutosave.adapter(b);c.switchMode(true);const raw=JSON.parse(JSON.stringify(storage.capture()));storage.restore(raw);
 assert.deepEqual(Array.from(c.orderedItems(),x=>x.topping),expected);if(appStorage)assert.equal(JSON.stringify(c.orderedItems().map(x=>x.color)),colors);assert.equal(c.selected,c.orderedItems().at(-1).id);
 const label={dataset:{},textContent:''},button={querySelector:()=>label,addEventListener(){}};
 const query=context.document.querySelector;context.document.querySelector=s=>s==='#clear'?button:query(s);
 const recovery=context.window.BuilderReset.install(b,storage,()=>{});recovery.press();assert.equal(c.items.length,0);recovery.press();assert.deepEqual(Array.from(c.orderedItems(),x=>x.topping),expected);
 context.document.querySelector=query;
 c.select(c.orderedItems()[1].id);const removed=c.selected;c.edit('delete');assert.ok(!c.items.some(x=>x.id===removed));assert.equal(c.selected,c.orderedItems()[0].id);c.edit('duplicate');assert.equal(c.selected,c.items.at(-1).id);
 if(groups.size>1){
  b.clear();for(const entries of groups.values())for(const type of entries.slice(0,2))c.add(type.id);
  for(const entries of groups.values()){
   const peers=c.orderedItems().filter(x=>(c.topping(x).layer||0)===(entries[0].layer||0));
   c.select(peers[0].id);assert.equal(c.actions.get('backward').disabled,true);const order=Array.from(c.orderedItems(),x=>x.id);c.edit('backward');assert.deepEqual(Array.from(c.orderedItems(),x=>x.id),order);
   c.select(peers.at(-1).id);assert.equal(c.actions.get('forward').disabled,true);c.edit('forward');assert.deepEqual(Array.from(c.orderedItems(),x=>x.id),order);
   if(peers.length>1){c.select(peers[0].id);c.edit('forward');assert.equal(c.orderedItems().filter(x=>(c.topping(x).layer||0)===(entries[0].layer||0))[1],peers[0]);}
  }
 }
 c.select(null);assert.equal(c.actions.get('forward').disabled,true);assert.equal(c.actions.get('backward').disabled,true);
 console.log('PASS: '+name+' one-step swaps, disabled boundaries, selection/transforms, picker/depth, save/Restore, delete/duplicate and category protection.');
};
