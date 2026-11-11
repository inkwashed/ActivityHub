/* Blocking, local-only bootstrap: load before styles on every suite entry page. */
(() => {
  'use strict';
  const key = 'letseigo.theme';
  const themes = ['green', 'blue', 'maroon', 'gold', 'purple'];
  const root = document.documentElement;
  const defaultTheme = 'blue';
  let current = defaultTheme;
  let storageFailed = false;
  function read() {
    try { const saved = window.localStorage.getItem(key); return themes.includes(saved) ? saved : defaultTheme; }
    catch { return null; }
  }
  function apply(value) {
    current = value;
    root.setAttribute('data-ah-theme', value);
    document.querySelectorAll('[data-theme-picker] input[type="radio"]').forEach(input => { input.checked = input.value === value; });
  }
  function announce() {
    const message = storageFailed ? 'Theme changed for this visit. It could not be saved on this device.' : '';
    document.querySelectorAll('.ah-theme-status').forEach(el => {
      el.textContent = window.ActivityHubI18n?.t(message) || message;
      el.classList.toggle('sr-only', !storageFailed);
    });
  }
  function set(value) {
    if (!themes.includes(value)) return false;
    apply(value);
    try { window.localStorage.setItem(key, value); storageFailed = false; }
    catch { storageFailed = true; }
    announce();
    return true;
  }
  // Never write a default or repair an unknown value on startup.
  apply(read() || current);
  window.ActivityTheme = { set, get current() { return current; } };
  document.addEventListener('DOMContentLoaded', () => {
    apply(current);
    document.querySelectorAll('[data-theme-picker]').forEach(picker => {
      picker.addEventListener('change', event => {
        if (event.target.matches('input[type="radio"]') && event.target.checked) set(event.target.value);
      });
    });
  });
  function refresh() { if (storageFailed) return; const saved = read(); if (saved !== null) apply(saved); }
  window.addEventListener('pageshow', refresh); // Includes back/forward cache restores.
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) { storageFailed = false; refresh(); announce(); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  document.addEventListener('activityhub:languagechange', announce);
})();
