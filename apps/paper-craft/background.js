/* Lesson-owned lightweight SVG stationery, inspired by POST's pattern choices. */
(() => {
 const PaperCraft=window.PaperCraft;
 const pastel=hex=>'#'+hex.slice(1).match(/../g).map(v=>Math.round(parseInt(v,16)*.3+255*.7).toString(16).padStart(2,'0')).join('');
 const colors=Object.fromEntries(Object.entries(PaperCraft.colors).map(([name,hex])=>[name,pastel(hex)]));colors.white='#fffdf5';
 const patterns={none:'Plain',dots:'Polka dots',stripes:'Stripes',zigzag:'Zigzag',hearts:'Hearts',stars:'Stars'};
 const motifs={dots:'<circle cx="2" cy="2" r=".6"/><circle cx="6" cy="6" r=".6"/>',stripes:'<path d="m-2 2 4-4M0 8 8 0m-2 10 4-4" fill="none" stroke="currentColor" stroke-width="1.2"/>',zigzag:'<path d="m-2 2 2 2 2-2 2 2 2-2 2 2 2-2m-12 4 2 2 2-2 2 2 2-2 2 2 2-2" fill="none" stroke="currentColor" stroke-width=".5"/>',hearts:'<path d="M4 6C-1 3 2 0 4 2 6 0 9 3 4 6Z"/>',stars:'<path d="m4 1 .9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2L1 3.1l2.1-.3Z"/>'};
 const validate=value=>({pattern:Object.hasOwn(patterns,value?.pattern)?value.pattern:'none',color:Object.hasOwn(colors,value?.color)?value.color:'brown'});
 const markup=(value,prefix='craft-bg',box={left:-1000,top:-1000,width:2100,height:2100})=>{
  const bg=validate(value),fill=colors[bg.color],id=prefix+'-pattern',rect=`x="${box.left}" y="${box.top}" width="${box.width}" height="${box.height}"`;
  const ink=bg.color==='white'?'#aaa79f':PaperCraft.colors[bg.color];
  const base=`<rect ${rect} fill="${fill}"/>`;
  return base+(bg.pattern==='none'?'':`<defs><pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse"><g fill="${ink}" color="${ink}" opacity=".28">${motifs[bg.pattern]}</g></pattern></defs><rect ${rect} fill="url(#${id})"/>`);
 };
 PaperCraft.background={colors,patterns,validate,markup};
})();
