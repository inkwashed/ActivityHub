# Little Parfait Cafe

Open `apps/parfait/index.html` or serve the repository and visit `/apps/parfait/`. Listed on the homepage under Let’s Try! 2 Unit 7.

## Building a parfait

One decorative row at the former third-layer position has two fruit slots. Slot 1 is selected initially and after Reset. Fruit choices replace the currently selected slot without advancing; tap the other slot to edit it. Choose the same fruit twice for a uniform row, or different fruits for a six-piece alternating row. A single filled slot previews a uniform row. Select either slot to replace or clear it. There are no layer navigation arrows. Ice cream, fruit layers, and syrup are visible together in one panel.

EASY/HARD is independent of LEARN/PLAY. EASY names unique ingredients; HARD adds counts and small/medium/big sizes in both modes. The former slot dialogue is not used. LEARN retains the paired fruit row. PLAY adds individual fruit with drag/pinch and rotate, flip, duplicate, and delete controls. Each mode keeps its own fruit, flavor, and syrup selections; Reset affects only the active mode.

Two optional ice cream scoops rest on whipped cream occupying half the glass. Optional syrup forms rounded dripping caps over both ice cream scoops, behind fruit and the glass outline. With no ice cream it remains selected but has no visible cap. Reset clears fruit, ice cream, and syrup but leaves whipped cream. Save previews and downloads a locally generated PNG with the current order.

## Shared versus local

`shared/layer-builder.js` extends the shared FoodBuilder with paired-slot state, editing, summary, dialogue, and row rendering. Config defines fruit art, fixed rows, orientations, and piece counts. Glass geometry, cream, and scoop/syrup drawing remain local. Pizza keeps quantity mode. Assess future changes for shared-engine reuse.

Artwork stays simple: flat fruit slices, thin peel accents, peeled kiwi, softly textured round scoops. The fixed bowl, cream and pedestal use the uniformly scaling paths in `glass-art.js`; preserve its thin rounded outlines and translucent front layer. Fruit stays in front of filling but behind the outline and may rise above the rim. Cream retains a light beige contour.

## Checks

Run `node tests/check-parfait.cjs` and pizza checks after shared engine changes. These tests use DOM mocks. Dated browser checks are recorded below and in the shared verification log; physical iPad checks remain outstanding. Initial fruit list follows a teacher-created Unit 7 resource pending textbook confirmation: https://wordwall.net/pt/resource/65806826/lets-try-2-unit-7-vegetables-fruits

## Current styling and artwork

