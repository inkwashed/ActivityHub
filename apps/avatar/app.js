(() => {
 const config=window.AvatarConfig, t=value=>window.ActivityHubI18n.t(value);
 let state={...config.defaults}, active='face';
 const tabs=document.querySelector('#tabs'), panels=document.querySelector('#panels');
 const label=key=>config.labels[key]||key;
 const translated=(element,text)=>{element.dataset.i18n=text;element.textContent=t(text)};
 const categories=[...Object.keys(config.parts),'colors'];
 function selectTab(key,focus=false){
  active=key;
  for(const tab of tabs.children){const selected=tab.dataset.key===key;tab.setAttribute('aria-selected',selected);tab.setAttribute('aria-pressed',selected);tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus()}
  for(const panel of panels.children)panel.hidden=panel.id!==`panel-${key}`;
 }
 function update(){
  document.querySelector('#portrait').innerHTML=window.renderAvatar(state);
  panels.querySelectorAll('[data-part]').forEach(button=>{
   button.setAttribute('aria-pressed',state[button.dataset.part]===button.dataset.value);
   const preview=button.querySelector('.part-preview');
   if(preview){
    preview.innerHTML=button.dataset.part==='eyes' ? window.renderAvatarExpression(button.dataset.value,state.eyeColor,state.eyeStyle,state.skin) : button.dataset.part==='face' ? window.renderAvatarFacePreview({...state,face:button.dataset.value}) : button.dataset.part==='nose' ? window.renderAvatarNosePreview({...state,nose:button.dataset.value}) : window.renderAvatar({...state,[button.dataset.part]:button.dataset.value});
   }
  });
 }
 function choose(key,value){state[key]=value;update();document.querySelector('#announcement').textContent=`${t(label(key))}: ${t(label(value))}`}
 function colorGroup(key){
  const group=document.createElement('fieldset');group.className='color-group';
  const legend=document.createElement('legend');translated(legend,label(key));group.append(legend);
  const row=document.createElement('div');row.className='color-options';group.append(row);
  config.palettes[key].forEach((color,index)=>{
   const button=document.createElement('button');button.type='button';button.className='ah-choice swatch';button.dataset.part=key;button.dataset.value=color;
   const name=config.colorNames[key][index];button.dataset.i18nAriaLabel=name;button.setAttribute('aria-label',t(name));button.title=t(name);button.dataset.i18nTitle=name;
   const swatch=document.createElement('span');swatch.style.backgroundColor=color;swatch.setAttribute('aria-hidden','true');button.append(swatch);
   button.addEventListener('click',()=>{state[key]=color;update();document.querySelector('#announcement').textContent=`${t(label(key))}: ${t(name)}`});row.append(button);
  });return group;
 }
 for(const key of categories){
  const tab=document.createElement('button');tab.type='button';tab.className='ah-button';tab.id=`tab-${key}`;tab.dataset.key=key;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',`panel-${key}`);translated(tab,label(key));tab.addEventListener('click',()=>selectTab(key));tabs.append(tab);
  const panel=document.createElement('section');panel.id=`panel-${key}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;
  const heading=document.createElement('h2');translated(heading,label(key));panel.append(heading);
  if(key==='eyes'){
   const group=document.createElement('fieldset');group.className='color-group';
   const legend=document.createElement('legend');translated(legend,'Eye style');legend.className='sr-only';group.append(legend);
   const row=document.createElement('div');row.className='eye-style-options';
   for(const value of config.eyeStyles){const button=document.createElement('button');button.type='button';button.className='ah-button';button.dataset.part='eyeStyle';button.dataset.value=value;translated(button,label(value));button.addEventListener('click',()=>choose('eyeStyle',value));row.append(button)}
   group.append(row);panel.append(group);
  }
  if(key==='colors'){Object.keys(config.palettes).forEach(color=>panel.append(colorGroup(color)))}
  else{
   const choices=document.createElement('div');choices.className=key==='eyes'?'options expression-options':'options';
   for(const value of config.parts[key]){
    const button=document.createElement('button');button.type='button';button.className='ah-choice part-choice';button.dataset.part=key;button.dataset.value=value;
    const preview=document.createElement('span');preview.className='part-preview';preview.setAttribute('aria-hidden','true');
    const text=document.createElement('span');translated(text,label(value));button.append(preview,text);button.addEventListener('click',()=>choose(key,value));choices.append(button);
   }
   panel.append(choices);
   if(key==='eyes'){const hint=document.createElement('p');hint.className='hint';translated(hint,'Pick an expression, then change the mouth if you like.');panel.append(hint)}
   const colorKey={face:'skin',eyes:'eyeColor',hair:'hairColor',clothes:'shirtColor'}[key];if(colorKey&&config.palettes[colorKey]){const space=document.createElement('div');space.style.marginTop='16px';space.append(colorGroup(colorKey));panel.append(space)}
  }
  panels.append(panel);
 }
 tabs.addEventListener('keydown',event=>{
  const index=categories.indexOf(active);let next;
  if(event.key==='ArrowRight')next=(index+1)%categories.length;
  if(event.key==='ArrowLeft')next=(index+categories.length-1)%categories.length;
  if(event.key==='Home')next=0;if(event.key==='End')next=categories.length-1;
  if(next!==undefined){event.preventDefault();selectTab(categories[next],true)}
 });
 document.querySelector('#clear').addEventListener('click',()=>{state={...config.defaults};update();document.querySelector('#announcement').textContent=t('Avatar reset.')});
 selectTab(active);update();
 window.ActivityAutosave?.connect('avatar',{
  capture:()=>({state,active}),
  restore:saved=>{
   const clean={...config.defaults};
   for(const key of Object.keys(clean)){
    const options=config.parts[key]||config.palettes[key]||(key==='eyeStyle'?config.eyeStyles:[]);
    if(options.includes(saved?.state?.[key]))clean[key]=saved.state[key];
   }
   state=clean;selectTab(categories.includes(saved?.active)?saved.active:'face');update();
  }
 });
 window.BuilderPhoto({builder:()=>({...state}),render:window.renderAvatar,imageSelector:'#avatar-photo',square:true});
})();
