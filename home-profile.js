/* Reuse the avatar catalog/renderer and the blog's versioned local save. */
(() => {
 const slot=document.getElementById('home-profile-picture');
 if(!slot)return;
 const dialog=document.getElementById('profile-dialog');
 const preview=document.getElementById('profile-selfie');
 const trigger=document.getElementById('home-profile');
 const nameField=document.getElementById('profile-name');
 const profileKey='letseigo.profile';
 function restoreName(){
  const saved=window.ActivityAutosave?.read(profileKey,1);
  nameField.value=typeof saved?.name==='string'?saved.name.slice(0,80):'';
 }
 nameField.addEventListener('input',()=>window.ActivityAutosave?.write(profileKey,1,{name:nameField.value.slice(0,80)}));
 window.addEventListener('storage',event=>{if(event.key===profileKey||event.key===null)restoreName();});
 restoreName();
 function syncPreview(){if(preview)preview.replaceChildren(...Array.from(slot.childNodes,node=>node.cloneNode(true)));}
 trigger.addEventListener('click',()=>{refresh();dialog.showModal();});
 document.getElementById('close-profile').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>trigger.focus());
 function fallback(){
  const img=document.createElement('img');img.src='shared/icons/profile-default.svg';img.alt='';img.width=img.height=40;slot.replaceChildren(img);syncPreview();
 }
 function refresh(){
  try{
   const saved=window.ActivityAutosave?.read('letseigo.app.avatar',1),config=window.AvatarConfig;
   if(!saved?.state||typeof saved.state!=='object'||Array.isArray(saved.state)||!config||typeof window.renderAvatar!=='function'){fallback();return;}
   const clean={...config.defaults};let valid=0;
   for(const key of Object.keys(clean)){
    const options=config.optionsFor(key);
    if(options.includes(saved.state[key])||config.isCustomColor(key,saved.state[key])){clean[key]=saved.state[key];valid++;}
   }
   if(!valid){fallback();return;}
   // Saved markup is never used: only catalog-validated values reach the renderer.
   const markup=window.renderAvatar(clean);
   if(typeof markup!=='string'||!markup.startsWith('<svg')){fallback();return;}
   slot.innerHTML=markup;syncPreview();
  }catch{fallback();}
 }
 window.addEventListener('storage',event=>{if(event.key==='letseigo.app.avatar'||event.key===null)refresh();});
 window.addEventListener('focus',refresh);
 window.addEventListener('pageshow',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 refresh();
})();
