const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context=vm.createContext({TextEncoder,TextDecoder,btoa,atob,URL,location:{href:'https://example.org/'},document:{createElement:()=>({getContext:()=>({font:'18px Georgia',measureText(t){return {width:t.length*parseFloat(this.font.match(/([\d.]+)px/)[1])*.55}}})})}});
vm.runInContext(fs.readFileSync('apps/post/data.js','utf8')+'\n'+fs.readFileSync('apps/post/app.js','utf8').split("let helpButton=null")[0],context);
function evaluate(s){return vm.runInContext(s,context)}
assert.equal(evaluate('JSON.stringify(decodeCard(encodeCard(defaults)))===JSON.stringify(defaults)'),true);
assert.equal(evaluate(`(()=>{const s={...defaults,message:'ありがとう 💌\\nBonne année <script>alert(1)</script>'};return JSON.stringify(decodeCard(encodeCard(s)))===JSON.stringify(s)})()`),true);
for(const expression of ['decodeCard("bad!")','decodeCard("A".repeat(8001))','validate({...defaults,primaryColor:"#e1a8fq"})','validate({...defaults,message:"x".repeat(501)})','validate({...defaults,headingSize:Infinity})','validate({...defaults,border:"__proto__"})','validate({...defaults,message:"\\u0000"})'])assert.throws(()=>evaluate(expression));
assert.equal(evaluate(`escapeXML('<script>"&')`),'&lt;script&gt;&quot;&amp;');
assert.equal(evaluate('encodeCard({...defaults,message:"あ".repeat(500)}).length<8000'),true);
console.log('Passed: card round-trip, Japanese/emoji/newlines, hostile text escaping, malformed links, invalid colours/options/sizes, maximum-length link.');

const legacyToken=Buffer.from(JSON.stringify([1,'christmas','portrait','#cc0000','#ffffff','Merry Christmas','& Happy New Year','An older saved message','','','Georgia','Arial',true,false,false,false,false,false,40,24,'classic','none'])).toString('base64url');
const legacy=evaluate(`decodeCard(${JSON.stringify(legacyToken)})`);
assert.equal(legacy.headingColor,'#ffffff');assert.equal(legacy.subheadingColor,'#ffffff');assert.equal(legacy.accentFinish,'solid');assert.equal(legacy.primaryColor,'#cc0000');
assert.equal(evaluate(`(()=>{const card={...defaults,headingColor:'#123456',subheadingColor:'#654321',accentFinish:'metallic'};return JSON.stringify(decodeCard(encodeCard(card)))===JSON.stringify(card)})()`),true);
for(const field of ['headingColor','subheadingColor'])assert.throws(()=>evaluate(`validate({...defaults,${field}:'url(evil)'})`));
assert.throws(()=>evaluate("validate({...defaults,accentFinish:'unknown'})"));
for(const theme of ['christmas','birthday','wedding','graduation','thankyou'])evaluate(`applyOccasion('${theme}');validate(state)`);
console.log('Passed: original version-1 links, independent text colours and metal finishes, all occasion templates.');
const v2Token=evaluate("btoa(JSON.stringify([2,...version2Keys.map(k=>({...defaults,effect:'stars'})[k])])).replace(/=/g,'').replace(/\\+/g,'-').replace(/\\//g,'_')");
assert.equal(evaluate(`decodeCard(${JSON.stringify(v2Token)}).particleColor`),'#bac5cd');
assert.equal(evaluate("decodeCard(encodeCard({...defaults,effect:'snow',particleColor:'#123456'})).particleColor"),'#123456');
assert.throws(()=>evaluate("validate({...defaults,particleColor:'url(evil)'})"));
assert.equal(evaluate("(()=>{state={...defaults,animation:'stars',particleColor:'#123456'};return svgCard('front').includes('fill=\"#123456\"')})()"),true);
console.log('Passed: version-2 colour migration, custom particle colour sharing, validation and still-image rendering.');

