from pathlib import Path
import re
p=Path('shared/blog-post.js');s=p.read_text()
s=s.replace('  return {fields,images};', '''  if(config.design){
   const used=new Set();images.forEach((image,i)=>{
    const rawImage=(Array.isArray(raw?.images)?raw.images:[]).filter(x=>x&&(config.images.some(y=>y.id===x.id)||safePhoto(x.src)))[i];
    let uid=typeof rawImage?.uid==='string'&&/^[a-zA-Z0-9_-]{1,50}$/.test(rawImage.uid)?rawImage.uid:`legacy-${i}`;
    while(used.has(uid))uid+='-x';used.add(uid);image.uid=uid;
   });
   return {fields,images,layout:window.BlogLayout.normalize(raw?.layout,images)};
  }
  return {fields,images};''')
s=s.replace('  let saveTimer;','  let saveTimer,designer;')
s=s.replace("$('share').disabled=busy;", "$('share').disabled=busy;\n   designer?.refresh();")
s=s.replace("   }else{const img=document.createElement('img');img.src='../../shared/icons/profile-default.svg';img.alt='';slot.append(img);}\n  }", "   }else{const img=document.createElement('img');img.src='../../shared/icons/profile-default.svg';img.alt='';slot.append(img);}\n   designer?.refresh();\n  }")
s=s.replace('return {src};', "return config.design?{src,uid:'p-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}:{src};")
a=s.index('  for(const button of document.querySelectorAll(\'[data-blog-view]\'))button.onclick=()=>{');b=s.index("  document.addEventListener('activityhub:languagechange'",a)
s=s[:a]+'''  const viewButtons=[...document.querySelectorAll('[data-blog-view]')];
  function setView(button){
   document.querySelector('.blog-workspace').dataset.view=button.dataset.blogView;
   for(const other of viewButtons){
    other.setAttribute('aria-pressed',String(other===button));
    if(config.design){other.setAttribute('aria-selected',String(other===button));other.tabIndex=other===button?0:-1;}
   }
   if(config.design){
    for(const panel of document.querySelectorAll('[data-blog-panel]'))panel.hidden=panel.dataset.blogPanel!==button.dataset.blogView;
    if(button.dataset.blogView==='design'){avatar();designer?.refresh();}
   }
  }
  viewButtons.forEach((button,index)=>{
   button.onclick=()=>setView(button);
   if(config.design)button.onkeydown=event=>{
    let next;if(event.key==='ArrowRight')next=(index+1)%viewButtons.length;if(event.key==='ArrowLeft')next=(index+viewButtons.length-1)%viewButtons.length;if(event.key==='Home')next=0;if(event.key==='End')next=viewButtons.length-1;
    if(next!==undefined){event.preventDefault();viewButtons[next].focus();setView(viewButtons[next]);}
   };
  });
''' +s[b:]
s=s.replace("  window.BuilderPhoto({builder:","  if(config.design){designer=window.BlogDesign({getState:()=>state,save:persist,source,getProfile:()=>({name:$('blog-author-name').textContent})});designer.refresh();setView(viewButtons[0]);}\n  window.BuilderPhoto({builder:")
s=s.replace("images:state.images.map(source),sentences:","images:state.images.map(source),photoKeys:state.images.map(image=>'photo:'+image.uid),design:designer?.plan(),sentences:")
p.write_text(s)
p=Path('myblog/NH1-5/config.js');s=p.read_text().replace("mode:'free',","mode:'free',design:true,");p.write_text(s)
p=Path('shared/blog-snapshot.js');s=p.read_text().replace("  canvas.width=width;canvas.height=textY+paragraphs.reduce((sum,lines)=>sum+lines.length*38+14,0)+64;", "  const totalHeight=post.design?galleryY+(post.design.rows*132-12)+64:textY+paragraphs.reduce((sum,lines)=>sum+lines.length*38+14,0)+64;\n  const scale=Math.min(1,16000/totalHeight);canvas.width=Math.round(width*scale);canvas.height=Math.round(totalHeight*scale);ctx.scale(scale,scale);")
s=s.replace('ctx.fillRect(0,0,width,canvas.height)', 'ctx.fillRect(0,0,width,totalHeight)')
a=s.index('  const gap=12,cell=');b=s.index("  ctx.fillStyle='#627067';ctx.font='14px Arial';",a)
original=s[a:b]
s=s[:a]+'''  if(post.design){
   for(const block of post.design.blocks){
    const x=pad+block.x,y=galleryY+block.y;
    if(block.key==='text'){
     ctx.fillStyle='#263f36';ctx.font='26px Arial';ctx.textBaseline='top';
     block.lines.forEach((line,i)=>ctx.fillText(line,x+12,y+12+i*38));ctx.textBaseline='alphabetic';
    }else{
     const image=photos[post.photoKeys.indexOf(block.key)];if(!image)continue;
     ctx.fillStyle='#eee6d2';ctx.fillRect(x,y,block.width,block.height);
     const ratio=Math.min(block.width/image.naturalWidth,block.height/image.naturalHeight),w=image.naturalWidth*ratio,h=image.naturalHeight*ratio;
     ctx.drawImage(image,x+(block.width-w)/2,y+(block.height-h)/2,w,h);
    }
   }
  }else{
''' +original+"  }\n"+s[b:]
s=s.replace('canvas.height-24','totalHeight-24');p.write_text(s)
p=Path('myblog/NH1-5/index.html');s=p.read_text()
s=s.replace('<body class="ah-blog blog-free">','<body class="ah-blog blog-free blog-three">')
s=s.replace('<script defer src="../../shared/blog-post.js', '<script defer src="../../shared/blog-layout.js"></script><script defer src="../../shared/blog-design.js"></script><script defer src="../../shared/blog-post.js')
s=s.replace('<link rel="stylesheet" href="../../shared/page-qr.css','<link rel="stylesheet" href="../../shared/blog-design.css"><link rel="stylesheet" href="../../shared/page-qr.css')
a=s.index('<nav class="blog-switch"');b=s.index('</nav>',a)+6
s=s[:a]+'''<nav class="blog-switch" role="tablist" aria-label="Post sections" data-i18n-aria-label="Post sections">
<button id="tab-write" class="ah-button" role="tab" aria-controls="blog-preview" data-blog-view="preview" aria-selected="true" data-i18n="Write">Write</button>
<button id="tab-photos" class="ah-button" role="tab" aria-controls="blog-editor" data-blog-view="edit" aria-selected="false" tabindex="-1" data-i18n="Photos">Photos</button>
<button id="tab-design" class="ah-button" role="tab" aria-controls="blog-design" data-blog-view="design" aria-selected="false" tabindex="-1" data-i18n="Design">Design</button></nav>'''+s[b:]
s=s.replace('<section id="blog-preview"','<section data-blog-panel="preview" role="tabpanel" aria-labelledby="tab-write" id="blog-preview"').replace('<section id="blog-editor"','<section data-blog-panel="edit" role="tabpanel" aria-labelledby="tab-photos" hidden id="blog-editor"')
s=s.replace('<div id="blog-gallery"></div>','')
s=s.replace('<div id="blog-images"></div>','<div id="blog-gallery"></div><div id="blog-images"></div>')
a=s.index('<div class="blog-actions">');b=s.index('</section>',a)
actions=s[a:b];s=s[:a]+s[b:]
# Footer controls stay available on all tabs, outside the panels.
s=s.replace('</div></main>',Path('work/design-panel.html').read_text()+'</div><div class="blog-bottom">'+actions+'</div></main>')
p.write_text(s)
