from pathlib import Path
import shutil,json,re
p=Path('shared/blog-post.js');s=p.read_text();s=s.replace("raw.fields[field.id].replace(/[\\r\\n\\t]/g,' ').slice(0,field.maxLength||80)","(field.multiline?raw.fields[field.id].replace(/\\r\\n?/g,'\\n'):raw.fields[field.id].replace(/[\\r\\n\\t]/g,' ')).slice(0,field.maxLength||80)")
s=s.replace('function sentences(config,state){const values=',"function sentences(config,state){if(config.mode==='free')return state.fields.body.replace(/\\n{3,}/g,'\\n\\n').split('\\n');const values=")
s=s.replace('function sizeInput(input){input.style.width=',"function sizeInput(input){if(config.mode==='free')return;input.style.width=")
s=s.replace("$('blog-example').disabled=busy;","if($('blog-example'))$('blog-example').disabled=busy;")
s=s.replace('  for(const template of config.sentences){', '''  if(config.mode==='free'){
   for(const field of config.fields){
    const input=$(`blog-${field.id}`);input.maxLength=field.maxLength;controls.set(field.id,[input]);
    input.addEventListener('input',()=>{state.fields[field.id]=input.value;scheduleSave();});
   }
  }
  for(const template of config.sentences||[]){''')
s=s.replace("  $('blog-example').onclick=", "  if($('blog-example'))$('blog-example').onclick=")
s=s.replace('return {title:config.title,name:',"return {title:config.mode==='free'?(state.fields.title.trim()||t('My blog')):config.title,name:")
s=s.replace('  return {capture:', '''  if(config.sample&&$('blog-sample')){
   const dialog=$('sample-dialog'),sample=config.sample;
   $('sample-post-title').textContent=sample.title;$('sample-author').textContent=sample.author;
   $('sample-body').replaceChildren(...sample.paragraphs.map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));
   $('blog-sample').onclick=()=>dialog.showModal();
   dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  }
  return {capture:''')
