/* Reusable one-pointer movement / two-pointer scaling. No gesture rotation. */
(() => {
 class PieceGestures {
  constructor(options){this.options=options;this.points=new Map();this.item=null;this.node=null;}
  rebase(){
   if(!this.item)return;
   const points=[...this.points.values()];
   this.origin={x:this.item.x,y:this.item.y,scale:this.item.scale,point:points[0],distance:points.length===2?Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y):0};
  }
  cancel(){
   const node=this.node,ids=[...this.points.keys()];
   this.points.clear();this.item=null;this.node=null;
   ids.forEach(id=>{if(node?.hasPointerCapture?.(id))node.releasePointerCapture(id)});
  }
  bind(node,item){
   node.addEventListener('pointerdown',e=>{
    if(!this.options.enabled()||e.button!==0||this.points.size>=2||(this.item&&this.item!==item))return;
    e.preventDefault();
    if(!this.item){this.item=item;this.node=node;this.options.select(item);node.focus({preventScroll:true});}
    this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});node.setPointerCapture(e.pointerId);this.rebase();
   });
   node.addEventListener('pointermove',e=>{
    if(this.item!==item||!this.points.has(e.pointerId))return;
    this.points.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const points=[...this.points.values()],origin=this.origin;
    if(points.length===2){
     const distance=Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y);
     if(origin.distance<4){this.rebase();return;}
     item.scale=origin.scale*distance/origin.distance;
    }else{
     const rect=this.options.bounds();
     item.x=origin.x+(points[0].x-origin.point.x)/rect.width*100;
     item.y=origin.y+(points[0].y-origin.point.y)/(rect.height||rect.width)*100;
    }
    this.options.change(item,points.length===2);
    // Rebase after clamping so reversing a gesture responds immediately.
    this.rebase();
   });
   const finish=e=>{
    if(this.item!==item||!this.points.has(e.pointerId))return;
    if(e.type==='pointercancel'){this.cancel();return;}
    this.points.delete(e.pointerId);
    if(this.points.size)this.rebase();else this.cancel();
   };
   node.addEventListener('pointerup',finish);node.addEventListener('pointercancel',finish);node.addEventListener('lostpointercapture',finish);
  }
 }
 window.PieceGestures=PieceGestures;
})();
