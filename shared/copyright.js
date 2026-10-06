/* Shared text-only copyright footer. Full terms remain in ../LICENSE.txt.
   The future ActivityHub home page will provide the visible terms link. */
(() => {
  const footer = document.createElement('footer');
  footer.className = 'ah-copyright';
  const notice = document.createElement('span');
  notice.dataset.i18n = '© 2026 · All rights reserved.';
  notice.textContent = notice.dataset.i18n;
  footer.append(notice);
  document.body.append(footer);
})();
