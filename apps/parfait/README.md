# Little Parfait Cafe — prototype

Open `apps/parfait/index.html` or serve the repository and visit `/apps/parfait/`. Not listed on the homepage; noindex is not access control.

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

Fruit choice buttons use shared/choice-pager.js: one row of three, wrapping previous/next arrows and a page indicator. Paging preserves the selected fruit pair; ice cream and syrup remain visible.

Creative editing uses shared/creative-builder.js and piece-gestures.js with local glass bounds and help. Run tests/check-parfait-creative.cjs for mode isolation, editing, count wording, and reset. Physical iPad validation remains outstanding.

PLAY flavors add one editable scoop per tap, with mixed flavors supported. Scoops stay behind fruit and are listed first in the picker. Syrup decorates every scoop, including new copies, and follows transforms. No ice cream removes scoops only. LEARN retains its two-scoop preset.

PLAY stacking follows the central contract in docs/WORKFLOW.md: picker order equals back-to-front drawing order, with scoops grouped before fruit and insertion order preserved within each category. Selecting an item never raises it.

Share uses shared/builder-photo.js for preview/download and sharing.js for Parfait SVG rendering. It snapshots current LEARN or PLAY geometry and ordered pieces, including syrup, without changing the editable creation. Off-glass PLAY art expands the photo framing. Physical iPad preview/download validation is still required.

Share photos use an original simple SVG cafe backdrop: a warm counter, pale window, and muted greenery. The counter/shadow align with the glass pedestal and the scene adapts to expanded PLAY framing. This is export-only and requires no downloaded artwork.

Pronunciation: the result speaker reads the full English order; dotted-underlined ingredient phrases play individually. Both use shared browser speech synthesis, including PLAY count nouns. Actual voice and offline availability depend on the device; iPad audio verification is pending.
