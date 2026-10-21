/* Website-style PNG content for the shared photo-preview/download lifecycle. */
(() => {
 const load=src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Image unavailable'));image.src=src;});
 // Break by Unicode code point as well as spaces so long typed answers cannot clip.
 function wrap(ctx,text,width){
  const lines=[];let line='';
  for(const word of text.split(/(\s+)/u)){
   if(ctx.measureText(line+word).width<=width){line+=word;continue;}
   if(line.trim())lines.push(line.trimEnd());line='';
   for(const character of word.trimStart()){
    if(line&&ctx.measureText(line+character).width>width){lines.push(line);line='';}
    line+=character;
   }
  }
  if(line.trim())lines.push(line.trimEnd());return lines.length?lines:[''];
 }
 window.BlogSnapshot=async post=>{
  const [avatar,...photos]=await Promise.all([post.avatar,...post.images].map(load));
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Canvas unavailable');
  const width=900,pad=42,content=width-pad*2;
  ctx.font='bold 34px Arial';const title=wrap(ctx,post.title,content);
  ctx.font='bold 26px Arial';const name=wrap(ctx,post.name,content-120);
  ctx.font='26px Arial';const paragraphs=post.sentences.map(line=>wrap(ctx,line,content));
  const authorHeight=Math.max(96,name.length*34);
  const authorY=post.authorFirst?72:88+title.length*44;
  const titleY=post.authorFirst?authorY+authorHeight+54:91;
  const galleryY=post.authorFirst?titleY+(title.length-1)*44+34:authorY+authorHeight+28,photoHeight=photos.length?260:0,textY=photos.length?galleryY+photoHeight+34:galleryY;
  const totalHeight=post.design?galleryY+(post.design.rows*132-12)+64:textY+paragraphs.reduce((sum,lines)=>sum+lines.length*38+14,0)+64;
  const scale=Math.min(2,16000/totalHeight);canvas.width=Math.round(width*scale);canvas.height=Math.round(totalHeight*scale);ctx.scale(scale,scale);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
  // Match the Sample's rounded website frame in the exported PNG itself.
  ctx.save();ctx.beginPath();ctx.roundRect(1,1,width-2,totalHeight-2,18);ctx.clip();
  ctx.fillStyle='#fffefa';ctx.fillRect(0,0,width,totalHeight);
  ctx.fillStyle='#e8eddf';ctx.fillRect(0,0,width,46);
  ctx.fillStyle='#627067';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(24+i*18,23,4,0,Math.PI*2);ctx.fill();}
  ctx.font='bold 15px Arial';ctx.fillText('MY BLOG',width-110,29);
  ctx.fillStyle='#263f36';ctx.font='bold 34px Arial';title.forEach((line,i)=>ctx.fillText(line,pad,titleY+i*44));
  ctx.save();ctx.beginPath();ctx.arc(pad+48,authorY+48,48,0,Math.PI*2);ctx.clip();ctx.drawImage(avatar,pad,authorY,96,96);ctx.restore();
  ctx.font='bold 26px Arial';name.forEach((line,i)=>ctx.fillText(line,pad+120,authorY+authorHeight/2-(name.length-1)*17+9+i*34));
  if(post.design){
   for(const block of post.design.blocks){
    const x=pad+block.x,y=galleryY+block.y;
    if(block.ink){window.BlogInk.paint(ctx,block.ink,x,y,block.width,block.height);}
    else if(block.key==='text'||/^text:\d+$/.test(block.key)){
     ctx.fillStyle='#263f36';ctx.font='26px Arial';ctx.textBaseline='top';
     block.lines.forEach((line,i)=>ctx.fillText(line,x+12,y+12+i*38));ctx.textBaseline='alphabetic';
    }else{
     const image=photos[post.photoKeys.indexOf(block.key)];if(!image)continue;
     ctx.save();ctx.beginPath();ctx.roundRect(x,y,block.width,block.height,12);ctx.clip();
     ctx.fillStyle='#eee6d2';ctx.fillRect(x,y,block.width,block.height);
     const ratio=Math.max(block.width/image.naturalWidth,block.height/image.naturalHeight),w=image.naturalWidth*ratio,h=image.naturalHeight*ratio;
     ctx.drawImage(image,x+(block.width-w)*(block.cropX??50)/100,y+(block.height-h)*(block.cropY??50)/100,w,h);ctx.restore();
    }
   }
  }else{
  const gap=12,cell=photos.length?(content-gap*(photos.length-1))/photos.length:0;
  photos.forEach((image,i)=>{
   const x=pad+i*(cell+gap);ctx.fillStyle='#eee6d2';ctx.fillRect(x,galleryY,cell,photoHeight);
   const scale=Math.min(cell/image.naturalWidth,photoHeight/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
   ctx.drawImage(image,x+(cell-w)/2,galleryY+(photoHeight-h)/2,w,h);
  });
  ctx.fillStyle='#263f36';ctx.font='26px Arial';let y=textY+26;
  for(const lines of paragraphs){for(const line of lines){ctx.fillText(line,pad,y);y+=38;}y+=14;}
  }
  ctx.fillStyle='#627067';ctx.font='14px Arial';ctx.fillText(`Let's EiGo! ・${post.activityTitle||'My Blog'}`,pad,totalHeight-24);
  ctx.restore();ctx.strokeStyle='#dcded0';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(1,1,width-2,totalHeight-2,18);ctx.stroke();
  return canvas;
 };
})();
