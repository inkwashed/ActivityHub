/* Behavioral isolation/first-paint checks and WCAG token contrast, no browser needed. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'shared/theme.js'),'utf8');
function fixture(initial,blocked=false){
 const data=new Map(Object.entries(initial||{})),events={},attrs={},writes=[];
 const context={document:{documentElement:{setAttribute:(k,v)=>attrs[k]=v},querySelectorAll:()=>[],addEventListener:(k,f)=>events[k]=f},window:{localStorage:{getItem:k=>{if(blocked)throw Error('blocked');return data.get(k)??null;},setItem:(k,v)=>{if(blocked)throw Error('blocked');writes.push(k);data.set(k,v);}},addEventListener:(k,f)=>events[k]=f}};
 vm.runInNewContext(source,context);return {context,data,events,attrs,writes,theme:context.window.ActivityTheme};
}
for(const value of [undefined,'green','blue','maroon','gold','purple','<invalid>']){
 const f=fixture(value?{'letseigo.theme':value}:{});assert.equal(f.attrs['data-ah-theme'],['blue','maroon','gold','purple'].includes(value)?value:'green');assert.equal(f.writes.length,0);if(value)assert.equal(f.data.get('letseigo.theme'),value);
}
const f=fixture({'letseigo.profile':'name sentinel','letseigo.app.pizza':'creation sentinel'});
for(const name of ['green','blue','maroon','gold','purple']){assert.equal(f.theme.set(name),true);assert.equal(f.data.get('letseigo.theme'),name);assert.equal(fixture(Object.fromEntries(f.data)).theme.current,name);}
assert.equal(f.theme.set('unknown'),false);assert.equal(f.data.get('letseigo.profile'),'name sentinel');assert.equal(f.data.get('letseigo.app.pizza'),'creation sentinel');assert.ok(f.writes.every(k=>k==='letseigo.theme'));
f.data.set('letseigo.theme','blue');f.events.storage({key:'letseigo.theme'});assert.equal(f.theme.current,'blue');f.data.set('letseigo.theme','maroon');f.events.pageshow();assert.equal(f.theme.current,'maroon');f.data.delete('letseigo.theme');f.events.storage({key:null});assert.equal(f.theme.current,'green');
const blocked=fixture({},true);blocked.theme.set('purple');blocked.events.pageshow();assert.equal(blocked.theme.current,'purple');
const css=fs.readFileSync(path.join(root,'shared/tokens.css'),'utf8');
const blocks=[...css.matchAll(/:root(?:\[data-ah-theme="(\w+)"\])?\s*\{([^}]+)\}/g)];let base={};const palettes={};
for(const m of blocks){const values=Object.fromEntries([...m[2].matchAll(/--ah-([\w-]+):\s*(#[\da-f]{6})/g)].map(v=>[v[1],v[2]]));if(!m[1])base={...base,...values};else palettes[m[1]]=values;}palettes.green=base;
function lum(hex){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function ratio(a,b){const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
let minimum=99;
for(const [name,overrides] of Object.entries(palettes)){
 const t={...base,...overrides};
 for(const bg of ['canvas','surface','play-surface','hover','pressed','secondary','secondary-hover','secondary-pressed','selected']){
  for(const ink of ['ink','muted'])assert.ok(ratio(t[ink],t[bg])>=4.5,`${name} ${ink}/${bg}: ${ratio(t[ink],t[bg])}`);
  for(const fg of ['focus','selected-border'])assert.ok(ratio(t[fg],t[bg])>=3,`${name} ${fg}/${bg}: ${ratio(t[fg],t[bg])}`);
  minimum=Math.min(minimum,ratio(t.ink,t[bg]),ratio(t.muted,t[bg]));
 }
 for(const bg of ['surface','canvas','selected','hover'])assert.ok(ratio(t.border,t[bg])>=3,`${name} border/${bg}: ${ratio(t.border,t[bg])}`);
 for(const bg of ['strong','strong-hover'])assert.ok(ratio(t.surface,t[bg])>=4.5,`${name} inverse text`);
 for(const dot of ['theme-green','theme-blue','theme-maroon','theme-gold','theme-purple'])assert.ok(ratio(base[dot],t.surface)>=3,`${name} ${dot}`);
}
for(const app of ['index.html','apps/post/index.html','apps/pizza/index.html','apps/parfait/index.html','apps/sandwich/index.html','apps/class-supplies/index.html','apps/avatar/index.html','apps/mytown/index.html','myblog/NH1-5/index.html','myblog/NH2-4/index.html','myblog/NH6-5/index.html','myblog/journal/index.html','_dev/builder/index.html','docs/style-guide.html']){
 const html=fs.readFileSync(path.join(root,app),'utf8');assert.ok(html.indexOf('theme.js')<html.indexOf('tokens.css')&&html.indexOf('theme.js')>=0,app+' must bootstrap before CSS');assert.ok(!/<script[^>]*(?:async|defer)[^>]*theme\.js/.test(html));
}
console.log(`PASS themes: early restore, validation, no startup writes, isolated saves, unavailable storage, cross-tab/BFCache refresh, all entrypoints; minimum text contrast ${minimum.toFixed(2)}:1.`);
