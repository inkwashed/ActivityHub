/* Optional native-scroll cue, independent of artwork, output and editor adapters. */
window.BuilderScrollCue=(column,content)=>{
 const update=()=>{
  const scrollable=/^(auto|scroll)$/.test(getComputedStyle(column).overflowY);
  column.classList.toggle('has-more',scrollable&&column.clientHeight>0&&column.scrollHeight-column.clientHeight-column.scrollTop>2);
 };
 column.addEventListener('scroll',update,{passive:true});
 const sizes=new ResizeObserver(update);sizes.observe(column);if(content)sizes.observe(content);
 new MutationObserver(update).observe(column,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden']});
 window.addEventListener('resize',update);update();
 return update;
};

/* Opt-in workspace: one scrolling choices/sentence column, full-frame editing. */
window.BuilderPanelWorkspace=(builder,{preferredFrameClass}={})=>{
 const root=builder.root,column=root.querySelector('[data-jump-section="choices"]');
 const output=root.querySelector('.builder-output'),frame=root.querySelector('.builder-play-area');
 if(!output||!frame)return;
 root.classList.add('panel-workspace');column.classList.add('builder-menu-scroll');
 // Retain the accessible heading/label relationship without spending panel space.
 column.querySelector(':scope > .heading')?.classList.add('sr-only');
 column.append(output);output.stopFitting?.();output.setAttribute('role','region');output.setAttribute('aria-label','English sentence');
 let budget;if(preferredFrameClass){budget=document.createElement('div');budget.className=preferredFrameClass;budget.setAttribute('data-builder-preferred-frame','');budget.setAttribute('aria-hidden','true');frame.append(budget);}
 const surface=frame.querySelector('.builder-art-area');
 const editor=builder.creative;
 surface.querySelector('.builder-composition').firstElementChild.dataset.builderPlacement='full';
 editor.options.placementBounds=()=>frame;

 // Full-frame placement is independent of the base's toolbar-safe fitting.
 // Shared workspace observes frame and surface; do not add a second resize pass.
 editor.picker.addEventListener('change',()=>{
  const item=editor.items.find(x=>x.id===editor.selected);if(!item)return;
  const hit=item.node.querySelector('.piece-hit').getBoundingClientRect(),tools=editor.tools.getBoundingClientRect();
  if(hit.right<=tools.left||hit.left>=tools.right||hit.bottom<=tools.top||hit.top>=tools.bottom)return;
  const safe=surface.getBoundingClientRect(),scene=editor.pizza.getBoundingClientRect();
  if(![scene.width,scene.height,safe.width,safe.height].every(n=>Number.isFinite(n)&&n>0))return;
  const dx=Math.max(safe.left+6-hit.left,Math.min(0,safe.right-6-hit.right));
  const dy=Math.max(safe.top+6-hit.top,Math.min(0,safe.bottom-6-hit.bottom));
  item.x+=dx/scene.width*100;item.y+=dy/scene.height*100;editor.paint(item);editor.sync();
 });
 // Export adapters map the editor's normalized coordinates to their drawing.
 // Union with the original photo framing; never crop a formerly visible base.
 builder.exportFrame=(mapping={x:0,y:0,width:100,height:100},baseline={left:-5,top:-5,side:110})=>{
  const a=frame.getBoundingClientRect(),s=editor.pizza.getBoundingClientRect();
  return window.BuilderPanelWorkspace.photoFrame(a,s,mapping,baseline);
 };
 if(budget)surface.observeLayout?.(budget);
 surface.fitArtwork?.();
 // Native scrollbar plus a subtle bottom shadow indicate more content, without
 // inserting a sticky control or scrolling students away from their selection.
 // Sentence rendering replaces its contents synchronously. Layout reads during
 // that update can temporarily clamp scrollTop; restore the pre-edit offset.
 const editOffsets=new WeakMap();let pointerEdit=null;
 const editTarget=event=>event.target.closest('.pantry button,.pantry select,#free-tools button,#clear');
 root.addEventListener('pointerdown',event=>{const target=editTarget(event);pointerEdit=target?{target,top:column.scrollTop}:null},true);
 root.addEventListener('pointercancel',()=>{pointerEdit=null},true);
 root.addEventListener('click',event=>{
  const target=editTarget(event);if(target)editOffsets.set(event,pointerEdit?.target===target?pointerEdit.top:column.scrollTop);pointerEdit=null;
 },true);
 root.addEventListener('click',event=>{
  if(!editOffsets.has(event))return;
  const top=editOffsets.get(event);column.scrollTop=top;update();
  requestAnimationFrame(()=>{column.scrollTop=top;update()});
 });
 const update=window.BuilderScrollCue(column,output);
};
window.BuilderPanelWorkspace.photoFrame=(area,scene,map,base)=>{
 if(![area.width,area.height,scene.width,scene.height].every(n=>Number.isFinite(n)&&n>0))return {...base};
 const left=Math.min(base.left,map.x+(area.left-scene.left)/scene.width*map.width);
 const top=Math.min(base.top,map.y+(area.top-scene.top)/scene.height*map.height);
 const right=Math.max(base.left+base.side,map.x+(area.right-scene.left)/scene.width*map.width);
 const bottom=Math.max(base.top+base.side,map.y+(area.bottom-scene.top)/scene.height*map.height);
 if(base.center){
  const {x,y}=base.center,radius=Math.max(x-left,right-x,y-top,bottom-y);
  return {left:x-radius,top:y-radius,side:radius*2};
 }
 const side=Math.max(right-left,bottom-top);
 return {side,left:(left+right-side)/2,top:(top+bottom-side)/2};
};
const panelBuilder=document.currentScript?.dataset.builder;
if(panelBuilder)window.BuilderPanelWorkspace(window[panelBuilder]);
