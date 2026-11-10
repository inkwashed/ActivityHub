/* Map-specific split scrolling: choices and directions are separate regions. */
(() => {
 const root=document.querySelector('#builder'),menu=root.querySelector('.town-menu');
 const output=root.querySelector('.builder-output'),pantry=menu.querySelector('.pantry');
 if(!output)return;
 root.classList.add('town-split-output');output.stopFitting?.();menu.append(output);
 output.setAttribute('role','region');output.setAttribute('aria-label','English sentence and directions');
 output.setAttribute('data-i18n-aria-label','English sentence and directions');
 // Do not shrink lesson text to fit. Overflow remains keyboard reachable.
 const update=()=>{
  output.tabIndex=output.scrollHeight>output.clientHeight+1?0:-1;
  const fixed=['.mode-row','.builder-actions','#remove','#build-tools>.hint'];
  const chrome=fixed.reduce((sum,s)=>{const e=menu.querySelector(s);if(!e||e.hidden)return sum;const c=getComputedStyle(e);return sum+e.getBoundingClientRect().height+parseFloat(c.marginTop)+parseFloat(c.marginBottom)},24);
  pantry.classList.toggle('town-tight',pantry.clientHeight<chrome+80);
  pantry.tabIndex=pantry.scrollHeight>pantry.clientHeight+1?0:-1;
 };
 let pending=false;const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update()})};
 const resize=new ResizeObserver(schedule);resize.observe(menu);resize.observe(output);resize.observe(pantry);
 new MutationObserver(schedule).observe(menu,{childList:true,subtree:true,characterData:true});
 document.addEventListener('activityhub:languagechange',schedule);schedule();
})();
