(() => {
  function pizzaSVG(builder) {
    const sauce = builder.config.sauces.find(item => item.id === builder.state.sauce);
    // Fit the complete creative composition, including pieces beyond the crust.
    let min=0,max=100;
    if(builder.creative?.active) for(const p of builder.creative.items){
      const topping=builder.config.toppings.find(t=>t.id===p.topping);
      const angle=p.rotate*Math.PI/180;
      const half=topping.size*.94*p.scale/2*(Math.abs(Math.cos(angle))+Math.abs(Math.sin(angle)));
      const x=50+(p.x-50)*.94,y=50+(p.y-50)*.94;
      min=Math.min(min,x-half-2,y-half-2);max=Math.max(max,x+half+2,y+half+2);
    }
    // Flat oak illustration sized to the full photo, including expanded PLAY bounds.
    const oak=`<g id="oak-counter" transform="translate(${min} ${min}) scale(${(max-min)/100})">
      <rect width="100" height="100" fill="#d9b783"/>
      <path d="M0 0H25V100H0ZM50 0H75V100H50Z" fill="#e2c292"/>
      <path d="M25 0V100M50 0V100M75 0V100" stroke="#b78e58" stroke-width=".35" opacity=".5"/>
      <g fill="none" stroke="#b98f5b" stroke-width=".3" stroke-linecap="round" opacity=".35">
       <path d="M6 0C3 18 10 28 7 47S3 78 6 100M17 0C21 24 13 43 18 61S22 85 19 100M32 0C28 20 36 31 33 53S29 82 32 100M43 0C46 19 39 42 44 63S47 87 44 100M58 0C54 20 62 39 58 59S55 83 59 100M69 0C72 22 65 40 69 61S72 82 69 100M82 0C78 25 85 38 81 61S79 87 83 100M94 0C97 20 90 38 94 59S97 82 94 100"/>
      </g>
      <path d="M11 5Q8 16 11 28M37 70Q40 82 37 94M88 6Q85 18 88 32" fill="none" stroke="#f1d8af" stroke-width=".5" opacity=".65"/>
    </g>`;
    let art = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="${min} ${min} ${max-min} ${max-min}"><defs><radialGradient id="crust"><stop offset="0.78" stop-color="#edba60"/><stop offset="0.9" stop-color="#db963b"/><stop offset="0.97" stop-color="#ad6426"/><stop offset="1" stop-color="#e6ae54"/></radialGradient></defs>${oak}<circle cx="50" cy="51" r="48" fill="#543318" opacity=".15"/><circle cx="50" cy="50" r="47" fill="url(#crust)"/>`;
    if (sauce && !sauce.empty) art += `<circle cx="50" cy="50" r="40" fill="${sauce.color}"/>`;
    // Toasted rim freckles only in the finished photo; the builder stays uncooked.
    for (let i = 0; i < 38; i++) {
      const angle = i * 2.399963, radius = 43 + Math.sin(i * 4.1) * 2;
      art += `<ellipse cx="${50 + Math.cos(angle) * radius}" cy="${50 + Math.sin(angle) * radius}" rx="${.3 + (i % 3) * .17}" ry=".3" fill="#975523" opacity=".32"/>`;
    }
    const entries=builder.creative?.active
      ? (builder.creative.orderedItems?.() || builder.creative.items).map(piece=>({topping:builder.config.toppings.find(t=>t.id===piece.topping),freePieces:[piece]}))
      : builder.config.toppings.map(topping=>({topping,freePieces:null}));
    for (const {topping,freePieces} of entries) {
      const count = freePieces ? freePieces.length : topping.counts[builder.state.toppings[topping.id]];
      if (!count) continue;
      const positions = freePieces || builder.placements(topping);
      for (let i = 0; i < count; i++) {
        const p = positions[i];
        // DOM pizza radius is 50%; photo radius is 47%, so scale all placements together.
        const x = 50 + (p.x - 50) * .94, y = 50 + (p.y - 50) * .94;
        const size = topping.size * .94;
        let shape = topping.art.replace('<svg ', `<svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" `);
        if (topping.id === 'cheese') shape = shape.replaceAll('#fff0b0', '#f5cd72').replaceAll('#fff0ac', '#f0c368').replaceAll('#ffe99d', '#edbc5e');
        art += `<g transform="translate(${x} ${y}) rotate(${p.rotate}) scale(${p.flip ? -p.scale : p.scale} ${p.scale})">${shape}</g>`;
      }
    }
    art += '<circle cx="50" cy="50" r="40" fill="#ad6426" opacity=".06"/></svg>';
    return art;
  }
window.BuilderPhoto({builder:()=>window.pizzaBuilder,render:pizzaSVG,imageSelector:'#pizza-photo',caption:'My pizza!'});
})();
