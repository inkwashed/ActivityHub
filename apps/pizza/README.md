
# Little Pizza Kitchen

Current lesson rules are below; visual/workspace policy is owned by [STYLE-GUIDE.md](../../docs/STYLE-GUIDE.md), engine ownership by [WORKFLOW.md](../../docs/WORKFLOW.md). Dated measurements describe the revision tested, not a deployment claim.

Pronunciation: the result speaker reads the full English order; dotted-underlined ingredient phrases play individually. Vocabulary phrases and supported full orders (including quantity phrases) use the approved shared Kokoro recordings. Unsupported text or a failed clip falls back to browser speech for the complete order. Recordings load only when tapped. Device voices are used only for fallback/voice preview; physical iPad verification of recorded sequences remains pending.

Layout uses the final shared builder-workspace CSS/JS: tablet/desktop viewport fit, a stable food frame, and naturally growing sentence output below choices in the independently scrolling right column. Long/enlarged content retains accessible overflow. Physical iPad layout verification remains necessary.

All nine toppings appear together in a three-column, three-row grid in LEARN and PLAY, without paging arrows or a page indicator. Quantity cycling, topping order and independent mode state are unchanged.

Pizza uses the full available square within its fixed play frame in both LEARN and PLAY. Mode-specific board sizes and workspace row overrides must not override the shared stage/output layout.

State saves automatically on this device/browser through shared/autosave.js and shared/builder-autosave.js, including independent LEARN/PLAY compositions and difficulty. Reset persists the cleared active mode. Storage failure leaves the activity usable; there is no cloud sync. Shared restore checks: `node tests/check-autosave.cjs`.

The Save photo uses the shared centered Download action with a 12px photo gap and the QR modal’s download icon.

Save framing follows the centered, expanding export policy below; fixed-crop guidance is superseded. Verify with `node tests/check-photo-framing.cjs`.


## Approved panel workspace

Uses shared `builder-panel-workspace.css/js`: choices and growable English output share one scrolling column; the left creation uses the freed height. The base fits beside tools; movable pieces use the full outer frame, including behind tools. Picker recovery moves a covered piece into view and saves that position. Square exports include the entire editing frame, which can add background on tall/narrow layouts. App-specific art, lesson choices, mode state and photo treatment remain local. See the style guide and `docs/BUILDER-WORKSPACE-VERIFICATION.md` for the rollout checks and device limitations.


## Independent difficulty and playback

Pizza opts into `independentDifficulty` and `creativeQuantityLevels`. Other apps do not acquire these policies automatically. EASY names selected toppings and uses “everything” when all types are present. HARD groups “a little bit of,” “some,” and “a lot of,” including the existing uniform-level everything phrases. Sauce wording stays at the end in both modes.

LEARN retains its three amount levels and artwork. In PLAY, zero pieces means absent; 1 through `counts[1]` means a little bit, through `counts[2]` means some, and larger counts mean a lot. Counts are ingredient-specific: pepperoni uses 1–3 / 4–6 / 7+, cheese uses 1–18 / 19–38 / 39+, and corn uses 1–8 / 9–17 / 18+. Resizing, rotation and overlap do not change the spoken amount. This deliberately replaces PLAY's previous numeric size-band wording with the lesson's amount phrases. This is Pizza’s agreed lesson rule, not a quantity-language standard for other apps.

The optional EASY/HARD switch and a native help-dialog button share the (2) heading. The PLAY picker sits on a full row below them. Building-mode help covers adding, arranging and recovering items; difficulty help covers language. English learning targets remain English in Japanese UI. The shared engine already tolerates an omitted difficulty control.

The sentence speaker uses a separate 44px flex column aligned to the top. It sticks within the sentence while the existing right column scrolls; it is not a global floating button when the sentence is offscreen. Narrow views retain existing whole-page scrolling. App-scoped rules in layout.css implement Pizza’s treatment; the other reviewed Builders have their own matching adapters.

