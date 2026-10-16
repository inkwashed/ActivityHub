/* Local-only, versioned app snapshots. Adapters own validation and rendering. */
(() => {
 const sessions=[];
 const read=(key,version)=>{try{const data=JSON.parse(localStorage.getItem(key));return data?.version===version?data.value:null}catch{return null}};
 const write=(key,version,value)=>{try{localStorage.setItem(key,JSON.stringify({version,value}));return true}catch{return false}};
 function connect(id,{version=1,capture,restore}){
  const key=`letseigo.app.${id}`,saved=read(key,version);
  if(saved!==null){try{restore(saved)}catch{/* Invalid/obsolete data must never prevent opening an activity. */}}
  let timer;
  const flush=()=>{clearTimeout(timer);try{write(key,version,capture())}catch{}};
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(flush,200)};
  sessions.push(flush);
  for(const event of ['click','input','change','pointerup','pointercancel','keyup'])document.addEventListener(event,schedule);
  return {flush};
 }
 window.ActivityAutosave={connect,read,write};
 window.addEventListener('pagehide',()=>sessions.forEach(flush=>flush()));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')sessions.forEach(flush=>flush())});
})();
