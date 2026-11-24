// Rooms appear in catalog order within each area. All lesson language stays in English.
window.SchoolTour = (() => {
  const mediaVersion = 'd50eaffe2e3a';
  const asset = path => `${path}?v=${mediaVersion}`;
  const areas = ['Second floor', 'First floor', 'Front offices', 'Grounds & annex'];
  const rooms = [
    ['library', 'library', 0, 'We can read books.', 'We can read books here.', 'open book'],
    ['classroom', 'classroom', 0, 'We study with our class.', 'We sit at our own desks and study together.', 'desk'],
    ['computer', 'computer room', 0, 'We can use computers.', 'Everyone can use a computer here.', 'computer'],
    ['music', 'music room', 0, 'We can play the piano.', 'We can sing and play the piano here.', 'piano'],
    ['art', 'arts and crafts room', 1, 'We can paint pictures.', 'We use brushes and paint to make pictures.', 'paint palette'],
    ['science', 'science room', 1, 'We can do experiments.', 'We look at tiny things with a microscope.', 'microscope'],
    ['cooking', 'cooking room', 1, 'We can cook food.', 'We use a stove to make food.', 'pot'],
    ['lunch', 'lunch room', 1, 'We can eat lunch here.', 'We eat together at the long tables.', 'lunch tray'],
    ['nurse', 'school nurse’s office', 2, 'We can rest here when we feel sick.', 'If we feel sick, we can lie down on a bed here.', 'bed'],
    ['teachers', 'teachers’ office', 2, 'Teachers work at their desks here.', 'Teachers sit together to plan their lessons.', 'lesson notebook'],
    ['principal', 'school principal’s office', 2, 'Our principal meets visitors here.', 'The head of our school meets visitors here.', 'visitor chair'],
    ['office', 'school office', 2, 'School staff help visitors here.', 'Visitors stop at the window to get a pass.', 'visitor pass'],
    ['entrance', 'entrance', 3, 'We change our shoes here.', 'We put our outdoor shoes in cubbies here.', 'indoor shoes'],
    ['restroom', 'restroom', 3, 'We can wash our hands here.', 'There are toilets and sinks here.', 'sink'],
    ['playground', 'playground', 3, 'We can play outside.', 'We can go down the slide outside.', 'slide'],
    ['gym', 'gym', 3, 'We can play basketball.', 'We can shoot baskets on an indoor court.', 'basketball']
  ].map(([id, label, area, blurb, clue, object]) => ({
    id, label, area, model: [`This is the ${label}.`, blurb], clue,
    art: asset(`art/${id}.webp`),
    hint: { object, art: asset(`art/${id}-hint.webp`) },
    audio: { model: asset(`audio/${id}-model.mp3`), clue: asset(`audio/${id}-clue.mp3`) }
  }));
  return { areas, rooms };
})();
