(() => {
 const {config,colors,art}=PaperCraft,t=s=>window.ActivityHubI18n?.t(s)||s;
 const help='Tap a shape or letter to add it in its preset color. Drag to move; pinch or use the tools to resize. Select a piece to recolor it. Use the piece menu to reveal covered pieces. Use the layer arrows to move a piece forward or backward one layer. Choose Background to change the paper pattern and pastel color. Make a gift and say: This is for you.';
 class CraftBuilder extends FoodBuilder {
  palette(){
   this.palettes ||= {};
   const mode=this.creative?.active?'play':'learn';
   this.palettes[mode] ||= {pattern:'none',color:'brown',pieceColors:Object.fromEntries(config.toppings.map(x=>[x.id,x.color]))};
   return this.palettes[mode];
  }
  placements(item){return [{x:item.x,y:item.y,rotate:item.learnRotation||0,scale:1}]}
  chooseTopping(id){
   if(!this.creative.active){this.learnSelected=id;this.setLevel(id,this.state.toppings[id]?0:1,false);this.updateSentence();return;}
   if(this.creative.items.length>=120){this.announce(t('Your paper is full. Remove a piece to add another.'));return;}
   const before=this.creative.items.length;this.creative.add(id);
   if(this.creative.items.length>before){const item=this.creative.items.at(-1);item.color=config.toppings.find(x=>x.id===id).color;this.creative.paint(item);this.updateSentence();}
  }
  updateButton(item){const button=this.buttons.get(item.id);button.setAttribute('aria-pressed',String(!this.creative?.active&&!!this.state.toppings[item.id]));button.setAttribute('aria-label',`${item.label}. ${t(this.creative?.active?'Add one piece.':this.state.toppings[item.id]?'Tap to remove.':'Tap to add.')}`);}
  updateSentence(){
   const pieces=this.creative?.active?this.creative.orderedItems():config.toppings.filter(x=>this.state.toppings[x.id]).map(x=>({topping:x.id,color:this.palette().pieceColors[x.id]}));
   const groups=new Map();
   for(const piece of pieces){const color=piece.color||'blue',key=piece.topping+(this.advancedMode?':'+color:'');if(!groups.has(key))groups.set(key,{item:config.toppings.find(x=>x.id===piece.topping),color,count:0});groups.get(key).count++;}
   const words=[...groups.values()].map(({item,color,count})=>{const noun=(this.advancedMode?color+' ':'')+(count===1?item.countSingular:item.countPlural);return count===1?(/^[aeiou]/i.test(noun)?'an ':'a ')+noun:count+' '+noun});
   const list=words.length<2?(words[0]||'…'):words.slice(0,-1).join(', ')+' and '+words.at(-1);
   this.setSentence(`I want ${list}.`,Object.keys(colors));this.refreshColors?.();
  }
  background(){return this.palette()}
  refreshColors(){
   const bg=this.background(),background=this.category==='background';
   const paper=document.querySelector('#craft-background'),key=bg.pattern+':'+bg.color;
   if(paper.backgroundKey!==key){paper.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${PaperCraft.background.markup(bg)}</svg>`;paper.backgroundKey=key;}
   document.querySelectorAll('[data-pattern]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.pattern===bg.pattern)));
   const piece=this.creative?.active?this.creative.items.find(x=>x.id===this.creative.selected):this.state.toppings[this.learnSelected]?{topping:this.learnSelected,color:this.palette().pieceColors[this.learnSelected]}:null;
   const color=background?bg.color:piece?.color||null;
   document.querySelectorAll('[data-color]').forEach(button=>button.setAttribute('aria-pressed',String(!!color&&button.dataset.color===color)));
   const preview=document.querySelector('#color-target');preview.innerHTML=background?`<svg viewBox="0 0 100 100">${PaperCraft.background.markup(bg,'craft-preview',{left:0,top:0,width:100,height:100})}</svg>`:piece?art(piece.topping,color):'';
   preview.setAttribute('aria-label',background?t('Background'):piece?`${color} ${piece.topping}`:t('Select a piece'));
   document.querySelectorAll('[data-color]').forEach(button=>{button.disabled=!background&&!piece;button.querySelector('span').style.backgroundColor=(background?PaperCraft.background.colors:colors)[button.dataset.color]});
   if(this.buttons)this.buttons.forEach((button,id)=>{
    const color=this.creative?.active?config.toppings.find(x=>x.id===id).color:this.palette().pieceColors[id];
    if(button.previewColor!==color){button.querySelector('.ingredient-art').innerHTML=art(id,color,true);button.previewColor=color;}
   });
   document.querySelector('#craft-scene').setAttribute('role','group');
   if(!this.creative?.active)this.groups.forEach((group,id)=>group.querySelectorAll('.piece').forEach(node=>{
    let button=node.learnHit;
    if(!button){node.innerHTML='';button=document.createElement('button');button.type='button';button.className='learn-piece';button.addEventListener('click',event=>{event.stopPropagation();this.learnSelected=id;this.refreshColors()});node.append(button);node.learnHit=button;}
    const color=this.palette().pieceColors[id];if(button.renderedColor!==color){button.innerHTML=art(id,color);button.renderedColor=color;}
    button.setAttribute('aria-label',`${t('Color')}: ${id}`);button.setAttribute('aria-pressed',String(this.learnSelected===id));
   }));
  }
  clear(){const mode=this.creative.active?'play':'learn';delete this.palettes[mode];this.learnSelected=null;if(this.creative.active)this.creative.clear();else super.clear();this.updateSentence();}
 }
 const b=window.craftBuilder=new CraftBuilder(document.querySelector('#builder'),config);
 b.creative=new CreativeBuilder(b,{scene:'#craft-scene',workspace:'#craft-workspace',menuBody:'.pizza-menu-body',menu:'#craft-menu',resetMessage:'Paper cleared.',art:item=>{item.color ||= config.toppings.find(x=>x.id===item.topping).color;return art(item.topping,item.color)},onSelect:()=>b.updateSentence(),onBackgroundSelect:()=>{b.learnSelected=null;b.refreshColors()},help:{play:help,learn:'Tap shapes or letters to add or remove one in its fixed place. Select a piece in the picture to change its color. Choose Background to change the paper. EASY names your pieces; HARD adds colors.'}});
 b.creative.updateHelp();
 const helpDialog=document.querySelector('#free-info-dialog');
 document.querySelector('#craft-help').addEventListener('click',()=>helpDialog.showModal());
 document.querySelector('#difficulty-info').addEventListener('click',()=>document.querySelector('#difficulty-info-dialog').showModal());
 document.querySelector('#difficulty-info-close').addEventListener('click',()=>document.querySelector('#difficulty-info-dialog').close());
 for(const [name,hex] of Object.entries(colors)){
  const button=document.createElement('button');button.type='button';button.className='ah-choice color-swatch';button.dataset.color=name;
  button.setAttribute('aria-label',t(name));button.setAttribute('data-i18n-aria-label',name);button.title=t(name);button.dataset.i18nTitle=name;
  button.innerHTML=`<span style="background:${hex}" aria-hidden="true"></span>`;
  button.addEventListener('click',()=>{if(b.category==='background'){b.background().color=name;b.refreshColors();return;}if(b.creative.active){const item=b.creative.items.find(x=>x.id===b.creative.selected);if(item){item.color=name;b.creative.paint(item)}}else if(b.learnSelected&&b.state.toppings[b.learnSelected])b.palette().pieceColors[b.learnSelected]=name;b.updateSentence()});document.querySelector('#item-color').append(button);
 }
 for(const [pattern,label] of Object.entries(PaperCraft.background.patterns)){
  const button=document.createElement('button');button.type='button';button.className='ah-choice background-choice';button.dataset.pattern=pattern;button.setAttribute('aria-label',t(label));button.setAttribute('data-i18n-aria-label',label);
  button.innerHTML=`<span class="background-sample" aria-hidden="true"><svg viewBox="0 0 32 32">${PaperCraft.background.markup({pattern,color:'blue'},'sample-'+pattern,{left:0,top:0,width:32,height:32})}</svg></span><span data-i18n="${label}">${t(label)}</span>`;
  button.addEventListener('click',()=>{b.background().pattern=pattern;b.refreshColors()});document.querySelector('#background-options').append(button);
 }
 document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{
  b.category=button.dataset.category;document.querySelector('#topping-options').hidden=b.category==='background';document.querySelector('#background-options').hidden=b.category!=='background';
  document.querySelectorAll('[data-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===button)));
  config.toppings.forEach(item=>b.buttons.get(item.id).hidden=item.category!==button.dataset.category);b.refreshColors();
 }));
 document.querySelector('[data-category="shapes"]').click();b.updateSentence();
 document.addEventListener('activityhub:languagechange',()=>b.refreshColors());
})();

window.AppStartup?.ready();
