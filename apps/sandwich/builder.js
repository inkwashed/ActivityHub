(() => {
 const t=s=>window.ActivityHubI18n?.t(s)||s;
 class SandwichBuilder extends window.FoodBuilder {
  mount(){
   this.state.slots=[null,null,null];this.activeSlot=0;
   const slots=this.root.querySelector('#slots');this.slotControls=[];this.swapControls=[];
   for(let i=0;i<3;i++){
    const wrap=document.createElement('div'),b=document.createElement('button'),clear=document.createElement('button');
    b.type=clear.type='button';b.className='ah-choice slot';clear.className='ah-button slot-clear';clear.innerHTML='<span aria-hidden="true">×</span>';
    clear.setAttribute('aria-label',`Clear filling ${i+1}`);
    b.addEventListener('click',()=>{this.activeSlot=i;this.updateSentence();});
    clear.addEventListener('click',()=>{this.state.slots[i]=null;this.activeSlot=i;this.updateSentence();b.focus();});
    wrap.append(b,clear);slots.append(wrap);this.slotControls.push(wrap);
    if(i<2){
     const swap=document.createElement('button');swap.type='button';swap.className='ah-button ah-button-icon slot-swap';
     swap.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7H20M16 3L20 7L16 11M19 17H4M8 13L4 17L8 21"/></svg>';
     swap.addEventListener('click',()=>this.swapSlots(i));slots.append(swap);this.swapControls.push(swap);
    }
   }
   this.root.querySelector('#source-choice').addEventListener('change',e=>{
    const piece=this.selectedPiece();if(!piece)return;
    const type=this.config.toppings.find(x=>x.id===piece.topping);
    if(!type)return;
    this.state.origins??={};this.state.origins[type.id]=type.sources.includes(e.target.value)?e.target.value:null;
    if(!this.creative?.active)this.state.slots.filter(x=>x?.topping===type.id).forEach(x=>x.source=this.state.origins[type.id]);
    this.updateSentence();
   });
   super.mount();
   document.addEventListener('activityhub:languagechange',()=>this.updateSentence());
  }
  swapSlots(i){
   if(this.creative?.active||i<0||i>1)return;
   [this.state.slots[i],this.state.slots[i+1]]=[this.state.slots[i+1],this.state.slots[i]];
   if(this.activeSlot===i)this.activeSlot=i+1;else if(this.activeSlot===i+1)this.activeSlot=i;
   this.updateSentence();this.announce(t('Fillings swapped.'));
  }
  selectedPiece(){return this.creative?.active?this.creative.items.find(x=>x.id===this.creative.selected):this.state.slots[this.activeSlot];}
  chooseTopping(id){
   if(this.creative?.active){this.creative.add(id);return;}
   this.state.slots[this.activeSlot]={topping:id,source:this.state.origins?.[id]||null};this.updateSentence();
  }
  updateButton(item){
   const selected=this.creative?.active?this.creative.items.some(x=>x.topping===item.id):this.state.slots?.some(x=>x?.topping===item.id);
   this.buttons.get(item.id)?.setAttribute('aria-pressed',String(!!selected));
  }
  updateSource(){
   const piece=this.selectedPiece(),section=this.root.querySelector('#source-section');
   const play=!!this.creative?.active,type=this.config.toppings.find(x=>x.id===piece?.topping);
   section.hidden=!play&&!type;
   const select=this.root.querySelector('#source-choice');
   select.disabled=!type;
   this.root.querySelector('#source-label').textContent=type?.label||t('Source');
   if(!type){
    select.replaceChildren();const option=document.createElement('option');option.value='';option.textContent=t('Select a filling first');select.append(option);return;
   }
   select.replaceChildren();
   for(const value of ['',...type.sources]){const o=document.createElement('option');o.value=value;o.textContent=value||t('Choose a source');select.append(o);}
   select.value=this.state.origins?.[type.id]||'';
  }
  decorateInitials(){
   const sentence=this.root.querySelector('#sentence');
   // Replace only the opening text node; vocabulary buttons and plain text stay intact.
   for(const node of [...(sentence.childNodes||[])]){
    if(node.nodeType!==3)continue;
    const match=node.textContent.match(/^(My sandwich is an? )([A-Z]+)(\.)/);
    if(!match)continue;
    const initials=document.createElement('span');initials.className='sandwich-initials';
    initials.setAttribute('aria-label',match[2].split('').join(' '));
    for(const letter of match[2]){const badge=document.createElement('span');badge.className='sandwich-initial';badge.textContent=letter;initials.append(badge);}
    node.replaceWith(document.createTextNode(match[1]),initials,document.createTextNode(node.textContent.slice(match[1].length+match[2].length)));
    break;
   }
  }
  updateSentence(){
   const play=this.creative?.active,items=play?this.creative.orderedItems():this.state.slots.filter(Boolean);
   // Migrate old slot-specific countries once; use the earliest explicit choice.
   this.state.origins??={};
   for(const piece of items){const type=this.config.toppings.find(x=>x.id===piece.topping);if(type&&!(type.id in this.state.origins)&&type.sources.includes(piece.source))this.state.origins[type.id]=piece.source;}
   const described=items.map(piece=>({...piece,source:this.state.origins[piece.topping]||null}));
   const output=window.SandwichLesson.describe(described,this.config,this.advancedMode);this.setSentence(output.sentence);this.decorateInitials();
   this.root.querySelector('#source-sentence').textContent='';
   this.root.querySelector('#sandwich').setAttribute('aria-label',output.sentence);
   const slots=this.root.querySelector('#slots');slots.hidden=!!play;
   if(!play){
    this.slotControls.forEach((wrap,i)=>{const piece=this.state.slots[i],type=this.config.toppings.find(x=>x.id===piece?.topping),button=wrap.children[0];
     button.innerHTML=`<span class="slot-art" aria-hidden="true">${type?type.art:'<svg viewBox="0 0 24 24" fill="none" stroke="#8a918c" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6 18.4 18.4"/></svg>'}</span>`;
     button.setAttribute('aria-label',`${t('Filling')} ${i+1}: ${type?.label||t('Choose an ingredient')}`);button.setAttribute('aria-pressed',String(i===this.activeSlot));wrap.children[1].hidden=!piece;wrap.children[1].setAttribute('aria-label',t(`Clear filling ${i+1}`));
    });
    this.swapControls.forEach((button,i)=>{
     const a=this.state.slots[i],b=this.state.slots[i+1];
     button.disabled=a?.topping===b?.topping&&a?.source===b?.source;
     button.setAttribute('aria-label',t(i===0?'Swap fillings 1 and 2':'Swap fillings 2 and 3'));
    });
    this.pieces.innerHTML=window.SandwichLesson.svg(items,this.config);
   }
   // Bread/plate remain beneath draggable PLAY pieces; foreground bread is decorative.
   this.root.querySelector('#sandwich').style.backgroundImage=play?`url("data:image/svg+xml,${encodeURIComponent(window.SandwichLesson.svg([],this.config,true))}")`:'';
   this.config.toppings.forEach(x=>this.updateButton(x));this.updateSource();
  }
  clear(){this.state.origins={};if(this.creative?.active){this.creative.clear();return;}this.state.slots=[null,null,null];this.activeSlot=0;this.updateSentence();this.announce(t('Sandwich reset.'));}
 }
 window.sandwichBuilder=new SandwichBuilder(document.querySelector('#builder'),window.SANDWICH_CONFIG);
})();
