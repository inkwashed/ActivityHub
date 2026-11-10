/* Static examples from production Save renderers; no app runtime on the homepage. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..');
const hash=data=>createHash('sha256').update(data).digest('hex');
function generate(){
 const sources=new Map(),outputs={};
 function environment(name){
  let render;
  // Export-only environment: no live stage to mount into. Fail on unexpected DOM use.
  const document={querySelector:selector=>{if(['.parfait-stage','#builder'].includes(selector))return null;throw Error(`Unexpected preview DOM dependency: ${selector}`)}};
  const window={BuilderPhoto:options=>{render=options.render}};
  const context=vm.createContext({window,document});
  const load=file=>{const source=fs.readFileSync(path.join(root,file),'utf8');sources.set(file,hash(source));vm.runInContext(source,context,{filename:file})};
  load('shared/builder-panel-workspace.js');
  const frameFile='scripts/home-preview-frames.json', frameSource=fs.readFileSync(path.join(root,frameFile),'utf8');
  sources.set(frameFile,hash(frameSource));
  const geometry=JSON.parse(frameSource).frames[name];
  for(const rect of Object.values(geometry)){rect.right=rect.left+rect.width;rect.bottom=rect.top+rect.height;}
  return {window,load,render:builder=>{builder.exportFrame=(mapping={x:0,y:0,width:100,height:100},baseline={left:-5,top:-5,side:110})=>window.BuilderPanelWorkspace.photoFrame(geometry.frame,geometry.scene,mapping,baseline);if(!render)throw Error('Missing production Save renderer');return render(builder)+'\n'}};
 }
 {
  const e=environment('pizza');e.load('shared/builder.js');e.load('apps/pizza/config.js');e.load('apps/pizza/sharing.js');
  const b=Object.create(e.window.FoodBuilder.prototype);b.config=e.window.PIZZA_CONFIG;b.seed=b.config.seed>>>0;b.positions=new Map();
  b.state={sauce:'tomato',toppings:Object.fromEntries(b.config.toppings.map(t=>[t.id,['cheese','corn'].includes(t.id)?2:0]))};
  outputs['pizza']=e.render(b);
 }
 {
  const e=environment('parfait');e.load('apps/parfait/config.js');e.load('apps/parfait/glass-art.js');
  // Only scoopArtwork is needed; the live LayerBuilder constructor edits the DOM.
  e.window.LayerBuilder=class{constructor(root,config){this.config=config}};
  e.load('apps/parfait/builder.js');e.load('apps/parfait/sharing.js');
  const b=e.window.parfaitBuilder;b.state={base:'vanilla',sauce:'chocolate',layers:[['strawberries','strawberries']]};
  outputs['parfait']=e.render(b);
 }
 {
  const e=environment('sandwich');e.load('apps/sandwich/config.js');e.load('apps/sandwich/model.js');e.load('apps/sandwich/sharing.js');
  outputs['sandwich']=e.render({config:e.window.SANDWICH_CONFIG,state:{slots:['bacon','lettuce','tomato'].map(topping=>({topping}))}});
 }
 {
  const e=environment('class-supplies');e.load('apps/class-supplies/config.js');e.load('apps/class-supplies/sharing.js');
  const config=e.window.Supplies.config;
  const palette=Object.fromEntries([['case','blue'],...config.toppings.map(t=>[t.id,t.id==='pen'?'red':t.color])]);
  outputs['class-supplies']=e.render({config,creative:{active:false},state:{toppings:Object.fromEntries(config.toppings.map(t=>[t.id,1]))},palette:()=>palette});
 }
 for(const [name,svg] of Object.entries(outputs))if(/NaN|undefined/.test(svg))throw Error(`${name}: invalid export geometry`);
 sources.set('scripts/generate-home-previews.cjs',hash(fs.readFileSync(__filename)));
 const manifest={policy:'LEARN 1133x678 reference square Save artwork, without polaroid caption; see docs/HOME-PREVIEWS.md',sources:Object.fromEntries([...sources].sort()),outputs:Object.fromEntries(Object.entries(outputs).map(([name,svg])=>[`${name}-preview.svg`,hash(svg)]))};
 return {outputs,manifest};
}
function run(check=false){
 // Render everything first: a missing dependency must not leave a partially updated set.
 const {outputs,manifest}=generate();
 const files={...Object.fromEntries(Object.entries(outputs).map(([name,svg])=>[`assets/${name}-preview.svg`,svg])),'assets/home-previews.json':JSON.stringify(manifest,null,2)+'\n'};
 let stale=false;
 for(const [file,content] of Object.entries(files)){
  if(check){if(!fs.existsSync(path.join(root,file))||fs.readFileSync(path.join(root,file),'utf8')!==content){console.error(`Stale preview: ${file}`);stale=true;}}
  else fs.writeFileSync(path.join(root,file),content);
 }
 if(stale)process.exitCode=1;
 else console.log(check?'Homepage previews and source fingerprints are current.':'Updated four homepage previews from production Save renderers.');
}
module.exports={generate,run};
if(require.main===module)run(process.argv.includes('--check'));
