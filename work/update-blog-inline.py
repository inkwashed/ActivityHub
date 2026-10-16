from pathlib import Path
p=Path('shared/blog-post.js');s=p.read_text();s=s.replace("fields[field.id]=field.options.includes(raw?.fields?.[field.id])?raw.fields[field.id]:field.default;","fields[field.id]=typeof raw?.fields?.[field.id]==='string'?raw.fields[field.id].replace(/[\\r\\n\\t]/g,' ').slice(0,field.maxLength||80):field.default;")
s=s.replace('...config.derive(state.fields)','...(config.derive?.(state.fields)||{})').replace("values[key]||''","values[key]||'________'")
s=s.replace('const controls=new Map();','const controls=new Map();\n  let saveTimer;')
s=s.replace('function persist(){if(', 'function persist(){clearTimeout(saveTimer);if(')
s=s.replace('  function source(item)',"  const scheduleSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(persist,250);};\n  window.addEventListener('pagehide',persist);\n  document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});\n  function sizeInput(input){input.style.width=`${Math.max(7,Math.min(32,Array.from(input.value).length+1))}ch`;}\n  function source(item)")
s=s.replace("for(const [id,input] of controls)input.value=state.fields[id];\n   $('blog-sentences').replaceChildren(...sentences(config,state).map(text=>{const p=document.createElement('p');p.textContent=text;return p;}));","for(const [id,inputs] of controls)for(const input of inputs){if(input.value!==state.fields[id])input.value=state.fields[id];sizeInput(input);}")
s=s.replace("$('blog-example').disabled=busy;$('blog-reset').disabled=busy;","$('blog-example').disabled=busy;$('blog-reset').disabled=busy;$('share').disabled=busy;")
a=s.index('  for(const field of config.fields){',s.index('function render'))
b=s.index('  const saved=',a)
s=s[:a]+'''  // Build sentence nodes once: typing and IME composition must retain focus/caret.
  for(const template of config.sentences){
   const paragraph=document.createElement('p');
   for(const part of template.split(/(\\{\\w+\\})/g)){
    const key=/^\\{(\\w+)\\}$/.exec(part)?.[1];
    const field=config.fields.find(x=>x.id===key);
    if(!field){paragraph.append(document.createTextNode(part));continue;}
    const input=document.createElement('input');input.type='text';input.lang='en';input.maxLength=field.maxLength||80;
    input.placeholder='________';input.autocomplete='off';input.spellcheck=false;input.dataset.field=key;
    input.dataset.i18nAriaLabel=field.label;input.setAttribute('aria-label',t(field.label));
    if(!controls.has(key))controls.set(key,[]);controls.get(key).push(input);
    input.addEventListener('input',()=>{
     state.fields[key]=input.value;sizeInput(input);
     for(const other of controls.get(key))if(other!==input){other.value=input.value;sizeInput(other);}
     scheduleSave();
    });paragraph.append(input);
   }
   $('blog-sentences').append(paragraph);
  }
''' +s[b:]
s=s.replace("  function avatar(){","  function avatar(){\n   const profile=window.ActivityAutosave.read('letseigo.profile',1);\n   const name=typeof profile?.name==='string'?profile.name.slice(0,80).trim():'';\n   $('blog-author-name').textContent=name||t('My blog');")
s=s.replace("event.key==='letseigo.app.avatar'||event.key===null","event.key==='letseigo.app.avatar'||event.key==='letseigo.profile'||event.key===null")
s=s.replace("document.addEventListener('activityhub:languagechange',render);avatar();render();","document.addEventListener('activityhub:languagechange',()=>{render();avatar();});avatar();render();\n  window.BuilderPhoto({builder:()=>{avatar();return {title:config.title,name:$('blog-author-name').textContent,avatar:$('blog-avatar').querySelector('svg')? 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent($('blog-avatar').innerHTML):$('blog-avatar').querySelector('img').src,images:state.images.map(source),sentences:sentences(config,state)};},canvas:window.BlogSnapshot,imageSelector:'#blog-snapshot',messages:{making:'Making your snapshot…',error:'The snapshot could not be made. Please close this preview and try again.'}});")
p.write_text(s)
p=Path('myblog/NH6-5/config.js');s=p.read_text();a=s.index(' fields:');b=s.index(' sentences:');s=s[:a]+''' title:'Where is it from?',
 fields:[
  {id:'item',label:'My item',maxLength:80,default:''},
  {id:'country',label:'Country',maxLength:80,default:''},
  {id:'continent',label:'Continent',maxLength:80,default:''},
  {id:'description',label:'Describe the country',maxLength:80,default:''}
 ],
'''+s[b:];s=s.replace("country:'Vietnam',description", "country:'Vietnam',continent:'Asia',description");p.write_text(s)
# Extend the existing photo dialog lifecycle with an opt-in canvas renderer.
p=Path('shared/builder-photo.js');s=p.read_text();s=s.replace("status.dataset.i18n = 'Making your photo…'","status.dataset.i18n = options.messages?.making || 'Making your photo…'")
s=s.replace('      const svg = options.render(builder);','      let canvas;\n      if(options.canvas){canvas=await options.canvas(builder);}\n      else {\n      const svg = options.render(builder);')
s=s.replace("      const canvas = document.createElement('canvas');","      canvas = document.createElement('canvas');")
s=s.replace('      const blob = await', '      }\n      const blob = await');s=s.replace("status.dataset.i18n = 'The photo could not be made. Please close this preview and try again.'","status.dataset.i18n = options.messages?.error || 'The photo could not be made. Please close this preview and try again.'");p.write_text(s)
# Place the writing in the post; mobile views now switch Post / Photos.
p=Path('myblog/NH6-5/index.html');s=p.read_text();s=s.replace('<script defer src="../../shared/blog-post.js">','<script defer src="../../shared/builder-photo.js"></script><script defer src="../../shared/blog-snapshot.js"></script><script defer src="../../shared/blog-post.js">')
s=s.replace('data-view="edit"','data-view="preview"').replace('data-blog-view="edit" aria-pressed="true" data-i18n="Edit">Edit','data-blog-view="preview" aria-pressed="true" data-i18n="Post">Post').replace('data-blog-view="preview" aria-pressed="false" data-i18n="Preview">Preview','data-blog-view="edit" aria-pressed="false" data-i18n="Photos">Photos')
s=s.replace('<strong data-i18n="My world post">My world post</strong>','<strong id="blog-author-name"></strong>')
a=s.index('<h2 data-i18n="Write your post">');b=s.index('<section class="blog-images-section">',a);s=s[:a]+s[b:]
s=s.replace('<div class="blog-actions">','<p class="blog-hint" data-i18n="Type or use your device’s handwriting keyboard in the blanks.">Type or use your device’s handwriting keyboard in the blanks.</p><div class="blog-actions">')
s=s.replace('<button id="blog-example" class="ah-button ah-button-secondary" data-i18n="Use example">Use example</button></div>','<button id="share" class="ah-button ah-button-secondary"><img src="../../shared/icons/camera.svg" alt=""><span data-i18n="Share">Share</span></button></div><button id="blog-example" class="ah-button blog-example" data-i18n="Use example">Use example</button>')
s=s.replace('</body>', '''<dialog id="share-dialog" class="ah-dialog" aria-labelledby="snapshot-title"><div class="dialog-heading"><h2 id="snapshot-title" data-i18n="Your blog snapshot">Your blog snapshot</h2><button class="dialog-close ah-button ah-button-icon" aria-label="Close" data-i18n-aria-label="Close">×</button></div><p id="share-status" role="status"></p><img id="blog-snapshot" alt="Your blog snapshot" data-i18n-alt="Your blog snapshot" hidden><a id="download-photo" class="ah-button ah-button-secondary" download="my-blog.png" hidden><img src="../../shared/icons/download.svg" alt=""><span data-i18n="Download">Download</span></a></dialog></body>''');p.write_text(s)
