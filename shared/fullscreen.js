/* Fullscreen is requested only from a user tap; the activity state is preserved. */
(() => {
  const t = text => window.ActivityHubI18n ? window.ActivityHubI18n.t(text) : text;
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
    button.setAttribute('aria-label', t(isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'));
    button.title = t(isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen');
    button.disabled = false;
    notice.hidden = true;
  }
  button.addEventListener('click', async () => {
    if (!request || !exit) {
      message(t('Fullscreen is not available in this browser. Try hiding the browser toolbar for more space.'));
      return;
    }
    button.disabled = true;
    try {
      if (active()) await exit.call(document);
      else await request.call(page);
      sync();
    } catch (error) {
      button.disabled = false;
      message(t('Fullscreen could not open. You can keep using this activity here.'));
    }
  });
  // These also handle browser-owned exit controls and the Escape key.
  document.addEventListener('fullscreenchange', sync);
  document.addEventListener('webkitfullscreenchange', sync);
  function failed() {
    button.disabled = false;
    message(t('Fullscreen could not open. You can keep using this activity here.'));
  }
  document.addEventListener('fullscreenerror', failed);
  document.addEventListener('webkitfullscreenerror', failed);
  document.addEventListener('activityhub:languagechange', sync);
  sync();
})();
