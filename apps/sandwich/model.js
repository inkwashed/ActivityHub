/* Lesson-specific initials and optional source statements; no inferred provenance. */
window.SandwichLesson={
 describe(items,config,hard=false){
  const chosen=items.map(piece=>({piece,type:config.toppings.find(t=>t.id===piece.topping)})).filter(x=>x.type);
  const unique=[...new Map(chosen.map(x=>[x.type.id,x.type])).values()];
  const name=unique.map(x=>x.letter).join('');
  const article=/^[AEFHILMNORSX]/.test(name)?'an':'a';
  return {sentence:name?`My sandwich is ${article} ${name}. `+unique.map(x=>{const selected=chosen.find(entry=>entry.type.id===x.id);const source=x.sources.includes(selected.piece.source)?selected.piece.source:'…';return `${x.letter} is for ${x.label}.`+(hard?` It's from ${source}.`:'');}).join(' '):'My sandwich is ….',
   sources:chosen.filter(x=>x.type.sources.includes(x.piece.source)).map(x=>`The ${x.type.label} is from ${x.piece.source}.`).filter((x,i,a)=>a.indexOf(x)===i).join(' ')};
 },
 bread(y){return `<g transform="translate(0 ${y})" stroke-linejoin="round"><path d="M16.2 3Q16 1 20 0L48 -11Q51 -12 55 -10L81 0Q84.4 1 84.4 3L84.4 9Q84 11 80 12L53 22Q50 23 46 21L20 12Q16.2 10 16.2 8Z" fill="#c78b43" stroke="#a46b30" stroke-width="1.2"/><path d="M18 0L48 -12Q51 -13 55 -11L83 0Q87 3 80 6L53 16Q50 17 46 15L20 6Q14 3 18 0Z" fill="#efd39a" stroke="#b78340" stroke-width="1.2"/><path d="M23 0L49 -9Q51 -10 54 -8L78 1Q80 3 76 4L53 13Q50 14 47 12L25 5Q19 3 23 0Z" fill="#fae7b9"/><g fill="#dcc28a"><ellipse cx="37" cy="2" rx="1.4" ry=".7"/><ellipse cx="56" cy="6" rx="1" ry=".7"/><ellipse cx="62" cy="0" rx="1.5" ry=".7"/><ellipse cx="47" cy="-3" rx=".9" ry=".6"/></g><path d="M25 8V12M34 11V15M65 14V17M76 10V13" stroke="#dbab69" stroke-width="1" stroke-linecap="round"/></g>`;},
 photoBackground(){return `<g id="picnic-background"><rect width="100" height="100" fill="#e4efe9"/><circle cx="79" cy="15" r="7" fill="#fff1c4"/><path d="M0 49Q24 36 49 48Q73 35 100 44V74H0Z" fill="#c7d7ab"/><path d="M0 60Q27 47 53 57Q78 46 100 55V75H0Z" fill="#aac391"/><g stroke="#a38c68" stroke-width="3" stroke-linecap="round"><path d="M13 52V25M88 51V22"/></g><g fill="#8fac81"><circle cx="9" cy="26" r="10"/><circle cx="18" cy="24" r="11"/><circle cx="13" cy="16" r="10"/></g><g fill="#9cba8d"><circle cx="82" cy="23" r="10"/><circle cx="95" cy="23" r="12"/><circle cx="88" cy="13" r="11"/></g><path d="M0 66H100V100H0Z" fill="#d6b68a"/><path d="M0 66H100M0 80H100M0 96H100" stroke="#b99565" stroke-width=".7"/><path d="M7 72H24M70 74H91M4 88H20M80 89H98" stroke="#ebd0a7" stroke-width=".8" stroke-linecap="round"/></g>`;},
 svg(items,config,creative=false,photo=false){
  const art=items.map((p,i)=>{
   const t=[...config.toppings,...(config.creativeExtras||[])].find(x=>x.id===p.topping);if(!t)return '';
   const size=creative?t.size*p.scale:82,x=creative?p.x:50,y=creative?p.y:64-i*(photo?12:17);
   return `<g transform="translate(${x} ${y}) rotate(${p.rotate||0}) scale(${p.flip?-1:1} 1)">${t.art.replace('<svg ',`<svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" `)}</g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="900" height="900">${photo?this.photoBackground():'<rect width="100" height="100" fill="#eee6d2"/>'}${creative?'':'<g transform="translate(5 10) scale(.9)">'}<ellipse cx="50" cy="85" rx="45" ry="9" fill="#d7d3bd"/><ellipse cx="50" cy="83" rx="44" ry="8" fill="#fffdf5"/>${this.bread(70)}${art}${creative?'':this.bread(Math.max(5,57-items.length*(photo?12:17)))}${creative?'':'</g>'}</svg>`;
 }
};
