/* Optional, local browser speech for builder results. Does not alter order text. */
(() => {
  const t = text => window.ActivityHubI18n?.t(text) || text;
  const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function segments(text, names) {
    const phrases = [...new Set(names.filter(Boolean))].sort((a,b) => b.length-a.length);
    if (!phrases.length) return [text];
    return text.split(new RegExp(`(\\b(?:${phrases.map(escape).join('|')})\\b)`, 'gi'));
  }
  class BuilderPronunciation {
    constructor(sentence) {
      this.sentence = sentence;
      this.synth = window.speechSynthesis;
      this.available = !!(this.synth && window.SpeechSynthesisUtterance);
      this.button = document.createElement('button');
      this.button.type = 'button';
      this.button.className = 'ah-button ah-button-icon pronunciation-speaker';
      this.button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4L6 8H3V16H6L11 20Z M15 8Q19 12 15 16 M18 5Q24 12 18 19"/></svg>';
      sentence.parentElement.append(this.button);
      this.status = document.createElement('span');
      this.status.className = 'pronunciation-status';
      this.status.setAttribute('role', 'status');
      sentence.parentElement.after(this.status);
      this.button.disabled = !this.available;
      this.button.addEventListener('click', () => this.speak(sentence.textContent));
      this.labels = () => {
        const label = this.available ? 'Listen to your order' : 'Pronunciation is unavailable in this browser';
        this.button.setAttribute('aria-label', t(label));
        this.button.title = t(label);
        sentence.querySelectorAll('.pronunciation-word').forEach(button => {
          button.setAttribute('aria-label', `${t('Listen')}: ${button.textContent}`);
        });
      };
      document.addEventListener('activityhub:languagechange', this.labels);
      window.addEventListener('pagehide', () => this.stop());
      this.labels();
      this.mountSettings();
    }
    voiceKey(voice) { return JSON.stringify([voice.voiceURI || voice.name, voice.lang]); }
    englishVoices() { return this.synth?.getVoices().filter(voice => /^en(?:[-_]|$)/i.test(voice.lang)) || []; }
    recommendedVoices() {
      // Exclude novelty/effect voices; keep a small, device-dependent shortlist.
      const novelty = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|trinoids|whisper|wobble|zarvox)\b/i;
      const seen = new Set();
      const voices = this.englishVoices().filter(voice => {
        const key = `${voice.name}|${voice.lang}|${voice.localService}`;
        if (novelty.test(voice.name || '') || seen.has(key)) return false;
        seen.add(key); return true;
      });
      const google = voices.find(voice => /^Google US English$/i.test(voice.name || '') && /^en[-_]US$/i.test(voice.lang));
      const rest = voices.filter(voice => voice !== google);
      const us = rest.find(voice => /^en[-_]US$/i.test(voice.lang));
      const fallback = rest.find(voice => voice !== us && voice.default) || rest.find(voice => voice !== us);
      return [google, us, fallback].filter(Boolean);
    }
    mountSettings() {
      const dialog = document.querySelector?.('#language-dialog');
      if (!dialog) return;
      const section = document.createElement('div');
      section.className = 'pronunciation-settings';
      section.innerHTML = '<label for="pronunciation-voice" data-i18n="Default voice">Default voice</label><div class="pronunciation-settings-row"><select id="pronunciation-voice"></select><button type="button" class="ah-button" data-i18n="Try voice">Try voice</button></div><p class="pronunciation-note" data-i18n="English voices available on this device. Online voices may need an internet connection.">English voices available on this device. Online voices may need an internet connection.</p><p class="pronunciation-note" role="status"></p>';
      dialog.append(section);
      this.voiceSelect = section.querySelector('select');
      const preview = section.querySelector('button');
      this.previewButton = preview;
      preview.className = 'ah-button ah-button-secondary';
      this.settingsStatus = section.querySelector('[role="status"]');
      try { this.preferredVoice = window.localStorage.getItem('letseigo.englishVoice') || ''; } catch { this.preferredVoice = ''; }
      this.refreshVoices = () => {
        const voices = this.recommendedVoices();
        this.voiceSelect.replaceChildren();
        const option = (value, label) => { const el = document.createElement('option'); el.value = value; el.textContent = label; this.voiceSelect.append(el); };
        option('', t('Automatic (English)'));
        option('device-default', t('Device default (English)'));
        voices.forEach(voice => option(this.voiceKey(voice), `${voice.name} · ${voice.lang} · ${t(voice.localService ? 'On device' : 'Online')}`));
        const missing = this.preferredVoice && this.preferredVoice !== 'device-default' && !voices.some(voice => this.voiceKey(voice) === this.preferredVoice);
        this.voiceSelect.value = missing ? '' : this.preferredVoice;
        this.voiceSelect.disabled = !this.available;
        preview.disabled = !this.available;
        if (!this.utterance && !this.lastPlaybackMessage) this.settingsStatus.textContent = !this.available ? t('Pronunciation is unavailable in this browser') : missing ? t('Your saved voice is not in the recommended list. Using automatic English for now.') : '';
      };
      this.voiceSelect.addEventListener('change', () => {
        this.stop();
        this.preferredVoice = this.voiceSelect.value;
        try { window.localStorage.setItem('letseigo.englishVoice', this.preferredVoice); } catch { /* Session-only if storage is blocked. */ }
        this.refreshVoices();
      });
      preview.addEventListener('click', () => this.speak('What do you want? I want strawberries, cheese, and vanilla ice cream.', this.settingsStatus));
      this.synth?.addEventListener('voiceschanged', this.refreshVoices);
      document.addEventListener('activityhub:languagechange', this.refreshVoices);
      document.querySelector('#language')?.addEventListener('click', this.refreshVoices);
      window.addEventListener('storage', event => {
        if (event.key === 'letseigo.englishVoice') { this.preferredVoice = event.newValue || ''; this.refreshVoices(); }
      });
      dialog.addEventListener('close', () => this.stop());
      this.refreshVoices();
    }
    stop() {
      window.clearTimeout(this.startTimer);
      if (this.previewButton) this.previewButton.setAttribute('data-playing', 'false');
      if (this.utterance) {
        this.utterance = null;
        this.synth.cancel();
      }
    }
    speak(text, status = this.status) {
      const report = message => {
        this.lastPlaybackMessage = message;
        status.textContent = message;
        if (this.settingsStatus && status !== this.settingsStatus) this.settingsStatus.textContent = message;
      };
      if (!this.available) { report(t('Pronunciation is unavailable in this browser')); return; }
      this.stop();
      report(t('Starting audio…'));
      if (this.previewButton) this.previewButton.setAttribute('data-playing', 'true');
      let utterance;
      try {
        utterance = new window.SpeechSynthesisUtterance(text.replace(/\s+/g, ' ').trim());
        const english = this.recommendedVoices();
        const voice = this.preferredVoice === 'device-default' ? null : english.find(voice => this.voiceKey(voice) === this.preferredVoice) || english[0];
        utterance.lang = voice?.lang || 'en-US';
        if (voice) utterance.voice = voice;
        utterance.rate = .9;
        utterance.volume = 1;
        this.utterance = utterance;
        const finished = () => {
          window.clearTimeout(this.startTimer);
          this.utterance = null;
          if (this.previewButton) this.previewButton.setAttribute('data-playing', 'false');
        };
        utterance.onstart = () => {
          if (this.utterance !== utterance) return;
          window.clearTimeout(this.startTimer);
          report(t('Browser reports audio playback started.'));
        };
        utterance.onend = () => {
          if (this.utterance !== utterance) return;
          finished(); report(t('Browser reports audio playback finished.'));
        };
        utterance.onerror = event => {
          if (this.utterance !== utterance) return;
          finished();
          report(`${t('Audio could not play. Please try again.')} (${event.error || 'unknown'})`);
        };
        this.startTimer = window.setTimeout(() => {
          if (this.utterance !== utterance) return;
          this.stop();
          report(t('Speech did not start. Try Device default (English) in language settings.'));
        }, 10000);
        // Keep playback inside the tap handler, including a paused-engine resume.
        if (this.synth.paused) this.synth.resume();
        this.synth.speak(utterance);
      } catch (error) {
        this.stop();
        report(`${t('Audio could not play. Please try again.')} (${error.name || 'unknown'})`);
      }
    }
    render(text, names) {
      if (this.text === text) return;
      this.stop();
      this.text = text;
      this.sentence.replaceChildren();
      const known = new Set(names.filter(Boolean).map(name => name.toLowerCase()));
      for (const part of segments(text, names)) {
        if (this.available && known.has(part.toLowerCase())) {
          const button = document.createElement('button');
          button.type = 'button'; button.className = 'pronunciation-word';
          button.textContent = part; button.lang = 'en';
          button.addEventListener('click', () => this.speak(part));
          this.sentence.append(button);
        } else this.sentence.append(document.createTextNode(part));
      }
      this.labels();
    }
  }
  BuilderPronunciation.segments = segments;
  window.BuilderPronunciation = BuilderPronunciation;
})();
