# Builder workspace verification history

This document records dated tests and rollout stages, not current implementation instructions. Earlier sizing, bounds and framing observations can be superseded by later entries. Current policy lives in [STYLE-GUIDE.md](STYLE-GUIDE.md); shared ownership and recovery contracts live in [WORKFLOW.md](WORKFLOW.md). A recorded pass is not a claim about every subsequent revision or a live deployment.

## Approved panel workspace rollout — 2026-11-05

2026-11-05. Scope: Pizza, Parfait, Sandwich, shared opt-in workspace, Class Supplies extraction/regression, and local Builder Lab. No deployment. My Selfie/My Town do not load the new adapter.

## Implementation

- `shared/builder-panel-workspace.css/js` owns output relocation, one scrolling choices column, full-frame item bounds, picker recovery and export-frame calculation. It loads after workspace initialization, before autosave restoration.
- Food app HTML opts in; app export renderers map the full frame to their own drawing coordinates. Sandwich's model accepts an optional photo frame. Existing baked Pizza, translucent Parfait glass and compact Sandwich photo treatment remain.
- Class Supplies' `workspace-prototype` adapter retains only its reviewed preferred-frame geometry and translated recovery help. The food Builders do not inherit its old sentence-height allowance.
- Lab directly consumes the shared adapter; its Save remains a labelled sample. Style guide/workflow and app READMEs describe the approved pattern.
- Existing normalized save schema, per-mode recovery, editing tools and pronunciation nodes are retained.

## Browser layout measurements

Chromium-based in-app browser, CSS-pixel viewport overrides, populated local test creations. These are not physical iPad measurements. All three were compared in LEARN/PLAY at 1133×716, 714, 678, 600, 599; 1024×668; 768×1024; 740×800 and 739×800; 390×844; 1440×900. Additional compact rail/fallback checks used 900×500 and 900×350.

Representative normal-English right-column overflow (`scrollHeight - clientHeight`, pixels; LEARN / PLAY):

| Viewport | Pizza | Parfait | Sandwich |
| --- | ---: | ---: | ---: |
| 1133×716 | 10 / 16 | 75 / 122 | 53 / 29 |
| 1133×714 | 12 / 18 | 77 / 124 | 55 / 31 |
| 1133×678 | 10 / 2 | 105 / 152 | 83 / 59 |
| 1133×600 | 88 / 80 | 183 / 230 | 161 / 137 |
| 1133×599 | 89 / 81 | 184 / 231 | 162 / 138 |
| 1024×668 | 20 / 56 | 115 / 162 | 110 / 69 |
| 768×1024 | 0 / 0 | 0 / 0 | 0 / 0 |
| 1440×900 | 0 / 0 | 0 / 0 | 0 / 0 |

Values depend on the sentence and selected controls, not just viewport size. Sandwich LEARN had a selected filling and its origin section. Phones intentionally use page flow, so zero column overflow does not mean zero page scrolling. There was no competing inner scroll area or clipped output in the audited states. At 900×350 the intentional page fallback retained a 390px creation instead of compressing it into the tiny viewport.

At 1133×678 the creation frame is approximately **631×534px**. Preferred scene sizes: Pizza **481×481px**, Parfait ingredient plane **370×245px** (the glass extends beyond this plane), Sandwich **491×491px**. LEARN/PLAY preserved these sizes and positions. At 1133×716/714 Pizza required a small shift; Parfait/Sandwich preserved placement. At 1024×668 Pizza also shifted without scaling. At 390×844 Pizza scaled to about **90%** to clear the bottom tools; Parfait/Sandwich retained scale and shifted upward. At desktop 1440×900 Pizza needed approximately **99.65%**, the other two preserved scale. Tall portrait Parfait shifted upward; Sandwich/Pizza retained their preferred geometry. Returning to LEARN restores full-frame geometry.

## Languages, text and interactions

