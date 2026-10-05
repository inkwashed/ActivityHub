/* Reusable quantity/placement engine. No modules or network requests, so file:// works. */
(() => {
  'use strict';
  class FoodBuilder {
    constructor(root, config) {
      this.root = root;
      this.config = config;
      this.seed = config.seed >>> 0;
      this.advancedMode = false;
      this.state = { sauce: config.defaultSauce, toppings: {} };
      this.buttons = new Map();
      this.groups = new Map();
      this.positions = new Map();
      this.pieces = root.querySelector('#pieces');
      this.mount();
    }
    random() {
      this.seed = (Math.imul(1664525, this.seed) + 1013904223) >>> 0;
      return this.seed / 4294967296;
    }
    placements(topping) {
      if (!this.positions.has(topping.id)) {
        const points = [];
        for (let i = 0; i < topping.counts[3]; i++) {
          // Even coverage with jitter, a random angle and safe crust clearance.
          const angle = i * 2.399963 + this.random() * .9;
          const radius = Math.sqrt((i + this.random()) / topping.counts[3]) * 37;
          points.push({ x: 50 + Math.cos(angle) * radius, y: 50 + Math.sin(angle) * radius,
            rotate: this.random() * 360, scale: .82 + this.random() * .36 });
        }
        // Shuffle so the first portion also covers the whole pizza.
        for (let i = points.length - 1; i > 0; i--) {
          const j = Math.floor(this.random() * (i + 1));
          [points[i], points[j]] = [points[j], points[i]];
        }
        this.positions.set(topping.id, points);
      }
      return this.positions.get(topping.id);
    }
    mount() {
      const advancedToggle = document.querySelector('#advanced-mode');
      advancedToggle.addEventListener('change', () => {
        this.advancedMode = advancedToggle.checked;
        this.updateSentence();
        this.announce(`${this.advancedMode ? 'Hard' : 'Easy'} mode. ${this.root.querySelector('#sentence').textContent}`);
      });
      const sauces = this.root.querySelector('#sauce-options');
      this.config.sauces.forEach(sauce => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sauce-button ah-choice';
        button.dataset.sauce = sauce.id;
        button.innerHTML = `<span class="sauce-bowl" style="--sauce-color:${sauce.color};--sauce-highlight:${sauce.highlight}" aria-hidden="true"></span><span>${sauce.label}</span><span class="check" aria-hidden="true">✓</span>`;
        button.addEventListener('click', () => this.setSauce(sauce.id));
        sauces.append(button);
      });
      this.config.toppings.forEach((topping, index) => {
        this.state.toppings[topping.id] = 0;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'topping-button ah-choice';
        button.style.setProperty('--ingredient-color', topping.color);
        button.innerHTML = `<span class="ingredient-art">${topping.art}</span><span class="ingredient-name">${topping.label}</span><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>`;
        button.addEventListener('click', () => this.setLevel(topping.id, (this.state.toppings[topping.id] + 1) % 4));
        this.buttons.set(topping.id, button);
        this.root.querySelector('#topping-options').append(button);
        const group = document.createElement('div');
        group.className = 'ingredient-layer';
        // Configuration order controls both the tray and bottom-to-top stacking.
        group.style.zIndex = index + 1;
        this.groups.set(topping.id, group);
        this.pieces.append(group);
        this.updateButton(topping);
      });
      this.root.querySelector('#clear').addEventListener('click', () => this.clear());
      this.setSauce(this.config.defaultSauce, false);
    }
    setSauce(id, announce = true) {
      const sauce = this.config.sauces.find(item => item.id === id);
      if (id !== null && !sauce) return;
      this.state.sauce = id;
      const surface = this.root.querySelector('#sauce');
      if (this.sauceFrame != null) cancelAnimationFrame(this.sauceFrame);
      this.sauceFrame = null;
      surface.innerHTML = '';
      surface.hidden = !sauce || !!sauce.empty;
      if (sauce && !sauce.empty) {
        surface.style.setProperty('--sauce-color', sauce.color);
        surface.style.setProperty('--sauce-highlight', sauce.highlight);
        // Draw only the completed part of one continuous spiral. This avoids
        // SVG dash normalization differences and disconnected round dash caps.
        const points = [];
        for (let i = 0; i <= 720; i++) {
          const progress = i / 720;
          const angle = progress * Math.PI * 7 - Math.PI / 2;
          const radius = progress * 57;
          points.push(`${i ? 'L' : 'M'}${(50 + Math.cos(angle) * radius).toFixed(2)} ${(50 + Math.sin(angle) * radius).toFixed(2)}`);
        }
        const path = points.join(' ');
        const maskId = `sauce-spread-${FoodBuilder.nextMaskId++}`;
        surface.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><path class="sauce-reveal" d="M50 50L50 50" fill="none" stroke="white" stroke-width="0" stroke-linecap="round"/></mask><radialGradient id="${maskId}-color" cx="35%" cy="30%" r="75%"><stop stop-color="${sauce.highlight}"/><stop offset="1" stop-color="${sauce.color}"/></radialGradient></defs><g mask="url(#${maskId})"><circle cx="50" cy="50" r="50" fill="url(#${maskId}-color)"/><path d="${path}" fill="none" stroke="${sauce.highlight}" stroke-opacity=".3" stroke-width="1.2" stroke-linecap="round"/></g></svg>`;
        const reveal = surface.querySelector('.sauce-reveal');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let started;
        const draw = now => {
          if (started === undefined) started = now;
          const progress = reducedMotion.matches ? 1 : Math.min((now - started) / 1900, 1);
          // Follow the spiral at a steady angular pace; overlap each previous turn.
          const last = Math.max(1, Math.floor(progress * (points.length - 1)));
          reveal.setAttribute('d', points.slice(0, last + 1).join(' '));
          reveal.setAttribute('stroke-width', String(19 * Math.min(progress / .10, 1)));
          if (progress < 1) this.sauceFrame = requestAnimationFrame(draw);
          else this.sauceFrame = null;
        };
        if (reducedMotion.matches) draw(0);
        else this.sauceFrame = requestAnimationFrame(draw);
      }
      this.root.querySelectorAll('[data-sauce]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sauce === id)));
      this.updateSentence();
      if (announce) this.announce(sauce ? `${sauce.label} selected.` : 'Dry crust. Choose a sauce or no sauce.');
    }
    setLevel(id, level, announce = true) {
      const topping = this.config.toppings.find(item => item.id === id);
      if (!topping || !Number.isInteger(level) || level < 0 || level > 3) return;
      this.state.toppings[id] = level;
      const group = this.groups.get(id);
      const count = topping.counts[level];
      while (group.children.length > count) group.lastElementChild.remove();
      const start = group.children.length;
      const points = this.placements(topping);
      for (let i = start; i < count; i++) {
        const point = points[i];
        const piece = document.createElement('span');
        piece.className = 'piece';
        piece.style.cssText = `left:${point.x}%;top:${point.y}%;width:${topping.size}%;--rotation:${point.rotate}deg;--scale:${point.scale};--delay:${(i-start)*22}ms`;
        piece.innerHTML = topping.art;
        group.append(piece);
      }
      this.updateButton(topping);
      this.updateSentence();
      if (announce) this.announce(`${topping.label}: ${['removed', 'light', 'regular', 'extra'][level]}.`);
    }
    updateButton(topping) {
      const level = this.state.toppings[topping.id];
      const button = this.buttons.get(topping.id);
      button.setAttribute('aria-pressed', String(level > 0));
      button.setAttribute('aria-label', `${topping.label}, ${['none', 'light', 'regular', 'extra'][level]}. Tap to ${level === 3 ? 'remove' : 'add more'}.`);
      [...button.querySelectorAll('.dots i')].forEach((dot, index) => dot.classList.toggle('filled', index < level));
    }
    updateSentence() {
      const sauce = this.config.sauces.find(item => item.id === this.state.sauce);
      const chosen = this.config.toppings.filter(item => this.state.toppings[item.id] > 0);
      const joinList = words => words.length < 2 ? (words[0] || '')
        : words.length === 2 ? words.join(' and ')
        : `${words.slice(0, -1).join(', ')}, and ${words[words.length - 1]}`;
      let list;
      if (this.advancedMode) {
        const quantityWords = { 1: 'a little bit of ', 2: 'some ', 3: 'a lot of ' };
        const groups = [1, 2, 3].map(level => {
          const names = chosen.filter(item => this.state.toppings[item.id] === level).map(item => item.label);
          return names.length ? quantityWords[level] + joinList(names) : null;
        }).filter(Boolean);
        list = joinList(groups);
      } else {
        const words = chosen.map(item => item.label);
        list = words.length < 2 ? words[0] : `${words.slice(0,-1).join(', ')} and ${words[words.length-1]}`;
      }
      // "Everything" means every configured topping, not merely the selected ones.
      if (this.advancedMode && chosen.length === this.config.toppings.length && chosen.length) {
        const level = this.state.toppings[chosen[0].id];
        if (chosen.every(item => this.state.toppings[item.id] === level)) {
          list = { 1: 'a little bit of everything', 2: 'some of everything', 3: 'a lot of everything' }[level];
        }
      }
      if (!this.advancedMode && chosen.length === this.config.toppings.length && chosen.length) list = 'everything';
      const sentence = chosen.length
        ? `I want ${list}${sauce ? ` with ${sauce.label}` : ''}.`
        : sauce ? `I want a pizza with ${sauce.label}.` : 'I want ….';
      this.root.querySelector('#sentence').textContent = sentence;
      this.root.querySelector('#pizza').setAttribute('aria-label', `Pizza with ${sauce ? sauce.label : 'no sauce selected'}${chosen.length ? ', ' + chosen.map(item => item.label).join(', ') : ''}.`);
    }

    announce(message) { document.querySelector('#announcement').textContent = message; }
    clear() {
      this.config.toppings.forEach(item => this.setLevel(item.id, 0, false));
      this.positions.clear();
      this.setSauce(this.config.defaultSauce, false);
      this.announce('Pizza cleared to a dry crust. Choose a sauce or no sauce.');
    }
  }
  FoodBuilder.nextMaskId = 0;
  window.FoodBuilder = FoodBuilder;
  window.pizzaBuilder = new FoodBuilder(document.querySelector('#builder'), window.PIZZA_CONFIG);
})();
