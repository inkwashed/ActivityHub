/* Original vector supplies. Artwork and LEARN positions are lesson-owned. */
(() => {
 const wrap=body=>`<svg overflow="visible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#31483f" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
 const shapes={
 pencil:'<path fill="COLOR" d="M42 13.04h16v70.224H42z"/><path fill="#ead3a7" d="M42 83.264l8 20.944 8-20.944z"/><path fill="#36413d" d="M47 95.584l3 8.624 3-8.624z"/><path fill="#e8acb3" d="M42 3.184q8-6.16 16 0v9.856H42z"/><path d="M48 17.968v60.368M54 17.968v60.368" stroke="#fffefa" stroke-width="1"/>',
 'colored-pencil':'<path fill="COLOR" d="M42 3.184h16v80.08H42z"/><path fill="#ead3a7" d="M42 83.264l8 20.944 8-20.944z"/><path fill="COLOR" d="M47 94.352l3 9.856 3-9.856z"/><path d="M47 10.576v66.528" stroke="#fffefa" stroke-width="1"/>',
 pen:'<rect x="43" y="3.184" width="14" height="83.776" rx="6" ry="7.392" fill="COLOR"/><path fill="#c8d1d2" d="M43 84.496h14l-7 17.248z"/><path d="M53 8.112h9V43.84"/><path d="M44 63.552h12"/>',
 marker:'<rect x="43" y="29" width="14" height="69" rx="3" fill="#fffefa"/><path fill="COLOR" d="M43 68.5h14v22H43z"/><rect x="42" y="1" width="16" height="30" rx="3" fill="COLOR"/><path d="M46 9v12" stroke="#fffefa" stroke-width="1.8"/>',
 ruler:'<rect x="42" y="6" width="16" height="88" rx="2" fill="COLOR" fill-opacity=".65"/><path d="M42 14h7m-7 8h4m-4 8h7m-7 8h4m-4 8h7m-7 8h4m-4 8h7m-7 8h4m-4 8h7m-7 8h4"/>',
 'glue-stick':'<rect x="36" y="12" width="28" height="78" rx="5" fill="#fffefa"/><rect x="35" y="10" width="30" height="25" rx="4" fill="#fffefa"/><path d="M36 68h28v12H36z" fill="COLOR" stroke="none"/><path d="M36 80h28"/><path d="M40 83v5m4-5v5m4-5v5m4-5v5m4-5v5m4-5v5" stroke="#9cae9b" stroke-width="1"/><path d="M40 15v14" stroke="#e2e5dd" stroke-width="1.5"/>',
 eraser:'<rect x="10" y="32" width="80" height="36" rx="2" fill="#f6f3e8"/><path d="M25 32h65v11H25z" fill="COLOR" stroke="none"/><path d="M25 57h65v11H25z" fill="#252c2b" stroke="none"/><path d="M25 32v36" stroke="#c4c6bd" stroke-width="1.3"/><path d="M25 32h65v36H25" fill="none"/>',
 notebook:'<rect x="17" y="9" width="67" height="83" rx="1.5" fill="COLOR"/><path d="M25 10h58v81H25z" fill="#fffefa" fill-opacity=".65" stroke="none"/><path d="M25 10v81"/><path d="M36 31h38m-38 9h38m-38 18h38m-38 5h38m-38 5h38" stroke-width="1" stroke-opacity=".45"/><path d="M34 80h42m-42 5h19" stroke-width="1.2"/><path d="M80 12v77" stroke="#fffefa" stroke-opacity=".55" stroke-width="1"/>',
 calendar:'<path fill="#fffefa" d="M17 23h66v61H17z"/><path fill="COLOR" d="M17 23h66v18H17z"/><path d="M30 16v14m40-14v14"/><path d="M23 47h54v32H23zM33.8 47v32M44.6 47v32M55.4 47v32M66.2 47v32M23 55h54M23 63h54M23 71h54" fill="none" stroke-width="1.2"/>',
 stapler:'<path fill="#c8d1d2" d="M12 70h75l3 12H12z"/><path fill="COLOR" d="M12 68l8-25 64-13 7 19-69 25z"/><path d="M22 65l60-13M22 74v5"/><path fill="#9ba9a7" d="M78 54h8v16H74z"/>',
 'pencil-sharpener':'<rect x="25" y="14" width="50" height="72" rx="5" fill="COLOR"/><path d="M39 19h22v62H39z" fill="#31483f" fill-opacity=".16" stroke="none"/><rect x="40" y="20" width="20" height="59" rx="2" fill="#d5dedc"/><path d="M43 24v51" stroke="#fffefa" stroke-width="1.5"/><circle cx="50" cy="46" r="5" fill="#f8f6ed"/><path d="M47.5 48.5l5-5" stroke-width="1.6"/><path d="M28 29h5m-5 8h5m-5 8h5m-5 8h5m-5 8h5m-5 8h5M67 29h5m-5 8h5m-5 8h5m-5 8h5m-5 8h5m-5 8h5" stroke-width="1.2"/>',
 magnet:'<circle cx="50" cy="50" r="33" fill="COLOR"/><circle cx="50" cy="50" r="28" fill="none" stroke="#31483f" stroke-opacity=".2" stroke-width="1.3"/><path d="M28 44a23 23 0 0 1 17-17" fill="none" stroke="#fffefa" stroke-opacity=".6" stroke-width="2.5"/><circle cx="50" cy="50" r="2" fill="#31483f" fill-opacity=".12" stroke="none"/>'
 };
 // LEARN rotation is independent of freely edited PLAY transforms.
 const entries=[['pencil',66,38,38,'yellow',90],['colored-pencil',66,44,38,'red',90],['pen',66,50,38,'blue',90],['marker',66,57,38,'purple',90],['ruler',50,18,44,'blue',90],['glue-stick',27.75,39,20,'blue',-90],['eraser',43.75,50.75,18,'blue',90],['notebook',27,84,38,'green',0],['calendar',72,84,44,'blue',0],['stapler',27,51.5,26,'red',0],['pencil-sharpener',24,18,21,'orange',0],['magnet',76,18,23,'red',0]];
 const colors={red:'#d95453',orange:'#e99544',yellow:'#efc855',green:'#75a481',brown:'#996747',blue:'#6b9fc6',purple:'#a08aba',pink:'#e5a3b4',black:'#52605e',white:'#ffffff'};
 const horizontalItems=['pencil','colored-pencil','pen','marker','ruler'];
 const baseSizes={pencil:23,'colored-pencil':23,pen:23,marker:23,ruler:24,'glue-stick':20,eraser:18,notebook:38,calendar:44,stapler:26,'pencil-sharpener':21,magnet:23};
 const defaultScaleFor=id=>id==='glue-stick'||id==='eraser'?1.15:id==='stapler'?.95:id==='pencil-sharpener'?.85:id==='magnet'?.55:id==='ruler'?1.56:horizontalItems.includes(id)?1.3:1;
 // Match the original eraser's visible outline at each item's default scene size.
 // Put the style on a group so photo exports retain it when stripping the SVG root.
 const outline=2.2*18;
 const art=(id,color,horizontal=false)=>{
  const factor=18/(baseSizes[id]*defaultScaleFor(id));
  const body=shapes[id].replaceAll('COLOR',colors[color]||colors.blue)
   .replace(/stroke-width="([\d.]+)"/g,(_,width)=>`stroke-width="${Number(width)*factor}"`);
  const shaped=`<g stroke-width="${outline/(baseSizes[id]*defaultScaleFor(id))}">${body}</g>`;
  return wrap(horizontal&&horizontalItems.includes(id)?`<g transform="rotate(90 50 50)">${shaped}</g>`:shaped);
 };
 const caseArt=color=>`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="translate(0 -15)" stroke="#31483f" stroke-width=".396" stroke-linejoin="round">
 <!-- Top-down shell: aligned rectangular halves with inset rims. -->
 <rect x="44" y="19" width="12" height="5" rx="1" fill="${colors[color]||colors.blue}"/>
 <rect x="12" y="22" width="76" height="22" rx="3" fill="${colors[color]||colors.blue}"/>
 <rect x="16" y="25" width="68" height="16" rx="2" fill="#fffefa" fill-opacity=".43"/>
 <circle cx="50" cy="20.5" r=".6" fill="#31483f" stroke="none"/>
 <rect x="27" y="43" width="9" height="4" rx="1" fill="#d2d9d5"/>
 <rect x="64" y="43" width="9" height="4" rx="1" fill="#d2d9d5"/>
 <rect x="12" y="46" width="76" height="34" rx="3" fill="${colors[color]||colors.blue}"/>
 <rect x="16" y="49" width="68" height="27" rx="2" fill="#fffefa" fill-opacity=".43"/>
 <rect x="44" y="78" width="12" height="4" rx="1" fill="#d2d9d5"/>
 <circle cx="50" cy="80" r=".6" fill="#31483f" stroke="none"/>
 </g></svg>`;
 window.Supplies={colors,art,caseArt,config:{seed:5,interaction:'layers',defaultSauce:null,sauces:[],sceneSelector:'#supplies-scene',resetMessage:'Supplies cleared.',creativeSizes:{initial:1,min:.5,max:2,step:.15,smallBelow:.8,bigFrom:1.4},toppings:entries.map(([id,x,y,size,color,learnRotation])=>{
  const creativeSize=baseSizes[id];
  const defaultScale=defaultScaleFor(id);
  return {id,label:id.replaceAll('-',' '),countSingular:id.replaceAll('-',' '),countPlural:id.replaceAll('-',' ')+'s',rotation:horizontalItems.includes(id)?90:0,x,y,size:creativeSize*defaultScale,learnRotation,creativeSize,defaultScale,color,art:art(id,color),counts:[0,1,1,1]};
 })}};
})();
