/* Optional research workspace for Blog lessons with a profile catalog. */
(() => {
 const bookmarkIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v16l-6-4-6 4z"/></svg>';
 function element(tag, className, text){
  const node=document.createElement(tag);
  if(className)node.className=className;
  if(text)node.textContent=text;
  return node;
 }
 function english(tag,text,className){
  const node=element(tag,className,text);
  node.lang='en';
  return node;
 }
 function translate(node,key){
  node.dataset.i18n=key;
  node.textContent=window.ActivityHubI18n.t(key);
  return node;
 }
 function button(label,className=''){
  const node=element('button',`ah-button ${className}`);
  node.type='button';
  return translate(node,label);
 }
 function art(src,className){
  const image=element('img',className);
  image.src=src;
  image.alt='';
  return image;
 }
 window.BlogReading={mount(config){
  const {sections,profiles,catalog=profiles,starters,prompt,footer,vocabulary=[]}=config.reading;
  const vocabularyAlternatives=[...vocabulary].sort((a,b)=>b.length-a.length)
   .map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|');
  const vocabularyPattern=vocabularyAlternatives&&new RegExp(
   `(^|[^\\p{L}\\p{N}_-])(${vocabularyAlternatives})(?![\\p{L}\\p{N}_-])`,'giu'
  );
  function appendFact(node,text){
   let offset=0;
   if(vocabularyPattern)for(const match of text.matchAll(vocabularyPattern)){
    const start=match.index+match[1].length;
    node.append(text.slice(offset,start),element('mark','blog-vocabulary-highlight',match[2]));
    offset=start+match[2].length;
   }
   node.append(text.slice(offset));
  }
  const key=`letseigo.app.${config.id}.reading`;
  const saved=window.ActivityAutosave.read(key,1);
  const kept=new Set(Array.isArray(saved?.bookmarks)?saved.bookmarks:[]);
  let current=profiles.find(profile=>profile.id===saved?.profile);
  let readOffset=0;
  const tags=(profile,section)=>[].concat(profile[section].note);
  const habitats=['the ice','the sea','forests','rainforests','mountains'];
  const labelHabitat=tag=>tag.replace(/\b\w/g,letter=>letter.toUpperCase());

  const tabs=document.querySelector('.blog-switch');
  const tab=button('Read');
  tab.id='tab-read';
  tab.dataset.blogView='read';
  tab.setAttribute('role','tab');
  tab.setAttribute('aria-controls','blog-read');
  tabs.prepend(tab);

  const read=element('section','blog-panel blog-read');
  read.id='blog-read';
  read.dataset.blogPanel='read';
  read.hidden=true;
  read.setAttribute('role','tabpanel');
  read.setAttribute('aria-labelledby',tab.id);
  const readHeading=element('div','blog-read-heading');
  const readHint=element('p','blog-hint');
  function renderReadHint(){
   const [before,after]=window.ActivityHubI18n.t(prompt).split('{bookmark}');
   readHint.textContent=before;
   if(after===undefined)return;
   const bookmark=element('span','blog-hint-bookmark');
   bookmark.setAttribute('role','img');
   bookmark.setAttribute('aria-label',window.ActivityHubI18n.t('bookmark'));
   bookmark.innerHTML=bookmarkIcon;
   readHint.append(bookmark,after);
  }
  renderReadHint();
  const readContent=element('div','blog-read-content');
  readContent.tabIndex=0;
  const search=element('button','ah-button ah-button-icon');
  search.type='button';
  search.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 5 5"/></svg>';
  search.dataset.i18nAriaLabel='Filter animals';
  search.setAttribute('aria-label',window.ActivityHubI18n.t('Filter animals'));
  search.setAttribute('aria-haspopup','dialog');
  search.setAttribute('aria-controls','blog-animal-filters');
  const filters=element('dialog','ah-dialog blog-animal-filters');
  filters.id='blog-animal-filters';
  const filterTitle=translate(element('h2'),'Filter animals');
  filterTitle.id='blog-filter-title';
  filters.setAttribute('aria-labelledby',filterTitle.id);
  const filterHeader=element('div','dialog-heading');
  const doneFilters=button('Done');
  filterHeader.append(filterTitle,doneFilters);
  filters.append(filterHeader);
  function filterSelect(section,label,allLabel){
   const field=translate(element('label'),label);
   const control=element('select');
   control.id=`blog-filter-${section}`;
   field.htmlFor=control.id;
   const all=translate(element('option'),allLabel);
   all.value='';
   control.append(all);
   for(const tag of [...new Set(profiles.flatMap(profile=>tags(profile,section)))].sort()){
    const option=english('option',section==='habitat'?labelHabitat(tag):tag);
    option.value=tag;
    control.append(option);
   }
   control.onchange=()=>{renderAnimalList();readContent.scrollTop=0;};
   filters.append(field,control);
   return control;
  }
  const habitatFilter=filterSelect('habitat','Habitat','All habitats');
  const problemFilter=filterSelect('problem','Problem','All problems');
  const clearFilters=button('Clear filters');
  clearFilters.onclick=()=>{
   habitatFilter.value=problemFilter.value='';
   renderAnimalList();
   readContent.scrollTop=0;
  };
  filters.append(clearFilters);
  document.body.append(filters);
  search.onclick=()=>filters.showModal();
  doneFilters.onclick=()=>filters.close();
  filters.addEventListener('close',()=>search.focus());
  read.append(readHeading,readContent);
  if(footer){
   const label=english('p',footer,'blog-read-footer');
   label.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>');
   read.append(label);
  }
  document.querySelector('.blog-columns').prepend(read);

  const writer=document.getElementById('blog-preview');
  const hints=element('div','blog-research');
  const notes=element('section','blog-notes-card');
  const notesTitle=translate(element('h2'),'My Notes');
  notesTitle.id='blog-notes-title';
  notesTitle.tabIndex=-1;
  const noteScroll=element('div','blog-note-list');
  noteScroll.tabIndex=0;
  noteScroll.setAttribute('role','region');
  noteScroll.setAttribute('aria-labelledby',notesTitle.id);
  const table=element('table','blog-notes-table');
  const headers=table.createTHead().insertRow();
  for(const label of ['Animal',...sections.map(section=>section.label)]){
   const header=translate(element('th'),label);
   header.scope='col';
   headers.append(header);
  }
  const noteList=table.createTBody();
  noteScroll.append(table);
  notes.append(notesTitle,noteScroll);
  hints.append(notes);
  if(starters?.length){
   const frames=element('details');
   const examples=element('ul');
   examples.append(...starters.map(text=>english('li',text)));
   frames.append(translate(element('summary'),'Sentence starters'),examples);
   hints.append(frames);
  }
  writer.querySelector('article').before(hints);

  const warning=translate(element('p','blog-research-warning'),'This browser could not save your notes. Keep this tab open.');
  warning.hidden=true;
  warning.setAttribute('role','status');
  document.querySelector('.blog-workspace').append(warning);

  function save(){
   warning.hidden=window.ActivityAutosave.write(key,1,{profile:current?.id,bookmarks:[...kept]});
  }
  function name(profile,tag){
   const heading=english(tag,profile.name);
   if(profile.ja){
    const gloss=element('small','blog-animal-gloss',profile.ja);
    gloss.lang='ja';
    heading.append(gloss);
   }
   return heading;
  }
  function renderNotes(){
   noteList.replaceChildren();
   for(const profile of profiles){
    if(!kept.has(profile.id))continue;
    const row=element('tr','blog-animal-notes');
    const animal=element('th');
    animal.scope='row';
    const nameCell=element('div','blog-note');
    const remove=element('button','ah-button ah-button-icon blog-remove-note');
    remove.type='button';
    remove.innerHTML=bookmarkIcon;
    remove.title=window.ActivityHubI18n.t('Remove note');
    remove.setAttribute('aria-label',`${remove.title}: ${profile.name}`);
    remove.onclick=()=>{
     const index=row.sectionRowIndex;
     kept.delete(profile.id);
     save();
     renderNotes();
     updateBookmark();
     const buttons=noteList.querySelectorAll('button');
     (buttons[Math.min(index,buttons.length-1)]||notesTitle).focus();
    };
    nameCell.append(name(profile,'span'),remove);
    animal.append(nameCell);
    row.append(animal);
    for(const section of sections){
     row.insertCell().append(english('span',[].concat(profile[section.id].note).join(', ')));
    }
    noteList.append(row);
   }
   if(!noteList.childElementCount){
    const cell=noteList.insertRow().insertCell();
    cell.colSpan=sections.length+1;
    cell.append(translate(element('span'),'Keep notes in Read.'));
   }
  }
  let bookmarkButton;
  function updateBookmark(){
   bookmarkButton?.setAttribute('aria-pressed',String(kept.has(current?.id)));
  }
  function select(profile,focus){
   current=profile;
   save();
   renderRead();
   readContent.scrollTop=0;
   focus().focus();
  }
  function renderAnimalList(){
   readContent.replaceChildren();
   const groups=new Map();
   for(const profile of profiles){
    if((habitatFilter.value&&!tags(profile,'habitat').includes(habitatFilter.value))||
       (problemFilter.value&&!tags(profile,'problem').includes(problemFilter.value)))continue;
    const primary=tags(profile,'habitat')[0];
    if(!groups.has(primary))groups.set(primary,[]);
    groups.get(primary).push(profile);
   }
   search.classList.toggle('is-filtered',Boolean(habitatFilter.value||problemFilter.value));
   clearFilters.disabled=!(habitatFilter.value||problemFilter.value);
   const order=[...habitats,...[...groups.keys()].filter(habitat=>!habitats.includes(habitat)).sort()];
   for(const habitat of order){
    if(!groups.has(habitat))continue;
    const group=element('section','blog-habitat-group');
    const cards=element('div','blog-animal-grid');
    for(const profile of groups.get(habitat)){
     const card=element('button','ah-button ah-choice blog-animal-card');
     card.type='button';
     card.dataset.animal=profile.id;
     card.append(art(profile.image),name(profile,'span'));
     card.onclick=()=>select(profile,()=>read.querySelector('h1'));
     cards.append(card);
    }
    group.append(english('h2',labelHabitat(habitat)),cards);
    readContent.append(group);
   }
   if(!groups.size)readContent.append(translate(element('p','blog-hint'),'No animals match these filters.'));
  }
  function renderRead(){
   bookmarkButton=undefined;
   readHeading.replaceChildren();
   readContent.replaceChildren();
   if(!current){
    const title=element('div','blog-read-title');
    title.append(english('h1',config.title),search);
    readHeading.append(title,readHint);
    renderAnimalList();
    return;
   }

   const profile=current;
   const back=element('button','ah-button ah-button-icon');
   back.type='button';
   back.dataset.i18nAriaLabel='All animals';
   back.dataset.i18nTitle='All animals';
   const backLabel=window.ActivityHubI18n.t('All animals');
   back.setAttribute('aria-label',backLabel);
   back.title=backLabel;
   back.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h5v-6h4v6h5V9"/></svg>';
   back.onclick=()=>select(undefined,()=>read.querySelector(`[data-animal="${profile.id}"]`));
   const heading=name(profile,'h1');
   heading.tabIndex=-1;
   const profileHeading=element('div','blog-profile-heading');
   profileHeading.append(back,heading);
   if(profile.category){
    const badge=translate(element('span','blog-profile-category'),profile.category);
    profileHeading.append(badge);
   }
   const keep=element('button','ah-button ah-button-icon blog-keep-note');
   keep.type='button';
   keep.dataset.i18nAriaLabel='Bookmark animal';
   keep.dataset.i18nTitle='Bookmark animal';
   keep.setAttribute('aria-label',window.ActivityHubI18n.t('Bookmark animal'));
   keep.title=window.ActivityHubI18n.t('Bookmark animal');
   keep.innerHTML=bookmarkIcon;
   keep.onclick=()=>{
    if(kept.has(profile.id))kept.delete(profile.id);
    else kept.add(profile.id);
    save();
    updateBookmark();
    renderNotes();
   };
   bookmarkButton=keep;
   profileHeading.append(keep);
   readHeading.append(profileHeading);
   const content=element('div','blog-profile-sections');
   for(const section of sections){
    const data=profile[section.id];
    const block=element('section','blog-profile-section');
    const tags=[].concat(data.note);
    const figure=config.reading.imageFor(profile,section);
    const media=element('div','blog-profile-media');
    if(figure)media.append(art(figure,'blog-profile-art'));
    const copy=element('div','blog-profile-copy');
    const question=english('h2',section.question.replace('{name}',profile.name));
    question.id=`blog-question-${section.id}`;
    const words=element('ul','blog-reading-words');
    words.append(...tags.map(tag=>english('li',tag)));
    const fact=Array.isArray(data.fact)?english('ul',undefined,'blog-profile-facts'):english('p');
    if(Array.isArray(data.fact)){
     for(const text of data.fact){
      const item=element('li');
      appendFact(item,text);
      fact.append(item);
     }
    }else appendFact(fact,data.fact);
    copy.append(question,words,fact);
    block.append(media,copy);
    content.append(block);
   }
   readContent.append(content);
   updateBookmark();
  }

  const openGallery=element('button','ah-button blog-bookmark-open');
  openGallery.innerHTML=bookmarkIcon;
  openGallery.append(translate(element('span'),'Images'));
  openGallery.type='button';
  openGallery.hidden=true;
  openGallery.setAttribute('aria-haspopup','dialog');
  document.querySelector('.design-heading').after(openGallery);
  const gallery=element('dialog','ah-dialog blog-image-dialog blog-bookmark-gallery');
  const galleryHeading=element('h2');
  galleryHeading.innerHTML=bookmarkIcon;
  galleryHeading.append(translate(element('span'),'Images'));
  galleryHeading.id='blog-bookmark-heading';
  gallery.setAttribute('aria-labelledby',galleryHeading.id);
  const galleryHeader=element('header','dialog-heading');
  const galleryTitle=element('div','blog-image-dialog-title');
  const limitHint=translate(element('p','blog-hint'),'You can select up to 3 images.');
  limitHint.hidden=true;
  galleryTitle.append(galleryHeading,limitHint);
  const done=translate(element('button','ah-button'),'Done');
  done.type='button';
  const galleryBody=element('div','blog-image-dialog-body');
  galleryHeader.append(galleryTitle,done);
  gallery.append(galleryHeader,galleryBody);
  document.body.append(gallery);
  openGallery.onclick=()=>gallery.showModal();
  done.onclick=()=>gallery.close();
  gallery.addEventListener('close',()=>openGallery.focus());
  function renderDesign(images,busy,atLimit,imageName,toggle){
   limitHint.hidden=!atLimit;
   const addedIds=new Set(images.map(image=>image.id));
   const available=config.images.filter(image=>addedIds.has(image.id)||(kept.has(image.profile)&&profiles.some(profile=>profile.id===image.profile)));
   openGallery.hidden=!available.length;
   const scrollTop=galleryBody.scrollTop;
   galleryBody.replaceChildren();
   if(openGallery.hidden)return;
   const list=element('div','blog-bookmark-images');
   for(const profile of catalog){
    const choices=available.filter(image=>image.profile===profile.id);
    if(!choices.length)continue;
    const group=element('div','blog-bookmark-animal');
    group.append(name(profile,'h4'));
    for(const image of choices){
     const added=addedIds.has(image.id);
     const choice=element('button','ah-button ah-choice');
     choice.type='button';
     choice.disabled=busy||(!added&&atLimit);
     choice.setAttribute('aria-pressed',String(added));
     choice.setAttribute('aria-label',`${profile.name}: ${window.ActivityHubI18n.t(image.label)}`);
     const thumbnail=art(image.src);
     thumbnail.loading='lazy';
     const preview=element('span','blog-bookmark-preview');
     const indicator=element('span','blog-bookmark-indicator');
     indicator.setAttribute('aria-hidden','true');
     indicator.innerHTML=added?'−':'+';
     preview.append(thumbnail,indicator);
     choice.append(preview,translate(element('span'),image.label));
     if(added)choice.append(element('span','',imageName(images.findIndex(item=>item.id===image.id))));
     choice.onclick=()=>{
      toggle(image.id);
      const next=[...galleryBody.querySelectorAll('button')].find(button=>button.getAttribute('aria-label')===choice.getAttribute('aria-label'));
      (next&&!next.disabled?next:done).focus({preventScroll:true});
     };
     group.append(choice);
    }
    list.append(group);
   }
   galleryBody.append(list);
   galleryBody.scrollTop=scrollTop;
  }

  renderRead();
  renderNotes();
  document.addEventListener('activityhub:languagechange',renderNotes);
  document.addEventListener('activityhub:languagechange',renderReadHint);
  return {
   renderDesign,
   placeNotes(container=hints){container.prepend(notes);},
   beforeView(){if(!read.hidden)readOffset=readContent.scrollTop;},
   afterView(){if(!read.hidden)readContent.scrollTop=readOffset;}
  };
 }};
})();
