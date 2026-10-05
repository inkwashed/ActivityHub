/* Fullscreen is requested only from a user tap; the pizza state is preserved. */
(() => {
  'use strict';
  const button = document.querySelector('#fullscreen');
  const notice = document.querySelector('#fullscreen-notice');
  const page = document.documentElement;
  const request = page.requestFullscreen || page.webkitRequestFullscreen;
  const exit = document.exitFullscreen || document.webkitExitFullscreen;
  let noticeTimer;
  const active = () => document.fullscreenElement || document.webkitFullscreenElement;
  function message(text) {
    clearTimeout(noticeTimer);
    notice.textContent = text;
    notice.hidden = false;
    noticeTimer = setTimeout(() => { notice.hidden = true; }, 7000);
  }
  function sync() {
    const isFullscreen = !!active();
    button.setAttribute('aria-pressed', String(isFullscreen));
    button.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    button.title = isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
    button.disabled = false;
    notice.hidden = true;
  }
  button.addEventListener('click', async () => {
    if (!request || !exit) {
      message('Fullscreen is not available in this browser. Try hiding the browser toolbar for more space.');
      return;
    }
    button.disabled = true;
    try {
      if (active()) await exit.call(document);
      else await request.call(page);
      sync();
    } catch (error) {
      button.disabled = false;
      message('Fullscreen could not open. You can keep building your pizza here.');
    }
  });
  // These also handle browser-owned exit controls and the Escape key.
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  function failed() {
    button.disabled = false;
    message('Fullscreen could not open. You can keep building your pizza here.');
  }
  document.addEventListener('fullscreenerror', failed);
  document.addEventListener('webkitfullscreenerror', failed);
  sync();
})();
