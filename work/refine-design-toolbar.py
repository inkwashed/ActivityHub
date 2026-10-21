from pathlib import Path
import re
p=Path('shared/blog-layout.js');s=p.read_text().replace('  return raw.slice(0,4).filter','  const blocks=raw.slice(0,4).filter');s=s.replace('  });\n }\n function wrap', '  });\n  // Every source belongs in Design, including new photos and formerly removed blocks.\n  return [...blocks,...defaults(images).filter(block=>!seen.has(block.key))];\n }\n function wrap');p.write_text(s)
p=Path('shared/blog-design.js');s=p.read_text().replace('/* Small button-driven editor. Layout removal never deletes source writing/photos. */','/* Builder-style quick tools. Every writing/photo source stays in the layout. */')
a=s.index("  $('design-selected').textContent=");b=s.index("  $('design-up').disabled",a)
s=s[:a]+'''  $('design-picker').value=selected||'';
  $('design-size').textContent=block?`${block.w} ${t(block.w===1?'column':'columns')} · ${block.key==='text'?t('Automatic text height'):t(['','Short','Medium','Tall'][block.h])}`:'';
  $('design-wider').disabled=!block||block.w===3;
  $('design-narrower').disabled=!block||block.w===1;
  $('design-taller').disabled=!block||block.key==='text'||block.h===3;
  $('design-shorter').disabled=!block||block.key==='text'||block.h===1;
''' +s[b:]
a=s.index("  const old=$('design-add-kind')");b=s.index("  const grid=$('design-grid');",a)
s=s[:a]+'''  $('design-picker').replaceChildren(option('',t('Select an element')),...current.blocks.map(block=>option(block.key,name(block.key))));
''' +s[b:]
a=s.index("   const remove=document.createElement('button');");b=s.index('  }));',a)
s=s[:a]+'''   node.append(select);return node;
''' +s[b:]
s=s.replace("  $('design-empty').hidden=current.blocks.length>0;updateControls();fitPreview();",'  updateControls();fitPreview();')
a=s.index(" $('design-add-kind').onchange");b=s.index(" for(const [id,dx,dy]",a)
s=s[:a]+''' $('design-picker').onchange=()=>{selected=$('design-picker').value||null;updateControls();};
 for(const [id,property,delta] of [['wider','w',1],['narrower','w',-1],['taller','h',1],['shorter','h',-1]])$("design-"+id).onclick=()=>change(block=>{block[property]=Math.max(1,Math.min(3,block[property]+delta));});
''' +s[b:];p.write_text(s)
icons={
'move-up':'M12 20V4M5 11l7-7 7 7',
'move-down':'M12 4v16M5 13l7 7 7-7',
'move-left':'M20 12H4M11 5l-7 7 7 7',
'move-right':'M4 12h16M13 5l7 7-7 7',
'wider':'M4 4v16M20 4v16M6 12h12M9 9l-3 3 3 3M15 9l3 3-3 3',
'narrower':'M4 4v16M20 4v16M3 12h7M7 9l3 3-3 3M21 12h-7M17 9l-3 3 3 3',
'taller':'M4 4h16M4 20h16M12 6v12M9 9l3-3 3 3M9 15l3 3 3-3',
'shorter':'M4 4h16M4 20h16M12 3v7M9 7l3 3 3-3M12 21v-7M9 17l3-3 3 3'}
for name,d in icons.items():Path('shared/icons/'+name+'.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#263f36" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="{d}"/></svg>\n')
p=Path('myblog/NH1-5/index.html');s=p.read_text();s=re.sub('<p id="design-empty".*?</p>','',s)
a=s.index('<aside class="design-tools"');b=s.index('</aside>',a)+8
rail='<div class="design-toolrail" role="group" aria-label="Edit element" data-i18n-aria-label="Edit element">'
for group in [[('up','Move up','move-up'),('down','Move down','move-down'),('left','Move left','move-left'),('right','Move right','move-right')],[('wider','Wider','wider'),('narrower','Narrower','narrower'),('taller','Taller','taller'),('shorter','Shorter','shorter')]]:
 rail+='<div class="design-toolgroup">'
 for key,label,icon in group:rail+=f'<button id="design-{key}" type="button" class="ah-button ah-button-icon" aria-label="{label}" data-i18n-aria-label="{label}" title="{label}" data-i18n-title="{label}" disabled><img src="../../shared/icons/{icon}.svg" alt="" aria-hidden="true"></button>'
 rail+='</div>'
