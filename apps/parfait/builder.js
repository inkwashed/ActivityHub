(() => {
 class ParfaitBuilder extends window.LayerBuilder {
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
