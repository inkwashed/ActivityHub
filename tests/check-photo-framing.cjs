const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
function renderer(file){let render;const window={BuilderPhoto:options=>render=options.render};if(file.includes('parfait'))vm.runInNewContext(fs.readFileSync('apps/parfait/glass-art.js','utf8'),{window,document:{querySelector:()=>null}});vm.runInNewContext(fs.readFileSync(file,'utf8'),{window});return render;}
const frame=svg=>svg.match(/viewBox="([^"]+)"/)[1];
for(const app of ['pizza','parfait']){
 const render=renderer(`apps/${app}/sharing.js`);
 const type={id:'fruit',counts:[0,1],size:20,creativeSize:20,category:'fruit',art:'<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'};
 const b={config:{sauces:[],bases:[],toppings:[type]},state:{toppings:{fruit:0},layers:[]},placements:()=>[],scoopArtwork:()=>''};
 const learn=render(b);
 const items=[{topping:'fruit',x:-200,y:300,scale:3,rotate:40,flip:true}];
 b.creative={active:true,items,orderedItems:()=>items,topping:()=>type};
 const play=render(b);
 if(app==='parfait')assert.equal(frame(play),frame(learn),'Parfait retains its existing crop');
 else {const [x,y,w,h]=frame(play).split(' ').map(Number);assert.equal(x+w/2,50);assert.equal(y+h/2,50);assert(w>100,'Pizza expands to retain overflow artwork');}
 b.exportFrame=()=>({left:-200,top:-250,side:800});
 assert.equal(frame(render(b)),app==='pizza'?'-500 -500 1100 1100':'-200 -250 800 800');
 assert.doesNotMatch(render(b),/free-tools|piece-hit/);
 for(const svg of [learn,play]){assert.match(svg,/width="900" height="900"/);const [, ,w,h]=frame(svg).split(' ').map(Number);assert.equal(w,h);}
}
const window={};vm.runInNewContext(fs.readFileSync('apps/sandwich/model.js','utf8'),{window});
for(const creative of [false,true])assert.match(window.SandwichLesson.svg([],{toppings:[]},creative,true),/translate\(5 10\) scale\(\.9\)/);
console.log('PASS: square photos with app-specific framing, extreme PLAY placements, and shared Sandwich photo scale.');

assert.match(window.SandwichLesson.svg([],{toppings:[]},true,true,{left:-60,top:-80,side:240}),/viewBox="-60 -80 240 240"/);
console.log('PASS: opted-in food exports include full editing frames without toolbar markup.');
