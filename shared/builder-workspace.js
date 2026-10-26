/* Stable stage and bounded sentence area; text fitting never resizes the food. */
(() => {
 const root=document.querySelector('#builder');
 const kitchen=root?.querySelector('.kitchen');
 const scene=kitchen?.querySelector('[data-builder-scene],.pizza-stage,.parfait-stage,#sandwich');
 const order=kitchen?.querySelector('.order');
 if(!scene||!order)return;
 const frame=document.createElement('div');frame.className='builder-play-area';
 scene.before(frame);frame.append(scene);
 if(typeof CustomEvent!=='undefined')document.dispatchEvent(new CustomEvent('builder:workspace-ready',{detail:frame}));
 const output=document.createElement('div');output.className='builder-output';
 order.before(output);output.append(order);
 const sources=kitchen.querySelector('#source-sentence');if(sources)output.append(sources);
 let pending=false;
 const fit=()=>{
  pending=false;
  // Start at the preferred size again when content becomes shorter.
  for(let size=21;size>=16;size--){
   output.style.setProperty('--output-font-size',`${size}px`);
   if(output.scrollHeight<=output.clientHeight+1)break;
  }
  // Long compositions remain fully accessible at the minimum readable size.
  output.tabIndex=output.scrollHeight>output.clientHeight+1?0:-1;
 };
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit)}};
 new MutationObserver(schedule).observe(output,{childList:true,characterData:true,subtree:true});
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe(output);
 window.addEventListener('resize',schedule);
 document.fonts?.ready.then(schedule);schedule();
})();
