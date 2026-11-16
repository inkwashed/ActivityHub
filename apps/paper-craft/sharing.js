/* Production Save artwork, also used by static homepage previews. */
(() => {
 const PaperCraft=window.PaperCraft,{art,config}=PaperCraft;
 window.renderPaperCraft=b=>{
  const {left,top,side}=b.exportFrame();
  const pieces=b.creative.active?b.creative.orderedItems():config.toppings.filter(x=>b.state.toppings[x.id]).map(x=>({topping:x.id,x:x.x,y:x.y,scale:1,rotate:x.learnRotation||0,flip:false,color:b.palette().pieceColors[x.id]}));
  const content=pieces.map(piece=>{const item=config.toppings.find(x=>x.id===piece.topping),size=(b.creative.active?item.creativeSize:item.size)*piece.scale;return `<g transform="translate(${piece.x} ${piece.y}) rotate(${piece.rotate}) scale(${piece.flip?-1:1} 1)"><svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" viewBox="0 0 100 100">${art(piece.topping,piece.color).replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg></g>`}).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="${left} ${top} ${side} ${side}">${PaperCraft.background.markup(b.background(),'craft-export',{left,top,width:side,height:side})}${content}</svg>`;
 };
 window.BuilderPhoto({appName:'Paper Craft',builder:()=>window.craftBuilder,imageSelector:'#craft-photo',render:window.renderPaperCraft,caption:'This is for you.',background:'#fffdf5'});
})();