assert.equal(evaluate("JSON.stringify(wrap('Merry Christmas',100,40,'Georgia'))"),JSON.stringify(['Merry','Christmas']));
assert.equal(evaluate("JSON.stringify(wrap('One\\n\\nTwo words',200,18,'Georgia'))"),JSON.stringify(['One','','Two words']));
for(const orientation of ['portrait','landscape'])for(const theme of ['christmas','birthday','wedding','graduation','thankyou']){
 const svg=evaluate(`svgCard('front',false,occasionTemplate('${theme}','${orientation}'),'test')`);
 const available=orientation==='portrait'?208:328;
 for(const text of svg.matchAll(/<text [^>]*font-size="([\d.]+)"[^>]*>(.*?)<\/text>/g)){
  for(const span of text[2].matchAll(/<tspan[^>]*>(.*?)<\/tspan>/g)){
   const decoded=span[1].replace(/&amp;/g,'&');
   assert.ok(decoded.length*Number(text[1])*.55<=available+.001,'Template text fits its width');
  }
 }
 assert.ok(!svg.includes('>Christma<'));
}
console.log('Passed: whole-word wrapping, paragraph breaks, and template text fitting in both orientations.');
for(const pattern of ['none','dots','stripes','zigzag','hearts','stars']){
 assert.equal(evaluate(`decodeCard(encodeCard({...defaults,backgroundPattern:'${pattern}'})).backgroundPattern`),pattern);
 for(const colour of ['#fff9ef','#496d68']){
 const svg=evaluate(`svgCard('front',false,{...defaults,backgroundPattern:'${pattern}',primaryColor:'${colour}'})`);
 assert.equal(svg.includes('<pattern'),pattern!=='none');
 assert.ok(!svg.includes('undefined'));
 }
}
assert.throws(()=>evaluate("validate({...defaults,backgroundPattern:'invalid'})"));
console.log('Passed: all background patterns, light/dark colours, sharing and invalid-pattern validation.');
assert.equal(evaluate("wrap('お誕生日おめでとう',50,18,'Palatino').join('')"),'お誕生日おめでとう');
assert.ok(evaluate("wrap('お誕生日おめでとう',50,18,'Palatino').length>1"));
assert.equal(evaluate("wrap('おめでとう！',45,18,'Palatino').some(line=>line.startsWith('！'))"),false);
assert.equal(evaluate("wrap('「おめでとう」',45,18,'Palatino').some(line=>line.endsWith('「')||line.startsWith('」'))"),false);
assert.equal(evaluate("wrap('日本語HappyBirthday日本語',70,18,'Palatino').some(line=>line.includes('HappyBirthday'))"),true);
assert.equal(evaluate("JSON.stringify(wrap('ありがとう\\nThank you',500,18,'Palatino'))"),JSON.stringify(['ありがとう','Thank you']));
console.log('Passed: Japanese wrapping, punctuation grouping, intact English words and manual line breaks.');
assert.equal(evaluate("(()=>{const c={...defaults,messageFont:'Caveat',messageColor:'#123456',messageSize:22,messageBold:true,messageItalic:true,messageUnderline:true,messageFinish:'metallic'};return JSON.stringify(decodeCard(encodeCard(c)))===JSON.stringify(c)})()"),true);
assert.ok(evaluate("svgCard('back',false,{...defaults,messageFont:'Caveat',messageFinish:'metallic'}).includes('url(#card-message-metal)')"));
assert.throws(()=>evaluate("validate({...defaults,messageSize:99})"));
assert.throws(()=>evaluate("validate({...defaults,phraseChoice:'999'})"));
console.log('Passed: message style serialization, metallic back rendering and input validation.');

