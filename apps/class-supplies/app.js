(() => {
 const {config,art,caseArt}=window.Supplies;
 const t=s=>window.ActivityHubI18n?.t(s)||s;
 const target=document.querySelector('#color-target'),color=document.querySelector('#item-color'),swatches=new Map();
 target.value='case';
 const selectColor=value=>swatches.forEach((button,name)=>button.setAttribute('aria-pressed',String(name===value)));
 const defaults=()=>Object.fromEntries([['case','blue'],...config.toppings.map(x=>[x.id,x.color])]);
 class SuppliesBuilder extends window.FoodBuilder{
  setSentence(sentence){
   if(!window.BuilderPronunciation){this.root.querySelector("#sentence").textContent=sentence;return}
   this.pronunciation ||= new window.BuilderPronunciation(this.root.querySelector("#sentence"));
   this.pronunciation.render(sentence,["pencil case",...config.toppings.flatMap(x=>[x.label,x.countPlural]),...Object.keys(window.Supplies.colors)]);
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
  colorsEnabled(){return !!(this.creative?.active||this.advancedMode)}
  announce(message){super.announce(message==='Play mode. Easy language is on.'?'Play mode. Colors are included.':message)}
  updateSentence(){
   const colored=this.colorsEnabled(),palette=this.palette();
   const phrase=(id,label)=>{const words=(colored?palette[id]+' ':'')+label;return (/^[aeiou]/i.test(words)?'an ':'a ')+words};
   document.querySelector('#advanced-mode').checked=colored;
   const names=config.toppings.filter(x=>this.creative?.active?this.creative.items.some(i=>i.topping===x.id):this.state.toppings[x.id]).map(x=>phrase(x.id,x.label));
   if(this.creative?.active){
    names.length=0;
    const groups=new Map();
    for(const piece of this.creative.orderedItems()){
     const color=this.pieceColor(piece),key=piece.topping+':'+color;
     if(!groups.has(key))groups.set(key,{item:config.toppings.find(x=>x.id===piece.topping),color,count:0});
     groups.get(key).count++;
    }
    for(const {item,color,count} of groups.values())names.push(`${count} ${color} ${count===1?item.label:item.countPlural}`);
    names.unshift(`1 ${palette.case} pencil case`);
   }else names.unshift(phrase('case','pencil case'));
   const list=names.length===1?names[0]:names.slice(0,-1).join(', ')+' and '+names.at(-1);
   this.setSentence(`I have ${list}.`);
   document.querySelector('#supplies-scene').setAttribute('aria-label',`I have ${list}.`);
   this.refreshColors();
  }
  refreshColors(){
   const palette=this.palette();
   document.querySelector('#case-art').innerHTML=caseArt(palette.case);
   for(const item of config.toppings){
    const svg=art(item.id,palette[item.id]);
    const button=this.buttons.get(item.id);if(button)button.querySelector('.ingredient-art').innerHTML=art(item.id,palette[item.id],true);
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
   if(this.creative?.active)this.creative.items.forEach(item=>this.creative.paint(item));
   this.refreshColorSelection();
  }
  refreshColorSelection(){
   const palette=this.palette(),enabled=this.colorsEnabled();
   document.querySelector('.color-row').hidden=!enabled;
   document.querySelector('#case-select').hidden=!enabled;
   this.groups.forEach(group=>group.querySelectorAll('.learn-color-hit').forEach(hit=>hit.hidden=!enabled));
   const exists=target.value==='case'||(this.creative?.active?this.creative.items.some(x=>x.topping===target.value):!!this.state.toppings[target.value]);
   if(!exists)target.value='case';
   const item=config.toppings.find(x=>x.id===target.value);
   target.innerHTML=item?art(item.id,this.selectedColor(),true):caseArt(palette.case);
   target.setAttribute('aria-label',`${t('Color')}: ${item?.label||'pencil case'}`);
   document.querySelector('#case-select').setAttribute('aria-label',`${t('Color')}: pencil case`);
   document.querySelector('#case-select').setAttribute('aria-pressed',String(target.value==='case'));
   this.groups.forEach((group,id)=>group.querySelectorAll('.learn-color-hit').forEach(hit=>hit.setAttribute('aria-pressed',String(target.value===id))));
   document.querySelector('#supplies-scene').setAttribute('role','group');
   selectColor(this.selectedColor()||'blue');
  }
  clear(){
   this.palettes ||= {learn:defaults(),play:defaults()};this.palettes[this.creative?.active?'play':'learn']=defaults();
   super.clear();target.value='case';this.refreshColors();
  }
 }
 for(const [name,hex] of Object.entries(window.Supplies.colors)){
  const button=document.createElement('button');button.type='button';button.className='ah-choice color-swatch';
  button.setAttribute('aria-label',t(name));button.setAttribute('data-i18n-aria-label',name);button.setAttribute('title',t(name));button.setAttribute('data-i18n-title',name);
  button.setAttribute('aria-pressed','false');
  const chip=document.createElement('span');chip.style.backgroundColor=hex;chip.setAttribute('aria-hidden','true');button.append(chip);
  button.addEventListener('click',()=>{if(!b.colorsEnabled())return;const piece=b.creative?.active&&b.creative.items.find(x=>x.id===b.creative.selected);if(piece&&target.value===piece.topping)piece.color=name;else b.palette()[target.value]=name;b.updateSentence()});
  swatches.set(name,button);color.append(button);
 }
 const b=window.suppliesBuilder=new SuppliesBuilder(document.querySelector('#builder'),config);
 b.creative=new window.CreativeBuilder(b,{scene:'#supplies-scene',workspace:'#supplies-workspace',menuBody:'.pizza-menu-body',menu:'#supplies-menu',resetMessage:'Supplies cleared.',art:item=>art(item.topping,b.pieceColor(item)),onSelect:editor=>{const selected=editor.items.find(x=>x.id===editor.selected);target.value=selected?selected.topping:'case';b.refreshColorSelection()},help:{learn:'Tap supplies to add or remove them. In HARD, tap an item in the scene to choose its color and read color words. Ask your partner what they have.',play:'Tap supplies to add them. Drag to arrange; pinch or use the tools to resize. Tap an item in the scene, then choose a color below. Each copy can have its own color. The sentence counts matching items and colors.'}});
 document.querySelector('#case-select').addEventListener('click',()=>{if(b.creative?.active)b.creative.select(null);target.value='case';b.refreshColorSelection()});
 document.addEventListener('activityhub:languagechange',()=>b.refreshColors());
 b.creative.updateHelp();b.updateSentence();
 // Export uses the same original art and ordered transforms as the live scene.
 window.renderSupplies=builder=>{
  const palette=builder.palette();
  const pieces=builder.creative.active?builder.creative.orderedItems():config.toppings.filter(x=>builder.state.toppings[x.id]).map(x=>({topping:x.id,x:x.x,y:x.y,scale:1,rotate:x.learnRotation||0,flip:false}));
  const content=pieces.map(piece=>{const item=config.toppings.find(x=>x.id===piece.topping),size=(builder.creative.active?item.creativeSize:item.size)*piece.scale;return `<g transform="translate(${piece.x} ${piece.y}) rotate(${piece.rotate}) scale(${piece.flip?-1:1} 1)"><svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" viewBox="0 0 100 100" overflow="visible" fill="none" stroke="#31483f" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${art(item.id,builder.creative.active?builder.pieceColor(piece):palette[item.id]).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`}).join('');
  // Fixed framing in both modes: keep scene proportions and crop at photo edges.
  const side=110,left=-5,top=-5;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="${left} ${top} ${side} ${side}" preserveAspectRatio="xMidYMid meet">
   <defs><pattern id="desk-grain" width="48" height="18" patternUnits="userSpaceOnUse"><rect width="48" height="18" fill="#e6c999"/><path d="M-8 5Q8 2 24 5T56 5M-10 13Q10 16 28 13T58 13" fill="none" stroke="#c29a66" stroke-opacity=".2" stroke-width=".35"/><path d="M3 9h14m18 0h10" stroke="#fff5dc" stroke-opacity=".3" stroke-width=".3"/></pattern><pattern id="carpet" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#858581"/><path d="M.4 .7h.5m1 1.3h.6" stroke="#6e6f6c" stroke-width=".2" opacity=".5"/></pattern><clipPath id="desk-frame"><rect x="-5" y="-5" width="110" height="110"/></clipPath></defs>
   <rect x="-5" y="-5" width="110" height="110" fill="url(#carpet)"/>
   <rect x="-25" y="1" width="150" height="102" fill="#575852" opacity=".18"/>
   <rect x="-25" y="0" width="150" height="100" fill="url(#desk-grain)"/>
   <path d="M-25 0H125" stroke="#f4dfb8" stroke-width=".6"/>
   <path d="M-25 100H125" stroke="#ad8452" stroke-width="1.4"/>
   <g clip-path="url(#desk-frame)">${caseArt(palette.case)}${content}</g></svg>`;
 };
 window.BuilderPhoto({builder:()=>b,imageSelector:'#supplies-photo',render:window.renderSupplies,caption:'Class Supplies',background:'#eee6d2'});
})();
