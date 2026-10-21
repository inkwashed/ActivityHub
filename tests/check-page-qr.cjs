const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class El{
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.attrs={};this.listeners={};this.classList={contains:()=>false}}
 append(...nodes){this.children.push(...nodes)}setAttribute(k,v){this.attrs[k]=v}addEventListener(k,f){this.listeners[k]=f}after(node){this.afterNode=node}showModal(){this.open=true}close(){this.open=false;this.listeners.close()}remove(){this.removed=true}focus(){this.focused=true}select(){this.selected=true}
}
const canvas={width:0,height:0,getContext:()=>({fillRect(){},save(){},restore(){},translate(){},scale(){},fill(){},stroke(){}}),toDataURL:()=> 'data:image/png;base64,test'};
const language=new El('button');language.parentElement=new El('div');const header=new El('header'),body=new El('body');
const ctx={TextEncoder,URL,Path2D:class{},window:{},navigator:{clipboard:{writeText:async x=>ctx.copied=x}},document:{currentScript:{src:'https://letseigo.com/shared/page-qr.js',dataset:{appPath:'/apps/pizza/'}},createElement:tag=>tag==='canvas'?canvas:new El(tag),querySelector:s=>s==='#language'?language:header,body}};
vm.createContext(ctx);for(const file of ['shared/qr.js','shared/page-qr.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
const trigger=language.afterNode;assert.equal(trigger.attrs['aria-haspopup'],'dialog');trigger.listeners.click();
const dialog=body.children[0];assert(dialog.open);const input=dialog.children.find(x=>x.tag==='input');assert.equal(input.value,'https://letseigo.com/apps/pizza/');
const actions=dialog.children.find(x=>x.className==='page-qr-actions');assert.equal(actions.children[0].download,'letseigo-pizza-qr.png');
(async()=>{await actions.children[1].listeners.click();assert.equal(ctx.copied,input.value);ctx.navigator.clipboard.writeText=async()=>{throw Error('blocked')};await actions.children[1].listeners.click();assert(input.focused&&input.selected);dialog.close();assert(trigger.focused&&dialog.removed);console.log('PASS: QR dialog, canonical URL, PNG download, clipboard/fallback, close/focus.');})();
for(const name of ['pizza','parfait','sandwich','avatar','post']){
 const html=fs.readFileSync(`apps/${name}/index.html`,'utf8');assert(html.includes(`data-app-path="/apps/${name}/"`));assert.equal((html.match(/shared\/qr.js/g)||[]).length,1);
}
assert(fs.readFileSync('_dev/builder/index.html','utf8').includes('data-demo="true"'));
for(const path of ['/myblog/NH1-5/','/myblog/NH6-5/']){
 ctx.document.currentScript.dataset.appPath=path;
 vm.runInContext(fs.readFileSync('shared/page-qr.js','utf8'),ctx);
 language.afterNode.listeners.click();
 const latest=body.children.at(-1);assert.equal(latest.children.find(x=>x.tag==='input').value,'https://letseigo.com'+path);
}
