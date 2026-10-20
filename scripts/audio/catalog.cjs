/* Merge current app vocabulary without duplicating shared words. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),entries=new Map();
function add(text,app){if(!text)return;const id=text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');if(!entries.has(id))entries.set(id,{id,text,prompt:text==='BBQ sauce'?'Barbecue sauce.':text.replace(/[.?!]$/,'')+(text.endsWith('?')?'?':'.'),apps:[]});if(!entries.get(id).apps.includes(app))entries.get(id).apps.push(app);}
for(const app of ['pizza','parfait','sandwich']){
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`apps/${app}/config.js`),'utf8'),context);
 const config=context.window[app.toUpperCase()+'_CONFIG'];
 for(const item of [...config.toppings,...config.sauces,...(config.bases||[])])for(const text of [item.label,item.buttonLabel,item.countSingular,item.countPlural])add(text,app);
 for(const item of config.bases||[])if(!item.empty){add(item.buttonLabel+' scoop',app);add(item.buttonLabel+' scoops',app);}
 add(app==='sandwich'?'Tell me about your sandwich.':'What do you want?',app);
}
// Supplies pronounces item forms and colors separately, not every combination.
{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'apps/class-supplies/config.js'),'utf8'),context);
 const {config,colors}=context.window.Supplies;
 for(const item of config.toppings)for(const text of [item.label,item.countSingular,item.countPlural])add(text,'class-supplies');
 add('pencil case','class-supplies');
 for(const color of Object.keys(colors))add(color,'class-supplies');
 // Prefixes are generated in context and cut before the carrier noun.
 for(const [article,noun] of [['a','pen'],['an','eraser']]){
  add(`Do you have ${article}`,'class-supplies');
  Object.assign(entries.get(`do-you-have-${article}`),{prompt:`Do you have ${article} ${noun}?`,endBeforeWord:noun});
 }
}
const target=path.join(root,'assets/audio/catalog.json');
const previous=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):null;
const clips=[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id)).map(entry=>({...entry,...previous?.clips.find(x=>x.id===entry.id),apps:entry.apps}));
for(const old of previous?.clips||[])if(!entries.has(old.id))clips.push({...old,apps:[]});
fs.writeFileSync(target,JSON.stringify({language:'en-US',voice:'af_heart',speed:0.7,sampleRate:24000,clips},null,2)+'\n');
console.log(`${clips.length} unique clips catalogued`);
