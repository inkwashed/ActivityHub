/* Local stroke data in a fixed sentence coordinate system. No recognition service. */
(() => {
 const width=816,height=120,maxStrokes=256,maxPoints=512;
 function normalize(raw,count=4){return Array.from({length:count},(_,i)=>(Array.isArray(raw?.[i])?raw[i]:[]).slice(0,maxStrokes).map(stroke=>(Array.isArray(stroke)?stroke:[]).slice(0,maxPoints).filter(p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)).map(([x,y])=>[Math.round(Math.max(0,Math.min(width,x))*10)/10,Math.round(Math.max(0,Math.min(height,y))*10)/10])).filter(s=>s.length));}
 function strokes(ctx,lines){ctx.strokeStyle='#17251f';ctx.fillStyle='#17251f';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineJoin='round';for(const points of lines){ctx.beginPath();if(points.length===1){ctx.arc(points[0][0],points[0][1],1.5,0,Math.PI*2);ctx.fill();}else{points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}}}
 function paint(ctx,lines,x,y,w,h){const scale=Math.min(w/width,h/height);ctx.save();ctx.translate(x,y+(h-height*scale)/2);ctx.scale(scale,scale);strokes(ctx,lines);ctx.restore();}
 function mount({host,getState,save,config}){
  const t=s=>window.ActivityHubI18n.t(s),pads=[];let active=null,eraser=false,parts=1,saveTimer=null,dirty=false,selected=null;
  function scheduleSave(){dirty=true;clearTimeout(saveTimer);saveTimer=setTimeout(flushSave,2000);}
  function flushSave(){clearTimeout(saveTimer);saveTimer=null;if(dirty&&!active){dirty=false;save();}}
  const notice=document.createElement('p');notice.className='blog-hint';notice.setAttribute('role','status');notice.textContent=t('Tap a sentence to write.');
  const toolButtons=[];
  function iconButton(label,icon){const button=document.createElement('button');button.type='button';button.className='ah-button ah-button-icon';button.dataset.label=label;const image=document.createElement('img');image.src='../../shared/icons/'+icon+'.svg';image.alt='';image.setAttribute('aria-hidden','true');button.append(image);return button;}
  function addTools(container){const pen=iconButton('Pen','pen'),erase=iconButton('Eraser','eraser');pen.onclick=()=>{finish();eraser=false;labels();};erase.onclick=()=>{finish();eraser=true;labels();};toolButtons.push({pen,erase});container.append(pen,erase);}
  host.append(notice);
  function labels(){for(const {pen,erase} of toolButtons){pen.setAttribute('aria-pressed',String(!eraser));erase.setAttribute('aria-pressed',String(eraser));}for(const button of host.querySelectorAll('button[data-label]')){button.setAttribute('aria-label',t(button.dataset.label));button.title=t(button.dataset.label);}for(const pad of pads){pad.title.textContent=`${t('Sentence')} ${pad.index+1}`;pad.undo.disabled=!pad.history.length;pad.canvases.forEach((c,i)=>c.setAttribute('aria-label',`${t('Sentence')} ${pad.index+1}, ${t('Writing line')} ${i+1}`));}}
  function selectPad(pad){finish();selected=pad;window.getSelection()?.removeAllRanges();for(const item of pads){const chosen=item===pad;item.section.classList.toggle('is-active',chosen);item.heading.hidden=!chosen;item.select.hidden=chosen;}labels();pads.forEach(redraw);}
  function guide(ctx,start,segment,index){
   ctx.strokeStyle='#000';ctx.lineWidth=1;for(const y of [16,57]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(segment,y);ctx.stroke();}
   ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(0,30);ctx.lineTo(segment,30);ctx.stroke();ctx.setLineDash([]);
   ctx.strokeStyle=getComputedStyle(host).getPropertyValue('--ah-selected-border').trim()||'#417655';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,47);ctx.lineTo(segment,47);ctx.stroke();
   if(!getState().showHelp)return;
   const words=config.rows[index].flatMap(key=>{const f=config.fields.find(f=>f.id===key);return (f.help||f.placeholder||'').split(' ').map(text=>({text,variable:!f.help}));});
   const theme=getComputedStyle(host),variableColor=theme.getPropertyValue('--ah-selected-border').trim()||'#417655',frameColor=theme.getPropertyValue('--ah-muted').trim()||'#89968b';
   ctx.font='34px "Comic Sans MS", "Chalkboard SE", cursive';ctx.fillStyle='#89968b';ctx.globalAlpha=.65;
   let line=0,x=10;for(const word of words){const w=ctx.measureText(word.text+' ').width;if(x+w>segment-10){line++;x=10;}if(line===start){ctx.fillStyle=word.variable?variableColor:frameColor;ctx.fillText(word.text,x,46);}x+=w;}ctx.globalAlpha=1;
  }
  function redraw(pad){
   const segment=width/parts;
   pad.canvases.forEach((canvas,i)=>{canvas.hidden=i>=parts;if(canvas.hidden)return;const rect=canvas.getBoundingClientRect();if(!rect.width)return;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(64*dpr);
    const ctx=canvas.getContext('2d');ctx.save();ctx.scale(canvas.width/rect.width,canvas.height/64);guide(ctx,i,rect.width,pad.index);ctx.restore();ctx.scale(canvas.width/segment,canvas.height/height);ctx.save();ctx.beginPath();ctx.rect(0,0,segment,height);ctx.clip();ctx.translate(-i*segment,0);strokes(ctx,getState().ink[pad.index]);if(active?.pad===pad&&active.points)strokes(ctx,[active.points]);ctx.restore();
   });pad.undo.disabled=!pad.history.length;
  }
  function remember(pad){pad.history.push(structuredClone(getState().ink[pad.index]));if(pad.history.length>20)pad.history.shift();}
  function point(event,canvas,i){const r=canvas.getBoundingClientRect(),segment=width/parts;return [Math.round((i*segment+Math.max(0,Math.min(1,(event.clientX-r.left)/r.width))*segment)*10)/10,Math.round(Math.max(0,Math.min(1,(event.clientY-r.top)/r.height))*height*10)/10];}
  function near(p,stroke){for(let i=0;i<stroke.length;i++){const a=stroke[i],b=stroke[i+1]||a,dx=b[0]-a[0],dy=b[1]-a[1],u=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));if(Math.hypot(p[0]-a[0]-u*dx,p[1]-a[1]-u*dy)<10)return true;}return false;}
  function finish(cancel=false){if(!active)return;const a=active;active=null;if(cancel){getState().ink[a.pad.index]=a.pad.history.pop()||[];}else if(a.points?.length)getState().ink[a.pad.index].push(a.points);scheduleSave();redraw(a.pad);}
  config.rows.forEach((_,index)=>{
   const section=document.createElement('section');section.className='ink-pad';const heading=document.createElement('div');heading.className='ink-pad-heading';const title=document.createElement('h3'),undo=iconButton('Undo','undo'),toolbar=document.createElement('div');toolbar.className='ink-tools';addTools(toolbar);toolbar.append(undo);heading.append(title,toolbar);section.append(heading);
   const select=document.createElement('button');select.type='button';select.className='ink-select';select.setAttribute('aria-label',`${t('Sentence')} ${index+1}`);select.title=t('Tap a sentence to write.');section.append(select);heading.hidden=true;
   const done=document.createElement('button');done.type='button';done.className='ah-button ink-done';done.textContent=t('Done');heading.append(done);
   const pad={index,title,undo,section,heading,select,canvases:[],history:[]};pads.push(pad);select.onclick=()=>{if(!selected)selectPad(pad);};done.onclick=()=>{selectPad(null);select.focus();};
   undo.onclick=()=>{finish();if(pad.history.length){getState().ink[index]=pad.history.pop();scheduleSave();redraw(pad);}};
   for(let i=0;i<2;i++){
    const canvas=document.createElement('canvas');canvas.className='ink-canvas';canvas.setAttribute('role','img');pad.canvases.push(canvas);section.append(canvas);
    // Safari needs explicit non-passive touch cancellation as well as touch-action.
    for(const type of ['touchstart','touchmove'])canvas.addEventListener(type,event=>{if(selected===pad&&event.cancelable)event.preventDefault();},{passive:false});
    canvas.oncontextmenu=event=>event.preventDefault();
    canvas.onpointerdown=event=>{if(selected!==pad||active||event.button!==0)return;event.preventDefault();clearTimeout(saveTimer);if(!eraser&&getState().ink[index].length>=maxStrokes){notice.textContent=t('This pad is full. Erase or undo a stroke to keep writing.');if(dirty)scheduleSave();return;}notice.textContent=t('Tap a sentence to write.');remember(pad);active={pad,id:event.pointerId,points:eraser?null:[point(event,canvas,i)]};canvas.setPointerCapture(event.pointerId);if(eraser){const p=point(event,canvas,i);getState().ink[index]=getState().ink[index].filter(s=>!near(p,s));}redraw(pad);};
    canvas.onpointermove=event=>{if(!active||active.id!==event.pointerId||active.pad!==pad)return;event.preventDefault();const p=point(event,canvas,i);if(active.points){const last=active.points.at(-1);if(Math.hypot(p[0]-last[0],p[1]-last[1])<.6)return;if(active.points.length>=maxPoints)active.points=active.points.filter((_,j)=>j%2===0);active.points.push(p);}else getState().ink[index]=getState().ink[index].filter(s=>!near(p,s));redraw(pad);};
    canvas.onpointerup=event=>{if(active?.id===event.pointerId)finish();};canvas.onpointercancel=event=>{if(active?.id===event.pointerId)finish(true);};canvas.onlostpointercapture=event=>{if(active?.id===event.pointerId)finish();};
   }host.append(section);
  });
  function refresh(){finish();host.hidden=getState().inputMode!=='write';document.body.classList.toggle('blog-writing',!host.hidden);if(host.hidden&&selected)selectPad(null);parts=host.clientWidth>0&&host.clientWidth<600?2:1;labels();pads.forEach(redraw);}
  new ResizeObserver(()=>{if(active)return;refresh();}).observe(host);
  function leave(){finish();flushSave();}
  window.addEventListener('pagehide',leave);document.addEventListener('visibilitychange',()=>{if(document.hidden)leave();});
  return {refresh,finish};
 }
 window.BlogInk={width,height,normalize,paint,mount};
})();
