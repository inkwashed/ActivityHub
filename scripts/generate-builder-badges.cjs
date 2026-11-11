/* Derive ranked badge colors from the canonical app icons; keep geometry intact. */
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const palettes={bronze:['#63402a','#f2cfac'],silver:['#455461','#eaf1f5'],gold:['#75520d','#fff0ad'],diamond:['#086c79','#c5fff7']};
for(const id of ['pizza','sandwich','parfait','class-supplies','my-town']){
 const original=fs.readFileSync(path.join(root,'apps',id,'icon.svg'),'utf8');
 for(const [rank,[dark,light]] of Object.entries(palettes)){
  const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),low=rgb(dark),high=rgb(light);
  const svg=original.replace(/#[0-9a-f]{6}\b/gi,color=>{const c=rgb(color),l=(.2126*c[0]+.7152*c[1]+.0722*c[2])/255;return '#'+low.map((v,i)=>Math.round(v+(high[i]-v)*l).toString(16).padStart(2,'0')).join('');});
  fs.writeFileSync(path.join(root,'shared/badges',`${id}-${rank}.svg`),svg);
 }
}
