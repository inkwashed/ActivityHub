/* Town geometry and route language are independent of browser rendering. */
(() => {
 const places=['house','park','library','museum','hospital','bus stop','station','police station','fire station','post office','bookstore','restaurant','supermarket','castle','shrine','temple','church','aquarium','stadium','zoo','amusement park','convenience store','elementary school','junior high school'];
 const plural={house:'houses',library:'libraries',church:'churches'};
 const dirs=[[0,-1],[1,0],[0,1],[-1,0]],numbers=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
 const valid=n=>Number.isInteger(n)&&n>=0&&n<40;
 // Preserve original node IDs; 20–24 add the north riverbank.
 const xy=n=>n>=25?[(n-25)%5,[1,3,4][Math.floor((n-25)/5)]-.2]:n>=20?[n-20,1]:[n%5,Math.floor(n/5)+(n>=5?1:0)];
 const bridge=(a,b)=>{const p=xy(a),q=xy(b);return p[0]===q[0]&&Math.min(p[1],q[1])===1&&Math.max(p[1],q[1])===2;};
 const lot=i=>{const row=Math.floor(i/4);return [i%4,row+(row>0?1:0)];};
 const railRows=(blocks=[])=>[0,1,2].filter(r=>blocks.slice(r*4,r*4+4).includes('station'));
 const lower=(r,c)=>[20,10,15][r]+c;
 const upper=(r,c)=>[0,5,10][r]+c;
 const railNode=(a,b,blocks)=>{for(const r of railRows(blocks))for(let c=0;c<5;c++)if((a===lower(r,c)&&b===upper(r,c))||(b===lower(r,c)&&a===upper(r,c)))return 25+r*5+c;return null;};
 const track=(a,b)=>{const n=a>=25?a:b>=25?b:null;if(n===null)return false;return (a===lower(Math.floor((n-25)/5),(n-25)%5)||b===lower(Math.floor((n-25)/5),(n-25)%5));};
 const activeNode=(n,blocks=[])=>n<25||railRows(blocks).includes(Math.floor((n-25)/5));
 const railSpacing=32; // Compact track strip; northern nodes sit on the existing approach.
 const shift=(y,blocks=[])=>railSpacing*railRows(blocks).filter(r=>[200,430,560][r]<=y).length;
 const mapHeight=(blocks=[])=>660+railSpacing*railRows(blocks).length;
 const point=(n,blocks=[])=>{
  if(n>=25){const r=Math.floor((n-25)/5),y=[200,430,560][r];return [100+(n-25)%5*130,y+shift(y,blocks)-railSpacing-24];}
  const [x,row]=xy(n),y=[70,200,300,430,560][row];return [100+x*130,y+shift(y,blocks)];
 };
 const blockRect=(i,blocks=[])=>{const [x,y]=lot(i),top=[86,0,316,446][y];return {x:116+x*130,y:top+shift(top,blocks),width:98,height:98};};
 const heading=(a,b)=>{const [x,y]=xy(a),[u,v]=xy(b);return dirs.findIndex(([dx,dy])=>Math.sign(u-x)===dx&&Math.sign(v-y)===dy)};
 const initial=()=>({topology:3,blocks:Array(12).fill(null),route:[17],facing:0,destination:null});
 function movePlace(blocks,from,to){
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>=12||to<0||to>=12||!blocks[from]||from===to)return blocks;
  const next=[...blocks];[next[from],next[to]]=[next[to],next[from]];return next;
 }
 function extend(route,n,facing,blocks=[]){
  if(!valid(n)||n===route.at(-1))return route;
  if(route.length>1&&n===route.at(-2))return route.slice(0,-1);
  const h=heading(route.at(-1),n),previous=route.length>1?heading(route.at(-2),route.at(-1)):facing;
  const a=route.at(-1),p=xy(a),q=xy(n);
  let adjacent=false;
  if(a<25&&n<25)adjacent=Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])===1&&railNode(a,n,blocks)===null;
  else if(a>=25&&n>=25){adjacent=false;} // No street along the north side of the railway.
  else {const v=a>=25?a:n,r=Math.floor((v-25)/5),c=(v-25)%5,other=a===v?n:a;adjacent=railRows(blocks).includes(r)&&(other===upper(r,c)||other===lower(r,c));}
  if(!adjacent||h<0||(h-previous+4)%4===2||route.includes(n))return route;
  return [...route,n];
 }
 // Arrival is at the near corner, looking forward along the destination's side.
 function side(route,block,facing=0,blocks=[]){
  if(!route.length||!Number.isInteger(block)||block<0||block>=12)return null;
  const h=route.length>1?heading(route.at(-2),route.at(-1)):facing;
  if(!dirs[h])return null;
  const end=route.at(-1),[dx,dy]=dirs[h],b=xy(end),[lx,ly]=lot(block);
  if(end>=25){b[1]=Math.round(b[1]);if(ly>=b[1])return null;}
  else if(railRows(blocks).some(r=>end>=lower(r,0)&&end<=lower(r,4)&&ly===b[1]-1))return null;
  const ox=lx+.5-b[0],oy=ly+.5-b[1];
  if(ox*dx+oy*dy!==.5)return null;
  const cross=dx*oy-dy*ox;
  return Math.abs(cross)===.5?(cross>0?'right':'left'):null;
 }
 function directions(state){

  let h=state.facing,run=0,result=[],crossed=false;
  const flush=()=>{if(run)result.push(`${crossed?'Continue':'Go straight for'} ${numbers[run]||run} ${run===1?'block':'blocks'}.`);run=0};
  for(let i=1;i<state.route.length;i++){
   const next=heading(state.route[i-1],state.route[i]),turn=(next-h+4)%4;
   if(turn){flush();result.push(turn===1?'Turn right.':'Turn left.');h=next;}
   if(track(state.route[i-1],state.route[i])){flush();result.push('Cross the tracks.');crossed=true;}else if(bridge(state.route[i-1],state.route[i])){flush();result.push('Cross the bridge.');crossed=true;}else run++;
  }
  flush();const arrival=side(state.route,state.destination,state.facing,state.blocks);
  if(arrival)result.push(`You can see it on your ${arrival}.`);
  return result.join(' ');
 }
 function inventory(blocks){const counts=new Map();blocks.filter(Boolean).forEach(x=>counts.set(x,(counts.get(x)||0)+1));const phrases=[...counts].map(([x,n])=>n===1?`${/^[aeiou]/.test(x)?'an':'a'} ${x}`:`${n} ${plural[x]||x+'s'}`);return phrases.length?'We have '+(phrases.length===1?phrases[0]:phrases.slice(0,-1).join(', ')+' and '+phrases.at(-1))+'.':'We have ….';}
 function restore(raw){
  const s=initial();if(!raw||!Array.isArray(raw.blocks)||raw.blocks.length!==12)return s;
  s.blocks=raw.blocks.map(x=>places.includes(x)?x:null);
  s.facing=0;
  s.destination=Number.isInteger(raw.destination)&&s.blocks[raw.destination]?raw.destination:null;
  if(Array.isArray(raw.route)&&raw.route[0]===17&&(raw.facing===0||raw.facing===undefined)){
   let route=raw.route.slice(0,40);
   if(!raw.topology||raw.topology<2){
    const migrated=[route[0]];
    for(let i=1;i<route.length;i++){
     const a=route[i-1],b=route[i];
     if(a>=0&&a<10&&b>=0&&b<10&&Math.abs(a-b)===5)migrated.push(20+a%5);
     migrated.push(b);
    }
    route=migrated;
   }
   if(raw.topology!==3){const expanded=[route[0]];for(let i=1;i<route.length;i++){const v=railNode(route[i-1],route[i],s.blocks);if(v!==null)expanded.push(v);expanded.push(route[i]);}route=expanded;}
   if(route[0]>=25&&!railRows(s.blocks).includes(Math.floor((route[0]-25)/5)))return s;
   s.route=[route[0]];
   for(const n of route.slice(1)){const next=extend(s.route,n,s.facing,s.blocks);if(next.length!==s.route.length+1)break;s.route=next;}
  }
  return s;
 }

 window.TownModel={heading,places,initial,movePlace,extend,side,directions,inventory,restore,xy,bridge,point,blockRect,railRows,railNode,track,railSpacing,activeNode,mapHeight,shift,nodeCount:40};
})();
