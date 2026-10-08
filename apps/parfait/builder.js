(() => {
 class ParfaitBuilder extends window.LayerBuilder {
  renderBase(base) {
   const layer=this.root.querySelector('#ice-cream');
   layer.innerHTML=base && !base.empty ? [0,1].map(i=>`<span class="ice-scoop scoop-${i} ${base.chips?'with-chips':''}" >${base.scoop}</span>`).join('') : '';
  }
  renderSauce(sauce) {
   this.root.querySelector('#drizzle').innerHTML=sauce && !sauce.empty ? `<span class="syrup-middle" style="--syrup:${sauce.color}"></span>` : '';
  }

 }
 window.parfaitBuilder = new ParfaitBuilder(document.querySelector('#builder'),window.PARFAIT_CONFIG);
})();
