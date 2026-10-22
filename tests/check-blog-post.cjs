const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.createContext(context);
for(const file of ['shared/blog-ink.js','shared/blog-layout.js','shared/blog-post.js','myblog/NH6-5/config.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const {BlogPost:b,WorldBlogConfig:c}=context.window;
assert.equal(b.sentences(c,b.normalize(c,c.example)).join(' '),"This is my cap. It's from Vietnam. Vietnam is in Asia. Vietnam is a nice country.");
assert.equal(b.normalize(c).fields.item,'');
const custom=b.normalize(c,{fields:{item:'handmade scarf',country:'Peru',continent:'South America',description:'beautiful'}});
assert.equal(b.sentences(c,custom)[2],'Peru ________ South America.');
assert.equal(b.normalize(c,{fields:{item:'x'.repeat(100)}}).fields.item.length,80);
const bad=b.normalize(c,{fields:{item:42,country:{}},images:[{src:'javascript:alert(1)'},{src:'data:image/svg+xml,<svg>'}]});assert.equal(bad.fields.item,'');assert.equal(bad.images.length,0);
assert.equal(b.normalize(c,{fields:{item:'a\nb'}}).fields.item,'a b');
assert.equal(b.normalize(c,{images:Array(7).fill({src:'data:image/jpeg;base64,AAAA'})}).images.length,3);
assert.equal(b.normalize(c,null).images.length,0);
assert.equal(b.safePhoto('data:image/jpeg;base64,AAAA'),true);
assert.equal(b.safePhoto('data:image/jpeg;base64,'+'A'.repeat(700000)),false);
console.log('Blog model checks passed: grammar, free text, corrupt state, image validation and limits.');

assert.equal(b.normalize(c,{images:[{id:'cap'},{src:'data:image/jpeg;base64,AAAA'}]}).images.length,1);
assert.equal(b.normalize(c,c.example).images.length,0);
assert.equal(b.normalize(c,{images:[]}).images.length,0);
vm.runInContext(fs.readFileSync(path.join(root,'myblog/NH1-5/config.js'),'utf8'),context);
const junior=context.window.PlaceBlogConfig;
assert.notEqual(junior.id,c.id);
const draft=b.normalize(junior,{fields:{title:'My\nplace',body:'First paragraph.\r\n\r\nSecond paragraph.'}});
assert.equal(draft.fields.title,'My place');assert.equal(draft.fields.body,'First paragraph.\n\nSecond paragraph.');
assert.equal(b.sentences(junior,draft).join('\n'),'First paragraph.\n\nSecond paragraph.');
assert.equal(b.normalize(junior,{fields:{body:'x'.repeat(2500)}}).fields.body.length,2000);
assert.equal(b.normalize(junior).fields.body,'');assert.equal(junior.sample.paragraphs.length,3);
console.log('PASS: junior-high free composition, paragraph preservation, limits and separate lesson storage.');
const oldJunior=b.normalize(junior,{fields:{title:'Saved title',body:'Saved writing'},images:[{src:'data:image/jpeg;base64,AAAA'}]});
assert.equal(oldJunior.fields.body,'Saved writing');assert.equal(oldJunior.layout,null);assert.equal(oldJunior.images[0].uid,'legacy-0');
const removed=b.normalize(junior,{...oldJunior,layout:[]});assert.equal(removed.layout.length,2);
const customLayout=b.normalize(junior,{...oldJunior,layout:[{key:'photo:legacy-0',col:1,row:2,w:2,h:3},{key:'text',col:0,row:0,w:3,h:1}]});assert.equal(customLayout.layout[0].key,'photo:legacy-0');assert.equal(customLayout.layout[0].h,3);
console.log('PASS: draft migration, stable photo identity and automatic source inclusion and custom designs.');
const es=b.normalize(c);assert.equal(es.showHelp,true);assert.equal(es.fields.body,'\n\n\n');assert.ok(!b.sentences(c,es).join('').includes('sweater'));
const independent=b.normalize(c,{showHelp:true,fields:{country:'Japan'}});assert.equal(independent.fields.country2,'');assert.equal(independent.fields.country3,'');
const noHelp=b.normalize(c,{showHelp:false,fields:{start:'Here is my',item:'hat'}});assert.equal(b.sentences(c,noHelp)[0],'Here is my hat.');assert.equal(noHelp.fields.start,'Here is my');
console.log('PASS ES placeholders are not answers, independent countries, help persistence and authored frames.');

const helped=b.normalize(c,{showHelp:true,fields:{item:'a toy'}});const unhelped=b.normalize(c,{...helped,showHelp:false});assert.equal(b.sentences(c,helped)[0],'________ a toy.');assert.equal(b.sentences(c,helped).join('\n'),b.sentences(c,unhelped).join('\n'));

const continuous=b.normalize(c,{typedRows:['This is my hat.', '', 'x'.repeat(400), 42]});
assert.equal(continuous.fields.body.split('\n')[0],'This is my hat.');
assert.equal(continuous.typedRows[2].length,320);
assert.equal(continuous.typedRows[3],'');
assert.equal(b.normalize(c,{...continuous,typedRows:['','','','']}).fields.body,'\n\n\n');

const countryRow=c.rows[2];
assert.equal(b.countryHint(c,countryRow,'Japan ').consumed,'New Zealand '.length);
assert.equal(b.countryHint(c,countryRow,'Japan is ').consumed,'New Zealand is '.length);
assert.ok(!b.countryHint(c,countryRow,'New ').warning);
assert.ok(b.countryHint(c,countryRow,'Jappan ').warning);
assert.ok(b.countryHint(c,countryRow,'Jappan',true).warning);
assert.ok(!b.countryHint(c,countryRow,'the United States ').warning);
assert.equal(b.countryHint(c,c.rows[1],"It's from Japan.").consumed,"It's from New Zealand.".length);

for(const ending of [" is", " is in ", " is in Oceania."]){
 const hint=b.countryHint(c,countryRow,"New Hampshire"+ending);
 assert.equal(hint.consumed,"New Zealand".length+ending.length);
 assert.equal(hint.warning.end,"New Hampshire".length);
}
assert.equal(b.countryHint(c,c.rows[1],"It\'s from New Hampshire.").consumed,"It\'s from New Zealand.".length);

const wordSample=[{text:'This is ',variable:false},{text:'my sweater.',variable:true}];
const suffix=text=>wordSample.map(x=>x.text).join('').slice(b.wordHint(wordSample,text).consumed);
assert.equal(suffix('This is a'),' sweater.');
assert.equal(suffix('This is an'),' sweater.');
assert.equal(suffix('This is a '),'sweater.');
assert.equal(suffix('This is a h'),'');
assert.equal(suffix('This is a hat.'),'');
assert.equal(suffix('This is my sw'),'eater.');
assert.equal(suffix('This is my '),'sweater.');

assert.equal(b.phraseWarnings(c,c.rows[0],'Thes is a hat.')[0].end,4);
assert.equal(b.phraseWarnings(c,c.rows[0],'Thi').length,0);
assert.equal(b.phraseWarnings(c,c.rows[0],'Thi',true).length,1);
assert.equal(b.phraseWarnings(c,c.rows[0],'This is a Paddington Bear toy.').length,0);
assert.equal(b.phraseWarnings(c,c.rows[2],'Japan iz in Asia.')[0].start,6);
assert.equal(b.phraseWarnings(c,c.rows[3],'New Zealand is a very beautiful country.').length,0);
assert.equal(b.phraseWarnings(c,c.rows[1],"It’s from Japan.").length,0);

const geographySample=[{text:'New Zealand',variable:true},{text:' is in',variable:false},{text:' Oceania.',variable:true}];
assert.equal(geographySample.map(p=>p.text).join('').slice(b.wordHint(geographySample,'New Y').consumed),' is in Oceania.');
assert.equal(geographySample.map(p=>p.text).join('').slice(b.wordHint(geographySample,'New Zealand is in A').consumed),'');
assert.ok(!b.continentHint(c,c.rows[2],'Japan is in Asia.').warning);
assert.ok(!b.continentHint(c,c.rows[2],'Japan is in North ').warning);
assert.ok(!b.continentHint(c,c.rows[2],'Japan is in South America.').warning);
assert.ok(b.continentHint(c,c.rows[2],'Japan is in Asai.').warning);
assert.ok(b.continentHint(c,c.rows[2],'Japan is in Asai',true).warning);
assert.ok(!b.continentHint(c,c.rows[2],'Japan is in A').warning);

assert.equal(b.capitalizationWarnings(c,c.rows[2],'new zealand is in north america.').map(w=>w.start).join(','),'0,4,18,24');
assert.equal(b.capitalizationWarnings(c,c.rows[2],'New Zealand is in North America.').length,0);
assert.equal(b.capitalizationWarnings(c,c.rows[2],'the United States is in Asia.').length,0);
assert.equal(b.capitalizationWarnings(c,c.rows[2],'usa is in asia.').length,4);
assert.equal(b.capitalizationWarnings(c,c.rows[2],'jappan is in Asai.').length,0);
