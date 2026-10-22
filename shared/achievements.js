/* Local achievement ledger: completion survives draft edits and deletion. */
(() => {
 const key='letseigo.achievements';
 const ranks=[['green',1],['bronze',5],['silver',10],['gold',15],['diamond',20]].map(([id,count])=>({id,count}));
 function read(){
  const raw=window.ActivityAutosave?.read(key,1),completed={};
  for(const [id,value] of Object.entries(raw?.completed||{}))if(/^[a-zA-Z0-9_-]{1,100}$/.test(id)&&value===true)completed[id]=true;
  return {completed};
 }
 function qualifies(config,state){
  if(config.mode==='free')return typeof state?.fields?.body==='string'&&Array.from(state.fields.body.replace(/\s/g,'')).length>=100;
  if(config.mode!=='guided'||!config.rows?.length)return false;
  return config.rows.every((row,i)=>(Array.isArray(state?.typedRows)?typeof state.typedRows[i]==='string'&&state.typedRows[i].trim():row.some(id=>typeof state?.fields?.[id]==='string'&&state.fields[id].trim()))||
   state?.ink?.[i]?.some(stroke=>Array.isArray(stroke)&&stroke.some(point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite))));
 }
 function recordBlog(config,state){
  if(!/^[a-zA-Z0-9_-]{1,100}$/.test(config.id)||!qualifies(config,state))return false;
  const ledger=read();if(ledger.completed[config.id])return false;
  ledger.completed[config.id]=true;
  if(!window.ActivityAutosave?.write(key,1,ledger))return false;
  window.dispatchEvent(new Event('letseigo:achievementschange'));return true;
 }
 function blogProgress(){const count=Object.keys(read().completed).length;return {count,rank:ranks.filter(rank=>count>=rank.count).at(-1)||null,next:ranks.find(rank=>count<rank.count)||null};}
 window.ActivityAchievements={key,ranks,qualifies,recordBlog,blogProgress};
})();
