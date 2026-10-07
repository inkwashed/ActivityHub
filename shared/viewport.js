/* Reserve actual header/footer space, including translated and wrapped text. */
(() => {
  const header = document.querySelector('header');
  const footer = document.querySelector('.ah-copyright');
  const update = () => {
    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
    document.documentElement.style.setProperty('--footer-height', `${footer ? footer.getBoundingClientRect().height : 0}px`);
  };
  update();
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(update);
    observer.observe(header);
    if (footer) observer.observe(footer);
  }
  window.addEventListener('resize', update);
})();