- Japanese LEARN/PLAY audits at short landscape, tablet portrait and phone sizes: no sub-44px choice/action/toolbar targets, horizontal panel overflow or output clipping.
- Simulated 150% computed font and line-height enlargement at 1133×599, 768×1024, 390×844 and 320×568; English and Japanese checks. This is a local test-server fixture, not OS/Safari text enlargement. Fully populated English PLAY examples also passed phone/portrait checks. Long output grows freely; all 16 Sandwich fillings produced substantial intentional column scrolling (about 763px in short landscape).
- Scrolling/focusing pronunciation in that long Sandwich column left the creation rectangle unchanged. Pronunciation controls remained present and responded; audio quality/listening was not evaluated.
- Keyboard movement to all four outer edges exercised each food editor; rotation, oversized saved pieces and toolbar taps remained functional. Sandwich edge target measurements were within about one CSS pixel of frame edges (SVG/layout rounding).
- Picker selection revealed covered items in all three apps when their hit rectangles intersected the toolbar. A native pointer drag moved Parfait fruit behind the rail without triggering a tool. Large items can remain partly covered if they cannot fit in the safe region; the selected item remains movable/resizable.
- Browser Reset→Restore passed in both modes for all three. Sandbox/unit fixtures cover Reset→new item, mode isolation and autosave. Reloaded Sandwich transforms matched apart from a subpixel clamp adjustment (~0.0006 normalized units) on an oversized rotated bread slice.
- Real Save previews reported “Ready to save!” in LEARN and PLAY for all three. A Parfait item behind the toolbar appeared in the image, with no tools or selection outlines. Sandwich fullscreen entry/exit returned correctly.
- Class Supplies and Lab browser checks at 1133×678, 768×1024 and 390×844 found no nested panel scrolling, horizontal overflow or sub-44px audited controls. Class case geometry matched across modes at 1133×678 (491px scene; unchanged reviewed silhouette). Its many-item PLAY sentence still intentionally scrolls.

## Tradeoffs and release checks

The sentence can be below the fold, particularly in Parfait/Sandwich and enlarged text. Native scrollbars and the subtle lower shadow are the only indicators; there is no extra jump control. Picker recovery is a real saved position change. Extremely large items can crop at real frame edges but cannot be lost entirely. Square export framing includes the full editing rectangle and original photo bounds, so tall/narrow views add background and make the creation smaller in the square. App-specific photo styling remains intentionally different from the editing backdrop.

Physical iPad Safari with tabs visible/hidden remains required: touch dragging, pinch, column/page scrolling, focus, accidental tool taps, partially covered-item selection and download/save handling. Native pointer dragging was smoke-tested on Parfait; the shared automated gesture tests cover all consumers, but this is not a complete physical touch matrix. My Selfie/My Town have no new app-specific or shared-adapter changes; their existing autosave/My Town regression suites passed.

Automated checks: `check.cjs`, `check-creative.cjs`, `check-builder-base-fit.cjs`, `check-class-supplies.cjs`, `check-artwork-fit.cjs`, `check-builder-workspace.cjs`, `check-panel-workspace.cjs`, `check-reset-recovery.cjs`, `check-autosave.cjs`, `check-play-bounds.cjs`, `check-sharing.cjs`, `check-photo-framing.cjs`, `check-parfait-creative.cjs`, `check-sandwich.cjs`, `check-builder-lab.cjs`, `check-my-town.cjs`. These are mocked/Node checks, separate from the browser observations above. New tests verify independent bounds, minimal recovery, photo-frame union across all three coordinate mappings and exporter hooks. Asset hashes synchronized; whitespace checks clean.

## Shared update audit — 2026-11-06

Local only; no commit/deployment. Pizza animations were not changed in this pass.

### Confirmed behavior and operation counts