Follow the [Builder adoption checklist](../../docs/WORKFLOW.md#builder-adoption-checklist) and [style guide](../../docs/STYLE-GUIDE.md). The food-panel adapter owns 10/8px regular/compact padding and content-aware cards. The redundant choices title is visually hidden; numbered headings remain. Choices, actions and growable sentence share one scrolling column. The question stays above the glass. Reset/Save share the action row. Preserve paired slots and app-owned geometry.

Fruit placement: apple/peach slices tilt −25°. Melon uses a 34.5% layer size; apple, peach, and orange use 27% (default fruit: 21%) for a more balanced visual weight.

Mixed fruit rows overlap sequentially from left to right, alternating the selected fruits instead of placing all pieces of one ingredient above the other.

Cream and bowl use 4.8-unit strokes in the shared 400×320 glass drawing; the stem uses 4.4. They scale proportionally, retaining cream’s beige contour. Pineapple is a pale golden ring wedge with a curved outer edge, core notch, and restrained highlights.

All nine fruit choices appear in a three-by-three grid in LEARN and PLAY, without paging arrows or a page indicator. LEARN retains the editable fruit pair; ice cream and syrup remain visible.

Creative editing uses shared/creative-builder.js and piece-gestures.js with local glass bounds and help. Run tests/check-parfait-creative.cjs for mode isolation, editing, count wording, and reset. Physical iPad validation remains outstanding.

PLAY flavors add one editable scoop per tap, with mixed flavors supported. Scoops stay behind fruit and are listed first in the picker. Syrup decorates every scoop, including new copies, and follows transforms. No ice cream removes scoops only. LEARN retains its two-scoop preset.

PLAY stacking follows the central contract in docs/WORKFLOW.md: picker order equals back-to-front drawing order, with scoops grouped before fruit and insertion order preserved within each category. Selecting an item never raises it.

Save uses shared/builder-photo.js for preview/download and sharing.js for Parfait SVG rendering. It snapshots current LEARN or PLAY geometry and ordered pieces, including syrup, without changing the editable creation. Both modes use the same normalized artwork coordinates, with the original crop expanded to include the editing frame. Physical iPad preview/download validation is still required.

Save photos use an original simple SVG cafe backdrop: a warm counter, pale window, and muted greenery. The counter/shadow align with the glass pedestal and framing expands with the editing frame as described below. This is export-only and requires no downloaded artwork.

Pronunciation: the result speaker reads the full English order; dotted-underlined ingredient phrases play individually. Vocabulary phrases and supported full orders (including PLAY counts and sizes) use the approved shared Kokoro recordings. Unsupported text or a failed clip falls back to browser speech for the complete order. Recordings load only when tapped. Device voices are used only for fallback/voice preview; physical iPad verification of recorded sequences remains pending.

LEARN order text wraps naturally within the available width; fruit, flavor, and syrup phrases have no forced line breaks.

LEARN combines fruit and selected syrup into one natural list after the ice cream (for example, “I want vanilla ice cream with strawberries, bananas, and chocolate syrup.”). With no fruit, ice cream keeps “with chocolate syrup”; no syrup stays an explicit “with no syrup” qualifier. EASY uses this same ingredient-list rule in PLAY; HARD adds counts and size bands in both modes.

Layout uses the final shared builder-workspace CSS/JS: tablet/desktop viewport fit, a stable food frame, and naturally growing output in the scrolling choices column. Long/enlarged content retains accessible overflow. Physical iPad layout verification remains necessary.

The glass stage is bottom-aligned within the shared play frame, with a 4% frame-height margin beneath it. Its width is 80% of the standard food footprint (73.6% of the smaller frame dimension), preserving proportions while leaving more open space above the scoops in both modes.

The fixed glass, cream, stem and highlights are defined once in glass-art.js, in a 400×320 SVG coordinate system with baked path coordinates and uniformly scaling strokes. Live rendering layers this artwork behind and in front of the editable ingredients; Save reuses the exact same paths. No stretched background images or non-scaling strokes are used for the fixed glass.

State saves automatically on this device/browser through shared/autosave.js and shared/builder-autosave.js, including independent LEARN/PLAY compositions and difficulty. Reset persists the cleared active mode. Storage failure leaves the activity usable; there is no cloud sync. Shared restore checks: `node tests/check-autosave.cjs`.

The Save photo uses the shared centered Download action with a 12px photo gap and the QR modal’s download icon.

Save unions the original proportional photo framing with the full editing frame; it can add background to include edge placements. Verified by `node tests/check-photo-framing.cjs`.

The fixed glass illustration uses lighter outlines and a 30% pale-green glass tint above the cream and ingredients, with the reflection on the front layer. Live and Save use the same layers.

The stem’s top edge aligns with the bowl’s bottom edge in the shared SVG coordinates, avoiding a visible lip inside the translucent bowl.

The stem fill uses 70% opacity, with a solid outline, in both live artwork and Save.


## Approved panel workspace

Uses shared `builder-panel-workspace.css/js`: choices and growable English output share one scrolling column; the left creation uses the freed height. The base fits beside tools; movable pieces use the full outer frame, including behind tools. Picker recovery moves a covered piece into view and saves that position. Square exports include the entire editing frame, which can add background on tall/narrow layouts. App-specific art, lesson choices, mode state and photo treatment remain local. See the style guide and `docs/BUILDER-WORKSPACE-VERIFICATION.md` for the rollout checks and device limitations.

## Independent difficulty and playback

LEARN/PLAY and EASY/HARD are independent and saved across reloads. Difficulty and its keyboard/touch dialog sit beside (3) Syrup, leaving fruit slots and the picker unchanged. EASY names unique ingredients; HARD groups pieces by ingredient and size, counting the actual six alternating fruit pieces and two scoops in LEARN, and edited pieces in PLAY. Preset pieces are medium. Syrup stays a named qualifier/list entry, never a count. The old slot-conversation output stays hidden because it has no PLAY counterpart. Listen uses the top-right sticky treatment inside the scrolling sentence region with a 44px target.

### Local verification (2026-11-05)

All 35 non-browser project checks passed, including Parfait, creative editing, autosave, Reset/Restore, photo framing, workspace bounds and style ownership. Browser checks covered all four mode/difficulty combinations at 1133×716/714/678/600/599, 744×1133, 739/740×800, 390×844, 844×390 and 1440×900; Japanese was checked at six representative sizes. No horizontal overflow or sub-44px difficulty/help/Listen targets was found. Additional checks covered 150% sentence text, keyboard-opened help, both-mode Restore, PLAY reload, syrup/fruit choices, a rotated fruit behind the tools, picker recovery, and LEARN/PLAY Save previews plus a PLAY download. The Listen button was activated, but audible quality and physical iPad touch, pinch, scrolling and accidental-tap behavior still require hands-on review. Long content and short windows intentionally scroll the right column; phones use stacked page navigation. Full editing-frame exports can add substantial background in portrait layouts; the photo area is square, while the captioned polaroid is taller.

### Practice badges
Creation edits now earn a local first-builder badge, with higher ranks after 5/10/15/20 qualifying sessions, at most once per 30 minutes. Opening/restoring alone does not award credit. Reset does not remove earned badges. See docs/WORKFLOW.md → Local achievements and app visits for shared ownership and checks.
