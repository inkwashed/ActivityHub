/* Directory URLs on the web; explicit files when opened directly offline. */
(() => {
  if (location.protocol !== 'file:') return;
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.getAttribute('href'), location.href);
    if (url.protocol === 'file:' && url.pathname.endsWith('/')) {
      url.pathname += 'index.html';
      link.href = url.href;
    }
  });
})();
