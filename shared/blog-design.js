/* Builder-style quick tools. Every writing/photo source stays in the layout. */
window.BlogDesign=({getState,save,source,imageName,columns=3})=>{
 const $=id=>document.getElementById(id),L=window.BlogLayout,t=s=>window.ActivityHubI18n.t(s);
 const measureContext=document.createElement('canvas').getContext('2d');measureContext.font='26px Arial';
 const measure=text=>measureContext.measureText(text).width;
 const grid=$('design-grid'),viewport=grid.closest('.design-sheet-scroll');
 const touchGrid=columns===6;
 let selected=null,current,drag=null,refreshPending=false,suppressDragClick=false;
 if(touchGrid)grid.classList.add('design-touch-grid');
 const target=document.createElement('div');
 target.className='design-drop-target';
 target.hidden=true;
 const displayRows=()=>current.rows+(touchGrid?2:0);
 const gridHeight=()=>displayRows()*(current.rowHeight+current.gap)-current.gap;

 const elementPreview=document.createElement('div');
 elementPreview.className='design-element-preview';
 elementPreview.hidden=true;
 elementPreview.setAttribute('aria-hidden','true');
 $('design-picker').after(elementPreview);
 let previewSource=null;
 const message=text=>{const node=$('design-message');node.dataset.i18n=text;node.textContent=t(text);};
 const layoutKey=s=>s.inputMode==='write'?'inkLayout':'layout';
 const name=key=>L.isInk(key)?`${t('Handwriting')} ${Number(key.slice(4))+1}`:L.isText(key)?`${t('Text')} ${L.textIndex(key)+1}`:imageName(getState().images.findIndex(x=>L.keyOf(x)===key));
 const option=(value,text)=>{const node=document.createElement('option');node.value=value;node.textContent=text;return node;};
 function plan(priority){const s=getState();return L.plan(s[layoutKey(s)],s.images,s.fields.body,measure,priority,s.inputMode==='write'?s.ink:null,s.inkSheets,columns);}
 function updateControls(){
  const block=current.blocks.find(b=>b.key===selected);
  $('design-picker').value=selected||'';
  const content=block?[...$('design-grid').children].find(node=>node.dataset.key===selected)?.firstElementChild:null;
  const photo=content?.matches('img')?content:null;
  if(content!==previewSource){
   previewSource=content;
   elementPreview.hidden=!content;
   elementPreview.replaceChildren();
   if(content){
    const thumbnail=content.cloneNode(true);
    if(content.matches('canvas')){
     thumbnail.classList.remove('design-ink');
     thumbnail.getContext('2d').drawImage(content,0,0);
    }
    if(photo){
     thumbnail.style.aspectRatio=`${block.width} / ${block.height}`;
     thumbnail.style.maxWidth=`${Math.min(144,96*block.width/block.height)}px`;
    }
    elementPreview.append(thumbnail);
   }
  }
  const ratio=photo?.naturalWidth?Math.max(block.width/photo.naturalWidth,block.height/photo.naturalHeight):0;
  const cropX=ratio&&photo.naturalWidth*ratio>block.width+.5,cropY=ratio&&photo.naturalHeight*ratio>block.height+.5;
  $('design-crop').hidden=!(cropX||cropY);
  for(const [axis,available] of [['x',cropX],['y',cropY]]){
   $('crop-'+axis+'-row').hidden=!available;
   $('crop-'+axis).value=block?.[axis==='x'?'cropX':'cropY']??50;
  }
  $('design-size').textContent=block?`${block.w} ${t(block.w===1?'column':'columns')} · ${L.isInk(block.key)?t('Sentence strip'):L.isText(block.key)?t('Automatic text height'):touchGrid?`${block.h} ${t(block.h===1?'row':'rows')}`:t(['','Short','Medium','Tall'][block.h])}`:'';
  $('design-wider').disabled=!block||block.w===columns;
  $('design-narrower').disabled=!block||block.w===1;
  $('design-taller').disabled=!block||L.isText(block.key)||L.isInk(block.key)||block.h===columns;
  $('design-shorter').disabled=!block||L.isText(block.key)||L.isInk(block.key)||block.h===1;
  $('design-up').disabled=!block||block.row===0;$('design-left').disabled=!block||block.col===0;
  $('design-right').disabled=!block||block.col+block.w===columns;
  $('design-down').disabled=!block||block.row>=24;
  for(const node of grid.querySelectorAll('.design-block')){const active=node.dataset.key===selected;node.classList.toggle('is-selected',active);node.querySelector('.design-select').setAttribute('aria-pressed',String(active));}
 }
 function fitPreview(){
  if(!current)return;
  const sheet=document.querySelector('.design-sheet');
  const style=getComputedStyle(viewport);
  const width=viewport.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  const height=viewport.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-8;
  if(width<=0||height<=0)return;
  // Shrink the artwork, not the controls. Very tall designs retain internal scrolling.
  const floor=Math.min(width,300),fit=height*current.width/gridHeight();
  sheet.style.width=`${Math.min(width,Math.max(floor,Math.min(width*.85,612,fit)))}px`;
 }
 new ResizeObserver(fitPreview).observe(document.querySelector('.design-sheet-scroll'));
 function refresh(){
  if(drag){refreshPending=true;return;}
  refreshPending=false;
  const s=getState();current=plan();
  if(!current.blocks.some(b=>b.key===selected))selected=null;
  $('design-picker').replaceChildren(option('',t('Select an element')),...current.blocks.map(block=>option(block.key,name(block.key))));
  grid.style.gridTemplateColumns=`repeat(${columns},minmax(0,1fr))`;
  grid.style.gridTemplateRows=`repeat(${displayRows()},minmax(0,1fr))`;
  grid.style.aspectRatio=`${current.width} / ${gridHeight()}`;
  grid.style.setProperty('--design-row-step',`${100*(current.rowHeight+current.gap)/current.width}cqw`);
  grid.style.setProperty('--design-column-step',`${100*(current.column+current.gap)/current.width}cqw`);
  grid.replaceChildren(...current.blocks.map(block=>{
   const node=document.createElement('div');node.className='design-block';node.dataset.key=block.key;
   node.style.gridColumn=`${block.col+1} / span ${block.w}`;node.style.gridRow=`${block.row+1} / span ${block.rows}`;
   if(L.isInk(block.key)){
    const canvas=document.createElement('canvas');canvas.className='design-ink';canvas.width=touchGrid?block.width:816;canvas.height=touchGrid?block.height:120;canvas.setAttribute('aria-label',name(block.key));window.BlogInk.paint(canvas.getContext('2d'),block.ink,0,0,canvas.width,canvas.height,block.inkSheet);node.append(canvas);
   }else if(L.isText(block.key)){
    const content=document.createElement('div');content.className='design-text';content.lang='en';
    for(const line of block.lines){const span=document.createElement('span');span.textContent=line||'\u00a0';content.append(span);}node.append(content);
   }else{const img=document.createElement('img');img.src=source(s.images.find(x=>L.keyOf(x)===block.key));img.alt='';img.style.objectPosition=`${block.cropX??50}% ${block.cropY??50}%`;img.onload=()=>updateControls();node.append(img);}
   const select=document.createElement('button');select.type='button';select.className='design-select';select.setAttribute('aria-label',`${t('Select')} ${name(block.key)}`);select.setAttribute('aria-pressed',String(selected===block.key));
   select.onclick=()=>{selected=block.key;updateControls();document.querySelector('.design-tools').scrollTop=0;};
   if(touchGrid)select.onpointerdown=event=>{
    if(selected===block.key)beginDrag(event,select,node,block);
   };
   node.append(select);
   return node;
  }));
  if(touchGrid)grid.append(target);
  updateControls();fitPreview();
 }
 function beginDrag(event,control,node,block){
  if(drag||event.button!==0||!event.isPrimary)return;
  event.preventDefault();
  control.focus({preventScroll:true});
  control.setPointerCapture(event.pointerId);
  drag={id:event.pointerId,block,node,control,startX:event.clientX,startY:event.clientY};
 }
 function liftDrag(){
  const {node}=drag,rect=node.getBoundingClientRect();
  const floating=document.createElement('div');
  floating.className='design-block design-drag-preview';
  floating.setAttribute('aria-hidden','true');
  floating.style.width=`${rect.width}px`;
  floating.style.height=`${rect.height}px`;
  const content=node.firstElementChild,copy=content.cloneNode(true);
  if(content.matches('canvas'))copy.getContext('2d').drawImage(content,0,0);
  if(content.matches('.design-text')){
   const style=getComputedStyle(content);
   copy.style.fontSize=style.fontSize;
   copy.style.lineHeight=style.lineHeight;
   copy.style.padding=style.padding;
  }
  floating.append(copy);
  document.body.append(floating);
  node.classList.add('is-picked-up');
  drag.floating=floating;
 }
 function previewDrag(event){
  if(drag?.id!==event.pointerId)return;
  const {block,node,startX,startY}=drag;
  if(!drag.floating){
   if(Math.hypot(event.clientX-startX,event.clientY-startY)<5)return;
   liftDrag();
  }
  const floating=drag.floating;
  floating.style.left=`${event.clientX}px`;
  floating.style.top=`${event.clientY}px`;
  const rect=grid.getBoundingClientRect(),scale=rect.width/current.width;
  const x=(event.clientX-rect.left)/scale,y=(event.clientY-rect.top)/scale;
  const bounds=viewport.getBoundingClientRect();
  const tolerance=Math.min(current.gap*1.5,10/scale);
  const inside=x>=-tolerance&&x<=current.width+tolerance&&y>=-tolerance&&y<=gridHeight()+tolerance&&event.clientX>=bounds.left&&event.clientX<=bounds.right&&event.clientY>=bounds.top&&event.clientY<=bounds.bottom;
  let hovered=null,distance=tolerance;
  if(inside)for(const item of current.blocks){
   if(item===block)continue;
   const edge=Math.hypot(Math.max(0,item.x-x,x-item.x-item.width),Math.max(0,item.y-y,y-item.y-item.height));
   if(edge<=distance){hovered=item;distance=edge;}
  }
  const col=Math.max(0,Math.min(columns-block.w,Math.round((x-block.width/2)/(current.column+current.gap))));
  const row=Math.max(0,Math.min(displayRows()-block.rows,Math.round((y-block.height/2)/(current.rowHeight+current.gap))));
  const overSource=x>=block.x&&x<=block.x+block.width&&y>=block.y&&y<=block.y+block.height;
  const result=inside&&(hovered?L.dropNear(current,block.key,hovered,displayRows()):
   !overSource&&L.drop(current,block.key,col,row));
  const landing=result&&result.find(item=>item.key===block.key);
  drag.result=landing&&(landing.col!==block.col||landing.row!==block.row)?result:null;
  node.classList.toggle('is-invalid-drop',!drag.result);
  floating.classList.toggle('is-invalid-drop',!drag.result);
  target.hidden=!drag.result;
  if(!drag.result)return;
  target.style.left=`${landing.col*(current.column+current.gap)*100/current.width}%`;
  target.style.top=`${landing.row*(current.rowHeight+current.gap)*100/gridHeight()}%`;
  target.style.width=`${block.width*100/current.width}%`;
  target.style.height=`${block.height*100/gridHeight()}%`;
 }
 function endDrag(event){
  if(!drag||(event&&drag.id!==event.pointerId))return;
  const previous=drag;
  drag=null;
  previous.floating?.remove();
  previous.node.classList.remove('is-invalid-drop','is-picked-up');
  target.hidden=true;
  if(previous.control.hasPointerCapture(previous.id))previous.control.releasePointerCapture(previous.id);
  if(event?.type==='pointerup'&&previous.floating)suppressDragClick=true;
  if(event?.type==='pointerup'&&previous.result){
   const s=getState();
   s[layoutKey(s)]=previous.result;
   save();refresh();
   [...grid.querySelectorAll('.design-block')].find(node=>node.dataset.key===selected)?.querySelector('.design-select').focus({preventScroll:true});
   message('Layout updated.');
  }else if(refreshPending)refresh();
 }
 if(touchGrid){
  grid.addEventListener('pointermove',previewDrag);
  viewport.addEventListener('pointerdown',()=>{suppressDragClick=false;},true);
  viewport.addEventListener('click',event=>{
   if(!suppressDragClick||!event.detail)return;
   suppressDragClick=false;
   event.preventDefault();event.stopImmediatePropagation();
  },true);
  window.addEventListener('pointerup',event=>{
   if(drag?.id!==event.pointerId)return;
   // Commit the highlighted destination. Some fast gestures report a final
   // position on pointerup without painting that position as a preview.
   if(!drag.floating)previewDrag(event);
   endDrag(event);
  },true);
  window.addEventListener('pointercancel',endDrag,true);
  window.addEventListener('blur',()=>endDrag());
  grid.addEventListener('lostpointercapture',endDrag);
 }
 function change(edit){
  const s=getState();s[layoutKey(s)]=L.positions(current);const block=s[layoutKey(s)].find(b=>b.key===selected);if(!block)return;
  edit(block);block.col=Math.min(block.col,columns-block.w);s[layoutKey(s)]=L.positions(plan(selected));save();refresh();
  message('Layout updated.');
 }
 document.querySelector('.design-sheet-scroll').addEventListener('click',event=>{
  if(event.target.closest('.design-block'))return;
  selected=null;updateControls();
 });
 $('design-picker').onchange=()=>{selected=$('design-picker').value||null;updateControls();};
 for(const [id,property,delta] of [['wider','w',1],['narrower','w',-1],['taller','h',1],['shorter','h',-1]])$("design-"+id).onclick=()=>change(block=>{block[property]=Math.max(1,Math.min(columns,block[property]+delta));});
 for(const [id,direction] of [['left',-1],['right',1]])$('design-'+id).onclick=()=>{
  const s=getState();s[layoutKey(s)]=L.moveHorizontal(current,selected,direction);
  s[layoutKey(s)]=L.positions(plan());save();refresh();message('Layout updated.');
 };
 for(const [id,direction] of [['up',-1],['down',1]])$('design-'+id).onclick=()=>{
  const s=getState();s[layoutKey(s)]=L.moveVertical(current,selected,direction);
  s[layoutKey(s)]=L.positions(plan());save();refresh();message('Layout updated.');
 };
 for(const [axis,property] of [['x','cropX'],['y','cropY']])$('crop-'+axis).oninput=()=>{
  const s=getState();s[layoutKey(s)]=L.positions(current);const block=s[layoutKey(s)].find(b=>b.key===selected);if(!block)return;
  block[property]=Number($('crop-'+axis).value);current=plan();
  const img=[...$('design-grid').children].find(node=>node.dataset.key===selected)?.querySelector('img');
  if(img){
   const position=`${block.cropX}% ${block.cropY}%`;
   img.style.objectPosition=position;
   elementPreview.firstElementChild.style.objectPosition=position;
  }
  save();
 };
 $('design-info').onclick=()=>$('design-help-dialog').showModal();
 $('design-help-close').onclick=()=>$('design-help-dialog').close();
 $('design-default').onclick=()=>{getState()[layoutKey(getState())]=null;selected=null;save();refresh();message('Default layout restored.');};
 return {refresh,plan:()=>plan()};
};
