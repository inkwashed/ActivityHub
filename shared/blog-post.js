/* Configuration-driven, local-only guided posts. No lesson vocabulary lives here. */
(() => {
 const safePhoto=value=>typeof value==='string' && value.length<700000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value);
 function normalize(config,raw={}){
  const fields={};
  for(const field of config.fields) fields[field.id]=typeof raw?.fields?.[field.id]==='string'?(field.multiline?raw.fields[field.id].replace(/\r\n?/g,'\n'):raw.fields[field.id].replace(/[\r\n\t]/g,' ')).slice(0,field.maxLength||80):field.default;
  const images=(Array.isArray(raw?.images)?raw.images:[]).filter(x=>x && (config.images.some(y=>y.id===x.id)||safePhoto(x.src))).slice(0,3).map(x=>config.images.some(y=>y.id===x.id)?{id:x.id}:{src:x.src});
  if(config.design){
   const used=new Set();images.forEach((image,i)=>{
    const rawImage=(Array.isArray(raw?.images)?raw.images:[]).filter(x=>x&&(config.images.some(y=>y.id===x.id)||safePhoto(x.src)))[i];
    let uid=typeof rawImage?.uid==='string'&&/^[a-zA-Z0-9_-]{1,50}$/.test(rawImage.uid)?rawImage.uid:`legacy-${i}`;
    while(used.has(uid))uid+='-x';used.add(uid);image.uid=uid;
   });
   return {fields,images,layout:window.BlogLayout.normalize(raw?.layout,images,fields.body)};
  }
  return {fields,images};
 }
 function sentences(config,state){if(config.mode==='free')return state.fields.body.replace(/\n{3,}/g,'\n\n').split('\n');const values={...state.fields,...(config.derive?.(state.fields)||{})};return config.sentences.map(line=>line.replace(/\{(\w+)\}/g,(_,key)=>values[key]||'________'));}
 window.BlogPost={normalize,sentences,safePhoto,mount(config){
  const $=id=>document.getElementById(id),t=value=>window.ActivityHubI18n.t(value);
  let state=normalize(config),busy=false,generation=0;
  const controls=new Map();
  let saveTimer,designer;
  const label=(node,value)=>{node.dataset.i18n=value;node.textContent=t(value);};
  const status=value=>{label($('blog-status'),value);};
  function persist(){clearTimeout(saveTimer);if(!window.ActivityAutosave.write(`letseigo.app.${config.id}`,1,state))status('This browser could not save your post. Keep this tab open.');}
  const scheduleSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);};
  window.addEventListener('pagehide',persist);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
  function sizeInput(input){if(config.mode==='free')return;input.style.width=`${Math.max(7,Math.min(32,Array.from(input.value).length+1))}ch`;}
  function source(item){return item.src||config.images.find(x=>x.id===item.id).src;}
  function render(){
   for(const [id,inputs] of controls)for(const input of inputs){if(input.value!==state.fields[id])input.value=state.fields[id];sizeInput(input);}
   $('blog-gallery').replaceChildren(...state.images.map((item,index)=>{const img=document.createElement('img');img.src=source(item);img.alt=item.id?config.images.find(x=>x.id===item.id).alt:`${t('Post image')} ${index+1}`;return img;}));
   $('blog-images').replaceChildren(...state.images.map((item,index)=>{
    const row=document.createElement('div');row.className='blog-image-row';
    const img=document.createElement('img');img.src=source(item);img.alt='';
    const name=document.createElement('span');name.textContent=`${t('Image')} ${index+1}`;
    const action=(icon,title)=>{const button=document.createElement('button');button.type='button';button.className='ah-button ah-button-icon';button.title=title;button.setAttribute('aria-label',title);button.disabled=busy;const image=document.createElement('img');image.src=`../../shared/icons/${icon}.svg`;image.alt='';button.append(image);return button;};
    const rotate=action('rotate-right',`${t('Rotate image')} ${index+1}`);
    rotate.onclick=async()=>{
     busy=true;render();
     try{
      const original=new Image();await new Promise((resolve,reject)=>{original.onload=resolve;original.onerror=reject;original.src=source(item);});
      const canvas=document.createElement('canvas');canvas.width=original.naturalHeight;canvas.height=original.naturalWidth;
      const ctx=canvas.getContext('2d');ctx.translate(canvas.width,0);ctx.rotate(Math.PI/2);ctx.drawImage(original,0,0);
      const src=canvas.toDataURL('image/jpeg',.75);if(!safePhoto(src))throw Error('size');
      item.src=src;delete item.id;persist();
     }catch{status('Could not rotate this image.');}
     finally{busy=false;render();$('blog-images').children[index]?.querySelector('button')?.focus();}
    };
    const remove=action('delete',`${t('Remove')} ${t('Image')} ${index+1}`);
    remove.onclick=()=>{state.images.splice(index,1);render();persist();($('blog-images').querySelector('button')||$('blog-upload')).focus();};
    row.append(img,name,rotate,remove);return row;
   }));
   $('blog-upload').disabled=busy||state.images.length>=3;
   if($('blog-example'))$('blog-example').disabled=busy;if($('blog-reset'))$('blog-reset').disabled=busy;$('share').disabled=busy;
   designer?.refresh();
  }
  // Build sentence nodes once: typing and IME composition must retain focus/caret.
  if(config.mode==='free'){
   for(const field of config.fields){
    const input=$(`blog-${field.id}`);input.maxLength=field.maxLength;controls.set(field.id,[input]);
    input.addEventListener('input',()=>{state.fields[field.id]=input.value;scheduleSave();});
   }
  }
  for(const template of config.sentences||[]){
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
   designer?.refresh();
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
    const src=canvas.toDataURL('image/jpeg',.75);if(!safePhoto(src))throw Error('size');return config.design?{src,uid:'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}:{src};
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
  if($('blog-reset'))$('blog-reset').onclick=()=>{state=normalize(config);render();persist();status('Post reset.');};
  if($('blog-example'))$('blog-example').onclick=()=>{state=normalize(config,config.example);render();persist();status('Example loaded.');};
  const viewButtons=[...document.querySelectorAll('[data-blog-view]')];
  function setView(button){
   document.querySelector('.blog-workspace').dataset.view=button.dataset.blogView;
   for(const other of viewButtons){
    other.setAttribute('aria-pressed',String(other===button));
    if(config.design){other.setAttribute('aria-selected',String(other===button));other.tabIndex=other===button?0:-1;}
   }
   if(config.design){
    for(const panel of document.querySelectorAll('[data-blog-panel]'))panel.hidden=panel.dataset.blogPanel!==button.dataset.blogView;
    if(button.dataset.blogView==='design'){avatar();designer?.refresh();}
   }
  }
  viewButtons.forEach((button,index)=>{
   button.onclick=()=>setView(button);
   if(config.design)button.onkeydown=event=>{
    let next;if(event.key==='ArrowRight')next=(index+1)%viewButtons.length;if(event.key==='ArrowLeft')next=(index+viewButtons.length-1)%viewButtons.length;if(event.key==='Home')next=0;if(event.key==='End')next=viewButtons.length-1;
    if(next!==undefined){event.preventDefault();viewButtons[next].focus();setView(viewButtons[next]);}
   };
  });
  document.addEventListener('activityhub:languagechange',()=>{render();avatar();});avatar();render();
  if(config.design){designer=window.BlogDesign({getState:()=>state,save:persist,source});designer.refresh();setView(viewButtons[0]);}
  function snapshotAvatar(){
   const svg=$('blog-avatar').querySelector('svg');
   if(!svg)return $('blog-avatar').querySelector('img').src;
   const copy=svg.cloneNode(true);copy.setAttribute('width','512');copy.setAttribute('height','512');
   return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(copy));
  }
  window.BuilderPhoto({builder:()=>{avatar();return {activityTitle:config.title,authorFirst:config.mode==='free',title:config.mode==='free'?(state.fields.title.trim()||t('My blog')):config.title,name:$('blog-author-name').textContent,avatar:snapshotAvatar(),images:state.images.map(source),photoKeys:state.images.map(image=>'photo:'+image.uid),design:designer?.plan(),sentences:sentences(config,state)};},canvas:window.BlogSnapshot,imageSelector:'#blog-snapshot',messages:{making:'Making your snapshot…',error:'The snapshot could not be made. Please close this preview and try again.'}});
  if(config.sample&&$('blog-sample')){
   const dialog=$('sample-dialog'),sample=config.sample;
   $('sample-post-title').textContent=sample.title;$('sample-author').textContent=sample.author;
   $('sample-body').replaceChildren(...sample.paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
   $('blog-sample').onclick=()=>dialog.showModal();
   dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  }
  return {capture:()=>structuredClone(state)};
 }};
})();
