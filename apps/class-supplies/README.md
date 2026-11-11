# My Pencil Case

Display name: My Pencil Case (formerly Class Supplies). The class-supplies URL, storage keys and internal identifiers remain unchanged. The numbered “Class supplies” heading describes the item choices, not the app title.

Entry: `apps/class-supplies/index.html`. Let’s Try! 2, Unit 5: “Do you have a pen?” Listed on the homepage under Let’s Try! 2 Unit 5; publishing is handled separately.

Selected-item question audio uses the shared approved “Do you have a/an” prefix followed by the item recording, with no display-format change. All 13 singular items are supported. A selection change cancels pending playback; the empty question uses the approved “Do you have a” prefix, while unsupported or failed recordings use full-question browser speech. Prefix listening review and automated sequencing/fallback checks passed; physical iPad/Safari playback remains unverified. Generation and provenance are owned by `assets/audio/README.md`.

LEARN is one building flow. Tap a supply to toggle it; one of each type has a fixed, recognizable position. The hard-sided case is shown straight from above, with aligned rectangular lid and tray interiors, visible hinges and a front clasp. The ruler uses a slim profile and fits within the lid rim. Pencils, colored pencils, pens, markers and rulers appear horizontally in both palettes and use the same default artwork size in LEARN and PLAY (the shared per-item defaultScale is currently 1.30× for writing tools and 1.56× for the ruler); new PLAY pieces start horizontal; saved PLAY rotations remain unchanged. The ruler sits lengthwise inside the lid; pencils, pen and marker lie horizontally in the tray, with the vertical eraser and horizontal glue stick beside them. LEARN rotations also apply to Save; PLAY retains independent transforms. The enlarged bound notebook and flat calendar sit side by side below the case, using matching default sizes in LEARN and PLAY. The sharpener and magnet sit at either end of the lid; the stapler sits inside the tray. The pencil case is always present, completing the 13 vocabulary items. Its color is chosen through the same color controls as other supplies.

The question follows the selected item in LEARN and PLAY, returns to “Do you have a …?” when selection clears (confirmed wording, November 9, 2026), and uses a/an (for example, “Do you have an eraser?”). Its pronunciation button reads the current question. The output area contains only the inventory sentence; the Yes/No response line is intentionally omitted. The app does not ask questions or decide which response a student should say. The independent-difficulty section below owns the language policy; PLAY does not force a difficulty.

PLAY reuses CreativeBuilder for drag/pinch, size, rotation, flip, duplicate, TOP, delete, keyboard movement and ordered picking. Each mode keeps independent supplies and colors. Each PLAY piece has its own color; duplication preserves that color. Output grouping follows the selected difficulty as documented below. The fixed case is a backdrop in both modes. Reset clears only the active mode and returns its colors to defaults.

The app header and browser favicon use a red pen pointing tip-down. Original SVG artwork and fixed LEARN coordinates live in config.js. The eraser is white with a text-free blue/white/black sleeve by default; its color control changes only the colored sleeve band. The glue stick also defaults to white with a blue band near its ribbed twist base; its color control changes the band, leaving the cap and body white. Saved color choices are retained. A plain pencil retains a graphite tip when its barrel is recolored; colored pencils retain colored cores. Shared controls, tokens, icons, viewport/workspace, pronunciation, language dialog, QR and photo lifecycle are consumed directly. Missing vocabulary recordings use the shared browser-speech fallback.

Saving wraps BuilderAutosave with validated per-mode color palettes and selected color target. Storage ID: class-supplies. Save exports the visible frame using the same SVG art and back-to-front PLAY transforms; no upload. The app QR points to the eventual canonical public path, which is not published by this prototype work.

## Verification

- `node tests/check-class-supplies.cjs`: mock-DOM checks of toggles, a/an, mode/color independence, duplicate/rotate/flip, export art, restore/reset, invalid input.
- Real in-app browser: populated LEARN, PLAY duplicate/rotate, color changes, reload restoration, active-only reset across reload, image preview, English/Japanese switching. Inspected landscape 1133×744, portrait 768×1024, phone 390×844. Portrait frame and scene rectangles were identical across LEARN/PLAY. Long inventories grow within the scrolling choices column.
- `node tests/check-autosave.cjs`: shared storage and Pizza/Parfait/Sandwich/Lab restoration pass; the former Avatar fixture failure was resolved; the November 6 shared verification recorded this suite passing.
- Physical iPad touch/pinch, audible pronunciation, and device download behavior remain unverified. Enlarged-text and additional desktop sizes remain for review.
- For an app-only asset update, refresh with `node scripts/version-builder-assets.cjs apps/class-supplies`. Omitting arguments retains the full rollout operation and now includes this app.

All supplies now derive LEARN size from creativeSize × defaultScale, the same size used by newly added PLAY pieces. Glue stick and eraser default to 1.15×, stapler 0.95×, sharpener 0.85× and magnet 0.55×. LEARN places the glue stick horizontally at upper left, the stapler beneath it, and the eraser vertically beside them. Saved PLAY arrangements and scales are preserved.

