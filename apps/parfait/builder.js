(() => {
 class ParfaitBuilder extends window.LayerBuilder {
  updateSentence() {
   // Slot controls and lesson language have independent owners.
   if(!this.creative?.active)this.updateSlotControls();
   const pieces=[];
   if(this.creative?.active){
    for(const item of this.creative.orderedItems()){
     const type=this.creative.topping(item);
     pieces.push({id:type.id,label:type.label,singular:type.countSingular,plural:type.countPlural,band:window.FoodBuilder.sizeBand(item.scale,this.config.creativeSizes)});
    }
   }else{
    const base=this.config.bases.find(x=>x.id===this.state.base&&!x.empty);
    if(base)for(let i=0;i<2;i++)pieces.push({id:'scoop-'+base.id,label:base.label,singular:base.buttonLabel+' scoop',plural:base.buttonLabel+' scoops',band:'medium'});
    for(const pair of this.state.layers){const chosen=pair.filter(Boolean);if(!chosen.length)continue;
     for(let i=0;i<this.config.layerLayout.piecesPerRow;i++){const type=this.config.toppings.find(x=>x.id===chosen[i%chosen.length]);pieces.push({id:type.id,label:type.label,singular:type.countSingular,plural:type.countPlural,band:'medium'});}
    }
   }
   const groups=new Map();
   for(const p of pieces){const key=p.id+(this.advancedMode?':'+p.band:'');const group=groups.get(key);if(group)group.count++;else groups.set(key,{...p,count:1});}
   const scoops=[],fruit=[];
   for(const p of groups.values())(p.id.startsWith('scoop-')?scoops:fruit).push(this.advancedMode?`${p.count} ${p.band} ${p.count===1?p.singular:p.plural}`:p.label);
   const syrup=this.config.sauces.find(x=>x.id===this.state.sauce&&!x.empty);
   if(syrup)fruit.push(syrup.label);
   const join=items=>items.length<3?items.join(' and '):items.slice(0,-1).join(', ')+', and '+items.at(-1);
   let order=join(scoops)+(scoops.length&&fruit.length?' with ':'')+join(fruit);
   if(order&&!syrup)order+=' with no syrup';
   const sentence=order?`I want ${order}.`:'I want ….';
   this.setSentence(sentence);
   this.root.querySelector(this.config.sceneSelector).setAttribute('aria-label',`Parfait with whipped cream. ${sentence}`);
   this.root.querySelector('#layer-conversation').hidden=true;
  }
  scoopArtwork(base) {
   const sauce=this.config.sauces.find(item=>item.id===this.state.sauce);
   const cap=sauce && !sauce.empty ? `<svg class="scoop-syrup" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M13 49C11 29 27 14 50 14C73 14 89 29 87 49Q85 55 82 48Q78 42 76 49L75 59Q74 65 70 62Q67 60 68 51Q68 44 63 45Q59 45 59 52L59 67Q58 73 53 70Q50 68 51 57L51 49Q50 43 46 45Q42 46 43 53Q42 59 38 56Q35 54 36 48Q35 44 31 47L29 60Q27 67 23 63Q21 61 23 51Q24 45 20 46Q16 55 13 49Z" fill="${sauce.color}"/><path d="M30 28Q41 20 52 23" fill="none" stroke="${sauce.highlight}" stroke-width="2.5" stroke-linecap="round" opacity=".65"/></svg>` : '';
   return base.scoop+cap;
  }
  renderBase(base) {
   if(this.creative?.active){this.root.querySelector('#ice-cream').innerHTML='';return;}
   this.root.querySelector('#ice-cream').innerHTML=base && !base.empty ? [0,1].map(i=>`<span class="ice-scoop scoop-${i} ${base.chips?'with-chips':''}">${this.scoopArtwork(base)}</span>`).join('') : '';
  }
  chooseBase(id) {
   if(!this.creative?.active){this.setBase(id);return;}
   const base=this.config.bases.find(x=>x.id===id);
   if(base.empty){
    this.creative.gestures.cancel();
    for(const item of [...this.creative.items])if(this.creative.topping(item).category==='scoop'){item.node.remove();this.creative.items.splice(this.creative.items.indexOf(item),1);}
    this.creative.sync();this.creative.select(this.creative.selected);
   }else this.creative.add('scoop-'+id);
  }
  renderSauce() {
   this.root.querySelector('#drizzle').innerHTML='';
   if(this.creative?.active)this.creative.items.filter(item=>this.creative.topping(item).category==='scoop').forEach(item=>this.creative.paint(item));
   this.renderBase(this.config.bases.find(item=>item.id===this.state.base));
  }
 }
 window.parfaitBuilder = new ParfaitBuilder(document.querySelector('#builder'),window.PARFAIT_CONFIG);
})();
