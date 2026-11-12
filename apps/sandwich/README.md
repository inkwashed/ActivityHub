# Little Sandwich Shop

Open `apps/sandwich/index.html`. Listed on the homepage under NEW HORIZON Elementary 6. NEW HORIZON Elementary 6, Unit 5; use the user-provided target “Tell me about your sandwich.”

LEARN has three explicit slots; choosing an ingredient replaces only the selected slot. Choose a source from the supplied PDF's three options for that ingredient. Sources are stored per filling type in each mode: replacing a slot uses the new type’s existing source if chosen, otherwise leaves it unset; selecting another slot retains choices. Bread is fixed. Initials follow selection-slot order; repeated ingredients are named once. EASY omits source sentences. HARD interleaves “It's from ….” after each ingredient explanation, using the selected source or an ellipsis until one is chosen. Source choices persist when switching difficulty. LEARN and PLAY have independent creations and country maps; EASY/HARD remains selected across mode changes. Both modes use the same language rules.

PLAY reuses shared CreativeBuilder and PieceGestures: drag, pinch, size, rotate, flip, duplicate, TOP, delete, and back-to-front picker order. Source selection follows the selected filling in either mode. LEARN/PLAY compositions and resets are independent. PLAY starts with only the fixed bottom bread. Bread is a PLAY-only palette choice with the same drag/resize/edit/stacking behavior as fillings; it is excluded from filling initials and source selection. Save uses the same SVG illustration and shared photo export. English vocabulary and grammar stay English; controls support Japanese. Approved recordings cover the question, ingredient words, initials and source sentences. Letter A is indexed separately from article a; corrected source pronunciations retain their approved overrides. Unsupported text or failed clips fall back to browser speech for the whole sentence. Physical iPad sequence testing remains pending.

`config.js` owns the 16 ingredients and their source choices, transcribed from the supplied `5yt-04.pdf` (bacon and ham are separate options with the same sources). Preserve the sheet's spellings, including America and the Philippines. These are classroom example choices, not current sourcing statistics. Illustrations are original simple vectors, not copied textbook pictures.

`model.js` owns initials/source language and the side-view illustration. `builder.js` extends FoodBuilder for three-slot editing. Shared editor `onSelect` permits contextual fields to follow the selected piece without changing selection order.

Validation: `node tests/check-sandwich.cjs`, `tests/check-sandwich-origins.cjs`, shared creative, autosave/recovery and pronunciation suites. Dated browser coverage is recorded below; the early local-file preview blocker is obsolete. Approved recordings now include initials and source phrases. Physical iPad layout, gestures, audible playback and downloads still need review.

Artwork uses gently angled bread with a visible crust, simple flat-color filling slices, and limited highlights. Tomatoes have radial seed chambers; cucumbers have green peel and pale seeded centers; onions use purple-edged concentric rings. LEARN framing leaves room around the top crust; ingredient icons, PLAY pieces, and exports reuse the same configured SVGs.

Layout follows the shared top-aligned choices-column rule and shared card sizing (four LEARN rows, four PLAY rows). Panel spacing follows the shared food-panel adapter (10px regular / 8px compact padding), and PLAY quick tools use the shared inset play-frame placement defined in docs/STYLE-GUIDE.md.

The opening sandwich abbreviation is displayed as individual outlined letter circles. These contain ordinary letters, preserving plain-text pronunciation, copying, and photo captions (which remain unadorned text). Ingredient explanations retain standard text.

The PLAY palette uses the shared content-aware food-panel sizing; wrapped labels and enlarged text may increase card heights.

Save uses an original simple park-and-picnic-table background. LEARN photo rendering reduces vertical filling spacing from 17 to 9 units and lowers the top bread accordingly, without changing editor state or illustration geometry. PLAY export preserves every manually placed transform and layer order.

LEARN filling slots use icon-only previews and grey no-ingredient symbols. Adjacent swap arrows exchange the slots; selection follows the moved filling. Source choices remain attached to filling type through the per-mode country map. Identical effective pairs disable their swap button.

Layout uses the final shared builder-workspace CSS/JS: tablet/desktop viewport fit, a stable food frame, and naturally growing sentence output in the independently scrolling choices column. Long/enlarged content retains accessible overflow. Physical iPad layout verification remains necessary.

LEARN shows all 16 fillings in a four-column, four-row grid without paging arrows or a page indicator. Bread remains PLAY-only. Pizza and Parfait separately use unpaged 3×3 grids.

In LEARN, the source heading spans the panel, with the selected ingredient label and source dropdown aligned side by side below it.

