/* Two-slot layers are reusable interaction; coordinates/art belong to config. */
(() => {
 const t = text => window.ActivityHubI18n?.t(text) || text;
 class LayerBuilder extends window.FoodBuilder {
  mount() {
   this.state.layers=this.config.layerLayout.rows.map(()=>[null,null]);
   this.activeLayer=0;this.activeSlot=0;this.lastResponse='';this.nextPrompt=false;this.responseSlot=0;
   super.mount();
   this.root.querySelectorAll('[data-layer-slot]').forEach(button=>button.addEventListener('click',()=>{
    this.activeSlot=Number(button.dataset.layerSlot);this.nextPrompt=false;this.lastResponse='';this.updateSentence();
   }));
   this.root.querySelector('#layer-previous').addEventListener('click',()=>this.goLayer(-1));
   this.root.querySelector('#layer-next').addEventListener('click',()=>this.goLayer(1));
   this.root.querySelector('#clear-slot').addEventListener('click',()=>{
    this.state.layers[this.activeLayer][this.activeSlot]=null;this.lastResponse='';this.nextPrompt=false;this.refreshLayers();
   });
   document.addEventListener?.('activityhub:languagechange',()=>this.updateSentence());
   this.updateSentence();
  }
  chooseTopping(id) {
   const item=this.config.toppings.find(item=>item.id===id);if(!item)return;
   const slot=this.activeSlot;this.responseSlot=slot;
   this.state.layers[this.activeLayer][slot]=id;
   this.lastResponse=`${slot===1?'Yes, I want ':'I want '}${item.label}.`;
   this.nextPrompt=false;
   if(slot===0)this.activeSlot=1;
   this.refreshLayers();
   this.announce(this.lastResponse);
  }
  goLayer(delta) {
   const next=this.activeLayer+delta;
   if(next<0||next>=this.state.layers.length)return;
   this.activeLayer=next;this.activeSlot=0;this.lastResponse='';this.nextPrompt=delta>0;
   this.updateSentence();
  }
  refreshLayers() {
   this.config.toppings.forEach(item=>{
    this.state.toppings[item.id]=this.state.layers.some(row=>row.includes(item.id))?1:0;
    const group=this.groups.get(item.id);
    while(group.children.length)group.lastElementChild.remove();
   });
   this.state.layers.forEach((pair,rank)=>{
    const selected=pair.filter(Boolean);if(!selected.length)return;
    const row=this.config.layerLayout.rows[rank];
    const count=this.config.layerLayout.piecesPerRow;
    for(let i=0;i<count;i++) {
     const id=selected[i%selected.length];const item=this.config.toppings.find(item=>item.id===id);
     const piece=document.createElement('span');piece.className='piece';
     piece.style.cssText=`left:${row.left+(row.right-row.left)*i/(count-1)}%;top:${row.y}%;width:${this.config.layerLayout.pieceSize}%;--rotation:${item.rotation||0}deg;--scale:1;--delay:0ms;z-index:${rank+1}`;
     piece.innerHTML=item.art;this.groups.get(id).append(piece);
    }
   });
   this.updateSentence();
  }
  updateButton(item) {
   const button=this.buttons.get(item.id);if(!button)return;
   const pair=this.state.layers[this.activeLayer];
   button.setAttribute('aria-pressed',String(pair.includes(item.id)));
   button.setAttribute('aria-label',`${item.label}. ${t('Choose for selected slot.')}`);
  }
  updateSentence() {
   const labels=this.state.layers.map(pair=>[...new Set(pair.filter(Boolean))].map(id=>this.config.toppings.find(item=>item.id===id).label).join(' and ')).filter(Boolean);
   const base=this.config.bases?.find(item=>item.id===this.state.base&&!item.empty);
   const syrup=this.config.sauces.find(item=>item.id===this.state.sauce);
   let order=labels.join(',\n');
   if(base)order=base.label+(order?' with\n'+order:'');
   const sentence=order?`I want ${order}\nwith ${syrup?.label||'no syrup'}.`:'I want ….';
   this.root.querySelector('#sentence').textContent=sentence;
   this.root.querySelector(this.config.sceneSelector).setAttribute('aria-label',`Parfait with whipped cream. ${sentence.replace(/\n/g,' ')}`);
   this.root.querySelector('#layer-number').textContent=`${t('Layer')} ${this.activeLayer+1} / ${this.state.layers.length}`;
   this.root.querySelectorAll('[data-layer-slot]').forEach(button=>{
    const slot=Number(button.dataset.layerSlot),id=this.state.layers[this.activeLayer][slot];
    const item=this.config.toppings.find(item=>item.id===id);
    button.innerHTML=`${item?'<span class="slot-art" aria-hidden="true">'+item.art+'</span>':''}<span>${slot+1}. ${item?item.label:t('Choose fruit')}</span>`;
    button.setAttribute('aria-pressed',String(slot===this.activeSlot));
   });
   this.root.querySelector('#layer-previous').disabled=this.activeLayer===0;
   this.root.querySelector('#layer-next').disabled=this.activeLayer===this.state.layers.length-1;
   this.root.querySelector('#clear-slot').disabled=!this.state.layers[this.activeLayer][this.activeSlot];
   const talk=this.root.querySelector('#layer-conversation');talk.hidden=!this.advancedMode;
   const pair=this.state.layers[this.activeLayer];
   const prompt=this.nextPrompt?'OK, next?':pair[0]&&pair[1]?'OK, next?':this.activeSlot===1?'OK, anything else?':'What do you want?';
   talk.textContent=this.lastResponse
    ? `B: ${this.responseSlot===1?'OK, anything else?':'What do you want?'}\nA: ${this.lastResponse}\nB: ${prompt}`
    : `${this.activeLayer===0?'A: Parfait, please!\n':''}B: ${prompt}`;
   this.config.toppings.forEach(item=>this.updateButton(item));
  }
  clear() {
   this.state.layers=this.state.layers.map(()=>[null,null]);this.activeLayer=0;this.activeSlot=0;this.lastResponse='';this.nextPrompt=false;
   this.refreshLayers();this.setBase(this.config.defaultBase??null,false);this.setSauce(this.config.defaultSauce,false);
   this.announce('Parfait reset. Choose your fruit.');
  }
 }
 window.LayerBuilder=LayerBuilder;
})();
