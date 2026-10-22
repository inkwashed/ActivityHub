const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const data=new Map();const context={window:{},document:{currentScript:null},Event:class{},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}};
context.window.dispatchEvent=()=>{};
context.window.ActivityAutosave={read:(k,v)=>{try{const d=JSON.parse(data.get(k));return d?.version===v?d.value:null;}catch{return null;}},write:(k,v,value)=>{data.set(k,JSON.stringify({version:v,value}));return true;}};
vm.createContext(context);for(const file of ['achievements','app-usage'])vm.runInContext(fs.readFileSync(`shared/${file}.js`,'utf8'),context);
const a=context.window.ActivityAchievements,jhs={id:'one',mode:'free'},es={id:'es',mode:'guided',rows:[['a','b'],['c'],['d']]};
assert.equal(a.qualifies(jhs,{fields:{body:'x'.repeat(99)+'   '}}),false);
assert.equal(a.recordBlog(jhs,{fields:{body:'x'.repeat(100)}}),true);
assert.equal(a.recordBlog(jhs,{fields:{body:'x'.repeat(100)}}),false);
assert.equal(a.recordBlog(jhs,{fields:{body:''}}),false);assert.equal(a.blogProgress().count,1);
assert.equal(a.qualifies(es,{fields:{a:'yes',c:' ',d:'yes'},ink:[]}),false);
assert.equal(a.recordBlog(es,{fields:{b:'yes',d:'yes'},ink:[[],[[[10,20]]],[]]}),true);
assert.equal(a.qualifies(es,{fields:{},ink:[[[[0,0]]],[[[1,1]]],[[[2,2]]]]}),true);
assert.equal(a.qualifies(es,{fields:{},ink:[[[[NaN,0]]],[],[]]}),false);
for(let i=3;i<=20;i++){a.recordBlog({id:'lesson-'+i,mode:'free'},{fields:{body:'a'.repeat(100)}});assert.equal(a.blogProgress().rank.id,i<5?'green':i<10?'bronze':i<15?'silver':i<20?'gold':'diamond');}
assert.equal(a.blogProgress().next,null);
const usage=context.window.ActivityUsage;assert.equal(usage.visit('pizza',100),true);assert.equal(usage.visit('pizza',101),false);assert.equal(usage.visit('pizza',1800100),true);assert.equal(usage.get('pizza').visits,2);assert.equal(usage.get('sandwich').visits,0);
context.window.ActivityAutosave.write=()=>false;assert.equal(a.recordBlog({id:'fail',mode:'free'},{fields:{body:'a'.repeat(100)}}),false);
data.set(a.key,'broken');assert.equal(a.blogProgress().count,0);
console.log('Achievement thresholds, mixed ES input, permanent credit, deduplication, invalid storage and visit cooldown passed.');

assert.equal(a.qualifies(es,{typedRows:['One.','Two.','Three.'],fields:{}}),true);
assert.equal(a.qualifies(es,{typedRows:['','',''],fields:{a:'old',c:'old',d:'old'}}),false);
