const fs=require('fs'), vm=require('vm'), assert=require('assert');
const source=fs.readFileSync('shared/i18n.js','utf8');
for(const [preferences, expected] of [
 [{languages:['ja-JP','en-US']},'ja'],
 [{languages:['en-GB','ja']},'en'],
 [{languages:['fr-FR','ja-JP']},'ja'],
 [{languages:['fr-FR','de']},'en'],
 [{languages:[],language:'JA-jp'},'ja'],
 [{},'en']
]){
 const listeners={};const context={navigator:preferences,window:{},Event:class{constructor(type){this.type=type}},document:{documentElement:{},querySelectorAll:()=>[],addEventListener:(k,f)=>listeners[k]=f,dispatchEvent:()=>{}}};
 vm.runInNewContext(source,context);listeners.DOMContentLoaded();
 assert.equal(context.window.ActivityHubI18n.language,expected);
 assert.equal(context.document.documentElement.lang,expected);
 context.window.ActivityHubI18n.setLanguage(expected==='ja'?'en':'ja');
 assert.notEqual(context.window.ActivityHubI18n.language,expected);
}
console.log('PASS: regional language tags, preference ordering, unsupported fallback, missing preferences, and manual override.');
{
 const saved=new Map([['letseigo.language','ja']]),listeners={};
 const context={navigator:{languages:['en-US']},window:{localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)}},Event:class{},document:{documentElement:{},querySelectorAll:()=>[],addEventListener:(k,f)=>listeners[k]=f,dispatchEvent(){}}};
 vm.runInNewContext(source,context);listeners.DOMContentLoaded();assert.equal(context.window.ActivityHubI18n.language,'ja');
 context.window.ActivityHubI18n.setLanguage('en');assert.equal(saved.get('letseigo.language'),'en');
 saved.set('letseigo.language','invalid');vm.runInNewContext(source,context);listeners.DOMContentLoaded();assert.equal(context.window.ActivityHubI18n.language,'en');
 console.log('PASS: saved language overrides browser preference; manual changes persist and invalid values fall back.');
}
// Builder labels stay English, while accessible switch names remain localized.
{
 const elements=['EASY','HARD'].map(text=>({dataset:{i18n:text},textContent:text}));
 const input={checked:true,attrs:{'data-i18n-aria-label':'Hard mode'},getAttribute(k){return this.attrs[k]},setAttribute(k,v){this.attrs[k]=v}};
 const context={window:{},Event:class{},document:{documentElement:{},addEventListener(){},dispatchEvent(){},querySelectorAll:s=>s==='[data-i18n]'?elements:s==='[data-i18n-aria-label]'?[input]:[]}};
 vm.runInNewContext(source,context);vm.runInNewContext(fs.readFileSync('shared/ui-ja.js','utf8'),context);
 for(const checked of [false,true])for(const lang of ['ja','en','ja']){
  input.checked=checked;context.window.ActivityHubI18n.setLanguage(lang);
  assert.deepEqual(elements.map(x=>x.textContent),['EASY','HARD']);assert.equal(input.checked,checked);
  assert.equal(input.attrs['aria-label'],lang==='ja'?'むずかしいモード':'Hard mode');
 }
 for(const app of ['apps/pizza','apps/parfait','apps/sandwich','apps/class-supplies','_dev/builder']){
  const html=fs.readFileSync(app+'/index.html','utf8');assert(html.includes('shared/controls.css'));assert(html.includes('data-i18n-aria-label="Hard mode"'));
 }
 assert(!/html\[lang="ja"\] \.mode-easy/.test(fs.readFileSync('apps/pizza/styles.css','utf8')));
}
console.log('PASS: shared English difficulty labels, localized accessible names, unchanged checked states and five Builder consumers.');
