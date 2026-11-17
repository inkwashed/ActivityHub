/* Make an offline single-file review for viewers that cannot load sibling files. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const folder=path.resolve(process.argv[2]||'work/audio/town-shapes-review-20261116'),root=path.resolve(__dirname,'../..');
const data=file=>'data:audio/mpeg;base64,'+fs.readFileSync(file).toString('base64');
let html=fs.readFileSync(path.join(folder,'review.html'),'utf8'),library=fs.readFileSync(path.join(folder,'review-library.js'),'utf8');
library=library.replace(/"([^"\n]+\.mp3(?:\?v=[^"\n]+)?)"/g,(_,url)=>JSON.stringify(data(path.resolve(folder,decodeURIComponent(url.split('?')[0]))))).replace('const base = document.currentScript.src;','const base = document.baseURI;');
html=html.replace('<script src="review-library.js"></script>',()=>'<script>'+library+'</script>').replace('<script src="../../../shared/pronunciation.js"></script>',()=>'<script>'+fs.readFileSync(path.join(root,'shared/pronunciation.js'),'utf8')+'</script>');
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,url)=>'<style>'+fs.readFileSync(path.resolve(folder,url),'utf8')+'</style>');
html=html.replace(/(<audio controls preload="none" src=")([^"]+)("><\/audio>)/g,(_,before,url,after)=>before+data(path.resolve(folder,url))+after);
html=html.replace('Open this page with the repository folder intact.','This copy contains all recordings and player code; no neighboring files or internet connection are needed.');
assert.ok(!/<(?:script|link|audio)[^>]*(?:src|href)="(?!data:)/.test(html));
const window={};vm.runInNewContext(library,{window,document:{baseURI:'https://example.test/audio-review.html'},URL});
for(const [,text] of html.matchAll(/<p data-sentence>([^<]+)<\/p>/g)){const urls=window.ActivityHubAudio.resolveSequence(text)||[window.ActivityHubAudio.resolve(text)];assert.ok(urls.length&&urls.every(url=>url?.startsWith('data:audio/mpeg;base64,')),text);}
for(const [,source] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new vm.Script(source);
const out=path.join(folder,'audio-review-standalone.html');fs.writeFileSync(out,html);console.log('PASS: bundled scripts parse, every sentence resolves to embedded audio, no external asset dependencies.\n'+out);
