/* Shared workspace, validated saves, Reset/Restore and local photo lifecycle. */
(() => {
 const b=window.craftBuilder,{art,config,colors}=PaperCraft;
 BuilderPanelWorkspace(b);
 const base=BuilderAutosave.adapter(b);
 const validatedPalette=value=>({...PaperCraft.background.validate(value),pieceColors:Object.fromEntries(config.toppings.map(item=>[item.id,Object.hasOwn(colors,value?.pieceColors?.[item.id])?value.pieceColors[item.id]:item.color]))});
 const storage={...base,
  hasCreation:raw=>{const palette=raw.palettes?.[raw.play?'play':'learn'];return palette?.pattern!=='none'||palette?.color!=='brown'},
  capture:()=>({...base.capture(),palettes:b.palettes,colorTarget:b.learnSelected,items:base.capture().items.map((item,i)=>({...item,color:b.creative.items[i].color||'blue'}))}),
  restore:(raw,options)=>{
   b.palettes={learn:validatedPalette(raw?.palettes?.learn),play:validatedPalette(raw?.palettes?.play)};
   base.restore(raw,options);
   const saved=(Array.isArray(raw?.items)?raw.items:[]).slice(0,options?.temporary?undefined:120).filter(x=>x&&config.toppings.some(t=>t.id===x.topping));
   b.creative.items.forEach((item,i)=>{item.color=Object.hasOwn(colors,saved[i]?.color)?saved[i].color:config.toppings.find(x=>x.id===item.topping).color;b.creative.paint(item,false)});
   b.learnSelected=config.toppings.some(x=>x.id===raw?.colorTarget)?raw.colorTarget:null;b.updateSentence();
  }
 };
 const session=ActivityAutosave.connect('paper-craft',storage);b.resetRecovery=BuilderReset.install(b,storage,session?.flush);
})();
