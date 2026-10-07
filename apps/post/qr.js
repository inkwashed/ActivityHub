// Browser adaptation of python-qrcode (BSD); see qr-LICENSE.txt.
// Byte-mode QR encoding with high error correction; no network requests.
const PostQR = (() => {
 const blocks=[[1, 26, 9], [1, 44, 16], [2, 35, 13], [4, 25, 9], [2, 33, 11, 2, 34, 12], [4, 43, 15], [4, 39, 13, 1, 40, 14], [4, 40, 14, 2, 41, 15], [4, 36, 12, 4, 37, 13], [6, 43, 15, 2, 44, 16], [3, 36, 12, 8, 37, 13], [7, 42, 14, 4, 43, 15], [12, 33, 11, 4, 34, 12], [11, 36, 12, 5, 37, 13], [11, 36, 12, 7, 37, 13], [3, 45, 15, 13, 46, 16], [2, 42, 14, 17, 43, 15], [2, 42, 14, 19, 43, 15], [9, 39, 13, 16, 40, 14], [15, 43, 15, 10, 44, 16], [19, 46, 16, 6, 47, 17], [34, 37, 13], [16, 45, 15, 14, 46, 16], [30, 46, 16, 2, 47, 17], [22, 45, 15, 13, 46, 16], [33, 46, 16, 4, 47, 17], [12, 45, 15, 28, 46, 16], [11, 45, 15, 31, 46, 16], [19, 45, 15, 26, 46, 16], [23, 45, 15, 25, 46, 16], [23, 45, 15, 28, 46, 16], [19, 45, 15, 35, 46, 16], [11, 45, 15, 46, 46, 16], [59, 46, 16, 1, 47, 17], [22, 45, 15, 41, 46, 16], [2, 45, 15, 64, 46, 16], [24, 45, 15, 46, 46, 16], [42, 45, 15, 32, 46, 16], [10, 45, 15, 67, 46, 16], [20, 45, 15, 61, 46, 16]];
 const positions=[[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]];
 const exp=Array(512),log=Array(256);let value=1;
 for(let i=0;i<255;i++){exp[i]=value;log[value]=i;value<<=1;if(value&256)value^=0x11d;}
 for(let i=255;i<512;i++)exp[i]=exp[i-255];
 const mul=(a,b)=>a&&b?exp[log[a]+log[b]]:0;
 function blockList(version){const list=[],row=blocks[version-1];for(let i=0;i<row.length;i+=3)for(let j=0;j<row[i];j++)list.push({total:row[i+1],data:row[i+2]});return list;}
 function codewords(bytes,version){
  const list=blockList(version),capacity=list.reduce((s,b)=>s+b.data,0),bits=[];
  const put=(v,n)=>{for(let i=n-1;i>=0;i--)bits.push((v>>>i)&1);};
  put(4,4);put(bytes.length,version<10?8:16);for(const byte of bytes)put(byte,8);
  if(bits.length>capacity*8)throw Error('This card link is too long for a QR code. Shorten the card text, or use Copy link instead.');
  put(0,Math.min(4,capacity*8-bits.length));while(bits.length%8)bits.push(0);
  const data=[];for(let i=0;i<bits.length;i+=8)data.push(bits.slice(i,i+8).reduce((v,b)=>v*2+b,0));
  for(let pad=0;data.length<capacity;pad++)data.push(pad%2?17:236);
  const chunks=[],parity=[];let offset=0;
  for(const block of list){
   const count=block.total-block.data;let poly=[1];
   for(let i=0;i<count;i++){const next=Array(poly.length+1).fill(0);poly.forEach((v,j)=>{next[j]^=v;next[j+1]^=mul(v,exp[i]);});poly=next;}
   const chunk=data.slice(offset,offset+block.data);offset+=block.data;chunks.push(chunk);
   const remainder=chunk.concat(Array(count).fill(0));
   for(let i=0;i<chunk.length;i++){const factor=remainder[i];for(let j=0;j<poly.length;j++)remainder[i+j]^=mul(poly[j],factor);}
   parity.push(remainder.slice(-count));
  }
  const result=[];for(const group of [chunks,parity])for(let i=0;i<Math.max(...group.map(a=>a.length));i++)for(const row of group)if(i<row.length)result.push(row[i]);return result;
 }
 const masks=[(r,c)=>(r+c)%2===0,r=>r%2===0,(r,c)=>c%3===0,(r,c)=>(r+c)%3===0,(r,c)=>(Math.floor(r/2)+Math.floor(c/3))%2===0,(r,c)=>(r*c)%2+(r*c)%3===0,(r,c)=>((r*c)%2+(r*c)%3)%2===0,(r,c)=>((r*c)%3+(r+c)%2)%2===0];
 function bch(data,shift,polynomial){let rem=data<<shift;const degree=n=>31-Math.clz32(n);while(degree(rem)>=degree(polynomial))rem^=polynomial<<(degree(rem)-degree(polynomial));return (data<<shift)|rem;}
 function matrix(version,data,mask){
  const n=version*4+17,m=Array.from({length:n},()=>Array(n).fill(null));
  for(const [row,col] of [[0,0],[n-7,0],[0,n-7]])for(let r=-1;r<=7;r++)for(let c=-1;c<=7;c++)if(row+r>=0&&row+r<n&&col+c>=0&&col+c<n)m[row+r][col+c]=(r>=0&&r<=6&&(c===0||c===6))||(c>=0&&c<=6&&(r===0||r===6))||(r>=2&&r<=4&&c>=2&&c<=4);
  for(const row of positions[version-1])for(const col of positions[version-1])if(m[row][col]===null)for(let r=-2;r<=2;r++)for(let c=-2;c<=2;c++)m[row+r][col+c]=Math.abs(r)===2||Math.abs(c)===2||(r===0&&c===0);
  for(let i=8;i<n-8;i++){if(m[i][6]===null)m[i][6]=i%2===0;if(m[6][i]===null)m[6][i]=i%2===0;}
  const format=bch((2<<3)|mask,10,0x537)^0x5412;
  for(let i=0;i<15;i++){const bit=!!((format>>>i)&1);m[i<6?i:i<8?i+1:n-15+i][8]=bit;m[8][i<8?n-i-1:i===8?7:14-i]=bit;}
  m[n-8][8]=true;
  if(version>=7){const info=bch(version,12,0x1f25);for(let i=0;i<18;i++){const bit=!!((info>>>i)&1);m[Math.floor(i/3)][i%3+n-11]=bit;m[i%3+n-11][Math.floor(i/3)]=bit;}}
  const reserved=m.map(row=>row.map(v=>v!==null));let row=n-1,direction=-1,index=0;
  for(let col=n-1;col>0;col-=2){if(col===6)col--;while(true){for(const c of [col,col-1])if(m[row][c]===null){const bit=!!((data[index>>>3]>>>(7-index%8))&1);m[row][c]=bit!==masks[mask](row,c);index++;}row+=direction;if(row<0||row>=n){row-=direction;direction=-direction;break;}}}
  return {modules:m,reserved,version};
 }
 function penalty(m){
  const n=m.length;let score=0,dark=0;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){dark+=m[r][c]?1:0;if(r&&c&&m[r][c]===m[r-1][c]&&m[r][c]===m[r][c-1]&&m[r][c]===m[r-1][c-1])score+=3;}
  for(let axis=0;axis<2;axis++)for(let i=0;i<n;i++){
   const line=Array.from({length:n},(_,j)=>axis?m[j][i]:m[i][j]);let run=1;
   for(let j=1;j<=n;j++){if(j<n&&line[j]===line[j-1])run++;else{if(run>=5)score+=run-2;run=1;}}
   const s=line.map(Number).join('');for(let j=0;j<=n-11;j++)if(['00001011101','10111010000'].includes(s.slice(j,j+11)))score+=40;
  }
  return score+Math.floor(Math.abs(dark*100/(n*n)-50)/5)*10;
 }
 function encode(text,options={}){
  const bytes=new TextEncoder().encode(text);let version=options.version||1;
  if(version<1||version>40)throw Error('Invalid QR version');
  if(!options.version)while(version<40&&4+(version<10?8:16)+bytes.length*8>blockList(version).reduce((s,b)=>s+b.data*8,0))version++;
  const data=codewords(bytes,version);
  if(options.mask!==undefined)return matrix(version,data,options.mask);
  let best,score=Infinity;for(let mask=0;mask<8;mask++){const qr=matrix(version,data,mask),p=penalty(qr.modules);if(p<score){best=qr;score=p;}}return best;
 }
 // Keep every function pattern intact, including central alignment markers.
 function logoBox(qr){const n=qr.modules.length;let size=Math.max(5,Math.floor(n*.12));if(size%2===0)size--;const start=(n-size)/2;for(let r=start;r<start+size;r++)for(let c=start;c<start+size;c++)if(qr.reserved[r][c])return null;return {start,size};}
 return {encode,logoBox};
})();
