const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
 const css=fs.readFileSync('shared/tokens.css','utf8');
 const base=css.match(/:root\s*\{([^}]+)\}/)[1];
 const parse=s=>Object.fromEntries([...s.matchAll(/(--ah-[\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
 for(const theme of ['green','blue','maroon','gold','purple'])for(const arranged of [false,true]){
  const section=css.match(new RegExp('\\[data-ah-theme=["\x27]'+theme+'["\x27]\\]\\s*\\{([^}]+)\\}'));
  const palette={...parse(base),...parse(section?.[1]||'')};let active=palette;
  const fills=[],texts=[],borders=[];
  const ctx={measureText:s=>({width:s.length*12}),scale(){},save(){},restore(){},beginPath(){},roundRect(){},clip(){},arc(){},fill(){},drawImage(){},fillRect(){fills.push(this.fillStyle)},fillText(t){texts.push([t,this.fillStyle])},stroke(){borders.push(this.strokeStyle)}};
  class Image{constructor(){this.naturalWidth=this.naturalHeight=100}set src(v){queueMicrotask(()=>{active={};this.onload()})}}
  const env={window:{},Image,document:{documentElement:{},createElement:()=>({getContext:()=>ctx})},getComputedStyle:()=>({getPropertyValue:k=>active[k]||''})};
  vm.runInNewContext(fs.readFileSync('shared/blog-snapshot.js','utf8'),env);
  await env.window.BlogSnapshot({avatar:'avatar',images:['photo'],title:'Title',name:'Name',sentences:['Sentence'],photoKeys:['photo'],...(arranged?{design:{rows:2,blocks:[{key:'text',x:0,y:0,lines:['Sentence']},{key:'photo',x:0,y:132,width:100,height:100}]}}:{})});
  for(const token of ['--ah-surface','--ah-hover','--ah-play-surface'])assert(fills.includes(palette[token]),theme+token);
  assert(texts.some(([t,c])=>t==='Sentence'&&c===palette['--ah-ink']));
  assert.equal(texts.at(-1)[1],palette['--ah-muted']);
  assert.equal(borders.at(-1),palette['--ah-divider']);
 }
 console.log('PASS: Blog export theme palette in simple/arranged layouts for all five themes, captured before asynchronous image loading.');
})().catch(e=>{console.error(e);process.exitCode=1});
