# Little Parfait Cafe — prototype

Open `apps/parfait/index.html` or serve the repository and visit `/apps/parfait/`. Not listed on the homepage; noindex is not access control.

## Building a parfait

Four layers each have two fruit slots. Tap fruit to fill the selected slot; the first choice advances focus selection to slot two. Choose the same fruit twice for a uniform row, or different fruits for a six-piece alternating row. A single filled slot previews a uniform row. Select either slot to replace or clear it. Layer arrows revisit rows without losing selections. The options-pane arrows switch between ice cream/fruit and syrup.

EASY permits direct editing. HARD guides the English exchange with “Parfait, please!”, “What do you want?”, “OK, anything else?”, and “OK, next?”. The complete order lists layer pairs in order, including repeated fruits on different layers, with syrup at the end. Quantity language/dots are not used. Mode changes preserve the composition.

Two optional ice cream scoops rest on whipped cream occupying half the glass. Optional syrup fills a middle cream band. Reset clears fruit, ice cream, and syrup but leaves whipped cream. PLAY and photo export are not yet implemented.

## Shared versus local

`shared/layer-builder.js` extends the shared FoodBuilder with paired-slot state, editing, summary, dialogue, and row rendering. Config defines fruit art, fixed rows, orientations, and piece counts. Glass geometry, cream, and scoop/syrup drawing remain local. Pizza keeps quantity mode. Assess future changes for shared-engine reuse.

Artwork stays simple: flat fruit slices, thin peel accents, peeled kiwi, softly textured round scoops. The bowl has a thick rounded outline and sloped pedestal behind it. Fruit stays in front of filling but behind the outline and may rise above the rim. Cream retains a light beige contour.

## Checks

Run `node tests/check-parfait.cjs` and pizza checks after shared engine changes. Tests use DOM mocks; visual browser/iPad checks remain outstanding. Initial fruit list follows a teacher-created Unit 7 resource pending textbook confirmation: https://wordwall.net/pt/resource/65806826/lets-try-2-unit-7-vegetables-fruits

## Next styling pass

Follow the builder adoption checklist in `docs/WORKFLOW.md` and the visual rules in `docs/STYLE-GUIDE.md`. Shared responsive/jump controls are already loaded; Pizza’s stable menu/tool column and creative editor have not been ported. Preserve the paired fruit layers when adopting styling.
