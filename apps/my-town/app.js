/* Map editing deliberately stays independent of the free-position food editor. */
(() => {
 const M=window.TownModel,A=window.TownArt,$=s=>document.querySelector(s),t=s=>window.ActivityHubI18n?.t(s)||s;
 let state=M.initial(),routeMode=false,selected=null,dragging=false,save;
 const voice={root:document,config:{toppings:M.places.map(label=>({label})),sauces:[]}};
 const blockName=i=>`${String.fromCharCode(65+i%4)}${1+Math.floor(i/4)}`;
 function sentence(){const text=routeMode?(M.directions(state)||'Go straight for … blocks.'):M.inventory(state.blocks);window.FoodBuilder.prototype.setSentence.call(voice,text);}
 function render(){
  $('#map-art').innerHTML=A.map(state,routeMode);
  const height=M.mapHeight(state.blocks);$('#town-map').style.aspectRatio=`720 / ${height}`;$('#town-map').style.setProperty('--town-ratio',720/height);
  [...$('#blocks').children].forEach((b,i)=>{const r=M.blockRect(i,state.blocks);b.style.cssText=`left:${r.x/7.2}%;top:${r.y/height*100}%;width:${r.width/7.2}%;height:${r.height/height*100}%`;});
  [...$('#nodes').children].forEach((b,n)=>{const [x,y]=M.point(n,state.blocks);b.hidden=!M.activeNode(n,state.blocks);b.classList.toggle('car-node',n===state.route.at(-1));b.style.left=`${x/7.2}%`;b.style.top=`${y/height*100}%`;});
  $('#question').textContent=routeMode?`Where is the ${state.destination===null?'…':state.blocks[state.destination]}?`:'What do you have in your town?';
  [...$('#blocks').children].forEach((b,i)=>{b.disabled=routeMode&&!state.blocks[i];b.setAttribute('aria-pressed',String(i===(routeMode?state.destination:selected)));b.setAttribute('aria-label',`${blockName(i)}: ${state.blocks[i]||t('Empty block')}`);b.style.touchAction=!routeMode&&state.blocks[i]?'none':'auto'});
  $('#nodes').hidden=!routeMode;$('#build-tools').hidden=routeMode;$('#route-tools').hidden=!routeMode;
  [...$('#place-options').children].forEach((b,i)=>{b.disabled=selected===null;b.setAttribute('aria-pressed',String(selected!==null&&state.blocks[selected]===M.places[i]));});
  $('#remove').disabled=selected===null||!state.blocks[selected];
  $('#destination').innerHTML='<option value="">…</option>'+state.blocks.map((name,i)=>name?`<option value="${i}">${name} · ${blockName(i)}</option>`:'').join('');$('#destination').value=state.destination??'';
  $('#undo').disabled=state.route.length<2;
  $('#route-status').textContent=t(state.destination===null?'Add places in BUILD, then choose a destination.':M.side(state.route,state.destination,state.facing,state.blocks)?'Destination reached!':'Follow the dots to a street beside your destination.');
  sentence();save?.flush();
 }
 function resetRoute(){state.route=[17];state.facing=0;}
 M.places.forEach(name=>{const b=document.createElement('button');b.type='button';b.className='ah-choice';b.innerHTML=A.icon(name)+`<span>${name}</span>`;b.onclick=()=>{if(selected===null)return;state.blocks[selected]=name;state.destination=null;resetRoute();render()};$('#place-options').append(b)});
 for(let i=0;i<12;i++){const b=document.createElement('button'),r=M.blockRect(i);b.type='button';b.dataset.block=i;b.style.cssText=`left:${r.x/7.2}%;top:${r.y/7.2}%;width:${98/7.2}%;height:${98/7.2}%`;b.onclick=()=>{if(routeMode){state.destination=i;resetRoute();}else selected=i;render()};$('#blocks').append(b)}
 // BUILD drag keeps the town unchanged until the drop, including station geometry.
 let pickup=null,suppressClick=false;
 function movePlace(from,to){const next=M.movePlace(state.blocks,from,to);if(next===state.blocks)return;state.blocks=next;selected=to;state.destination=null;resetRoute();render();}
 function finishPickup(commit){
  if(!pickup)return;
  const p=pickup;pickup=null;p.ghost?.remove();
  [...$('#blocks').children].forEach(b=>b.classList.remove('drop-target','picked-up'));
  if(p.active){suppressClick=true;if(commit&&p.target!==null)movePlace(p.from,p.target);}
 }
 $('#blocks').addEventListener('dragstart',e=>e.preventDefault());
 $('#blocks').addEventListener('pointerdown',e=>{
  suppressClick=false;
  const b=e.target.closest('[data-block]');if(routeMode||!b||!state.blocks[+b.dataset.block]||!e.isPrimary||e.button!==0)return;
  e.preventDefault();b.focus({preventScroll:true});
  pickup={from:+b.dataset.block,id:e.pointerId,x:e.clientX,y:e.clientY,target:null,active:false};b.setPointerCapture(e.pointerId);
 });
 function updatePickup(e){
  const p=pickup;if(!p||p.id!==e.pointerId)return;
  if(!p.active&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<6)return;
  e.preventDefault();
  if(!p.active){p.active=true;p.ghost=document.createElement('div');p.ghost.className='town-drag-ghost';p.ghost.innerHTML=A.icon(state.blocks[p.from]);document.body.append(p.ghost);$('#blocks').children[p.from].classList.add('picked-up');}
  const box=$('#town-map').getBoundingClientRect(),scale=box.width/720;
  p.ghost.style.cssText=`left:${e.clientX}px;top:${e.clientY}px;width:${98*scale}px;height:${98*scale}px`;
  const x=(e.clientX-box.left)/scale,y=(e.clientY-box.top)/scale;
  p.target=null;let best=Infinity;
  if(x>=0&&x<=720&&y>=0&&y<=M.mapHeight(state.blocks))for(let i=0;i<12;i++){const r=M.blockRect(i,state.blocks),d=Math.hypot(x-r.x-r.width/2,y-r.y-r.height/2);if(d<best){best=d;p.target=i;}}
  [...$('#blocks').children].forEach((b,i)=>b.classList.toggle('drop-target',i===p.target));
 }
 window.addEventListener('pointermove',updatePickup);
 // Resolve even a fast down/up gesture before committing. Capture phase runs before
 // implicit pointer-capture release; losing capture alone is not a cancelled drop.
 window.addEventListener('pointerup',e=>{if(pickup?.id!==e.pointerId)return;updatePickup(e);finishPickup(true);},true);
 window.addEventListener('pointercancel',e=>{if(pickup?.id===e.pointerId)finishPickup(false);},true);
 window.addEventListener('blur',()=>finishPickup(false));
 $('#blocks').addEventListener('keydown',e=>{
  if(e.key==='Escape'){finishPickup(false);return;}
  const b=e.target.closest('[data-block]');if(routeMode||!b||!e.altKey)return;
  const from=+b.dataset.block,delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-4,ArrowDown:4}[e.key];
  if(!delta)return;e.preventDefault();const to=from+delta;
  if(to<0||to>=12||Math.abs(delta)===1&&Math.floor(from/4)!==Math.floor(to/4))return;
  movePlace(from,to);$('#blocks').children[to].focus();
 });
 $('#town-map').addEventListener('click',e=>{if(suppressClick&&e.detail!==0){suppressClick=false;e.preventDefault();e.stopImmediatePropagation();}},true);
 function visit(n){if(state.destination===null||!M.activeNode(n,state.blocks))return;const next=M.extend(state.route,n,state.facing,state.blocks);if(next!==state.route){state.route=next;if(M.side(next,state.destination,state.facing,state.blocks))dragging=false;render();}}
 for(let n=0;n<M.nodeCount;n++){const b=document.createElement('button'),[x,y]=A.point(n);b.type='button';b.style.cssText=`left:${x/7.2}%;top:${y/7.2}%`;b.setAttribute('aria-label',n>=25?`North side of tracks, row ${Math.floor((n-25)/5)+1}, crossing ${(n-25)%5+1}`:`Street ${M.xy(n)[0]+1}, ${M.xy(n)[1]+1}`);b.dataset.node=n;b.onclick=e=>{if(e.detail===0)visit(n)};$('#nodes').append(b)}
 const map=$('#town-map');map.addEventListener('pointerdown',e=>{const node=e.target.closest('[data-node]');if(!routeMode||!node)return;e.preventDefault();dragging=true;map.setPointerCapture(e.pointerId);visit(Number(node.dataset.node));});
 map.addEventListener('pointermove',e=>{if(!dragging)return;const r=map.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*720,y=(e.clientY-r.top)/r.height*M.mapHeight(state.blocks);let closest=-1,d=25;for(let n=0;n<M.nodeCount;n++){if(!M.activeNode(n,state.blocks))continue;const p=M.point(n,state.blocks),distance=Math.hypot(x-p[0],y-p[1]);if(distance<d){closest=n;d=distance}}if(closest>=0)visit(closest)});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])map.addEventListener(event,()=>dragging=false);
 map.addEventListener('click',e=>{if(!routeMode&&!e.target.closest('button')){selected=null;render()}});
 $('#route-mode').onchange=e=>{routeMode=e.target.checked;dragging=false;voice.pronunciation?.stop();render()};
 $('#destination').onchange=e=>{state.destination=e.target.value===''?null:Number(e.target.value);resetRoute();render()};
 $('#undo').onclick=()=>{if(state.route.length>1)state.route.pop();render()};
 $('#remove').onclick=()=>{if(selected!==null){state.blocks[selected]=null;state.destination=null;resetRoute();render()}};
 $('#clear').onclick=()=>{if(routeMode)resetRoute();else{state=M.initial();selected=null;}render()};
 render();save=window.ActivityAutosave.connect('my-town',{capture:()=>state,restore:raw=>{state=M.restore(raw);render()}});
 window.BuilderPhoto({builder:()=>state,imageSelector:'#town-photo',render:()=>A.map(state,routeMode),caption:'My town!'});
 document.addEventListener('activityhub:languagechange',render);
})();
