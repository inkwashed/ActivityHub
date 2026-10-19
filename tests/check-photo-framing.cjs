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
 assert.equal(frame(play),frame(learn),`${app}: overflow must not zoom photo out`);
 for(const svg of [learn,play]){assert.match(svg,/width="900" height="900"/);const [, ,w,h]=frame(svg).split(' ').map(Number);assert.equal(w,h);}
}
const window={};vm.runInNewContext(fs.readFileSync('apps/sandwich/model.js','utf8'),{window});
for(const creative of [false,true])assert.match(window.SandwichLesson.svg([],{toppings:[]},creative,true),/translate\(5 10\) scale\(\.9\)/);
console.log('PASS: fixed square photo framing across modes, extreme PLAY placements, and shared Sandwich photo scale.');
