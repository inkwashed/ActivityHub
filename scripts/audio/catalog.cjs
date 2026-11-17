/* Merge current app vocabulary without duplicating shared words. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),entries=new Map();
const slug=text=>text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
function add(text,app,id){if(!text)return;id ||= slug(text);if(!entries.has(id))entries.set(id,{id,text,prompt:text==='BBQ sauce'?'Barbecue sauce.':text.replace(/[.?!]$/,'')+(text.endsWith('?')?'?':'.'),apps:[]});if(!entries.get(id).apps.includes(app))entries.get(id).apps.push(app);}
for(const app of ['pizza','parfait','sandwich']){
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,`apps/${app}/config.js`),'utf8'),context);
 const config=context.window[app.toUpperCase()+'_CONFIG'];
 for(const item of [...config.toppings,...config.sauces,...(config.bases||[])])for(const text of [item.label,item.buttonLabel,item.countSingular,item.countPlural])add(text,app);
 for(const item of config.bases||[])if(!item.empty){add(item.buttonLabel+' scoop',app);add(item.buttonLabel+' scoops',app);}
 add(app==='sandwich'?'Tell me about your sandwich.':'What do you want?',app);
 if(app==='sandwich')for(const item of config.toppings){
  const id='letter-'+item.letter.toLowerCase();add(item.letter,app,id);entries.get(id).role='letter';
  for(const source of item.sources){const id='source-'+slug(source);add(source,app,id);entries.get(id).role='source';}
 }
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
// Town words and reusable route sentences come from its maintained model.
{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'apps/my-town/model.js'),'utf8'),context);
 const model=context.window.TownModel;
 for(const name of model.places){add(name,'my-town');add(model.pluralPlace(name),'my-town');}
 for(const phrase of ['What do you have in your town?','We have','Turn left.','Turn right.','Cross the bridge.','Cross the tracks.','You can see it on your left.','You can see it on your right.'])add(phrase,'my-town');
 add('Where is the','my-town');Object.assign(entries.get('where-is-the'),{prompt:'Where is the park?',endBeforeWord:'park'});
 const numbers=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
 for(let i=1;i<=12;i++)for(const prefix of ['Go straight for','Continue'])add(`${prefix} ${numbers[i-1]} ${i===1?'block':'blocks'}.`,'my-town');
 for(const phrase of ['a','an','and'])add(phrase,'my-town');
}
// Paper Craft shares colors/articles/counts and uses a distinct letter-name index.
{
 const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'apps/paper-craft/config.js'),'utf8'),context);
 const {config,colors}=context.window.PaperCraft;
 for(const item of config.toppings){
  if(item.category==='shapes'){add(item.countSingular,'paper-craft');add(item.countPlural,'paper-craft');}
  else {const id='letter-'+item.id.toLowerCase();add(item.id,'paper-craft',id);entries.get(id).role='letter';add(item.countPlural,'paper-craft','letter-'+item.id.toLowerCase()+'-plural');}
 }
 for(const color of Object.keys(colors))add(color,'paper-craft');
 for(const phrase of ['letter','a','an','and','I want','What do you want?','This is for you.'])add(phrase,'paper-craft');
}
const target=path.join(root,'assets/audio/catalog.json');
const previous=fs.existsSync(target)?JSON.parse(fs.readFileSync(target,'utf8')):null;
// Reviewed sentence pieces and number prompts are owned by the catalog, rather
// than app configuration. Preserve their IDs (letter A and article a differ).
for(const old of previous?.clips||[])if(['sentence-part','number'].includes(old.role)){
 const numberConsumers=old.role==='number'?['paper-craft',...(Number(old.text)<=12?['my-town']:[])]:[];
 entries.set(old.id,{...old,apps:[...new Set([...(old.apps||[]),...(entries.get(old.id)?.apps||[]),...numberConsumers])]});
}
const clips=[...entries.values()].sort((a,b)=>a.id.localeCompare(b.id)).map(entry=>({...entry,...previous?.clips.find(x=>x.id===entry.id),apps:entry.apps}));
for(const old of previous?.clips||[])if(!entries.has(old.id))clips.push({...old,apps:[]});
fs.writeFileSync(target,JSON.stringify({language:'en-US',voice:'af_heart',speed:0.7,sampleRate:24000,clips},null,2)+'\n');
console.log(`${clips.length} unique clips catalogued`);
