/* Reusable quantity/placement engine. No modules or network requests, so file:// works. */
(() => {
  const t = text => window.ActivityHubI18n ? window.ActivityHubI18n.t(text) : text;
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
      this.selectionOrder = [];
      this.pieces = root.querySelector('#pieces');
      this.mount();
    }
    random() {
      this.seed = (Math.imul(1664525, this.seed) + 1013904223) >>> 0;
      return this.seed / 4294967296;
    }
    placements(topping) {
      if (this.config.placement?.mode === 'ordered-rows') {
        const layout = this.config.placement;
        const rank = Math.max(0, this.selectionOrder.indexOf(topping.id));
        const row = layout.rows[Math.min(rank, layout.rows.length - 1)];
        const count = topping.counts[this.state.toppings[topping.id]];
        return Array.from({length:count}, (_, i) => ({
          x: count === 1 ? 50 : row.left + (row.right-row.left)*i/(count-1),
          y: row.y + (i%2 ? .6 : -.6),
          rotate: (topping.rotation || 0) + (i%3-1)*2,
          scale: 1,
          size: layout.pieceSize
        }));
      }
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
      if (document.addEventListener) document.addEventListener('activityhub:languagechange', () => this.config.toppings.forEach(item => this.updateButton(item)));
      const advancedToggle = document.querySelector('#advanced-mode');
      advancedToggle.addEventListener('change', () => {
        this.advancedMode = this.creative?.active || this.config.easyOnly ? false : advancedToggle.checked;
        advancedToggle.checked = this.advancedMode;
        this.updateSentence();
        this.announce(`${t(this.advancedMode ? 'Hard mode.' : 'Easy mode.')} ${this.root.querySelector('#sentence').textContent}`);
      });
      const sauces = this.root.querySelector('#sauce-options');
      this.config.sauces.forEach(sauce => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sauce-button ah-choice';
        button.dataset.sauce = sauce.id;
        button.title = sauce.label;
        button.innerHTML = `${sauce.art || `<span class="sauce-bowl" style="--sauce-color:${sauce.color};--sauce-highlight:${sauce.highlight}" aria-hidden="true"></span>`}<span>${sauce.buttonLabel || sauce.label}</span><span class="check" aria-hidden="true">✓</span>`;
        button.addEventListener('click', () => this.setSauce(sauce.id));
        sauces.append(button);
      });
      this.config.toppings.forEach((topping, index) => {
        this.state.toppings[topping.id] = 0;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'topping-button ah-choice';
        button.style.setProperty('--ingredient-color', topping.color);
        button.title = topping.label;
        button.innerHTML = `<span class="ingredient-art">${topping.art}</span><span class="ingredient-name">${topping.label}</span>${this.config.interaction === 'layers' ? '' : '<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>'}`;
        button.addEventListener('click', () => this.chooseTopping ? this.chooseTopping(topping.id) : this.creative?.active ? this.creative.add(topping.id) : this.setLevel(topping.id, (this.state.toppings[topping.id] + 1) % 4));
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
      if (this.config.bases) {
        this.config.bases.forEach(base => {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'base-button ah-choice';
          button.dataset.base = base.id;
          button.innerHTML = `${base.art || ''}<span>${base.buttonLabel || base.label}</span>`;
          button.addEventListener('click', () => this.chooseBase ? this.chooseBase(base.id) : this.setBase(base.id));
          this.root.querySelector('#base-options').append(button);
        });
        this.setBase(this.config.defaultBase ?? null, false);
      }
      this.setSauce(this.config.defaultSauce, false);
    }
    setBase(id, announce = true) {
      const base = this.config.bases?.find(item => item.id === id);
      if (id !== null && !base) return;
      this.state.base = id;
      this.root.querySelectorAll('[data-base]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.base === id)));
      this.renderBase?.(base);
      this.updateSentence();
      if (announce) this.announce(`${base.label}: ${t('selected.')}`);
    }
    setSauce(id, announce = true) {
      const sauce = this.config.sauces.find(item => item.id === id);
      if (id !== null && !sauce) return;
      this.state.sauce = id;
      this.root.querySelectorAll('[data-sauce]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sauce === id)));
      this.renderSauce?.(sauce);
      this.updateSentence();
      if (announce && sauce) this.announce(`${sauce.label}: ${t('selected.')}`);
    }
    setLevel(id, level, announce = true) {
      const topping = this.config.toppings.find(item => item.id === id);
      if (!topping || !Number.isInteger(level) || level < 0 || level > 3) return;
      const previous = this.state.toppings[id];
      if (!previous && level) this.selectionOrder.push(id);
      if (!level) this.selectionOrder = this.selectionOrder.filter(value => value !== id);
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
        piece.style.cssText = `left:${point.x}%;top:${point.y}%;width:${point.size || topping.size}%;--rotation:${point.rotate}deg;--scale:${point.scale};--delay:${(i-start)*22}ms`;
        piece.innerHTML = topping.art;
        group.append(piece);
      }
      if (this.config.placement?.mode === 'ordered-rows') this.arrangeRows();
      this.updateButton(topping);
      this.updateSentence();
      if (announce) this.announce(`${topping.label}: ${t(['removed', 'light', 'regular', 'extra'][level])}.`);
    }
    arrangeRows() {
      this.selectionOrder.forEach((id, rank) => {
        const topping = this.config.toppings.find(item => item.id === id);
        const group = this.groups.get(id);
        group.style.zIndex = rank + 1;
        this.placements(topping).forEach((point, i) => {
          const piece = group.children[i];
          piece.style.cssText = `left:${point.x}%;top:${point.y}%;width:${point.size}%;--rotation:${point.rotate}deg;--scale:${point.scale};--delay:0ms`;
        });
      });
    }
    updateButton(topping) {
      const level = this.state.toppings[topping.id];
      const button = this.buttons.get(topping.id);
      button.setAttribute('aria-pressed', String(level > 0));
      if (this.creative?.active) { button.setAttribute('aria-label', `${topping.label}. ${t('Add one piece.')}`); return; }
      button.setAttribute('aria-label', `${topping.label}, ${t(['none', 'light', 'regular', 'extra'][level])}. ${t(level === 3 ? 'Tap to remove.' : 'Tap to add more.')}`);
      [...button.querySelectorAll('.dots i')].forEach((dot, index) => dot.classList.toggle('filled', index < level));
    }
    setSentence(sentence) {
      const element = this.root.querySelector('#sentence');
      if (!window.BuilderPronunciation) { element.textContent = sentence; return; }
      this.pronunciation ||= new window.BuilderPronunciation(element);
      const catalog = [...this.config.toppings, ...(this.config.bases || []), ...this.config.sauces, ...(this.creative?.catalog || [])];
      const names = catalog.flatMap(item => [item.label, item.countSingular, item.countPlural]);
      this.pronunciation.render(sentence, names);
    }
    updateSentence() {
      if (this.creative?.active) {
        const words=[];
        for(const topping of this.creative.catalog) {
          for(const band of ['small','medium','big']) {
            const count=this.creative.items.filter(item=>item.topping===topping.id && FoodBuilder.sizeBand(item.scale,this.config.creativeSizes)===band).length;
            if(count)words.push(`${count} ${band} ${count===1?(topping.countSingular||topping.label):(topping.countPlural||topping.label)}`);
          }
        }
        const base=this.config.bases?.find(item=>item.id===this.state.base&&!item.empty);
        if(base)words.unshift(base.label);
        const list=words.length<2?(words[0]||''):words.length===2?words.join(' and '):words.slice(0,-1).join(', ')+', and '+words.at(-1);
        const sauce=this.config.sauces.find(item=>item.id===this.state.sauce);
        const sentence=list?`I want ${list}${sauce?' with '+sauce.label:''}.`:sauce?`I want a ${this.config.noun||'pizza'} with ${sauce.label}.`:'I want ….';
        this.setSentence(sentence);
        this.root.querySelector(this.config.sceneSelector||'#pizza').setAttribute('aria-label',sentence);
        return;
      }
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
      const base = this.config.bases?.find(item => item.id === this.state.base && !item.empty);
      const sentence = base
        ? `I want ${base.label}${chosen.length ? ' and ' + list : ''}${sauce ? ' with ' + sauce.label : ''}.`
        : chosen.length
        ? `I want ${list}${sauce ? ` with ${sauce.label}` : ''}.`
        : sauce ? `I want a ${this.config.noun || 'pizza'} with ${sauce.label}.` : 'I want ….';
      this.setSentence(sentence);
      this.root.querySelector(this.config.sceneSelector || '#pizza').setAttribute('aria-label', `${this.config.noun || 'Pizza'} with ${sauce ? sauce.label : 'no sauce selected'}${chosen.length ? ', ' + chosen.map(item => item.label).join(', ') : ''}.`);
    }

    announce(message) { document.querySelector('#announcement').textContent = t(message); }
    clear() {
      if (this.creative?.active) { this.creative.clear(); return; }
      this.config.toppings.forEach(item => this.setLevel(item.id, 0, false));
      this.positions.clear();
      this.selectionOrder = [];
      if (this.config.bases) this.setBase(this.config.defaultBase ?? null, false);
      this.setSauce(this.config.defaultSauce, false);
      this.announce(this.config.resetMessage || 'Pizza cleared to a dry crust. Choose a sauce or no sauce.');
    }
  }
  FoodBuilder.sizeBand=(scale,policy={})=>scale<(policy.smallBelow??1.75)?'small':scale>=(policy.bigFrom??2.75)?'big':'medium';
  FoodBuilder.nextMaskId = 0;
  window.FoodBuilder = FoodBuilder;

})();
