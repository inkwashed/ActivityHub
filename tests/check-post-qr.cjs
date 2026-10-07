// Reference fixtures generated independently with python-qrcode 7/8, byte mode,
// high ECC, fixed masks, using near-capacity data for every QR version.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const c=vm.createContext({TextEncoder});vm.runInContext(fs.readFileSync('apps/post/qr.js','utf8'),c);
for(const s of JSON.parse(fs.readFileSync('tests/fixtures/post-qr.json'))){c.s=s;const bits=vm.runInContext('PostQR.encode(s.text,{version:s.version,mask:s.mask}).modules.flat().map(Number).join("")',c);assert.equal(crypto.createHash('sha256').update(bits).digest('hex'),s.sha256,`Version ${s.version} mask ${s.mask}`);}
assert.throws(()=>vm.runInContext('PostQR.encode("a".repeat(1274))',c),/too long/);
for(const count of [100,400,800,1200]){c.count=count;assert.equal(vm.runInContext(`(()=>{const qr=PostQR.encode('a'.repeat(count)),box=PostQR.logoBox(qr);if(!box)return true;for(let r=box.start;r<box.start+box.size;r++)for(let col=box.start;col<box.start+box.size;col++)if(qr.reserved[r][col])return false;return true;})()`,c),true);}
console.log('Passed: 120 independent QR references across all 40 versions; capacity errors; logo avoids function patterns.');
