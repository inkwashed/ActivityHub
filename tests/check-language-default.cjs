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