Artwork outlines are normalized to the original eraser’s visible stroke width at each default scene size, including the case. Fine detail lines retain their relative lighter weights. Pencil/pen length is drawn directly into coordinates rather than stretching strokes. Eraser and glue-stick default scales are now 1.15×. Manual PLAY resizing scales the whole illustration naturally.

Color selection uses ten labelled swatch buttons (including white and brown) in a compact two-row, five-column grid beside a dashed selected-item preview. Select an item directly in the scene in either mode; the fixed case is also a native selectable button. LEARN item selection changes only the color target, not the contents. The shared selected border/tint and aria-pressed indicate the active swatch. Native buttons support keyboard activation; colors follow the selected item and active mode.

PLAY piece colors are captured alongside each item by the local save adapter, validated against the palette on restore, and used by exports. Older saves fall back to their saved per-type PLAY colors. Browser-verified mixed-color duplicate counts persist across reload.

Save supplies an explicit 900×900 SVG with a proportional square viewBox, expanded to enclose the full editing frame. A light wood-grain school desk extends past the left/right photo edges, with front/back edges over medium-grey carpet. Piece transforms and colors remain unchanged; the toolbar is omitted. Extra background is intentional when the editable frame is wider or taller than the original crop.

Builder formatting review: shared headings, controls, card sizing, workspace, dialogs and header conventions are retained. The color preview stacks above its two rows of five swatches when the panel is too narrow; heading controls can wrap, preserving full touch targets. Reusable selection/color, default artwork sizing and export-proportion patterns are documented in the style guide and workflow.

The Save photo uses the shared centered Download action with a 12px photo gap and the QR modal’s download icon.

Empty-space clicks clear selection in LEARN and PLAY. With no selected item, the color preview is empty and swatches are disabled; explicitly selecting the pencil case still enables its colors.

Inventory sentences now assemble from approved sentence pieces, articles, colors, singular/plural item recordings and counts up to 120. The complete sentence must resolve before playback; otherwise it uses browser speech. Formatting and exports are unchanged. Automated library/player checks pass; physical iPad playback remains pending.

## Shared engine alignment — November 2026

The reference-panel adapter uses available choices height for 10/8px padding, 8/6px section gaps and content-aware cards. Color swatches keep 44px targets with 6px gaps and a 64px preview. Color controls are available in all four mode/difficulty combinations; EASY omits spoken color words and HARD includes them. Short crowded panels scroll intentionally. The existing shared reserved toolbar and proportional scene coordinate system remain intact, including fixed-case selection, preset LEARN positions and saved PLAY transforms. Reset temporarily becomes Restore per mode; new additions discard recovery. Save is the real proportional PNG preview/export, with full editing-frame inclusion.

### Preferred case framing

Class Supplies explicitly uses shared full-frame composition fitting. The case SVG’s visible bounds (including its translated shell and tabs), fixed case selector participate in base fitting. Movable items use separate full-frame movement bounds. PLAY preserves LEARN case size/position if the persistent base fits, shifts minimally otherwise, and scales only when translation cannot suffice. Transparent SVG margins do not force shrinking. The case and pieces remain in one coordinate system; fitting does not rewrite stored transforms. LEARN placement and the independent square Save photo framing remain unchanged.

### Approved panel workspace

`shared/builder-panel-workspace.css/js` move the existing output node beneath the controls, preserving its pronunciation listeners, and visually hide the redundant column title (the numbered Class supplies heading remains). The right column is the only tablet scroll region for controls/output; text grows naturally. A native scrollbar and subtle bottom shadow indicate overflow. Phones below 740px keep the activity-first page stack and section-jump control. No automatic jump to the sentence is introduced; edit handlers retain the column offset through transient sentence rerenders where possible. Focusing an offscreen control may still scroll it into view.

The left frame gains the old output height. Its app-owned preferred-frame budget now grows the complete creation into that height until width becomes the limit. Already width-limited portrait layouts retain their earlier vertical placement; phones retain their existing frame. Shared fitting then shifts minimally or scales down only when the persistent base cannot safely fit. Movable pieces use independent full-frame bounds. Normalized coordinates and saved state retain their schema; full-frame export framing is described below. At extremely short tablet heights fitting may still reduce the composition to keep it clear of controls.

Review tradeoff: HARD/PLAY colors and long sentences often put the output below the fold on short tablets. There is deliberately no sticky sentence, duplicate output or extra jump button yet. Confirm with students whether the scrollbar is enough. Local checks cover both modes/languages, short/populated output, simulated 150% text, nearby 740/739 widths and 600/599 heights, portrait, phone and desktop. Physical iPad Safari/touch scrolling and actual listening remain review steps. This workspace pattern is now approved for the food Builders and Lab; it remains a local, undeployed change.

#### Historical expanded-artwork measurements — 2026-11-05

These measurements predate full-frame movement. They are evidence for that sizing change, not the current movement-boundary rule.

