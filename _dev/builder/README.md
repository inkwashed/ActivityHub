# Builder Lab — local reference candidate

Open `index.html` in this directory using a local browser. The page works without a build or network request. Its shared assets stay at their normal repository paths. This is not linked from the homepage, has noindex/nofollow, and `_dev` is excluded from GitHub Pages/Jekyll by `_config.yml`. If hosting changes, explicitly exclude `_dev` from that publishing pipeline. No deployment is part of this work.

## What to try

- LEARN: three icon-only slots with adjacent swaps and × clear controls; four ingredient choices below them. The active slot stays selected when replacing items.
- LEARN: four-across quantity choices with left/right paging, three quantity dots and the existing none → light → regular → extra → none cycle. All 16 examples are available over four pages.
- LEARN: a labelled dropdown, including a long option to test width.
- PLAY: all 16 choices in four columns, larger icon-only cards, a piece picker and the shared drag/pinch/rotate/flip/duplicate/TOP/delete toolbar. PLAY state is separate from LEARN.
- Reset temporarily becomes Restore, recovering the entire active-mode creation. Adding an item starts a new creation and discards that mode’s snapshot. Save opens a sample caption dialog; it does not export or publish.
- The info dialog offers live, short, long and overflowing sentence examples. Check that the play frame stays fixed as text changes. EASY/HARD exercises quantity wording; language/fullscreen/pronunciation use the existing shared features.

The lab consumes the real shared workspace, controls, quantity engine, creative editor, gestures, pager, pronunciation and viewport scripts. `shared/builder-slots.js` is an opt-in slot component under review, used only here so far. Production applets have not been migrated to it. Slot labels and new lab-specific instructions are English-only pending localization; existing common interface translations still work.

## Decisions still needed

1. **Slot component adoption:** Parfait and Sandwich still implement slots separately. Review this opt-in component (slot count, metadata preservation, notifications and translation API), then migrate with regression checks. Merely approving its appearance does not complete that migration.
2. **Card sizes:** The Lab uses the scoped reference panel adapter: regular 76px cards/64px artwork, compact 68px/56px, and narrow-phone 60px/48px. Food builders have their own measured budgets. Continue reviewing narrow-tablet fit and visible artwork proportions; canvas size alone does not equal visible size.
3. **Combined-section budget:** this compact example uses one row of slot choices plus one paged quantity row. The guides do not yet specify how to budget height for many simultaneous sections. Test the full panel on the smallest target iPad before standardizing more rows.
4. **Accessibility overflow:** intentional right-column scrolling is approved; phones and extremely short windows use page flow. Do not reopen this as a strict no-scroll requirement. Continue physical-device verification of the scroll cue and reachability.
5. **Selection outlines:** the shared editor now measures visible SVG bounds for the outline and drag target, retaining a 44px minimum. Verify flat, rotated, flipped, duplicated and syrup-covered items on touch devices.
6. **Shell ownership:** header/dialog markup and several app-name-based scene selectors remain duplicated or hard-coded; toolbar geometry and editor styling already have shared owners. This lab reveals those gaps; it does not yet replace them with a universal app generator.
7. **Share contract:** this fixture tests button/dialog styling only. Real export fidelity remains covered by the production exporters and their tests.

## Verification and rollout

Run `node tests/check-builder-lab.cjs` and `node tests/check-builder-workspace.cjs`. The lab test exercises actual shared quantity/creative/pager code in a mock DOM plus slot state, mode isolation, sentence fixtures and the sample dialog. It is not a visual browser test.

Review 744×1133, 768×1024, 1024×768, 1133×744, 1366×768, a phone, keyboard navigation and enlarged text. Local browser checks now cover tablet, desktop and phone layouts; physical iPad layout/gesture review remains outstanding.

After approval: record the decision in its owning guide, move the approved implementation into shared files, migrate every applicable consumer, run affected behavior checks, review the same states on each app, and refresh asset versions. Do not assume editing this fixture updates the production apps. Avoid breaking experimental edits directly in a shared file already loaded by production apps; stage those locally first.

## Reviewed layout adjustments

LEARN choice artwork in both the slot-choice and paged quantity grids is enlarged 20% on tablet/desktop (at least 740×600 CSS px), matching Sandwich. Keep the existing 36px layout box, card heights, labels and quantity dots. Apply the transform only to `.ingredient-art > svg`; never scale all descendant SVGs, which can enlarge nested fragments twice and clip their edges. Slot previews and PLAY artwork retain their separate sizing. This adjustment is Lab-scoped; it does not roll out to other applets automatically.

The header includes “TEXTBOOK NAME · Unit 0” as a visible tablet/desktop placeholder for lesson context. Production builders use their actual textbook and unit.

Mode-size regression review: compare the same viewport before/after LEARN ↔ PLAY with short and long output. Check both the frame rectangle and a permanent scene landmark (pizza diameter, sandwich bottom bread, glass base). Equal frame sizes alone cannot detect a mode-specific SVG scale. The Lab starts from one full-frame board for both modes, then uses shared minimum-shift/last-resort scaling in PLAY; app renderer checks must also cover internal SVG transforms and export-only framing.

State saves automatically on this device/browser through shared/autosave.js and shared/builder-autosave.js, including separate LEARN/PLAY compositions and the Lab’s deliberately mode-coupled difficulty. Reset persists the cleared active mode. Storage failure leaves the activity usable; there is no cloud sync. Shared restore checks: `node tests/check-autosave.cjs`.

## Current engine alignment (November 2026)

