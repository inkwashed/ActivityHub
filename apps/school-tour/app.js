(() => {
  const { areas, rooms } = SchoolTour;
  const { t } = ActivityHubI18n;
  const get = id => document.getElementById(id);
  const campus = get('campus');
  const detail = get('detail');
  const detective = get('detective');
  const next = get('next');
  const hint = get('hint');
  const hintToggle = get('hint-toggle');
  const activity = document.querySelector('.workspace');
  const map = document.querySelector('.map');
  const side = document.querySelector('.side');
  const stacked = matchMedia('(max-width: 739px)');
  const modeButtons = document.querySelectorAll('button[data-mode]');
  const audioButtons = document.querySelectorAll('button[data-audio]');
  const roomButtons = new Map();
  const attempted = new Set();
  const player = new Audio();

  let mode = 'learn';
  let selected = rooms[0];
  let favorite = null;
  let round = [];
  let questionIndex = 0;
  let solved = false;
  let finished = false;
  let feedback = '';
  let requestedAudio = 0;

  const currentQuestion = () => round[questionIndex];
  const currentDetail = () => mode === 'learn' ? selected : solved && !finished ? currentQuestion() : null;

  function mountMap() {
    const roof = document.createElement('div');
    roof.className = 'school-roof';
    roof.setAttribute('aria-hidden', 'true');
    campus.append(roof);
    areas.forEach((area, index) => {
      const floor = document.createElement('section');
      floor.className = 'area';
      const heading = document.createElement('h3');
      heading.id = `area-${index}`;
      heading.dataset.i18n = area;
      heading.textContent = t(area);
      floor.setAttribute('aria-labelledby', heading.id);

      const grid = document.createElement('div');
      grid.className = 'rooms';
      rooms.filter(room => room.area === index).forEach(room => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'ah-choice room';
        button.dataset.room = room.id;
        button.lang = 'en';
        const image = new Image();
        image.width = 480;
        image.height = 220;
        image.src = room.art;
        image.alt = '';
        const label = document.createElement('span');
        label.className = 'room-name';
        label.textContent = room.label;
        const mark = document.createElement('span');
        mark.className = 'room-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.hidden = true;
        button.append(image, label, mark);
        button.addEventListener('click', () => choose(room));
        grid.append(button);
        roomButtons.set(room.id, { button, mark });
      });
      floor.append(heading, grid);
      campus.append(floor);
    });
  }

  function stopAudio() {
    requestedAudio++;
    player.pause();
    get('audio-status').textContent = '';
  }

  function play(clip) {
    if (!clip) return;
    stopAudio();
    const request = requestedAudio;
    player.src = clip;
    player.play().catch(() => {
      if (request === requestedAudio) get('audio-status').textContent = t('Audio is unavailable.');
    });
  }

  function renderMap() {
    for (const room of rooms) {
      const { button, mark } = roomButtons.get(room.id);
      const active = mode === 'learn' ? room === selected : solved && !finished && room === currentQuestion();
      button.setAttribute('aria-pressed', String(active));
      if (mode === 'quiz' && (solved || finished)) button.setAttribute('aria-disabled', 'true');
      else button.removeAttribute('aria-disabled');

      if (mode === 'learn') mark.textContent = room === favorite ? '★' : active ? '✓' : '';
      else mark.textContent = active ? '✓' : !solved && attempted.has(room) ? '×' : '';
      mark.hidden = !mark.textContent;
    }
  }

  function renderDetail() {
    const room = currentDetail();
    detail.hidden = !room;
    if (!room) return;
    get('room-title').textContent = room.label;
    get('scene').src = room.art;
    document.querySelectorAll('#model p').forEach((line, index) => { line.textContent = room.model[index]; });

    const learning = mode === 'learn';
    const starred = favorite === room;
    get('back-to-room').hidden = !learning;
    get('favorite-area').hidden = !learning;
    get('favorite').setAttribute('aria-pressed', String(starred));
    get('favorite-icon').textContent = starred ? '★' : '☆';
    get('partner').hidden = !starred;
    get('partner-answer').textContent = `“This is my favorite place. ${room.model[0]}”`;
  }

  function renderQuiz() {
    detective.hidden = mode !== 'quiz';
    next.hidden = mode !== 'quiz' || (!solved && !finished);
    if (mode !== 'quiz') return;
    const room = currentQuestion();
    get('question').hidden = finished;
    get('progress').textContent = `${questionIndex + 1} / ${round.length}`;
    get('clue').textContent = room.clue;
    if (!hint.hidden && hint.getAttribute('src') !== room.hint.art) hint.src = room.hint.art;
    get('feedback').textContent = t(feedback);
    next.textContent = t(finished ? 'New round' : questionIndex === round.length - 1 ? 'Finish round' : 'Next');
  }

  function updateOrder() {
    const first = mode === 'quiz' ? side : map;
    if (activity.firstElementChild !== first) activity.prepend(first);
  }

  function render() {
    activity.dataset.mode = mode;
    modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
    const instruction = mode === 'learn' ? 'Tap a place to explore.' : 'Find the place on the map.';
    get('map-instructions').dataset.i18n = instruction;
    get('map-instructions').textContent = t(instruction);
    updateOrder();
    renderMap();
    renderDetail();
    renderQuiz();
    for (const button of audioButtons) {
      const room = button.dataset.audio === 'model' ? currentDetail() : currentQuestion();
      button.hidden = !room?.audio[button.dataset.audio];
    }
  }

  function choose(room) {
    if (mode === 'learn') {
      stopAudio();
      selected = room;
      render();
      if (stacked.matches) get('room-title').focus();
      return;
    }
    if (solved || finished) return;
    if (room === currentQuestion()) {
      stopAudio();
      solved = true;
      feedback = 'That’s right!';
      render();
      get('room-title').focus();
    } else {
      attempted.add(room);
      feedback = 'Try another place.';
      // Keep room focus for another guess while announcing repeated misses.
      get('feedback').textContent = '';
      render();
    }
  }

  function resetQuestion() {
    attempted.clear();
    solved = false;
    feedback = '';
    hintToggle.setAttribute('aria-pressed', 'false');
    hint.hidden = true;
    hint.removeAttribute('src');
  }

  function startRound() {
    const pool = [...rooms];
    for (let index = pool.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [pool[index], pool[other]] = [pool[other], pool[index]];
    }
    round = pool.slice(0, 8);
    questionIndex = 0;
    finished = false;
    resetQuestion();
  }

  modeButtons.forEach(button => button.addEventListener('click', () => {
    if (mode === button.dataset.mode) return;
    stopAudio();
    mode = button.dataset.mode;
    if (mode === 'quiz' && !round.length) startRound();
    render();
  }));

  next.addEventListener('click', () => {
    stopAudio();
    if (finished) startRound();
    else if (questionIndex === round.length - 1) {
      finished = true;
      feedback = 'Round complete!';
    } else {
      questionIndex++;
      resetQuestion();
    }
    render();
    get('detective-title').focus();
  });

  hintToggle.addEventListener('click', () => {
    hint.hidden = !hint.hidden;
    hintToggle.setAttribute('aria-pressed', String(!hint.hidden));
    renderQuiz();
  });
  audioButtons.forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.audio;
    const room = kind === 'model' ? currentDetail() : currentQuestion();
    play(room?.audio[kind]);
  }));

  get('favorite').addEventListener('click', () => {
    favorite = favorite === selected ? null : selected;
    renderMap();
    renderDetail();
  });
  get('back-to-room').addEventListener('click', () => roomButtons.get(selected.id).button.focus());
  window.addEventListener('pagehide', stopAudio);
  document.addEventListener('activityhub:languagechange', render);
  mountMap();
  render();
})();
