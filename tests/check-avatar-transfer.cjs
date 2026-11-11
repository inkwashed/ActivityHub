const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {URLSearchParams}=require('node:url');
const config=fs.readFileSync('apps/avatar/config.js','utf8'),code=fs.readFileSync('apps/avatar/transfer.js','utf8');
function setup({bad=false,id='1234567890abcdef',opener=true}={}){
 const elements=Object.fromEntries(['status','use-selfie','edit-selfie','preview','cancel'].map(x=>['#'+x,{disabled:true,addEventListener(t,f){this[t]=f;}}]));
 const events={},sent=[];let closed=false,timeout;
 const w={opener:opener?{closed:false,postMessage:(msg,target)=>sent.push({msg,target})}:null,addEventListener:(t,f)=>events[t]=f,close:()=>closed=true};
 const c={window:w,location:{search:'?requestId='+id},URLSearchParams,document:{querySelector:x=>elements[x]},setTimeout:f=>(timeout=f,1),clearTimeout:()=>{},renderAvatar:()=>'<svg/>'};
 vm.createContext(c);vm.runInContext(config,c);c.AvatarConfig=w.AvatarConfig;
 c.localStorage={getItem:()=>JSON.stringify({version:1,value:{state:bad?{}:{...w.AvatarConfig.defaults},name:'never share'}})};
 vm.runInContext(code,c);return {elements,events,sent,w,closed:()=>closed,timeout:()=>timeout()};
}
let t=setup();assert.equal(t.sent.length,0);t.elements['#use-selfie'].click();assert.equal(t.sent.length,1);assert.equal(t.sent[0].target,'https://tools.letseigo.com');assert.deepEqual(Object.keys(t.sent[0].msg).sort(),['avatar','requestId','type','version']);
const ack={type:'letseigo.selfie.import.ack',version:1,requestId:'1234567890abcdef'};
t.events.message({origin:'https://evil.example',source:t.w.opener,data:ack});assert.equal(t.closed(),false);
t.events.message({origin:'https://tools.letseigo.com',source:{},data:ack});assert.equal(t.closed(),false);
t.events.message({origin:'https://tools.letseigo.com',source:t.w.opener,data:{...ack,requestId:'wrong'}});assert.equal(t.closed(),false);
t.events.message({origin:'https://tools.letseigo.com',source:t.w.opener,data:ack});assert.equal(t.closed(),true);
for(const opts of [{bad:true},{id:'bad'},{opener:false}]){t=setup(opts);assert.equal(t.elements['#use-selfie'].disabled,true);assert.equal(t.sent.length,0);}
t=setup();t.elements['#use-selfie'].click();t.timeout();assert.equal(t.elements['#use-selfie'].disabled,false);assert.equal(t.closed(),false);
t=setup();t.elements['#cancel'].click();assert.equal(t.sent.length,0);
console.log('Avatar transfer checks passed (mocked browser): confirmation, allowlist, source/request validation, missing/invalid save, timeout, cancellation.');
