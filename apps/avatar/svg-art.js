/* User-authored SVG parts. No raster images or external references in exports. */
(() => {
 const parts=window.AvatarSVGParts;
 const rgb=hex=>hex.slice(1).match(/../g).map(v=>parseInt(v,16));
 // Preserve each source shade's offset from its base color, including the
 // original palette exactly at the default. Keep dark outlines unchanged.
 function recolor(markup,base,target,shades){
  if(!/^#[\da-f]{6}$/i.test(target)||base===target)return markup;
  const from=rgb(base),to=rgb(target);
  const palette=Object.fromEntries(shades.map(shade=>[shade,'#'+rgb(shade).map((v,i)=>Math.max(0,Math.min(255,v+to[i]-from[i])).toString(16).padStart(2,'0')).join('')]));
  return markup.replace(/fill:(#[\da-f]{6})/gi,(match,color)=>palette[color]?'fill:'+palette[color]:match);
 }
 const neutralSkinTones=new Set(['#b6845d','#845d40','#573f31']);
 const shadeSkin=(skin,factor)=>'#'+rgb(skin).map((v,i)=>Math.round(v*factor*[1.025,.99,.97][i]).toString(16).padStart(2,'0')).join('');
 // One skin-derived detail tone shared by lid creases and nose.
 function skinDetail(skin='#f8cfa9'){
  if(neutralSkinTones.has(skin))return shadeSkin(skin,.8);
  const base=rgb('#f8cfa9'),detail=rgb('#deaa87');
  return '#'+rgb(skin).map((v,i)=>Math.round(v*detail[i]/base[i]).toString(16).padStart(2,'0')).join('');
 }
 function layer(key,s){
  let art=parts[key==='face'?({slim:'faceSlim',round:'faceRound'}[s.face]||'face'):key==='hair'&&s.hair==='curly'?'hairCurly':key];
  if(key==='clothes')art=recolor(art,'#5d9698',s.shirtColor,['#5d9698','#467577']);
  if(key==='face'){
   if(neutralSkinTones.has(s.skin)){
    const palette={'#f8cfa9':s.skin,'#efac85':shadeSkin(s.skin,.85),'#af755b':shadeSkin(s.skin,.63)};
    art=art.replace(/fill:(#[\da-f]{6})/gi,(match,color)=>palette[color]?'fill:'+palette[color]:match);
   }else art=recolor(art,'#f8cfa9',s.skin,['#f8cfa9','#efac85','#af755b']);
  }
  if(key==='hair')art=s.hair==='none'?'':s.hair==='curly'?recolor(art,'#523529',s.hairColor,['#523529','#351d16','#8a5c48']):recolor(art,'#503529',s.hairColor,['#503529','#2f1a13','#8e6750']);
  if(key==='eyes'){
   if(s.eyeStyle!=='eyelashes')art=art.replace(/<path\b[^>]*data-lashes="true"[^>]*\/>/g,'');
   art=art.replaceAll('fill:#deaa87','fill:SKIN_DETAIL');
   art=recolor(art,'#9b6643',s.eyeColor,['#9b6643','#bf8454','#502d16']);
   art=art.replaceAll('fill:SKIN_DETAIL','fill:'+skinDetail(s.skin));
   // The original compound path shared rings with pupils; only rings follow iris.
   art=art.replace(/<path\b[^>]*data-iris-ring="true"[^>]*\/>/g,path=>path.replace('fill:#2f211d','fill:'+s.eyeColor));
  }
  if(key==='nose')art=s.nose==='none'?'':art.replaceAll('fill:#925938','fill:'+skinDetail(s.skin));
  return art;
 }
 const svg=(body,viewBox='0 0 3184.762 3184.762')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`;
 window.renderAvatar=s=>svg(`<rect width="3184.762" height="3184.762" fill="${s.background}"/>`+['face','clothes','eyes','nose','mouth','hair'].map(key=>layer(key,s)).join(''));
 window.renderAvatarFacePreview=s=>svg(layer('face',s),'450 450 2300 2300');
 window.renderAvatarExpression=(eyes,eyeColor,eyeStyle,skin)=>svg(layer('eyes',{eyeColor,eyeStyle,skin}),'750 1150 1700 950');
 window.renderAvatarNosePreview=s=>svg(layer('nose',s),'1350 1900 500 500');
})();
