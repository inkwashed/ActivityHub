/* Local achievement ledger: completion survives draft edits and deletion. */
(() => {
 const key='letseigo.achievements';
 const builderBadges=[
  {id:'pizza',title:'My First Pizza',description:'Make a pizza in Little Pizza Kitchen.',jaTitle:'はじめてのピザ',jaDescription:'Little Pizza Kitchenでピザを作ろう。'},
  {id:'sandwich',title:'My First Sandwich',description:'Make a sandwich in Little Sandwich Shop.',jaTitle:'はじめてのサンドイッチ',jaDescription:'Little Sandwich Shopでサンドイッチを作ろう。'},
  {id:'parfait',title:'My First Parfait',description:'Make a parfait in Little Parfait Cafe.',jaTitle:'はじめてのパフェ',jaDescription:'Little Parfait Cafeでパフェを作ろう。'},
  {id:'class-supplies',title:'My First Pencil Case',description:'Design a pencil case in My Pencil Case.',jaTitle:'はじめての筆箱',jaDescription:'My Pencil Caseで筆箱をデザインしよう。'},
  {id:'my-town',title:'My First Town',description:'Design a town in My Town.',jaTitle:'はじめての町',jaDescription:'My Townで町をデザインしよう。'}
 ];
 const ranks=[['green',1],['bronze',5],['silver',10],['gold',15],['diamond',20]].map(([id,count])=>({id,count}));
 // Rank-specific student-facing copy; counting mechanics stay out of Profile.
 function badgeText(id,rankId){
  if(id==='blog')return rankId==='bronze'
   ?{title:'Growing Journalist',description:'Write at least 5 entries in My Blog.',jaTitle:'成長するジャーナリスト',jaDescription:'My Blogで記事を5つ以上書こう。'}
   :{title:'Budding Journalist',description:'Write at least one entry in My Blog.',jaTitle:'かけだしジャーナリスト',jaDescription:'My Blogで記事を1つ以上書こう。'};
  const badge=builderBadges.find(b=>b.id===id),rank=ranks.find(r=>r.id===rankId);
  if(!badge||!rank)return null;
  if(rankId==='green')return badge;
  const names={pizza:['Pizza','ピザ','Little Pizza Kitchen'],sandwich:['Sandwich','サンドイッチ','Little Sandwich Shop'],parfait:['Parfait','パフェ','Little Parfait Cafe'],'class-supplies':['Pen','ペン','My Pencil Case'],'my-town':['Map','マップ','My Town']};
  const [noun,jaNoun,app]=names[id],metal=rankId[0].toUpperCase()+rankId.slice(1),jaMetal={bronze:'ブロンズ',silver:'シルバー',gold:'ゴールド',diamond:'ダイヤモンド'}[rankId];
  return {title:`${metal} ${noun}`,description:`Play ${app} ${rank.count} times.`,jaTitle:`${jaMetal}${jaNoun}`,jaDescription:`${app}で${rank.count}回遊ぼう。`};
 }
 function read(){
  const raw=window.ActivityAutosave?.read(key,1),completed={};
  for(const [id,value] of Object.entries(raw?.completed||{}))if(/^[a-zA-Z0-9_-]{1,100}$/.test(id)&&value===true)completed[id]=true;
  const builders={};
  for(const badge of builderBadges){const value=raw?.builders?.[badge.id];if(Number.isSafeInteger(value?.count)&&value.count>0&&Number.isFinite(value.lastSession))builders[badge.id]={count:value.count,lastSession:value.lastSession};}
  return {completed,builders};
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
 function builderProgress(id){const count=read().builders[id]?.count||0;return {count,rank:ranks.filter(rank=>count>=rank.count).at(-1)||null,next:ranks.find(rank=>count<rank.count)||null};}
 function recordBuilder(id,now=Date.now()){
  if(!builderBadges.some(b=>b.id===id)||!Number.isFinite(now)||now<0)return false;
  const ledger=read(),previous=ledger.builders[id];
  if(previous&&now-previous.lastSession<30*60*1000)return false;
  ledger.builders[id]={count:Math.min((previous?.count||0)+1,Number.MAX_SAFE_INTEGER),lastSession:now};
  if(!window.ActivityAutosave?.write(key,1,ledger))return false;
  window.dispatchEvent(new Event('letseigo:achievementschange'));return true;
 }
 // Ignore selection, mode switches, voice/settings, saved previews and passive restoration.
 function creation(raw){
  if(Array.isArray(raw.blocks))return {town:raw.blocks};
  const learn=raw.learn||{},free=raw.free||{};
  return {learn:{toppings:learn.toppings,layers:learn.layers,slots:learn.slots,sauce:learn.sauce,base:learn.base,origins:learn.origins},
   slots:raw.slots?.items,free:{sauce:free.sauce,base:free.base,origins:free.origins},
   items:raw.items?.map(({id,...item})=>item),palettes:raw.palettes};
 }
 function hasCreation(raw){
  if(Array.isArray(raw.blocks))return raw.blocks.some(Boolean);
  if(raw.play)return !!raw.items?.length||!!raw.free?.sauce;
  return Object.values(raw.learn?.toppings||{}).some(value=>value>0)||raw.learn?.layers?.some(row=>row.some(Boolean))||raw.learn?.slots?.some(Boolean)||raw.slots?.items?.some(Boolean)||!!raw.learn?.sauce;
 }
 function builderAdapter(id,adapter){
  if(!builderBadges.some(b=>b.id===id))return adapter;
  let previous=JSON.stringify(creation(adapter.capture()));
  return {...adapter,restore(...args){adapter.restore(...args);previous=JSON.stringify(creation(adapter.capture()));},
   onSave(raw){adapter.onSave?.(raw);const current=JSON.stringify(creation(raw));
    if(current!==previous&&hasCreation(raw)){
     // Keep a failed write eligible for retry; already-counted sessions need no retry.
     const progress=read().builders[id];
     if(!recordBuilder(id)&&(!progress||Date.now()-progress.lastSession>=30*60*1000))return;
    }
    previous=current;
   }};
 }
 window.ActivityAchievements={key,ranks,badgeText,qualifies,recordBlog,blogProgress,builderBadges,builderProgress,recordBuilder,builderAdapter};
})();
