/* Configuration-driven, local-only guided posts. No lesson vocabulary lives here. */
(() => {
 const safePhoto=value=>typeof value==='string' && value.length<700000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(value);
 function normalize(config,raw={}){
  const fields={};
  for(const field of config.fields) fields[field.id]=typeof raw?.fields?.[field.id]==='string'?(field.multiline?raw.fields[field.id].replace(/\r\n?/g,'\n'):raw.fields[field.id].replace(/[\r\n\t]/g,' ')).slice(0,field.maxLength||80):field.default;
  if(config.mode==='guided'&&raw?.fields&&!Object.hasOwn(raw,'showHelp')){
   // One-time migration: preserve old repeated country answers, then edit independently.
   for(const key of ['country2','country3'])if(raw.fields[key]===undefined)fields[key]=fields.country;
  }
  const showHelp=raw?.showHelp!==false;
  const ink=config.mode==='guided'?window.BlogInk.normalize(raw?.ink,config.rows.length):null;
  const typedRows=config.mode==='guided'?(Array.isArray(raw?.typedRows)?config.rows.map((_,i)=>typeof raw.typedRows[i]==='string'?raw.typedRows[i].replace(/[\r\n\t]/g,' ').slice(0,320):''):sentences(config,{fields,showHelp})):null;
  if(config.mode==='guided')fields.body=typedRows.join('\n');
  const images=(Array.isArray(raw?.images)?raw.images:[]).filter(x=>x && (config.images.some(y=>y.id===x.id)||safePhoto(x.src))).slice(0,3).map(x=>config.images.some(y=>y.id===x.id)?{id:x.id}:{src:x.src});
  if(config.design){
   const used=new Set();images.forEach((image,i)=>{
    const rawImage=(Array.isArray(raw?.images)?raw.images:[]).filter(x=>x&&(config.images.some(y=>y.id===x.id)||safePhoto(x.src)))[i];
    let uid=typeof rawImage?.uid==='string'&&/^[a-zA-Z0-9_-]{1,50}$/.test(rawImage.uid)?rawImage.uid:`legacy-${i}`;
    while(used.has(uid))uid+='-x';used.add(uid);image.uid=uid;
   });
   return {fields,images,...(config.mode==='guided'?{showHelp,typedRows,inputMode:raw?.inputMode==='write'?'write':'type',ink,inkLayout:window.BlogLayout.normalize(raw?.inkLayout,images,'',ink)}:{}),layout:window.BlogLayout.normalize(raw?.layout,images,fields.body)};
  }
  return {fields,images};
 }
 function sentences(config,state){
  if(config.mode==='guided'&&Array.isArray(state.typedRows))return state.typedRows;
  if(config.mode==='guided')return config.rows.map(row=>{
   if(!row.some(key=>state.fields[key]?.trim()))return '';
   return row.map(key=>state.fields[key]?.trim()||'________').join(' ')+'.';
  });
  if(config.mode==='free')return state.fields.body.replace(/\n{3,}/g,'\n\n').split('\n');const values={...state.fields,...(config.derive?.(state.fields)||{})};return config.sentences.map(line=>line.replace(/\{(\w+)\}/g,(_,key)=>values[key]||'________'));}
 // Variable words yield to original answers, advancing only at a word boundary.
 function wordHint(sample,text){
  const full=sample.map(part=>part.text).join('');
  const words=[...full.matchAll(/\S+/g)];
  const entered=[...text.matchAll(/\S+/g)];
  if(!entered.length)return {consumed:0};
  let offset=0;const variable=[];
  for(const part of sample){for(let i=0;i<part.text.length;i++)variable[offset+i]=part.variable;offset+=part.text.length;}
  for(let i=0;i<entered.length;i++){
   if(!words[i])return {consumed:full.length};
   const word=words[i],value=entered[i][0],end=entered[i].index+value.length;
   const complete=end<text.length;
   if(i===entered.length-1){
    if(complete)return {consumed:words[i+1]?.index??full.length};
    if(variable[word.index]&&!word[0].toLowerCase().startsWith(value.toLowerCase())){
     // Skip this word only; retain its following separator until the student types it.
     return {consumed:word.index+word[0].length};
    }
    return {consumed:word.index+Math.min(value.length,word[0].length)};
   }
  }
  return {consumed:full.length};
 }
 // Align recognized countries or an explicitly typed following phrase; never edit answers.
 function countryHint(config,row,text,blurred=false){
  const at=row.findIndex(key=>config.fields.find(f=>f.id===key)?.country);
  if(at<0||!config.countryNames?.length)return {consumed:text.length};
  const fields=row.map(key=>config.fields.find(f=>f.id===key));
  const before=fields.slice(0,at).map(f=>f.help||f.placeholder||'').join(' ');
  const prefix=before?before+' ':'';
  if(text.slice(0,prefix.length).toLowerCase()!==prefix.toLowerCase())return {consumed:text.length};
  const rest=text.slice(prefix.length),sample=fields[at].placeholder||'';
  const names=[...config.countryNames].sort((a,b)=>b.length-a.length);
  const match=names.find(name=>rest.slice(0,name.length).toLowerCase()===name.toLowerCase()&&/^[\s.!?]/.test(rest.slice(name.length)));
  if(match)return {consumed:prefix.length+sample.length+rest.length-match.length,alignedText:prefix+sample+rest.slice(match.length)};
  const candidate=rest.split(/\s+is\b|[.!?]/i)[0].trimEnd();
  const partial=names.some(name=>name.toLowerCase().startsWith(rest.toLowerCase()));
  const complete=blurred||/\s$|[.!?]|\s+is\b/i.test(rest);
  // An unknown name must not freeze the hint after the student types the next phrase.
  const boundary=rest.search(/\s+is\b|[.!?]/i);
  const consumed=boundary>=0?sample.length+rest.length-boundary:Math.min(rest.length,sample.length);
  return {consumed:prefix.length+consumed,...(boundary>=0?{alignedText:prefix+sample+rest.slice(boundary)}:{}),
   warning:complete&&!partial&&candidate?{start:prefix.length,end:prefix.length+candidate.length}:null};
 }
 function continentHint(config,row,text,blurred=false){
  const at=row.findIndex(key=>config.fields.find(f=>f.id===key)?.continent);
  if(at<0||!config.continentNames?.length)return {};
  const previous=config.fields.find(f=>f.id===row[at-1])?.help;
  if(!previous)return {};
  const marker=' '+previous+' ',start=text.toLowerCase().indexOf(marker.toLowerCase());
  if(start<0)return {};
  const offset=start+marker.length,rest=text.slice(offset),name=rest.replace(/[.!?].*$/,'').trimEnd();
  const names=config.continentNames.map(value=>value.toLowerCase()),lower=name.toLowerCase();
  const known=names.includes(lower),partial=names.some(value=>value.startsWith(rest.toLowerCase()));
  const complete=blurred||/[.!?]|\s$/.test(rest);
  return {warning:complete&&!known&&!partial&&name?{start:offset,end:offset+name.length}:null};
 }
 function capitalizationWarnings(config,row,text){
  const warnings=[],fields=row.map(key=>config.fields.find(f=>f.id===key));
  function check(names,offset){
   if(offset<0)return;
   const rest=text.slice(offset);
   const name=[...(names||[])].sort((a,b)=>b.length-a.length).find(name=>rest.slice(0,name.length).toLowerCase()===name.toLowerCase()&&/^(?:[\s.!?,]|$)/.test(rest.slice(name.length)));
   if(!name)return;
   for(let i=0;i<name.length;i++)if(/[A-Z]/.test(name[i])&&/[a-z]/.test(rest[i]))warnings.push({start:offset+i,end:offset+i+1,kind:'name-capitalization'});
  }
  const country=fields.findIndex(f=>f.country);
  if(country>=0){
   const prefix=fields.slice(0,country).map(f=>f.help||f.placeholder||'').join(' '),before=prefix?prefix+' ':'';
   if(text.slice(0,before.length).toLowerCase()===before.toLowerCase())check(config.countryNames,before.length);
  }
  const continent=fields.findIndex(f=>f.continent);
  if(continent>=0){const phrase=fields[continent-1]?.help;if(phrase){const marker=' '+phrase+' ',at=text.toLowerCase().indexOf(marker.toLowerCase());if(at>=0)check(config.continentNames,at+marker.length);}}
  return warnings;
 }
 function phraseWarnings(config,row,text,blurred=false){
  const tokens=[...text.matchAll(/\S+/g)],warnings=[],clean=word=>word.replace(/[.!?,]+$/,'').replace(/’/g,"'").toLowerCase();
  const fields=row.map(key=>config.fields.find(f=>f.id===key));let cursor=0;
  function check(word,expected){
   if(!word)return;
   const value=clean(word[0]),target=clean(expected);
   const complete=blurred||word.index+word[0].length<text.length||/[.!?,]$/.test(word[0]);
   if(complete&&value&&value!==target)warnings.push({start:word.index,end:word.index+word[0].replace(/[.!?,]+$/,'').length});
  }
  for(let i=0;i<fields.length;i++){
   const field=fields[i];
   if(field.help){for(const word of field.help.split(/\s+/))check(tokens[cursor++],word);continue;}
   if(field.country){
    const tail=text.slice(tokens[cursor]?.index??text.length);
    const name=[...(config.countryNames||[])].sort((a,b)=>b.length-a.length).find(name=>tail.toLowerCase().startsWith(name.toLowerCase())&&/^(?:[\s.!?]|$)/.test(tail.slice(name.length)));
    if(name){cursor+=name.split(/\s+/).length;continue;}
    // Unknown multiword names: align only when the following fixed phrase is explicit.
    const next=fields[i+1]?.help?.split(/\s+/)[0];
    const found=next?tokens.findIndex((word,n)=>n>cursor&&clean(word[0])===clean(next)):-1;
    if(found<0)break;cursor=found;continue;
   }
   const next=fields[i+1]?.help;
   if(!next)break;
   // A final required phrase follows an unrestricted description.
   if(!blurred&&!/[.!?]\s*$/.test(text))break;
   const count=next.split(/\s+/).length;
   if(tokens.length<cursor+1+count)break;
   cursor=tokens.length-count;
  }
  return warnings;
 }
 window.BlogPost={capitalizationWarnings,continentHint,phraseWarnings,wordHint,countryHint,normalize,sentences,safePhoto,mount(config){
  const $=id=>document.getElementById(id),t=value=>window.ActivityHubI18n.t(value);
  let state=normalize(config),busy=false,generation=0;
  const controls=new Map(),sentenceEditors=[];
  let saveTimer,designer,inkEditor;
  const label=(node,value)=>{node.dataset.i18n=value;node.textContent=t(value);};
  const status=value=>{label($('blog-status'),config.design&&value==='Images added.'?'':value);};
  function persist(){window.ActivityAchievements?.recordBlog(config,state);clearTimeout(saveTimer);const saved=window.ActivityAutosave.write(`letseigo.app.${config.id}`,1,state);
   if($('blog-save-error')){const node=$('blog-save-error');node.hidden=saved;label(node,saved?'':'This browser could not save your post. Keep this tab open.');}
   else if(!saved)status('This browser could not save your post. Keep this tab open.');}
  const scheduleSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);};
  window.addEventListener('pagehide',persist);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
  const writingMeasure=document.createElement('canvas').getContext('2d');
  function sizeInput(input){if(config.mode==='guided'){
   const field=config.fields.find(f=>f.id===input.dataset.field);
   const style=getComputedStyle(input);writingMeasure.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
   const text=input.value||field?.help||field?.placeholder||'';
   input.style.width=`${Math.max(44,Math.ceil(writingMeasure.measureText(text).width)+8)}px`;
   return;
  }if(config.mode==='free')return;input.style.width=`${Math.max(7,Math.min(32,Array.from(input.value||input.placeholder).length+1))}ch`;}
  function source(item){return item.src||config.images.find(x=>x.id===item.id).src;}
  function render(){
   if(config.mode==='guided'){
    $('show-help').checked=state.showHelp;
    if($('writing-mode')){$('writing-mode').checked=state.inputMode==='write';$('blog-sentences').hidden=state.inputMode==='write';}
    inkEditor?.refresh();
    sentenceEditors.forEach(editor=>editor.refresh());
    for(const field of config.fields){
     const input=controls.get(field.id)?.[0];if(input)input.placeholder=state.showHelp?(field.help||field.placeholder||''):'';
    }
   }
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
  if(config.mode==='guided'){
   config.rows.forEach((row,index)=>{
    const line=document.createElement('p');line.className='sentence-editor';
    const ghost=document.createElement('div');ghost.className='sentence-ghost';ghost.setAttribute('aria-hidden','true');
    const input=document.createElement('textarea');input.className='sentence-input';input.rows=1;input.maxLength=320;input.lang='en';input.dataset.sentence=String(index);
    input.setAttribute('aria-label',`${t('Sentence')} ${index+1}`);input.setAttribute('autocapitalize','off');input.setAttribute('autocorrect','off');input.autocomplete='off';input.spellcheck=false;
    const sample=row.map((key,i)=>{const field=config.fields.find(f=>f.id===key);return {text:(i?' ':'')+(field.help||field.placeholder||'')+(i===row.length-1?'.':''),variable:!field.help};});
    function refresh(){
     if(input.value!==state.typedRows[index])input.value=state.typedRows[index];
     ghost.replaceChildren();
     const hint=countryHint(config,row,input.value,document.activeElement!==input);
     const prefix=document.createElement('span');prefix.className='sentence-entered';
     if(state.showHelp&&!input.composing){
      const warnings=phraseWarnings(config,row,input.value,document.activeElement!==input).map(w=>({...w,kind:'phrase-unrecognized'}));
      if(hint.warning)warnings.push({...hint.warning,kind:'country-unrecognized'});
      const continent=continentHint(config,row,input.value,document.activeElement!==input);
      if(continent.warning)warnings.push({...continent.warning,kind:'country-unrecognized'});
      warnings.push(...capitalizationWarnings(config,row,input.value));
      warnings.sort((a,b)=>a.start-b.start);
      let end=0;
      for(const warning of warnings){if(warning.start<end)continue;prefix.append(document.createTextNode(input.value.slice(end,warning.start)));const mark=document.createElement('span');mark.className=warning.kind;mark.textContent=input.value.slice(warning.start,warning.end);prefix.append(mark);end=warning.end;}
      prefix.append(document.createTextNode(input.value.slice(end)));
     }else prefix.textContent=input.value;
     ghost.append(prefix);
     if(state.showHelp&&(!input.value||document.activeElement===input)){
      let consumed=wordHint(sample,hint.alignedText??input.value).consumed;
      for(const part of sample){const chars=Array.from(part.text),skip=Math.min(consumed,chars.length);consumed-=skip;const span=document.createElement('span');span.className=part.variable?'sample-variable':'sample-frame';span.textContent=chars.slice(skip).join('');ghost.append(span);}
     }
     ghost.append(document.createTextNode('\u200b'));
     input.style.height='64px';input.style.height=Math.max(64,input.scrollHeight,ghost.scrollHeight)+'px';
    }
    input.oninput=()=>{if(/[\r\n\t]/.test(input.value))input.value=input.value.replace(/[\r\n\t]/g,' ');state.typedRows[index]=input.value;state.fields.body=state.typedRows.join('\n');refresh();scheduleSave();};
    input.onfocus=refresh;input.onblur=refresh;input.oncompositionstart=()=>{input.composing=true;};input.oncompositionend=()=>{input.composing=false;refresh();};
    input.onkeydown=event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();sentenceEditors[index+1]?.input.focus();}};
    line.append(ghost,input);$('blog-sentences').append(line);sentenceEditors.push({input,refresh});
   });
   new ResizeObserver(()=>sentenceEditors.forEach(editor=>editor.refresh())).observe($('blog-sentences'));
   $('writing-mode').onchange=()=>{inkEditor?.finish();state.inputMode=$('writing-mode').checked?'write':'type';render();persist();};
   $('show-help').onchange=()=>{state.showHelp=$('show-help').checked;state.fields.body=sentences(config,state).join('\n');render();persist();};
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
  window.ActivityAchievements?.recordBlog(config,state);
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
   inkEditor?.finish();
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
  if(config.mode==='guided')inkEditor=window.BlogInk.mount({host:$('blog-handwriting'),getState:()=>state,save:persist,config});
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
