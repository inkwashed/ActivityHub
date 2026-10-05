/* Measure the header rather than assuming a fixed font size or toolbar height. */
(() => {
  const header = document.querySelector('header');
  const update = () => document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  update();
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(header);
  window.addEventListener('resize', update);
})();
