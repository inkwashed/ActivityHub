/* One 400×320 coordinate system; all path coordinates are baked in, so strokes scale uniformly. */
(() => {
 const back="<g stroke-linejoin=\"round\" stroke-linecap=\"round\"><path d=\"M 186.56 247.104 H 213.44 L 216.8 265.28 Q 221.84 279.264 257.12 293.248 L 275.6 302.08 Q 282.32 306.496 272.24 307.968 H 127.76 Q 117.68 306.496 124.4 302.08 L 142.88 293.248 Q 178.16 279.264 183.2 265.28 Z\" fill=\"#cee0d6\" fill-opacity=\".7\" stroke=\"#97b6b0\" stroke-width=\"4.4\"/><path d=\"M 193.28 250.56 L 189.92 266.752 Q 184.88 280.736 159.68 292.512\" fill=\"none\" stroke=\"#eff6ed\" stroke-width=\"2.2\"/><path d=\"M 70.0003 123.2774 C 83.2655 123.2774 88.5716 119.5334 96.5308 115.7894 Q 101.8369 113.2934 107.143 117.0374 C 120.4083 127.0214 136.3267 124.5254 149.5919 117.0374 Q 157.5511 112.0454 165.5103 117.0374 C 181.4286 127.0214 197.3469 125.7734 213.2653 117.0374 Q 221.2244 112.0454 229.1836 117.0374 C 245.102 125.7734 263.6733 127.0214 279.5917 118.2854 Q 287.5508 113.2934 295.51 118.2854 C 308.7753 124.5254 319.3875 120.7814 329.9997 123.2774 L 282.2447 229.3574 Q 279.5917 235.5974 266.3264 235.5974 H 133.6736 Q 120.4083 235.5974 117.7553 229.3574 Z\" fill=\"#fff5e1\" stroke=\"#dac8aa\" stroke-width=\"4.8\"/></g>",front="<path d=\"M 30.8 2.496 H 369.2 Q 384.24 2.496 380.48 14.976 L 309.04 234.624 Q 305.28 247.104 286.48 247.104 H 113.52 Q 94.72 247.104 90.96 234.624 L 19.52 14.976 Q 15.76 2.496 30.8 2.496 Z\" fill=\"#eff6ed\" fill-opacity=\".30\" stroke=\"#97b6b0\" stroke-width=\"4.8\" stroke-linejoin=\"round\"/><path d=\"M63 27L93 112\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".4\" stroke-width=\"7.2\"/>";
 const svg=content=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 320" width="400" height="320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${content}</svg>`;
 window.ParfaitGlass={back,front,svg};
 const stage=document.querySelector('.parfait-stage');
 if(stage){
  stage.insertAdjacentHTML('afterbegin',`<div class="glass-art glass-art-back" aria-hidden="true">${svg(back)}</div>`);
  stage.insertAdjacentHTML('beforeend',`<div class="glass-art glass-art-front" aria-hidden="true">${svg(front)}</div>`);
 }
})();
