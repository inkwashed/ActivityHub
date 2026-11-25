/* Grid placement model shared by Design and exported snapshots. */
(() => {
 const width=816,gap=12,rowHeight=120,legacyColumns=3;
 const integer=(value,fallback,min,max)=>Number.isInteger(value)?Math.max(min,Math.min(max,value)):fallback;
 const keyOf=image=>'photo:'+image.uid;
 const isInk=key=>/^ink:\d+$/.test(key);
 const isText=key=>key==='text'||/^text:\d+$/.test(key);
 const textIndex=key=>key==='text'?0:Number(key.slice(5));
 function sections(text=''){const parts=String(text).split(/\r\n?|\n/).map(part=>part.trim()).filter(Boolean);return parts.length?parts:[''];}
 function defaults(images,text='',ink=null,columns=legacyColumns){
  const span=columns/legacyColumns;
  const photos=images.map((image,i)=>({key:keyOf(image),col:i%3*span,row:Math.floor(i/3)*2,w:span,h:2}));
  const firstTextRow=Math.ceil(images.length/3)*2;
  const writing=ink||sections(text);
  return [...photos,...writing.map((_,i)=>({key:ink?`ink:${i}`:i?`text:${i}`:'text',col:0,row:firstTextRow+i,w:columns,h:1}))];
 }
 function normalize(raw,images,text='',ink=null,columns=legacyColumns){
  if(!Array.isArray(raw))return null;
  const initial=defaults(images,text,ink,columns),allowed=new Set(initial.map(b=>b.key)),seen=new Set();
  const blocks=raw.filter(block=>block&&allowed.has(block.key)&&!seen.has(block.key)&&seen.add(block.key)).map(block=>{
   const w=integer(block.w,1,1,columns);return {key:block.key,col:integer(block.col,0,0,columns-w),row:integer(block.row,0,0,1000),w,h:integer(block.h,2,1,columns),cropX:integer(block.cropX,50,0,100),cropY:integer(block.cropY,50,0,100)};
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
 function plan(layout,images,text,measure,priority,ink=null,inkSheets=null,columns=legacyColumns){
  const column=(width-(columns-1)*gap)/columns;
  const cellHeight=columns===legacyColumns?rowHeight:column;
  const blocks=normalize(layout,images,text,ink,columns)??defaults(images,text,ink,columns),placed=[],parts=sections(text);
  const ordered=priority?[...blocks.filter(b=>b.key===priority),...blocks.filter(b=>b.key!==priority)]:blocks;
  for(const block of ordered){
   const pixelWidth=column*block.w+gap*(block.w-1);
   const lines=isText(block.key)?wrap(parts[textIndex(block.key)],pixelWidth-24,measure):[];
   const rows=isInk(block.key)?1:isText(block.key)?Math.max(1,Math.ceil((lines.length*38+24+gap)/(cellHeight+gap))):block.h;
   const item={...block,rows,lines,...(isInk(block.key)?{ink:ink[Number(block.key.slice(4))],inkSheet:inkSheets?.[Number(block.key.slice(4))]}:{})};
   while(placed.some(other=>overlap(item,other)))item.row++;
   placed.push(item);
  }
  return {width,gap,columns,column,rowHeight:cellHeight,rows:Math.max(1,...placed.map(b=>b.row+b.rows)),blocks:placed.map(b=>({...b,x:b.col*(column+gap),y:b.row*(cellHeight+gap),width:column*b.w+gap*(b.w-1),height:cellHeight*b.rows+gap*(b.rows-1)}))};
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
  const trial={...selected,col:Math.max(0,Math.min(current.columns-selected.w,selected.col+direction))};
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
 // A drop may displace one block only when both destinations are clear.
 function drop(current,key,col,row){
  const selected=current.blocks.find(block=>block.key===key);
  const fits=block=>block.col>=0&&block.col+block.w<=current.columns&&block.row>=0&&block.row<=1000;
  if(!selected||!Number.isInteger(col)||!Number.isInteger(row))return null;
  const target={...selected,col,row};
  if(!fits(target))return null;
  const otherBlocks=current.blocks.filter(block=>block!==selected);
  const hits=otherBlocks.filter(block=>overlap(block,target));
  if(hits.length>1)return null;
  const other=hits[0],swap=other&&{...other,col:selected.col,row:selected.row};
  if(swap&&(!fits(swap)||overlap(swap,target)||otherBlocks.some(block=>block!==other&&overlap(block,swap))))return null;
  return positions({blocks:current.blocks.map(block=>block===selected?target:block===other?swap:block)});
 }
 function dropNear(current,key,other,maxRows){
  const selected=current.blocks.find(block=>block.key===key);
  if(!selected||!other||other===selected)return null;
  const exact=drop(current,key,other.col,other.row);
  if(exact)return exact;
  const remaining=current.blocks.filter(block=>block!==selected&&block!==other);
  const fits=block=>block.col>=0&&block.col+block.w<=current.columns&&block.row>=0&&
   block.row<=1000&&block.row+block.rows<=maxRows&&!remaining.some(item=>overlap(item,block));
  const target={...selected,col:other.col,row:other.row};
  const beside=(block,anchor)=>[
   {...block,row:anchor.row-block.rows,col:anchor.col},
   {...block,row:anchor.row+anchor.rows,col:anchor.col},
   {...block,col:anchor.col-block.w,row:anchor.row},
   {...block,col:anchor.col+anchor.w,row:anchor.row}
  ];
  const nearest=(a,b)=>Math.abs(a.col-selected.col)+Math.abs(a.row-selected.row)-Math.abs(b.col-selected.col)-Math.abs(b.row-selected.row);
  const adjacent=beside(selected,other).filter(block=>fits(block)&&(block.col!==selected.col||block.row!==selected.row)).sort(nearest)[0];
  if(adjacent)return drop(current,key,adjacent.col,adjacent.row);
  if(!fits(target))return null;
  const pushed=beside(other,target).filter(fits).sort((a,b)=>
   Math.abs(a.col-other.col)+Math.abs(a.row-other.row)-Math.abs(b.col-other.col)-Math.abs(b.row-other.row))[0];
  return pushed?positions({blocks:current.blocks.map(block=>block===selected?target:block===other?pushed:block)}):null;
 }
 const positions=plan=>plan.blocks.map(({key,col,row,w,h,cropX=50,cropY=50})=>({key,col,row,w,h,cropX,cropY}));
 window.BlogLayout={width,gap,rowHeight,keyOf,isInk,isText,textIndex,sections,defaults,normalize,wrap,plan,positions,overlap,moveVertical,moveHorizontal,drop,dropNear};
})();
