/* Configuration-driven, local-only guided posts. No lesson vocabulary lives here. */
(() => {
 const safePhoto=value=>typeof value==='string' && value.length<700000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value);
 function normalize(config,raw={}){
  const fields={};
  for(const field of config.fields) fields[field.id]=typeof raw?.fields?.[field.id]==='string'?raw.fields[field.id].replace(/[\r\n\t]/g,' ').slice(0,field.maxLength||80):field.default;
  const images=(Array.isArray(raw?.images)?raw.images:[]).filter(x=>x && (config.images.some(y=>y.id===x.id)||safePhoto(x.src))).slice(0,3).map(x=>config.images.some(y=>y.id===x.id)?{id:x.id}:{src:x.src});
  return {fields,images:images.length?images:[{id:config.images[0].id}]};
 }
 function sentences(config,state){const values={...state.fields,...(config.derive?.(state.fields)||{})};return config.sentences.map(line=>line.replace(/\{(\w+)\}/g,(_,key)=>values[key]||'________'));}
 window.BlogPost={normalize,sentences,safePhoto,mount(config){
  const $=id=>document.getElementById(id),t=value=>window.ActivityHubI18n.t(value);
  let state=normalize(config),busy=false,generation=0;
  const controls=new Map();
  let saveTimer;
  const label=(node,value)=>{node.dataset.i18n=value;node.textContent=t(value);};
  const status=value=>{label($('blog-status'),value);};
  function persist(){clearTimeout(saveTimer);if(!window.ActivityAutosave.write(`letseigo.app.${config.id}`,1,state))status('This browser could not save your post. Keep this tab open.');}
  const scheduleSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);};
  window.addEventListener('pagehide',persist);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
  function sizeInput(input){input.style.width=`${Math.max(7,Math.min(32,Array.from(input.value).length+1))}ch`;}
  function source(item){return item.src||config.images.find(x=>x.id===item.id).src;}
  function render(){
   for(const [id,inputs] of controls)for(const input of inputs){if(input.value!==state.fields[id])input.value=state.fields[id];sizeInput(input);}
   $('blog-gallery').replaceChildren(...state.images.map((item,index)=>{const img=document.createElement('img');img.src=source(item);img.alt=item.id?config.images.find(x=>x.id===item.id).alt:`${t('Post image')} ${index+1}`;return img;}));
   $('blog-images').replaceChildren(...state.images.map((item,index)=>{
    const row=document.createElement('div');row.className='blog-image-row';
    const img=document.createElement('img');img.src=source(item);img.alt='';
    const name=document.createElement('span');name.textContent=`${t('Image')} ${index+1}`;
    const remove=document.createElement('button');remove.type='button';remove.className='ah-button';label(remove,'Remove');remove.setAttribute('aria-label',`${t('Remove')} ${t('Image')} ${index+1}`);remove.disabled=state.images.length===1||busy;
    remove.onclick=()=>{state.images.splice(index,1);render();persist();$('blog-images').querySelector('button').focus();};
    row.append(img,name,remove);return row;
   }));
   $('blog-upload').disabled=busy||state.images.length>=3;
   $('blog-example').disabled=busy;$('blog-reset').disabled=busy;$('share').disabled=busy;
  }
  // Build sentence nodes once: typing and IME composition must retain focus/caret.
  for(const template of config.sentences){
   const paragraph=document.createElement('p');
   for(const part of template.split(/(\{\w+\})/g)){
    const key=/^\{(\w+)\}$/.exec(part)?.[1];
    const field=config.fields.find(x=>x.id===key);
    if(!field){paragraph.append(document.createTextNode(part));continue;}
    const input=document.createElement('input');input.type='text';input.lang='en';input.maxLength=field.maxLength||80;
    input.placeholder='________';input.autocomplete='off';input.spellcheck=false;input.dataset.field=key;
    input.dataset.i18nAriaLabel=field.label;input.setAttribute('aria-label',t(field.label));
    if(!controls.has(key))controls.set(key,[]);controls.get(key).push(input);
    input.addEventListener('input',()=>{
     state.fields[key]=input.value;sizeInput(input);
     for(const other of controls.get(key))if(other!==input){other.value=input.value;sizeInput(other);}
     scheduleSave();
    });paragraph.append(input);
   }
   $('blog-sentences').append(paragraph);
  }
  const saved=window.ActivityAutosave.read(`letseigo.app.${config.id}`,1);if(saved)state=normalize(config,saved);
  function avatar(){
   const profile=window.ActivityAutosave.read('letseigo.profile',1);
   const name=typeof profile?.name==='string'?profile.name.slice(0,80).trim():'';
   $('blog-author-name').textContent=name||t('My blog');
   const savedAvatar=window.ActivityAutosave.read('letseigo.app.avatar',1),c=window.AvatarConfig;
   const slot=$('blog-avatar');slot.replaceChildren();
   if(savedAvatar?.state&&c&&window.renderAvatar){
    const clean={...c.defaults};for(const key of Object.keys(clean)){const options=c.optionsFor(key);if(options.includes(savedAvatar.state[key])||c.isCustomColor(key,savedAvatar.state[key]))clean[key]=savedAvatar.state[key];}
    // Only catalog-validated values reach the existing trusted SVG renderer.
    slot.innerHTML=window.renderAvatar(clean);
   }else{const img=document.createElement('img');img.src='../../shared/icons/profile-default.svg';img.alt='';slot.append(img);}
  }
  window.addEventListener('storage',event=>{if(event.key==='letseigo.app.avatar'||event.key==='letseigo.profile'||event.key===null)avatar();});window.addEventListener('focus',avatar);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)avatar();});
  async function photo(file){
   if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>15000000)throw Error('format');
   const url=URL.createObjectURL(file),img=new Image();
   try{
    await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
    if(!img.naturalWidth||!img.naturalHeight)throw Error('decode');
    const scale=Math.min(1,960/Math.max(img.naturalWidth,img.naturalHeight)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const src=canvas.toDataURL('image/jpeg',.75);if(!safePhoto(src))throw Error('size');return {src};
   }finally{URL.revokeObjectURL(url);}
  }
  $('blog-upload').onchange=async event=>{
   const files=[...event.target.files],epoch=++generation;event.target.value='';if(!files.length)return;
   const capacity=3-state.images.length;if(files.length>capacity){status('Choose only enough images to make three in total.');return;}
   busy=true;render();status('Adding images…');
   try{const next=[];for(const file of files)next.push(await photo(file));if(epoch!==generation)return;state.images.push(...next);status('Images added.');persist();}
   catch{status('Use a JPG, PNG or WebP image under 15 MB. Try a smaller image.');}
   finally{busy=false;render();}
  };
  $('blog-reset').onclick=()=>{state=normalize(config);render();persist();status('Post reset.');};
  $('blog-example').onclick=()=>{state=normalize(config,config.example);render();persist();status('Example loaded.');};
  for(const button of document.querySelectorAll('[data-blog-view]'))button.onclick=()=>{
   document.querySelector('.blog-workspace').dataset.view=button.dataset.blogView;
   for(const other of document.querySelectorAll('[data-blog-view]'))other.setAttribute('aria-pressed',String(other===button));
  };
  document.addEventListener('activityhub:languagechange',()=>{render();avatar();});avatar();render();
  window.BuilderPhoto({builder:()=>{avatar();return {title:config.title,name:$('blog-author-name').textContent,avatar:$('blog-avatar').querySelector('svg')? 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent($('blog-avatar').innerHTML):$('blog-avatar').querySelector('img').src,images:state.images.map(source),sentences:sentences(config,state)};},canvas:window.BlogSnapshot,imageSelector:'#blog-snapshot',messages:{making:'Making your snapshot…',error:'The snapshot could not be made. Please close this preview and try again.'}});
  return {capture:()=>structuredClone(state)};
 }};
})();
