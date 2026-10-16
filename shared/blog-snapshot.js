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
  ctx.font='bold 26px Arial';const name=wrap(ctx,post.name,content-92);
  ctx.font='26px Arial';const paragraphs=post.sentences.map(line=>wrap(ctx,line,content));
  const authorY=88+title.length*44,authorHeight=Math.max(64,name.length*34);
  const galleryY=authorY+authorHeight+28,photoHeight=260,textY=galleryY+photoHeight+34;
  canvas.width=width;canvas.height=textY+paragraphs.reduce((sum,lines)=>sum+lines.length*38+14,0)+64;
  ctx.fillStyle='#fffefa';ctx.fillRect(0,0,width,canvas.height);
  ctx.fillStyle='#e8eddf';ctx.fillRect(0,0,width,46);
  ctx.fillStyle='#627067';for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(24+i*18,23,4,0,Math.PI*2);ctx.fill();}
  ctx.font='bold 15px Arial';ctx.fillText('MY BLOG',width-110,29);
  ctx.fillStyle='#263f36';ctx.font='bold 34px Arial';title.forEach((line,i)=>ctx.fillText(line,pad,91+i*44));
  ctx.save();ctx.beginPath();ctx.arc(pad+32,authorY+32,32,0,Math.PI*2);ctx.clip();ctx.drawImage(avatar,pad,authorY,64,64);ctx.restore();
  ctx.font='bold 26px Arial';name.forEach((line,i)=>ctx.fillText(line,pad+92,authorY+32+i*34));
  const gap=12,cell=(content-gap*(photos.length-1))/photos.length;
  photos.forEach((image,i)=>{
   const x=pad+i*(cell+gap);ctx.fillStyle='#eee6d2';ctx.fillRect(x,galleryY,cell,photoHeight);
   const scale=Math.min(cell/image.naturalWidth,photoHeight/image.naturalHeight),w=image.naturalWidth*scale,h=image.naturalHeight*scale;
   ctx.drawImage(image,x+(cell-w)/2,galleryY+(photoHeight-h)/2,w,h);
  });
  ctx.fillStyle='#263f36';ctx.font='26px Arial';let y=textY+26;
  for(const lines of paragraphs){for(const line of lines){ctx.fillText(line,pad,y);y+=38;}y+=14;}
  ctx.fillStyle='#627067';ctx.font='14px Arial';ctx.fillText('Let’s EiGo! · My Blog',pad,canvas.height-24);
  return canvas;
 };
})();
