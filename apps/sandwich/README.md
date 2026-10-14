# Little Sandwich Shop — prototype

Open `apps/sandwich/index.html`. Not on the homepage yet. NEW HORIZON Elementary 6, Unit 5; use the user-provided target “Tell me about your sandwich.”

LEARN has three explicit slots; choosing an ingredient replaces only the selected slot. Choose a source from the supplied PDF's three options for that ingredient. Replacing a filling clears its source; selecting another slot retains earlier choices. Bread is fixed. Initials follow selection-slot order; repeated ingredients are named once. EASY omits source sentences. HARD interleaves “It's from ….” after each ingredient explanation, using the selected source or an ellipsis until one is chosen. Source choices persist when switching difficulty. PLAY retains its secondary source sentences and locks EASY; returning to LEARN restores the previous difficulty.

PLAY reuses shared CreativeBuilder and PieceGestures: drag, pinch, size, rotate, flip, duplicate, TOP, delete, and back-to-front picker order. Each piece can have its own source. LEARN/PLAY compositions and resets are independent. PLAY starts with only the fixed bottom bread. Bread is a PLAY-only palette choice with the same drag/resize/edit/stacking behavior as fillings; it is excluded from filling initials and source selection. Share uses the same SVG illustration and shared photo export. English vocabulary and grammar stay English; controls support Japanese. Existing approved vocabulary clips are reused; new words and sentences fall back to browser speech.

`config.js` owns the 16 ingredients and their source choices, transcribed from the supplied `5yt-04.pdf` (bacon and ham are separate options with the same sources). Preserve the sheet's spellings, including America and the Philippines. These are classroom example choices, not current sourcing statistics. Illustrations are original simple vectors, not copied textbook pictures.

`model.js` owns initials/source language and the side-view illustration. `builder.js` extends FoodBuilder for three-slot editing. Shared editor `onSelect` permits contextual fields to follow the selected piece without changing selection order.

Validation: `node tests/check-sandwich.cjs`; shared creative and pronunciation suites. Browser preview was blocked by the browser URL policy for local files; physical iPad layout, gestures and downloads still need user review. The prototype has no new recorded pronunciation clips and has not been deployed.

Artwork uses gently angled bread with a visible crust, simple flat-color filling slices, and limited highlights. Tomatoes have radial seed chambers; cucumbers have green peel and pale seeded centers; onions use purple-edged concentric rings. LEARN framing leaves room around the top crust; ingredient icons, PLAY pieces, and exports reuse the same configured SVGs.

Layout follows the shared top-aligned choices-column rule and shared card sizing (two LEARN rows, five PLAY rows). Menu heading gap is 12px, panel padding 14px in both modes, and the landscape toolbar stays 44px wide with a 12px gutter.

The opening sandwich abbreviation is displayed as individual outlined letter circles. These contain ordinary letters, preserving plain-text pronunciation, copying, and photo captions (which remain unadorned text). Ingredient explanations retain standard text.

The dense PLAY palette uses shared sizing with 4px choice padding and a 64px maximum card height, retaining the shared 52px minimum. LEARN sizes are unchanged.

Share uses an original simple park-and-picnic-table background. LEARN photo rendering reduces vertical filling spacing from 17 to 12 units and lowers the top bread accordingly, without changing editor state or illustration geometry. PLAY export preserves every manually placed transform and layer order.

LEARN filling slots use icon-only previews and grey no-ingredient symbols. Adjacent swap arrows exchange the complete filling/source pair; selection follows the moved filling. Identical pairs disable their swap button.
