const fs=require('fs'),vm=require('vm');
vm.runInNewContext(fs.readFileSync('tests/check.cjs','utf8')+`
for(const id of ['.pizza-menu-body','.order','#pizza-menu','#pizza-workspace','#pizza-actions','#free-tools','#piece-picker','#free-mode','#piece-picker-wrap','#free-info-dialog','#free-info','#free-info-close','#free-info-title','#mode-help-text'])elements[id]=new Element();
Element.prototype.insertBefore=function(node,before){this.append(node)};
let layoutChange;const layoutMedia={matches:false,addEventListener(type,handler){layoutChange=handler}};
context.window.matchMedia=()=>layoutMedia;
Element.prototype.replaceChildren=function(){this.children=[]};
Element.prototype.focus=function(){};
Element.prototype.getBoundingClientRect=function(){return {width:400,height:400,left:0,top:0}};
Element.prototype.setPointerCapture=function(){};
root.classList={toggle(){}};
elements['#pizza-menu'].append(elements['#pizza-actions']);
// Exercise the legacy default contract before Pizza's opt-in policy below.
app.config.independentDifficulty=false;app.config.creativeQuantityLevels=false;
app.clear();advanced(true);app.setLevel('mushrooms',2);app.setSauce('tomato');
const tapState=app.state,tapNodes=app.groups.get('mushrooms').children.slice();
vm.runInContext(fs.readFileSync('shared/piece-gestures.js','utf8'),context);
vm.runInContext(fs.readFileSync('shared/creative-builder.js','utf8'),context);
vm.runInContext(fs.readFileSync('apps/pizza/creative.js','utf8'),context);
const free=app.creative;free.updateHelp();assert.equal(elements['#free-info-title'].textContent,'About LEARN mode');assert(elements['#mode-help-text'].textContent.includes('Three dots'));free.switchMode(true);assert.equal(elements['#free-info-title'].textContent,'About PLAY mode');assert(elements['#mode-help-text'].textContent.includes('pinch'));
assert.equal(elements['#pizza-actions'].parent,elements['#pizza-menu']);
assert.equal(app.advancedMode,false);assert.equal(toggle.disabled,true);assert.equal(app.state.sauce,null);
app.buttons.get('corn').listeners.click();assert.equal(free.items.length,1);assert.equal(sentence(),'I want 1 medium corn.');
free.add('mushrooms');const item=free.items[1];
free.edit('larger');assert(item.scale>1);free.edit('right');assert.equal(item.rotate,15);free.edit('flip');assert.equal(item.flip,true);
const event={button:0,pointerId:7,clientX:100,clientY:100,preventDefault(){}};
item.node.listeners.pointerdown(event);item.node.listeners.pointermove({...event,clientX:150,clientY:125});assert(item.x>50);assert(item.y>50);
item.node.listeners.pointercancel(event);assert.equal(free.drag,null);
item.x=200;item.y=200;free.constrain(item);assert(item.x<100&&item.y<100);assert(item.x>60&&item.y>60);
item.x=-200;item.y=-200;free.constrain(item);assert(item.x>=0&&item.y>=0);assert(item.x<40&&item.y<40);
free.edit('duplicate');assert.equal(free.items.length,3);assert.equal(free.items[2].flip,true);assert.equal(free.items[2].rotate,15);
for(let i=0;i<30;i++)free.edit('larger');assert.equal(free.items[2].scale,4);
for(let i=0;i<30;i++)free.edit('smaller');assert.equal(free.items[2].scale,1.25);
free.edit('delete');assert.equal(free.items.length,2);assert.equal(free.selected,item.id);assert.equal(free.picker.value,String(item.id));assert.equal(free.actions.get('delete').disabled,false);
app.setSauce('bbq');free.switchMode(false);assert.equal(elements['#pizza-actions'].parent,elements['#pizza-menu']);assert.equal(app.state,tapState);assert.equal(app.state.sauce,'tomato');assert.equal(app.advancedMode,true);assert.equal(toggle.disabled,false);tapNodes.forEach((n,i)=>assert.equal(app.groups.get('mushrooms').children[i],n));
free.switchMode(true);assert.equal(app.state.sauce,'bbq');assert.equal(free.items.length,2);assert.equal(app.advancedMode,false);
toggle.checked=true;toggle.listeners.change();assert.equal(app.advancedMode,false);assert.equal(toggle.checked,false);
app.clear();assert.equal(free.items.length,0);assert.equal(app.state.sauce,null);free.switchMode(false);assert.equal(elements['#pizza-actions'].parent,elements['#pizza-menu']);assert.equal(app.state.sauce,'tomato');assert.equal(app.state.toppings.mushrooms,2);
free.switchMode(true);for(let i=0;i<121;i++)free.add('corn');assert.equal(free.items.length,120);
free.clear();free.add('corn');free.add('cheese');free.add('mushrooms');
const ids=free.items.map(x=>x.id);
free.select(ids[1]);free.edit('delete');assert.equal(free.selected,ids[0]);
free.edit('delete');assert.equal(free.selected,ids[2]);
const last=free.items[0];last.node.listeners.keydown({key:'Delete',preventDefault(){}});
assert.equal(free.selected,null);assert.equal(free.items.length,0);assert.equal(free.picker.value,'');assert.equal(free.actions.get('delete').disabled,true);
console.log('PASS: previous-piece selection, first-piece fallback, repeated deletion, picker synchronization, and empty-state disabling.');
console.log('PASS: FREE placement, edits, pointer movement/cancel, bounds, limits, duplication/deletion, separate compositions, EASY lock, TAP restoration, and active-only reset.');

free.clear();free.add('cheese');free.edit('smaller');free.edit('smaller');free.edit('duplicate');
free.add('pepperoni');for(let i=0;i<3;i++)free.edit('larger');free.edit('duplicate');free.edit('duplicate');
free.add('sausage');free.edit('duplicate');
assert.equal(sentence(),'I want 2 small cheese, 3 big pepperoni, and 2 medium sausages.');
app.setSauce('tomato');assert(sentence().endsWith('with tomato sauce.'));
free.edit('delete');assert(sentence().includes('1 medium sausage'));
assert.equal(context.window.FoodBuilder.sizeBand(1.5,app.config.creativeSizes),'small');
assert.equal(context.window.FoodBuilder.sizeBand(1.75,app.config.creativeSizes),'medium');
assert.equal(context.window.FoodBuilder.sizeBand(2.75,app.config.creativeSizes),'big');
free.clear();free.add('cheese');
const pinch=free.items[0], touch=(id,x,y)=>({button:0,pointerId:id,clientX:x,clientY:y,preventDefault(){}});
pinch.node.listeners.pointerdown(touch(1,100,100));
let surfaceDown;free.gestures.bindSurface({addEventListener(type,handler){surfaceDown=handler}});
surfaceDown({...touch(2,120,100),pointerType:'touch',stopPropagation(){}});
assert.equal(free.gestures.points.size,2);
pinch.node.listeners.pointermove(touch(2,140,100));
assert.equal(pinch.scale,4);assert.equal(pinch.rotate,0);assert(sentence().includes('1 big cheese'));
pinch.node.listeners.pointermove(touch(2,110,100));
assert.equal(pinch.scale,1.25);assert(sentence().includes('1 small cheese'));
pinch.node.listeners.pointerup(touch(2,110,100));
const previousX=pinch.x;
pinch.node.listeners.pointermove(touch(1,104,100));assert.equal(pinch.x,previousX+1);
free.clear();assert.equal(free.gestures.points.size,0);assert.equal(free.gestures.item,null);
console.log('PASS: pinch limits, live size language, no gesture rotation, smooth return to dragging, and reset cancellation.');
free.clear();free.add('mushrooms');free.add('cheese');free.add('mushrooms');
assert.deepEqual(free.orderedItems().map(item=>item.topping),['mushrooms','cheese','mushrooms']);
free.items.forEach((item,i)=>assert.equal(item.node.style.zIndex,i+1));
const first=free.items[0];free.select(first.id);free.edit('top');assert.equal(free.orderedItems().at(-1),first);assert.equal(first.node.style.zIndex,3);assert.equal(free.selected,first.id);
console.log('PASS: PLAY count/size groups, plural forms, resizing, duplication, deletion, sauce suffix, and thresholds.');
// Tool strips reduce the canvas without changing scene-relative drag units.
const originalClosest=free.pizza.closest,originalRect=free.pizza.getBoundingClientRect;
const usable={getBoundingClientRect:()=>({left:0,top:0,right:300,bottom:200,width:300,height:200})};
free.pizza.closest=selector=>selector.includes('builder-art-area')?usable:null;
free.pizza.getBoundingClientRect=()=>({left:0,top:0,right:400,bottom:400,width:400,height:400});
const bounded=free.items[0];bounded.artBounds={x:0,y:0,width:1,height:1};bounded.x=999;bounded.y=999;bounded.rotate=45;bounded.scale=free.sizes.min;
free.constrain(bounded);
const radius=free.topping(bounded).size*bounded.scale*4*Math.SQRT2/2;
assert(bounded.x*4+radius<=300.001);assert(bounded.y*4+radius<=200.001);
bounded.x=-999;bounded.y=-999;free.constrain(bounded);
assert(bounded.x*4-radius>=-.001);assert(bounded.y*4-radius>=-.001);
usable.fitArtwork=()=>{};bounded.x=999;bounded.y=999;free.constrain(bounded);
const hitRadius=Math.max(44,free.topping(bounded).size*bounded.scale*4*1.04)*Math.SQRT2/2+6;
assert(bounded.x*4+hitRadius<=300.001);assert(bounded.y*4+hitRadius<=200.001);
// Class Supplies opt-in: movement uses the actual frame, not the base-fit strip.
free.options.placementBounds=()=>({getBoundingClientRect:()=>({left:0,top:0,right:400,bottom:400,width:400,height:400})});
for(const sign of [-1,1]){
 bounded.x=sign*999;bounded.y=sign*999;free.constrain(bounded);
 const half=hitRadius-6;
 assert(bounded.x*4-half>=-.001&&bounded.x*4+half<=400.001);
 assert(bounded.y*4-half>=-.001&&bounded.y*4+half<=400.001);
 if(sign===1)assert(bounded.x*4+half>300,'items may occupy the toolbar strip');
}
delete free.options.placementBounds;
free.pizza.closest=originalClosest;free.pizza.getBoundingClientRect=originalRect;
console.log('PASS: rotated pieces remain outside the reserved toolbar strip.');
// Pizza opts in without changing the generic editor contract above.
app.config.independentDifficulty=true;app.config.creativeQuantityLevels=true;
for(const play of [false,true])for(const hard of [false,true]){
 free.switchMode(play);toggle.checked=hard;toggle.listeners.change();
 assert.equal(app.advancedMode,hard);assert.equal(toggle.disabled,false);
 free.switchMode(!play);assert.equal(app.advancedMode,hard);free.switchMode(play);
}
free.switchMode(true);free.clear();app.setSauce('tomato');
for(let i=0;i<4;i++)free.add('pepperoni');
advanced(true);assert.equal(sentence(),'I want some pepperoni with tomato sauce.');
free.items[0].scale=4;app.updateSentence();assert.equal(sentence(),'I want some pepperoni with tomato sauce.');
advanced(false);assert.equal(sentence(),'I want pepperoni with tomato sauce.');
for(let i=0;i<3;i++)free.add('pepperoni');advanced(true);assert.equal(sentence(),'I want a lot of pepperoni with tomato sauce.');
free.clear();for(const t of app.config.toppings)free.add(t.id);advanced(true);assert.equal(sentence(),'I want a little bit of everything.');advanced(false);assert.equal(sentence(),'I want everything.');
// Dragging through a transient zero-size frame preserves finite positions.
const dragItem=free.items[0],validGeometry=free.pizza.getBoundingClientRect;
free.gestures.cancel();dragItem.x=50;dragItem.y=50;
dragItem.node.listeners.pointerdown(event);free.pizza.getBoundingClientRect=()=>({width:0,height:0});
dragItem.node.listeners.pointermove({...event,clientX:120});assert.equal(dragItem.x,50);assert.equal(dragItem.y,50);
free.pizza.getBoundingClientRect=validGeometry;dragItem.node.listeners.pointermove({...event,clientX:140});assert(dragItem.x>50);free.gestures.cancel();
console.log('PASS: Pizza independent difficulty, shared amount phrases, count thresholds, size independence and everything.');
for(const language of ['en','ja']){
 context.window.ActivityHubI18n?.setLanguage?.(language);
 free.select(free.items[0].id);
 for(const piece of free.items)assert.equal(piece.node.attrs['aria-pressed'],String(piece.id===free.selected));
 const label=free.items[0].node.attrs['aria-label'];free.select(null);
 for(const piece of free.items)assert.equal(piece.node.attrs['aria-pressed'],'false');
 assert.equal(free.items[0].node.attrs['aria-label'],label);
 free.select(free.items[0].id);free.edit('duplicate');
 for(const piece of free.items)assert.equal(piece.node.attrs['aria-pressed'],String(piece.id===free.selected));
 free.edit('delete');
 for(const piece of free.items)assert.equal(piece.node.attrs['aria-pressed'],String(piece.id===free.selected));
}
context.window.ActivityHubI18n.setLanguage('en');
console.log('PASS: PLAY button pressed state follows selection, clearing, duplication and deletion without changing labels.');
`,{require,console});
