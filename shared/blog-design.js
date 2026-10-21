/* Builder-style quick tools. Every writing/photo source stays in the layout. */
window.BlogDesign=({getState,save,source})=>{
 const $=id=>document.getElementById(id),L=window.BlogLayout,t=s=>window.ActivityHubI18n.t(s);
 const measureContext=document.createElement('canvas').getContext('2d');measureContext.font='26px Arial';
 const measure=text=>measureContext.measureText(text).width;
 let selected=null,current;
 const message=text=>{const node=$('design-message');node.dataset.i18n=text;node.textContent=t(text);};
 const layoutKey=s=>s.inputMode==='write'?'inkLayout':'layout';
 const name=key=>L.isInk(key)?`${t('Handwriting')} ${Number(key.slice(4))+1}`:L.isText(key)?`${t('Text')} ${L.textIndex(key)+1}`:`${t('Image')} ${getState().images.findIndex(x=>L.keyOf(x)===key)+1}`;
 const option=(value,text)=>{const node=document.createElement('option');node.value=value;node.textContent=text;return node;};
 function plan(priority){const s=getState();return L.plan(s[layoutKey(s)],s.images,s.fields.body,measure,priority,s.inputMode==='write'?s.ink:null);}
 function updateControls(){
  const block=current.blocks.find(b=>b.key===selected);
  $('design-picker').value=selected||'';
  const photo=block&&!L.isText(block.key)&&!L.isInk(block.key)?[...$('design-grid').children].find(node=>node.dataset.key===selected)?.querySelector('img'):null;
  const ratio=photo?.naturalWidth?Math.max(block.width/photo.naturalWidth,block.height/photo.naturalHeight):0;
  const cropX=ratio&&photo.naturalWidth*ratio>block.width+.5,cropY=ratio&&photo.naturalHeight*ratio>block.height+.5;
  $('design-crop').hidden=!(cropX||cropY);
  for(const [axis,available] of [['x',cropX],['y',cropY]]){
   $('crop-'+axis+'-row').hidden=!available;
   $('crop-'+axis).value=block?.[axis==='x'?'cropX':'cropY']??50;
  }
  $('design-size').textContent=block?`${block.w} ${t(block.w===1?'column':'columns')} · ${L.isInk(block.key)?t('Sentence strip'):L.isText(block.key)?t('Automatic text height'):t(['','Short','Medium','Tall'][block.h])}`:'';
  $('design-wider').disabled=!block||block.w===3;
  $('design-narrower').disabled=!block||block.w===1;
  $('design-taller').disabled=!block||L.isText(block.key)||L.isInk(block.key)||block.h===3;
  $('design-shorter').disabled=!block||L.isText(block.key)||L.isInk(block.key)||block.h===1;
  $('design-up').disabled=!block||block.row===0;$('design-left').disabled=!block||block.col===0;
  $('design-right').disabled=!block||block.col+block.w===3;
  $('design-down').disabled=!block||block.row>=24;
  for(const node of $('design-grid').children){const active=node.dataset.key===selected;node.classList.toggle('is-selected',active);node.querySelector('.design-select').setAttribute('aria-pressed',String(active));}
 }
 function fitPreview(){
  if(!current)return;
  const viewport=document.querySelector('.design-sheet-scroll'),sheet=document.querySelector('.design-sheet');
  const style=getComputedStyle(viewport);
  const width=viewport.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight);
  const height=viewport.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom)-8;
  if(width<=0||height<=0)return;
  // Shrink the artwork, not the controls. Very tall designs retain internal scrolling.
  const floor=Math.min(width,300),fit=height*816/(current.rows*132-12);
  sheet.style.width=`${Math.min(width,Math.max(floor,Math.min(width*.85,612,fit)))}px`;
 }
 new ResizeObserver(fitPreview).observe(document.querySelector('.design-sheet-scroll'));
 function refresh(){
  const s=getState();current=plan();
  if(!current.blocks.some(b=>b.key===selected))selected=null;
  $('design-picker').replaceChildren(option('',t('Select an element')),...current.blocks.map(block=>option(block.key,name(block.key))));
  const grid=$('design-grid');grid.style.gridTemplateRows=`repeat(${current.rows},minmax(0,1fr))`;grid.style.aspectRatio=`816 / ${current.rows*132-12}`;
  grid.replaceChildren(...current.blocks.map(block=>{
   const node=document.createElement('div');node.className='design-block';node.dataset.key=block.key;
   node.style.gridColumn=`${block.col+1} / span ${block.w}`;node.style.gridRow=`${block.row+1} / span ${block.rows}`;
   if(L.isInk(block.key)){
    const canvas=document.createElement('canvas');canvas.className='design-ink';canvas.width=816;canvas.height=120;canvas.setAttribute('aria-label',name(block.key));window.BlogInk.paint(canvas.getContext('2d'),block.ink,0,0,816,120);node.append(canvas);
   }else if(L.isText(block.key)){
    const content=document.createElement('div');content.className='design-text';content.lang='en';
    for(const line of block.lines){const span=document.createElement('span');span.textContent=line||'\u00a0';content.append(span);}node.append(content);
   }else{const img=document.createElement('img');img.src=source(s.images.find(x=>L.keyOf(x)===block.key));img.alt='';img.style.objectPosition=`${block.cropX??50}% ${block.cropY??50}%`;img.onload=()=>updateControls();node.append(img);}
   const select=document.createElement('button');select.type='button';select.className='design-select';select.setAttribute('aria-label',`${t('Select')} ${name(block.key)}`);select.setAttribute('aria-pressed',String(selected===block.key));
   select.onclick=()=>{selected=block.key;updateControls();document.querySelector('.design-tools').scrollTop=0;};
   node.append(select);return node;
  }));
  updateControls();fitPreview();
 }
 function change(edit){
  const s=getState();s[layoutKey(s)]=L.positions(current);const block=s[layoutKey(s)].find(b=>b.key===selected);if(!block)return;
  edit(block);block.col=Math.min(block.col,3-block.w);s[layoutKey(s)]=L.positions(plan(selected));save();refresh();
  message('Layout updated.');
 }
 document.querySelector('.design-sheet-scroll').addEventListener('click',event=>{
  if(event.target.closest('.design-block'))return;
  selected=null;updateControls();
 });
 $('design-picker').onchange=()=>{selected=$('design-picker').value||null;updateControls();};
 for(const [id,property,delta] of [['wider','w',1],['narrower','w',-1],['taller','h',1],['shorter','h',-1]])$("design-"+id).onclick=()=>change(block=>{block[property]=Math.max(1,Math.min(3,block[property]+delta));});
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
  if(img)img.style.objectPosition=`${block.cropX}% ${block.cropY}%`;
  save();
 };
 $('design-info').onclick=()=>$('design-help-dialog').showModal();
 $('design-help-close').onclick=()=>$('design-help-dialog').close();
 $('design-default').onclick=()=>{getState()[layoutKey(getState())]=null;selected=null;save();refresh();message('Default layout restored.');};
 return {refresh,plan:()=>plan()};
};
