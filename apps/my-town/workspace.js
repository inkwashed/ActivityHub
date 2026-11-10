/* Use the shared panel layout without CreativeBuilder's free-piece assumptions. */
(() => {
 const root=document.querySelector('#builder'),menu=root.querySelector('.town-menu');
 const output=root.querySelector('.builder-output');if(!output)return;
 root.classList.add('panel-workspace');menu.classList.add('builder-menu-scroll');
 output.stopFitting?.();menu.append(output);
 root.querySelector('.builder-play-area').append(root.querySelector('#town-tools'));
 output.setAttribute('role','region');output.setAttribute('aria-label','English sentence and directions');
 output.setAttribute('data-i18n-aria-label','English sentence and directions');
 const update=()=>menu.classList.toggle('has-more',menu.scrollHeight-menu.clientHeight-menu.scrollTop>2);
 menu.addEventListener('scroll',update,{passive:true});
 new ResizeObserver(update).observe(menu);new ResizeObserver(update).observe(output);
 new MutationObserver(update).observe(menu,{childList:true,subtree:true,characterData:true});
 // Preserve the student's position when replacing directions or place controls.
 let top=0;menu.addEventListener('click',()=>{top=menu.scrollTop},true);
 menu.addEventListener('click',()=>{menu.scrollTop=top;update()});
 update();
})();
