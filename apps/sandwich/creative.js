(() => {
 const b=window.sandwichBuilder;
 const bread={id:'bread',label:'bread',countSingular:'bread slice',countPlural:'bread slices',size:100,art:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${window.SandwichLesson.bread(45)}</svg>`};
 b.config.creativeExtras=[bread];
 const button=document.createElement('button');button.type='button';button.className='topping-button ah-choice bread-choice';
 button.title='bread';button.setAttribute('aria-label','Add bread');
 button.innerHTML=`<span class="ingredient-art">${bread.art}</span><span class="ingredient-name">bread</span>`;
 button.addEventListener('click',()=>{if(b.creative.active)b.creative.add('bread');});
 b.root.querySelector('#piece-picker-wrap').append(button);
 b.creative=new window.CreativeBuilder(b,{catalog:[...b.config.toppings,bread],scene:'#sandwich',workspace:'#sandwich-workspace',menuBody:'.sandwich-menu-body',menu:'#sandwich-menu',easyOnly:false,
  onSelect:()=>b.updateSource(),resetMessage:'Sandwich reset.',help:{learn:'Select a filling slot, then choose an ingredient. Use the arrows to swap fillings.',play:'Add fillings or bread, then drag to arrange. Pinch or use the tools to resize. Select a hidden piece in the item menu to bring it into view.'},
  constrain(item,editor){item.scale=Math.max(editor.sizes.min,Math.min(editor.sizes.max,item.scale));item.x=Math.max(5,Math.min(95,item.x));item.y=Math.max(5,Math.min(95,item.y));}
 });
 b.creative.updateHelp();
})();

const sandwichDifficultyHelp=document.querySelector('#difficulty-info-dialog');
document.querySelector('#difficulty-info')?.addEventListener('click',()=>sandwichDifficultyHelp.showModal());
document.querySelector('#difficulty-info-close')?.addEventListener('click',()=>sandwichDifficultyHelp.close());
