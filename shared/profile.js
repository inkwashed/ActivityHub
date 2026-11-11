/* Single Profile modal for the homepage and opt-in applets. Load deferred after avatar/achievements. */
(() => {
 const profileRoot=new URL('../',document.currentScript.src);
 if(!document.getElementById('home-profile'))return;
 window.ActivityHubI18n.register({"Edit name": "名前を編集", "Save name": "名前を保存", "Cancel": "キャンセル", "Add your name": "名前を追加", "Name saved.": "名前を保存しました。", "Your name could not be saved on this device. Please try again.": "この端末に名前を保存できませんでした。もう一度お試しください。", "Color theme": "カラーテーマ", "Green — original cream and sage": "グリーン：いつものクリームとセージ", "Blue — airy blue and white": "ブルー：爽やかな青と白", "Maroon — warm POST-inspired tones": "マルーン：POSTをイメージした暖かな色", "Gold — warm honey and cream": "ゴールド：暖かな蜂蜜色とクリーム", "Purple — soft lilac and plum": "パープル：柔らかなライラックとプラム", "Theme changed for this visit. It could not be saved on this device.": "テーマを変更しました。この端末には保存できませんでした。", "Profile settings": "プロフィール設定", "Name": "名前", "Profile": "プロフィール", "Close profile settings": "プロフィール設定を閉じる", "Edit Selfie": "アバターを編集", "Unit 5": "Unit 5"});
 document.body.insertAdjacentHTML('beforeend', `<dialog class="ah-dialog" id="profile-dialog" aria-labelledby="profile-title"><div class="dialog-heading"><h2 id="profile-title" data-i18n="Profile">Profile</h2><button id="close-profile" class="ah-button ah-button-icon" type="button" autofocus aria-label="Close profile settings" data-i18n-aria-label="Close profile settings">×</button></div><div class="profile-identity"><div class="profile-portrait"><div id="profile-selfie" aria-hidden="true"></div><div class="profile-actions"><a class="ah-button" href="${new URL("apps/avatar/", profileRoot).href}"><img src="${new URL("shared/icons/polaroid.svg?v=101da8823b6b", profileRoot).href}" alt="" width="22" height="22"><span data-i18n="Edit Selfie">Edit Selfie</span></a></div></div><div class="profile-name-field"><span id="profile-name-label" class="profile-field-label" data-i18n="Name">Name</span><div id="profile-name-display"><span id="profile-name-text"></span><button id="edit-profile-name" class="ah-button ah-button-icon" type="button" aria-label="Edit name" data-i18n-aria-label="Edit name" aria-controls="profile-name-editor" aria-expanded="false"><img src="${new URL("shared/icons/pen.svg?v=c370cf0cc136", profileRoot).href}" alt=""></button></div><form id="profile-name-editor" hidden><label class="sr-only" for="profile-name" data-i18n="Name">Name</label><input id="profile-name" type="text" name="profile-name" autocomplete="given-name" maxlength="80"><div class="profile-name-actions"><button class="ah-button ah-button-secondary" type="submit" data-i18n="Save name">Save name</button><button id="cancel-profile-name" class="ah-button" type="button" data-i18n="Cancel">Cancel</button></div></form><p id="profile-name-status" class="quiet" role="status" hidden></p></div><section class="profile-badges" aria-labelledby="profile-badges-title"><h3 id="profile-badges-title" data-i18n="Badges">Badges</h3><p id="badge-empty" data-i18n="Write a blog entry or make something in a builder to earn a badge.">Write a blog entry or make something in a builder to earn a badge.</p><div class="profile-badge-grid"><button id="blog-badge" class="profile-badge" type="button" aria-expanded="false" aria-controls="badge-detail" hidden><img id="blog-badge-icon" width="30" height="30" alt=""></button></div></section></div><div id="badge-detail" class="badge-detail" hidden><div class="badge-detail-heading"><img id="badge-detail-icon" width="30" height="30" alt=""><strong id="blog-badge-label"></strong><span id="badge-progress"></span></div><p id="badge-description"></p></div><div class="profile-preferences"><fieldset class="ah-theme-picker" data-theme-picker><legend data-i18n="Color theme">Color theme</legend><div class="ah-theme-options"><label class="ah-theme-option" style="--theme-dot:var(--ah-theme-green)"><input type="radio" name="color-theme" value="green" aria-label="Green — original cream and sage" data-i18n-aria-label="Green — original cream and sage"><span class="ah-theme-dot" aria-hidden="true"></span></label><label class="ah-theme-option" style="--theme-dot:var(--ah-theme-blue)"><input type="radio" name="color-theme" value="blue" aria-label="Blue — airy blue and white" data-i18n-aria-label="Blue — airy blue and white" checked><span class="ah-theme-dot" aria-hidden="true"></span></label><label class="ah-theme-option" style="--theme-dot:var(--ah-theme-maroon)"><input type="radio" name="color-theme" value="maroon" aria-label="Maroon — warm POST-inspired tones" data-i18n-aria-label="Maroon — warm POST-inspired tones"><span class="ah-theme-dot" aria-hidden="true"></span></label><label class="ah-theme-option" style="--theme-dot:var(--ah-theme-gold)"><input type="radio" name="color-theme" value="gold" aria-label="Gold — warm honey and cream" data-i18n-aria-label="Gold — warm honey and cream"><span class="ah-theme-dot" aria-hidden="true"></span></label><label class="ah-theme-option" style="--theme-dot:var(--ah-theme-purple)"><input type="radio" name="color-theme" value="purple" aria-label="Purple — soft lilac and plum" data-i18n-aria-label="Purple — soft lilac and plum"><span class="ah-theme-dot" aria-hidden="true"></span></label></div><p class="ah-theme-status sr-only" role="status"></p></fieldset></div></dialog>`);
 /* Reuse the avatar catalog/renderer and the blog's versioned local save. */
(() => {
 const slot=document.getElementById('home-profile-picture');
 if(!slot)return;
 const dialog=document.getElementById('profile-dialog');
 const preview=document.getElementById('profile-selfie');
 const trigger=document.getElementById('home-profile');
 const nameField=document.getElementById('profile-name');
 const profileKey='letseigo.profile';
 const nameText=document.getElementById('profile-name-text');
 const nameDisplay=document.getElementById('profile-name-display');
 const nameEditor=document.getElementById('profile-name-editor');
 const editName=document.getElementById('edit-profile-name');
 const nameStatus=document.getElementById('profile-name-status');
 const t=text=>window.ActivityHubI18n?.t(text)||text;
 let savedName='',editing=false,status='';
 function renderName(){
  nameText.textContent=savedName||t('Add your name');
  nameText.classList.toggle('is-empty',!savedName);
  nameStatus.textContent=t(status);nameStatus.hidden=!status;
 }
 function restoreName(){
  const saved=window.ActivityAutosave?.read(profileKey,1);
  savedName=typeof saved?.name==='string'?saved.name.slice(0,80):'';
  if(!editing)nameField.value=savedName;
  renderName();
 }
 function finishEditing(focus=true){
  editing=false;nameEditor.hidden=true;nameDisplay.hidden=false;
  editName.setAttribute('aria-expanded','false');nameField.value=savedName;
  renderName();if(focus)editName.focus();
 }
 editName.addEventListener('click',()=>{
  editing=true;status='';renderName();nameField.value=savedName;
  nameDisplay.hidden=true;nameEditor.hidden=false;editName.setAttribute('aria-expanded','true');
  nameField.focus();nameField.select();
 });
 document.getElementById('cancel-profile-name').addEventListener('click',()=>{status='';finishEditing();});
 nameEditor.addEventListener('submit',event=>{
  event.preventDefault();
  const name=nameField.value.trim().slice(0,80);
  const previous=window.ActivityAutosave?.read(profileKey,1);
  const value=previous&&typeof previous==='object'&&!Array.isArray(previous)?{...previous,name}:{name};
  if(!window.ActivityAutosave?.write(profileKey,1,value)){
   status='Your name could not be saved on this device. Please try again.';renderName();return;
  }
  savedName=name;status='Name saved.';finishEditing();window.dispatchEvent(new Event('letseigo:profilechange'));
 });
 // Escape cancels an unsaved edit first; a second Escape closes Profile.
 dialog.addEventListener('cancel',event=>{if(editing){event.preventDefault();status='';finishEditing();}});
 dialog.addEventListener('close',()=>{status='';finishEditing(false);});
 window.addEventListener('storage',event=>{if(event.key===profileKey||event.key===null)restoreName();});
 document.addEventListener('activityhub:languagechange',renderName);
 restoreName();
 function syncPreview(){if(preview)preview.replaceChildren(...Array.from(slot.childNodes,node=>node.cloneNode(true)));}
 trigger.addEventListener('click',()=>{restoreName();refresh();dialog.showModal();});
 document.getElementById('close-profile').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>trigger.focus());
 function fallback(){
  const img=document.createElement('img');img.src=new URL('shared/icons/profile-default.svg',profileRoot).href;img.alt='';img.width=img.height=40;slot.replaceChildren(img);syncPreview();
 }
 function refresh(){
  try{
   const saved=window.ActivityAutosave?.read('letseigo.app.avatar',1),config=window.AvatarConfig;
   if(!saved?.state||typeof saved.state!=='object'||Array.isArray(saved.state)||!config||typeof window.renderAvatar!=='function'){fallback();return;}
   const clean={...config.defaults};let valid=0;
   for(const key of Object.keys(clean)){
    const options=config.optionsFor(key);
    if(options.includes(saved.state[key])||config.isCustomColor(key,saved.state[key])){clean[key]=saved.state[key];valid++;}
   }
   if(!valid){fallback();return;}
   // Saved markup is never used: only catalog-validated values reach the renderer.
   const markup=window.renderAvatar(clean);
   if(typeof markup!=='string'||!markup.startsWith('<svg')){fallback();return;}
   slot.innerHTML=markup;syncPreview();
  }catch{fallback();}
 }
 window.addEventListener('storage',event=>{if(event.key==='letseigo.app.avatar'||event.key===null)refresh();});
 window.addEventListener('focus',refresh);
 window.addEventListener('pageshow',refresh);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 refresh();
})();

 /* One grid and one detail bubble for all achievement families. */
(() => {
 const detail=document.getElementById('badge-detail'),label=document.getElementById('blog-badge-label'),description=document.getElementById('badge-description');
 const grid=document.querySelector('.profile-badge-grid'),t=s=>window.ActivityHubI18n.t(s),buttons=new Map([['blog',document.getElementById('blog-badge')]]);
 let selected=null;
 const builders=window.ActivityAchievements?.builderBadges||[];
 window.ActivityHubI18n.register({'Badges':'バッジ','Write a blog entry or make something in a builder to earn a badge.':'ブログを書いたり、アプリで作品を作ったりしてバッジを獲得しよう。','Budding Journalist':'かけだしジャーナリスト','Write at least one entry in My Blog.':'My Blogで記事を1つ以上書こう。','Green':'グリーン','Bronze':'ブロンズ','Silver':'シルバー','Gold':'ゴールド','Diamond':'ダイヤモンド'});
 for(const badge of builders){
  window.ActivityHubI18n.register({[badge.title]:badge.jaTitle,[badge.description]:badge.jaDescription});
  const button=document.createElement('button');button.type='button';button.className='profile-badge';button.id=badge.id+'-badge';button.hidden=true;button.setAttribute('aria-controls','badge-detail');button.setAttribute('aria-expanded','false');
  const img=document.createElement('img');img.width=img.height=30;img.alt='';button.append(img);grid.append(button);buttons.set(badge.id,button);
 }
 function render(){
  let earned=0;
  for(const [id,button] of buttons){
   const badge=builders.find(b=>b.id===id),{count,rank,next}=id==='blog'?ActivityAchievements.blogProgress():ActivityAchievements.builderProgress(id);
   button.hidden=!rank;button.setAttribute('aria-expanded',String(!!rank&&selected===id));
   if(!rank){if(selected===id)selected=null;continue;}earned++;
   const copy=ActivityAchievements.badgeText(id,rank.id),title=copy.title,rankName=rank.id[0].toUpperCase()+rank.id.slice(1);
   window.ActivityHubI18n.register({[copy.title]:copy.jaTitle,[copy.description]:copy.jaDescription});
   const icon=id==='blog'?`shared/badges/blog-${rank.id}.svg`:rank.id==='green'?`apps/${id}/icon.svg`:`shared/badges/${id}-${rank.id}.svg`;
   button.querySelector('img').src=new URL(icon,profileRoot).href;
   button.setAttribute('aria-label',t(title)+(badge?'':' · '+t(rankName)));
   if(selected!==id)continue;
   label.textContent=t(title);
   document.getElementById('badge-detail-icon').src=button.querySelector('img').src;
   const goal=next?.count||rank.count,progress=document.getElementById('badge-progress');
   progress.textContent=`${Math.min(count,goal)}/${goal}`;
   progress.setAttribute('aria-label',ActivityHubI18n.language==='ja'?`バッジの進み具合：${goal}のうち${Math.min(count,goal)}`:`Badge progress: ${Math.min(count,goal)} of ${goal}`);
   description.textContent=t(copy.description);
  }
  detail.hidden=!selected;document.getElementById('badge-empty').hidden=earned>0;
 }
 for(const [id,button] of buttons)button.addEventListener('click',()=>{selected=selected===id?null:id;render();});
 document.getElementById('home-profile').addEventListener('click',render);
 window.addEventListener('storage',render);window.addEventListener('focus',render);window.addEventListener('pageshow',render);window.addEventListener('letseigo:achievementschange',render);
 document.addEventListener('activityhub:languagechange',render);render();
})();
})();
