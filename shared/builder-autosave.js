/* Builder adapter: persist data only, never DOM, artwork, or transient dialogs. */
(() => {
 const clone=value=>JSON.parse(JSON.stringify(value));
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const number=(value,fallback,min,max)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
 function adapter(b){
  const c=b.creative,defaults=clone(b.state);
  const validId=(list,id,fallback=null)=>id===null?null:list?.some(x=>x.id===id)?id:fallback;
  function state(value){
   value=object(value);const result=clone(defaults);
   result.sauce=validId(b.config.sauces,value.sauce,defaults.sauce);
   if(b.config.bases)result.base=validId(b.config.bases,value.base,defaults.base);
   result.toppings=Object.fromEntries(b.config.toppings.map(x=>[x.id,Number.isInteger(value.toppings?.[x.id])?number(value.toppings[x.id],0,0,3):0]));
   if(defaults.layers)result.layers=defaults.layers.map((row,i)=>row.map((_,j)=>validId(b.config.toppings,value.layers?.[i]?.[j])));
   if(defaults.slots)result.slots=defaults.slots.map((_,i)=>{
    const item=value.slots?.[i],type=b.config.toppings.find(x=>x.id===item?.topping);
    return type?{topping:type.id,source:type.sources?.includes(item.source)?item.source:null}:null;
   });
   return result;
  }
  function capture(){
   return {learn:c?.active?c.tapState:b.state,hard:c?.active?c.tapHard:b.advancedMode,play:!!c?.active,
    free:c?.active?b.state:c?.freeState,items:c?.items.map(({id,topping,x,y,scale,rotate,flip})=>({id,topping,x,y,scale,rotate,flip}))||[],selected:c?.selected,
    activeSlot:b.activeSlot,activeLayer:b.activeLayer,
    slots:b.slots?{items:b.slots.items,active:b.slots.active}:null,
    choices:Object.fromEntries(['example-choice','sentence-example'].map(id=>[id,document.getElementById(id)?.value])),
    seed:b.seed,positions:[...b.positions],selectionOrder:b.selectionOrder};
  }
  function restore(raw){
   raw=object(raw);
   if(c?.active)c.switchMode(false);
   c?.items.forEach(item=>item.node.remove());
   if(c){c.items=[];c.selected=null;}
   b.groups.forEach(group=>{while(group.children.length)group.lastElementChild.remove()});
   b.state=state(raw.learn);
   b.advancedMode=raw.hard===true&&!b.config.easyOnly&&!c?.options.easyOnly;
   const toggle=document.querySelector('#advanced-mode');if(toggle)toggle.checked=b.advancedMode;
   b.activeSlot=Math.floor(number(raw.activeSlot,0,0,defaults.slots?defaults.slots.length-1:1));
   b.activeLayer=Math.floor(number(raw.activeLayer,0,0,(defaults.layers?.length||1)-1));
   b.seed=number(raw.seed,b.seed,0,4294967295)>>>0;
   b.positions.clear();
   for(const entry of Array.isArray(raw.positions)?raw.positions:[]){
    if(!Array.isArray(entry))continue;
    const [id,points]=entry,type=b.config.toppings.find(x=>x.id===id);
    if(!type||!Array.isArray(points)||points.length!==type.counts[3])continue;
    if(points.every(p=>p&&['x','y','rotate','scale'].every(k=>Number.isFinite(p[k]))&&p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100&&p.scale>0&&p.scale<=3))b.positions.set(id,points.map(p=>({x:p.x,y:p.y,rotate:p.rotate,scale:p.scale})));
   }
   b.selectionOrder=[...new Set((Array.isArray(raw.selectionOrder)?raw.selectionOrder:[]).filter(id=>b.config.toppings.some(x=>x.id===id)&&b.state.toppings[id]))];
   for(const id of ['example-choice','sentence-example']){
    const el=document.getElementById(id),value=raw.choices?.[id];if(el&&[...el.options].some(x=>x.value===value))el.value=value;
   }
   if(b.slots){
    b.slots.items=b.slots.items.map((_,i)=>{const id=raw.slots?.items?.[i]?.id;return b.slots.catalog.some(x=>x.id===id)?{id}:null});
    b.slots.active=Math.floor(number(raw.slots?.active,0,0,b.slots.items.length-1));b.slots.refresh();
   }
   if(b.refreshLayers)b.refreshLayers();
   else if(!defaults.slots)b.config.toppings.forEach(x=>b.setLevel(x.id,b.state.toppings[x.id],false));
   if(b.config.bases)b.setBase(b.state.base,false);
   b.setSauce(b.state.sauce,false);b.updateSentence();
   if(!c)return;
   const free=state(raw.free);delete free.slots;delete free.layers;c.freeState=free;
   const items=(Array.isArray(raw.items)?raw.items:[]).slice(0,120);
   // Rebuild unique runtime IDs; preserve array order and selected item by old ID.
   c.items=items.filter(x=>x&&c.catalog.some(t=>t.id===x.topping)).map((x,i)=>({id:i+1,topping:x.topping,x:number(x.x,50,-1000,1000),y:number(x.y,50,-1000,1000),scale:number(x.scale,c.sizes.initial,c.sizes.min,c.sizes.max),rotate:number(x.rotate,0,-36000,36000)%360,flip:x.flip===true,oldId:x.id}));
   c.nextId=c.items.length+1;c.selected=c.items.find(x=>x.oldId===raw.selected)?.id||null;
   // Mount while PLAY is visible so bounds and syrup use the correct composition.
   const restored=c.items,selected=c.selected;c.items=[];c.selected=null;c.switchMode(true);
   restored.forEach(item=>{delete item.oldId;c.items.push(item);c.mount(item)});c.sync();c.select(selected);
   if(raw.play!==true)c.switchMode(false);
   b.updateSentence();
  }
  return {capture,restore};
 }
 window.BuilderAutosave={adapter};
 document.addEventListener('DOMContentLoaded',()=>{
  for(const [id,b] of [['pizza',window.pizzaBuilder],['parfait',window.parfaitBuilder],['sandwich',window.sandwichBuilder],['builder-lab',window.labBuilder]]){
   if(b)window.ActivityAutosave.connect(id,adapter(b));
  }
 });
})();