- Reset recovery copied the old LEARN `hard` value over the current preference. Independent-difficulty apps now preserve the current value; legacy Lab mode-coupled behavior remains. No save schema changes.
- Class Supplies 120-piece mocked pinch callback: **121 paints / 124 ordering calls before; 1 paint / 3 ordering calls, only 1 actual sort after**. Sentence and picker reuse sync's sorted list. Repeating unchanged colors causes zero paints; changing one piece color causes one paint. These are operation counts, not measured FPS or iPad timing.
- Parfait sentence updates previously invoked parent and custom renderers; now one sentence render in all four build/difficulty combinations. Shared slot UI updates remain separate.
- Synthetic coordinator test: 12 geometry notifications before the next frame result in one fit and one repaint callback. Active 120-piece callback paints 120 pieces; inactive callback paints none. This is a scheduler contract test, not a browser observer-delivery timing measurement. Explicit synchronous fitting for immediate geometry operations remains supported.
- Panel outputs disconnect legacy text-fit observers; pending callbacks cannot shrink the growing output. Legacy fixed-height output tests retain 21→16px fitting and overflow keyboard access.

### Verification performed

38 non-browser check files passed, including app fixtures, active-editor autosave, recovery, pinch/gestures, fitting/bounds, photo framing/export, audio/pronunciation, style ownership, home previews, Lab and My Town. New focused `check-builder-update-work.cjs` exercises the real Class Supplies gesture callback and Parfait editor resize callback in mocks. Recovery tests cover both settings, both modes, cross-mode edits, new-item invalidation and legacy Lab semantics. Asset hashes refreshed; preview dependency manifest regenerated from production renderers.

Browser (in-app desktop engine, isolated 127.0.0.1 origin):

- Reproduced Pizza EASY-Reset/PLAY-HARD/LEARN-Restore with old cached assets; after local hash refresh Restore retains HARD and produces the expected quantity sentence.
- Parfait PLAY Reset → change difficulty in LEARN → Restore retained five pieces and HARD; larger/rotation edits, Japanese controls, English practice output, listening activation, reload and Save preview succeeded.
- Sandwich LEARN Restore retained tomato/Aichi and current HARD; expected origin sentence and Save preview succeeded.
- Class Supplies Restore retained current HARD; red and blue duplicated/rotated/enlarged pens had distinct fills and correct layer order; Save preview succeeded.
- Pizza checked at 1133×716/714/678/600/599, 768×1024 and 390×844. Other three checked at 1133×714/599, 768×1024 and 390×844, plus interaction checks at 1133×678. No horizontal page overflow in these samples. Pizza toolbar buttons measured 44×44px. Narrow layouts retain intentional page flow.
- At 1133×678 the populated Parfait right column measured 584px high with 871px content. `has-more` was set. Keyboard navigation reached the 44×44px Listen control and scrolled the column to 287.5px while the creation remained at y=113px. Pizza's shorter sample required only 8px of column overflow. The sentence is reachable but may be overlooked below dense choices. No additional permanent UI was added; a slightly stronger existing lower fade would be a possible future option if classroom review finds it insufficient.
- Lab PLAY activation/addition and phone resize worked. My Town and My Selfie phone smoke checks loaded their original layouts without console errors. These are smoke checks, not full feature revalidation of those apps.

Remaining hands-on checks: physical iPad pinch/drag/tap separation, touch scrolling and transient scroll indicators, Safari browser chrome, actual audio pacing and frame-rate performance. A fresh enlarged-text/fullscreen/download-to-device matrix was not run in this pass; existing automated export and layout checks passed, and all four real Save preview images generated. Browser scripting did not inspect private application state; saved state and exact restored transforms were checked in active-editor fixtures.

### Ownership/files in this pass

Implementation: `shared/builder-autosave.js`, `builder-workspace.js`, `builder-panel-workspace.js`, `creative-builder.js`, `layer-builder.js`; `apps/class-supplies/app.js`; `apps/parfait/builder.js`. Tests: recovery, Class Supplies, workspace/base-fit, audio-library fixture, and new update-work check. Documentation: workflow, style guide, Lab README, this verification record. Entry HTML hash references and homepage preview dependency manifest were refreshed. Existing unrelated work remains in the checkout.

## Restore visibility and geometry — November 6, 2026

### Reproduction and fix

