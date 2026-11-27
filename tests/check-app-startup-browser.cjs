const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const fs=require('node:fs'),path=require('node:path'),http=require('node:http');const root=path.resolve(__dirname,'..');const server=http.createServer((req,res)=>{try{let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404);res.end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{const routes=['apps/pizza','apps/parfait','apps/sandwich','apps/class-supplies','apps/paper-craft','apps/avatar','apps/my-town','apps/school-tour','apps/post','myblog/journal','_dev/builder'];
for(const route of routes){
 const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/'+route+'/');assert.equal(await p.locator('#app-startup-error').count(),0,route+' normal '+errors.join(';'));
 const failure=route.includes('pizza')||route.includes('parfait')||route.includes('sandwich')?'builder.js':route.includes('_dev')?'lab.js':'app.js';
 await p.route('**/'+failure+'*',r=>new URL(r.request().url()).searchParams.has('__app_fresh')?r.continue():r.abort());await p.reload();await p.locator('#app-startup-error').waitFor();
 await p.evaluate(()=>{localStorage.setItem('saved-creation-test','preserve');sessionStorage.setItem('session-test','preserve');});
 await p.getByRole('button',{name:'Load fresh files',exact:true}).click();await p.waitForFunction(()=>window.AppStartup&&window.AppStartup.isReady());
 assert.deepEqual(await p.evaluate(()=>[localStorage.getItem('saved-creation-test'),sessionStorage.getItem('session-test')]),['preserve','preserve'],route+' storage');await p.close();
}
console.log('PASS 11 app/Journal/Lab normal starts, blocked core scripts, fresh recovery and saved storage');
}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1});
