/* Independent FREE composition. TAP nodes and placements remain untouched. */
(() => {
  const t = text => window.ActivityHubI18n?.t(text) || text;
  class CreativePizza {
    constructor(builder) {
      this.builder = builder; this.active = false; this.items = []; this.sizes=builder.config.creativeSizes; this.nextId = 1; this.selected = null;
      this.freeState = { sauce: null, toppings: Object.fromEntries(builder.config.toppings.map(x => [x.id, 0])) };
      this.pizza = document.querySelector('#pizza');
      this.gestures=new window.PieceGestures({enabled:()=>this.active,bounds:()=>this.pizza.getBoundingClientRect(),select:item=>this.select(item.id),change:(item,resizing)=>{this.constrain(item);this.paint(item);if(resizing)this.sync();}});
      this.gestures.bindSurface(this.pizza);
      this.layer = document.createElement('div');this.layer.className = 'free-layer';this.layer.hidden = true;this.pizza.append(this.layer);
      this.tools = document.querySelector('#free-tools');this.picker = document.querySelector('#piece-picker');
      // Move the same controls, preserving listeners, state, and keyboard order.
      if(window.matchMedia){
        const stacked=window.matchMedia('(orientation:portrait), (max-width:899px), (max-height:599px)');
        const placeTools=()=>{
          const host=document.querySelector(stacked.matches?'#pizza-workspace':'.pizza-menu-body');
          const before=document.querySelector(stacked.matches?'.order':'#pizza-menu');
          host.insertBefore(this.tools,before);
        };
        stacked.addEventListener('change',placeTools);placeTools();
      }
      this.toggle = document.querySelector('#free-mode');this.difficulty = document.querySelector('#advanced-mode');
      this.actions = new Map();
      this.pickerWrap = document.querySelector('#piece-picker-wrap');
      const help = document.querySelector('#free-info-dialog');
      document.querySelector('#free-info').addEventListener('click', () => help.showModal());
      document.querySelector('#free-info-close').addEventListener('click', () => help.close());
      for (const [action,label] of [['larger','Larger'],['smaller','Smaller'],['left','Rotate left'],['right','Rotate right'],['flip','Flip'],['duplicate','Duplicate'],['delete','Delete']]) {
        const b = document.createElement('button');b.type='button';b.className='ah-button ah-button-icon';b.setAttribute('aria-label',t(label));b.title=t(label);b.setAttribute('data-i18n-aria-label',label);b.setAttribute('data-i18n-title',label);b.disabled=true;
        const icon = {left:'rotate-left',right:'rotate-right',flip:'flip',duplicate:'duplicate',delete:'delete',smaller:'smaller',larger:'larger'}[action];
        b.innerHTML=`<img src="../../shared/icons/${icon}.svg" alt="" aria-hidden="true">`;
        b.addEventListener('click',()=>this.edit(action));this.actions.set(action,b);this.tools.querySelector('.free-toolbar').append(b);
      }
      this.toggle.addEventListener('change',()=>this.switchMode(this.toggle.checked));
      this.picker.addEventListener('change',()=>this.select(Number(this.picker.value)||null));
      this.pizza.addEventListener('pointerdown',e=>{if(this.active && !this.gestures.item && !e.target.closest('.free-piece'))this.select(null)});
      document.addEventListener('activityhub:languagechange',()=>{if(this.active)this.refreshPicker()});
    }
    switchMode(active) {
      if(active===this.active)return;
      this.gestures.cancel();this.drag=null;
      if(active){this.tapState=this.builder.state;this.tapHard=this.builder.advancedMode;this.builder.state=this.freeState;this.builder.advancedMode=false;}
      else {this.freeState=this.builder.state;this.builder.state=this.tapState;this.builder.advancedMode=this.tapHard;}
      this.active=active;this.toggle.checked=active;this.difficulty.checked=this.builder.advancedMode;this.difficulty.disabled=active;
      document.querySelector('#builder').classList.toggle('is-free',active);
      document.querySelector('#builder').classList.toggle('is-create',active);
      document.querySelector('#topping-options').choicePager?.setExpanded(active);
      this.tools.hidden=this.layer.hidden=this.pickerWrap.hidden=!active;this.builder.pieces.hidden=active;
      this.pizza.setAttribute('role',active?'group':'img');
      this.builder.setSauce(this.builder.state.sauce,false);
      this.builder.config.toppings.forEach(x=>this.builder.updateButton(x));
      this.refreshPicker();this.select(this.selected);
      this.builder.announce(active?'Play mode. Easy language is on.':'Learn mode.');
    }
    topping(item){return this.builder.config.toppings.find(x=>x.id===item.topping)}
    constrain(item){
      item.scale=Math.max(this.sizes.min,Math.min(this.sizes.max,item.scale));
      const radius=Math.max(0,44-this.topping(item).size*item.scale*.7072);
      const dx=item.x-50,dy=item.y-50,d=Math.hypot(dx,dy);
      if(d>radius){item.x=50+dx*radius/d;item.y=50+dy*radius/d;}
    }
    add(id,copy) {
      if(this.items.length>=120){this.builder.announce('Pizza is full. Remove a piece to add another.');return;}
      const n=this.items.length;
      const item=copy?{...copy,id:this.nextId++,x:copy.x+3,y:copy.y+3}:{id:this.nextId++,topping:id,x:50+Math.cos(n*2.4)*Math.min(n,12),y:50+Math.sin(n*2.4)*Math.min(n,12),scale:this.sizes.initial,rotate:0,flip:false};
      this.constrain(item);this.items.push(item);this.mount(item);this.sync();this.select(item.id);
    }
    mount(item){
      const node=document.createElement('button');node.type='button';node.className='free-piece';node.dataset.piece=String(item.id);
      node.setAttribute('aria-label',this.topping(item).label);node.innerHTML=`<span class="free-art">${this.topping(item).art}</span>`;
      this.layer.append(node);item.node=node;
      node.addEventListener('click',()=>this.select(item.id));
      this.gestures.bind(node,item);
      node.addEventListener('keydown',e=>{
        const moves={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
        if(moves[e.key]){e.preventDefault();this.select(item.id);const [x,y]=moves[e.key];item.x+=x*(e.shiftKey?3:1);item.y+=y*(e.shiftKey?3:1);this.constrain(item);this.paint(item);}
        if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();this.select(item.id);this.edit('delete');const next=this.items.find(x=>x.id===this.selected);if(next)next.node.focus({preventScroll:true});else this.picker.focus();}
      });
      this.paint(item);
    }
    paint(item){
      const size=this.topping(item).size*item.scale;
      item.node.setAttribute('aria-label',`${window.FoodBuilder.sizeBand(item.scale,this.sizes)} ${this.topping(item).countSingular||this.topping(item).label}`);
      item.node.style.cssText=`left:${item.x}%;top:${item.y}%;z-index:${this.builder.config.toppings.findIndex(x=>x.id===item.topping)+1};--food-size:${size};--angle:${item.rotate}deg;--flip:${item.flip?-1:1}`;
    }
    select(id){
      this.selected=this.items.some(x=>x.id===id)?id:null;
      this.items.forEach(x=>x.node.classList.toggle('selected',x.id===this.selected));
      this.actions.forEach(b=>b.disabled=this.selected===null);this.picker.value=this.selected?String(this.selected):'';
    }
    edit(action){
      const item=this.items.find(x=>x.id===this.selected);if(!item)return;
      if(action==='duplicate'){const {node,...copy}=item;this.add(item.topping,copy);return;}
      if(action==='delete'){
        this.gestures.cancel();
        const index=this.items.indexOf(item);
        item.node.remove();this.items.splice(index,1);
        const next=this.items[Math.max(0,index-1)];
        this.selected=next?next.id:null;
        this.sync();this.select(this.selected);return;
      }
      if(action==='smaller')item.scale-=this.sizes.step;if(action==='larger')item.scale+=this.sizes.step;
      if(action==='left')item.rotate=(item.rotate-15+360)%360;if(action==='right')item.rotate=(item.rotate+15)%360;
      if(action==='flip')item.flip=!item.flip;
      this.constrain(item);this.paint(item);this.sync();
    }
    refreshPicker(){
      this.picker.replaceChildren();const empty=document.createElement('option');empty.value='';empty.textContent=t('Select a piece');this.picker.append(empty);
      this.items.forEach((item,i)=>{const option=document.createElement('option');option.value=String(item.id);option.textContent=`${i+1}. ${window.FoodBuilder.sizeBand(item.scale,this.sizes)} ${this.topping(item).countSingular||this.topping(item).label}`;this.picker.append(option)});
      this.picker.value=this.selected?String(this.selected):'';
    }
    sync(){
      this.builder.config.toppings.forEach(x=>{this.freeState.toppings[x.id]=this.items.some(i=>i.topping===x.id)?1:0;this.builder.updateButton(x)});
      this.builder.updateSentence();this.refreshPicker();
    }
    clear(){
      this.gestures.cancel();this.drag=null;this.items.forEach(x=>x.node.remove());this.items=[];this.selected=null;
      this.sync();this.select(null);this.builder.setSauce(null,false);this.builder.announce('Creative pizza reset.');
    }
  }
  window.CreativePizza=CreativePizza;
  window.pizzaBuilder.creative=new CreativePizza(window.pizzaBuilder);
})();
