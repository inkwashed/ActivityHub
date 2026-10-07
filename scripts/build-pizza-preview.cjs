// Rebuild the homepage example from the applet's artwork and placement engine.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.join(__dirname, '..');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'apps/pizza/config.js'),'utf8'),context);
const engine = fs.readFileSync(path.join(root,'shared/builder.js'),'utf8');
vm.runInNewContext(engine.replace('window.pizzaBuilder = new FoodBuilder(document.querySelector(\'#builder\'), window.PIZZA_CONFIG);',''),context);
const config = context.window.PIZZA_CONFIG;
const builder = Object.create(context.window.FoodBuilder.prototype);
builder.seed = config.seed >>> 0;
builder.positions = new Map();
const sauce = config.sauces.find(item => item.id === 'tomato');
let art = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360"><defs><radialGradient id="crust"><stop offset="0.877" stop-color="#f3c76e"/><stop offset="0.947" stop-color="#e9ac50"/><stop offset="1" stop-color="#c18739"/></radialGradient><radialGradient id="sauce" cx="34%" cy="28%" r="75%"><stop stop-color="${sauce.highlight}"/><stop offset="1" stop-color="${sauce.color}"/></radialGradient><pattern id="grain" width="12" height="100" patternUnits="userSpaceOnUse"><path d="M0 0V100" stroke="#bf9157" opacity=".14" stroke-width=".6"/></pattern></defs><g transform="translate(80 20) scale(3.2)"><circle cx="50" cy="50" r="49" fill="#e7c591" stroke="#e1bc84" stroke-width="2"/><circle cx="50" cy="50" r="47" fill="url(#grain)"/><g transform="translate(5 5) scale(.9)"><circle cx="50" cy="50" r="50" fill="url(#crust)"/><circle cx="50" cy="50" r="42" fill="url(#sauce)"/>`;
for (const id of ['cheese','corn']) {
 const topping = config.toppings.find(item => item.id === id);
 for (const p of builder.placements(topping).slice(0,topping.counts[2])) {
  const size=topping.size;
  art+=`<g transform="translate(${p.x} ${p.y}) rotate(${p.rotate}) scale(${p.scale})">${topping.art.replace('<svg ',`<svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" `)}</g>`;
 }
}
art+='</g></g></svg>\n';
fs.writeFileSync(path.join(root,'assets/pizza-preview.svg'),art);
