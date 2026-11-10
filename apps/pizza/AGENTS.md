# Pizza Builder specifics

Follow the root instructions and central workflow/style references.

- Preserve topping tray and LEARN bottom-to-top layer order: cheese, pepperoni, sausage, tomatoes, green peppers, mushrooms, onions, pineapples, corn.
- Preserve dry-crust startup, explicit sauce/no-sauce choice, stable topping placements, and three amount levels followed by removal.
- EASY uses plain names and the all-toppings shortcut. HARD groups quantities and uses the established matching-level everything phrases. Keep sauce wording at the end.
- Back navigation links to `../../#lets-try-2`. Japanese translates controls/instructions only; vocabulary, the main question, order sentence, and exported order stay English.
- The Save photo is a local baked-looking preview/export; it must not change the editable pizza or transmit student data.
- Most Builder checks under `tests/` use mocks. The local `_dev/builder/restore-check.html` runs rendered browser checks. Report each kind of evidence separately; neither establishes physical iPad behavior.

These are current activity-specific constraints, not requirements to copy into unrelated applets. Revise them when the user changes the activity.

- PLAY mode is an independent composition with singular editable pieces. LEARN/PLAY and EASY/HARD are independent. Preserve one chosen difficulty across build-mode switches. PLAY amounts use configured per-topping count bands; see README for the mapping. Preserve LEARN nodes/placements when switching. Reset affects only the active composition. Photo export must honor PLAY transforms and picker order (later items above earlier ones); LEARN retains the configured ingredient order.
