/* Pizza-specific sauce renderer; shared engine owns selection and language. */
(() => {
 const t = text => window.ActivityHubI18n ? window.ActivityHubI18n.t(text) : text;
 class PizzaBuilder extends window.FoodBuilder {
    cancelRestoreAnimation() {
      if(this.restoreFrame!=null)cancelAnimationFrame(this.restoreFrame);
      this.restoreFrame=null;
      for(const piece of this.restorePieces||[]){piece.className='piece restored-piece';piece.style.visibility='';}
      this.restorePieces=null;
    }
    setLevel(id,level,announce=true,options) {
      this.cancelRestoreAnimation();
      super.setLevel(id,level,announce,options);
    }
    animateRestoredCreation() {
      this.cancelRestoreAnimation();
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
      const pieces=[...this.groups.values()].flatMap(group=>[...group.children]);
      this.setSauce(this.state.sauce,false,{animate:true,onComplete:()=>{
        let index=0,last;
        const reveal=now=>{
          if(!this.restorePieces)return;
          if(index<pieces.length&&(last===undefined||now-last>=180)){
            for(const piece of pieces.slice(index,index+12)){piece.style.visibility='';piece.style.setProperty('--delay','0ms');piece.className='piece replaying-piece';}
            index+=12;last=now;
          }
          if(index<pieces.length||(last!==undefined&&now-last<460))this.restoreFrame=requestAnimationFrame(reveal);
          else this.cancelRestoreAnimation();
        };
        this.restoreFrame=requestAnimationFrame(reveal);
      }});
      this.restorePieces=pieces;
      for(const piece of pieces)piece.style.visibility='hidden';
    }
    setSauce(id, announce = true, {animate=announce,onComplete} = {}) {
      this.cancelRestoreAnimation();
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
        // Fixed geometry: reveal by measured SVG-unit length, without pathLength
        // normalization or reparsing a growing path on every animation frame.
        const points = [],lengths=[0];let previous;
        for (let i = 0; i <= 720; i++) {
          const progress = i / 720;
          const angle = progress * Math.PI * 7 - Math.PI / 2;
          const radius = progress * 57;
          const x=50+Math.cos(angle)*radius,y=50+Math.sin(angle)*radius;
          if(previous)lengths.push(lengths.at(-1)+Math.hypot(x-previous.x,y-previous.y));
          previous={x,y};points.push(`${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`);
        }
        const path = points.join(' '),length=lengths.at(-1);
        const maskId = `sauce-spread-${window.FoodBuilder.nextMaskId++}`;
        surface.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><mask id="${maskId}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140"><path class="sauce-reveal" d="${path}" stroke-dasharray="${length} ${length}" stroke-dashoffset="${length}" fill="none" stroke="white" stroke-width="0" stroke-linecap="round"/></mask><radialGradient id="${maskId}-color" cx="35%" cy="30%" r="75%"><stop stop-color="${sauce.highlight}"/><stop offset="1" stop-color="${sauce.color}"/></radialGradient><clipPath id="${maskId}-edge"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#${maskId}-edge)" mask="url(#${maskId})"><circle cx="50" cy="50" r="50" fill="url(#${maskId}-color)"/><path d="${path}" fill="none" stroke="${sauce.highlight}" stroke-opacity=".3" stroke-width="1.2" stroke-linecap="round"/></g></svg>`;
        const reveal = surface.querySelector('.sauce-reveal');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let started;
        const draw = now => {
          if (started === undefined) started = now;
          const progress = (!animate || reducedMotion.matches) ? 1 : Math.min((now - started) / 1900, 1);
          // Follow the spiral at a steady angular pace; overlap each previous turn.
          const position=progress*(points.length-1),index=Math.floor(position);
          const visible=lengths[index]+((lengths[index+1]??length)-lengths[index])*(position-index);
          reveal.setAttribute('stroke-dashoffset',String(Math.max(0,length-visible)));
          reveal.setAttribute('stroke-width', String(19 * Math.min(progress / .10, 1)));
          if (progress < 1) this.sauceFrame = requestAnimationFrame(draw);
          else {this.sauceFrame = null;onComplete?.();}
        };
        if (!animate || reducedMotion.matches) draw(0);
        else this.sauceFrame = requestAnimationFrame(draw);
      }
      if(!sauce||sauce.empty)onComplete?.();
      this.root.querySelectorAll('[data-sauce]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sauce === id)));
      this.updateSentence();
      if (announce) this.announce(sauce ? `${sauce.label}: ${t('selected.')}` : 'Dry crust. Choose a sauce or no sauce.');
    }
 }
 window.pizzaBuilder = new PizzaBuilder(document.querySelector('#builder'), window.PIZZA_CONFIG);
})();
