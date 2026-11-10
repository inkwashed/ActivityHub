window.CreativePizza=window.CreativeBuilder;
window.pizzaBuilder.creative=new window.CreativeBuilder(window.pizzaBuilder,{help:{learn:'Choose a sauce, then tap toppings to add more. Three dots means extra; tap again to remove.',play:'Tap toppings to add pieces. Drag to arrange; pinch or use the tools to resize. Use the item menu to bring hidden pieces into view.'}});
const pizzaDifficultyHelp=document.querySelector('#difficulty-info-dialog');
document.querySelector('#difficulty-info')?.addEventListener('click',()=>pizzaDifficultyHelp.showModal());
document.querySelector('#difficulty-info-close')?.addEventListener('click',()=>pizzaDifficultyHelp.close());