The reference panel adapter owns 10/8px padding and 8/6px section gaps, selected by available choices height. Narrow paged rows put arrows below choices to preserve 44px targets. Cards grow for labels/dots; all 16 choices remain available. Shared panel workspace supplies the nested toolbar, full-frame placement and the growable sentence below choices in one scrolling column. The full board explicitly opts into shared preferred-size fitting. It preserves LEARN size/position when possible, translates minimally next, and scales only as a last resort. The entire rectangular board is meaningful; unlike the pencil case, it has no transparent silhouette margins to exclude. Shared creative editing owns movement/rotation bounds and autosave retains independent modes. Save deliberately remains a sample, so use production export tests for PNG fidelity. English example vocabulary and long labels remain deliberate stress fixtures; shared controls switch languages. My Selfie/My Town are outside this adapter.

### Base-fitting reference

The stage uses `data-builder-fit` and its board uses `data-builder-fit-base`. Keep bases and movable items in the shared composition wrapper; the board is intentionally a full-rectangle example, while Class Supplies demonstrates SVG-visible bounds and a fixed selection target. The same rules apply on mode changes, viewport resizing and Restore. Editing stays in normalized scene coordinates while the toolbar strip is excluded only from base fitting; item bounds use the full frame. Run `check-builder-base-fit.cjs`, `check-artwork-fit.cjs`, `check-play-bounds.cjs` and the Lab/recovery tests when changing this contract.


The Lab now loads `builder-panel-workspace.css/js` directly with `data-builder="labBuilder"`. Its visually hidden title retains accessible context. The left frame uses the freed sentence height; the right column scrolls as one region. The picker reveals toolbar-covered pieces by moving them into view (a real saved position change). Inspect oversized/rotated ingredients and narrow-screen page flow. `exportFrame` is available as the current exporter integration example, but the Lab Save dialog remains deliberately non-exporting; production food renderers demonstrate the app-specific coordinate mappings. See STYLE-GUIDE.md's approved workspace section and `tests/check-panel-workspace.cjs`.

## Styling ownership reference

The Lab loads `shared/builder-editor.css` after its local geometry and before `builder-workspace.css`. Copy the dependency order, not the shared declarations, when creating a Builder. The editor owns piece coordinates, transform and hit-area minimum; `lab.css` retains illustration and selected-art decoration. `controls.css` owns screen-reader-only and fullscreen icon states. Food density, reference density, Blog layout and map/avatar layouts are deliberately separate. See [the ownership map](../../docs/STYLE-ARCHITECTURE.md) and run `node tests/check-style-ownership.cjs` when extending this example. The Lab remains a non-publishing example; its Save demonstration is not a real export implementation.

## Textbook and unit labels

Use the shared header policy in `shared/builder-layout.css`: hide `.edition` at widths up to 739px, and show it from 740px regardless of height or orientation. Do not add local visibility overrides. This keeps narrow tablets and short landscape windows consistent; Blog headers follow their separate policy.

Independent difficulty is an optional engine configuration (`independentDifficulty`), demonstrated in Class Supplies, Pizza and Parfait. Define app-specific language rules before enabling it; Parfait counts preset LEARN pieces and edited PLAY pieces in HARD. Do not copy Pizza quantity bands into slot builders. The Lab’s existing language fixture is intentionally unchanged.

Sandwich also opts into independent difficulty: its persistent (2) origin heading carries the toggle and help, while contextual country fields follow the selected filling. Its per-type country map is mode-scoped and explicitly validated by the optional `sourcesByType` autosave capability. Bread is excluded.

## Shared update contracts

The Lab uses the shared workspace geometry coordinator and panel adapter; it must not install its own fitting/repainting observer. Panel output grows and disables legacy fixed-height sentence fitting. Active PLAY pieces repaint after fitting; inactive pieces wait until activation. Shared sync owns stacking order and passes one sorted order to picker/sentence consumers.

The Lab deliberately retains legacy mode-coupled difficulty as an example. Pizza, Parfait, Sandwich and Class Supplies opt into `independentDifficulty`; their Reset/Restore preserves the difficulty currently selected, rather than restoring the difficulty at Reset. New independent-difficulty Builders should use that config and shared recovery adapter. Test both settings and both modes, including changing difficulty in the other mode between Reset and Restore. No persistent history or individual-delete undo is provided.

Custom LayerBuilder sentences should call `updateSlotControls()` without calling the parent's sentence renderer. Keep one sentence/pronunciation rebuild per update. See the workflow's Builder update ownership section and `tests/check-builder-update-work.cjs` for measured regression coverage.

## Restore browser regression page

Open `restore-check.html` from the local server and press **Run checks**. Use an isolated development origin; the page temporarily exercises actual app pages and restores their app save keys afterward. Optional `?app=parfait` (or `pizza`, `sandwich`, `supplies`, `lab`) narrows a run. The checks inspect connected/nonzero SVG and piece bounds as well as state, then select/move pieces using synthetic clicks/keyboard events. Browser results do not establish physical iPad gesture behavior.

Mode rendering keeps both sizing layers connected; the inactive one is invisible, inert and aria-hidden. Restore does not perform an internal LEARN→PLAY→LEARN tour. Do not reintroduce display toggles or detachment as a mode-visibility workaround. Geometry work defers when dimensions are unavailable; the next valid resize/activation resumes it. Recovery and startup failure handling are owned by `builder-autosave.js` and `autosave.js`; failed restores must not erase either the pending recovery or the persisted snapshot. See WORKFLOW.md for contracts.

Reset failure coverage: `tests/check-restore-failures.cjs` verifies pre-clear snapshot retention and save suppression; app recovery fixtures exercise real adapters in both modes. Custom adapters must forward recovery `canSave()` to autosave. PLAY piece buttons expose `aria-pressed` independently of focus; maintain it on selection, deselection, mounting and recovery without changing their accessible names. Physical VoiceOver announcements still require device testing.
