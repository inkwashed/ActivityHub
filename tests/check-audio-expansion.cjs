/* Approved production-library coverage for Town and Paper Craft sentences. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const catalog=JSON.parse(fs.readFileSync('assets/audio/catalog.json')),ctx={window:{}};
for(const file of ['apps/my-town/model.js','apps/paper-craft/config.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);
const source=fs.readFileSync('assets/audio/library.js','utf8');
const w={};vm.runInNewContext(source,{window:w,document:{currentScript:{src:'https://example.test/assets/audio/library.js'}},URL});const lib=w.ActivityHubAudio;
const supported=text=>{const clips=lib.resolveSequence(text)||[lib.resolve(text)];assert.ok(clips?.length&&clips.every(Boolean),text);for(const url of clips){const file=new URL(url).pathname.slice(1);assert.ok(fs.existsSync(file),text+': '+file);}return Array.from(clips)};
for(const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'){
 const urls=supported('letter '+letter);
 assert.equal(urls.length,2);
 assert.ok(urls[0].includes('/letter.mp3?'));
 assert.ok(urls[1].includes('/letter-'+letter.toLowerCase()+'.mp3?'));
 supported('letter '+letter+'s');
}
assert.equal(lib.resolveSequence('letter Ñ'),null);
assert.ok(lib.resolve('a').includes('/a.mp3?'));
const model=ctx.window.TownModel;
for(const place of model.places){supported(place);supported(model.pluralPlace(place));supported('Where is the '+place+'?');for(let n=1;n<=12;n++)supported(model.inventory(Array(n).fill(place)));}
supported(model.inventory([]));supported('What do you have in your town?');
const nums=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
for(const word of nums)for(const prefix of ['Go straight for','Continue'])supported(`${prefix} ${word} ${word==='one'?'block':'blocks'}.`);
supported('Go straight for two blocks. Turn right. Cross the bridge. Continue one block. Cross the tracks. You can see it on your left.');
supported('Turn left. You can see it on your right.');
for(const item of ctx.window.PaperCraft.config.toppings){for(const color of Object.keys(ctx.window.PaperCraft.colors))for(const n of [1,2,12,120])supported(`I want ${n} ${color} ${n===1?item.countSingular:item.countPlural}.`);}
const n=supported('I want 2 letter Ns and 3 red letter Os.');assert.ok(n.some(url=>url.includes('letter-n-plural'))&&n.some(url=>url.includes('letter-o-plural')));assert.ok(supported('I want a letter A.').some(url=>url.includes('letter-a.mp3')));
for(const bad of ['We have a unicorn.','Where is the moon?','Where is the …?','Go straight for … blocks.','Turn right. apple.','Go straight for thirteen blocks.','Cross the river.','I want a letter Ñ.','I want 121 circles.'])assert.equal(lib.resolveSequence(bad),null,bad);
const live={};vm.runInNewContext(source,{window:live,document:{currentScript:{src:'https://example.test/assets/audio/library.js'}},URL});const approvedIds=new Set(JSON.parse(fs.readFileSync('assets/audio/manifest.json')).map(x=>x.id));
for(const [text,ids] of [['We have a park.',['we-have','a','park']],['I want 2 letter Ns.',['i-want','number-2','letter-n-plural']],['Turn right.',['turn-right']]]){
 if(ids.some(id=>!approvedIds.has(id)))assert.equal(live.ActivityHubAudio.resolveSequence(text),null);
 else assert.ok(live.ActivityHubAudio.resolveSequence(text)||live.ActivityHubAudio.resolve(text));
}
console.log('PASS: approved recording coverage for all Town places/counts/questions/routes and 1,560 colored shape/letter forms; plural letters, exact routes and all-or-nothing fallback. Unknown text still triggers whole-text fallback.');
