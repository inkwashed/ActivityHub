(() => {
 const catalog=window.SANDWICH_CONFIG.toppings.map(t=>({...t,size:25,creativeSize:32,counts:[0,1,2,3],countSingular:t.label,countPlural:t.label}));
 const config={seed:42,defaultSauce:null,sauces:[],toppings:catalog,sceneSelector:'#lab-scene',resetMessage:'Builder example reset.',creativeSizes:{initial:1,min:.5,max:1.8,step:.15,smallBelow:.8,bigFrom:1.3}};
 class LabBuilder extends window.FoodBuilder{
  updateSentence(){
   super.updateSentence();
   if(!this.creative?.active){
    const names=(this.slots?.items||[]).filter(Boolean).map(x=>catalog.find(t=>t.id===x.id).label);
    const extra=catalog.filter(t=>this.state.toppings[t.id]).map(t=>this.advancedMode?`${['','a little','some','extra'][this.state.toppings[t.id]]} ${t.label}`:t.label);
    const words=[...names,...extra];
    this.setSentence(words.length?`I want ${words.join(', ')} on ${document.querySelector('#example-choice').value}.`:'I want ….');
    document.querySelector('#slot-pieces').innerHTML=names.map((name,i)=>`<span class="slot-example" style="left:${20+i*30}%;top:32%">${catalog.find(t=>t.label===name).art}</span>`).join('');
   }
   const example=document.querySelector('#sentence-example')?.value;
   if(example&&example!=='live'){
    const short='I want tomato and cheese.';
    const long='I want tomato, lettuce, green pepper, onion, cucumber, cheese, strawberry and banana on a very large wooden serving board.';
    this.setSentence(example==='short'?short:example==='long'?long:Array(4).fill(long).join(' '));
   }
  }
  clear(){if(this.creative?.active){this.creative.clear();return}super.clear();document.querySelector('#example-choice').value='a plate';this.slots?.reset();this.updateSentence()}
 }
 const b=window.labBuilder=new LabBuilder(document.querySelector('#builder'),config);
 b.slots=new window.BuilderSlots(document.querySelector('#lab-slots'),{catalog,count:3,onChange:slots=>{b.updateSentence();document.querySelector('#slot-options').querySelectorAll('button').forEach(el=>el.setAttribute('aria-pressed',String(slots.items[slots.active]?.id===el.dataset.item)))}});
 const choices=document.querySelector('#slot-options');
 catalog.slice(0,4).forEach(item=>{const button=document.createElement('button');button.type='button';button.className='ah-choice topping-button';button.dataset.item=item.id;button.setAttribute('aria-pressed','false');button.innerHTML=`<span class="ingredient-art" aria-hidden="true">${item.art}</span><span>${item.label}</span>`;button.addEventListener('click',()=>b.slots.choose(item.id));choices.append(button)});
 b.creative=new window.CreativeBuilder(b,{scene:'#lab-scene',workspace:'#lab-workspace',menuBody:'.pizza-menu-body',menu:'#lab-menu',help:{learn:'Select a slot and try replacing, clearing or swapping items. Tap the paged ingredients to cycle none, light, regular and extra. Use HARD or the output-length examples below to test longer text.',play:'Add pieces, drag or pinch them, and try rotate, flip, duplicate, TOP and delete. The picker follows back-to-front order.'},constrain(item,editor){item.scale=Math.max(editor.sizes.min,Math.min(editor.sizes.max,item.scale));item.x=Math.max(5,Math.min(95,item.x));item.y=Math.max(5,Math.min(95,item.y))}});
 b.creative.updateHelp();
 document.querySelector('#example-choice').addEventListener('change',()=>b.updateSentence());
 document.querySelector('#sentence-example').addEventListener('change',()=>b.updateSentence());
 const dialog=document.querySelector('#sample-share');document.querySelector('#share').addEventListener('click',()=>{document.querySelector('#sample-caption').textContent=document.querySelector('#sentence').textContent;dialog.showModal()});document.querySelector('#close-share').addEventListener('click',()=>dialog.close());
 b.updateSentence();
})();