- Direct in-app-browser reproduction of Parfait's empty-LEARN → PLAY/add fruit → Reset → Restore left a connected 0×0 PLAY layer and 0×0 item, while the glass scene measured 369.58×245.33 and item coordinates remained finite. This was a rendering/layer lifecycle failure, not lost item data.
- A controlled comparison server reinstating the old internal Restore mode tour reproduced the same zero-sized-layer symptom in Pizza and Builder Lab; Sandwich and Class Supplies passed that short case. This verifies one shared Pizza failure path, not every possible Pizza animation symptom. The comparison used otherwise-current files, not a historical checkout.
- Restore now hydrates both creations and renders the final mode once. The shared editor retains both sizing layers, with inactive artwork transparent, inert, aria-hidden and pointer-suppressed. Visual mode changes coalesce to the final microtask state; this also avoids a stale hidden/transparent layer observed in Sandwich during four same-task mode switches. No forced geometry flush or removal of responsive size containment was added. Pizza's sauce/topping animations were not redesigned.
- Geometry-dependent bounds, dragging, fitting and picker recovery skip invalid dimensions. Export framing falls back to its valid baseline. Existing finite coordinates remain untouched; an invalid saved axis uses the existing centered fallback while retaining the other axis and ingredient.
- A failed button Restore attempts rollback, retains recovery for retry, announces the failure through the existing status region and pauses autosave until a successful Restore. Failed startup restoration protects the persisted snapshot for that session and asks for reload. Local console errors contain the exception, not a serialized creation; no telemetry was added.

### Verification scope

39 non-browser check files passed (the preview dependency manifest was refreshed after the workspace guard changed). Asset-version validation passed. Focused coverage includes invalid/zero/non-finite geometry and resumption, partial Restore failure/rollback/retry and startup-save protection, actual editor autosave, both-mode/difficulty recovery, origins, transforms, fitting, export and unchanged Pizza reload animation.

All five browser runs passed: Parfait, Pizza, Sandwich, Class Supplies and Builder Lab. Browser verification is recorded by `_dev/builder/restore-check.html`, run on isolated 127.0.0.1 pages with generated samples and app save backup/restore. It uses real app DOM/layout with synthetic clicks and keyboard movement, not mocked boxes. The harness covers Parfait's full and minimal sequences, empty/populated modes, cross-mode difficulty changes, repeated Restore and subsequent additions, connected/nonzero SVG and hit boxes, finite positions, selection/movement, reload in either mode, four rapid switches, both languages and Save preview generation. Resize sizes: 1133×678, 1133×599, 768×1024 and 390×844. Lab has no production Save preview assertion. Direct pointer dragging of restored/new Parfait fruit was also verified in the desktop browser.

Physical iPad Safari remains untested: touch/pinch, browser tabs/chrome, orientation during an active gesture, accidental toolbar taps and actual audio playback. This pass does not claim fresh enlarged-text, fullscreen, downloaded-file or every-device coverage. My Town/My Selfie were not given app-specific changes; their applicable automated checks and shared asset validation were retained. Git status/diff could not be rechecked at the end because the installed Git launcher requires an unaccepted Xcode license; no license was accepted, commit made or deployment attempted.

Implementation ownership: shared `builder-autosave.js`, `autosave.js`, `creative-builder.js`, `builder-editor.css`, `piece-gestures.js`, `builder-workspace.js`, `builder-panel-workspace.js`, `ui-ja.js`; Class Supplies forwards the shared save-failure hooks in `saving.js`. Tests: autosave, creative, play bounds, base fit, panel workspace, new restore-failures and the new local browser harness. Reference updates: workflow, style guide, Lab README and this record; dependent HTML asset hashes and homepage preview manifest refreshed. Other existing work was preserved.


## Historical rollout evidence relocated from WORKFLOW.md

These dated observations describe earlier revisions, **not current requirements or current deployment status**. In particular, earlier toolbar-safe item bounds and fixed output budgets were superseded by the approved full-frame placement and right-column workspace. Use STYLE-GUIDE.md for current visual policy and WORKFLOW.md for implementation ownership. Counts and pass/fail statements below apply only to the recorded run.

### Responsive Builder verification — 2026-11-02

