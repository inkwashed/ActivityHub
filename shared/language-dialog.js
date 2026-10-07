/* Shared language menu. Translations/choice events are owned by i18n.js. */
(() => {
  const button = document.querySelector('#language');
  const dialog = document.querySelector('#language-dialog');
  if (!button || !dialog) return;
  button.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
})();
