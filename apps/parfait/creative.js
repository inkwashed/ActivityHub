(() => {
 const builder=window.parfaitBuilder;
 const scoops=builder.config.bases.filter(x=>!x.empty).map(base=>({id:'scoop-'+base.id,baseId:base.id,category:'scoop',layer:0,label:base.label,countSingular:base.buttonLabel+' scoop',countPlural:base.buttonLabel+' scoops',creativeSize:24,art:base.scoop}));
 const catalog=[...scoops,...builder.config.toppings.map(x=>({...x,category:'fruit',layer:1}))];
 builder.creative=new window.CreativeBuilder(builder,{
  catalog,
  art(item,editor){const type=editor.topping(item);return type.category==='scoop'?builder.scoopArtwork(builder.config.bases.find(x=>x.id===type.baseId)):type.art;},
  onSync(editor){
   builder.root.querySelectorAll('[data-base]').forEach(button=>{
    const present=editor.items.some(item=>editor.topping(item).baseId===button.dataset.base);
    button.setAttribute('aria-pressed',String(button.dataset.base==='none'?!editor.items.some(item=>editor.topping(item).category==='scoop'):present));
   });
  },
  scene:'#parfait',workspace:'#parfait-workspace',menuBody:'.parfait-menu-body',menu:'#parfait-menu',easyOnly:true,
  help:{learn:'Choose a flavor, pick two fruits, and add syrup. Swap the fruit choices to change their order.',play:'Tap a flavor to add a scoop, or a fruit to add one piece. Drag to move it, or pinch to resize. Use the tools to rotate, flip, copy, or delete it.'},
  resetMessage:'Parfait reset. Choose your fruit.',
  constrain(item,editor){
   item.scale=Math.max(editor.sizes.min,Math.min(editor.sizes.max,item.scale));
   // Leave an open decoration area above the bowl; keep each center reachable.
   item.x=Math.max(0,Math.min(100,item.x));item.y=Math.max(-60,Math.min(100,item.y));
  }
 });
 builder.creative.updateHelp();
})();