Verification: all four combinations in English/Japanese, populated mode switching and PLAY+HARD reload, keyboard help/focus, Reset/Restore and successful Save preview. Checked 1440×900, 1133×678/599, 768×1024, 390×844 and 320×568. Enlarged-text checks used 150% at short landscape and narrow phone widths: controls wrap, speaker remains 44×44, text stays in its own column. Playback activation was checked; audible timing and physical iPad Safari/touch/sticky scrolling still need hands-on testing. All 34 non-browser suites passed, including legacy editor behavior and Pizza's new thresholds. Local only, no deployment.

## Bottom-toolbar centering and balanced exports

Pizza's stage opts into `data-builder-bottom-center="true"`. After the shared proportional fit, the fitter chooses the horizontal translation that centers the actual pizza base in the full frame, clamped to safe fitting limits. This applies only when toolbar clearance reduces height but not width. Side-toolbar behavior remains the existing minimum-movement fit. The composition box itself moves, so ingredients, scene-relative gestures and normalized saved positions share the same coordinates; full-frame placement and picker recovery remain independent.

Pizza Save requests the optional centered `photoFrame` policy at drawing center (50,50). It encloses the real editing rectangle and original base symmetrically, then includes conservative rotated bounds of each PLAY SVG plus a small stroke allowance. All toppings retain the existing 0.94 mapping and baked-photo artwork. Other Builders do not request this policy. The artwork square stays centered on the pizza even for deliberately asymmetric creations. The PNG still has its existing white caption margin beneath that square.

Tradeoff: an edge/oversized item expands background on the opposite side too. Including the full editing area can make the pizza smaller in the saved square; this is intentional and avoids cropping or a toolbar-induced offset. Extremely distant older saved pieces can produce a much larger background rather than being silently cropped.

Measured at settled layout: 390×844 (two-row bottom tools), pizza center x changed 170.45→187.50, matching frame 187.50, diameter unchanged at 278px. At 600×800 (one-row bottom tools), 266.21→292.49 versus frame 292.50, diameter unchanged at 327.99px. At 1133×678 (right tools), center remains 327.61 and diameter 480.78px. Both bottom layouts retain 16px between pizza bottom and toolbar top. LEARN position/size remains unchanged.

Browser checks covered mode switching, resizing across both toolbar orientations, enlarged/rotated asymmetric pieces, keyboard movement behind the tools, picker recovery, exact normalized style equality after Restore/reload, and successful Save preview/PNG download. Focused tests cover all four extreme edges, rotated large pieces, symmetric export bounds and unchanged coordinates. Physical iPad dragging/pinch and Safari resizing remain hands-on checks. Local only.

For those measured rectangles, the raw-area export squares (before any farther piece bounds) are respectively `[-37.576,-37.576,175.151,175.151]`, `[-26.953,-26.953,153.907,153.907]`, and `[-11.708,-11.708,123.416,123.416]` in photo coordinates. Each has exact center (50,50). All 35 non-browser regression suites, preview freshness, asset hashes and whitespace checks passed.

LEARN reloads restore data first, animate the sauce, then sprinkle toppings in batches of 12 every 180ms. PLAY reloads, mode switches and Reset/Restore remain immediate. Editing during the replay reveals the remaining toppings immediately and cancels their queue. Reduced motion skips the replay. Normal student-triggered sauce and topping animations remain unchanged.

Sauce reveal uses one fixed spiral path and numeric SVG-unit dash offsets, avoiding per-frame path-string rebuilding. Cumulative segment lengths preserve the original angular timing without SVG pathLength normalization. A circular clip contains the highlight, and the larger mask bounds avoid cutting off the round reveal cap. Physical iPad/Safari smoothness remains a device check.

### Practice badges
Creation edits now earn a local first-builder badge, with higher ranks after 5/10/15/20 qualifying sessions, at most once per 30 minutes. Opening/restoring alone does not award credit. Reset does not remove earned badges. See docs/WORKFLOW.md → Local achievements and app visits for shared ownership and checks.
