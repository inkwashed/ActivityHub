/* Local-only photo export: no upload, external assets, or student data. */
window.BuilderPhoto = options => {
  const t = text => window.ActivityHubI18n ? window.ActivityHubI18n.t(text) : text;
  const shareDialog = document.querySelector('#share-dialog');
  const photo = document.querySelector(options.imageSelector);
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
  for (const dialog of [shareDialog]) {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  }
  shareDialog.addEventListener('close', clearPhoto);

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
      const builder = options.builder();
      // Capture current selections and wording before awaiting image decoding.
      const svg = options.render(builder);
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
      context.fillStyle = options.background || '#e8d9ba'; context.fillRect(50, 50, 900, 900);
      context.drawImage(image, 50, 50, 900, 900);
      context.textAlign = 'center'; context.fillStyle = '#294e40'; context.font = 'bold 36px Arial';
      context.fillText(options.caption, 500, 1009);
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
};
