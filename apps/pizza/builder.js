/* Pizza-specific sauce renderer; shared engine owns selection and language. */
(() => {
 const t = text => window.ActivityHubI18n ? window.ActivityHubI18n.t(text) : text;
 class PizzaBuilder extends window.FoodBuilder {
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
        const maskId = `sauce-spread-${window.FoodBuilder.nextMaskId++}`;
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
      if (announce) this.announce(sauce ? `${sauce.label}: ${t('selected.')}` : 'Dry crust. Choose a sauce or no sauce.');
    }
 }
 window.pizzaBuilder = new PizzaBuilder(document.querySelector('#builder'), window.PIZZA_CONFIG);
})();
