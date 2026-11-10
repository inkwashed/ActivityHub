/* Guard established contracts, not arbitrary app artwork or legitimate media rules. */
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const editors=['apps/pizza','apps/parfait','apps/sandwich','apps/class-supplies','_dev/builder'];
function links(html){return [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"?]+)(?:\?[^\"]*)?"/g)].map(m=>path.basename(m[1]));}
function checkOrder(styles,required){let last=-1;for(const name of required){const i=styles.indexOf(name);assert.ok(i>last,`Missing or out-of-order ${name}`);last=i;}}
for(const app of editors){
 const styles=links(fs.readFileSync(path.join(root,app,'index.html'),'utf8'));
 checkOrder(styles,['tokens.css','controls.css','builder-responsive.css','builder-editor.css','builder-workspace.css','builder-panel-workspace.css']);
 for(const file of fs.readdirSync(path.join(root,app)).filter(f=>f.endsWith('.css'))){
  const css=fs.readFileSync(path.join(root,app,file),'utf8').replace(/\/\*[\s\S]*?\*\//g,'');
  for(const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)){
   if(m[1].trim()==='.free-piece')assert.ok(!/(?:^|;)\s*(?:position|width|height|transform|touch-action)\s*:/.test(m[2]),`${app}/${file}: editor geometry belongs in builder-editor.css`);
  }
 }
}
for(const app of ['.',...editors,'apps/avatar','apps/my-town','apps/post','myblog/NH1-5','myblog/NH2-4','myblog/NH6-5','myblog/journal']){
 const styles=links(fs.readFileSync(path.join(root,app,'index.html'),'utf8'));
 checkOrder(styles,['tokens.css','controls.css']);
}
for(const file of ['home.css','shared/blog-post.css',...editors.map(a=>a+'/'+(a==='_dev/builder'?'lab.css':'styles.css')),'apps/avatar/styles.css','apps/my-town/styles.css']){
 const css=fs.readFileSync(path.join(root,file),'utf8');
 assert.ok(!/(?:^|})\s*\.sr-only\s*\{/.test(css),`${file}: use controls.css sr-only`);
 assert.ok(!/[^{}]*(?:expand-icon|collapse-icon)[^{}]*\{/.test(css),`${file}: fullscreen state belongs in controls.css`);
}
assert.throws(()=>checkOrder(['controls.css','tokens.css'],['tokens.css','controls.css']));
assert.throws(()=>checkOrder(['tokens.css'],['tokens.css','controls.css']));
console.log('PASS: editor ownership, shared utilities and stylesheet dependency order (including negative fixtures).');

// The Builder header has one lesson-label owner; Blog keeps its own policy.
for(const dir of ['apps/pizza','apps/parfait','apps/sandwich','apps/class-supplies','apps/avatar','apps/my-town','_dev/builder'])for(const file of fs.readdirSync(path.join(root,dir)).filter(f=>f.endsWith('.css'))){
 const css=fs.readFileSync(path.join(root,dir,file),'utf8');
 assert.ok(!/[^{}]*\.edition[^{}]*\{/.test(css),`${dir}/${file}: Builder lesson label belongs in builder-layout.css`);
}
const header=fs.readFileSync(path.join(root,'shared/builder-layout.css'),'utf8');
assert.match(header,/@media\(max-width:739px\)\{\.ah-builder \.edition\{display:none\}\}/);
for(const file of ['apps/pizza/index.html','apps/pizza/styles.css','apps/pizza/ui-ja.js','shared/builder-create.css','shared/builder-food-panels.css'])assert.ok(!/pantry-footer|A little of this\. A little of that/.test(fs.readFileSync(path.join(root,file),'utf8')));
console.log('PASS: one Builder edition breakpoint and obsolete Pizza slogan removed.');
