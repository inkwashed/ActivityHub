/* Shared recorded vocabulary and browser speech for builder results. Does not alter order text. */
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
      try { this.synth = window.speechSynthesis; } catch { this.synth = null; }
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
      this.question = document.querySelector?.('[data-pronunciation-question]');
      if (this.question) {
        this.question.disabled = !(this.available || this.recording(this.question.textContent));
        this.question.addEventListener('click', () => this.speak(this.question.textContent));
      }
      this.labels = () => {
        this.question?.setAttribute('aria-label', `${t('Listen')}: ${this.question.textContent}`);
        const canPlay = this.available || !!this.recording(this.sentence.textContent);
        this.button.disabled = !canPlay;
        const label = canPlay ? 'Listen to your order' : 'Pronunciation is unavailable in this browser';
        this.button.setAttribute('aria-label', t(label));
        this.button.title = t(label);
        sentence.querySelectorAll('.pronunciation-word').forEach(button => {
          button.setAttribute('aria-label', `${t('Listen')}: ${button.textContent}`);
        });
      };
      document.addEventListener('activityhub:languagechange', this.labels);
      window.addEventListener('pagehide', () => this.stop());
      this.labels();
      // Device voice services can fail on managed/older browsers. Audio is optional.
      try { this.mountSettings(); } catch (error) {
        this.available = false;
        this.button.disabled = true;
        if(this.previewButton)this.previewButton.disabled = true;
        if(this.voiceSelect)this.voiceSelect.disabled = true;
        this.labels();
        if(this.settingsStatus)this.settingsStatus.textContent=t('Pronunciation is unavailable in this browser');
        console.warn('Voice settings unavailable; activity remains usable.', error);
      }
    }
    voiceKey(voice) { return JSON.stringify([voice.voiceURI || voice.name, voice.lang]); }
    englishVoices() {
      try { return Array.from(this.synth?.getVoices?.() || []).filter(voice => voice && /^en(?:[-_]|$)/i.test(voice.lang)); }
      catch { return []; }
    }
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
      section.innerHTML = '<label for="pronunciation-voice" data-i18n="Default voice">Default voice</label><div class="pronunciation-settings-row"><select id="pronunciation-voice"></select><button type="button" class="ah-button" data-i18n="Try voice">Try voice</button></div><p class="pronunciation-note" data-i18n="Recorded audio is used when available. This voice is the fallback when recordings are missing or cannot play. Online voices may need an internet connection.">Recorded audio is used when available. This voice is the fallback when recordings are missing or cannot play. Online voices may need an internet connection.</p><p class="pronunciation-note" data-i18n="No sound on iPad? Turn off Silent Mode in Control Center.">No sound on iPad? Turn off Silent Mode in Control Center.</p><p class="pronunciation-note" role="status"></p>';
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
      preview.addEventListener('click', () => this.speak('What do you want? I want strawberries, cheese, and vanilla ice cream.', this.settingsStatus, true));
      this.synth?.addEventListener?.('voiceschanged', this.refreshVoices);
      document.addEventListener('activityhub:languagechange', this.refreshVoices);
      document.querySelector('#language')?.addEventListener('click', this.refreshVoices);
      window.addEventListener('storage', event => {
        if (event.key === 'letseigo.englishVoice') { this.preferredVoice = event.newValue || ''; this.refreshVoices(); }
      });
      dialog.addEventListener('close', () => this.stop());
      this.refreshVoices();
    }
    stop() {
      this.sequenceRequest=(this.sequenceRequest||0)+1;
      for(const source of this.sequenceSources||[]){try{source.stop();}catch{}}
      this.sequenceSources=[];
      if (this.audio) {
        const audio = this.audio;
        this.audio = null;
        audio.onended = audio.onerror = null;
        audio.pause();
      }
      window.clearTimeout(this.startTimer);
      if (this.previewButton) this.previewButton.setAttribute('data-playing', 'false');
      if (this.utterance) {
        this.utterance = null;
        this.synth.cancel();
      }
    }
    recording(text) {
      if (!window.Audio) return null;
      return window.ActivityHubAudio?.resolveSequence?.(text) || window.ActivityHubAudio?.resolve(text);
    }
    async playJoined(urls, text, status) {
      this.stop();
      const request=this.sequenceRequest;
      try {
        const Context=window.AudioContext||window.webkitAudioContext;
        this.audioContext ||= new Context();
        // Resume during the original tap, before waiting for downloads.
        const resumed=this.audioContext.resume();
        this.decodedClips ||= new Map();
        const buffers=await Promise.all(urls.map(url=>{
          if(!this.decodedClips.has(url)){
            const pending=window.fetch(url).then(response=>{
              if(!response.ok)throw new Error('Audio download failed');
              return response.arrayBuffer();
            }).then(bytes=>this.audioContext.decodeAudioData(bytes));
            this.decodedClips.set(url,pending);
            pending.catch(()=>this.decodedClips.delete(url));
            if(this.decodedClips.size>64)this.decodedClips.delete(this.decodedClips.keys().next().value);
          }
          return this.decodedClips.get(url);
        }));
        await resumed;
        if(request!==this.sequenceRequest)return;
        let when=this.audioContext.currentTime+.04;
        buffers.forEach(buffer=>{
          // Skip quiet synthesis/MP3 tails below -60 dB, retaining 60 ms around speech.
          // Approved recordings themselves are never modified.
          const data=buffer.getChannelData(0),margin=Math.ceil(buffer.sampleRate*.06);
          let first=0,last=data.length-1;
          while(first<last&&Math.abs(data[first])<.001)first++;
          while(last>first&&Math.abs(data[last])<.001)last--;
          const start=Math.max(0,first-margin)/buffer.sampleRate;
          const end=Math.min(data.length,last+margin+1)/buffer.sampleRate;
          const source=this.audioContext.createBufferSource();source.buffer=buffer;
          source.connect(this.audioContext.destination);
          this.sequenceSources.push(source);
          source.onended=()=>{source.disconnect();this.sequenceSources=this.sequenceSources.filter(s=>s!==source)};
          source.start(when,start,end-start);when+=end-start;
        });
      }catch(error){
        if(request===this.sequenceRequest)this.speak(text,status,true);
      }
    }
    speak(text, status = this.status, browserOnly = false) {
      const url = !browserOnly && this.recording(text);
      if(Array.isArray(url)&&url.length>1&&window.fetch&&(window.AudioContext||window.webkitAudioContext)&&window.location?.protocol!=='file:'){
        this.playJoined(url,text,status);return;
      }
      if (url) {
        this.stop();
        let audio;
        const fallback = () => {
          if (this.audio !== audio) return;
          this.stop();
          this.speak(text, status, true);
        };
        try {
          const urls = Array.isArray(url) ? url : [url];
          let index = 0;
          audio = new window.Audio(urls[0]);
          this.audio = audio;
          const play = () => {
            // Ignore a late rejection from an earlier part of the same request.
            const part = index;
            try { audio.play()?.catch(() => { if (index === part) fallback(); }); }
            catch { fallback(); }
          };
          audio.onended = () => {
            if (this.audio !== audio) return;
            if (++index === urls.length) { this.audio = null; return; }
            // Reuse the element started by the tap. A blocked second play falls
            // back to browser speech for the complete sentence.
            try { audio.src = urls[index]; play(); } catch { fallback(); }
          };
          audio.onerror = fallback;
          // Start directly in the tap handler for Safari; never preload the library.
          play();
        } catch {
          if (audio) fallback();
          else this.speak(text, status, true);
        }
        return;
      }
      const report = message => {
        this.lastPlaybackMessage = message;
        // Routine diagnostics belong in settings, never below the artwork.
        if (status === this.settingsStatus) status.textContent = message;
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
        if ((this.available || this.recording(part)) && known.has(part.toLowerCase())) {
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
