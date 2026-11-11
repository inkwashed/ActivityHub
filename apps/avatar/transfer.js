/* Explicit local-only transfer. No avatar is sent before confirmation. */
(() => {
 const target='https://tools.letseigo.com', requestId=new URLSearchParams(location.search).get('requestId');
 const validId=typeof requestId==='string'&&/^[A-Za-z0-9_-]{16,128}$/.test(requestId);
 const opener=window.opener, status=document.querySelector('#status'), use=document.querySelector('#use-selfie'), edit=document.querySelector('#edit-selfie');
 let pending=false,timer,avatar;
 const stop=()=>{pending=false;clearTimeout(timer);use.disabled=!avatar;};
 function read(){
  avatar=null;
  try{
   const saved=JSON.parse(localStorage.getItem('letseigo.app.avatar'));
   if(saved?.version!==1||!saved.value?.state)throw Error();
   const clean={};
   for(const key of Object.keys(AvatarConfig.defaults)){
    const value=saved.value.state[key];
    if(!AvatarConfig.optionsFor(key).includes(value)&&!AvatarConfig.isCustomColor(key,value))throw Error();
    clean[key]=value;
   }
   avatar=clean;document.querySelector('#preview').innerHTML=renderAvatar(clean);
   status.textContent='Use this selfie for your Teacher Tools profile?';
  }catch{status.textContent='No compatible selfie is saved in this browser yet. Create or edit one to continue.';}
  use.disabled=!avatar;
 }
 document.querySelector('#cancel').addEventListener('click',()=>{stop();use.disabled=true;status.textContent='Cancelled. Nothing else will be sent.';window.close();});
 if(!validId||!opener){status.textContent='Open this page using Use My Selfie in Teacher Tools.';return;}
 edit.hidden=false;edit.href='./?selfieTransfer='+encodeURIComponent(requestId);
 read();
 use.addEventListener('click',()=>{
  if(pending||!avatar)return;
  if(opener.closed){status.textContent='Teacher Tools was closed. Reopen it and try again.';return;}
  pending=true;use.disabled=true;status.textContent='Waiting for Teacher Tools to save your selfie…';
  timer=setTimeout(()=>{stop();status.textContent='No confirmation received. Return to Teacher Tools or try again.';},15000);
  opener.postMessage({type:'letseigo.selfie.import',version:1,requestId,avatar},target);
 });
 window.addEventListener('message',event=>{
  if(!pending||event.origin!==target||event.source!==opener)return;
  const data=event.data;
  if(data?.type!=='letseigo.selfie.import.ack'||data.version!==1||data.requestId!==requestId)return;
  stop();use.disabled=true;status.textContent='Selfie saved in Teacher Tools. You can close this window.';window.close();
 });
 window.addEventListener('pagehide',()=>{pending=false;clearTimeout(timer);});
})();
