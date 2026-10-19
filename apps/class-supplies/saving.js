/* Extend the shared validated adapter with this activity's per-mode colors. */
document.addEventListener('DOMContentLoaded',()=>{
 const b=window.suppliesBuilder,base=window.BuilderAutosave.adapter(b);
 window.ActivityAutosave.connect('class-supplies',{
  capture:()=>({...base.capture(),items:base.capture().items.map((item,i)=>({...item,color:b.creative.items[i].color})),palettes:b.palettes,colorTarget:document.querySelector('#color-target').value}),
  restore:raw=>{
   const ids=['case',...b.config.toppings.map(x=>x.id)];
   for(const mode of ['learn','play'])for(const id of ids){const value=raw?.palettes?.[mode]?.[id];if(Object.hasOwn(window.Supplies.colors,value))b.palettes[mode][id]=value}
   base.restore(raw);
   const savedItems=(Array.isArray(raw?.items)?raw.items:[]).slice(0,120).filter(x=>x&&b.config.toppings.some(t=>t.id===x.topping));
   b.creative.items.forEach((item,i)=>{const color=savedItems[i]?.color;item.color=Object.hasOwn(window.Supplies.colors,color)?color:b.palettes.play[item.topping]});
   b.updateSentence();
   document.querySelector('#color-target').value=ids.includes(raw?.colorTarget)?raw.colorTarget:'case';b.refreshColors();
  }
 });
});