p.write_text(s)
new=Path('myblog/NH1-5');new.mkdir(exist_ok=True)
for f in ['icon.svg','ui-ja.js','manifest.webmanifest']:shutil.copyfile(Path('myblog/NH6-5')/f,new/f)
(new/'config.js').write_text('''/* NEW HORIZON 1 is Junior High Year 1, following Elementary 6. */
window.PlaceBlogConfig={
 id:'myblog-nh1-5',mode:'free',title:'A place to share',
 fields:[{id:'title',label:'Title',maxLength:120,default:''},{id:'body',label:'Your post',multiline:true,maxLength:2000,default:''}],
 images:[],
 sample:{title:'Cafe Maria',author:'Fumiya',paragraphs:[
  'Cafe Maria is my favorite restaurant in Honolulu. The restaurant does not have a website, but it is very popular.',
  'Maria is the owner of the restaurant. She does not speak Japanese, but she knows a lot about Japan. She is kind and friendly.',
  'My favorite dish there is loco moco. It is a beef patty and a fried egg on top of rice. It is wonderful.'
 ]}
};
''')
(new/'app.js').write_text('window.placeBlog=window.BlogPost.mount(window.PlaceBlogConfig);\n')
s=Path('myblog/NH6-5/index.html').read_text().replace('My Blog: Where is it from?','My Blog: A place to share').replace('NEW HORIZON Elementary 6 · Unit 5','NEW HORIZON 1 · Unit 5 · Junior High').replace('/myblog/NH6-5/','/myblog/NH1-5/').replace('../../#new-horizon-6','../../').replace('class="ah-blog"','class="ah-blog blog-free"')
s=s.replace('<h1 lang="en">Where is it from?</h1>', '<div class="blog-heading"><h1 data-i18n="A place to share">A place to share</h1><button id="blog-sample" class="ah-button" aria-haspopup="dialog" aria-controls="sample-dialog" data-i18n="Sample">Sample</button></div><p class="blog-hint" data-i18n="Write about a place you have been to or want to visit.">Write about a place you have been to or want to visit.</p><label class="blog-field-label" for="blog-title" data-i18n="Title">Title</label><input id="blog-title" type="text" lang="en" autocomplete="off">')
s=s.replace('<div id="blog-sentences"></div>','<label class="blog-field-label" for="blog-body" data-i18n="Your post">Your post</label><textarea id="blog-body" lang="en" rows="10" aria-describedby="blog-body-hint"></textarea><p id="blog-body-hint" class="blog-hint" data-i18n="Write in your own words. Up to 2,000 characters.">Write in your own words. Up to 2,000 characters.</p>')
s=re.sub('<button id="blog-example".*?</button>','',s)
s=s.replace('Type or use your device’s handwriting keyboard in the blanks.','Type or use your device’s handwriting keyboard to write your post.')
s=s.replace('</body>', '''<dialog id="sample-dialog" class="ah-dialog" aria-labelledby="sample-dialog-title"><div class="dialog-heading"><h2 id="sample-dialog-title" data-i18n="Sample post">Sample post</h2><button class="dialog-close ah-button ah-button-icon" aria-label="Close" data-i18n-aria-label="Close">×</button></div><article class="blog-sample-post" lang="en"><div class="blog-sample-bar" aria-hidden="true">● ● ● <span>MY BLOG</span></div><div class="blog-sample-content"><h3 id="sample-post-title"></h3><div class="blog-author"><img src="../../shared/icons/profile-default.svg" alt="" width="48" height="48"><strong id="sample-author"></strong></div><div id="sample-body"></div></div></article></dialog></body>''')
(new/'index.html').write_text(s)
p=new/'manifest.webmanifest';d=json.loads(p.read_text());d['name']='My Blog: A place to share';p.write_text(json.dumps(d,indent=2)+'\n')
p=new/'ui-ja.js';p.write_text(p.read_text()+'''\nwindow.ActivityHubI18n.register({'A place to share':'紹介したい場所','Sample':'見本','Sample post':'投稿の見本','Title':'タイトル','Write about a place you have been to or want to visit.':'行ったことがある場所や、行ってみたい場所について書こう。','Write in your own words. Up to 2,000 characters.':'自分のことばで書こう。2,000文字まで入力できます。','Type or use your device’s handwriting keyboard to write your post.':'文字を入力して投稿を書こう。端末の手書きキーボードも使えます。'});\n''')
p=Path('shared/blog-post.css');p.write_text(p.read_text()+'''
/* Free composition: the post owns title/body editing; photos remain in the side panel. */
.blog-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.blog-heading h1{margin:0}
.blog-field-label{display:block;font-size:14px;font-weight:bold;margin:16px 0 8px}
.blog-free #blog-title,.blog-free #blog-body{display:block;width:100%;min-width:0;padding:12px;border:1px solid var(--ah-border);border-radius:var(--ah-radius-control);background:var(--ah-surface);color:var(--ah-ink);font:inherit}
.blog-free #blog-title{font-size:26px;min-height:48px;margin-bottom:20px}
.blog-free #blog-body{font-size:20px;line-height:1.7;min-height:260px;resize:vertical;overflow:auto;overscroll-behavior:contain}
.blog-free #blog-body:focus-visible{outline:3px solid var(--ah-focus);outline-offset:3px}
#sample-dialog{width:min(640px,94vw)}.blog-sample-post{border:1px solid var(--ah-divider);border-radius:12px;overflow:hidden;background:var(--ah-surface)}
.blog-sample-bar{display:flex;justify-content:space-between;background:var(--ah-hover);padding:10px 16px;color:var(--ah-muted);font-size:12px}.blog-sample-content{padding:20px}.blog-sample-content h3{font-size:28px;margin:0 0 20px}.blog-sample-content .blog-author img{border-radius:50%}#sample-body{font-size:18px;line-height:1.65}#sample-body p{margin:16px 0}
''')
