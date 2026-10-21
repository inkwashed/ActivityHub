/* Three-column placement model shared by Design and exported snapshots. */
(() => {
 const width=816,gap=12,rowHeight=120,column=(width-2*gap)/3;
 const integer=(value,fallback,min,max)=>Number.isInteger(value)?Math.max(min,Math.min(max,value)):fallback;
 const keyOf=image=>'photo:'+image.uid;
 const isText=key=>key==='text'||/^text:\d+$/.test(key);
 const textIndex=key=>key==='text'?0:Number(key.slice(5));
 function sections(text=''){const parts=String(text).split(/\r\n?|\n/).map(part=>part.trim()).filter(Boolean);return parts.length?parts:[''];}
 function defaults(images,text=''){return [...images.map((image,i)=>({key:keyOf(image),col:i,row:0,w:1,h:2})),...sections(text).map((_,i)=>({key:i?`text:${i}`:'text',col:0,row:(images.length?2:0)+i,w:3,h:1}))];}
 function normalize(raw,images,text=''){
  if(!Array.isArray(raw))return null;
  const initial=defaults(images,text),allowed=new Set(initial.map(b=>b.key)),seen=new Set();
  const blocks=raw.filter(block=>block&&allowed.has(block.key)&&!seen.has(block.key)&&seen.add(block.key)).map(block=>{
   const w=integer(block.w,1,1,3);return {key:block.key,col:integer(block.col,0,0,3-w),row:integer(block.row,0,0,1000),w,h:integer(block.h,2,1,3),cropX:integer(block.cropX,50,0,100),cropY:integer(block.cropY,50,0,100)};
  });
  return [...blocks,...initial.filter(block=>!seen.has(block.key))];
 }
 function wrap(text,maxWidth,measure){
  const result=[];
  for(const paragraph of text.replace(/\r\n?/g,'\n').replace(/\n{3,}/g,'\n\n').split('\n')){
   let line='';
   for(const word of paragraph.split(/(\s+)/u)){
    if(measure(line+word)<=maxWidth){line+=word;continue;}
    if(line.trim())result.push(line.trimEnd());line='';
    for(const ch of word.trimStart()){if(line&&measure(line+ch)>maxWidth){result.push(line);line='';}line+=ch;}
   }
   result.push(line.trimEnd());
  }
  return result;
 }
 const overlap=(a,b)=>a.col<b.col+b.w&&a.col+a.w>b.col&&a.row<b.row+b.rows&&a.row+a.rows>b.row;
 function plan(layout,images,text,measure,priority){
  const blocks=normalize(layout,images,text)??defaults(images,text),placed=[],parts=sections(text);
  const ordered=priority?[...blocks.filter(b=>b.key===priority),...blocks.filter(b=>b.key!==priority)]:blocks;
  for(const block of ordered){
   const pixelWidth=column*block.w+gap*(block.w-1);
   const lines=isText(block.key)?wrap(parts[textIndex(block.key)],pixelWidth-24,measure):[];
   const rows=isText(block.key)?Math.max(1,Math.ceil((lines.length*38+24+gap)/(rowHeight+gap))):block.h;
   const item={...block,rows,lines};
   while(placed.some(other=>overlap(item,other)))item.row++;
   placed.push(item);
  }
  return {width,gap,rowHeight,rows:Math.max(1,...placed.map(b=>b.row+b.rows)),blocks:placed.map(b=>({...b,x:b.col*(column+gap),y:b.row*(rowHeight+gap),width:column*b.w+gap*(b.w-1),height:rowHeight*b.rows+gap*(b.rows-1)}))};
 }
 // Swap across touching blocks using their rendered height (including wrapped text).
 // Empty space still allows an ordinary one-row nudge.
 function moveVertical(current,key,direction){
  const blocks=current.blocks.map(block=>({...block})),selected=blocks.find(b=>b.key===key);
  if(!selected||![-1,1].includes(direction))return positions(current);
  const trial={...selected,row:Math.max(0,selected.row+direction)};
  const neighbors=blocks.filter(b=>b!==selected&&overlap(trial,b));
  if(!neighbors.length)selected.row=trial.row;
  else if(direction<0){
   selected.row=Math.min(...neighbors.map(b=>b.row));
   for(const neighbor of neighbors)neighbor.row+=selected.rows;
  }else{
   const start=selected.row;
   selected.row=Math.max(...neighbors.map(b=>b.row+b.rows))-selected.rows;
   for(const neighbor of neighbors)neighbor.row=start;
  }
  // Place earlier rows first, so only actual remaining collisions move downward.
  blocks.sort((a,b)=>a.row-b.row);
  return positions({blocks});
 }
 function moveHorizontal(current,key,direction){
  const blocks=current.blocks.map(block=>({...block})),selected=blocks.find(b=>b.key===key);
  if(!selected||![-1,1].includes(direction))return positions(current);
  const trial={...selected,col:Math.max(0,Math.min(3-selected.w,selected.col+direction))};
  const neighbors=blocks.filter(b=>b!==selected&&overlap(trial,b));
  if(!neighbors.length)selected.col=trial.col;
  else if(direction<0){
   selected.col=Math.min(...neighbors.map(b=>b.col));
   for(const neighbor of neighbors)neighbor.col+=selected.w;
  }else{
   const start=selected.col;
   selected.col=Math.max(...neighbors.map(b=>b.col+b.w))-selected.w;
   for(const neighbor of neighbors)neighbor.col=start;
  }
  return positions({blocks});
 }
 const positions=plan=>plan.blocks.map(({key,col,row,w,h,cropX=50,cropY=50})=>({key,col,row,w,h,cropX,cropY}));
 window.BlogLayout={width,gap,rowHeight,keyOf,isText,textIndex,sections,defaults,normalize,wrap,plan,positions,overlap,moveVertical,moveHorizontal};
})();
