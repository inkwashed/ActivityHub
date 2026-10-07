/* Native dialog provides Escape dismissal and keyboard focus containment. */
(() => {
  const opener = document.querySelector('#open-license');
  const dialog = document.querySelector('#license-dialog');
  opener.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener.focus());
})();
