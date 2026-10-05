/* Interface-only translation. Lesson content must never receive data-i18n. */
(() => {
  const supported = ['en', 'ja'];
  // Browser preferences are the web-visible system language settings.
  // Match regional tags (ja-JP, en-US) and respect preference order.
  const browser = typeof navigator === 'undefined' ? {} : navigator;
  const preferences = [...(browser.languages || []), browser.language].filter(value => typeof value === 'string');
  let language = preferences.map(value => value.toLowerCase().split(/[-_]/)[0])
    .find(value => supported.includes(value)) || 'en';
  const translations = Object.create(null);
  const t = text => language === 'ja' ? (translations[text] || text) : text;
  function apply() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    for (const attr of ['aria-label', 'title', 'alt']) {
      document.querySelectorAll(`[data-i18n-${attr}]`).forEach(el => el.setAttribute(attr, t(el.getAttribute(`data-i18n-${attr}`))));
    }
    document.querySelectorAll('[data-language]').forEach(el => el.setAttribute('aria-pressed', String(el.dataset.language === language)));
  }
  window.ActivityHubI18n = {
    t, get language() { return language; },
    register(values) { Object.assign(translations, values); },
    setLanguage(value) {
      if (!supported.includes(value)) return;
      language = value; apply();
      document.dispatchEvent(new Event('activityhub:languagechange'));
    },
    apply
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language]').forEach(el => el.addEventListener('click', () => window.ActivityHubI18n.setLanguage(el.dataset.language)));
    window.ActivityHubI18n.setLanguage(language);
  });
})();
