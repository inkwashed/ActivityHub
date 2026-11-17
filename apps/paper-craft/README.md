# Paper Craft

Entry: `apps/paper-craft/index.html`. Let’s Try! 1 Unit 7, “This is for you.” Listed as **Shape Builder** on the local homepage under Let’s Try! 1, Unit 7, using the shared activity-card artwork/copy/practice/button layout. The app title remains Paper Craft; not deployed.

Thirteen original flat SVG shapes (triangle, circle, square, heart, star, diamond, rectangle, oval, semicircle, pentagon, cross, club, spade) and uppercase A–Z. Letters use local Arial/Helvetica/sans-serif SVG text, with no typing or downloaded font. The ten named piece colors and exact hex values match My Pencil Case. No accounts, uploads or external dependencies.

## Modes and sentences

New sessions start in LEARN. The visible shared LEARN/PLAY toggle sits beside Pieces; EASY/HARD is independently selectable beside Color. Difficulty persists across mode switches and does not change either creation. Reload restores the saved active mode and both creations. Older creative-only saves retain their PLAY pieces, colors, transforms and background.

LEARN shows text labels on choice buttons and toggles one of each type at a preset position. The thirteen shapes use a loose fixed arrangement across the paper, with varied sizes of 22–30 scene units (formerly 12) and slight rotations. The 26 letters use their own loose full-paper arrangement, including the top and upper left, with sizes of 16–22 units (formerly 12) and small varied rotations. These placements are deterministic, not randomized on each edit or reload. Positions, rotations and preset colors live in config.js; LEARN exports use the same geometry. Mixed shapes/letters may overlap like a collage. Select a placed piece to recolor it. No dragging or creative toolbar in LEARN. Choices retain their configured colors until changed, rather than inheriting the last PLAY selection. Reset returns only the active mode to its empty/default state.

PLAY hides visible choice labels (including background pattern names), while preserving accessible names. Each tap adds a movable copy, up to 120 pieces. Shared CreativeBuilder supplies drag, pinch resize, rotation, flip, duplicate, delete, arrow-key movement and a covered-piece picker. Shapes and letters freely interleave in one stacking group. PLAY choice previews and each new piece use that type’s preset color from config.js, matching LEARN’s starting palette. Select a piece to recolor only that copy. Duplicates preserve the copied color; later additions start in their preset color. Saved custom colors are preserved.

The output describes all current pieces, independent of selection:

- EASY: “I want a triangle and a circle.” Repeated PLAY copies group by type, for example “I want 2 hearts and a letter A.”
- HARD: adds colors and groups PLAY copies by type/color, for example “I want a blue triangle and an orange circle.”
- Letters use “a letter A” / “a red letter A”; repeated letters use “2 red letter As”.
- Empty: “I want ….” Background patterns/colors are omitted from the sentence.

The prompt stays “What do you want?” The unit’s gifting phrase “This is for you.” remains in help/photo attribution, rather than being appended to the output. English lesson vocabulary stays English; interface controls and help support Japanese. Audio uses shared recordings/browser-speech fallback.

Each mode retains independent pieces, piece colors and background. The local save adapter validates both palettes and per-piece PLAY colors. Reset/Restore captures only the active mode’s creation and palette, preserving the other mode and current independent difficulty. Background-only creations are recoverable. Missing/invalid data gets safe defaults. Recovery is in-memory and is discarded by a new creation edit, not persisted across reload.

## Background and category controls

Shapes, Letters and Background share the reusable `ah-selector-tray` housing in shared controls.css. Active pills have a 2px outline and contrasting fill; fully rounded outer ends wrap the inner pills. Help sits outside the housing. See docs/STYLE-GUIDE.md → Connected category selectors for the reusable contract.

Background offers Plain, Polka dots, Stripes, Zigzag, Hearts and Stars, matching POST’s pattern vocabulary with lesson-owned SVG motifs. Swatches use the same ten color names mixed with 70% white; white uses warm paper white. Editing a background preserves the selected piece and its colors/transforms. Backgrounds are independent between LEARN and PLAY. Plain muted brown is the default in both modes, after Reset and when saved background data is missing or invalid. Explicitly saved color choices, including white, are preserved.

`background.js` generates the live full-frame background, previews and export from scene-anchored patterns; the live SVG is cached until the background changes. Existing workspace geometry/observers are unchanged. Palette metadata lives in `palettes.learn` / `palettes.play` so the shared Reset/Restore mechanism owns recovery.

## One-step layer controls

Shared CreativeBuilder uses layer forward/backward after Duplicate, replacing TOP across Pizza, Parfait, Sandwich, Pencil Case, Paper Craft and Builder Lab. Each action swaps the selected piece with its immediate neighbor within the same category. Unavailable directions disable at boundaries; both disable without selection. Selection and transforms remain intact. Save, Restore, picker and export use this same order.

Shared layer-up/layer-down icons and English/Japanese labels are used directly. Nine-button workspace reservations now live in shared/builder-workspace.css; Paper Craft’s earlier app-local trial CSS has been removed. LEARN hides the creative tools.

## Export and implementation

Save uses the same SVGs, active-mode colors/background and full-frame square artwork framing. LEARN exports preset positions; PLAY exports back-to-front manual transforms. The shared photo flow adds the current output sentence. Tools and selection outlines are excluded. Local system letter shapes may vary slightly across operating systems.

