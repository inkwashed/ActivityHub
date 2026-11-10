const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {generate}=require('../scripts/generate-home-previews.cjs');
const first=generate(),second=generate();assert.deepEqual(first,second,'Generation must be deterministic');
assert.deepEqual(Object.keys(first.outputs),['pizza','parfait','sandwich','class-supplies','my-town']);
const mounted=[];const context={window:{},document:{querySelector:()=>({insertAdjacentHTML:(where,html)=>mounted.push([where,html])})}};
vm.runInNewContext(fs.readFileSync('apps/parfait/glass-art.js','utf8'),context);
const {back,front}=context.window.ParfaitGlass,svg=first.outputs.parfait;
assert.equal(mounted.length,2);assert.ok(svg.includes(back)&&svg.includes(front));
assert.ok(svg.indexOf(back)<svg.indexOf('scoop-syrup')&&svg.indexOf('scoop-syrup')<svg.indexOf(front),'Glass must enclose ingredients');
assert.ok(!svg.includes('non-scaling-stroke'),'No stale glass stroke behavior');
for(const [name,art] of Object.entries(first.outputs)){
 assert.equal(art,fs.readFileSync(`assets/${name}-preview.svg`,'utf8'),`${name}: regenerate previews`);
 assert.match(art,/viewBox="[-\d.]+ [-\d.]+ [\d.]+ [\d.]+"/);assert.ok(!/NaN|undefined|<script|(?:href|src)="https?:/.test(art));
 assert.ok(Buffer.byteLength(art)<100000,'Preview unexpectedly large');
}
assert.deepEqual(first.manifest,JSON.parse(fs.readFileSync('assets/home-previews.json','utf8')),'Sources changed: regenerate previews');
assert.match(fs.readFileSync('apps/class-supplies/index.html','utf8'),/src="sharing.js/);
assert.match(fs.readFileSync('scripts/build-pizza-preview.cjs','utf8'),/require\('\.\/generate-home-previews.cjs'\)/);
console.log('PASS: five current, deterministic production previews; glass mounting/layering, bounded static assets and one generation path.');