assert.equal(evaluate("(()=>{const c={...defaults,effect:'glow',animation:'fireworks'};return JSON.stringify(decodeCard(encodeCard(c)))===JSON.stringify(c)})()"),true);
assert.ok(evaluate("svgCard('front',true,{...defaults,effect:'glow',animation:'fireworks'}).includes('card-firework')"));
assert.ok(evaluate("!svgCard('front',false,{...defaults,animation:'fireworks'}).includes('@keyframes')"));
console.log('Passed: independent glow/fireworks sharing, animated preview and static export.');
assert.equal(evaluate("(()=>{state={...defaults,heading:'My own greeting',subheading:'For you',message:'My own message',to:'Dear Sam,',from:'Love,',sender:'Alex'};applyOccasion('wedding');return state.heading==='My own greeting'&&state.subheading==='For you'&&state.message==='My own message'&&state.sender==='Alex'&&state.primaryColor===themeColorDefaults.wedding.primary})()"),true);
assert.equal(evaluate("(()=>{resetMessageToTemplate();return state.message===themeStyleDefaults.wedding.message&&state.sender===''&&messageResetUndo.message==='My own message'})()"),true);
assert.equal(evaluate("(()=>{state=occasionTemplate('christmas');applyOccasion('birthday');return state.heading===phrases.birthday[0].heading&&state.message===themeStyleDefaults.birthday.message})()"),true);
console.log('Passed: custom text preservation, template sample updates, and undoable message reset.');

assert.equal(evaluate("(()=>{state={...defaults,messageFont:'Caveat',messageColor:'#123456',messageSize:24,messageBold:true,messageItalic:true,messageUnderline:true,messageFinish:'metallic'};const before=messageResetKeys.filter(k=>k!=='message'&&k.startsWith('message')).map(k=>state[k]);applyOccasion('graduation');return JSON.stringify(before)===JSON.stringify(messageResetKeys.filter(k=>k!=='message'&&k.startsWith('message')).map(k=>state[k]))})()"),true);

// Exercise PNG text rendering without browser-only canvas dependencies.
const exportSource=fs.readFileSync('apps/post/app.js','utf8');
vm.runInContext(exportSource.slice(exportSource.indexOf('function paintExportText('),exportSource.indexOf('async function downloadPNG(')),context);
context.exportCalls=[];
context.exportContext={measureText:text=>({width:text.length*10,actualBoundingBoxLeft:text.length*5,actualBoundingBoxRight:text.length*5,actualBoundingBoxAscent:16,actualBoundingBoxDescent:4}),fillText:(...args)=>context.exportCalls.push(['text',...args]),fillRect:(...args)=>context.exportCalls.push(['underline',...args]),createLinearGradient:(...args)=>{context.exportCalls.push(['gradient',...args]);return {addColorStop:(...stop)=>context.exportCalls.push(['stop',...stop])}}};
const attributeNode=attributes=>({getAttribute:name=>attributes[name]??null});
context.exportNode={...attributeNode({'font-size':'20','font-style':'italic','font-weight':'700','font-family':'Caveat, cursive','text-anchor':'middle',y:'60',fill:'url(#message-metal)','text-decoration':'underline'}),querySelectorAll:()=>['Hello','ありがとう'].map((text,i)=>({...attributeNode({x:'140',dy:i?'26':'0'}),textContent:text}))};
context.exportSvg={getElementById:()=>({querySelectorAll:()=>[attributeNode({offset:'0','stop-color':'#123456'}),attributeNode({offset:'1','stop-color':'#ffffff'})]})};
evaluate('paintExportText(exportContext,exportNode,exportSvg)');
assert.equal(context.exportContext.font,'italic 700 20px Caveat, cursive');
assert.deepEqual(context.exportCalls.filter(c=>c[0]==='text'),[['text','Hello',140,60],['text','ありがとう',140,86]]);
assert.deepEqual(context.exportCalls.find(c=>c[0]==='gradient'),['gradient',115,44,165,90]);
assert.equal(context.exportCalls.filter(c=>c[0]==='underline').length,2);
assert.equal(context.exportCalls.filter(c=>c[0]==='stop').length,2);
assert.ok(!exportSource.includes('embeddedFontStyles'),'PNG export must not fetch fonts on file URLs');
console.log('Passed: PNG text positions, Japanese text, font styles, metallic gradients, and underlines.');