The previous prototype subtracted the old sentence height and gap from a hidden preferred-frame element. At 1133×678 the real frame was 631×534px, but the preferred frame was only 631×433px, limiting the square scene to 399px. The local CSS now uses both full width and height to grow that budget. All case art, supplies and selection targets remain descendants of the same fitted scene; normalized saves and square photo export need no migration. No shared fitter or other app layout changed in this adjustment.

Approximate visible case dimensions, excluding stroke (LEARN; ordinary PLAY matches unless composition fitting needs a shift/reduction):

| Viewport | Before | After |
|---|---:|---:|
| 1133×678 | 303×251 | 374×310 |
| 1133×599 | 255×212 | 318×264 |
| 1133×716 | 317×263 | 393×326 |
| 1024×768 | 349×289 | 391×324 |
| 744×1133 | 242×201 | unchanged |
| 390×844 | 240×199 | unchanged |
| 320×568 | 191×158 | unchanged |
| 1440×900 | 428×355 | 515×427 |

Browser checks covered empty and populated scenes, long output, rotated/resized edge items, keyboard movement, exact transform equality after Restore/reload and successful real Save export. No measured PLAY selection bounds crossed the toolbar-free area. The existing edge-heavy 390px phone composition still needs approximately 93% scale; 1024px landscape and some desktop edge arrangements need small shifts. The sentence remains naturally growing inside the independently scrolling choices column. Physical iPad touch dragging, pinch and scrolling remain unverified. Local prototype only.

#### Full-frame placement

Class Supplies and the approved shared panel-workspace consumers set `placementBounds` to the outer play frame and `data-builder-placement="full"` on its fitted stage. Base fitting still uses the toolbar-free surface and fixed case selector; movable pieces no longer change base fitting. The inner surface allows visible overflow, while the outer rounded play frame clips at its real edge. Movement limits use rotated selection bounds, with minimum 44px hit targets, against that outer rectangle. Oversized pieces remain centered/partly visible rather than being lost. My Selfie and My Town remain outside this rollout.

The toolbar remains above all supplies and keeps its existing pointer isolation. A drag retains pointer capture, so passing over tools does not tap them. A covered item can always be chosen in the existing piece picker; choosing an item intersecting the toolbar moves it minimally into the toolbar-free region. This deliberate recovery move changes its saved position; use it only when you want the item revealed. Help explains this in English/Japanese. Keyboard arrows can also move the selected piece. No new persistent controls were added.

Save uses a square enclosing the full editable frame, with the same normalized item transforms, so supplies behind the toolbar or beyond the old 110-unit crop remain in the picture. The toolbar is never exported. Tradeoff: tall portrait frames can produce a wider, more zoomed-out square photo with additional background. This is the current approved panel-workspace policy, replacing the former fixed crop.

Browser checks reached real tablet/phone edges, exercised rotated toolbar taps, picker recovery (a phone item moved 120px clear of the bottom tool strip), and matched normalized styles exactly after Restore and reload. Physical iPad pointer capture, accidental-tap prevention and partly obscured touch selection remain release checks; automated shared pointer tests cover gesture behavior. Nothing deployed.

The local workspace-prototype adapter now contains only the reviewed preferred-frame geometry and translated recovery help. Common scrolling, full placement, picker recovery and export bounds live in `shared/builder-panel-workspace.css/js`.

## Independent difficulty and playback

`config.independentDifficulty: true` opts into one difficulty choice across both build modes. EASY omits color words and groups PLAY copies by type; HARD names colors and groups by type/color. Both use a/an for single items and numeric counts for multiples. Color editing is available in all four combinations. Existing saves' `hard` field becomes the shared difficulty choice; creation/palettes remain per-mode. Pizza, Parfait and Sandwich also opt into independent difficulty, with their own lesson rules; Lab intentionally remains a legacy example.

The optional native difficulty switch lives beside Color, with a keyboard/touch dialog explaining the rules. The shared editor and base builder tolerate an omitted switch. Color is the Class Supplies placement; other apps use their own documented heading rows.

The sentence speaker reserves a separate 44px flex column, aligns to the top, and sticks 8px below the scrolling column edge while its sentence remains in view. It is not a global floating player: it leaves view when the sentence itself is out of view. Phones keep the existing whole-page scrolling fallback. This avoids overlaying words and inline pronunciation controls.

Verified locally: all four combinations in English/Japanese, adapter reload round trips, populated browser reload, Reset/Restore, Save preview, playback activation and keyboard help. Viewports: 1440×900, 1133×678/599, 768×1024, 390×844 and 320×568. At 150% text in a short window, the 573px sentence scrolls with its 44×44 speaker still visible at the column top; its text remains in a separate column. The Color row wraps at narrow/enlarged sizes. Physical iPad sticky positioning, touch scrolling, accidental taps and audible playback still need hands-on testing.

### Practice badges
Creation edits now earn a local first-builder badge, with higher ranks after 5/10/15/20 qualifying sessions, at most once per 30 minutes. Opening/restoring alone does not award credit. Reset does not remove earned badges. See docs/WORKFLOW.md → Local achievements and app visits for shared ownership and checks.
