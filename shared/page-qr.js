/* Share the public app entry, never local paths, drafts, queries or fragments. */
(() => {
 const script=document.currentScript;
 const path=script?.dataset.appPath;
 const demo=script?.dataset.demo==='true';
 const t=s=>window.ActivityHubI18n?.t(s)||s;
 function actionLabel(button,label,iconName){
  const icon=document.createElement('img');icon.src=new URL(`icons/${iconName}.svg`,script.src).href;icon.alt='';
  const text=document.createElement('span');text.textContent=t(label);button.append(icon,text);
 }
 function canvasFor(url){
  let qr=ActivityQR.encode(url),box=ActivityQR.logoBox(qr);
  for(let v=qr.version+1;!box&&v<=10;v++){const next=ActivityQR.encode(url,{version:v}),space=ActivityQR.logoBox(next);if(space){qr=next;box=space}}
  if(!box)throw Error('No safe logo space');
  const n=qr.modules.length,scale=16,border=4,canvas=document.createElement('canvas');
  canvas.width=canvas.height=(n+border*2)*scale;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000';
  qr.modules.forEach((row,y)=>row.forEach((dark,x)=>{if(dark)ctx.fillRect((x+border)*scale,(y+border)*scale,scale,scale)}));
  const origin=(box.start+border)*scale,extent=box.size*scale;
  ctx.fillStyle='#fff';ctx.fillRect(origin,origin,extent,extent);
  ctx.save();ctx.translate(origin+scale/2,origin+scale/2);ctx.scale((extent-scale)/64,(extent-scale)/64);
  ctx.strokeStyle='#000';ctx.fillStyle='#fff';ctx.lineWidth=3;ctx.lineCap=ctx.lineJoin='round';
  const plane=new Path2D('M5 26.5 57 21 44.5 54 29 42 19.5 49 19.5 35Z');ctx.fill(plane);ctx.stroke(plane);
  ctx.stroke(new Path2D('M19.5 35 57 21 26 39 19.5 49M26 39 44.5 54M26 39 29 42'));
  ctx.restore();return canvas;
 }
 window.PageQR={canvasFor};
 if(!path||!/^\/(?:apps\/[a-z-]+\/)?$/.test(path))return;
 const url='https://letseigo.com'+path;
 const language=document.querySelector('#language'),header=document.querySelector('header');if(!header)return;
 const trigger=document.createElement('button');trigger.type='button';trigger.className='ah-button ah-button-icon page-qr-trigger';trigger.setAttribute('aria-haspopup','dialog');
 trigger.dataset.i18nAriaLabel='Share app QR code';trigger.dataset.i18nTitle='Share app QR code';
 trigger.setAttribute('aria-label',t('Share app QR code'));trigger.title=t('Share app QR code');
 const icon=document.createElement('img');icon.src=new URL('icons/qr.svg',script.src).href;icon.alt='';trigger.append(icon);
 if(language){
  if(language.parentElement.classList.contains('home-header')){const tools=document.createElement('div');tools.className='home-header-tools';language.before(tools);tools.append(language,trigger)}
  else language.after(trigger);
 }else header.append(trigger);
 trigger.addEventListener('click',()=>{
  const dialog=document.createElement('dialog');dialog.className='ah-dialog page-qr-dialog';dialog.setAttribute('aria-labelledby','page-qr-title');
  const heading=document.createElement('div');heading.className='dialog-heading';
  const title=document.createElement('h2');title.id='page-qr-title';title.textContent=t('Share this app');
  const close=document.createElement('button');close.type='button';close.className='ah-button ah-button-icon';close.textContent='×';close.setAttribute('aria-label',t('Close'));close.addEventListener('click',()=>dialog.close());heading.append(title,close);
  const help=document.createElement('p');help.textContent=t(demo?'Lab demo: this QR opens the public Let’s EiGo! homepage.':'Scan to open this app. Your saved creation is not included.');
  const label=document.createElement('label');label.textContent=t('App link');label.htmlFor='page-qr-link';
  const link=document.createElement('input');link.id='page-qr-link';link.className='page-qr-link';link.readOnly=true;link.value=url;link.addEventListener('click',()=>link.select());
  const actions=document.createElement('div');actions.className='page-qr-actions';
  const status=document.createElement('p');status.className='page-qr-status';status.setAttribute('role','status');
  dialog.append(heading,help);
  try{
   const png=canvasFor(url).toDataURL('image/png'),image=document.createElement('img');image.className='page-qr-image';image.src=png;image.alt=t('QR code for this app');dialog.append(image);
   const download=document.createElement('a');download.className='ah-button ah-button-secondary';download.href=png;download.download=`letseigo-${path.split('/').filter(Boolean).at(-1)||'home'}-qr.png`;actionLabel(download,'Download','download');actions.append(download);
  }catch{status.textContent=t('QR unavailable. You can still copy the link.');}
  const copy=document.createElement('button');copy.type='button';copy.className='ah-button';actionLabel(copy,'Copy','duplicate');
  copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(url);status.textContent=t('Link copied.')}catch{link.focus();link.select();status.textContent=t('Select and copy the link above.')}});
  actions.append(copy);dialog.append(label,link,actions,status);
  dialog.addEventListener('close',()=>{dialog.remove();trigger.focus()},{once:true});document.body.append(dialog);dialog.showModal();
 });
})();
