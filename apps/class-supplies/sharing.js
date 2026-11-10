/* Shared by the live Save flow and static homepage generation. */
(() => {
 const {config,art,caseArt}=window.Supplies;
 // Export uses the same original art and ordered transforms as the live scene.
 window.renderSupplies=builder=>{
  const palette=builder.palette();
  const pieces=builder.creative.active?builder.creative.orderedItems():config.toppings.filter(x=>builder.state.toppings[x.id]).map(x=>({topping:x.id,x:x.x,y:x.y,scale:1,rotate:x.learnRotation||0,flip:false}));
  const content=pieces.map(piece=>{const item=config.toppings.find(x=>x.id===piece.topping),size=(builder.creative.active?item.creativeSize:item.size)*piece.scale;return `<g transform="translate(${piece.x} ${piece.y}) rotate(${piece.rotate}) scale(${piece.flip?-1:1} 1)"><svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" viewBox="0 0 100 100" overflow="visible" fill="none" stroke="#31483f" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${art(item.id,builder.creative.active?builder.pieceColor(piece):palette[item.id]).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`}).join('');
  // Fixed framing in both modes: keep scene proportions and crop at photo edges.
  const {side,left,top}=builder.exportFrame?.()||{side:110,left:-5,top:-5};
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="${left} ${top} ${side} ${side}" preserveAspectRatio="xMidYMid meet">
   <defs><pattern id="desk-grain" width="48" height="18" patternUnits="userSpaceOnUse"><rect width="48" height="18" fill="#e6c999"/><path d="M-8 5Q8 2 24 5T56 5M-10 13Q10 16 28 13T58 13" fill="none" stroke="#c29a66" stroke-opacity=".2" stroke-width=".35"/><path d="M3 9h14m18 0h10" stroke="#fff5dc" stroke-opacity=".3" stroke-width=".3"/></pattern><pattern id="carpet" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#858581"/><path d="M.4 .7h.5m1 1.3h.6" stroke="#6e6f6c" stroke-width=".2" opacity=".5"/></pattern><clipPath id="desk-frame"><rect x="${left}" y="${top}" width="${side}" height="${side}"/></clipPath></defs>
   <rect x="${left}" y="${top}" width="${side}" height="${side}" fill="url(#carpet)"/>
   <rect x="${left-20}" y="${top+6}" width="${side+40}" height="${side-8}" fill="#575852" opacity=".18"/>
   <rect x="${left-20}" y="${top+5}" width="${side+40}" height="${side-10}" fill="url(#desk-grain)"/>
   <path d="M${left-20} ${top+5}H${left+side+20}" stroke="#f4dfb8" stroke-width=".6"/>
   <path d="M${left-20} ${top+side-5}H${left+side+20}" stroke="#ad8452" stroke-width="1.4"/>
   <g clip-path="url(#desk-frame)">${caseArt(palette.case)}${content}</g></svg>`;
 };
 window.BuilderPhoto({builder:()=>window.suppliesBuilder,imageSelector:'#supplies-photo',render:window.renderSupplies,caption:'Class Supplies',background:'#eee6d2'});
})();
