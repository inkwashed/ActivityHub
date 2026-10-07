(() => {
 class ParfaitBuilder extends window.FoodBuilder {
  renderBase(base) {
   const layer=this.root.querySelector('#ice-cream');
   layer.innerHTML=base && !base.empty ? [0,1].map(i=>`<span class="ice-scoop scoop-${i} ${base.chips?'with-chips':''}" >${base.scoop}</span>`).join('') : '';
  }
  renderSauce(sauce) {
   this.root.querySelector('#drizzle').innerHTML=sauce && !sauce.empty ? `<span class="syrup-middle" style="--syrup:${sauce.color}"></span>` : '';
  }
  updateSentence() {
   super.updateSentence();
   const selected=this.config.toppings.filter(t=>this.state.toppings[t.id]);
   this.root.querySelector('#parfait').setAttribute('aria-label','Parfait glass with a whipped cream base. '+this.root.querySelector('#sentence').textContent);
  }
 }
 window.parfaitBuilder = new ParfaitBuilder(document.querySelector('#builder'),window.PARFAIT_CONFIG);
})();
