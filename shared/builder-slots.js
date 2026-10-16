/* Opt-in fixed-slot fixture. Existing builders are migrated only after lab review. */
(() => {
 class BuilderSlots {
  constructor(root,{catalog,count=3,onChange=()=>{}}){
   this.root=root;this.catalog=catalog;this.onChange=onChange;this.items=Array(count).fill(null);this.active=0;this.controls=[];this.swaps=[];
   for(let i=0;i<count;i++){
    const wrap=document.createElement('div'),choose=document.createElement('button'),clear=document.createElement('button');
    wrap.className='builder-slot';choose.type=clear.type='button';choose.className='ah-choice';clear.className='ah-button slot-clear';clear.innerHTML='<span aria-hidden="true">×</span>';clear.setAttribute('aria-label',`Clear item ${i+1}`);
    choose.addEventListener('click',()=>{this.active=i;this.refresh()});
    clear.addEventListener('click',()=>{this.items[i]=null;this.active=i;this.refresh();choose.focus()});
    wrap.append(choose,clear);root.append(wrap);this.controls.push({choose,clear});
    if(i<count-1){const swap=document.createElement('button');swap.type='button';swap.className='ah-button ah-button-icon';swap.setAttribute('aria-label',`Swap items ${i+1} and ${i+2}`);swap.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7H20M16 3L20 7L16 11M19 17H4M8 13L4 17L8 21"/></svg>';swap.addEventListener('click',()=>this.swap(i));root.append(swap);this.swaps.push(swap)}
   }
   this.refresh();
  }
  choose(id){if(!this.catalog.some(x=>x.id===id))return;this.items[this.active]={id};this.refresh()}
  swap(i){if(i<0||i>=this.items.length-1)return;[this.items[i],this.items[i+1]]=[this.items[i+1],this.items[i]];if(this.active===i)this.active++;else if(this.active===i+1)this.active--;this.refresh()}
  reset(){this.items.fill(null);this.active=0;this.refresh()}
  refresh(){
   this.controls.forEach(({choose,clear},i)=>{const item=this.catalog.find(x=>x.id===this.items[i]?.id);choose.innerHTML=`<span class="slot-art" aria-hidden="true">${item?.art||'<svg viewBox="0 0 24 24" fill="none" stroke="#8a918c" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6L18.4 18.4"/></svg>'}</span>`;choose.setAttribute('aria-label',`Item ${i+1}: ${item?.label||'Choose an ingredient'}`);choose.setAttribute('aria-pressed',String(i===this.active));clear.hidden=!item});
   this.swaps.forEach((button,i)=>button.disabled=JSON.stringify(this.items[i])===JSON.stringify(this.items[i+1]));this.onChange(this);
  }
 }
 window.BuilderSlots=BuilderSlots;
})();