Local in-app browser review covered Pizza, Parfait and Sandwich at 1133×716/715/714/678/656/655/600/599, 768×800, 740/739/738×800, portrait 744×1133, 1024×768, 1366×768, 1440×900, phones 390×844/375×667/320×568 and short landscape 844×390/740×360. Additional boundary checks at 741/742×716, 779/780×599 and 811/812×1100 verified the rail eligibility and bottom-strip thresholds. All checked tool buttons retained 44px targets and were separate from the artwork region. The 600/599 transition stays side by side; below 740px width the intentional page stack remains. Very short wide views scroll activity/choices internally.

Browser checks included populated compositions, long output, English/Japanese, mode switches, fullscreen entry/exit, toolbar editing, a Sandwich drag toward the tool strip, and successful Share previews in all three. Workspace, creative editing (including rotated bounds), play bounds, Parfait base behavior, Sandwich, sharing, section-jump and Builder Lab checks passed. The Parfait creative export fixture now loads the production ParfaitGlass artwork and verifies its back/front layering; it passes without changing the production export renderer. Physical iPad Safari with tabs/browser controls shown and hidden, touch/pinch, and enlarged system text remain release checks.


### Preferred artwork size verification — 2026-11-02

Food PLAY fitting now prefers full-frame LEARN coordinates and fits visible artwork, rather than scaling to the toolbar-free rectangle automatically. `check-artwork-fit.cjs` covers minimum translation, composition unions, last-resort proportional scale and minimum touch areas; `check-creative.cjs` checks rotated editing clearance. Run these with workspace, bounds, app, autosave/recovery and export checks when adjusting fitting. Preserve app-owned background bounds when changing Sandwich bread geometry.

Local browser comparisons covered populated Pizza, Parfait and Sandwich at 1133×716/714/678/600/599, 1024×768, 744×1133, 390×844 and 320×568. Ordinary centered compositions retained both size and position at the five 1133px widths; Pizza shifted about 15px left at 1024×768. Portrait Parfait shifted upward; Sandwich retained its size, with an upward phone shift. Pizza at 390×844 required about 90% scale. These are composition-dependent results, not device presets: edge toppings required additional shifts or small reductions, and an oversized rotated bread example required about 73% scale on the 390px phone. Wide/rotated edge compositions also passed 740/739×800, 844×390 and 1440×900 checks in Pizza and Sandwich. Actual pointer dragging toward the toolbar, keyboard editing, resizing and saved-position reloads were checked; controls and measured editing bounds stayed outside the tool strip. Save previews succeeded in all three. Physical iPad Safari/touch-pinch verification remains separate.



### Food panel spacing verification — 2026-11-04

The food-only spacing adapter is specified in STYLE-GUIDE.md. Measure rendered choices-column `scrollHeight - clientHeight`, not card minimum-height declarations. Compare both languages and modes with a selected Sandwich filling so its origin controls are visible. Preserve natural card growth and intentional scrolling rather than hiding choices.

Local browser measurements below show overflow in CSS pixels, before → after, for Japanese (Pizza’s taller case); Sandwich LEARN includes origin controls.

| Panel | 1133×716 | 1133×714 | 1133×678 | 1133×600 | 1133×599 |
|---|---:|---:|---:|---:|---:|
| Pizza LEARN | 2 → 0 | 4 → 0 | 32 → 0 | 110 → 70 | 158 → 71 |
| Pizza PLAY | 0 → 0 | 0 → 0 | 0 → 0 | 57 → 0 | 58 → 0 |
| Parfait LEARN | 78 → 38 | 80 → 40 | 108 → 68 | 186 → 146 | 191 → 147 |
| Parfait PLAY | 65 → 0 | 67 → 0 | 95 → 27 | 173 → 105 | 174 → 106 |
| Sandwich LEARN | 12 → 0 | 14 → 0 | 38 → 9 | 116 → 87 | 121 → 88 |
| Sandwich PLAY | 0 → 0 | 0 → 0 | 0 → 0 | 61 → 19 | 62 → 20 |

