/* Product-specific data and original SVG artwork. Add other recipes here.
   Counts are cumulative: earlier pieces stay in place as the amount grows. */
(() => {
  const svg = body => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true">${body}</svg>`;
  window.PIZZA_CONFIG = {
    seed: 48271,
    defaultSauce: null,
    sauces: [
      { id: 'none', label: 'no sauce', empty: true, color: '#edc579', highlight: '#f9df9d' },
      { id: 'tomato', label: 'tomato sauce', color: '#cc452c', highlight: '#e26038' },
      { id: 'alfredo', label: 'alfredo sauce', color: '#f4e5bb', highlight: '#fff2d3' },
      { id: 'bbq', label: 'BBQ sauce', color: '#75402b', highlight: '#995230' }
    ],
    toppings: [
      { id: 'cheese', label: 'cheese', counts: [0, 18, 38, 65], size: 9, color: '#b78017', art: svg('<g stroke="#dba940" stroke-width="1.3" stroke-linejoin="round"><path d="M8 22L40 12L43 18L11 29Z" fill="#ffe99d"/><path d="M20 8L27 7L40 42L33 45Z" fill="#ffdb75"/><path d="M12 39L49 26L52 33L15 46Z" fill="#fff0b0"/><path d="M36 17L43 19L32 54L25 52Z" fill="#ffe18a"/><path d="M9 31L13 25L50 45L46 52Z" fill="#fff0ac"/><path d="M24 25L52 14L55 21L27 32Z" fill="#ffe595"/><path d="M16 47L43 39L46 46L19 55Z" fill="#ffdc7f"/></g>') },
      { id: 'pepperoni', label: 'pepperoni', counts: [0, 3, 6, 10], size: 12, color: '#ac392a', art: svg('<circle cx="32" cy="32" r="25" fill="#b63829" stroke="#812f26" stroke-width="3"/><circle cx="32" cy="32" r="20" fill="#ce5136"/><g fill="#f0b080"><ellipse cx="22" cy="20" rx="4" ry="3"/><ellipse cx="41" cy="24" rx="3" ry="4"/><ellipse cx="19" cy="37" rx="3" ry="4"/><ellipse cx="34" cy="43" rx="4" ry="3"/><circle cx="31" cy="30" r="3"/><circle cx="44" cy="38" r="2"/></g>') },
      { id: 'sausage', label: 'sausage', counts: [0, 4, 8, 13], size: 10, color: '#946044', art: svg('<path d="M13 23Q11 13 23 12L42 16Q56 20 53 34L47 46Q40 57 28 50L16 43Q6 36 13 23Z" fill="#ad7751" stroke="#704931" stroke-width="3"/><path d="M20 23L39 28M18 34L35 39" stroke="#e2b084" stroke-width="5" stroke-linecap="round"/><path d="M38 20L46 25M38 42L43 36" stroke="#754c32" stroke-width="3" stroke-linecap="round"/>') },
      { id: 'tomatoes', label: 'tomatoes', counts: [0, 3, 6, 10], size: 12, color: '#d94330', art: svg('<circle cx="32" cy="32" r="25" fill="#df442d" stroke="#a72c25" stroke-width="3"/><circle cx="32" cy="32" r="19" fill="#f77749"/><path d="M32 14V50M16 23L48 41M16 41L48 23" stroke="#ffc785" stroke-width="3"/><circle cx="32" cy="32" r="5" fill="#f8b66b"/>') },
      { id: 'green-peppers', label: 'green peppers', counts: [0, 3, 6, 10], size: 12, color: '#398550', art: svg('<path d="M31 10C40 3 55 14 49 25C63 36 50 55 39 50C29 62 13 49 16 40C1 33 10 14 23 17Z" stroke="#287445" stroke-width="9"/><path d="M31 10C40 3 55 14 49 25C63 36 50 55 39 50C29 62 13 49 16 40C1 33 10 14 23 17Z" stroke="#78bb60" stroke-width="3"/>') },
      { id: 'mushrooms', label: 'mushrooms', counts: [0, 3, 7, 12], size: 12, color: '#94654b', art: svg('<path d="M26 32L23 53Q32 59 41 53L37 32" fill="#f2dfb6" stroke="#996d4d" stroke-width="2"/><path d="M6 34C6 4 56 4 58 34Q34 44 6 34Z" fill="#bb8761" stroke="#825438" stroke-width="2"/><path d="M15 25Q20 13 33 15" stroke="#e8bd92" stroke-width="4" stroke-linecap="round"/>') },
      { id: 'onions', label: 'onions', counts: [0, 4, 8, 13], size: 10, color: '#8e5ba1', art: svg('<path d="M13 21C8 40 19 54 36 49C49 45 52 28 44 17" stroke="#995da7" stroke-width="11" stroke-linecap="round"/><path d="M13 21C8 40 19 54 36 49C49 45 52 28 44 17" stroke="#f5ddeb" stroke-width="5" stroke-linecap="round"/>') },
      { id: 'pineapples', label: 'pineapples', counts: [0, 4, 8, 13], size: 9, color: '#bd8b12', art: svg('<path d="M12 15L47 10L55 42L23 54Z" fill="#ffdb58" stroke="#d89e25" stroke-width="3"/><path d="M23 20L39 17M27 30L43 26M30 40L46 35" stroke="#fff1a1" stroke-width="4" stroke-linecap="round"/>') },
      { id: 'corn', label: 'corn', counts: [0, 8, 17, 28], size: 5, color: '#c28b10', art: svg('<path d="M14 17Q31 7 48 18L49 43Q35 60 17 46Z" fill="#ffd344" stroke="#da9d18" stroke-width="3"/><path d="M23 21L22 35" stroke="#fff1a0" stroke-width="7" stroke-linecap="round"/>') }
    ]
  };
})();
