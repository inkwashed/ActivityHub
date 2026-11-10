const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const window={BuilderPhoto:options=>window.render=options.render};
const ctx={window};for(const file of ['apps/pizza/config.js','apps/pizza/sharing.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
const config=window.PIZZA_CONFIG;
for(const area of [{left:0,top:0,side:100},{left:-20,top:-5,side:150},{left:-5,top:-70,side:210}]){
 const items=[[-60,50],[160,50],[50,-90],[50,190]].map(([x,y],i)=>({topping:'pepperoni',x,y,scale:4,rotate:i*45,flip:!!(i%2)}));
 const b={config,creative:{active:true,items,orderedItems:()=>items},state:{sauce:'tomato'},exportFrame:()=>area};
 const f=window.PizzaPhotoFrame(b);assert.equal(f.left+f.side/2,50);assert.equal(f.top+f.side/2,50);
 assert(f.left<=area.left&&f.top<=area.top&&f.left+f.side>=area.left+area.side&&f.top+f.side>=area.top+area.side);
 for(const p of items){const a=p.rotate*Math.PI/180,h=config.toppings[1].size*.94*p.scale/2*(Math.abs(Math.cos(a))+Math.abs(Math.sin(a)))+1;
 const x=50+(p.x-50)*.94,y=50+(p.y-50)*.94;assert(x-h>=f.left-1e-9&&x+h<=f.left+f.side+1e-9&&y-h>=f.top-1e-9&&y+h<=f.top+f.side+1e-9);}
 const before=JSON.stringify(items),svg=window.render(b);assert.equal(JSON.stringify(items),before);assert(svg.includes(`viewBox="${f.left} ${f.top} ${f.side} ${f.side}"`));
}
console.log('PASS: symmetric Pizza export, full-area inclusion, rotated/oversized edge pieces and immutable coordinates.');
