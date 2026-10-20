/* Actual emitted lesson text, library integrity and all-or-nothing composition.
   No browser/audio-device claims: this runs in Node with minimal scene stubs. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const context=vm.createContext({window:{},document:{},console});
for(const file of ['apps/pizza/config.js','apps/parfait/config.js','apps/sandwich/config.js','apps/class-supplies/config.js','shared/builder.js','shared/layer-builder.js','apps/sandwich/model.js']){
 vm.runInContext(fs.readFileSync(file,'utf8'),context);
}
const w=context.window,manifest=JSON.parse(fs.readFileSync('assets/audio/manifest.json')),catalog=JSON.parse(fs.readFileSync('assets/audio/catalog.json'));
assert.equal(new Set(manifest.map(r=>r.id)).size,manifest.length);
for(const r of manifest){
 const bytes=fs.readFileSync(`assets/audio/en-US/heart-070/${r.id}.mp3`);
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),r.sha256,r.id);
 assert.equal(catalog.clips.find(c=>c.id===r.id)?.prompt,r.prompt,r.id+' prompt');
}
const outputs=new Set();
const root={querySelector:()=>({setAttribute(){}}),querySelectorAll:()=>[]};
const capture=text=>outputs.add(text);
const config=w.PIZZA_CONFIG;
const pizza={config,root,state:{toppings:{},sauce:null},setSentence:capture};
for(const sauce of config.sauces){
 pizza.state.sauce=sauce.id;
 for(const advanced of [false,true]){
  pizza.advancedMode=advanced;
  for(const level of [0,1,2,3]){
   pizza.state.toppings=Object.fromEntries(config.toppings.map(t=>[t.id,level]));
   w.FoodBuilder.prototype.updateSentence.call(pizza);
  }
  for(const topping of config.toppings)for(const level of [1,2,3]){
   pizza.state.toppings=Object.fromEntries(config.toppings.map(t=>[t.id,t===topping?level:0]));
   w.FoodBuilder.prototype.updateSentence.call(pizza);
  }
 }
}
const parfaitConfig=w.PARFAIT_CONFIG;
const parfait={config:parfaitConfig,root,activeLayer:0,activeSlot:0,state:{layers:[[null,null]]},setSentence:capture,updateButton(){}};
for(const base of parfaitConfig.bases)for(const sauce of parfaitConfig.sauces)for(const fruit of [null,...parfaitConfig.toppings]){
 parfait.state.base=base.id;parfait.state.sauce=sauce.id;parfait.state.layers=[[fruit?.id||null,null]];
 w.LayerBuilder.prototype.updateSentence.call(parfait);
}
// PLAY size/count template; actual shared method including Parfait scoop forms.
const scoops=parfaitConfig.bases.filter(b=>!b.empty).map(b=>({id:'scoop-'+b.id,label:b.label,countSingular:b.buttonLabel+' scoop',countPlural:b.buttonLabel+' scoops'}));
for(const cfg of [config,parfaitConfig]){
 const creativeCatalog=[...cfg.toppings,...(cfg===parfaitConfig?scoops:[])];
 const play={config:cfg,root,state:{sauce:cfg.sauces[0].id},setSentence:capture,creative:{active:true,catalog:creativeCatalog,items:[]}};
 for(const item of creativeCatalog)for(const count of [1,2,21,99,100,101,120])for(const scale of [.1,2,10]){
  play.creative.items=Array.from({length:count},()=>({topping:item.id,scale}));
  w.FoodBuilder.prototype.updateSentence.call(play);
 }
}
for(const item of w.SANDWICH_CONFIG.toppings)for(const source of item.sources){
 outputs.add(w.SandwichLesson.describe([{topping:item.id,source}],w.SANDWICH_CONFIG,true).sentence);
}
const sandwichItems=w.SANDWICH_CONFIG.toppings.map(item=>({topping:item.id,source:item.sources[0]}));
outputs.add(w.SandwichLesson.describe(sandwichItems,w.SANDWICH_CONFIG,true).sentence);
outputs.add(w.SandwichLesson.describe([{topping:'apple',source:'missing'}],w.SANDWICH_CONFIG,true).sentence);
outputs.add(w.SandwichLesson.describe([],w.SANDWICH_CONFIG).sentence);
// Class Supplies article and grouped-count forms, including every item and color.
for(const noun of ['pencil case',...w.Supplies.config.toppings.map(t=>t.label)]){
 outputs.add(`I have ${/^[aeiou]/.test(noun)?'an':'a'} ${noun}.`);
 for(const color of Object.keys(w.Supplies.colors))outputs.add(`I have ${/^[aeiou]/.test(color)?'an':'a'} ${color} ${noun}.`);
}
for(const item of w.Supplies.config.toppings)for(const n of [1,2,21,120]){
 outputs.add(`I have 1 blue pencil case and ${n} red ${n===1?item.label:item.countPlural}.`);
}
for(const base of ['https://example.test/assets/audio/library.js','file:///example/assets/audio/library.js']){
 const libraryWindow={};vm.runInNewContext(fs.readFileSync('assets/audio/library.js','utf8'),{window:libraryWindow,document:{currentScript:{src:base}},URL});
 const lib=libraryWindow.ActivityHubAudio;
 const ids=text=>Array.from(lib.resolveSequence(text)||[lib.resolve(text)],url=>url&&new URL(url).pathname.split('/').pop().replace('.mp3',''));
 for(const text of outputs){
  const sequence=lib.resolveSequence(text)||[lib.resolve(text)];
  assert.ok(sequence?.length&&sequence.every(Boolean),text);
  for(const url of sequence){
   const u=new URL(url),id=u.pathname.split('/').pop().replace('.mp3','');
   const record=manifest.find(r=>r.id===id);assert.ok(record,id);
   assert.equal(u.searchParams.get('v'),record.sha256.slice(0,12),text);
   assert.ok(u.href.startsWith(base.slice(0,base.lastIndexOf('/')+1)),u.href);
  }
 }
 for(let n=0;n<=120;n++){
  const expected=n<=20||n%10===0&&n<100||n===100?[n]:n>100?[100,n-100]:[Math.floor(n/10)*10,n%10];
  assert.deepEqual(ids(`I have ${n} pens.`),['i-have',...expected.map(n=>'number-'+n),'pens']);
 }
 assert.deepEqual(ids('My sandwich is an AHL. A is for apple.'),['my-sandwich-is-an','letter-a','letter-h','letter-l','letter-a','is-for','apple']);
 assert.deepEqual(ids('I have a pencil case and an eraser.'),['i-have','a','pencil-case','and','an','eraser']);
 assert.deepEqual(ids('Do you have a …?'),['do-you-have-a']);
 assert.deepEqual(ids('Tell me about your sandwich.'),['tell-me-about-your-sandwich']);
 for(const location of ['Aichi','Aomori','Gunma','Hokkaido','Hyogo','Ibaraki','Iwate','Saitama','Tochigi']){
  assert.equal(ids(`My sandwich is a T. T is for tomato. It's from ${location}.`).at(-1),'source-'+location.toLowerCase());
 }
 assert.ok(lib.resolveSequence("My sandwich is a T. It's from the Philippines."));
 assert.ok(lib.resolveSequence("My sandwich is a T. It’s from New Zealand."));
 for(const text of ['I have 121 pens.','I have 01 pens.','I have 1.5 pens.','I have -1 pens.','I have a unicorn.','I want cheese and something unknown.','My sandwich is a Z.','My sandwich is a T. It is from Atlantis.','Do you have a red pen?','Do you have a eraser?','Read this arbitrary sentence.']){
  assert.equal(lib.resolveSequence(text),null,text);
 }
}
console.log(`PASS: ${outputs.size} emitted/template sentence variants, counts 0–120, initials/articles, corrected places, fallback and all ${manifest.length} recording hashes.`);
