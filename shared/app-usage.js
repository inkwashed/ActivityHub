/* Local visit counts, independent of drafts and achievement completion. */
(() => {
 const key='letseigo.usage',cooldown=30*60*1000;
 function read(){try{const data=JSON.parse(localStorage.getItem(key));return data?.version===1&&data.apps&&typeof data.apps==='object'&&!Array.isArray(data.apps)?data.apps:{};}catch{return {};}}
 function get(id){const value=read()[id];return {visits:Number.isSafeInteger(value?.visits)&&value.visits>0?value.visits:0,lastVisit:Number.isFinite(value?.lastVisit)?value.lastVisit:0};}
 function visit(id,now=Date.now()){
  if(!/^[a-zA-Z0-9_-]{1,100}$/.test(id)||!Number.isFinite(now))return false;
  const previous=get(id);if(previous.visits&&now-previous.lastVisit<cooldown)return false;
  const apps=read();apps[id]={visits:Math.min(previous.visits+1,Number.MAX_SAFE_INTEGER),lastVisit:now};
  try{localStorage.setItem(key,JSON.stringify({version:1,apps}));return true;}catch{return false;}
 }
 window.ActivityUsage={get,visit};
 const id=document.currentScript?.dataset.appId;if(id)visit(id);
})();
