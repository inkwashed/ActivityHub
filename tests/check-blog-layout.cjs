const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync('shared/blog-layout.js','utf8'),c);const L=c.window.BlogLayout,images=[{uid:'a'},{uid:'b'},{uid:'c'}],measure=s=>s.length*14;
function valid(p){for(const b of p.blocks){assert.ok(b.col>=0&&b.col+b.w<=3);for(const other of p.blocks)if(b!==other)assert.ok(!L.overlap(b,other));}}
let p=L.plan(null,images,'A short post.',measure);valid(p);assert.equal(p.blocks.find(b=>b.key==='text').w,3);assert.equal(p.blocks.find(b=>b.key==='text').row,2);
let custom=L.positions(p);custom.find(b=>b.key==='text').row=0;p=L.plan(custom,images,'A short post.',measure,'text');valid(p);assert.equal(p.blocks[0].key,'text');assert.equal(p.blocks[0].row,0);
custom=[{key:'text',col:0,row:0,w:2,h:1},{key:'photo:a',col:2,row:0,w:1,h:3}];p=L.plan(custom,images,'A long sentence. '.repeat(100),measure);valid(p);assert.ok(p.blocks[0].rows>3);assert.equal(p.blocks[1].row,0);
assert.equal(L.plan([],images,'still saved',measure).blocks.length,4);
assert.equal(L.plan(custom,[], 'text',measure).blocks.length,1);
const bad=L.normalize([{key:'photo:a',w:99,col:99,row:-10,h:99},{key:'photo:a'},{key:'unknown'}],images);assert.equal(bad.length,4);assert.equal(bad[0].w,3);assert.equal(bad[0].col,0);assert.equal(bad[0].row,0);
assert.equal(L.wrap('abcdefgh',28,measure).join(''),'abcdefgh');assert.deepEqual(Array.from(L.wrap('one\n\ntwo',500,measure)),['one','','two']);
console.log('PASS: default layout, collision resolution, adjacent text/photos, auto text height, source inclusion/deletion, corrupt layout and word/paragraph wrapping.');

const restored=L.normalize(custom,images);assert.equal(restored.length,4);assert.equal(restored[0].w,2);assert.equal(new Set(restored.map(b=>b.key)).size,4);
// A tall text block and a short photo exchange order without adding blank rows.
const one=[{uid:'a'}],body='A long sentence. '.repeat(30);
let stack=L.plan([{key:'text',col:0,row:0,w:3,h:1},{key:'photo:a',col:0,row:0,w:1,h:2}],one,body,measure);
const originalRows=stack.rows,textRows=stack.blocks.find(b=>b.key==='text').rows;
assert.ok(textRows>2);
const move=(p,key,d)=>L.plan(L.moveVertical(p,key,d),one,body,measure);
let swapped=move(stack,'photo:a',-1);valid(swapped);
assert.equal(swapped.blocks.find(b=>b.key==='photo:a').row,0);
assert.equal(swapped.blocks.find(b=>b.key==='text').row,2);assert.equal(swapped.rows,originalRows);
let back=move(swapped,'photo:a',1);valid(back);assert.equal(back.blocks.find(b=>b.key==='text').row,0);assert.equal(back.blocks.find(b=>b.key==='photo:a').row,textRows);assert.equal(back.rows,originalRows);
swapped=move(stack,'text',1);valid(swapped);assert.equal(swapped.blocks.find(b=>b.key==='photo:a').row,0);assert.equal(swapped.blocks.find(b=>b.key==='text').row,2);assert.equal(swapped.rows,originalRows);
// A full-width block swaps past an adjacent row of side-by-side photos.
let group=L.plan(null,images,body,measure);const groupRows=group.rows;
group=L.plan(L.moveVertical(group,'text',-1),images,body,measure);valid(group);assert.equal(group.blocks.find(b=>b.key==='text').row,0);assert.equal(group.rows,groupRows);
group=L.plan(L.moveVertical(group,'text',1),images,body,measure);valid(group);assert.equal(group.blocks.find(b=>b.key==='text').row,2);assert.equal(group.rows,groupRows);
const gap=L.plan([{key:'text',col:0,row:0,w:3,h:1},{key:'photo:a',col:0,row:textRows+4,w:1,h:2}],one,body,measure);
assert.equal(move(gap,'photo:a',-1).blocks.find(b=>b.key==='photo:a').row,textRows+3);
console.log('PASS: tall-text/photo swaps in both directions, adjacent photo groups, unchanged total height, and empty-space nudges.');
// Side-by-side elements exchange their unequal widths without changing rows.
let side=L.plan([{key:'text',col:0,row:0,w:2,h:1},{key:'photo:a',col:2,row:0,w:1,h:2}],one,body,measure);
const across=(p,key,d)=>L.plan(L.moveHorizontal(p,key,d),one,body,measure);
for(const [key,d] of [['text',1],['photo:a',-1]]){
 const exchanged=across(side,key,d);valid(exchanged);
 assert.equal(exchanged.blocks.find(b=>b.key==='photo:a').col,0);
 assert.equal(exchanged.blocks.find(b=>b.key==='text').col,1);
 assert.equal(exchanged.rows,side.rows);
 const restored=across(exchanged,key,-d);valid(restored);
 assert.equal(restored.blocks.find(b=>b.key==='text').col,0);
 assert.equal(restored.blocks.find(b=>b.key==='photo:a').col,2);
 assert.ok(restored.blocks.every(b=>b.row===0));
}
console.log('PASS: horizontal swaps in both directions preserve unequal widths and rows.');
let split=L.plan(null,images,'First paragraph.\n\nSecond paragraph.\r\nThird paragraph.',measure);valid(split);
assert.equal(split.blocks.length,6);assert.deepEqual(Array.from(split.blocks.filter(b=>L.isText(b.key)),b=>b.lines.join(' ')),['First paragraph.','Second paragraph.','Third paragraph.']);
let saved=L.positions(split);saved.find(b=>b.key==='text:1').w=2;
split=L.plan(saved,images,'First edited.\nSecond edited.\nThird edited.\nNew fourth.',measure);valid(split);assert.equal(split.blocks.length,7);assert.equal(split.blocks.find(b=>b.key==='text:1').w,2);
assert.equal(L.plan(L.positions(split),images,'Only one.',measure).blocks.length,4);
console.log('PASS: newline splitting, blank lines, all sections retained, custom sizing, adding/removing sections.');
