(() => {
 const $=id=>document.getElementById(id),t=s=>ActivityHubI18n.t(s),catalog=BlogJournalCatalog;
 let selected=0,generation=0,url;
 const ctx=document.createElement('canvas').getContext('2d');ctx.font='26px Arial';
 const draft=entry=>BlogPost.normalize(entry.config,ActivityAutosave.read('letseigo.app.'+entry.config.id,1)||{});
 const hasContent=state=>state.ink?.some(strokes=>strokes.length)||state.images.length>0||Object.values(state.fields).some(value=>value.trim());
 function portrait(){
  const saved=ActivityAutosave.read('letseigo.app.avatar',1),c=window.AvatarConfig;
  if(!saved?.state||!c||!window.renderAvatar)return '../../shared/icons/profile-default.svg';
  const clean={...c.defaults};for(const key of Object.keys(clean)){if(c.optionsFor(key).includes(saved.state[key])||c.isCustomColor(key,saved.state[key]))clean[key]=saved.state[key];}
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(renderAvatar(clean).replace('<svg ','<svg width="512" height="512" '));
 }
 function contents(){
  $('journal-list').replaceChildren();let book;
  catalog.forEach((entry,i)=>{
   if(entry.book!==book){book=entry.book;const h=document.createElement('h3');h.lang='en';h.textContent=book;$('journal-list').append(h);}
   const button=document.createElement('button');button.type='button';button.className='ah-button';button.setAttribute('aria-current',i===selected?'page':'false');button.setAttribute('aria-pressed',String(i===selected));const written=hasContent(draft(entry)),title=`Unit ${entry.unit} · ${entry.config.title}`;
   button.setAttribute('aria-label',`${title} — ${t(written?'Written':'Blank')}`);
   const indicator=document.createElement('span');indicator.className='entry-check'+(written?' is-written':'');indicator.setAttribute('aria-hidden','true');
   indicator.innerHTML='<svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-8"/></svg>';
   const text=document.createElement('span');text.textContent=title;button.append(indicator,text);button.onclick=()=>{selected=i;render();};$('journal-list').append(button);
  });
 }
 async function render(){
  const token=++generation,entry=catalog[selected],state=draft(entry);contents();
  if(url){URL.revokeObjectURL(url);url=null;}
  $('entry-image').hidden=true;$('entry-image').removeAttribute('src');$('entry-text').hidden=true;$('entry-text').open=false;
  $('entry-heading').textContent=entry.config.title;$('entry-unit').textContent=`${entry.book} · Unit ${entry.unit}`;
  $('edit-entry').href=entry.path+(location.protocol==='file:'?'index.html':'');$('page-number').textContent=`${selected+1} / ${catalog.length}`;
  $('previous-entry').disabled=selected===0;$('next-entry').disabled=selected===catalog.length-1;
  const filled=hasContent(state);$('empty-page').hidden=filled;$('page-status').textContent=filled?t('Opening your post…'):'';
  $('journal-page').scrollTop=0;if(!filled)return;
  const profile=ActivityAutosave.read('letseigo.profile',1),name=typeof profile?.name==='string'?profile.name.slice(0,80).trim():'';
  const sentences=BlogPost.sentences(entry.config,state),title=entry.config.mode==='free'?(state.fields.title.trim()||entry.config.title):entry.config.title;
  $('entry-paragraphs').replaceChildren(...[title,...(state.inputMode==='write'?[t('This entry contains handwriting. Open the activity to view or edit the strokes.')]:sentences)].map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));$('entry-text').hidden=false;
  try{
   const canvas=await BlogSnapshot({activityTitle:entry.config.title,authorFirst:entry.config.mode==='free',title,name:name||t('My blog'),avatar:portrait(),images:state.images.map(image=>image.src||entry.config.images.find(x=>x.id===image.id).src),photoKeys:state.images.map(BlogLayout.keyOf),design:entry.config.design?BlogLayout.plan(state.inputMode==='write'?state.inkLayout:state.layout,state.images,state.fields.body,text=>ctx.measureText(text).width,undefined,state.inputMode==='write'?state.ink:null):null,sentences});
   const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(token!==generation)return;if(!blob)throw Error('render');url=URL.createObjectURL(blob);$('entry-image').src=url;$('entry-image').alt=title;$('entry-image').hidden=false;$('page-status').textContent='';
  }catch{if(token===generation)$('page-status').textContent=t('The picture could not be displayed. You can still read your post below.');}
 }
 $('previous-entry').onclick=()=>{if(selected>0){selected--;render();}};
 $('next-entry').onclick=()=>{if(selected<catalog.length-1){selected++;render();}};
 window.addEventListener('storage',render);window.addEventListener('focus',render);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});document.addEventListener('activityhub:languagechange',render);
 window.addEventListener('pagehide',()=>{generation++;if(url)URL.revokeObjectURL(url);});render();
})();