On tablet/desktop, LEARN ingredient drawings render 20% larger inside their existing icon boxes. Card dimensions and row spacing stay unchanged; Smaller LEARN screens retain their existing icon sizing.

PLAY displays the 16 fillings in a four-by-four icon-only grid with regular and compact sizes supplied by the shared food-panel adapter. The editable bread option sits beside the piece picker, separate from the filling grid.

PLAY selection outlines follow each ingredient SVG’s visible geometry with a small inset-space allowance, rather than its square canvas. The shared editor trims the drag target with the outline, retaining a 44px minimum; rotation, flipping and resizing are inherited, and exported artwork remains unchanged.

Live LEARN and PLAY use the same full-scale SVG coordinates for the fixed bread. LEARN top bread stays at least 13 SVG units below the top to avoid clipping. The 90% scene transform is shared by LEARN and PLAY Save photos.

Sandwich artwork has no plate or plate shadow, including the live scene, Save renderer and transparent logo/favicon.

State saves automatically on this device/browser through shared/autosave.js and shared/builder-autosave.js, including independent LEARN/PLAY compositions and difficulty. Reset persists the cleared active mode. Storage failure leaves the activity usable; there is no cloud sync. Shared restore checks: `node tests/check-autosave.cjs`.

The Save photo uses the shared centered Download action with a 12px photo gap and the QR modal’s download icon.

Save includes the full editing frame, adding background as needed rather than cropping edge pieces. Verified by `node tests/check-photo-framing.cjs`.

Shared pronunciation setup tolerates missing/throwing device voice APIs. If audio initialization/rendering fails, Builder retains plain sentence text and continues artwork initialization; Reset does not retry failed initialization or accumulate speaker buttons.


## Approved panel workspace

Uses shared `builder-panel-workspace.css/js`: choices and growable English output share one scrolling column; the left creation uses the freed height. The base fits beside tools; movable pieces use the full outer frame, including behind tools. Picker recovery moves a covered piece into view and saves that position. Square exports include the entire editing frame, which can add background on tall/narrow layouts. App-specific art, lesson choices, mode state and photo treatment remain local. See the style guide and `docs/BUILDER-WORKSPACE-VERIFICATION.md` for the rollout checks and device limitations.

## Countries and independent difficulty

One country per filling type is selected in each mode. Selecting any tomato changes the country for all tomatoes in that mode; repeated fillings remain named once. Countries may be chosen in EASY too, but only HARD includes “It's from ….” Missing selections remain an ellipsis; bread has no country or initial. No source is inferred from the artwork or ingredient. Old saves with conflicting slot countries migrate to the first explicit valid choice in slot order. Replacing a slot retains the new type's country if already chosen; otherwise it is unset. Reset clears the active mode's country map, and Restore recovers it with the creation. Deleting a piece retains its type's country for later re-adding until Reset.

### Local verification (2026-11-06)

All 36 non-browser checks passed, including four difficulty/build combinations, per-type sources, duplicate fillings, invalid/missing countries, reload, mode isolation, Reset/Restore and export/geometry regressions. Asset versions and preview fingerprints are current. Difficulty now sits beside the persistent (2) origin heading; PLAY keeps the source dropdown visible, disabled with “Select a filling first” when no filling or bread is selected. Selecting a filling enables its configured locations. LEARN retains contextual country fields.

Browser verification covered 68 English/Japanese mode/viewport cases, including 1133×716/714/678/600/599, 744×1133, 739/740×800, phone landscape/portrait and desktop. No horizontal overflow or undersized Listen/info/source controls was found. Additional checks covered keyboard-opened help, 150% text at three sizes, PLAY country persistence through reload, Restore in both modes, rotated filling recovery from behind the toolbar, resizing/layering, pronunciation activation, both Save previews and a PLAY download. Physical iPad dragging, pinch, scrolling, accidental taps and audible pronunciation quality remain hands-on checks. Long output intentionally scrolls the right column; phones retain stacked navigation. The artwork region stays square within a taller captioned image; full editing-frame inclusion may add background.

### Practice badges
Creation edits now earn a local first-builder badge, with higher ranks after 5/10/15/20 qualifying sessions, at most once per 30 minutes. Opening/restoring alone does not award credit. Reset does not remove earned badges. See docs/WORKFLOW.md → Local achievements and app visits for shared ownership and checks.

## Header and overflow

This app loads `shared/app-shell.css` last: navigation stays outside the named activity scroll region, while narrow/short screens and long content retain necessary scrolling. Scrollbar appearance comes from shared controls.css. See [the shared contract](../../docs/STYLE-GUIDE.md#app-headers-and-overflow) and run `node tests/check-app-scroll-browser.cjs` for shell changes.