rail+='</div>'
panel='''<aside class="design-tools" aria-label="Design controls" data-i18n-aria-label="Design controls">
<h2 data-i18n="Arrange your post">Arrange your post</h2><p class="blog-hint" data-i18n="Select an element here or tap it in the layout. Use the editing bar to move and resize it.">Select an element here or tap it in the layout. Use the editing bar to move and resize it.</p>
<label for="design-picker" data-i18n="Element">Element</label><select id="design-picker"></select><p id="design-size" class="blog-hint" aria-live="polite"></p>
<p class="blog-hint" data-i18n="Text height adjusts automatically. Edit your writing in Write, and add or delete pictures in Photos.">Text height adjusts automatically. Edit your writing in Write, and add or delete pictures in Photos.</p>
<button id="design-default" class="ah-button" data-i18n="Default layout">Default layout</button><p id="design-message" role="status" class="blog-hint"></p>
</aside>'''
s=s[:a]+rail+panel+s[b:];p.write_text(s)
p=Path('shared/blog-design.css');s=p.read_text().replace('grid-template-columns:minmax(0,1fr) 280px','grid-template-columns:minmax(0,1fr) 44px 240px;gap:12px')
s=re.sub(r'\.design-remove\{[^\n]+\n\.design-block.is-selected .design-remove[^\n]+\n','',s)
s=re.sub(r'\.design-tools fieldset\{[^\n]+\n','',s);s=re.sub(r'\.design-moves\{[^\n]+\n','',s);s=s.replace('#design-add-controls>button{margin-top:12px;width:100%}','')
s=s.replace('grid-template-rows:minmax(0,1fr) minmax(160px,40%)','grid-template-rows:minmax(80px,1fr) auto minmax(100px,28%);gap:0')
s+='''
/* Match Builder PLAY's compact rail, without irrelevant rotate/delete actions. */
.design-toolrail{align-self:start;display:flex;flex-direction:column;gap:12px;padding:12px 0}
.design-toolgroup{display:flex;flex-direction:column;gap:6px}
.design-toolrail .ah-button{flex:0 0 44px;width:44px;height:44px;padding:0}
@media(max-width:739px){.design-toolrail{flex-direction:row;flex-wrap:wrap;justify-content:center;gap:8px;padding:8px}.design-toolgroup{flex-direction:row}.design-tools{border-top:1px solid var(--ah-divider)}}
@media(max-height:599px){.blog-three #blog-design{overflow:auto}.design-workspace{min-height:440px}}
''';p.write_text(s)
p=Path('myblog/NH1-5/ui-ja.js');p.write_text(p.read_text()+'''\nwindow.ActivityHubI18n.register({'Edit element':'要素を編集','Move up':'上へ移動','Move down':'下へ移動','Move left':'左へ移動','Move right':'右へ移動','Wider':'幅を広げる','Narrower':'幅を狭める','Taller':'高さを上げる','Shorter':'高さを下げる','Element':'要素','Select an element':'要素を選ぶ','column':'列','columns':'列','Automatic text height':'本文の高さは自動','Select an element here or tap it in the layout. Use the editing bar to move and resize it.':'ここで要素を選ぶか、レイアウト内でタップしよう。編集バーで移動やサイズ変更ができます。','Text height adjusts automatically. Edit your writing in Write, and add or delete pictures in Photos.':'本文の高さは自動で調整されます。文章は「書く」で編集し、写真は「写真」で追加・削除しよう。'});\n''')