The normal-text matrix also covered 1024×668, 744×1133, 390×844 and 320×568 (108 cases before and 108 after). All three panels fit without internal scrolling at 744×1133. Narrow phones retain intentional whole-page flow. An additional 96 before/after cases at 1133×599, 1024×668, 744×1133 and 390×844 used simulated 150% computed font/line-height enlargement; crowded sections retained scrolling. Final target/text audits covered 120 combinations, including 320px-wide enlarged Japanese: no visible panel controls below 44×44px, clipped ingredient labels or horizontal panel overflow. Enlarged Parfait headings/long labels now wrap. This simulation is not a substitute for Safari/system text enlargement.

Thirteen relevant automated check files passed: workspace, artwork fit, creative editing, Parfait creative export, Sandwich, reset recovery, sharing, photo framing, autosave, Builder Lab, Class Supplies, My Town and play bounds. A Sandwich browser Save/Restore smoke check passed. Other builders do not load the food adapter. Actual iPad Safari with tabs shown/hidden and physical touch remain user release checks. Changes remain local; no deployment.



### Class Supplies / Builder Lab alignment — 2026-11-05

Scoped `reference-builder` panels consume the new reference adapter; no My Selfie/My Town or food app-specific styles changed. The previously untracked food stylesheet was verified and explicitly added to Git, alongside the new adapter; commit/publication must include dependent HTML and styles together. No commit or deployment was made.

Measured choices overflow (CSS pixels; English, HARD LEARN / PLAY, populated saved states):

| Panel | 1133×678 before → after | 1133×600 before → after | 1133×599 before → after |
|---|---:|---:|---:|
| supplies LEARN | 0 → 0 | 66 → 43 | 71 → 44 |
| supplies PLAY | 23 → 0 | 101 → 57 | 102 → 58 |
| lab LEARN | 0 → 0 | 2 → 0 | 7 → 0 |
| lab PLAY | 0 → 0 | 39 → 0 | 40 → 0 |

Browser measurements also covered 1133×716/714, 1024×668, 744×1133, 740/739×800, 390×844, 320×568 and 1440×900. Additional English/Japanese EASY/HARD/PLAY checks at 1133×599, 744×1133 and 320×568 included simulated 150% text/line-height enlargement. No sub-44px panel targets or horizontal panel overflow remained; short/enlarged sections retain intentional scrolling and phones retain page flow. Lab’s English instructional/vocabulary stress fixtures are deliberate, not a fully translated lesson.

Browser smoke checks confirmed visible keyboard focus, rotation, Reset→Restore and real Class Supplies Save preview, plus Lab’s explicitly non-exporting sample preview. Thirteen automated suites passed covering both apps, reset/recovery, autosave, workspace, preferred artwork fit, movement bounds, food creative behavior/export, Sandwich, sharing, photo framing and My Town. Drag/pinch bounds are covered by automated tests; physical touch dragging and iPad Safari with browser tabs shown/hidden remain release checks.



### Explicit base fitting — 2026-11-05

Class Supplies previously centered its square scene in the toolbar-free rectangle, moving the case left on every mode change. It now opts into shared full-frame fitting with explicit SVG-base and fixed-hit markers; Lab opts in with a full rectangular board. Food branches retain their existing geometry. Run the new `check-builder-base-fit.cjs` with fitting/workspace/creative/bounds, app, autosave/recovery and export suites. Fourteen suites passed, including food regressions and My Town.

Local Class Supplies mode comparisons covered 1133×716/714/678/600/599, 1024×768, 744×1133, 390×844, 320×568 and 1440×900; returning to LEARN restored the same frame. Ordinary populated compositions preserved full case size/position at the landscape/tablet/desktop sizes. A widened rotated notebook needed a phone shift; an enlarged notebook moved to a desktop edge needed about 93.4% scale after resizing to 390×844. Additional 844×390/740×360 checks required shifts with no measured control overlap after layout settled. These results depend on composition, not device identity. Browser mode controls can scroll a stacked phone page; compare artwork relative to its frame, not screen coordinates.

Browser checks included rotation, resizing, keyboard movement toward the usable edge, exact normalized style equality after Reset→Restore and reload, and a successful real Save preview. Automated pointer/pinch tests cover shared drag bounds. Physical iPad Safari (tabs shown/hidden), touch dragging and pinch remain separate release checks. No deployment.

