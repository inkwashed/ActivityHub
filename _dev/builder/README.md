# Builder Lab — local reference candidate

Open `index.html` in this directory using a local browser. The page works without a build or network request. Its shared assets stay at their normal repository paths. This is not linked from the homepage, has noindex/nofollow, and `_dev` is excluded from GitHub Pages/Jekyll by `_config.yml`. If hosting changes, explicitly exclude `_dev` from that publishing pipeline. No deployment is part of this work.

## What to try

- LEARN: three icon-only slots with adjacent swaps and × clear controls; four ingredient choices below them. The active slot stays selected when replacing items.
- LEARN: four-across quantity choices with left/right paging, three quantity dots and the existing none → light → regular → extra → none cycle. All 16 examples are available over four pages.
- LEARN: a labelled dropdown, including a long option to test width.
- PLAY: all 16 choices in four columns, larger icon-only cards, a piece picker and the shared drag/pinch/rotate/flip/duplicate/TOP/delete toolbar. PLAY state is separate from LEARN.
- Reset clears the current mode. Share opens a sample caption dialog; it does not export or publish.
- The info dialog offers live, short, long and overflowing sentence examples. Check that the play frame stays fixed as text changes. EASY/HARD exercises quantity wording; language/fullscreen/pronunciation use the existing shared features.

The lab consumes the real shared workspace, controls, quantity engine, creative editor, gestures, pager, pronunciation and viewport scripts. `shared/builder-slots.js` is an opt-in slot component under review, used only here so far. Production applets have not been migrated to it. Slot labels and new lab-specific instructions are English-only pending localization; existing common interface translations still work.

## Decisions still needed

1. **Slot component adoption:** Parfait and Sandwich still implement slots separately. Review this opt-in component (slot count, metadata preservation, notifications and translation API), then migrate with regression checks. Merely approving its appearance does not complete that migration.
2. **Card sizes:** PLAY sizing is now shared across the Lab, Pizza, Parfait and Sandwich: 72px minimum cards, 4px padding and artwork up to 64px wide. Continue reviewing narrow-tablet fit and visible artwork proportions; canvas size alone does not equal visible size.
3. **Combined-section budget:** this compact example uses one row of slot choices plus one paged quantity row. The guides do not yet specify how to budget height for many simultaneous sections. Test the full panel on the smallest target iPad before standardizing more rows.
4. **Accessibility overflow:** current shared policy allows bounded scrolling for long/enlarged content. Confirm that exception versus a strict no-scroll requirement; we must not hide content or make text/touch targets unreadable.
5. **Selection outlines:** the shared editor now measures visible SVG bounds for the outline and drag target, retaining a 44px minimum. Verify flat, rotated, flipped, duplicated and syrup-covered items on touch devices.
6. **Shell ownership:** header/dialog markup, toolbar CSS, and several app-name-based scene selectors remain duplicated or hard-coded. This lab reveals those gaps; it does not yet replace them with a universal app generator.
7. **Share contract:** this fixture tests button/dialog styling only. Real export fidelity remains covered by the production exporters and their tests.

## Verification and rollout

Run `node tests/check-builder-lab.cjs` and `node tests/check-builder-workspace.cjs`. The lab test exercises actual shared quantity/creative/pager code in a mock DOM plus slot state, mode isolation, sentence fixtures and the sample dialog. It is not a visual browser test.

Review 744×1133, 768×1024, 1024×768, 1133×744, 1366×768, a phone, keyboard navigation and enlarged text. Local browser access was unavailable during implementation; physical iPad layout/gesture review remains outstanding.

After approval: record the decision in its owning guide, move the approved implementation into shared files, migrate every applicable consumer, run affected behavior checks, review the same states on each app, and refresh asset versions. Do not assume editing this fixture updates the production apps. Avoid breaking experimental edits directly in a shared file already loaded by production apps; stage those locally first.

## Reviewed layout adjustments

LEARN choice artwork in both the slot-choice and paged quantity grids is enlarged 20% on tablet/desktop (at least 740×600 CSS px), matching Sandwich. Keep the existing 36px layout box, card heights, labels and quantity dots. Apply the transform only to `.ingredient-art > svg`; never scale all descendant SVGs, which can enlarge nested fragments twice and clip their edges. Slot previews and PLAY artwork retain their separate sizing. This adjustment is Lab-scoped; it does not roll out to other applets automatically.

The header includes “TEXTBOOK NAME · Unit 0” as a visible tablet/desktop placeholder for lesson context. Production builders use their actual textbook and unit.

Mode-size regression review: compare the same viewport before/after LEARN ↔ PLAY with short and long output. Check both the frame rectangle and a permanent scene landmark (pizza diameter, sandwich bottom bread, glass base). Equal frame sizes alone cannot detect a mode-specific SVG scale. The Lab uses one unchanged board for both modes; app renderer checks must cover internal SVG transforms and export-only framing separately.
