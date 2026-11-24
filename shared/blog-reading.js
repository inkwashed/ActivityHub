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
  const {sections,profiles,starters,prompt,footer}=config.reading;
  const key=`letseigo.app.${config.id}.reading`;
  const saved=window.ActivityAutosave.read(key,1);
  const kept=new Set(Array.isArray(saved?.bookmarks)?saved.bookmarks:[]);
  let current=profiles.find(profile=>profile.id===saved?.profile);
  let readOffset=0;

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
  function renderRead(){
   bookmarkButton=undefined;
   readHeading.replaceChildren();
   readContent.replaceChildren();
   if(!current){
    readHeading.append(english('h1',config.title),readHint);
    const cards=element('div','blog-animal-grid');
    for(const profile of profiles){
     const card=element('button','ah-button ah-choice blog-animal-card');
     card.type='button';
     card.dataset.animal=profile.id;
     card.append(art(profile.image),name(profile,'span'));
     card.onclick=()=>select(profile,()=>read.querySelector('h1'));
     cards.append(card);
    }
    readContent.append(cards);
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
   back.append(document.querySelector('.back-button svg').cloneNode(true));
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
    const fact=english('p');
    data.fact.split('**').forEach((part,index)=>{
     fact.append(index%2?element('strong','',part):part);
    });
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
  const gallery=element('dialog','ah-dialog blog-bookmark-gallery');
  const galleryHeading=element('h2');
  galleryHeading.innerHTML=bookmarkIcon;
  galleryHeading.append(translate(element('span'),'Images'));
  galleryHeading.id='blog-bookmark-heading';
  gallery.setAttribute('aria-labelledby',galleryHeading.id);
  const galleryHeader=element('header','dialog-heading');
  const done=translate(element('button','ah-button'),'Done');
  done.type='button';
  const galleryBody=element('div','blog-bookmark-gallery-body');
  galleryHeader.append(galleryHeading,done);
  gallery.append(galleryHeader,galleryBody);
  document.body.append(gallery);
  openGallery.onclick=()=>gallery.showModal();
  done.onclick=()=>gallery.close();
  gallery.addEventListener('close',()=>openGallery.focus());
  function renderDesign(images,busy,toggle){
   const available=config.images.filter(image=>kept.has(image.profile));
   openGallery.hidden=!available.length;
   const scrollTop=galleryBody.scrollTop;
   galleryBody.replaceChildren();
   if(openGallery.hidden)return;
   const list=element('div','blog-bookmark-images');
   for(const profile of profiles){
    const choices=available.filter(image=>image.profile===profile.id);
    if(!choices.length)continue;
    const group=element('div','blog-bookmark-animal');
    group.append(name(profile,'h4'));
    for(const image of choices){
     const added=images.some(item=>item.id===image.id);
     const choice=element('button','ah-button ah-choice');
     choice.type='button';
     choice.disabled=busy||(!added&&images.length>=3);
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
     choice.onclick=()=>{
      toggle(image.id);
      const next=[...galleryBody.querySelectorAll('button')].find(button=>button.getAttribute('aria-label')===choice.getAttribute('aria-label'));
      (next&&!next.disabled?next:done).focus({preventScroll:true});
     };
     group.append(choice);
    }
    list.append(group);
   }
   if(images.length>=3)galleryBody.append(translate(element('p','blog-hint'),'Your post can include up to three images.'));
   galleryBody.append(list);
   galleryBody.scrollTop=scrollTop;
  }

  renderRead();
  renderNotes();
  document.addEventListener('activityhub:languagechange',renderNotes);
  document.addEventListener('activityhub:languagechange',renderReadHint);
  return {
   renderDesign,
   beforeView(){if(!read.hidden)readOffset=readContent.scrollTop;},
   afterView(){if(!read.hidden)readContent.scrollTop=readOffset;}
  };
 }};
})();
