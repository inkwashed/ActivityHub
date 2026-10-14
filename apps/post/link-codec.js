/* Small, synchronous byte compression for share links, including older browsers.
 * z1 format: groups of eight tokens, preceded by a flag byte (LSB first).
 * Literal: one byte. Match: 12-bit backward distance and 4-bit length minus 3.
 * The 4095-byte window and 18-byte matches need no external library or service.
 */
const PostLinkCodec=(()=>{
 const limit=6000;
 function pack(bytes){
  const out=[],recent=new Map();let i=0;
  const keyAt=p=>p+2<bytes.length?(bytes[p]<<16)|(bytes[p+1]<<8)|bytes[p+2]:-1;
  const remember=p=>{const key=keyAt(p);if(key<0)return;let list=recent.get(key);if(!list)recent.set(key,list=[]);list.push(p);while(list.length&&(p-list[0]>4095||list.length>64))list.shift();};
  while(i<bytes.length){
   const flagIndex=out.length;out.push(0);
   for(let bit=0;bit<8&&i<bytes.length;bit++){
    let length=0,distance=0;const list=recent.get(keyAt(i))||[];
    for(let j=list.length-1;j>=0;j--){const d=i-list[j];if(d>4095)break;let n=0;while(n<18&&i+n<bytes.length&&bytes[i+n]===bytes[i+n-d])n++;if(n>length){length=n;distance=d;if(n===18)break;}}
    if(length>=3){out[flagIndex]|=1<<bit;const token=(distance<<4)|(length-3);out.push(token>>>8,token&255);}else{length=1;out.push(bytes[i]);}
    for(let n=0;n<length;n++)remember(i+n);i+=length;
   }
  }
  return Uint8Array.from(out);
 }
 function unpack(bytes){
  const out=[];let i=0;
  while(i<bytes.length){
   const flags=bytes[i++];if(i===bytes.length)throw Error('Incomplete compressed link');
   for(let bit=0;bit<8;bit++){
    if(i===bytes.length){if(flags>>>bit)throw Error('Incomplete compressed link');break;}
    if(flags&(1<<bit)){
     if(i+1>=bytes.length)throw Error('Incomplete compressed link');
     const token=(bytes[i++]<<8)|bytes[i++],distance=token>>>4,length=(token&15)+3;
     if(!distance||distance>out.length||out.length+length>limit)throw Error('Invalid compressed link');
     for(let n=0;n<length;n++)out.push(out[out.length-distance]);
    }else{if(out.length>=limit)throw Error('Card link is too large');out.push(bytes[i++]);}
   }
  }
  return Uint8Array.from(out);
 }
 function base64(bytes){let bin='';for(const b of bytes)bin+=String.fromCharCode(b);return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');}
 function unbase64(token){if(!token||token.length>8000||!/^[\w-]+$/.test(token))throw Error('Invalid link');return Uint8Array.from(atob(token.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
 function encode(bytes){if(bytes.length>limit)throw Error('Card link is too large');const plain=base64(bytes),packed='z1.'+base64(pack(bytes));return packed.length<plain.length?packed:plain;}
 function decode(token){if(token.length>8000)throw Error('Invalid link');return token.startsWith('z1.')?unpack(unbase64(token.slice(3))):unbase64(token);}
 return {encode,decode};
})();
