'use strict';
const $=id=>document.getElementById(id);
const colors=['#000000','#545454','#a6a6a6','#d9d9d9','#ffffff','#cc0000','#ff3a3a','#ffa51f','#fbbf24','#ffde59','#ff1fa9','#ff99d8','#e1a8f0','#bea1f7','#8c52ff','#2e6417','#4ca626','#1cabb0','#5ca3ff','#004aad'];
const fonts={Palatino:'Palatino, "Palatino Linotype", serif',Nunito:'Nunito, sans-serif',Sacramento:'Sacramento, cursive',Caveat:'Caveat, cursive',Fredoka:'Fredoka, sans-serif','Special Elite':'"Special Elite", monospace'};
const japaneseFonts={Palatino:['Noto Serif JP','noto-serif-jp'],Nunito:['Zen Maru Gothic','zen-maru-gothic'],Sacramento:['Yomogi','yomogi'],Caveat:['Yuji Syuku','yuji-syuku'],Fredoka:['Mochiy Pop One','mochiy-pop-one'],'Special Elite':['Zen Old Mincho','zen-old-mincho']};
for(const [name,[japanese]] of Object.entries(japaneseFonts))fonts[name]=`"${japanese}", `+fonts[name];
const hasJapanese=text=>/[\u3000-\u30ff\u31f0-\u31ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\u{20000}-\u{3134f}]/u.test(text);
const fontLabels={Palatino:'Classic',Nunito:'Simple',Sacramento:'Script',Caveat:'Handwritten',Fredoka:'Playful','Special Elite':'Typewriter'};
const fontFiles={Nunito:[[400,'nunito-400'],[700,'nunito-700']],Caveat:[[500,'caveat-500']],Sacramento:[[400,'sacramento-400']],Fredoka:[[400,'fredoka-400'],[700,'fredoka-700']],'Special Elite':[[400,'special-elite-400']]};
const oldFonts={Georgia:'Palatino',Times:'Palatino',Arial:'Nunito',Trebuchet:'Nunito',Courier:'Special Elite'};
function fontChoices(prefix){return '<div class="options font-options" role="group" aria-label="'+prefix+' font">'+Object.entries(fonts).map(([name,family])=>`<button type="button" data-key="${prefix}Font" data-value="${name}" aria-pressed="${state[prefix+'Font']===name}"><span class="font-style-label">${fontLabels[name]}</span><span class="font-example" style="font-family:${escapeXML(family)}">${name}</span><span class="font-pair-name">${japaneseFonts[name][0]}</span></button>`).join('')+'</div>'}
async function readyCardFonts(){await Promise.all(['heading','subheading'].map(p=>document.fonts.load(fontSpec(state[p+'Size'],state[p+'Font'],state[p+'Bold'],state[p+'Italic']),state[p]||' ')).concat(document.fonts.load(fontSpec(state.messageSize,state.messageFont,state.messageBold,state.messageItalic),state.message+state.to+state.from+state.sender||' ')))}
const borderNames={classic:'Classic',dotted:'Dotted',dashed:'Dashed',thick:'Thick',wavy:'Wavy',none:'No frame'};
const defaults={theme:'christmas',orientation:'portrait',primaryColor:'#496d68',secondaryColor:'#bac5cd',heading:'Merry Christmas',subheading:'& Happy New Year',message:'Wishing you joy and happiness this holiday season!',to:'',from:'',headingFont:'Palatino',subheadingFont:'Nunito',headingBold:true,headingItalic:false,headingUnderline:false,subheadingBold:false,subheadingItalic:false,subheadingUnderline:false,headingSize:40,subheadingSize:24,border:'classic',effect:'none',headingColor:'#fff9ef',subheadingColor:'#fff9ef',accentFinish:'solid',particleColor:'#ffffff',headingFinish:'solid',subheadingFinish:'solid',backgroundPattern:'none',messageFont:'Palatino',messageColor:'#342d39',messageSize:18,messageBold:false,messageItalic:false,messageUnderline:false,messageFinish:'solid',phraseChoice:'custom',sender:'',animation:'none'};
const keys=Object.keys(defaults), limits={heading:60,subheading:80,message:500,to:40,from:40,sender:40}, steps=['Template','Design','Fonts','Message','Effects','Share'];
const version7Keys=keys.slice(0,-1),version6Keys=version7Keys.slice(0,-1),version5Keys=version6Keys.slice(0,-8),version4Keys=version5Keys.slice(0,-1),version3Keys=version4Keys.slice(0,-2),version2Keys=version3Keys.slice(0,-1),legacyKeys=version2Keys.slice(0,-3);
let backShowing=false;
let state={...defaults},step=0,reading=false,saveTimer,generated='',restored=false;
const ctx=document.createElement('canvas').getContext('2d');
const escapeXML=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function upgradeLegacy(input){return {...input,headingColor:input.secondaryColor,subheadingColor:input.secondaryColor,accentFinish:'solid'}}
function upgradeParticles(input){return {...input,particleColor:input.effect==='stars'?(contrastRatio(input.primaryColor,input.secondaryColor)>2?input.secondaryColor:'#98702e'):(contrastRatio(input.primaryColor,'#ffffff')>1.5?'#ffffff':'#7895ac')}}
function validate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid card');
 input={animation:'none',sender:'',messageFont:'Palatino',messageColor:'#342d39',messageSize:18,messageBold:false,messageItalic:false,messageUnderline:false,messageFinish:'solid',phraseChoice:'custom',backgroundPattern:'none',headingFinish:'solid',subheadingFinish:'solid',...input};
 for(const key of ['headingFont','subheadingFont'])if(Object.prototype.hasOwnProperty.call(oldFonts,input[key]))input[key]=oldFonts[input[key]];
 const out={};for(const k of keys){let v=input[k];if(typeof v!==typeof defaults[k])throw Error('Invalid '+k);if(k in limits&&(Array.from(v).length>limits[k]||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)))throw Error('Unsupported text');out[k]=v;}
 if(!Object.prototype.hasOwnProperty.call(themes,out.theme)||!['portrait','landscape'].includes(out.orientation)||!Object.prototype.hasOwnProperty.call(fonts,out.headingFont)||!Object.prototype.hasOwnProperty.call(fonts,out.subheadingFont)||!Object.prototype.hasOwnProperty.call(borderNames,out.border)||!['none','glow','snow','stars','confetti'].includes(out.effect))throw Error('Unknown card option');
 if(['primaryColor','secondaryColor','headingColor','subheadingColor','particleColor','messageColor'].some(k=>!/^#[\da-f]{6}$/i.test(out[k])))throw Error('Invalid color');
 if(!Object.prototype.hasOwnProperty.call(patternNames,out.backgroundPattern))throw Error('Unknown background pattern');
 if(!Object.prototype.hasOwnProperty.call(fonts,out.messageFont)||!Number.isFinite(out.messageSize)||out.messageSize<12||out.messageSize>32)throw Error('Invalid message font');
 if(out.phraseChoice!=='custom'&&(!/^\d+$/.test(out.phraseChoice)||!phrases[out.theme][Number(out.phraseChoice)]))throw Error('Invalid phrase');
 if(['snow','stars'].includes(out.effect)){out.animation=out.effect;out.effect='none'}
 if(!['none','snow','stars','fireworks'].includes(out.animation))throw Error('Unknown animation');
 if(out.effect==='confetti')out.effect='none';
 if(['gold','silver'].includes(out.accentFinish))out.accentFinish='metallic';
 if(['accentFinish','headingFinish','subheadingFinish','messageFinish'].some(k=>!['solid','metallic'].includes(out[k])))throw Error('Invalid accent finish');
 if(!Number.isFinite(out.headingSize)||out.headingSize<24||out.headingSize>64||!Number.isFinite(out.subheadingSize)||out.subheadingSize<14||out.subheadingSize>36)throw Error('Invalid text size');return out;
}
function encodeCard(card){const bytes=new TextEncoder().encode(JSON.stringify([8,...keys.map(k=>card[k])]));let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
function decodeCard(token){if(token.length>8000||!/^[\w-]+$/.test(token))throw Error('Invalid link');const bytes=Uint8Array.from(atob(token.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));const values=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(!Array.isArray(values)||![1,2,3,4,5,6,7,8].includes(values[0]))throw Error('Unsupported card version');const fields=values[0]===1?legacyKeys:values[0]===2?version2Keys:values[0]===3?version3Keys:values[0]===4?version4Keys:values[0]===5?version5Keys:values[0]===6?version6Keys:values[0]===7?version7Keys:keys;if(values.length!==fields.length+1)throw Error('Invalid card');const card=Object.fromEntries(fields.map((k,i)=>[k,values[i+1]]));return validate(values[0]>=3?card:upgradeParticles(values[0]===1?upgradeLegacy(card):card));}
function fontSpec(size,family,bold=false,italic=false){return `${italic?'italic ':''}${bold?'700':'400'} ${size}px ${fonts[family]}`;}
function wrap(text,width,size,family,bold=false,italic=false){
 ctx.font=fontSpec(size,family,bold,italic);
 const lines=[],opening=/[（「『【〈《〔［｛(“‘]$/u,closing=/^[、。，．！？：；）」』】〉》〕］｝ー々ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ！？!?.,:;)]/u;
 for(const paragraph of text.split('\n')){
  // Latin words stay whole; Japanese characters can wrap, with basic kinsoku punctuation rules.
  const raw=paragraph.match(/[\u3000-\u30ff\u31f0-\u31ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\u{20000}-\u{3134f}]|[^\s\u3000-\u30ff\u31f0-\u31ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef\u{20000}-\u{3134f}]+|[ \t]+/gu)||[];
  const tokens=[];
  for(const token of raw){if(tokens.length&&(opening.test(tokens[tokens.length-1])||closing.test(token)))tokens[tokens.length-1]+=token;else tokens.push(token)}
  let line='',space='';
  for(const token of tokens){
   if(/^[ \t]+$/.test(token)){space=line?' ':'';continue}
   const candidate=line+space+token;
   if(line&&ctx.measureText(candidate).width>width){lines.push(line);line=token}else line=candidate;
   space='';
  }
  lines.push(line);
 }
 return lines;
}
function linesFit(lines,width,size,family,bold=false,italic=false){ctx.font=fontSpec(size,family,bold,italic);return lines.every(line=>ctx.measureText(line).width<=width)}
function textBlock(lines,x,y,size,family,color,bold=false,italic=false,underline=false,anchor='middle'){return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${escapeXML(fonts[family])}" font-size="${size}" font-weight="${bold?700:400}" font-style="${italic?'italic':'normal'}" text-decoration="${underline?'underline':'none'}" fill="${color}">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?size*1.3:0}">${escapeXML(line)||'&#160;'}</tspan>`).join('')}</text>`;}
function wavePath(w,h){
 const inset=18,radius=0,amplitude=3,loop=16;
 const edges=[
  [inset+radius,inset,w-inset-radius,inset,w-inset,inset,w-inset,inset+radius],
  [w-inset,inset+radius,w-inset,h-inset-radius,w-inset,h-inset,w-inset-radius,h-inset],
  [w-inset-radius,h-inset,inset+radius,h-inset,inset,h-inset,inset,h-inset-radius],
  [inset,h-inset-radius,inset,inset+radius,inset,inset,inset+radius,inset]
 ];
 let path=`M ${inset+radius} ${inset}`;
 for(const [x1,y1,x2,y2,cx,cy,nextX,nextY] of edges){
  const length=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/length,uy=(y2-y1)/length;
  // A continuous cosine wave has no flat spots between crests and troughs.
  // Whole cycles give both ends the same height and a level corner tangent.
  const cycles=Math.max(2,Math.round(length/28)),segments=cycles*4;
  const frequency=cycles*2*Math.PI/length,step=length/segments;
  const point=(distance,offset)=>`${x1+ux*distance-uy*offset} ${y1+uy*distance+ux*offset}`;
  const offset=x=>amplitude*(Math.cos(frequency*x)-1);
  const slope=x=>-amplitude*frequency*Math.sin(frequency*x);
  for(let i=0;i<segments;i++){
   const start=i*step,end=(i+1)*step;
   path+=` C ${point(start+step/3,offset(start)+slope(start)*step/3)} ${point(end-step/3,offset(end)-slope(end)*step/3)} ${point(end,offset(end))}`;
  }
  // Continue past the corner into a small outward loop, then cross back
  // through the same point, tangent to the next edge (like a ribbon flourish).
  path+=` C ${cx+ux*loop} ${cy+uy*loop} ${cx+uy*loop} ${cy-ux*loop} ${nextX} ${nextY}`;
 }
 return path+' Z';
}
function particleMarkup(effect,w,h,animated,color){
 if(effect==='fireworks'){
  let markup=animated?`<style>@keyframes card-firework{0%,12%{transform:scale(.08);opacity:0}18%{opacity:.7}65%{opacity:.45}85%,100%{transform:scale(1);opacity:0}}@keyframes card-firework-ray{0%,18%{stroke-dashoffset:0}85%,100%{stroke-dashoffset:-12}}.firework-ray{stroke-dasharray:15 40;animation:card-firework-ray 6s ease-out infinite;animation-delay:var(--delay)}.firework-particle{animation:card-firework 6s ease-out infinite;animation-delay:var(--delay)}@media(prefers-reduced-motion:reduce){.firework-particle{animation:none;opacity:.55}.firework-ray{animation:none;stroke-dashoffset:-12}}</style>`:'';
  markup+=`<g fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" pointer-events="none" aria-hidden="true">`;
  for(const [i,x,y] of [[0,w*.24,h*.24],[1,w*.76,h*.36],[2,w*.52,h*.76]]){
   markup+=`<g transform="translate(${x} ${y}) scale(1.3)"><g class="card-particle${animated?' firework-particle':''}" opacity=".55" style="--delay:-${i*2}s">`;
   for(let ray=0;ray<12;ray++){const angle=ray*Math.PI/6;markup+=`<path ${animated?'class="card-particle firework-ray"':''} d="M ${animated?0:Math.cos(angle)*12} ${animated?0:Math.sin(angle)*12} L ${Math.cos(angle)*27} ${Math.sin(angle)*27}"/>`}
   markup+='</g></g>';
  }
  return markup+'</g>';
 }
 const snow=effect==='snow',count=snow?24:14;
 let result=animated?`<style>
 @keyframes card-snow{from{transform:translate(-5px,-${h}px)}to{transform:translate(5px,${h}px)}}
 @keyframes card-twinkle{0%,100%{opacity:.18}50%{opacity:.85}}
 .snow-particle{animation:card-snow var(--duration) linear infinite;animation-delay:var(--delay)}
 .star-particle{animation:card-twinkle var(--duration) ease-in-out infinite;animation-delay:var(--delay)}
 @media(prefers-reduced-motion:reduce){.snow-particle,.star-particle{animation:none}}
 </style>`:'';
 result+='<g aria-hidden="true" fill="'+color+'" pointer-events="none">';
 for(let i=0;i<count;i++){
  const x=24+(i*73+17)%(w-48),y=25+(i*97+31)%(h-50),r=1.3*(snow?1.2+(i%4)*.45:2+(i%3));
  const style=animated?`class="card-particle ${snow?'snow-particle':'star-particle'}" style="--duration:${snow?12+i%7:1.8+(i%5)*.35}s;--delay:-${i*1.37}s"`:'';
  result+=snow?`<circle cx="${x}" cy="${y}" r="${r}" opacity=".65" ${style}/>`:`<path d="M${x} ${y-r} Q${x+.78} ${y-.78} ${x+r} ${y} Q${x+.78} ${y+.78} ${x} ${y+r} Q${x-.78} ${y+.78} ${x-r} ${y} Q${x-.78} ${y-.78} ${x} ${y-r}Z" opacity=".65" ${style}/>`;
 }
 return result+'</g>';
}
const patternNames={none:'No pattern',dots:'Polka Dots',stripes:'Stripes',zigzag:'Zig Zag',hearts:'Hearts',stars:'Stars'};
function backgroundPatternMarkup(s,w,h,idPrefix){
 if(s.backgroundPattern==='none')return '';
 const rgb=s.primaryColor.slice(1).match(/../g).map(v=>parseInt(v,16));
 const target=(rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722)>155?0:255;
 const tint='#'+rgb.map(v=>Math.round(v+(target-v)*.12).toString(16).padStart(2,'0')).join('');
 const motifs={
  dots:'<circle cx="8" cy="8" r="2.4"/><circle cx="24" cy="24" r="2.4"/>',
  stripes:'<path d="M-8 8L8-8M0 32L32 0M24 40L40 24" fill="none" stroke="currentColor" stroke-width="5"/>',
  zigzag:'<path d="M-16 8L0 18 16 8 32 18 48 8M-16 24L0 34 16 24 32 34 48 24M-16-8L0 2 16-8 32 2 48-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  hearts:'<path d="M16 22C13 19 8 16 8 12C8 7 14 7 16 11C18 7 24 7 24 12C24 16 19 19 16 22Z"/>',
  stars:'<path d="M16 6L19 12 26 13 21 18 22 25 16 22 10 25 11 18 6 13 13 12Z"/>'
 };
 const id=idPrefix+'-background-pattern';
 return `<defs><pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse"><g fill="${tint}" color="${tint}">${motifs[s.backgroundPattern]}</g></pattern></defs><rect width="${w}" height="${h}" rx="10" fill="url(#${id})"/>`;
}
function svgCard(side,animated=false,s=state,idPrefix='card'){
 const w=s.orientation==='portrait'?280:400,h=s.orientation==='portrait'?400:280,c=s.accentFinish==='solid'?s.secondaryColor:`url(#${idPrefix}-metal-accent)`;let inside='',description='';
 if(side==='front'){
 inside=`<rect width="${w}" height="${h}" rx="10" fill="${s.primaryColor}"/>`;
 inside+=backgroundPatternMarkup(s,w,h,idPrefix);
 if(s.accentFinish!=='solid'){const stops=metallicStops(s.secondaryColor);inside+=`<defs><linearGradient id="${idPrefix}-metal-accent" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w}" y2="${h}">${stops.map((color,i)=>`<stop offset="${i/(stops.length-1)}" stop-color="${color}"/>`).join('')}</linearGradient></defs>`;}
 for(const part of ['heading','subheading'])if(s[part+'Finish']==='metallic')inside+=`<defs><linearGradient id="${idPrefix}-${part}-metal" x1="0" y1="0" x2="1" y2="1">${metallicStops(s[part+'Color'],true).map((color,i)=>`<stop offset="${i/5}" stop-color="${color}"/>`).join('')}</linearGradient></defs>`;
 if(s.effect==='glow')inside+=`<defs><radialGradient id="${idPrefix}-glow"><stop stop-color="white" stop-opacity=".28"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#${idPrefix}-glow)"/>`;
 if(['snow','stars','fireworks'].includes(s.animation))inside+=particleMarkup(s.animation,w,h,animated,s.particleColor);
 if(s.border==='wavy')inside+=`<path d="${wavePath(w,h)}" fill="none" stroke="${c}" stroke-width="2"/>`;
 else if(s.border!=='none'){inside+=`<rect x="16" y="16" width="${w-32}" height="${h-32}" rx="${s.border==='dotted'?7:0}" fill="none" stroke="${c}" stroke-width="${s.border==='thick'?6:s.border==='dotted'?3.5:2}" ${s.border==='dashed'?'stroke-dasharray="9 7"':s.border==='dotted'?'stroke-dasharray="0 10" stroke-linecap="round"':''}/>`;if(s.border==='classic')inside+=`<rect x="21" y="21" width="${w-42}" height="${h-42}" fill="none" stroke="${c}" stroke-width="1"/>`}
 let scale=1,a,b,hs,ss,total;do{hs=s.headingSize*scale;ss=s.subheadingSize*scale;a=wrap(s.heading,w-72,hs,s.headingFont,s.headingBold,s.headingItalic);b=wrap(s.subheading,w-72,ss,s.subheadingFont,s.subheadingBold,s.subheadingItalic);total=a.length*hs*1.3+(s.subheading?16+b.length*ss*1.3:0);if(total<=h-92&&linesFit(a,w-72,hs,s.headingFont,s.headingBold,s.headingItalic)&&linesFit(b,w-72,ss,s.subheadingFont,s.subheadingBold,s.subheadingItalic))break;scale*=.95}while(scale>.0001);
 let y=(h-total)/2+hs;inside+=textBlock(a,w/2,y,hs,s.headingFont,s.headingFinish==='metallic'?`url(#${idPrefix}-heading-metal)`:s.headingColor,s.headingBold,s.headingItalic,s.headingUnderline);if(s.subheading)inside+=textBlock(b,w/2,y+(a.length-1)*hs*1.3+hs*.3+16+ss,ss,s.subheadingFont,s.subheadingFinish==='metallic'?`url(#${idPrefix}-subheading-metal)`:s.subheadingColor,s.subheadingBold,s.subheadingItalic,s.subheadingUnderline);
 description=[s.heading,s.subheading].filter(Boolean).join('. ');
 }else{
 inside=`<rect width="${w}" height="${h}" rx="10" fill="#fffaf4"/><rect x="16" y="16" width="${w-32}" height="${h-32}" rx="3" fill="none" stroke="#ded5c8"/>`;
 const sections=[s.to.trim(),s.message.replace(/\n{3,}/g,'\n\n').trim(),s.from.trim(),s.sender.trim()];
 let size=s.messageSize,blocks,lineHeight,gap,indent;
 const gapCount=Math.max(0,sections.filter(Boolean).length-1)-(sections[2]&&sections[3]?1:0);
 do{
  indent=size*2;
  blocks=sections.map((text,i)=>text?wrap(text,w-64-(i===2?indent:i===0||i===3?indent/2:0),size,s.messageFont,s.messageBold,s.messageItalic):[]);
  lineHeight=size*1.3;gap=lineHeight;
  const total=blocks.reduce((sum,lines)=>sum+lines.length*lineHeight,0)+gapCount*gap;
  if(total<=h-64&&blocks.every((lines,i)=>linesFit(lines,w-64-(i===2?indent:i===0||i===3?indent/2:0),size,s.messageFont,s.messageBold,s.messageItalic)))break;
  size*=.95;
 }while(size>.0001);

 if(s.messageFinish==='metallic')inside+=`<defs><linearGradient id="${idPrefix}-message-metal" x1="0" y1="0" x2="1" y2="1">${metallicStops(s.messageColor,true).map((color,i)=>`<stop offset="${i/5}" stop-color="${color}"/>`).join('')}</linearGradient></defs>`;
 const fill=s.messageFinish==='metallic'?`url(#${idPrefix}-message-metal)`:s.messageColor;
 const draw=(lines,x,top,anchor)=>lines.length?textBlock(lines,x,top+size,size,s.messageFont,fill,s.messageBold,s.messageItalic,s.messageUnderline,anchor):'';
 const [opening,message,closing,sender]=blocks;
 const totalHeight=blocks.reduce((sum,lines)=>sum+lines.length*lineHeight,0)+gapCount*gap;
 let top=(h-totalHeight)/2;
 for(const [lines,x,anchor] of [[opening,32+indent/2,'start'],[message,w/2,'middle'],[closing,w-32-indent,'end'],[sender,w-32-indent/2,'end']]){
  if(!lines.length)continue;
  inside+=draw(lines,x,top,anchor);
  top+=lines.length*lineHeight+(lines===closing&&sender.length?0:gap);
 }
 description=sections.filter(Boolean).join('\n\n');
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${escapeXML(description||'Blank postcard')}"><title>${escapeXML(description||'Blank postcard')}</title>${inside}</svg>`;
}
function preview(){
 document.querySelectorAll('[data-orientation]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.orientation===state.orientation));
 if(!document.querySelector('.flip-card'))setupFlipCard();
 const button=document.querySelector('.flip-card');
 button.classList.toggle('portrait',state.orientation==='portrait');
 button.classList.toggle('landscape',state.orientation==='landscape');
 $('front').innerHTML=svgCard('front',true);$('back').innerHTML=svgCard('back');
 $('pause-effects').hidden=state.animation==='none';
 updateVisibleFace();
}

function status(text){$('notice').textContent=text}
function save(){if(reading)return;clearTimeout(saveTimer);saveTimer=setTimeout(()=>{try{localStorage.setItem('little-postcard-draft-v1',JSON.stringify(state));$('save-status').textContent='Draft saved on this device'}catch{$('save-status').textContent='Draft saving unavailable'}},250)}
function changed(){generated='';preview();save();if(step===5)renderControls();}
function occasionTemplate(theme,orientation='portrait'){
 const colors=themeColorDefaults[theme];
 return {...defaults,...phrases[theme][0],...themeStyleDefaults[theme],theme,orientation,phraseChoice:'0',
  primaryColor:colors.primary,secondaryColor:colors.secondary,headingColor:colors.text||colors.secondary,subheadingColor:colors.text||colors.secondary};
}
function applyOccasion(theme){
 const previous=occasionTemplate(state.theme,state.orientation),next=occasionTemplate(theme,state.orientation);
 const customFront=state.phraseChoice==='custom'&&(state.heading!==previous.heading||state.subheading!==previous.subheading);
 const customMessage=state.message!==previous.message;
 state={...next,to:state.to,from:state.from,sender:state.sender,
  ...Object.fromEntries(messageResetKeys.filter(key=>key.startsWith('message')&&key!=='message').map(key=>[key,state[key]])),
  ...(customFront?{heading:state.heading,subheading:state.subheading,phraseChoice:'custom'}:{}),
  ...(customMessage?{message:state.message}:{})};
 messageResetUndo=null;
}
let messageResetUndo=null;
const messageResetKeys=['to','message','from','sender','messageFont','messageColor','messageSize','messageBold','messageItalic','messageUnderline','messageFinish'];
function resetMessageToTemplate(){
 messageResetUndo=Object.fromEntries(messageResetKeys.map(key=>[key,state[key]]));
 const template=occasionTemplate(state.theme,state.orientation);
 for(const key of messageResetKeys)state[key]=template[key];
}
function occasionChoices(){
 return '<div class="options occasion-options">'+Object.entries(themes).map(([theme,label])=>`<button type="button" data-key="theme" data-value="${theme}" aria-pressed="${state.theme===theme}"><span class="occasion-mini" aria-hidden="true">${svgCard('front',false,occasionTemplate(theme),'occasion-'+theme)}</span><span class="occasion-label">${escapeXML(label)}</span></button>`).join('')+'</div>';
}
function choices(items,key){return `<div class="options">${Object.entries(items).map(([v,label])=>`<button type="button" data-key="${key}" data-value="${v}" aria-pressed="${state[key]===v}">${escapeXML(label)}</button>`).join('')}</div>`}
function field(key,label,tag='input'){return `<label for="${key}">${label}</label><${tag} id="${key}" data-field="${key}" maxlength="${limits[key]}" ${tag==='input'?`value="${escapeXML(state[key])}"`:''}>${tag==='textarea'?escapeXML(state[key])+'</textarea>':''}`}
function metallicStops(color,gentle=false){
 const rgb=color.slice(1).match(/../g).map(v=>parseInt(v,16));
 const mix=(target,amount)=>'#'+rgb.map(v=>Math.round(v+(target-v)*amount).toString(16).padStart(2,'0')).join('');
 if(gentle)return [mix(0,.12),mix(255,.10),mix(255,.32),mix(0,.08),mix(255,.18),mix(0,.12)];
 return [mix(0,.48),mix(255,.22),mix(255,.76),mix(0,.2),mix(255,.48),mix(0,.48)];
}
function metallicSwatch(color,gentle=false){return 'linear-gradient(135deg,'+metallicStops(color,gentle).join(',')+')'}
const finishKeys={secondaryColor:'accentFinish',headingColor:'headingFinish',subheadingColor:'subheadingFinish',messageColor:'messageFinish'};
function colorButton(key,label){
 const metallic=finishKeys[key]&&state[finishKeys[key]]==='metallic';
 const color=metallic?metallicSwatch(state[key],key!=='secondaryColor'):state[key];
 const value=(metallic?'Metallic · ':'')+state[key].toUpperCase();
 return `<button type="button" class="text-color-button" data-text-color="${key}" aria-label="${label}" aria-haspopup="dialog"><span class="color-chip" style="background:${color}" aria-hidden="true"></span><span>${value}</span></button>`;
}
function fontSettings(prefix,label){
 return `<h3>${label}</h3>${fontChoices(prefix)}<div class="font-color-row"><span>Color</span>${colorButton(prefix+'Color',label+' color')}</div><div class="style-row">${['Bold','Italic','Underline'].map(style=>`<button type="button" data-toggle="${prefix+style}" aria-pressed="${state[prefix+style]}">${style}</button>`).join('')}</div><label for="${prefix}Size">Size · <span id="${prefix}SizeValue">${state[prefix+'Size']}</span>px</label><input id="${prefix}Size" data-field="${prefix}Size" type="range" min="${prefix==='heading'?24:prefix==='message'?12:14}" max="${prefix==='heading'?64:prefix==='message'?32:36}" value="${state[prefix+'Size']}">`;
}
const shareIcons={
 download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
 save:'<path d="M4 3h13l4 4v14H3V4a1 1 0 0 1 1-1Z"/><path d="M7 3v6h9V3M7 21v-8h10v8"/>',
 load:'<path d="M3 19V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v2M3 19l3-8h16l-3 9H4a1 1 0 0 1-1-1Z"/>',
 copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5Q16 3 14 3H5Q3 3 3 5V14Q3 16 5 16H8"/>',
 qr:'<path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h3v3h3v3h-6zM12 3v3M12 10v3h-3M3 12h3M15 12h6M12 18v3"/>',
 email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 preview:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>'
};
function shareIconAction(icon,label,attributes,tag='button'){
 return `<${tag} class="${tag==='a'?'button ':''}share-icon-action" ${attributes} aria-label="${label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shareIcons[icon]}</svg><span class="share-action-label" aria-hidden="true">${label}</span></${tag}>`;
}
function copyIconAction(icon,label,description,attributes){
 return `<button type="button" class="copy-icon-action" ${attributes} aria-label="${description}" title="${description}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shareIcons[icon]}</svg><span>${label}</span></button>`;
}
function compactHelp(){
 const controls=$('controls');
 for(const hint of [...controls.querySelectorAll('p.hint')]){
  if(hint.id==='contrast'||hint.textContent.startsWith('Anyone with the link'))continue;
  const text=hint.textContent;
  let target=text.startsWith('For example: Dear')?'label[for="to"]':text.startsWith('For example: Sincerely')?'label[for="from"]':text.startsWith('For example: Corinne')?'label[for="sender"]':text.startsWith('Line breaks')?'label[for="message"]':text.startsWith('Applies to')?'h3':text.startsWith('An editable card')?'h3':text.startsWith('Email opens')?'label[for="share-url"]':text.startsWith('Choose one effect')||text.startsWith('Animations appear')?'.design-frame-heading h3':'h1';
  const anchor=controls.querySelector(target);if(!anchor)continue;
  let row=anchor.parentElement;
  if(anchor.tagName==='LABEL'&&!row.classList.contains('help-label-row')){row=document.createElement('div');row.className='help-label-row';anchor.before(row);row.append(anchor)}
  else if(anchor.tagName!=='LABEL')row=anchor;
  let button=row.querySelector('[data-help]');
  if(!button){button=document.createElement('button');button.type='button';button.className='info-button';button.textContent='i';button.setAttribute('aria-label','Help: '+anchor.textContent);button.setAttribute('aria-expanded','false');row.append(button)}
  button.dataset.help=(button.dataset.help?button.dataset.help+' ':'')+text;
  hint.remove();
 }
}
const openSections=new Map();
function collapseSections(){
 if(![1,2,3,4,5].includes(step))return;
 const controls=$('controls'),groups=[];
 if(step===1||step===4){
  for(const section of [...controls.querySelectorAll(':scope > section')]){
   const heading=section.querySelector('h3');
   groups.push({title:heading.textContent.replace(/i$/,'').trim(),heading,nodes:[section]});
  }
 }else{
  const nodes=[...controls.children].filter(node=>node.tagName!=='H1'&&!node.classList.contains('message-reset'));
  let group={title:step===2?'Text':step===3?'Message':'Share link',nodes:[]};groups.push(group);
  for(const node of nodes){if(node.tagName==='H3'){group={title:node.childNodes[0].textContent.trim(),heading:node,nodes:[]};groups.push(group)}group.nodes.push(node)}
 }
 const saved=openSections.get(step),tabStep=step;
 groups.forEach((group,index)=>{
  const details=document.createElement('details');details.className='control-section';
  const summary=document.createElement('summary');summary.textContent=group.title;
  if(tabStep===5&&index===0){
   const hint=group.nodes.find(node=>node.matches('p.hint')&&node.textContent.startsWith('Anyone with the link'));
   if(hint){const info=document.createElement('button');info.type='button';info.className='info-button';info.textContent='i';info.dataset.help=hint.textContent;info.setAttribute('aria-label','Help: Share link');info.setAttribute('aria-expanded','false');summary.append(info);group.nodes=group.nodes.filter(node=>node!==hint);hint.remove();}
  }
  details.append(summary);details.open=saved===undefined?index===0:saved===group.title;
  const body=document.createElement('div');body.className='control-section-body';details.append(body);
  const first=group.nodes[0];if(!first)return;first.before(details);
  if(group.heading){for(const button of [...group.heading.querySelectorAll('[data-help]')])summary.append(button);group.heading.remove()}
  for(const node of group.nodes)if(node!==group.heading)body.append(node);
  details.addEventListener('toggle',()=>{
   if(!details.isConnected)return;
   if(details.open){openSections.set(tabStep,group.title);for(const other of controls.querySelectorAll(':scope > details'))if(other!==details)other.open=false;}
   else if(![...controls.querySelectorAll(':scope > details')].some(d=>d.open))openSections.set(tabStep,null);
   hideHelp();
  });
 });
}
function renderControls(){
 let html='';if(step===0){html='<h1>Choose a template</h1>'+occasionChoices()+'<p class="hint">Choose a template to apply its colors, fonts, and design settings. Your custom wording is kept; unchanged sample text follows the new template.</p>';}
 if(step===1){html='<h1>Design your card</h1><section class="design-section"><div class="design-frame-heading"><h3>Background</h3>'+colorButton('primaryColor','Background color')+'</div>'+choices(patternNames,'backgroundPattern')+'</section><section class="design-section"><div class="design-frame-heading"><h3>Frame</h3>'+colorButton('secondaryColor','Frame color')+'</div>'+choices(borderNames,'border')+'</section><p class="hint" id="contrast"></p>';}
 if(step===3){html='<h1>Make it personal</h1>'+field('to','Opening (optional)')+'<p class="hint">For example: Dear Sam,</p>'+field('message','Your message · up to 500 characters','textarea')+field('from','Closing (optional)')+'<p class="hint">For example: Sincerely,</p>'+field('sender','Sender (optional)')+'<p class="hint">For example: Corinne</p>'+'<p class="hint">Line breaks are preserved. Long text gets smaller to stay inside the card.</p>'+fontSettings('message','Message styling')+'<p class="hint">Applies to the opening, message, closing, and sender.</p><div class="message-reset"><button type="button" data-action="reset-message" aria-label="Reset defaults: reset message and styling to template defaults" title="Reset message and styling to template defaults"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 10A8 8 0 1 1 4.5 16M4 4V10H10"/></svg><span>Reset defaults</span></button>'+(messageResetUndo?'<button type="button" data-action="undo-message-reset">Undo reset</button>':'')+'</div>';}
 if(step===2){html='<h1>Style your words</h1><label for="phrase">Start with a phrase</label><select id="phrase"><option value="custom" '+(state.phraseChoice==='custom'?'selected':'')+'>Keep my own phrase</option>'+phrases[state.theme].map((p,i)=>`<option value="${i}" ${state.phraseChoice===String(i)?'selected':''}>${escapeXML(p.heading+' · '+p.subheading)}</option>`).join('')+'</select>'+(state.phraseChoice==='custom'?field('heading','Heading text','textarea')+field('subheading','Subheading text','textarea'):'')+fontSettings('heading','Heading')+fontSettings('subheading','Subheading')+'<p class="hint">Size is reduced when needed to fit. Japanese lettering automatically uses the paired font.</p>';}
 if(step===4)html='<h1>A finishing touch</h1><section class="design-section"><h3>Still effects</h3>'+choices({none:'Keep it simple',glow:'Soft glow'},'effect')+'</section><section class="design-section"><div class="design-frame-heading"><h3>Animated effects</h3>'+colorButton('particleColor','Particle color')+'</div>'+choices({none:'No Animations',snow:'Falling Snow',stars:'Twinkling Stars',fireworks:'Fireworks'},'animation')+'<p class="hint">Choose one effect from each section. Particle color applies to snow, stars, and fireworks.</p><p class="hint">Animations appear on the front and in shared links. PNG downloads and reduced-motion settings show a still version.</p></section>';
 if(step===5)html='<h1>Ready to send?</h1><div id="share-result" hidden><label for="share-url">Your card link</label><textarea id="share-url" readonly rows="3"></textarea><div class="share-actions">'+shareIconAction('copy','Copy link','type="button" data-action="copy"')+shareIconAction('qr','Create QR code','type="button" data-action="qr" aria-haspopup="dialog"')+shareIconAction('email','Open email draft','id="email-link"','a')+shareIconAction('preview','Open recipient view','id="view-link" target="_blank" rel="noopener noreferrer"','a')+'</div><p class="hint">Email opens your email app; you choose the recipient and send it. You can also copy the link into webmail or a message.</p></div><p class="hint">Anyone with the link can read the card. The link contains the message and cannot be recalled. Later edits create a different link.</p><h3>Keep a copy</h3><div class="copy-actions">'+copyIconAction('download','Front PNG','Download front PNG','data-download="front"')+copyIconAction('download','Back PNG','Download back PNG','data-download="back"')+copyIconAction('save','Save','Save editable card','data-action="export"')+copyIconAction('load','Load','Load editable card','data-action="import"')+'</div><input type="file" id="load-file" accept=".json,application/json" hidden><p class="hint">An editable card is a backup you can reopen here. Drafts also save in this browser when storage is available.</p>';
 hideHelp();$('controls').innerHTML=html;compactHelp();collapseSections();if(step===5)updateShareLink();if(step===1)contrast();if(step===5&&['localhost','127.0.0.1'].includes(location.hostname)){const note=document.createElement('p');note.className='hint';note.textContent='Local preview: these links only work on this computer. Publish the app before sending cards to other people.';$('controls').querySelector('h1').after(note);}
}
function render(){
 $('steps').innerHTML='<ol class="progress-steps">'+steps.map((label,i)=>`<li class="${i<=step?'reached':''}"><button type="button" data-step="${i}" ${i===step?'aria-current="step"':''} aria-label="Step ${i+1}: ${label}">${i+1}</button><span class="step-hover-label" aria-hidden="true">${label}</span></li>`).join('')+'</ol>';
 $('active-step-label').textContent=steps[step];
 $('active-step-label').style.marginLeft=`${step*100/steps.length}%`;
 renderControls();
 $('step-count').textContent=`${step+1} of ${steps.length}`;
 $('previous').disabled=step===0;$('next').disabled=step===steps.length-1;
}
function contrastRatio(background,foreground){const lum=c=>{const rgb=c.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722},a=lum(background),b=lum(foreground);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}
function contrast(){const low=['headingColor','subheadingColor'].some(k=>contrastRatio(state.primaryColor,state[k])<4.5);$('contrast').textContent=low?'Some text has low contrast with the background. Adjust its color in Fonts for easier reading.':'Your text and background have clear contrast.';}
const textColorPresets={'Ink':'#344854','White':'#ffffff','Ivory':'#fff9ef','Pewter':'#68757b','Silver':'#bac5cd','Gold':'#c49a45','Smokey Blue':'#8299ad','Rose':'#b9828c'};
const accentColorPresets={...textColorPresets};
delete accentColorPresets.White;
accentColorPresets.Lilac='#b5a3c7';
const backgroundPresets={'Ivory':'#fff9ef','White':'#ffffff','Forest':'#496d68','Dusty Blue':'#a7bdcf','Slate':'#4a535f','Sage':'#c0cabc','Blush':'#e4cbd0','Lavender':'#c9c3d6'};
let colorTarget='',pendingColor='',pendingFinish='solid';
function updateColorDialog(value){
 pendingColor=value.toLowerCase();
 const valid=/^#[\da-f]{6}$/i.test(pendingColor);
 const accent=colorTarget==='secondaryColor',background=colorTarget==='primaryColor';
 $('apply-text-color').disabled=!valid;
 const sample=$('color-sample');
 const sampleText=document.createElement('span');sampleText.textContent=sample.textContent;sample.replaceChildren(sampleText);
 if(['headingColor','subheadingColor','messageColor'].includes(colorTarget)&&pendingFinish==='metallic'){sampleText.style.backgroundImage=metallicSwatch(valid?pendingColor:state[colorTarget],true);sampleText.style.backgroundClip='text';sampleText.style.webkitBackgroundClip='text';sampleText.style.color='transparent'}
 sample.style.background=colorTarget==='messageColor'?'#fffaf4':background&&valid?pendingColor:state.primaryColor;
 sample.style.color=background||accent?state.headingColor:(valid?pendingColor:state[colorTarget]);
 sample.style.border=accent?'4px solid '+(valid?pendingColor:state.secondaryColor):'none';
 sample.style.borderImage=accent&&pendingFinish!=='solid'?metallicSwatch(valid?pendingColor:state.secondaryColor)+' 1':'none';
 let feedback='Enter a six-digit color, such as #806127.';
 if(valid){
  $('text-color-custom').value=pendingColor;
  if(accent)feedback=pendingFinish==='solid'?'Solid color for your frame.':'Metallic finish in your chosen frame color.';
  else if(colorTarget==='particleColor')feedback=contrastRatio(state.primaryColor,pendingColor)<1.5?'Particles may blend into this background.':'Color for your snow, stars, and fireworks.';
  else {const low=background?['headingColor','subheadingColor'].some(k=>contrastRatio(pendingColor,state[k])<4.5):contrastRatio(colorTarget==='messageColor'?'#fffaf4':state.primaryColor,pendingColor)<4.5;feedback=low?'Some text may be hard to read with this color.':'Good contrast with your card text and background.';}
 }
 $('color-feedback').textContent=feedback;
 document.querySelectorAll('[data-color-preset]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.colorPreset===pendingColor));
 $('metallic-finish').checked=pendingFinish==='metallic';
}
function openTextColor(key){
 colorTarget=key;pendingFinish=finishKeys[key]?state[finishKeys[key]]:'solid';
 const labels={primaryColor:'Background color',secondaryColor:'Frame color',headingColor:'Heading color',subheadingColor:'Subheading color',messageColor:'Message color',particleColor:'Particle color'};
 $('text-color-title').textContent=labels[key];
 $('text-color-help').textContent=finishKeys[key]?'Choose any color, then turn on Metallic for a soft sheen.':'Choose a preset or pick your own color.';
 const presets=key==='primaryColor'?backgroundPresets:['secondaryColor','headingColor','subheadingColor','messageColor'].includes(key)?accentColorPresets:textColorPresets;
 $('text-color-presets').innerHTML=Object.entries(presets).map(([name,value])=>`<button type="button" class="preset-color" data-color-preset="${value}" aria-label="${name}" aria-pressed="false"><span class="color-chip" style="background:${value}" aria-hidden="true"></span>${name}</button>`).join('');
 $('color-finishes').hidden=!finishKeys[key];
 $('color-sample').textContent=key==='particleColor'?'✦  ·  ✦  ·  ✦':state[key==='messageColor'?'message':key==='subheadingColor'?'subheading':'heading']||'Your words';
 $('text-color-hex').value=state[key];
 updateColorDialog(state[key]);
 $('text-color-dialog').showModal();
}
function setStep(n){step=n;if(n===5)openSections.set(5,'Share link');if(n>=0&&n<=4){backShowing=n===3;updateVisibleFace();}render();$('controls').querySelector('h1').setAttribute('tabindex','-1');$('controls').querySelector('h1').focus({preventScroll:true});}
function updateButtons(){document.querySelectorAll('[data-key]').forEach(b=>b.setAttribute('aria-pressed',state[b.dataset.key]===b.dataset.value));document.querySelectorAll('[data-toggle]').forEach(b=>b.setAttribute('aria-pressed',state[b.dataset.toggle]));}
function link(){return location.href.split(/[?#]/)[0]+'#card='+encodeCard(validate(state));}
function updateShareLink(){generated='';try{generated=link()}catch{status('Please shorten your text or remove unsupported characters before sharing.');return;}$('share-result').hidden=false;$('share-url').value=generated;$('view-link').href=generated;$('email-link').href='mailto:?subject='+encodeURIComponent('A little note for you')+'&body='+encodeURIComponent('I made you a postcard:\n\n'+generated);}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);}
// Rasterize artwork separately; canvas draws text using the page's loaded fonts.
// This avoids fetching font files, which Chrome blocks when opened through file://.
function paintExportText(context, node, svg){
 const size=Number(node.getAttribute('font-size'));
 context.font=`${node.getAttribute('font-style')} ${node.getAttribute('font-weight')} ${size}px ${node.getAttribute('font-family')}`;
 const anchor=node.getAttribute('text-anchor');
 context.textAlign=anchor==='middle'?'center':anchor==='end'?'right':'left';
 context.textBaseline='alphabetic';
 let y=Number(node.getAttribute('y'));
 const lines=[...node.querySelectorAll('tspan')].map(span=>{
  y+=Number(span.getAttribute('dy')||0);
  const text=span.textContent,x=Number(span.getAttribute('x')),metrics=context.measureText(text);
  const left=x-(anchor==='middle'?metrics.width/2:anchor==='end'?metrics.width:0);
  return {text,x,y,metrics,left};
 });
 const fill=node.getAttribute('fill'),match=/^url\(#(.+)\)$/.exec(fill);
 context.fillStyle=fill;
 if(match&&lines.length){
  const definition=svg.getElementById(match[1]);
  const left=Math.min(...lines.map(l=>l.x-l.metrics.actualBoundingBoxLeft));
  const right=Math.max(...lines.map(l=>l.x+l.metrics.actualBoundingBoxRight));
  const top=Math.min(...lines.map(l=>l.y-l.metrics.actualBoundingBoxAscent));
  const bottom=Math.max(...lines.map(l=>l.y+l.metrics.actualBoundingBoxDescent));
  const gradient=context.createLinearGradient(left,top,Math.max(left+1,right),Math.max(top+1,bottom));
  for(const stop of definition.querySelectorAll('stop'))gradient.addColorStop(Number(stop.getAttribute('offset')),stop.getAttribute('stop-color'));
  context.fillStyle=gradient;
 }
 for(const line of lines){
  context.fillText(line.text,line.x,line.y);
  if(node.getAttribute('text-decoration')==='underline')context.fillRect(line.left,line.y+size*.1,line.metrics.width,Math.max(1,size*.055));
 }
}
async function downloadPNG(side){
 const card={...state};
 status('Preparing your '+side+' image…');
 try{
  await readyCardFonts();
  const svg=new DOMParser().parseFromString(svgCard(side,false,card),'image/svg+xml');
  if(svg.querySelector('parsererror'))throw Error('The card artwork could not be read.');
  const text=[...svg.querySelectorAll('text')];text.forEach(node=>node.remove());
  const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml;charset=utf-8'}));
  try{
   const img=new Image();
   await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('The card artwork could not be rendered.'));img.src=url});
   const canvas=document.createElement('canvas');
   canvas.width=(card.orientation==='portrait'?280:400)*3;
   canvas.height=(card.orientation==='portrait'?400:280)*3;
   const context=canvas.getContext('2d');
   context.drawImage(img,0,0,canvas.width,canvas.height);
   context.scale(3,3);text.forEach(node=>paintExportText(context,node,svg));
   const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(Error('The PNG could not be created.')),'image/png'));
   download(blob,'postcard-'+side+'.png');status('Your '+side+' image is ready.');
  }finally{URL.revokeObjectURL(url)}
 }catch(error){console.error('PNG export failed:',error);status('Could not create the image: '+(error.message||'An unexpected error occurred.')+' Please try again.');}
}
let helpButton=null,helpPinned=false;
const helpPopup=document.createElement('div');helpPopup.id='field-help';helpPopup.className='help-tooltip';helpPopup.setAttribute('role','tooltip');helpPopup.hidden=true;document.body.append(helpPopup);
function hideHelp(){if(helpButton){helpButton.setAttribute('aria-expanded','false');helpButton.removeAttribute('aria-describedby')}helpPopup.hidden=true;helpButton=null;helpPinned=false}
function showHelp(button,pinned=false){
 hideHelp();helpButton=button;helpPinned=pinned;helpPopup.textContent=button.dataset.help;helpPopup.hidden=false;
 button.setAttribute('aria-expanded','true');button.setAttribute('aria-describedby','field-help');
 const r=button.getBoundingClientRect(),box=helpPopup.getBoundingClientRect();
 helpPopup.style.left=Math.max(12,Math.min(r.left,window.innerWidth-box.width-12))+'px';
 helpPopup.style.top=Math.max(12,r.bottom+8+box.height>window.innerHeight-12?r.top-box.height-8:r.bottom+8)+'px';
}
document.addEventListener('pointerover',e=>{const b=e.target.closest('[data-help]');if(b&&e.pointerType!=='touch'&&!helpPinned)showHelp(b)});
document.addEventListener('pointerout',e=>{if(!helpPinned&&!helpButton?.contains(e.relatedTarget)&&!helpPopup.contains(e.relatedTarget)&& (e.target.closest('[data-help]')||helpPopup.contains(e.target)))hideHelp()});
document.addEventListener('focusin',e=>{const b=e.target.closest('[data-help]');if(b)showHelp(b);else hideHelp()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-help]');if(b){e.preventDefault();const close=helpButton===b&&helpPinned;if(close)hideHelp();else showHelp(b,true)}else if(!helpPopup.contains(e.target))hideHelp()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideHelp()});
window.addEventListener('resize',hideHelp);window.addEventListener('scroll',hideHelp,true);
$('preview-orientation').addEventListener('click',e=>{
 const button=e.target.closest('[data-orientation]');
 if(!button||reading)return;
 state.orientation=button.dataset.orientation;
 changed();
});
$('text-color-dialog').addEventListener('click',e=>{
 const preset=e.target.closest('[data-color-preset]');

 if(preset){$('text-color-hex').value=preset.dataset.colorPreset;updateColorDialog(preset.dataset.colorPreset)}
});
$('metallic-finish').addEventListener('change',e=>{pendingFinish=e.target.checked?'metallic':'solid';updateColorDialog(pendingColor)});
$('text-color-custom').addEventListener('input',e=>{$('text-color-hex').value=e.target.value;updateColorDialog(e.target.value)});
$('text-color-hex').addEventListener('input',e=>{updateColorDialog(e.target.value.trim())});
$('cancel-text-color').addEventListener('click',()=>$('text-color-dialog').close());
$('apply-text-color').addEventListener('click',()=>{
 if(!/^#[\da-f]{6}$/i.test(pendingColor))return;
 state[colorTarget]=pendingColor;
 if(finishKeys[colorTarget])state[finishKeys[colorTarget]]=pendingFinish;
 const trigger=document.querySelector(`[data-text-color="${colorTarget}"]`);
 const metallic=finishKeys[colorTarget]&&pendingFinish==='metallic';
 trigger.querySelector('.color-chip').style.background=metallic?metallicSwatch(pendingColor,colorTarget!=='secondaryColor'):pendingColor;
 trigger.lastElementChild.textContent=(metallic?'Metallic · ':'')+pendingColor.toUpperCase();
 changed();if(step===1)contrast();$('text-color-dialog').close();
});
$('steps').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b)setStep(Number(b.dataset.step))});$('previous').onclick=()=>setStep(Math.max(0,step-1));$('next').onclick=()=>setStep(Math.min(steps.length-1,step+1));
$('controls').addEventListener('click',async e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.key){if(b.dataset.key==='theme')applyOccasion(b.dataset.value);else state[b.dataset.key]=b.dataset.value;if(b.dataset.key==='secondaryColor')state.accentFinish='solid';updateButtons();changed();if(step===1){if($(b.dataset.key))$(b.dataset.key).value=state[b.dataset.key];contrast()}}
 if(b.dataset.textColor)openTextColor(b.dataset.textColor);
 if(b.dataset.toggle){state[b.dataset.toggle]=!state[b.dataset.toggle];updateButtons();changed()}
 if(b.dataset.download)await downloadPNG(b.dataset.download);
 const action=b.dataset.action;
 if(action==='reset-message'){resetMessageToTemplate();changed();renderControls();status('Message and its styling reset. Opening, closing, and sender cleared. You can undo this reset.')}
 if(action==='undo-message-reset'&&messageResetUndo){Object.assign(state,messageResetUndo);messageResetUndo=null;changed();renderControls();status('Your message and styling have been restored.')}
 if(action==='qr'){try{showPostQR(generated);}catch(error){status(error.message||'The QR code could not be created. Please try again.');}}
 if(action==='copy'){try{if(!navigator.clipboard?.writeText)throw Error();await navigator.clipboard.writeText(generated);status('Card link copied.')}catch{$('share-url').focus();$('share-url').select();status('Select and copy the highlighted link using your browser’s Copy command.')}}
 if(action==='export'){download(new Blob([JSON.stringify({version:8,card:state},null,2)],{type:'application/json'}),'my-postcard.json');status('Editable card saved.')}
 if(action==='import')$('load-file').click();
});
$('controls').addEventListener('input',e=>{const key=e.target.dataset.field;if(!key)return;let value=e.target.value;if(key.endsWith('Size'))value=Number(value);state[key]=value;if(key==='secondaryColor')state.accentFinish='solid';if($(key+'Value'))$(key+'Value').textContent=value;changed();if(step===1){updateButtons();contrast()}});
$('controls').addEventListener('change',async e=>{
 if(e.target.id==='phrase'){state.phraseChoice=e.target.value;if(state.phraseChoice!=='custom')Object.assign(state,phrases[state.theme][Number(state.phraseChoice)]);backShowing=false;changed();renderControls();$('phrase').focus()}
 if(e.target.id==='load-file'){const file=e.target.files[0];if(!file)return;try{if(file.size>20000)throw Error();const data=JSON.parse(await file.text());if(![1,2,3,4,5,6,7,8].includes(data.version))throw Error();const card=validate(data.version>=3?data.card:upgradeParticles(data.version===1?upgradeLegacy(data.card):data.card));state=card;changed();render();status('Editable card loaded.')}catch{status('This file is not a supported postcard. Your current card has been kept.')}}
});
function updateVisibleFace(){
 const button=document.querySelector('.flip-card');
 if(!button)return;
 button.classList.toggle('is-flipped',backShowing);
 const content=backShowing?[state.to,state.message,state.from,state.sender]:[state.heading,state.subheading];
 button.setAttribute('aria-label',(backShowing?'Back: ':'Front: ')+content.filter(Boolean).join('. ')+(backShowing?'. Flip to front.':'. Flip to read the message.'));
 $('preview-title').textContent=reading?'A little note for you':'Your design';
 $('preview-face-label').textContent=backShowing?'BACK':'FRONT';
 $('flip-hint').textContent=backShowing?'Click or tap to see the front.':'Click or tap to read the message.';
}
function setupFlipCard(){
 const cards=document.querySelector('.cards');
 const button=document.createElement('button');
 button.type='button';button.className='flip-card';
 button.setAttribute('aria-describedby','flip-hint');
 const inner=document.createElement('span');inner.className='flip-inner';
 for(const side of ['front','back']){
  const face=document.createElement('span');face.id=side;
  face.className='flip-face flip-'+side+' card-holder';
  face.setAttribute('aria-hidden','true');inner.appendChild(face);
 }
 button.appendChild(inner);
 const hint=document.createElement('p');hint.id='flip-hint';hint.className='hint flip-hint';
 button.addEventListener('click',()=>{backShowing=!backShowing;updateVisibleFace()});
 cards.replaceChildren(button);cards.after(hint);
 const pause=document.createElement('button');pause.type='button';pause.id='pause-effects';pause.className='pause-effects';const updatePause=paused=>{pause.innerHTML=`<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">${paused?'<path d="M4 2L13 8 4 14Z"/>':'<path d="M3 2H6V14H3ZM10 2H13V14H10Z"/>'}</svg><span>${paused?'Resume animation':'Pause animation'}</span>`;pause.setAttribute('aria-pressed',String(paused))};updatePause(document.body.classList.contains('effects-paused'));
 pause.addEventListener('click',()=>{const paused=document.body.classList.toggle('effects-paused');updatePause(paused)});
 hint.after(pause);
}
function setupEnvelope(){
 const cards=document.querySelector('.cards'),card=cards.querySelector('.flip-card');
 document.body.classList.add('envelope-closed');
 card.disabled=true;card.setAttribute('aria-hidden','true');
 const envelope=document.createElement('button');envelope.type='button';envelope.className='envelope '+state.orientation;envelope.setAttribute('aria-label','Open your little note');
 envelope.innerHTML=`<span class="envelope-paper" aria-hidden="true"><svg class="envelope-folds" viewBox="0 0 400 280" preserveAspectRatio="none"><path d="M0 0L200 140L0 280ZM400 0L200 140L400 280Z" fill="#ead6c4"/><path d="M0 280L200 123.2L400 280Z" fill="#f3e2d2"/></svg><span class="envelope-flap"></span><svg class="envelope-seal" viewBox="19 21 26 24"><path d="M32 42C29 39.2 25.5 36 22.5 33C19.5 30 19.5 26 22 23.5C24.5 21 29 21 32 24.5C35 21 39.5 21 42 23.5C44.5 26 44.5 30 41.5 33C38.5 36 35 39.2 32 42Z" fill="#963f4c" stroke="#f6e6d7" stroke-width="2" stroke-linejoin="round"/></svg></span><span class="envelope-prompt">Tap to open</span>`;
 cards.append(envelope);
 envelope.addEventListener('click',()=>{
  envelope.disabled=true;document.body.classList.add('envelope-opening');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setTimeout(()=>{envelope.remove();document.body.classList.remove('envelope-closed','envelope-opening');card.disabled=false;card.removeAttribute('aria-hidden');card.focus({preventScroll:true})},reduced?0:1400);
 },{once:true});
}
// Show the side being edited without moving focus away from the text field.
$('controls').addEventListener('focusin',e=>{
 const field=e.target.dataset.field;
 if(['message','to','from','sender'].includes(field)){backShowing=true;updateVisibleFace()}
 else if(['heading','subheading'].includes(field)){backShowing=false;updateVisibleFace()}
});
function initialize(){
 if(location.hash){try{if(!location.hash.startsWith('#card='))throw Error();state=decodeCard(location.hash.slice(6));reading=true;document.body.classList.add('reader');$('editor').hidden=true;$('recipient').hidden=false;$('recipient').innerHTML='<a class="button" href="'+escapeXML(location.pathname)+'">Make your own digital card</a>';$('preview-title').textContent='A little note for you';$('save-status').textContent='';document.title='A little note for you · ほんの手紙 POST';preview();setupEnvelope();return}catch{reading=true;document.body.classList.add('reader');$('editor').hidden=true;document.querySelector('.cards').hidden=true;$('preview-face-label').hidden=true;$('preview-title').textContent='This card link could not be opened';$('recipient').hidden=false;$('recipient').innerHTML='<p>The link may be incomplete or from an unsupported version. Ask the sender to copy the full link again.</p><a class="button" href="'+escapeXML(location.pathname)+'">Create a postcard</a>';return}}
 try{const draft=localStorage.getItem('little-postcard-draft-v1');if(draft){let saved=JSON.parse(draft);saved=legacyKeys.every(k=>Object.prototype.hasOwnProperty.call(saved,k))&&!('headingColor' in saved)&&!('subheadingColor' in saved)&&!('accentFinish' in saved)?upgradeLegacy(saved):saved;state=validate('particleColor' in saved?saved:upgradeParticles(saved));restored=true}}catch{status('A saved draft could not be restored. You can create a new card.')}
 render();preview();if(restored)$('save-status').textContent='Draft restored from this device';
}
initialize();window.addEventListener('hashchange',()=>location.reload());
if(document.modelContext?.registerTool&&!reading){try{Promise.resolve(document.modelContext.registerTool({name:'set_postcard_words',description:'Update the heading, subheading, and personal message in the current postcard draft. Does not send or share it.',inputSchema:{type:'object',properties:{heading:{type:'string',maxLength:60},subheading:{type:'string',maxLength:80},message:{type:'string',maxLength:500}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['heading','subheading','message'].includes(k)))throw Error('Unsupported fields');const next=validate({...state,...input});state=next;changed();render();return {updated:true,heading:state.heading,message:state.message}}})).catch(()=>{})}catch{}}

window.addEventListener('pagehide',()=>{if(!reading){try{localStorage.setItem('little-postcard-draft-v1',JSON.stringify(state))}catch{}}});

document.fonts.addEventListener('loadingdone',()=>preview());
