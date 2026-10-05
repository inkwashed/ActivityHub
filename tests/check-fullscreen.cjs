const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('apps/pizza/fullscreen.js','utf8');
async function check(mode){
 const attrs={},events={};let click;
 const button={setAttribute:(k,v)=>attrs[k]=v,addEventListener:(k,fn)=>click=fn};
 const notice={};const page={};
 const doc={documentElement:page,querySelector:s=>s==='#fullscreen'?button:notice,addEventListener:(k,fn)=>events[k]=fn};
 const pref=mode==='webkit';const key=pref?'webkitFullscreenElement':'fullscreenElement';
 if(mode!=='unsupported'){
  page[pref?'webkitRequestFullscreen':'requestFullscreen']=async()=>{if(mode==='denied')throw Error('Denied');doc[key]=page;events[pref?'webkitfullscreenchange':'fullscreenchange']()};
  doc[pref?'webkitExitFullscreen':'exitFullscreen']=async()=>{doc[key]=null;events[pref?'webkitfullscreenchange':'fullscreenchange']()};
 }
 vm.runInNewContext(source,{document:doc,setTimeout:()=>1,clearTimeout:()=>{}});
 assert.equal(attrs['aria-pressed'],'false');await click();
 if(mode==='unsupported'||mode==='denied'){assert.equal(notice.hidden,false);assert.equal(attrs['aria-pressed'],'false');assert(!button.disabled);return}
 assert.equal(attrs['aria-pressed'],'true');assert.equal(attrs['aria-label'],'Exit fullscreen');
 await click();assert.equal(attrs['aria-pressed'],'false');
 await click();doc[key]=null;events[pref?'webkitfullscreenchange':'fullscreenchange']();assert.equal(attrs['aria-label'],'Enter fullscreen');
}
(async()=>{for(const mode of ['standard','webkit','unsupported','denied'])await check(mode);console.log('PASS: fullscreen enter/exit, browser-owned exit, WebKit variant, unsupported and rejected requests.');})();
