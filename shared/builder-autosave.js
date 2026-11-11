/* Builder adapter: persist data only, never DOM, artwork, or transient dialogs. */
(() => {
 const t=text=>window.ActivityHubI18n?.t(text)||text;
 const clone=value=>JSON.parse(JSON.stringify(value));
 const object=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const number=(value,fallback,min,max)=>Number.isFinite(value)?Math.max(min,Math.min(max,value)):fallback;
 // In-memory, whole-creation recovery. Never serialized by autosave.
 function recovery({button,mode,capture,restore,clear,hasCreation,after=()=>{},onError=()=>{},signature=value=>JSON.stringify(value)}){
  const pending=new Map(),failed=new Set();let busy=false;
  const label=()=>{
   const text=pending.has(mode())?'Restore':'Reset',span=button.querySelector('[data-i18n]')||button;
   span.dataset.i18n=text;span.textContent=window.ActivityHubI18n?.t(text)||text;
   if(button.hasAttribute?.('aria-label'))button.setAttribute('aria-label',span.textContent);
  };
  const refresh=()=>{
   if(busy)return;
   const saved=pending.get(mode());
   if(saved&&!failed.has(mode())&&signature(capture())!==saved.empty)pending.delete(mode());
   label();
  };
  const press=()=>{
   const key=mode(),saved=pending.get(key);busy=true;let succeeded=false;
   try{
    if(saved){restore(clone(saved.value),key);pending.delete(key);}
    else {
     const before=clone(capture()),keep=hasCreation(before);
     // Retain before the first destructive step, including renderer failures.
     pending.set(key,{value:before});
     clear();
     if(keep)pending.get(key).empty=signature(capture());else pending.delete(key);
    }
    failed.delete(key);succeeded=true;
   }catch(error){
    // Keep the recovery snapshot available even if an adapter failed partway.
    failed.add(key);
    console.error('[BuilderReset] Restore/reset failed; recovery snapshot retained.',error);onError();
   }finally{busy=false;label();if(succeeded)after();}
  };
  button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();press();},true);
  for(const event of ['click','input','change','pointerup','keyup'])document.addEventListener(event,()=>queueMicrotask(refresh));
  document.addEventListener('activityhub:languagechange',label);label();
  return {press,refresh,canSave:()=>!busy&&failed.size===0};
 }
 function installReset(b,storage,after){
  const mode=()=>b.creative?.active?'play':'learn';
  const content=raw=>({palette:raw.palettes?.[raw.play?'play':'learn'],creation:raw.play?{free:raw.free,items:raw.items.map(({id,...item})=>item)}:{learn:raw.learn,slots:raw.slots?.items}});
  return recovery({button:document.querySelector('#clear'),mode,capture:storage.capture,after,onError:()=>b.announce(t('Could not restore the creation. Please try Restore again.')),clear:()=>b.clear(),signature:raw=>JSON.stringify(content(raw)),
   hasCreation:raw=>storage.hasCreation?.(raw)||(raw.play?!!raw.items.length||!!raw.free?.sauce||!!raw.free?.base:
    Object.values(raw.learn?.toppings||{}).some(Boolean)||raw.learn?.layers?.some(row=>row.some(Boolean))||raw.learn?.slots?.some(Boolean)||raw.slots?.items?.some(Boolean)||raw.learn?.sauce!==b.config.defaultSauce||!!raw.learn?.base&&raw.learn.base!==b.config.defaultBase),
   restore:(saved,key)=>{
    const current=clone(storage.capture()),merged={...current};
    const fields=key==='play'?['free','items','selected']:['learn','hard','activeSlot','activeLayer','slots','seed','positions','selectionOrder','choices','conversation'];
    for(const field of fields)if(field!=='hard'||!b.config.independentDifficulty)merged[field]=saved[field];
    if(saved.palettes)merged.palettes={...current.palettes,[key]:saved.palettes[key]};
    if('colorTarget' in saved)merged.colorTarget=saved.colorTarget;
    merged.play=key==='play';
    try{storage.restore(merged,{temporary:true});b.restoreFailed=false;}
    catch(error){
     try{storage.restore(current,{temporary:true})}catch(rollbackError){console.error('[BuilderReset] Rollback failed; autosave paused and recovery retained.',rollbackError)}
     b.restoreFailed=true;throw error;
    }
   }});
 }
 window.BuilderReset={connect:recovery,install:installReset};

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
   // Optional lesson metadata; only configured source vocabularies are accepted.
   if(b.config.sourcesByType){result.origins={};for(const type of b.config.toppings){
    if(Object.prototype.hasOwnProperty.call(object(value.origins),type.id))result.origins[type.id]=type.sources?.includes(value.origins[type.id])?value.origins[type.id]:null;
   }}
   return result;
  }
  function capture(){
   return {learn:c?.active?c.tapState:b.state,hard:c?.active&&!b.config.independentDifficulty?c.tapHard:b.advancedMode,play:!!c?.active,
    free:c?.active?b.state:c?.freeState,items:c?.items.map(({id,topping,x,y,scale,rotate,flip})=>({id,topping,x,y,scale,rotate,flip}))||[],selected:c?.selected,
    activeSlot:b.activeSlot,activeLayer:b.activeLayer,conversation:{lastResponse:b.lastResponse,responseSlot:b.responseSlot,nextPrompt:b.nextPrompt},
    slots:b.slots?{items:b.slots.items,active:b.slots.active}:null,
    choices:Object.fromEntries(['example-choice','sentence-example'].map(id=>[id,document.getElementById(id)?.value])),
    seed:b.seed,positions:[...b.positions],selectionOrder:b.selectionOrder};
  }
  function restore(raw,{temporary=false}={}){
   raw=object(raw);
   // Hydrate both states without transient visibility/detach transitions.
   c?.gestures.cancel();if(c){c.drag=null;c.active=false;}
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
   if('lastResponse' in b){b.lastResponse=typeof raw.conversation?.lastResponse==='string'?raw.conversation.lastResponse:'';b.responseSlot=raw.conversation?.responseSlot===1?1:0;b.nextPrompt=raw.conversation?.nextPrompt===true;}
   if(b.refreshLayers)b.refreshLayers();
   else if(!defaults.slots)b.config.toppings.forEach(x=>b.setLevel(x.id,b.state.toppings[x.id],false,{animate:false}));
   if(b.config.bases)b.setBase(b.state.base,false);
   b.setSauce(b.state.sauce,false);b.updateSentence();
   if(!c)return;
   const free=state(raw.free);delete free.slots;delete free.layers;c.freeState=free;
   const items=(Array.isArray(raw.items)?raw.items:[]).slice(0,temporary?undefined:120);
   // Rebuild unique runtime IDs; preserve array order and selected item by old ID.
   c.items=items.filter(x=>x&&c.catalog.some(t=>t.id===x.topping)).map((x,i)=>({id:i+1,topping:x.topping,x:number(x.x,50,-1000,1000),y:number(x.y,50,-1000,1000),scale:number(x.scale,c.sizes.initial,c.sizes.min,c.sizes.max),rotate:number(x.rotate,0,-36000,36000)%360,flip:x.flip===true,oldId:x.id}));
   c.nextId=c.items.length+1;c.selected=c.items.find(x=>x.oldId===raw.selected)?.id||null;
   // Apply the final mode once. Reusing a detached size container through a
   // LEARN→PLAY round trip can leave WebKit's render tree at zero size.
   c.tapState=b.state;c.tapHard=b.advancedMode;c.active=raw.play===true;
   if(c.active){b.state=c.freeState;if(!b.config.independentDifficulty)b.advancedMode=false;}
   const restored=c.items,selected=c.selected;c.items=[];c.selected=null;c.renderMode();
   restored.forEach(item=>{delete item.oldId;c.items.push(item);c.mount(item,true)});
   c.orderedItems().forEach((item,i)=>{item.stackIndex=i+1;item.node.style.zIndex=i+1});
   if(c.active){c.pizza.closest?.('.builder-art-area')?.fitArtwork?.();c.sync();}
   c.select(selected);
   b.updateSentence();
   if(!temporary&&!c.active)b.animateRestoredCreation?.();
  }
  return {capture,restore,canSave:()=>!b.restoreFailed&&b.resetRecovery?.canSave()!==false,onRestoreError:()=>b.announce(t('Saved creation could not be opened. Reload to try again.'))};
 }
 window.BuilderAutosave={adapter};
 document.addEventListener('DOMContentLoaded',()=>{
  for(const [id,b] of [['pizza',window.pizzaBuilder],['parfait',window.parfaitBuilder],['sandwich',window.sandwichBuilder],['builder-lab',window.labBuilder]]){
   if(b){const storage=adapter(b);const session=window.ActivityAutosave.connect(id,window.ActivityAchievements?.builderAdapter(id,storage)||storage);b.resetRecovery=installReset(b,storage,session.flush);}
  }
 });
})();
