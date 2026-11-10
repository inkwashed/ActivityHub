/* Independent FREE composition. TAP nodes and placements remain untouched. */
(() => {
  const t = text => window.ActivityHubI18n?.t(text) || text;
  const usableRect=rect=>rect&&[rect.width,rect.height].every(n=>Number.isFinite(n)&&n>0)&&[rect.left??0,rect.top??0].every(Number.isFinite);
  class CreativeBuilder {
    constructor(builder, options = {}) {
      this.options=options;this.catalog=options.catalog||builder.config.toppings;
      this.builder = builder; this.active = false; this.items = []; this.sizes=builder.config.creativeSizes; this.nextId = 1; this.selected = null;
      this.freeState = { sauce: null, toppings: Object.fromEntries(builder.config.toppings.map(x => [x.id, 0])) };
      this.pizza = document.querySelector(options.scene || '#pizza');
      this.gestures=new window.PieceGestures({enabled:()=>this.active,bounds:()=>this.pizza.getBoundingClientRect(),select:item=>this.select(item.id),change:(item,resizing)=>{this.constrain(item);this.paint(item);if(resizing)this.sync();}});
      this.gestures.bindSurface(this.pizza);
      document.addEventListener('builder:workspace-ready',event=>{
        if(!event.detail.contains(this.pizza))return;
        this.gestures.bindSurface(event.detail);
        event.detail.addEventListener('pointerdown',e=>this.clearFromBackground(e));
        event.detail.repaintArtwork=()=>{
          if(!this.active)return;
          // The workspace has already fitted the complete scene. Bounds checks
          // must not start another fit for each oversized piece in this pass.
          const fitting=this.fitting;this.fitting=true;
          try{this.items.forEach(item=>this.paint(item))}finally{this.fitting=fitting}
        };
      });
      this.layer = document.createElement('div');this.layer.className = 'free-layer builder-inactive-layer';this.layer.style.opacity='0';this.layer.inert=true;this.layer.setAttribute('aria-hidden','true');this.pizza.append(this.layer);
      this.tools = document.querySelector('#free-tools');this.picker = document.querySelector('#piece-picker');
      // Tool gestures must not reach the editing surface beneath the overlay.
      this.tools.addEventListener('pointerdown',event=>event.stopPropagation());
      this.toggle = document.querySelector('#free-mode');this.difficulty = document.querySelector('#advanced-mode');
      this.actions = new Map();
      this.pickerWrap = document.querySelector('#piece-picker-wrap');
      const help = document.querySelector('#free-info-dialog');
      document.querySelector('#free-info').addEventListener('click', () => {this.updateHelp();help.showModal();});
      document.querySelector('#free-info-close').addEventListener('click', () => help.close());
      for (const [action,label] of [['larger','Larger'],['smaller','Smaller'],['left','Rotate left'],['right','Rotate right'],['flip','Flip'],['duplicate','Duplicate'],['top','Move to top of group'],['delete','Delete']]) {
        const b = document.createElement('button');b.type='button';b.className='ah-button ah-button-icon';b.setAttribute('aria-label',t(label));b.title=t(label);b.setAttribute('data-i18n-aria-label',label);b.setAttribute('data-i18n-title',label);b.disabled=true;
        const icon = {left:'rotate-left',right:'rotate-right',flip:'flip',duplicate:'duplicate',top:'top',delete:'delete',smaller:'smaller',larger:'larger'}[action];
        b.innerHTML=`<img src="../../shared/icons/${icon}.svg" alt="" aria-hidden="true">`;
        b.addEventListener('click',()=>this.edit(action));this.actions.set(action,b);this.tools.querySelector('.free-toolbar').append(b);
      }
      this.toggle.addEventListener('change',()=>this.switchMode(this.toggle.checked));
      this.picker.addEventListener('change',()=>this.select(Number(this.picker.value)||null));
      this.pizza.addEventListener('pointerdown',e=>this.clearFromBackground(e));
      document.addEventListener('activityhub:languagechange',()=>{if(this.active)this.refreshPicker();this.updateHelp()});
    }
    updateHelp() {
      const title=this.active?'About PLAY mode':'About LEARN mode';
      const text=this.options.help?.[this.active?'play':'learn'] || (this.active?"Add one piece, then drag it. Pinch with two fingers or use + and − to change its size. PLAY counts small, medium, and big pieces.":"Choose a sauce, then tap toppings to add more. Three dots means extra; tap once more to remove. Read your order aloud. Try HARD for more detailed sentences.");
      const heading=document.querySelector('#free-info-title'), body=document.querySelector('#mode-help-text');
      heading.dataset.i18n=title;heading.textContent=t(title);
      body.dataset.i18n=text;body.textContent=t(text);
      const button=document.querySelector('#free-info');
      button.setAttribute('data-i18n-aria-label',title);button.setAttribute('aria-label',t(title));
    }
    switchMode(active) {
      if(active===this.active)return;
      this.gestures.cancel();this.drag=null;
      if(active){this.tapState=this.builder.state;this.tapHard=this.builder.advancedMode;this.builder.state=this.freeState;if(!this.builder.config.independentDifficulty)this.builder.advancedMode=false;}
      else {this.freeState=this.builder.state;this.builder.state=this.tapState;if(!this.builder.config.independentDifficulty)this.builder.advancedMode=this.tapHard;}
      this.active=active;this.renderMode();
    }
    renderMode(){
      const active=this.active;this.updateHelp();this.toggle.checked=active;if(this.difficulty){this.difficulty.checked=this.builder.advancedMode;this.difficulty.disabled=(active&&!this.builder.config.independentDifficulty) || !!this.options.easyOnly;}
      document.querySelector('#builder').classList.toggle('is-free',active);
      document.querySelector('#builder').classList.toggle('is-create',active);
      document.querySelector('#topping-options').choicePager?.setExpanded(active);
      this.tools.hidden=this.pickerWrap.hidden=!active;
      // Keep sizing containers mounted across rapid switches. display:none or
      // detach/reinsert can leave nested container-query boxes stale in WebKit.
      // Opacity avoids inherited-visibility invalidation on rapid mode changes.
      for(const [layer,inactive] of [[this.layer,!active],[this.builder.pieces,active]]){
        layer.hidden=false;layer.classList.toggle('builder-inactive-layer',inactive);
        layer.inert=inactive;layer.setAttribute('aria-hidden',String(inactive));
      }
      // Apply only the final visual mode in this task, including rapid switches.
      // State, inertness and accessibility update synchronously above.
      if(!this.modeVisibilityPending){
        this.modeVisibilityPending=true;
        Promise.resolve().then(()=>{
          this.modeVisibilityPending=false;
          this.layer.style.opacity=this.active?'1':'0';
          this.builder.pieces.style.opacity=this.active?'0':'1';
        });
      }
      this.pizza.setAttribute('role',active?'group':'img');
      if(this.builder.config.bases)this.builder.setBase(this.builder.state.base ?? null,false);
      this.builder.setSauce(this.builder.state.sauce,false);
      this.builder.config.toppings.forEach(x=>this.builder.updateButton(x));
      this.pizza.closest?.('.builder-art-area')?.fitArtwork?.();
      if(active)this.items.forEach(item=>this.paint(item));
      this.refreshPicker();this.select(this.selected);if(active)this.options.onSync?.(this);
      this.builder.announce(active?(this.builder.config.independentDifficulty?'Play mode.':'Play mode. Easy language is on.'):'Learn mode.');
    }
    topping(item){return this.catalog.find(x=>x.id===item.topping)}
    constrain(item){
      const frame=this.options?.placementBounds?.()||this.pizza.closest?.('.builder-art-area, .builder-play-area');
      if(frame){
        item.scale=Math.max(this.sizes.min,Math.min(this.sizes.max,item.scale));
        const scene=this.pizza.getBoundingClientRect(),area=frame.getBoundingClientRect();
        if(!usableRect(scene)||!usableRect(area))return;
        // Bound the rotated visible artwork to the usable canvas, excluding tools.
        const size=(this.topping(item).creativeSize ?? this.topping(item).size)*item.scale;
        const box=item.artBounds||{x:0,y:0,width:1,height:1};
        const angle=(item.rotate||0)*Math.PI/180;
        const dx=(box.x+box.width/2-.5)*size*(item.flip?-1:1),dy=(box.y+box.height/2-.5)*size;
        const ox=dx*Math.cos(angle)-dy*Math.sin(angle),oy=(dx*Math.sin(angle)+dy*Math.cos(angle))*scene.width/(scene.height||scene.width);
        const hitWidth=Math.max(44,size*(box.width+.04)*scene.width/100),hitHeight=Math.max(44,size*(box.height+.04)*scene.width/100);
        const measuredBounds=frame.fitArtwork||this.options?.placementBounds,editingGap=frame.fitArtwork?6:0;
        const halfWidth=measuredBounds?(Math.abs(Math.cos(angle))*hitWidth+Math.abs(Math.sin(angle))*hitHeight)/2+editingGap:size*(Math.abs(Math.cos(angle))*box.width+Math.abs(Math.sin(angle))*box.height)*scene.width/200;
        const halfHeight=measuredBounds?(Math.abs(Math.sin(angle))*hitWidth+Math.abs(Math.cos(angle))*hitHeight)/2+editingGap:size*(Math.abs(Math.sin(angle))*box.width+Math.abs(Math.cos(angle))*box.height)*scene.width/200;
        if(!this.fitting&&item.node&&frame.fitArtwork&&(halfWidth*2>area.width||halfHeight*2>area.height)){
          this.fitting=true;try{this.paint(item,false);frame.fitArtwork();this.constrain(item);}finally{this.fitting=false}return;
        }
        const insetX=Math.min(area.width/2,Math.max(22,halfWidth)),insetY=Math.min(area.height/2,Math.max(22,halfHeight));
        const left=(area.left-scene.left+insetX)/scene.width*100-ox,right=(area.right-scene.left-insetX)/scene.width*100-ox;
        const top=(area.top-scene.top+insetY)/scene.height*100-oy,bottom=(area.bottom-scene.top-insetY)/scene.height*100-oy;
        item.x=Math.max(left,Math.min(right,item.x));item.y=Math.max(top,Math.min(bottom,item.y));return;
      }
      if(this.options.constrain){this.options.constrain(item,this);return;}
      item.scale=Math.max(this.sizes.min,Math.min(this.sizes.max,item.scale));
      // Positions remain pizza-relative; movement is bounded by the full stage.
      const pizza=this.pizza.getBoundingClientRect();
      const stage=this.pizza.closest?.('.pizza-stage')?.getBoundingClientRect() || pizza;
      if(!usableRect(pizza)||!usableRect(stage))return;
      const width=pizza.width, height=pizza.height||width;
      const angle=item.rotate*Math.PI/180;
      const half=this.topping(item).size*item.scale/2*(Math.abs(Math.cos(angle))+Math.abs(Math.sin(angle)));
      const left=((stage.left||0)-(pizza.left||0))/width*100;
      const top=((stage.top||0)-(pizza.top||0))/height*100;
      const right=left+stage.width/width*100, bottom=top+(stage.height||stage.width)/height*100;
      item.x=Math.max(Math.min(left+half,(left+right)/2),Math.min(Math.max(right-half,(left+right)/2),item.x));
      item.y=Math.max(Math.min(top+half,(top+bottom)/2),Math.min(Math.max(bottom-half,(top+bottom)/2),item.y));
    }
    add(id,copy) {
      if(this.items.length>=120){this.builder.announce('Pizza is full. Remove a piece to add another.');return;}
      const n=this.items.length;
      const item=copy?{...copy,id:this.nextId++,x:copy.x+3,y:copy.y+3}:{id:this.nextId++,topping:id,x:50+Math.cos(n*2.4)*Math.min(n,12),y:50+Math.sin(n*2.4)*Math.min(n,12),scale:this.sizes.initial,rotate:this.topping({topping:id}).rotation||0,flip:false};
      this.constrain(item);this.items.push(item);this.mount(item);this.sync();this.select(item.id);
    }
    mount(item,preservePosition=false){
      const node=document.createElement('button');node.type='button';node.className='free-piece';node.dataset.piece=String(item.id);
      node.setAttribute('aria-label',this.topping(item).label);
      node.setAttribute('aria-pressed',String(item.id===this.selected));
      item.renderedArt=this.options.art?this.options.art(item,this):this.topping(item).art;
      node.innerHTML=`<span class="free-art">${item.renderedArt}</span>`;
      this.layer.append(node);item.node=node;item.measuredArt=null;
      node.addEventListener('click',()=>this.select(item.id));
      this.gestures.bind(node,item);
      node.addEventListener('keydown',e=>{
        const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
        if(moves[e.key]){e.preventDefault();this.select(item.id);const [x,y]=moves[e.key];item.x+=x*(e.shiftKey?3:1);item.y+=y*(e.shiftKey?3:1);this.constrain(item);this.paint(item);}
        if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();this.select(item.id);this.edit('delete');const next=this.items.find(x=>x.id===this.selected);if(next)next.node.focus({preventScroll:true});else this.picker.focus();}
      });
      this.paint(item,!preservePosition);
    }
    // PLAY stacking contract: this order drives picker, depth, deletion, and exports.
    // Category layers are explicit; stable sorting preserves insertion order within them.
    orderedItems(){return this.syncOrder||[...this.items].sort((a,b)=>(this.topping(a).layer||0)-(this.topping(b).layer||0));}
    paint(item,constrain=true){
      if(this.options.art){
        const art=this.options.art(item,this);
        if(art!==item.renderedArt){item.node.innerHTML=`<span class="free-art">${art}</span>`;item.renderedArt=art;}
      }
      this.trimArtwork(item);
      if(constrain&&this.pizza.closest?.('.builder-art-area, .builder-play-area'))this.constrain(item);
      const size=(this.topping(item).creativeSize ?? this.topping(item).size)*item.scale;
      item.node.setAttribute('aria-label',`${window.FoodBuilder.sizeBand(item.scale,this.sizes)} ${this.topping(item).countSingular||this.topping(item).label}`);
      item.node.style.cssText=`left:${item.x}%;top:${item.y}%;z-index:${item.stackIndex??this.items.indexOf(item)+1};--food-size:${size};--angle:${item.rotate}deg;--flip:${item.flip?-1:1}`;
    }
    trimArtwork(item){
      if(item.measuredArt===item.renderedArt)return;
      const art=item.node.querySelector('.free-art'),svg=art?.querySelector('svg');
      if(!svg?.getBBox)return;
      const box=svg.getBBox(),view=svg.viewBox.baseVal;
      if(!box.width||!box.height||!view.width||!view.height)return;
      item.artBounds={x:(box.x-view.x)/view.width,y:(box.y-view.y)/view.height,width:box.width/view.width,height:box.height/view.height};
      const b=item.artBounds,hit=document.createElement('span');hit.className='piece-hit';hit.setAttribute('aria-hidden','true');
      hit.style.cssText=`left:${(b.x+b.width/2)*100}%;top:${(b.y+b.height/2)*100}%;width:${(b.width+.04)*100}%;height:${(b.height+.04)*100}%`;
      art.append(hit);item.node.setAttribute('data-trimmed','true');item.measuredArt=item.renderedArt;
    }
    clearFromBackground(event){
      if(event.button!=null&&event.button!==0)return;
      if(this.gestures.item||event.target.closest('.free-piece,button,a,input,select'))return;
      if(this.active)this.select(null);
      else this.options.onBackgroundSelect?.(this);
    }
    select(id){
      this.selected=this.items.some(x=>x.id===id)?id:null;
      this.items.forEach(x=>{const selected=x.id===this.selected;x.node.classList.toggle('selected',selected);x.node.setAttribute('aria-pressed',String(selected));});
      this.actions.forEach(b=>b.disabled=this.selected===null);this.picker.value=this.selected?String(this.selected):'';
      this.options.onSelect?.(this);
    }
    edit(action){
      const item=this.items.find(x=>x.id===this.selected);if(!item)return;
      if(action==='top'){
        this.gestures.cancel();
        this.items.splice(this.items.indexOf(item),1);this.items.push(item);
        this.sync();this.select(item.id);return;
      }
      if(action==='duplicate'){const {node,...copy}=item;this.add(item.topping,copy);return;}
      if(action==='delete'){
        this.gestures.cancel();
        const ordered=this.orderedItems(),index=ordered.indexOf(item);
        item.node.remove();this.items.splice(this.items.indexOf(item),1);ordered.splice(index,1);
        const next=ordered[Math.max(0,index-1)];
        this.selected=next?next.id:null;
        this.sync();this.select(this.selected);this.pizza.closest?.('.builder-art-area')?.fitArtwork?.();return;
      }
      if(action==='smaller')item.scale-=this.sizes.step;if(action==='larger')item.scale+=this.sizes.step;
      if(action==='left')item.rotate=(item.rotate-15+360)%360;if(action==='right')item.rotate=(item.rotate+15)%360;
      if(action==='flip')item.flip=!item.flip;
      this.constrain(item);this.paint(item);this.sync();
      if(action==='smaller')this.pizza.closest?.('.builder-art-area')?.fitArtwork?.();
    }
    refreshPicker(){
      this.picker.replaceChildren();const empty=document.createElement('option');empty.value='';empty.textContent=t('Select a piece');this.picker.append(empty);
      this.orderedItems().forEach((item,i)=>{const option=document.createElement('option');option.value=String(item.id);option.textContent=`${i+1}. ${window.FoodBuilder.sizeBand(item.scale,this.sizes)} ${this.topping(item).countSingular||this.topping(item).label}`;this.picker.append(option)});
      this.picker.value=this.selected?String(this.selected):'';
    }
    sync(){
      this.syncOrder=this.orderedItems();
      try {
      this.syncOrder.forEach((item,index)=>{item.stackIndex=index+1;item.node.style.zIndex=index+1;});
      this.builder.config.toppings.forEach(x=>{this.freeState.toppings[x.id]=this.items.some(i=>i.topping===x.id)?1:0;this.builder.updateButton(x)});
      this.builder.updateSentence();this.refreshPicker();this.options.onSync?.(this);
      }finally{this.syncOrder=null;}
    }
    clear(){
      this.gestures.cancel();this.drag=null;this.items.forEach(x=>x.node.remove());this.items=[];this.selected=null;
      this.sync();this.select(null);this.builder.setSauce(null,false);if(this.builder.config.bases)this.builder.setBase(null,false);this.builder.announce(this.options.resetMessage||'Creative pizza reset.');this.pizza.closest?.('.builder-art-area')?.fitArtwork?.();
    }
  }
  window.CreativeBuilder=CreativeBuilder;
})();
