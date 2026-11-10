/* Stable stage and bounded sentence area; text fitting never resizes the food. */
(() => {
 function fitBoxes(boxes,width,height,gap=6,horizontalCenter=null){
  const bounds=scale=>{
   const rects=boxes.map(b=>{const cx=(b.left+b.right)*scale/2,cy=(b.top+b.bottom)*scale/2,w=Math.max((b.right-b.left)*scale,b.minWidth||0),h=Math.max((b.bottom-b.top)*scale,b.minHeight||0);return {left:cx-w/2,right:cx+w/2,top:cy-h/2,bottom:cy+h/2}});
   return {left:Math.min(...rects.map(b=>b.left)),right:Math.max(...rects.map(b=>b.right)),top:Math.min(...rects.map(b=>b.top)),bottom:Math.max(...rects.map(b=>b.bottom))};
  };
  const fits=s=>{const b=bounds(s);return b.right-b.left<=width-2*gap&&b.bottom-b.top<=height-2*gap};
  let scale=1;
  if(!fits(1)){let low=0,high=1;for(let i=0;i<48;i++){const mid=(low+high)/2;if(fits(mid))low=mid;else high=mid}scale=Math.max(.01,low);}
  const b=bounds(scale);
  const desiredX=horizontalCenter?horizontalCenter.target-horizontalCenter.anchor*scale:0;
  return {scale,x:Math.max(gap-b.left,Math.min(desiredX,width-gap-b.right)),y:Math.max(gap-b.top,Math.min(0,height-gap-b.bottom))};
 }
 window.BuilderArtworkFit={fit:fitBoxes};
 // One scheduled layout transaction per workspace, regardless of observer source.
 window.BuilderLayoutCoordinator=({fit,repaint,request=requestAnimationFrame,cancel=cancelAnimationFrame})=>{
  let pending=null;
  const flush=()=>{if(pending!==null)cancel(pending);pending=null;fit();repaint();};
  return {schedule(){if(pending===null)pending=request(flush)},flush};
 };
 const root=document.querySelector('#builder');
 const kitchen=root?.querySelector('.kitchen');
 const scene=kitchen?.querySelector('[data-builder-scene],.pizza-stage,.parfait-stage,#sandwich');
 const order=kitchen?.querySelector('.order');
 if(!scene||!order)return;
 const frame=document.createElement('div');frame.className='builder-play-area';
 scene.before(frame);
 const tools=root.querySelector('#free-tools');
 // A separate size container keeps art sizing and drag bounds outside the tool strip.
 let surface=frame;
 if(tools){surface=document.createElement('div');surface.className='builder-art-area';frame.append(surface);}
 surface.append(scene);if(tools)frame.append(tools);
 // Opted-in scenes keep their full-frame coordinate system. Only visible artwork
 // (including edited pieces) participates in fitting; transparent margins do not.
 if(tools&&(scene.hasAttribute?.('data-builder-fit')||scene.matches?.('.parfait-stage,#sandwich')||scene.querySelector?.('#pizza'))){
  const composition=document.createElement('div');composition.className='builder-composition';
  surface.append(composition);composition.append(scene);
  const fitArtwork=()=>{
   const full=frame.getBoundingClientRect(),safe=surface.getBoundingClientRect();
   // Optional app-owned preferred frame decouples added editing space from zoom.
   const preferred=frame.querySelector?.('[data-builder-preferred-frame]')?.getBoundingClientRect()||full;
   if(![full,safe,preferred].every(r=>[r.width,r.height].every(n=>Number.isFinite(n)&&n>0)&&[r.left,r.top].every(Number.isFinite)))return;
   composition.style.cssText=`width:${preferred.width}px;height:${preferred.height}px;left:0;top:0`;
   if(!root.classList.contains('is-create'))return;
   const boxes=[];
   const include=(r)=>{if(r.width&&r.height)boxes.push({left:r.left-full.left,top:r.top-full.top,right:r.right-full.left,bottom:r.bottom-full.top})};
   const svgBox=svg=>{
    if(!svg.getClientRects().length)return;
    const b=svg.getBBox(),m=svg.getScreenCTM();if(!m||!b.width||!b.height)return;
    const points=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
    const left=Math.min(...points.map(p=>p.x)),right=Math.max(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y)),bottom=Math.max(...points.map(p=>p.y));
    include({left,right,top,bottom,width:right-left,height:bottom-top});
   };
   if(scene.matches('.pizza-stage')&&scene.querySelector('#pizza'))include(scene.querySelector('#pizza').getBoundingClientRect());
   // Explicit base markers support SVG silhouettes and full rectangular bases.
   // Mark the SVG itself (or its wrapper) to ignore transparent viewBox margins.
   scene.querySelectorAll('[data-builder-fit-base]').forEach(base=>{
    const svg=base.matches('svg')?base:base.querySelector(':scope > svg');
    if(svg)svgBox(svg);else include(base.getBoundingClientRect());
   });
   scene.querySelectorAll('[data-builder-fixed-hit]').forEach(hit=>{if(hit.getClientRects().length)include(hit.getBoundingClientRect())});
   if(scene.matches('.parfait-stage'))scene.querySelectorAll('.glass-art>svg').forEach(svgBox);
   if(scene.dataset.builderArtBounds){
    // App-owned normalized bounds for artwork rendered as a CSS background.
    const [x,y,w,h]=scene.dataset.builderArtBounds.split(' ').map(Number),r=scene.getBoundingClientRect();
    include({left:r.left+r.width*x,right:r.left+r.width*(x+w),top:r.top+r.height*y,bottom:r.top+r.height*(y+h),width:r.width*w,height:r.height*h});
   }
   if(scene.dataset.builderPlacement!=='full'){
   scene.querySelectorAll('.free-art>svg').forEach(svgBox);
   scene.querySelectorAll('.piece-hit').forEach(hit=>{
    include(hit.getBoundingClientRect());
    const angle=parseFloat(hit.closest('.free-piece').style.getPropertyValue('--angle'))*Math.PI/180;
    const minimum=44*(Math.abs(Math.cos(angle))+Math.abs(Math.sin(angle)));
    Object.assign(boxes[boxes.length-1],{minWidth:minimum,minHeight:minimum});
   });
   }
   if(!boxes.length)return;
   const center=scene.dataset.builderBottomCenter==='true'&&Math.abs(safe.width-full.width)<1&&safe.height<full.height-1
    ? {target:full.width/2,anchor:(boxes[0].left+boxes[0].right)/2}:null;
   const {x,y,scale}=fitBoxes(boxes,safe.width,safe.height,6,center);
   composition.style.cssText=`width:${preferred.width*scale}px;height:${preferred.height*scale}px;left:${x}px;top:${y}px`;
   composition.dataset.fit=scale<.999?'scale':Math.abs(x)+Math.abs(y)>.1?'shift':'preserve';
   composition.dataset.scale=scale.toFixed(4);
  };
  surface.fitArtwork=fitArtwork;
  fitArtwork();
 }
 const layout=window.BuilderLayoutCoordinator({fit:()=>surface.fitArtwork?.(),repaint:()=>surface.repaintArtwork?.()});
 surface.requestLayout=()=>layout.schedule();
 const geometryObserver=new ResizeObserver(surface.requestLayout);
 geometryObserver.observe(surface);if(frame!==surface)geometryObserver.observe(frame);
 surface.observeLayout=node=>geometryObserver.observe(node);
 new MutationObserver(surface.requestLayout).observe(root,{attributes:true,attributeFilter:['class']});
 if(typeof CustomEvent!=='undefined')document.dispatchEvent(new CustomEvent('builder:workspace-ready',{detail:surface}));
 const output=document.createElement('div');output.className='builder-output';
 order.before(output);output.append(order);
 const sources=kitchen.querySelector('#source-sentence');if(sources)output.append(sources);
 let pending=false;
 const fit=()=>{
  pending=false;
  if(root.classList.contains('panel-workspace'))return;
  // Start at the preferred size again when content becomes shorter.
  for(let size=21;size>=16;size--){
   output.style.setProperty('--output-font-size',`${size}px`);
   if(output.scrollHeight<=output.clientHeight+1)break;
  }
  // Long compositions remain fully accessible at the minimum readable size.
  output.tabIndex=output.scrollHeight>output.clientHeight+1?0:-1;
 };
 const schedule=()=>{if(!pending){pending=true;requestAnimationFrame(fit)}};
 const textObserver=new MutationObserver(schedule);textObserver.observe(output,{childList:true,characterData:true,subtree:true});
 const textResize='ResizeObserver' in window?new ResizeObserver(schedule):null;textResize?.observe(output);
 output.stopFitting=()=>{textObserver.disconnect();textResize?.disconnect();window.removeEventListener('resize',schedule);output.style.removeProperty('--output-font-size');output.tabIndex=-1;};
 window.addEventListener('resize',schedule);
 document.fonts?.ready.then(schedule);schedule();
})();
