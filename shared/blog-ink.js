/* Local stroke data in a fixed sentence coordinate system. No recognition service. */
(() => {
 const width=816,height=120,maxStrokes=256,maxPoints=512;
 function normalize(raw,count=4){return Array.from({length:count},(_,i)=>(Array.isArray(raw?.[i])?raw[i]:[]).slice(0,maxStrokes).map(stroke=>(Array.isArray(stroke)?stroke:[]).slice(0,maxPoints).filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)).map(([x,y])=>[Math.round(Math.max(0,Math.min(width,x))*10)/10,Math.round(Math.max(0,Math.min(height,y))*10)/10])).filter(s=>s.length));}
 function normalizeSheets(raw,ink){
  return ink.map((strokes,i)=>{
   const sheet=raw?.[i];
   if(!strokes.length||!sheet||!Number.isFinite(sheet.width)||sheet.width<1||sheet.width>16384||
      !Number.isFinite(sheet.fontSize)||sheet.fontSize<=0||sheet.fontSize>128||
      !Number.isSafeInteger(sheet.split)||sheet.split<0||![1,2].includes(sheet.parts))return null;
   return {width:sheet.width,fontSize:sheet.fontSize,split:sheet.split,parts:sheet.parts};
  });
 }
 function strokes(ctx,lines){ctx.strokeStyle='#17251f';ctx.fillStyle='#17251f';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';for(const points of lines){ctx.beginPath();if(points.length===1){ctx.arc(points[0][0],points[0][1],1.5,0,Math.PI*2);ctx.fill();}else{points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}}}
 // Wrapped input uses two fixed halves of the sentence strip. Only close a
 // gap at that seam when the second run starts near its left writing margin.
 function compact(lines,parts){
  const seam=width/2,wordSpace=12;
  let rightEdge=0,firstEnd=0,secondStart=width,crosses=false;
  for(const stroke of lines){
   let start=width,end=0;
   for(const [x] of stroke){start=Math.min(start,x);end=Math.max(end,x);}
   rightEdge=Math.max(rightEdge,end);
   if(start<seam&&end>=seam)crosses=true;
   if(end<seam||parts===2&&start<seam)firstEnd=Math.max(firstEnd,end);
   if(start>=seam)secondStart=Math.min(secondStart,start);
  }
  const gap=secondStart-firstEnd;
  const confirmedWrap=parts===2&&firstEnd>0&&secondStart<width;
  const inferredWrap=parts===undefined&&!crosses&&firstEnd>0&&secondStart<=seam+40&&gap>=24;
  const trim=confirmedWrap||inferredWrap?gap-wordSpace:parts===2&&firstEnd===0&&secondStart<width?seam:0;
  const packed=trim?lines.map(stroke=>stroke[0][0]>=seam?stroke.map(([x,y])=>[x-trim,y]):stroke):lines;
  return {lines:packed,right:rightEdge-trim};
 }
 function fitOneLine(lines,sheet,availableWidth,wordCount){
  if(sheet?.parts!==2||!lines.length||availableWidth<1||availableWidth>16384)return null;
  const packed=compact(lines,2);
  // A wrapped row uses half the coordinate strip at the saved canvas width.
  // Rebase X into the full strip while keeping the same physical ink size.
  const ratio=2*sheet.width/availableWidth;
  if((packed.right+4)*ratio>width)return null;
  return {
   ink:packed.lines.map(stroke=>stroke.map(([x,y])=>[Math.round(x*ratio*10)/10,y])),
   sheet:{...sheet,width:availableWidth,parts:1,split:wordCount}
  };
 }
 function paint(ctx,lines,x,y,w,h,sheet){
  if(!lines.length)return;
  const packed=compact(lines,sheet?.parts);
  const aspect=sheet?sheet.width*sheet.parts/width*height/128:1;
  const scale=Math.min(w/((packed.right+4)*aspect),h/height);
  ctx.save();ctx.translate(x,y+(h-height*scale)/2);ctx.scale(scale*aspect,scale);strokes(ctx,packed.lines);ctx.restore();
 }
 function mount({host,getState,save,config,openSentence}){
  const t=s=>window.ActivityHubI18n.t(s),pads=[];let active=null,eraser=false,saveTimer=null,dirty=false,selected=null;
  const fontSize=getComputedStyle(host).getPropertyValue('--blog-writing-font-size').trim()||'36px';
  const previewInset=parseFloat(getComputedStyle(host).getPropertyValue('--blog-writing-inset'))||2;
  const expandedInset=10,expandedBaseline=45.5;
  function scheduleSave(){dirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(flushSave,2000);}
  function flushSave(){clearTimeout(saveTimer);saveTimer=null;if(dirty&&!active){dirty=false;save();}}
  const notice=document.createElement('p');notice.className='blog-hint';notice.setAttribute('role','status');
  const toolButtons=[];
  function iconButton(label,icon){const button=document.createElement('button');button.type='button';button.className='ah-button ah-button-icon';button.dataset.label=label;const image=document.createElement('img');image.src='../../shared/icons/'+icon+'.svg';image.alt='';image.setAttribute('aria-hidden','true');button.append(image);return button;}
  function addTools(container){const pen=iconButton('Pen','pen'),erase=iconButton('Eraser','eraser');pen.onclick=()=>{finish();eraser=false;labels();};erase.onclick=()=>{finish();eraser=true;labels();};toolButtons.push({pen,erase});container.append(pen,erase);}
  let draft=getState();
  function historyButtons(pad){pad.undo.disabled=!pad.history.length;pad.redo.disabled=!pad.future.length;}
  function labels(){for(const {pen,erase} of toolButtons){pen.setAttribute('aria-pressed',String(!eraser));erase.setAttribute('aria-pressed',String(eraser));}for(const button of pads.flatMap(pad=>[...pad.heading.querySelectorAll('button[data-label]')])){button.setAttribute('aria-label',t(button.dataset.label));button.title=t(button.dataset.label);}for(const pad of pads){pad.title.textContent=`${t('Sentence')} ${pad.index+1}`;historyButtons(pad);pad.canvases.forEach((c,i)=>c.setAttribute('aria-label',`${t('Sentence')} ${pad.index+1}, ${t('Writing line')} ${i+1}`));}}
  function selectPad(pad){finish();selected=pad;window.getSelection()?.removeAllRanges();for(const item of pads){const chosen=item===pad;item.section.classList.toggle('is-active',chosen);item.heading.hidden=!chosen;item.select.hidden=chosen;}labels();pads.forEach(redraw);}
  function layoutGuide(pad,available){
   const ctx=pad.canvases[0].getContext('2d');
   ctx.font=`${fontSize} Urbanist, Arial, sans-serif`;
   const words=pad.words,spacing=ctx.measureText(' ').width;
   const widths=words.map(word=>ctx.measureText(word.text).width);
   const total=widths.reduce((sum,value)=>sum+value,0)+spacing*(words.length-1);
   let split=words.length,maxWidth=total;
   if(total>available&&words.length>1){
    maxWidth=Infinity;
    let first=0;
    for(let i=1;i<words.length;i++){
     first+=widths[i-1]+(i===1?0:spacing);
     const second=total-first-spacing,longer=Math.max(first,second);
     if(longer<maxWidth){split=i;maxWidth=longer;}
     if(first<=available&&second<=available){split=i;maxWidth=longer;}
    }
   }
   return {lines:[words.slice(0,split),words.slice(split)],font:`${parseFloat(fontSize)*Math.min(1,available/maxWidth)}px Urbanist, Arial, sans-serif`};
  }
  function guide(ctx,segment){
   ctx.strokeStyle='#000';ctx.lineWidth=1;for(const y of [16,57]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(segment,y);ctx.stroke();}
   ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(0,30);ctx.lineTo(segment,30);ctx.stroke();ctx.setLineDash([]);
   ctx.strokeStyle=getComputedStyle(host).getPropertyValue('--ah-selected-border').trim()||'#417655';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,47);ctx.lineTo(segment,47);ctx.stroke();
  }
  function sample(ctx,words,font,baseline,inset,available){
   const theme=getComputedStyle(host),variableColor=theme.getPropertyValue('--ah-selected-border').trim()||'#417655',frameColor=theme.getPropertyValue('--ah-muted').trim()||'#89968b';
   ctx.font=font;ctx.globalAlpha=.65;
   const runWidth=words.reduce((total,word)=>total+ctx.measureText(word.text+' ').width,0)-ctx.measureText(' ').width;
   if(runWidth>available)ctx.font=`${parseFloat(font)*available/runWidth}px Urbanist, Arial, sans-serif`;
   let x=inset;for(const word of words){ctx.fillStyle=word.variable?variableColor:frameColor;ctx.fillText(word.text,x,baseline);x+=ctx.measureText(word.text+' ').width;}ctx.globalAlpha=1;
  }
  function redraw(pad){
   const visibleWidth=pad.section.clientWidth;
   if(!visibleWidth)return;
   const editing=selected===pad,zoom=editing?2:1;
   const state=getState(),savedInk=state.ink[pad.index];
   const savedSheet=state.inkSheets[pad.index]||(active?.pad===pad?active.sheet:null);
   const folded=editing?null:fitOneLine(savedInk,savedSheet,visibleWidth*2,pad.words.length);
   const sheet=folded?.sheet||savedSheet;
   const inset=editing||sheet?expandedInset:previewInset;
   const guideWidth=sheet?sheet.width/2:visibleWidth/zoom;
   const available=Math.max(1,guideWidth-2*inset);
   if(pad.guideWidth!==available){
    pad.guideWidth=available;
    pad.guide=layoutGuide(pad,available);
   }
   const layout=sheet?{
    lines:[pad.words.slice(0,sheet.split),pad.words.slice(sheet.split)],
    font:`${sheet.fontSize}px Urbanist, Arial, sans-serif`
   }:pad.guide;
   if(active?.pad!==pad)pad.parts=sheet?.parts||((editing&&visibleWidth<600)||layout.lines[1].length?2:1);
   const segment=width/pad.parts;
   const displayInk=folded?.ink||(!sheet&&!editing&&pad.parts===1?compact(savedInk).lines:savedInk);
   const displayWidth=sheet?Math.min(visibleWidth,guideWidth*zoom):visibleWidth;
   const displayHeight=64*displayWidth/guideWidth;
   if(editing&&!sheet)pad.pendingSheet={width:visibleWidth,parts:pad.parts,split:layout.lines[0].length,fontSize:parseFloat(layout.font)};
   pad.canvases.forEach((canvas,i)=>{
    canvas.hidden=i>=pad.parts;
    canvas.style.width=sheet?`${displayWidth}px`:'';
    canvas.style.height=sheet?`${displayHeight}px`:'';
    if(canvas.hidden)return;
    const rect=canvas.getBoundingClientRect();
    if(!rect.width)return;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    const ctx=canvas.getContext('2d');
    ctx.save();ctx.scale(canvas.width/guideWidth,canvas.height/64);
    guide(ctx,guideWidth);
    if(state.showHelp)sample(ctx,layout.lines[i],layout.font,editing||sheet?expandedBaseline:47,inset,available);
    ctx.restore();
    ctx.scale(canvas.width/segment,canvas.height/height);
    ctx.save();ctx.beginPath();ctx.rect(0,0,segment,height);ctx.clip();ctx.translate(-i*segment,0);
    strokes(ctx,displayInk);
    if(active?.pad===pad&&active.points)strokes(ctx,[active.points]);
    ctx.restore();
   });
   historyButtons(pad);
  }
  function step(pad,from,to){
   finish();
   if(!from.length)return;
   const state=getState(),index=pad.index;
   to.push({ink:state.ink[index],sheet:state.inkSheets[index]});
   const previous=from.pop();
   state.ink[index]=previous.ink;
   state.inkSheets[index]=previous.sheet;
   scheduleSave();
   redraw(pad);
  }
  function point(event,canvas,i,pad){const r=canvas.getBoundingClientRect(),segment=width/pad.parts;return [Math.round((i*segment+Math.max(0,Math.min(i===0&&pad.parts===2?1-.1/segment:1,(event.clientX-r.left)/r.width))*segment)*10)/10,Math.round(Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))*height*10)/10];}
  function near(p,stroke){for(let i=0;i<stroke.length;i++){const a=stroke[i],b=stroke[i+1]||a,dx=b[0]-a[0],dy=b[1]-a[1],u=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));if(Math.hypot(p[0]-a[0]-u*dx,p[1]-a[1]-u*dy)<10)return true;}return false;}
  function finish(cancel=false){
   if(!active)return;
   const {pad,before,points,sheet}=active;
   active=null;
   const state=getState(),ink=state.ink;
   if(cancel)ink[pad.index]=before;
   else{
    if(points?.length)ink[pad.index].push(points);
    if(ink[pad.index].length!==before.length){
     pad.history.push({ink:before,sheet:state.inkSheets[pad.index]});
     state.inkSheets[pad.index]=ink[pad.index].length?sheet:null;
     if(pad.history.length>20)pad.history.shift();
     pad.future.length=0;
     scheduleSave();
    }
   }
   if(dirty&&!saveTimer)scheduleSave();
   redraw(pad);
  }
  config.rows.forEach((row,index)=>{
   const section=document.createElement('section');section.className='ink-pad';const heading=document.createElement('div');heading.className='ink-pad-heading';const title=document.createElement('h3'),undo=iconButton('Undo','undo'),redo=iconButton('Redo','redo'),toolbar=document.createElement('div');toolbar.className='ink-tools';addTools(toolbar);toolbar.append(undo,redo);heading.append(title,toolbar);section.append(heading);
   const select=document.createElement('button');select.type='button';select.className='ink-select';select.setAttribute('aria-label',`${t('Sentence')} ${index+1}`);section.append(select);heading.hidden=true;
   const words=row.flatMap(key=>{const field=config.fields.find(f=>f.id===key);return (field.help||field.placeholder||'').split(/\s+/).filter(Boolean).map(text=>({text,variable:!field.help}));});
   if(words.length)words[words.length-1].text+='.';
   const pad={index,title,undo,redo,section,heading,select,canvases:[],history:[],future:[],parts:1,words};pads.push(pad);
   select.onclick=()=>{
    if(selected)return;
    section.append(notice);
    notice.textContent='';
    openSentence(index,section,select,{tools:heading,onClose:()=>{
     notice.remove();
     selectPad(null);
     flushSave();
    }});
    selectPad(pad);
   };
   undo.onclick=()=>step(pad,pad.history,pad.future);
   redo.onclick=()=>step(pad,pad.future,pad.history);
   for(let i=0;i<2;i++){
    const canvas=document.createElement('canvas');canvas.className='ink-canvas';canvas.setAttribute('role','img');pad.canvases.push(canvas);section.append(canvas);
    // Safari needs explicit non-passive touch cancellation as well as touch-action.
    for(const type of ['touchstart','touchmove'])canvas.addEventListener(type,event=>{if(selected===pad&&event.cancelable)event.preventDefault();},{passive:false});
    canvas.oncontextmenu=event=>event.preventDefault();
    canvas.onpointerdown=event=>{if(selected!==pad||active||event.button!==0)return;event.preventDefault();clearTimeout(saveTimer);saveTimer=null;if(!eraser&&getState().ink[index].length>=maxStrokes){notice.textContent=t('This pad is full. Erase or undo a stroke to keep writing.');if(dirty)scheduleSave();return;}notice.textContent='';active={pad,id:event.pointerId,before:structuredClone(getState().ink[index]),sheet:getState().inkSheets[index]||pad.pendingSheet,points:eraser?null:[point(event,canvas,i,pad)]};canvas.setPointerCapture(event.pointerId);if(eraser){const p=point(event,canvas,i,pad);getState().ink[index]=getState().ink[index].filter(s=>!near(p,s));}redraw(pad);};
    canvas.onpointermove=event=>{if(!active||active.id!==event.pointerId||active.pad!==pad)return;event.preventDefault();const p=point(event,canvas,i,pad);if(active.points){const last=active.points.at(-1);if(Math.hypot(p[0]-last[0],p[1]-last[1])<.6)return;if(active.points.length>=maxPoints)active.points=active.points.filter((_,j)=>j%2===0);active.points.push(p);}else getState().ink[index]=getState().ink[index].filter(s=>!near(p,s));redraw(pad);};
    canvas.onpointerup=event=>{if(active?.id===event.pointerId)finish();};canvas.onpointercancel=event=>{if(active?.id===event.pointerId)finish(true);};canvas.onlostpointercapture=event=>{if(active?.id===event.pointerId)finish();};
   }host.append(section);
  });
  function refresh(){finish();if(draft!==getState()){draft=getState();for(const pad of pads){pad.history.length=0;pad.future.length=0;}}host.hidden=getState().inputMode!=='write';document.body.classList.toggle('blog-writing',!host.hidden);if(host.hidden&&selected)selectPad(null);labels();pads.forEach(redraw);}
  const resize=new ResizeObserver(entries=>{
   if(active)return;
   for(const {target} of entries){const pad=pads.find(item=>item.section===target);if(pad)redraw(pad);}
  });
  pads.forEach(pad=>resize.observe(pad.section));
  function leave(){finish();flushSave();}
  window.addEventListener('pagehide',leave);document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();});
  document.fonts?.load(`${fontSize} Urbanist`).then(()=>{pads.forEach(pad=>{pad.guideWidth=undefined;});if(!active)refresh();});
  return {refresh,finish};
 }
 window.BlogInk={width,height,normalize,normalizeSheets,compact,fitOneLine,paint,mount};
})();
