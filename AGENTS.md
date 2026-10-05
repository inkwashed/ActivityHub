# ActivityHub working conventions

This folder is the canonical working project for ActivityHub. Make future Pizza Builder changes in `apps/pizza/`, not in the old Codex task's `outputs/pizza-builder/` snapshot.

- Keep applets plain HTML, CSS, and JavaScript with no external dependencies unless the user requests a change.
- Preserve direct opening of `index.html` on desktop and static hosting compatibility.
- Prioritize touch-friendly iPad layouts, while keeping small screens and enlarged text usable.
- Keep original artwork and no student data collection.
- Preserve topping order and bottom-to-top stacking: cheese, pepperoni, sausage, tomatoes, green peppers, mushrooms, onions, pineapples, corn.
- Keep EASY/HARD, language, back navigation, and fullscreen controls consistent across future applets.
- Back navigation and Japanese are currently placeholders; do not imply they are functional.
- Tests under `tests/` use mocks; do not claim browser or device verification from these tests.
- Create ZIP releases only when requested or useful for delivery. The source in this repository remains authoritative.
