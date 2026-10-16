# Little Parfait Cafe

Open `apps/parfait/index.html` or serve the repository and visit `/apps/parfait/`. Listed on the homepage under Let’s Try! 2 Unit 7.

## Building a parfait

One decorative row at the former third-layer position has two fruit slots. Slot 1 is selected initially and after Reset. Fruit choices replace the currently selected slot without advancing; tap the other slot to edit it. Choose the same fruit twice for a uniform row, or different fruits for a six-piece alternating row. A single filled slot previews a uniform row. Select either slot to replace or clear it. There are no layer navigation arrows. Ice cream, fruit layers, and syrup are visible together in one panel.

EASY is the only enabled difficulty; HARD dialogue is disabled pending redesign. LEARN retains the paired fruit row. PLAY adds individual fruit with drag/pinch and rotate, flip, duplicate, and delete controls. Each mode keeps its own fruit, flavor, and syrup selections; Reset affects only the active mode.

Two optional ice cream scoops rest on whipped cream occupying half the glass. Optional syrup forms rounded dripping caps over both ice cream scoops, behind fruit and the glass outline. With no ice cream it remains selected but has no visible cap. Reset clears fruit, ice cream, and syrup but leaves whipped cream. Share previews and downloads a locally generated PNG with the current order.

## Shared versus local

`shared/layer-builder.js` extends the shared FoodBuilder with paired-slot state, editing, summary, dialogue, and row rendering. Config defines fruit art, fixed rows, orientations, and piece counts. Glass geometry, cream, and scoop/syrup drawing remain local. Pizza keeps quantity mode. Assess future changes for shared-engine reuse.

Artwork stays simple: flat fruit slices, thin peel accents, peeled kiwi, softly textured round scoops. The bowl has a thick rounded outline and sloped pedestal behind it. Fruit stays in front of filling but behind the outline and may rise above the rim. Cream retains a light beige contour.

## Checks

Run `node tests/check-parfait.cjs` and pizza checks after shared engine changes. Tests use DOM mocks; visual browser/iPad checks remain outstanding. Initial fruit list follows a teacher-created Unit 7 resource pending textbook confirmation: https://wordwall.net/pt/resource/65806826/lets-try-2-unit-7-vegetables-fruits

## Next styling pass

Follow the builder adoption checklist in `docs/WORKFLOW.md` and the visual rules in `docs/STYLE-GUIDE.md`. Shared responsive/jump controls are already loaded; The menu now uses the same bounded landscape column, 14px panel inset, title-above-choices arrangement, and full-width Reset action. The question stays above the glass. All ingredient sections are visible together and paired fruit slots are preserved; PLAY uses the shared creative editor; Share uses the shared local photo workflow. App geometry is in layout.css, loaded after shared responsive CSS. Preserve the paired fruit layers when adopting styling.

Fruit placement: apple/peach slices tilt −25°. Melon uses a 34.5% layer size; apple, peach, and orange use 27% (default fruit: 21%) for a more balanced visual weight.

Mixed fruit rows overlap sequentially from left to right, alternating the selected fruits instead of placing all pieces of one ingredient above the other.

Cream uses the same 12px non-scaling outline stroke as the glass, retaining its soft beige color. Pineapple is a pale golden ring wedge with a curved outer edge, core notch, and restrained highlights.

All nine fruit choices appear in a three-by-three grid in LEARN and PLAY, without paging arrows or a page indicator. LEARN retains the editable fruit pair; ice cream and syrup remain visible.

Creative editing uses shared/creative-builder.js and piece-gestures.js with local glass bounds and help. Run tests/check-parfait-creative.cjs for mode isolation, editing, count wording, and reset. Physical iPad validation remains outstanding.

PLAY flavors add one editable scoop per tap, with mixed flavors supported. Scoops stay behind fruit and are listed first in the picker. Syrup decorates every scoop, including new copies, and follows transforms. No ice cream removes scoops only. LEARN retains its two-scoop preset.

PLAY stacking follows the central contract in docs/WORKFLOW.md: picker order equals back-to-front drawing order, with scoops grouped before fruit and insertion order preserved within each category. Selecting an item never raises it.

Share uses shared/builder-photo.js for preview/download and sharing.js for Parfait SVG rendering. It snapshots current LEARN or PLAY geometry and ordered pieces, including syrup, without changing the editable creation. Off-glass PLAY art expands the photo framing. Physical iPad preview/download validation is still required.

Share photos use an original simple SVG cafe backdrop: a warm counter, pale window, and muted greenery. The counter/shadow align with the glass pedestal and the scene adapts to expanded PLAY framing. This is export-only and requires no downloaded artwork.

Pronunciation: the result speaker reads the full English order; dotted-underlined ingredient phrases play individually. Vocabulary phrases (including PLAY count nouns) use the approved shared Kokoro recordings; full orders and missing/failed clips use browser speech. Recordings load only when tapped. Actual sentence voice and offline availability depend on the device; physical iPad verification of recorded playback remains pending.

LEARN order text wraps naturally within the available width; fruit, flavor, and syrup phrases have no forced line breaks.

LEARN combines fruit and selected syrup into one natural list after the ice cream (for example, “I want vanilla ice cream with strawberries, bananas, and chocolate syrup.”). With no fruit, ice cream keeps “with chocolate syrup”; no syrup stays an explicit “with no syrup” qualifier. PLAY retains its count-and-size wording.

Layout uses the final shared builder-workspace CSS/JS: tablet/desktop viewport fit, a stable food frame, and a reserved sentence box with limited text fitting. Long/enlarged content retains accessible overflow. Physical iPad layout verification remains necessary.

The glass stage is bottom-aligned within the shared play frame, with a 4% frame-height margin beneath it. Its width is 80% of the standard food footprint (73.6% of the smaller frame dimension), preserving proportions while leaving more open space above the scoops in both modes.

Live glass, stem, and cream outlines scale in SVG coordinates with the stage; cream insets use percentages. Avoid fixed-pixel/non-scaling strokes in responsive live artwork. Share rendering keeps its independent export treatment.

State saves automatically on this device/browser through shared/autosave.js and shared/builder-autosave.js, including independent LEARN/PLAY compositions and difficulty. Reset persists the cleared active mode. Storage failure leaves the activity usable; there is no cloud sync. Shared restore checks: `node tests/check-autosave.cjs`.