Shared controls, icons, workspace coordinator, panel scrolling, full-frame placement, toolbar reservations, app shell, photo lifecycle and Reset/Restore are consumed directly. No shared engine change is needed for the LEARN/PLAY and sentence update.

## Verification

`node tests/check-paper-craft.cjs`: mock-DOM checks pass for preset LEARN positions/colors/toggles/recoloring, EASY/HARD inventory language, independent mode/background state, saved-mode round trips and legacy PLAY migration; also creative edits, layering, picker/export parity, malformed input and active-only Reset/Restore.

`node tests/check-paper-craft-browser.cjs`: browser suite provided for labels/mode switching, free editing, sentence difficulty, reload, PNG preview and six responsive viewports. Use NODE_PATH for installed Playwright and CHROME_PATH if needed; PAPER_FILE=1 tests direct local opening.

Browser execution was blocked by host process/network restrictions; browser suite results are not claimed. Physical iPad Safari touch/pinch/scrolling, enlarged-text visuals, audible speech and PNG downloads remain for review. Syntax, local assets and shared style ownership checks pass.

Shape and letter icons on choice buttons have a 2-unit theme-accent outline (`--ah-selected-border`, updating automatically with the selected theme) to distinguish white cut-outs from the button surface. This is a preview-only option in the shared app-local art generator: LEARN/PLAY canvas pieces, selected-piece previews and exports remain flat and outline-free. Placed letter cut-outs also remain outline-free.


## Review against Pencil Case, Pizza and Parfait — 2026-11-16

Source and mock-behavior review confirms shared independent difficulty, per-mode creations, local saves, active-only Reset/Restore, input validation, full-frame workspace/picker recovery, gestures/editor tools, sentence audio fallback, QR/back navigation, photo lifecycle, app shell and scrolling. The new manifest matches the existing Builders’ browser-display manifest policy, and Paper Craft is registered in the release asset-versioning script. No deployment or full-suite asset reversioning was performed.

Review fixes: interactive LEARN scenes now retain group semantics; piece-color swatches disable when no piece is selected (background colors stay available); mode/difficulty help is translated and the obsolete pre-add-color instruction is corrected; unchanged choice previews are cached rather than rewritten. New regression checks exercise the roles, selection-gated swatches and release registration.

Remaining differences/review items:

- The approved one-step depth controls and nine-control toolbar budgets are now shared across all CreativeBuilder consumers.
- No Paper Craft achievement/badge family exists. Existing badges are named/art-specific; adding one needs a separate product/art decision. Visit counting is already integrated.
- The loose LEARN shape and letter arrangements can overlap when mixed; narrow screens, crowded letter touch targets and enlarged text require visual/physical review. No claim of browser layout validation is made.
- Recording coverage is complete; physical-device playback still needs verification. Speech fallback covers unsupported text or failed audio.
- Browser review is blocked: shell Chrome launch/local server are restricted, and available in-app browser security rejects local file URLs. The browser suite is provided but not claimed as passed. Physical iPad pinch/scroll, downloads and VoiceOver remain open.

Reusable category-tray styling, preview-only outlines, per-item default-color behavior, interactive scene semantics and nine-tool sizing are documented in STYLE-GUIDE.md. Snapshot/background ownership and required checks live in WORKFLOW.md; app-specific vocabulary, artwork and defaults remain here/config.js.

Audit validation: Paper Craft’s mock suite plus 18 related suites passed (Pencil Case, creative editor, Parfait creative, Sandwich, Lab, sharing, reset recovery, restore failures, autosave, panel workspace, artwork/base fitting, bounds, pronunciation, interface-language defaults, section jump, themes and shared style ownership). Local HTML/manifest assets resolve and IDs are unique. These are source/mock checks, not rendered-browser or physical-device evidence.

The Shape Builder homepage card uses `assets/paper-craft-preview.svg`, generated through the actual production Save renderer in `sharing.js`: a PLAY greeting card spelling HI with flat colored cut-outs on dotted brown paper. The generator uses a fixed normalized square camera (not a measured device viewport). Run `scripts/generate-home-previews.cjs` / `--check` and `tests/check-home-previews.cjs` to keep this example synchronized with app artwork; see docs/HOME-PREVIEWS.md.


### Layer-arrow rollout — 2026-11-16

This app now uses the shared one-step layer arrows instead of TOP, with the common nine-control workspace layout. The ordering/layout contract is owned by docs/WORKFLOW.md and docs/STYLE-GUIDE.md; `node tests/check-layer-order.cjs` covers the migrated consumers. Automated checks pass; rendered layout and physical-device touch review remain pending. Nothing committed or deployed.

Cross is an X-shaped cut-out (railroad-crossing style); club and spade use original card-suit silhouettes. Each supports both modes, recoloring, duplication and exports. New defaults are red/green/black respectively; existing shape and letter defaults remain unchanged. The plural of cross is crosses.

Audio expansion approved and integrated November 17, 2026: all 69 additional clips, including the final normal-speed R, are in the shared library. All 124 required clips are available. Plural letter names use dedicated recordings; singular letter A resolves separately from article a. See assets/audio/README.md for provenance and checks. Local integration only; nothing committed or deployed.
