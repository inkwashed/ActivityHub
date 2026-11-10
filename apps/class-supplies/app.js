(() => {
 const {config,art,caseArt}=window.Supplies;
 const t=s=>window.ActivityHubI18n?.t(s)||s;
 const target=document.querySelector('#color-target'),color=document.querySelector('#item-color'),swatches=new Map();
 target.value='' ;
 const selectColor=value=>swatches.forEach((button,name)=>button.setAttribute('aria-pressed',String(name===value)));
 const defaults=()=>Object.fromEntries([['case','blue'],...config.toppings.map(x=>[x.id,x.color])]);
 class SuppliesBuilder extends window.FoodBuilder{
  setSentence(sentence){
   super.setSentence(sentence,["pencil case",...Object.keys(window.Supplies.colors)]);
  }
  palette(){this.palettes ||= {learn:defaults(),play:defaults()};return this.palettes[this.creative?.active?'play':'learn']}
  pieceColor(item){return item.color||(item.color=this.palettes.play[item.topping])}
  selectedColor(){const piece=this.creative?.active&&this.creative.items.find(x=>x.id===this.creative.selected);return piece&&target.value===piece.topping?this.pieceColor(piece):this.palette()[target.value]}
  placements(item){return [{x:item.x,y:item.y,rotate:item.learnRotation||0,scale:1}]}
  chooseTopping(id){
   target.value=id;
   if(this.creative?.active){
    const editor=this.creative,count=editor.items.length;
    editor.add(id);
    if(editor.items.length>count){
     const piece=editor.items.at(-1);
     piece.scale=Math.min(editor.sizes.max,config.toppings.find(x=>x.id===id).defaultScale);
     editor.constrain(piece);editor.paint(piece);editor.sync();
    }
   }
   else {this.setLevel(id,this.state.toppings[id]?0:1,false);this.announce(`${config.toppings.find(x=>x.id===id).label}: ${t(this.state.toppings[id]?'selected.':'removed')}`)}
   this.refreshColors();
  }
  updateButton(item){
   const button=this.buttons.get(item.id),has=!!this.state.toppings[item.id];
   button.setAttribute('aria-pressed',String(has));
   button.setAttribute('aria-label',`${item.label}. ${t(this.creative?.active?'Add one piece.':has?'Tap to remove.':'Tap to add.')}`);
  }
  colorsEnabled(){return true}
  updateSentence(){
   const colored=this.advancedMode,palette=this.palette();
   const phrase=(id,label)=>{const words=(colored?palette[id]+' ':'')+label;return (/^[aeiou]/i.test(words)?'an ':'a ')+words};
   const difficulty=document.querySelector('#advanced-mode');if(difficulty)difficulty.checked=colored;
   const names=config.toppings.filter(x=>this.creative?.active?this.creative.items.some(i=>i.topping===x.id):this.state.toppings[x.id]).map(x=>phrase(x.id,x.label));
   if(this.creative?.active){
    names.length=0;
    const groups=new Map();
    for(const piece of this.creative.orderedItems()){
     const color=this.pieceColor(piece),key=piece.topping+(colored?':'+color:'');
     if(!groups.has(key))groups.set(key,{item:config.toppings.find(x=>x.id===piece.topping),color,count:0});
     groups.get(key).count++;
    }
    for(const {item,color,count} of groups.values()){
     const words=(colored?color+' ':'')+(count===1?item.label:item.countPlural);
     names.push(count===1?(/^[aeiou]/i.test(words)?'an ':'a ')+words:`${count} ${words}`);
    }
    names.unshift(phrase('case','pencil case'));
   }else names.unshift(phrase('case','pencil case'));
   const list=names.length===1?names[0]:names.slice(0,-1).join(', ')+' and '+names.at(-1);
   this.setSentence(`I have ${list}.`);
   document.querySelector('#supplies-scene').setAttribute('aria-label',`I have ${list}.`);
   this.refreshColors();
  }
  refreshColors(){
   const palette=this.palette();
   const caseNode=document.querySelector('#case-art');
   if(caseNode.renderedColor!==palette.case){caseNode.innerHTML=caseArt(palette.case);caseNode.renderedColor=palette.case;}
   for(const item of config.toppings){
    const svg=art(item.id,palette[item.id]);
    const button=this.buttons.get(item.id);if(button&&button.renderedColor!==palette[item.id]){button.querySelector('.ingredient-art').innerHTML=art(item.id,palette[item.id],true);button.renderedColor=palette[item.id];}
    if(!this.creative?.active)this.groups.get(item.id)?.querySelectorAll('.piece').forEach(el=>{
     let hit=el.querySelector('.learn-color-hit');
     if(!hit){
      el.innerHTML=svg;hit=document.createElement('button');hit.type='button';hit.className='learn-color-hit';
      hit.addEventListener('click',event=>{event.stopPropagation();target.value=item.id;this.refreshColorSelection()});el.append(hit);
     }else {const drawing=el.querySelector('svg');if(drawing) drawing.outerHTML=svg;}
     const box=el.querySelector('svg')?.getBBox?.();
     if(box)hit.style.cssText=`left:${box.x+box.width/2}%;top:${box.y+box.height/2}%;width:${box.width+4}%;height:${box.height+4}%`;
     hit.setAttribute('aria-label',`${t('Color')}: ${item.label}`);
     hit.setAttribute('aria-pressed',String(target.value===item.id));
    });
   }
   if(this.creative?.active)this.creative.items.forEach(item=>{if(item.renderedColor!==this.pieceColor(item))this.creative.paint(item)});
   this.refreshColorSelection();
  }
  refreshColorSelection(){
   const palette=this.palette(),enabled=this.colorsEnabled();
   document.querySelector('.color-row').hidden=!enabled;
   document.querySelector('#case-select').hidden=!enabled;
   this.groups.forEach(group=>group.querySelectorAll('.learn-color-hit').forEach(hit=>hit.hidden=!enabled));
   const exists=target.value==='case'||(this.creative?.active?this.creative.items.some(x=>x.topping===target.value):!!this.state.toppings[target.value]);
   if(!exists)target.value='';
   const item=config.toppings.find(x=>x.id===target.value);
   const question=document.querySelector('[data-pronunciation-question]');
   if(question){
    const noun=item?.label||(target.value==='case'?'pencil case':'');
    const questionText=noun?`Do you have ${/^[aeiou]/i.test(noun)?'an':'a'} ${noun}?`:'Do you have a …?';
    if(question.textContent!==questionText)this.pronunciation?.stop();
    question.textContent=questionText;
    question.setAttribute('aria-label',`${t('Listen')}: ${question.textContent}`);
    if(this.pronunciation)question.disabled=!(this.pronunciation.available||this.pronunciation.recording(question.textContent));
   }
   const previewKey=target.value+':'+this.selectedColor();
   if(target.previewKey!==previewKey){target.innerHTML=item?art(item.id,this.selectedColor(),true):target.value==='case'?caseArt(palette.case):'';target.previewKey=previewKey;}
   target.setAttribute('aria-label',target.value?`${t('Color')}: ${item?.label||'pencil case'}`:t('Select a piece'));
   document.querySelector('#case-select').setAttribute('aria-label',`${t('Color')}: pencil case`);
   document.querySelector('#case-select').setAttribute('aria-pressed',String(target.value==='case'));
   this.groups.forEach((group,id)=>group.querySelectorAll('.learn-color-hit').forEach(hit=>hit.setAttribute('aria-pressed',String(target.value===id))));
   document.querySelector('#supplies-scene').setAttribute('role','group');
   selectColor(target.value?this.selectedColor():null);
   swatches.forEach(button=>button.disabled=!target.value);
  }
  clear(){
   this.palettes ||= {learn:defaults(),play:defaults()};this.palettes[this.creative?.active?'play':'learn']=defaults();
   super.clear();target.value='' ;this.refreshColors();
  }
 }
 for(const [name,hex] of Object.entries(window.Supplies.colors)){
  const button=document.createElement('button');button.type='button';button.className='ah-choice color-swatch';
  button.setAttribute('aria-label',t(name));button.setAttribute('data-i18n-aria-label',name);button.setAttribute('title',t(name));button.setAttribute('data-i18n-title',name);
  button.setAttribute('aria-pressed','false');
  const chip=document.createElement('span');chip.style.backgroundColor=hex;chip.setAttribute('aria-hidden','true');button.append(chip);
  button.addEventListener('click',()=>{if(!b.colorsEnabled()||!target.value)return;const piece=b.creative?.active&&b.creative.items.find(x=>x.id===b.creative.selected);if(piece&&target.value===piece.topping)piece.color=name;else b.palette()[target.value]=name;b.updateSentence()});
  swatches.set(name,button);color.append(button);
 }
 const b=window.suppliesBuilder=new SuppliesBuilder(document.querySelector('#builder'),config);
 b.creative=new window.CreativeBuilder(b,{scene:'#supplies-scene',workspace:'#supplies-workspace',menuBody:'.pizza-menu-body',menu:'#supplies-menu',resetMessage:'Supplies cleared.',art:item=>{item.renderedColor=b.pieceColor(item);return art(item.topping,item.renderedColor)},onBackgroundSelect:()=>{target.value='';b.refreshColorSelection()},onSelect:editor=>{const selected=editor.items.find(x=>x.id===editor.selected);target.value=selected?selected.topping:'';b.refreshColorSelection()},help:{learn:'Tap supplies to add or remove them. Select an item in the picture to change its color.',play:'Tap supplies to add copies. Drag to arrange; pinch or use the tools to resize. Select an item to change its color. Use the item menu to bring hidden items into view.'}});
 document.querySelector('#case-select').addEventListener('click',()=>{if(b.creative?.active)b.creative.select(null);target.value='case';b.refreshColorSelection()});
 const difficultyHelp=document.querySelector('#difficulty-info-dialog');
 document.querySelector('#difficulty-info')?.addEventListener('click',()=>difficultyHelp.showModal());
 document.querySelector('#difficulty-info-close')?.addEventListener('click',()=>difficultyHelp.close());
 document.addEventListener('activityhub:languagechange',()=>b.refreshColors());
 b.creative.updateHelp();b.updateSentence();
})();
