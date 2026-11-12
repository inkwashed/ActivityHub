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
