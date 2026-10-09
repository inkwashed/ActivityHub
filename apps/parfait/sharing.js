/* Snapshot original SVG artwork and geometry, never editor outlines or animations. */
(() => {
 function parfaitSVG(builder){
  const stage=document.querySelector('.parfait-stage').getBoundingClientRect();
  const glass=document.querySelector('#parfait').getBoundingClientRect();
  const gx=glass.left-stage.left,gy=glass.top-stage.top,w=glass.width,h=glass.height;
  const bowl='M5 1H95Q99 1 98 6L79 94Q78 99 73 99H27Q22 99 21 94L2 6Q1 1 5 1Z';
  const cream='M1 10C6 10 8 7 11 4Q13 2 15 5C20 13 26 11 31 5Q34 1 37 5C43 13 49 12 55 5Q58 1 61 5C67 12 74 13 80 6Q83 2 86 6C91 11 95 8 99 10L81 95Q80 100 75 100H25Q20 100 19 95Z';
  let shapeId=0;
  // Live bowl/cream strokes are masked to their interiors: reproduce that mask.
  const shape=(path,x,y,width,height,fill,stroke,thickness,inset=false)=>{
   const id=`photo-outline-${shapeId++}`;
   return `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 100 100" preserveAspectRatio="none">${inset?`<defs><clipPath id="${id}"><path d="${path}"/></clipPath></defs>`:''}<path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${thickness}" stroke-linejoin="round" vector-effect="non-scaling-stroke" ${inset?`clip-path="url(#${id})"`:''}/></svg>`;
  };
  const art=(svg,size)=>svg.replace('<svg ',`<svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" `);
  let lowX=0,lowY=-h*.65,highX=stage.width,highY=stage.height;
  let output=shape('M42 2H58L60 30Q63 49 84 68L95 80Q99 86 93 88H7Q1 86 5 80L16 68Q37 49 40 30Z',stage.width*.29,stage.height*.76,stage.width*.42,stage.height*.23,'#cee0d6','#97b6b0',5.5);
  output+=shape(bowl,gx,gy,w,h,'#eff6ed','none',0);
  output+=shape(cream,gx+w*.11+14,gy+h*.5-14,w*.78-28,h*.5,'#fff5e1','#dac8aa',12,true);
  if(builder.creative?.active){
   for(const item of builder.creative.orderedItems()){
    const type=builder.creative.topping(item),size=(type.creativeSize??type.size)*item.scale*w/100;
    const x=gx+item.x*w/100,y=gy+item.y*h/100;
    const extent=size*.708;lowX=Math.min(lowX,x-extent);highX=Math.max(highX,x+extent);lowY=Math.min(lowY,y-extent);highY=Math.max(highY,y+extent);
    const svg=type.category==='scoop'?builder.scoopArtwork(builder.config.bases.find(b=>b.id===type.baseId)):type.art;
    // Scoop and syrup SVGs share the same coordinate space.
    const pieces=svg.match(/<svg[\s\S]*?<\/svg>/g)||[];
    output+=`<g transform="translate(${x} ${y}) rotate(${item.rotate}) scale(${item.flip?-1:1} 1)">${pieces.map(s=>art(s,size)).join('')}</g>`;
   }
  }else{
   output+=`<defs><clipPath id="filling"><path d="M${gx} ${gy-h}H${gx+w}V${gy}L${gx+w*.78} ${gy+h}H${gx+w*.22}L${gx} ${gy}Z"/></clipPath></defs><g clip-path="url(#filling)">`;
   const base=builder.config.bases.find(b=>b.id===builder.state.base&&!b.empty);
   if(base){const size=w*.48;for(const x of [gx+w*.08,gx+w*.44])output+=`<g transform="translate(${x+size/2} ${gy+h*.56-size/2})">${builder.scoopArtwork(base).match(/<svg[\s\S]*?<\/svg>/g).map(s=>art(s,size)).join('')}</g>`;}
   builder.state.layers.forEach((pair,rank)=>{const chosen=pair.filter(Boolean);if(!chosen.length)return;const row=builder.config.layerLayout.rows[rank],count=builder.config.layerLayout.piecesPerRow;for(let i=0;i<count;i++){const type=builder.config.toppings.find(t=>t.id===chosen[i%chosen.length]);output+=`<g transform="translate(${gx+(row.left+(row.right-row.left)*i/(count-1))*w/100} ${gy+row.y*h/100}) rotate(${type.rotation||0})">${art(type.art,(type.layerSize??builder.config.layerLayout.pieceSize)*w/100)}</g>`;}});
  }
  if(!builder.creative?.active)output+='</g>';
  output+=shape(bowl,gx,gy,w,h,'none','#97b6b0',12,true);
  const edge=16,side=Math.max(highX-lowX,highY-lowY)+edge*2,cx=(lowX+highX)/2,cy=(lowY+highY)/2;
  const vx=cx-side/2,vy=cy-side/2;
  const footY=stage.height*(.76+.23*.88);
  const horizon=(footY-vy)/side*100-10;
  const windowBottom=horizon-4;
  // Original flat-vector cafe scene. Anchor the counter to the actual pedestal.
  const backdrop=`<g id="photo-backdrop" transform="translate(${vx} ${vy}) scale(${side/100})">
   <rect width="100" height="100" fill="#f4eddf"/>
   <defs><clipPath id="cafe-window"><rect x="8" y="7" width="84" height="${windowBottom-7}" rx="2"/></clipPath></defs>
   <g clip-path="url(#cafe-window)">
    <rect x="8" y="7" width="84" height="${windowBottom-7}" fill="#e5f0ec"/>
    <circle cx="76" cy="19" r="7" fill="#f8f1cf"/>
    <path d="M8 ${windowBottom}V${windowBottom-12}Q25 ${windowBottom-27} 44 ${windowBottom-12}Q69 ${windowBottom-31} 92 ${windowBottom-15}V${windowBottom}Z" fill="#c2d6b1"/>
    <ellipse cx="15" cy="${windowBottom-10}" rx="14" ry="18" fill="#a5c399"/>
    <ellipse cx="88" cy="${windowBottom-12}" rx="17" ry="21" fill="#b1cba2"/>
    <ellipse cx="34" cy="${windowBottom-3}" rx="23" ry="11" fill="#97b68b"/>
    <ellipse cx="72" cy="${windowBottom}" rx="28" ry="13" fill="#9cbb91"/>
   </g>
   <rect x="8" y="7" width="84" height="${windowBottom-7}" rx="2" fill="none" stroke="#fffcf3" stroke-width="2"/>
   <path d="M50 7V${windowBottom}M8 ${(windowBottom+7)/2}H92" stroke="#fffcf3" stroke-width="1.8"/>
   <rect x="5" y="${windowBottom}" width="90" height="2" rx=".7" fill="#d9d4c2"/>
   <rect y="${horizon}" width="100" height="${100-horizon}" fill="#dcc5a2"/>
   <path d="M0 ${horizon}H100" stroke="#c7ad85" stroke-width=".7"/>
   <path d="M4 ${horizon+6}H27M77 ${horizon+13}H97" stroke="#ead8ba" stroke-width=".6" stroke-linecap="round"/>
  </g><ellipse cx="${stage.width*.5}" cy="${footY}" rx="${stage.width*.19}" ry="${stage.width*.018}" fill="#8c7c60" opacity=".14"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="${vx} ${vy} ${side} ${side}">${backdrop}${output}</svg>`;
 }
 window.parfaitPhotoSVG=parfaitSVG;
 window.BuilderPhoto({builder:()=>window.parfaitBuilder,render:parfaitSVG,imageSelector:'#parfait-photo',caption:'My parfait!',background:'#eff3e8'});
})();
