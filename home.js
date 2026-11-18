/* Native dialog provides Escape dismissal and keyboard focus containment. */
(() => {
  const opener = document.querySelector('#open-license');
  const dialog = document.querySelector('#license-dialog');
  opener.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener.focus());
})();

/* Filter existing cards without rebuilding links, artwork or lesson content. */
(() => {
 const finder=document.querySelector('.activity-finder'),search=document.querySelector('#activity-search'),filter=document.querySelector('#textbook-filter');
 const sections=[...document.querySelectorAll('#activity-results > section')];
 const normalize=text=>text.normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const entries=sections.map(section=>({section,cards:[...section.querySelectorAll('.activity-card')].map(card=>({card,english:card.textContent})),heading:section.querySelector('h2').textContent}));
 entries.filter(e=>e.section.classList.contains('textbook')).forEach(e=>{const option=document.createElement('option');option.value=e.section.id;option.textContent=e.heading;filter.append(option)});
 const t=text=>window.ActivityHubI18n.t(text);
 function update(){
  const terms=normalize(search.value).split(/\s+/).filter(Boolean);let total=0;
  for(const e of entries){let count=0;
   for(const {card,english} of e.cards){
    const translated=[...card.querySelectorAll('[data-i18n]')].map(el=>t(el.dataset.i18n)).join(' ');
    const haystack=normalize([english,card.textContent,translated,e.heading,card.dataset.keywords||''].join(' '));
    card.hidden=!!((filter.value&&filter.value!==e.section.id)||!terms.every(term=>/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(term)?haystack.includes(term):haystack.split(' ').some(word=>word.startsWith(term))));
    if(!card.hidden)count++;
   }
   e.section.hidden=count===0;total+=count;
   const badge=e.section.querySelector('.count');if(badge){badge.removeAttribute('data-i18n');badge.textContent=window.ActivityHubI18n.language==='ja'?`教材 ${count}つ`:`${count} ${count===1?'activity':'activities'}`;}
  }
  document.querySelector('#search-status').textContent=total===1?t('1 activity found'):t('{count} activities found').replace('{count}',total);
  document.querySelector('#search-empty').hidden=total!==0;
 }
 search.addEventListener('input',update);filter.addEventListener('change',update);
 document.querySelector('#show-all').addEventListener('click',()=>{search.value='';filter.value='';update();search.focus()});
 document.addEventListener('activityhub:languagechange',update);
 finder.hidden=false;update();
})();

/* Home-only favorites reuse the published activity directory as their catalog. */
(() => {
 const panel=document.querySelector('.home-shortcuts'),links=document.querySelector('#shortcut-links'),dialog=document.querySelector('#shortcuts-dialog'),options=document.querySelector('#shortcut-options'),opener=document.querySelector('#edit-shortcuts'),status=document.querySelector('#shortcut-status');
 const key='letseigo.home.shortcuts';
 const catalog=[...document.querySelectorAll('.activity-card')].map(card=>{
  const link=card.querySelector('a[href]'),url=new URL(link.getAttribute('href'),location.href);
  const id=url.pathname.replace(/index\.html$/,'');
  return {id,href:link.getAttribute('href'),name:card.querySelector('h3').textContent,icon:new URL(id.includes('/post/')?'assets/envelope-heart.svg':'icon.svg',url).href};
 });
 let selected=catalog.slice(0,4).map(app=>app.id);
 try{const saved=JSON.parse(localStorage.getItem(key));if(Array.isArray(saved))selected=saved.filter(id=>catalog.some(app=>app.id===id));}catch{}
 const t=text=>ActivityHubI18n.t(text);
 function render(){links.replaceChildren();for(const app of catalog.filter(app=>selected.includes(app.id))){const a=document.createElement('a');a.className='shortcut-link ah-button ah-button-icon';a.setAttribute('aria-label',app.name);a.title=app.name;a.href=app.href;if(location.protocol==='file:'&&a.href.endsWith('/'))a.href+='index.html';const img=document.createElement('img');img.src=app.icon;img.alt='';a.append(img);links.append(a);}document.querySelector('#shortcuts-empty').hidden=selected.length!==0;}
 opener.addEventListener('click',()=>{status.textContent='';options.replaceChildren();for(const app of catalog){const label=document.createElement('label'),input=document.createElement('input'),img=document.createElement('img'),name=document.createElement('span');input.type='checkbox';input.value=app.id;input.checked=selected.includes(app.id);img.src=app.icon;img.alt='';name.textContent=app.name;label.append(input,img,name);options.append(label);}dialog.showModal();});
 document.querySelector('#save-shortcuts').addEventListener('click',event=>{event.preventDefault();selected=[...options.querySelectorAll('input:checked')].map(input=>input.value);render();try{localStorage.setItem(key,JSON.stringify(selected));dialog.close();}catch{status.textContent=t('Your shortcuts are updated for this visit, but could not be saved in this browser.');}});
 dialog.addEventListener('close',()=>opener.focus());
 window.addEventListener('storage',event=>{if(event.key!==key)return;try{const value=JSON.parse(event.newValue);if(Array.isArray(value)){selected=value.filter(id=>catalog.some(app=>app.id===id));render();}}catch{}});
 render();panel.hidden=false;
})();
