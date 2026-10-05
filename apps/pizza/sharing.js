/* Local-only photo export: no upload, external assets, or student data. */
(() => {
  const t = text => window.ActivityHubI18n ? window.ActivityHubI18n.t(text) : text;
  const shareDialog = document.querySelector('#share-dialog');
  const languageDialog = document.querySelector('#language-dialog');
  const photo = document.querySelector('#pizza-photo');
  const download = document.querySelector('#download-photo');
  const status = document.querySelector('#share-status');
  let generation = 0;
  let photoURL;
  function clearPhoto() {
    generation++;
    if (photoURL) URL.revokeObjectURL(photoURL);
    photoURL = null;
    photo.hidden = download.hidden = true;
    photo.removeAttribute('src');
    download.removeAttribute('href');
  }
  for (const dialog of [shareDialog, languageDialog]) {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  }
  shareDialog.addEventListener('close', clearPhoto);
  document.querySelector('#language').addEventListener('click', () => languageDialog.showModal());

  function pizzaSVG(builder) {
    const sauce = builder.config.sauces.find(item => item.id === builder.state.sauce);
    let art = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 100 100"><defs><radialGradient id="crust"><stop offset="0.78" stop-color="#edba60"/><stop offset="0.9" stop-color="#db963b"/><stop offset="0.97" stop-color="#ad6426"/><stop offset="1" stop-color="#e6ae54"/></radialGradient></defs><circle cx="50" cy="51" r="48" fill="#543318" opacity=".15"/><circle cx="50" cy="50" r="47" fill="url(#crust)"/>`;
    if (sauce && !sauce.empty) art += `<circle cx="50" cy="50" r="40" fill="${sauce.color}"/>`;
    // Toasted rim freckles only in the finished photo; the builder stays uncooked.
    for (let i = 0; i < 38; i++) {
      const angle = i * 2.399963, radius = 43 + Math.sin(i * 4.1) * 2;
      art += `<ellipse cx="${50 + Math.cos(angle) * radius}" cy="${50 + Math.sin(angle) * radius}" rx="${.3 + (i % 3) * .17}" ry=".3" fill="#975523" opacity=".32"/>`;
    }
    for (const topping of builder.config.toppings) {
      const count = topping.counts[builder.state.toppings[topping.id]];
      if (!count) continue;
      const positions = builder.placements(topping);
      for (let i = 0; i < count; i++) {
        const p = positions[i];
        // DOM pizza radius is 50%; photo radius is 47%, so scale all placements together.
        const x = 50 + (p.x - 50) * .94, y = 50 + (p.y - 50) * .94;
        const size = topping.size * .94;
        let shape = topping.art.replace('<svg ', `<svg x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" `);
        if (topping.id === 'cheese') shape = shape.replaceAll('#fff0b0', '#f5cd72').replaceAll('#fff0ac', '#f0c368').replaceAll('#ffe99d', '#edbc5e');
        art += `<g transform="translate(${x} ${y}) rotate(${p.rotate}) scale(${p.scale})">${shape}</g>`;
      }
    }
    art += '<circle cx="50" cy="50" r="40" fill="#ad6426" opacity=".06"/></svg>';
    return art;
  }
  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Image could not load'));
      image.src = source;
    });
  }
  function wrapText(context, text, width) {
    const lines = []; let line = '';
    for (const word of text.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (line && context.measureText(next).width > width) { lines.push(line); line = word; }
      else line = next;
    }
    if (line) lines.push(line);
    return lines;
  }
  document.querySelector('#share').addEventListener('click', async () => {
    clearPhoto();
    const token = generation;
    status.dataset.i18n = 'Making your photo…'; status.textContent = t(status.dataset.i18n);
    shareDialog.showModal();
    try {
      const builder = window.pizzaBuilder;
      // Capture current selections and wording before awaiting image decoding.
      const svg = pizzaSVG(builder);
      const sentence = document.querySelector('#sentence').textContent;
      const image = await loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.font = '30px Arial';
      const lines = wrapText(context, sentence, 860);
      canvas.width = 1000;
      canvas.height = Math.max(1180, 1060 + lines.length * 40);
      context.fillStyle = '#fffefa'; context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#e8d9ba'; context.fillRect(50, 50, 900, 900);
      context.drawImage(image, 50, 50, 900, 900);
      context.textAlign = 'center'; context.fillStyle = '#294e40'; context.font = 'bold 36px Arial';
      context.fillText('My pizza!', 500, 1009);
      context.font = '30px Arial';
      lines.forEach((line, i) => context.fillText(line, 500, 1060 + i * 40));
      const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Export failed')), 'image/png'));
      if (token !== generation || !shareDialog.open) return;
      photoURL = URL.createObjectURL(blob);
      photo.src = photoURL; download.href = photoURL;
      photo.hidden = download.hidden = false;
      status.dataset.i18n = 'Ready to save!'; status.textContent = t(status.dataset.i18n);
    } catch (error) {
      if (token === generation) { status.dataset.i18n = 'The photo could not be made. Please close this preview and try again.'; status.textContent = t(status.dataset.i18n); }
    }
  });
})();
