/* Validate prepared review references; never treats pending clips as approved. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const folder=path.resolve(process.argv[2]||'work/audio/town-shapes-review-20261116');
if(!fs.existsSync(path.join(folder,'manifest.json'))){if(process.argv[2])throw Error('Review folder not found: '+folder);console.log('SKIP: prepare the ignored audio review set first.');process.exit(0)}
const records=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'))),catalog=JSON.parse(fs.readFileSync('assets/audio/catalog.json')),approved=new Set(JSON.parse(fs.readFileSync('assets/audio/manifest.json')).map(x=>x.id));
for(const record of records){if(approved.has(record.id))assert.equal(record.review,'approved');assert.equal(record.prompt,catalog.clips.find(x=>x.id===record.id).prompt);assert.equal(record.sha256,crypto.createHash('sha256').update(fs.readFileSync(path.join(folder,record.id+'.mp3'))).digest('hex'));}
const html=fs.readFileSync(path.join(folder,'review.html'),'utf8'),window={};vm.runInNewContext(fs.readFileSync(path.join(folder,'review-library.js'),'utf8'),{window,document:{currentScript:{src:'file://'+path.join(folder,'review-library.js')}},URL});
const samples=[...html.matchAll(/<p data-sentence>([^<]+)<\/p>/g)].map(x=>x[1]);assert.ok(samples.length>=12);
for(const text of samples){const urls=window.ActivityHubAudio.resolveSequence(text)||[window.ActivityHubAudio.resolve(text)];assert.ok(urls.length&&urls.every(Boolean),text);for(const url of urls)assert.ok(fs.existsSync(new URL(url)),url);}
for(const [,src] of html.matchAll(/(?:src|href)="([^"#]+)"/g))assert.ok(fs.existsSync(path.resolve(folder,src)),src);
console.log(`PASS: ${records.length} review provenance/file hashes and ${samples.length} complete review sentences resolve to local audio; all HTML dependencies exist.`);
