/* Merge current app vocabulary without duplicating shared words. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),entries=new Map();
function add(text,app){if(!text)return;const id=text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');if(!entries.has(id))entries.set(id,{id,text,prompt:text==='BBQ sauce'?'Barbecue sauce.':text.replace(/[.?!]$/,'')+(text.endsWith('?')?'?':'.'),apps:[]});if(!entries.get(id).apps.includes(app))entries.get(id).apps.push(app);}
for(const app of ['pizza','parfait']){
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`apps/${app}/config.js`),'utf8'),context);
 const config=context.window[app.toUpperCase()+'_CONFIG'];
 for(const item of [...config.toppings,...config.sauces,...(config.bases||[])])for(const text of [item.label,item.buttonLabel,item.countSingular,item.countPlural])add(text,app);
 for(const item of config.bases||[])if(!item.empty){add(item.buttonLabel+' scoop',app);add(item.buttonLabel+' scoops',app);}
 add('What do you want?',app);
}
const target=path.join(root,'assets/audio/catalog.json');
const previous=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):null;
const clips=[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id)).map(entry=>({...entry,...previous?.clips.find(x=>x.id===entry.id),apps:entry.apps}));
for(const old of previous?.clips||[])if(!entries.has(old.id))clips.push({...old,apps:[]});
fs.writeFileSync(target,JSON.stringify({language:'en-US',voice:'af_heart',speed:0.7,sampleRate:24000,clips},null,2)+'\n');
console.log(`${clips.length} unique clips catalogued`);
