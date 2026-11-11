/* Preserve the version-1 avatar format; temporary recovery never enters storage. */
window.AvatarPersistence=({capture,apply,categories,announce})=>{
 const config=window.AvatarConfig,clone=value=>JSON.parse(JSON.stringify(value));
 const signature=saved=>JSON.stringify(saved.state);
 const defaults=signature({state:config.defaults});
 const restore=(saved,temporary=false)=>{
  const current=clone(capture()),state={...config.defaults};
  for(const key of Object.keys(state)){
   const value=saved?.state?.[key];
   if(config.optionsFor(key).includes(value)||config.isCustomColor(key,value))state[key]=value;
  }
  const tab=temporary?current.active:({mouth:'eyes',nose:'face',accessories:'clothes',colors:'design'})[saved?.active]||saved?.active;
  try{apply({state,active:categories.includes(tab)?tab:'face'})}
  catch(error){
   try{apply(current)}catch(rollbackError){console.error('[Avatar] Recovery rollback failed.',rollbackError)}
   throw error;
  }
 };
 let session,action;
 const recovery=window.BuilderReset.connect({
  button:document.querySelector('#clear'),mode:()=>'avatar',capture,signature,
  hasCreation:saved=>signature(saved)!==defaults,
  clear:()=>{action='Avatar reset.';restore({state:config.defaults},true)},
  restore:saved=>{action='Avatar restored.';restore(saved,true)},
  after:()=>{session?.flush();announce(action)},
  onError:()=>announce('Could not restore the creation. Please try Restore again.')
 });
 session=window.ActivityAutosave.connect('avatar',{
  capture,restore,canSave:recovery.canSave,
  onRestoreError:()=>announce('Saved creation could not be opened. Reload to try again.')
 });
 return {recovery,flush:session.flush};
};
