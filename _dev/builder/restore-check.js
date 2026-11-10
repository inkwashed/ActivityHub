/* Real rendered-bounds regression harness. No production app imports this file. */
(() => {
 const run=document.querySelector('#run'),out=document.querySelector('#results'),stage=document.querySelector('#stage');
 const delay=ms=>new Promise(r=>setTimeout(r,ms));
 const assert=(ok,message)=>{if(!ok)throw Error(message)};
 run.onclick=async()=>{
  run.disabled=true;out.textContent='Running…\n';let failures=0;
  for(const [path,name,key] of [['apps/parfait','parfait','parfait'],['apps/pizza','pizza','pizza'],['apps/sandwich','sandwich','sandwich'],['apps/class-supplies','supplies','class-supplies'],['_dev/builder','lab','builder-lab']]){
   if(new URLSearchParams(location.search).has('app')&&new URLSearchParams(location.search).get('app')!==name)continue;
   const storageKey='letseigo.app.'+key,previous=localStorage.getItem(storageKey);let frame;
   try{
    localStorage.removeItem(storageKey);frame=document.createElement('iframe');frame.width=1133;frame.height=678;stage.append(frame);
    const load=()=>new Promise(resolve=>frame.onload=resolve);let loaded=load();frame.src='../../'+path+'/';await loaded;
    let w=frame.contentWindow,d=w.document,b=w[name+'Builder'];assert(b?.creative,'editor initialized');
    const settle=()=>delay(160);
    const click=async el=>{assert(el,'control exists');el.click();await settle()};
    const mode=async play=>{if(b.creative.active!==play)await click(d.querySelector('#free-mode'))};
    const hard=async value=>{if(b.advancedMode!==value&&!d.querySelector('#advanced-mode').disabled)await click(d.querySelector('#advanced-mode'))};
    const reset=()=>click(d.querySelector('#clear'));
    const add=()=>click(b.buttons.get(b.config.toppings[0].id));
    const visible=el=>el?.isConnected&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0&&w.getComputedStyle(el).display!=='none'&&w.getComputedStyle(el).visibility!=='hidden'&&w.getComputedStyle(el).opacity!=='0';
    const check=label=>{
     assert(visible(b.creative.layer),label+': PLAY layer visible '+JSON.stringify({layer:b.creative.layer.getBoundingClientRect().toJSON(),scene:b.creative.pizza.getBoundingClientRect().toJSON(),inline:b.creative.layer.getAttribute("style"),scripts:[...d.scripts].filter(s=>s.src.includes("creative-builder")).map(s=>s.src),classes:b.creative.layer.className,ancestors:[b.creative.pizza,b.creative.pizza.parentElement].map(el=>({classes:el.className,visibility:w.getComputedStyle(el).visibility})),hidden:b.creative.layer.hidden,visibility:w.getComputedStyle(b.creative.layer).visibility,active:b.creative.active}));assert(b.creative.items.length,label+': has items');
     for(const item of b.creative.items){assert(visible(item.node),label+': item visible');assert(Number.isFinite(item.x)&&Number.isFinite(item.y),label+': finite coordinates');assert(visible(item.node.querySelector('.free-art')),label+': artwork bounds');assert(visible(item.node.querySelector('svg')),label+': SVG visible');}
    };
    const move=async(item=b.creative.items[0])=>{await click(item.node);const x=item.x;item.node.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await settle();assert(b.creative.selected===item.id&&item.x>x,'restored item selectable and movable');};
    // Minimal reproduction: LEARN empty, PLAY fruit, Reset → Restore.
    await mode(true);await add();await reset();await reset();check('empty LEARN Restore');await move();await add();check('add after Restore');await move(b.creative.items.at(-1));
    // User sequence, with an independent LEARN reset between PLAY reset/restore.
    await hard(true);await reset();await mode(false);await hard(false);await reset();await mode(true);await hard(true);await reset();check('full user sequence');
    for(const learnPopulated of [false,true]){
     await mode(false);if(learnPopulated){await add();} // Retain empty LEARN on first pass.
     for(const difficulty of [false,true]){
      await mode(true);await hard(difficulty);await reset();await mode(false);await hard(!difficulty);await mode(true);await reset();check('cross-mode difficulty');
      if(b.config.independentDifficulty)assert(b.advancedMode===!difficulty,'current difficulty retained');
      await move();await add();await reset();await reset();check('repeated Restore');
     }
    }
    // LEARN Restore, then add: check actual piece boxes, not only summary data.
    await mode(false);if(!b.state.toppings[b.config.toppings[0].id])await add();await reset();await mode(true);await hard(false);await mode(false);await reset();await delay(600);
    assert([...b.groups.values()].some(g=>[...g.children].some(visible))||name==='sandwich'&&visible(b.pieces.querySelector('svg')),'LEARN artwork visible: '+JSON.stringify({state:b.state,pieces:[...b.groups.values()].flatMap(g=>[...g.children]).map(el=>({rect:el.getBoundingClientRect().toJSON(),display:w.getComputedStyle(el).display,visibility:w.getComputedStyle(el).visibility})),parent:b.pieces.getBoundingClientRect().toJSON(),hidden:b.pieces.hidden}));await add();
    if(name==='pizza')await click(d.querySelector('[data-sauce=tomato]'));
    for(const play of [false,true]){
     await mode(play);d.dispatchEvent(new w.Event('change'));await delay(300);
     loaded=load();w.location.reload();await loaded;w=frame.contentWindow;d=w.document;b=w[name+'Builder'];
     // Pizza intentionally stages reload artwork after sauce. Wait for completion.
     for(let i=0;i<70&&b.restorePieces;i++)await delay(100);
     await settle();assert(b.creative.active===play,'reload mode preserved');if(play){check('reload');await add();await move();}
    }
    for(let i=0;i<4;i++)d.querySelector('#free-mode').click();await settle();check('rapid mode switches');
    for(const [width,height] of [[390,844],[768,1024],[1133,599],[1133,678]]){frame.width=width;frame.height=height;await delay(300);check('resize '+width+'x'+height);}
    for(const language of ['ja','en']){w.ActivityHubI18n?.setLanguage(language);await settle();check('language '+language);await hard(true);await hard(false);}
    if(name!=='lab'){
     await click(d.querySelector('#share'));let image;
     for(let i=0;i<60;i++){image=d.querySelector('dialog[open] img');if(image?.complete&&image.naturalWidth)break;await delay(100);}
     assert(image?.naturalWidth>0,'Save preview generated');await click(d.querySelector('dialog[open] button'));
    }
    await reset();await add();assert(d.querySelector('#clear').textContent.trim()!=='Restore','new creation discards Restore');check('new creation');
    out.textContent+='PASS '+name+': empty/populated modes, full sequence, both difficulties, repeat/add, visibility, selection/move, reload, rapid switches, resize, languages and Save preview.\n';
   }catch(error){failures++;out.textContent+='FAIL '+name+': '+error.message+'\n';}
   finally{frame?.remove();if(previous===null)localStorage.removeItem(storageKey);else localStorage.setItem(storageKey,previous);}
  }
  out.textContent+=failures?'FAILED '+failures+' app(s).':'ALL PASS';run.disabled=false;
 };
})();
