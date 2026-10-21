(() => {
 const config=window.AvatarConfig, t=value=>window.ActivityHubI18n.t(value);
 let state={...config.defaults}, active='face';
 const tabs=document.querySelector('#tabs'), panels=document.querySelector('#panels');
 const label=key=>config.labels[key]||key;
 const translated=(element,text)=>{element.dataset.i18n=text;element.textContent=t(text)};
 const categories=[...Object.keys(config.parts).filter(key=>!['nose','mouth','accessories'].includes(key)),'design'];
 function selectTab(key,focus=false){
  active=key;
  for(const tab of tabs.children){const selected=tab.dataset.key===key;tab.setAttribute('aria-selected',selected);tab.setAttribute('aria-pressed',selected);tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus()}
  for(const panel of panels.children)panel.hidden=panel.id!==`panel-${key}`;
 }
 function update(){
  document.querySelector('#portrait').innerHTML=window.renderAvatar(state);
  const lashes=panels.querySelector('#eyelashes-toggle');if(lashes)lashes.checked=state.eyeStyle==='eyelashes';
  panels.querySelectorAll('[data-custom-color]').forEach(input=>{const key=input.dataset.customColor;input.value=state[key];input.parentElement.classList.toggle('is-custom',!config.palettes[key].includes(state[key]));});
  panels.querySelectorAll('[data-part]').forEach(button=>{
   button.setAttribute('aria-pressed',state[button.dataset.part]===button.dataset.value);
   const preview=button.querySelector('.part-preview');
   if(preview){
    preview.innerHTML=button.dataset.part==='eyes' ? window.renderAvatarExpression(button.dataset.value,state.eyeColor,state.eyeStyle,state.skin,state.hairColor) : button.dataset.part==='face' ? window.renderAvatarFacePreview({...state,face:button.dataset.value}) : button.dataset.part==='nose' ? window.renderAvatarNosePreview({...state,nose:button.dataset.value}) : button.dataset.part==='mouth' ? window.renderAvatarMouthPreview({...state,mouth:button.dataset.value}) : window.renderAvatar({...state,[button.dataset.part]:button.dataset.value});
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
  });
  if(['eyeColor','hairColor','shirtColor'].includes(key)){
   const customLabel={eyeColor:'Custom eye color',hairColor:'Custom hair color',shirtColor:'Custom clothing color'}[key];
   const custom=document.createElement('label');custom.className='custom-color';custom.title=t(customLabel);custom.dataset.i18nTitle=customLabel;
   const input=document.createElement('input');input.type='color';input.dataset.customColor=key;input.value=state[key];input.dataset.i18nAriaLabel=customLabel;input.setAttribute('aria-label',t(customLabel));
   const rainbow=document.createElement('span');rainbow.className='custom-color-rainbow';rainbow.setAttribute('aria-hidden','true');custom.append(input,rainbow);row.append(custom);
   input.addEventListener('input',()=>{if(config.isCustomColor(key,input.value)){state[key]=input.value;update();}});
   input.addEventListener('change',()=>{document.querySelector('#announcement').textContent=`${t(label(key))}: ${input.value}`;});
  }
  return group;
 }
 function partChoices(key){
   const choices=document.createElement('div');choices.className=key==='eyes'?'options expression-options':'options';
   for(const value of config.optionsFor(key)){
    const button=document.createElement('button');button.type='button';button.className='ah-choice part-choice';button.dataset.part=key;button.dataset.value=value;
    const preview=document.createElement('span');preview.className='part-preview';preview.setAttribute('aria-hidden','true');
    const text=document.createElement('span');translated(text,label(value));text.className='sr-only';button.append(preview,text);button.addEventListener('click',()=>choose(key,value));choices.append(button);
   }
   return choices;
 }
 for(const key of categories){
  const tab=document.createElement('button');tab.type='button';tab.className='ah-button';tab.id=`tab-${key}`;tab.dataset.key=key;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',`panel-${key}`);translated(tab,label(key));tab.addEventListener('click',()=>selectTab(key));tabs.append(tab);
  const panel=document.createElement('section');panel.id=`panel-${key}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.tabIndex=0;
  const heading=document.createElement('h2');translated(heading,key==='eyes'?'Eyes':label(key));panel.append(heading);
  if(key==='eyes'){
   const toggle=document.createElement('label');toggle.className='eyelashes-toggle';
   const input=document.createElement('input');input.type='checkbox';input.id='eyelashes-toggle';
   const text=document.createElement('span');translated(text,'Eyelashes');toggle.append(input,text);
   input.addEventListener('change',()=>choose('eyeStyle',input.checked?'eyelashes':'basic'));
   const headingRow=document.createElement('div');headingRow.className='eyes-heading-row';headingRow.append(heading,toggle);panel.append(headingRow);
  }
  if(key==='design'){panel.append(colorGroup('background'))}
  else{
   panel.append(partChoices(key));
  if(key==='face'){
   const noseSection=document.createElement('section');noseSection.className='face-nose-options';
   const heading=document.createElement('h2');heading.id='nose-heading';translated(heading,'Nose');noseSection.setAttribute('aria-labelledby',heading.id);
   noseSection.append(heading,partChoices('nose'));panel.append(noseSection);
  }
   const colorKey={face:'skin',eyes:'eyeColor',hair:'hairColor',clothes:'shirtColor'}[key];if(colorKey&&config.palettes[colorKey]){const space=document.createElement('div');space.style.marginTop='16px';space.append(colorGroup(colorKey));panel.append(space)}
  }
  if(key==='eyes'){
   const mouthSection=document.createElement('section');mouthSection.className='expression-mouth-options';
   const heading=document.createElement('h2');heading.id='mouth-heading';translated(heading,'Mouth');mouthSection.setAttribute('aria-labelledby',heading.id);
   mouthSection.append(heading,partChoices('mouth'));panel.append(mouthSection);
  }
  if(key==='clothes'){
   const accessoriesSection=document.createElement('section');accessoriesSection.className='clothes-accessories-options';
   const heading=document.createElement('h2');heading.id='accessories-heading';translated(heading,'Accessories');accessoriesSection.setAttribute('aria-labelledby',heading.id);
   accessoriesSection.append(heading,partChoices('accessories'));panel.append(accessoriesSection);
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
    const options=config.optionsFor(key);
    if(options.includes(saved?.state?.[key])||config.isCustomColor(key,saved?.state?.[key]))clean[key]=saved.state[key];
   }
   state=clean;const restoredTab=({mouth:'eyes',nose:'face',accessories:'clothes',colors:'design'})[saved?.active]||saved?.active;selectTab(categories.includes(restoredTab)?restoredTab:'face');update();
  }
 });
 window.BuilderPhoto({builder:()=>({...state}),render:window.renderAvatar,imageSelector:'#avatar-photo',square:true});
})();
