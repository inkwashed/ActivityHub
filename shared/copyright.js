/* ActivityHub copyright notice. Full terms: ../LICENSE.txt. */
(() => {
  const termsURL = new URL('../LICENSE.txt', document.currentScript.src).href;
  const footer = document.createElement('footer');
  footer.className = 'ah-copyright';
  const notice = document.createElement('span');
  notice.dataset.i18n = '© 2026 · All rights reserved.';
  notice.textContent = notice.dataset.i18n;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ah-button ah-terms-button';
  button.dataset.i18n = 'Use & copyright';
  button.textContent = button.dataset.i18n;
  footer.append(notice, button);
  const dialog = document.createElement('dialog');
  dialog.className = 'ah-terms-dialog';
  dialog.setAttribute('aria-labelledby', 'ah-terms-title');
  const heading = document.createElement('div');
  heading.className = 'dialog-heading';
  const title = document.createElement('h2');
  title.id = 'ah-terms-title';title.dataset.i18n = 'Use & copyright';title.textContent = title.dataset.i18n;
  const close = document.createElement('button');
  close.type = 'button';close.className = 'ah-button ah-button-icon';close.textContent = '×';
  close.setAttribute('aria-label', 'Close usage terms');close.setAttribute('data-i18n-aria-label', 'Close usage terms');
  heading.append(title, close);dialog.append(heading);
  for (const text of [
    'Free for personal, classroom, and non-commercial educational use.',
    'Please share the official link. Reposting, rehosting, selling, rebranding, or distributing modified applets or assets requires prior written permission. Keep copyright and attribution notices intact.',
    'You may save, print, and share your completed activity photos for personal and classroom use.',
    'The full English terms explain the permissions and restrictions.'
  ]) { const p = document.createElement('p');p.dataset.i18n = text;p.textContent = text;dialog.append(p); }
  const link = document.createElement('a');
  link.className = 'ah-button';link.href = termsURL;link.target = '_blank';link.rel = 'noopener';link.dataset.i18n = 'Read full terms';link.textContent = link.dataset.i18n;
  dialog.append(link);
  button.addEventListener('click', () => dialog.showModal());
  close.addEventListener('click', () => dialog.close());
  document.body.append(footer, dialog);
})();
