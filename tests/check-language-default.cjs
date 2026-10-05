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
