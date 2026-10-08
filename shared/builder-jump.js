/* Native section jump; available only in the shared stacked layout. */
(() => {
 const activity=document.querySelector('[data-jump-section="activity"]');
 const choices=document.querySelector('[data-jump-section="choices"]');
 if(!activity||!choices)return;
 const nav=document.createElement('nav');nav.className='builder-jump';
 const button=document.createElement('button');button.type='button';button.className='ah-button';
 nav.append(button);document.body.append(nav);
 let target=choices,scheduled=false;
 const update=()=>{
  scheduled=false;
  target=choices.getBoundingClientRect().top<window.innerHeight*.55?activity:choices;
  const label=target===activity?'Back to activity':'Jump to choices';
  button.textContent=(target===activity?'↑ ':'↓ ')+(window.ActivityHubI18n?.t(label)||label);
 };
 button.addEventListener('click',()=>{
  const destination=target;
  destination.focus({preventScroll:true});
  destination.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 });
 const schedule=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update)}};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
 document.addEventListener('activityhub:languagechange',update);update();
})();
