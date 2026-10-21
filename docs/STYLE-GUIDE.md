# Let’s EiGo! style guide

Version 0.1 — a living guide based on Pizza Builder. Revise this guide and the shared styles together as the collection develops.

## Source of truth

- `shared/tokens.css`: palette, typeface, spacing, sizes, radii, and motion duration.
- `shared/controls.css`: buttons, choices, and EASY/HARD switch.
- `shared/icons/`: balanced language, Reset, and camera icons.
- `docs/style-guide.html`: working examples using the same styles as the app.

Load tokens, app base styles, shared builder chrome, shared controls, then optional shared layout components and shared responsive policy. A documented app geometry file may follow the responsive policy. Load shared/builder-workspace.css last for builders; it owns final stage, output, and tablet/desktop fit geometry. App styles own layout and activity artwork; shared styles own control appearance and states. Reuse the shared classes instead of copying button rules into each applet.

## Visual direction

A warm, clear classroom workspace: cream background, near-white surfaces, dark green text, softly shaded controls, and orange accents. Keep the activity prominent. Avoid decorative content that reduces its available space.

## Palette

| Role | Token | Color |
| --- | --- | --- |
| Page background | `--ah-canvas` | #f8f6ed |
| Panel/control surface | `--ah-surface` | #fffefa |
| Main text | `--ah-ink` | #263f36 |
| Supporting text | `--ah-muted` | #627067 |
| Thin control border | `--ah-border` | #9cae9b |
| Hover fill | `--ah-hover` | #e8eddf |
| Pressed fill | `--ah-pressed` | #d5e1cc |
| Secondary action fill | `--ah-secondary` | #e0ead7 |
| Secondary action hover | `--ah-secondary-hover` | #cedfc2 |
| Selected fill / border | `--ah-selected` / `--ah-selected-border` | #eef4e8 / #417655 |
| Strong fill (HARD mode) | `--ah-strong` | #294e40 |
| Decorative accent | `--ah-accent` | #d85836 |
| Keyboard focus | `--ah-focus` | #245eb3 |

Do not use orange as small text on cream without checking contrast. Food/artwork colors are activity-specific, not UI palette tokens.

## Type and spacing

Use `--ah-font` (rounded system fonts with Trebuchet/Arial fallbacks); do not download fonts. Body/action text is 16px; regular labels and supporting text are at least 14px. Only nonessential metadata may reach 12px. Headings may scale fluidly. Keep student-facing wording short.

Use 4, 8, 12, 16, and 24px spacing tokens as a baseline. Quantity dots sit close to their labels (2px padding plus the card gap), not at a distant card edge. Surplus card height surrounds centered content.

## Controls

| Purpose | Shared classes | Examples |
| --- | --- | --- |
| Neutral action | `ah-button` | Reset |
| Secondary action | `ah-button ah-button-secondary` | Share, Download photo |
| Icon action | `ah-button ah-button-icon` | Language, fullscreen, close, back |
| Selectable card | `ah-choice` | Sauce, topping |
| Difficulty | `ah-mode-toggle` and switch markup | EASY/HARD with command knob |

Actions use a thin 1px border and dark text. Secondary actions start a shade darker rather than using an unrelated solid fill. Choice cards retain a 2px border for selection clarity and use `--ah-radius-control` (12px) for rounded corners. Their corner radius belongs in the shared control rule, not in app or example overrides. Text buttons are pills; icon buttons have 12px corners; panels use roughly 20px corners.

### Behavior contract

- Default: light shade and visible border.
- Hover: darker shading and green border, only on devices supporting hover. Selected cards retain a distinct tinted hover state.
- Press/tap: deeper shade and subtle 0.98 scale, without reflow. The mode switch uses an inset stroke instead of scaling.
- Keyboard focus: 3px blue outline with 3px offset.
- Selected: green border plus tint and `aria-pressed`. Do not add selection checkmarks to choice buttons or swatches. Preserve quantity dots when they communicate an amount; selection must not add content or change button dimensions.
- Disabled: muted shading, no hover or press response. Use native `disabled`. For links, `aria-disabled` alone does not suppress activation; prevent navigation explicitly.
- Motion: 150ms control transitions. Reduced motion disables transitions and press scaling; activity animations also respect it.
- Touch: minimum 44×44 CSS pixels. Hover is optional feedback, never required.
- Use native buttons for actions, links for navigation/downloads, and checkbox switches for modes. Give icon-only controls accessible names and hide decorative art from screen readers.

## Shared header and icons

Left: textbook-back control, applet-specific mark (or the shared mark when none exists), activity title (Pizza Builder uses the bold, letter-spaced LITTLE PIZZA KITCHEN title). Right: language, EASY/HARD, textbook/unit info, fullscreen. Use 24px icons in 44px targets. Wrap on narrower screens instead of creating horizontal scroll. Back links to the relevant textbook section on the home page; disable it only when no real destination exists.

Reset uses `reset.svg`; photo preview/Share uses `camera.svg`. Both have a 24×24 viewBox, 1.8px rounded strokes, and similar drawing bounds; render them at the shared 24px icon size. Avoid font glyphs for these actions because their apparent size varies by platform.

Language uses similarly sized speech bubbles and matching strokes. Reuse the shared SVG rather than drawing a different icon for each app. EASY/HARD retains its command-symbol knob, wording, and shades.

## Layout and dialogs

Let tablet/desktop activities fill available height, preserving room for prompts and actions. Constrain geometry by both width and height. Phones, short windows, and enlarged text may scroll; never hide overflow to disguise clipping.

All native `<dialog>` elements must use `class="ah-dialog"` from `shared/controls.css`, including language, help, preview, and terms dialogs. It supplies the shared 20px panel radius, thin border, cream fill, 24px padding, dimmed backdrop, heading layout, and viewport-constrained scrolling. Use `.dialog-heading`, a labelled title, and a shared 44px close button with an accessible name. Preserve native focus handling and Escape dismissal. App CSS may adjust content-specific width or scrolling (such as license text), but must not duplicate the dialog frame. Check actual dialog opening in the interactive guide and every affected app when changing this component. Export artwork may use its own palette; surrounding controls remain shared.

## Review checklist

1. Reuse tokens, classes, icons, and header order.
2. Check default, hover, pressed, focus, selected, disabled, and reduced-motion states.
3. Check tablet portrait/landscape, desktop fullscreen, a narrow phone, and enlarged text.
4. Check long prompts and all selections, not only an empty activity.
5. Distinguish logic tests from real-browser visual verification.
6. Package `shared/` alongside `apps/`, preserving relative paths. Opening `apps/pizza/index.html` still works directly. Copying only the pizza folder no longer includes all UI assets.

## Current audit

Pizza Builder adopts shared controls for Reset, Share, download, language, fullscreen, both dialog-close buttons, textbook back link, sauce/topping cards, and the mode switch. The language bubbles are rebalanced. Old app-local hover/selected rules were removed. Behavior tests pass; physical-device visual verification remains outstanding.

## Interface languages

Language settings offer English and 日本語. Translate functional labels, mode wording, instructions, dialog messages, and accessible control labels. Keep lesson vocabulary and target English sentences unchanged. Use the shared translation helper and common dictionary; extend only app-specific strings locally. Japanese mode labels are かんたん / むずかしい. Allow wrapping instead of clipping Japanese instructions.

Default interface language follows the first supported browser/system language preference (including regional variants), falling back to English. The language menu allows a manual choice that is remembered locally across visits and applets.

Copyright uses the shared compact footer (`shared/copyright.js`) with a 12px text-only notice. Do not add a button or terms dialog to individual applets. Include its measured height in the viewport layout. The root home page links to the full terms.

Pizza Builder adds a LEARN/PLAY pill beside the first (sauce) heading, using the shared switch shape. PLAY disables the EASY/HARD switch in EASY state and explains this in its instructions. Editing actions reuse shared buttons; the piece picker provides access to overlapped pieces. The selection outline uses the focus-color token.

Pizza PLAY editing uses a vertical icon toolbar within the menu column, below the shared menu heading and to the left of the input panel, with a dedicated 44px lane and 12px separation. Order the vertical actions from top to bottom: larger (+), smaller (−), rotate left, rotate right, flip, duplicate, TOP, delete. Reuse the shared size, rotation, flip, duplicate, and delete SVGs with translated accessible labels/tooltips. Put the compact piece picker beside the PLAY topping heading, using the remaining row width and expose instructions through the info button beside LEARN/PLAY. Header controls may wrap on narrower screens.

The text-only footer attribution is `Let’s EiGo! © 2026 letseigo.com · All rights reserved.`; Japanese retains `Let’s EiGo!` and `letseigo.com` and translates the rights notice. Keep the domain as plain text in applet footers.

## Brand

Use **Let’s EiGo!** on the home page, in page titles, and in documentation. Applet headers display their activity name, without an additional site-brand line. Place the site brand unobtrusively before the copyright notice in the shared footer. Keep the shared palette and control styling; applets retain their own logos and browser-tab favicons. The repository name and internal `ah-`/`ActivityHubI18n` identifiers remain unchanged.

Homepage usage terms open in a native, scrollable dialog with a close button and Escape dismissal; closing returns focus to the opener. Applet footers remain text only. `LICENSE.txt` is authoritative: after editing it, run `node scripts/sync-license.cjs` to update the embedded homepage text. Embedding allows direct local opening without a network request. The license wording remains English; dialog controls support English/Japanese.

For unobtrusive text actions such as the homepage’s Use & copyright modal opener, use a native button with `ah-text-action`: underlined text with no filled background or border, a 44px touch height, and visible keyboard focus. Use actual links for navigation.

The Let’s Go–family paper-airplane logo lives in `shared/icons/site-mark.svg`: a light paper plane with dark-green outlines, a shaded fold, and an offset blue circle/ring on a transparent canvas. Use this SVG for the home page header and favicon, preserving its square aspect ratio. Its five named color variables keep the palette editable; inline SVG can inherit theme overrides, while external images/favicons use the defaults inside the SVG. Host-page CSS does not cross into an SVG loaded as an image. Applets should retain their own identity: Pizza Kitchen uses `apps/pizza/icon.svg` in its header and favicon. Store activity-specific marks with their applet; use the shared airplane only as a fallback when an applet has no mark. Use empty alt text beside a visible brand/activity title to avoid duplicate announcements.

Builder applets reuse the same shared controls, modal frames, and header ordering. Parfait uses an app-specific glass and fruit artwork; these do not redefine the shared control palette. Reusable behavior belongs to the builder engine described in WORKFLOW.md.

## Featured POST exception

By user request, `apps/post/` retains its independent stationery styling and formatting for now, including its header, controls, fonts, and footer. Its home-page feature follows this site guide. Unifying the app shell is deferred.

## Builder layout standards

Pizza and parfait use `body.ah-builder` and `shared/builder-layout.css` (after app styles, before controls). This owns header padding, logo size, navigation gaps, title/eyebrow/question typography, workspace gutters, panel padding, and section headings. Change common dimensions there rather than adding app overrides. Desktop headers use 6px vertical/24px horizontal padding; logos are 30px and control targets remain 44px. Main titles use 28–39px on tablet/desktop, the target question 22px, section headings 20px, and helper text 14px. Mobile layouts wrap and scroll.

Artwork stages remain app-specific. On tablet/desktop, Parfait reserves at least 40px below its heading and allocates spare viewport height above the glass for future decorative stacking. The workspace subtracts measured header/footer heights and vertical padding; long orders or enlarged text may naturally expand it. This spacing change does not implement above-rim ingredient placement, which still needs its own rendering update.

## Builder option panes

For crowded builders, use `shared/builder-panes.js` and `shared/builder-panes.css`. A `[data-builder-panes]` panel contains named `[data-builder-pane]` sections, a live `[data-pane-status]`, and shared 44px previous/next icon buttons in side rails. Arrows cycle through panes. Hidden panes retain their controls and selections but leave the tab order. Keep the panel footprint stable; allow scrolling on short screens or enlarged text. Page labels and accessible navigation names translate, while ingredient vocabulary stays English.

Parfait filling uses a restrained contrasting contour so pale cream stays visible against the glass. Decorative fruit rows use consistent orientation and even spacing rather than broad random rotation; strawberry points face upward. Layer ordering is content behind the glass outline, with the open rim allowing above-glass decoration.

Builders with a fixed set of ingredient slots follow the multiple-item selector standard below. Ingredient paging is separate from slot swapping; give paging and swap controls distinct accessible names. Keep lesson output in English with natural wrapping.

Creative builder palettes may opt into `shared/builder-create.css` using `.is-create` on the workspace. In landscape use a bounded icon-only palette with at least 44px touch targets; portrait places the compact tray below the artwork. Hide labels visually, preserve accessible names, and retain the piece picker. Pizza calls this mode PLAY; internal free-mode identifiers remain for compatibility. LEARN retains labelled choices.

Keep the activity title and eyebrow visible above the choices in both LEARN and PLAY. The target-language question stays above the artwork. Budget compact choice heights for the visible menu heading.

In both LEARN and PLAY, place Reset/Share permanently after the ingredient sections in the menu. Give both buttons equal flexible widths so together they fill the panel’s inner width, with an 8px gap. Preserve the neutral Reset and secondary Share styling and minimum 44px touch height. The canvas has no action row. Pizza implements the common action-row sizing in shared/choice-pager.css, without mode-specific width overrides.

The landscape PLAY palette scales ingredient buttons from 52–84px tall and artwork from 36–56px using viewport height minus measured header/footer space. Size the palette within a stable mode-independent menu column; Pizza’s dimensions are specified below. Portrait keeps its compact tray.

Pizza keeps LEARN/PLAY and its info control at the right of the first sauce heading in both modes. PLAY section titles are “1 Sauce” and “2 Toppings” (translated as interface text); LEARN retains the full instructions. The compact sidebar accommodates that header in one row, and portrait uses full-width sections in the bottom tray.

For long ingredient lists, use `shared/choice-pager.js` and `.css`: keep each section heading visible and page its existing choice buttons in groups of three with 44px side arrows and a page indicator. Unlike whole-section panes, this keeps sauce and toppings together. Hidden choices retain their state and leave keyboard navigation; arrows wrap. Pizza displays all nine toppings in a three-column, three-row grid in both LEARN and PLAY, without paging arrows or a page indicator. Paged layouts remain available for other builders and the Lab.

Pizza places its eyebrow and activity title above the right-hand buttons panel in both LEARN and PLAY. The English question stays above the pizza. On narrow screens the intro stays with the menu as the columns stack.

## Responsive layout policy (all builders)

Load `shared/builder-workspace.css` last, after app geometry and card sizing, and load `shared/builder-workspace.js` after builder initialization. These own final layout for Pizza, Parfait, Sandwich, and future builders.

At 740 CSS px wide and 600px tall or larger, including portrait iPads, use a single-screen two-column workspace. Subtract measured header/footer heights from `100svh`; reserve 10px vertical padding, a 16px column gap, and a choices column of at least 350px (otherwise 42%). Keep choices top-aligned. Compact cards use 68px LEARN and 46px PLAY minimum heights with 44px touch targets. Do not scale down the whole interface or hide overflowing controls. Normal tablet/desktop use should require no page scrolling; exceptional enlarged text or unusually long content may scroll inside the bounded choices/output region.

The activity column has a 44px question row, a flexible but sentence-independent play frame, and a fixed 140px output box with 8px gaps. All builders use the same frame sizing; each illustration retains its proportions inside it. Changing ingredients, sentence length, difficulty, or LEARN/PLAY mode must not resize the artwork. Only viewport geometry may resize the frame. Keep portrait browser-chrome changes from repeatedly scaling the scene by using stable viewport units.

Style the output box consistently across all builders with `--ah-surface`, a 1px `--ah-divider` border, `--ah-radius-panel` corners, and 10px vertical / 12px horizontal padding. Keep padding and border inside its fixed 140px height so the artwork does not lose space. The shared workspace stylesheet owns this treatment.

Reserve approximately three spoken-text lines in the output box. Fit sentence text from 21px down to 16px when needed, restoring 21px for shorter text. Never shrink touch targets, truncate sentences, or let the output borrow stage height. If exceptionally long text still does not fit, allow keyboard-accessible internal scrolling at the minimum size. Keep the speaker and vocabulary playback controls functional.

The bordered output box provides visual separation: do not add decorative quotation marks around builder results. Keep ordinary sentence punctuation, pronunciation controls, and Sandwich initials intact. This applies to the Lab and all production builders.

Below either threshold, stack activity above controls with a stable 404px play frame and the same reserved output box. Keep `data-jump-section` hooks and `shared/builder-jump.js` for keyboard-accessible section navigation. Move the existing PLAY toolbar horizontally above the output in stacked layouts; keep it vertically beside the choices in tablet/desktop layouts. Never duplicate controls. Test landscape 1024×768/1133×744, portrait 744×1133/768×1024, desktop 1366×768, phones, enlarged text, and long content in all three builders.

## Numbered section headings

Use `ah-section-number` from shared/controls.css for numbered activity sections: a dark green circle with a bold white number (30px normally, 26px for compact/tablet layouts). Pair it with heading text using `ah-section-heading`, or an existing flex heading with an 8–10px gap. Use real `legend` or heading elements, with the number in its own span so translation never removes it. Keep numbering stable across option pages and modes. Section numbers describe steps/categories, not changing layer or page counts. Pizza uses 1 Sauce / 2 Toppings; parfait uses 1 Ice cream / 2 Choose some fruit / 3 Syrup. Reuse this component in future applets with numbered sections; do not create app-local badge styles.

PLAY uses English count-and-size language (small/medium/big), independent of LEARN’s EASY/HARD wording. Piece touch areas grow with their artwork and retain a 44px minimum. Size words describe relative ingredient size, not identical pixel dimensions across different foods.

PLAY touch editing uses one finger to move a piece and two fingers on that piece to resize it. Keep the +/− controls as an accessible alternative; rotate and flip remain explicit toolbar actions. Pinching respects the same size limits and size labels as the toolbar. In PLAY, reserve native touch gestures on the artwork canvas for editing; preserve page scrolling outside it. Start on a piece, then place the second finger anywhere on the canvas to resize that piece.

Tablet/desktop geometry for all builders is owned by the responsive policy above. App layout files retain food-specific drawing geometry, but must not independently size the stage from output height or override the final shared workspace.


## Stable mode layout and review

Changing interaction mode should not move the main question or menu title, or
change the canvas width merely to accommodate tools. Reserve editing tools
inside the choices column and center the menu title over the whole column.
Keep long text and enlarged interface fonts free to expand vertically.

When changing a dimension, remove superseded declarations rather than stacking
more overrides. Check both modes at identical viewport sizes and inspect the
winning CSS rule when only one mode changes. Use shared controls unchanged;
keep food geometry and app-specific menu sizing in the app layout file.

In stacked phone/short-window layouts, move the same editing toolbar below the artwork and above its order sentence. Lay its 44px buttons out horizontally, centered, wrapping on narrow phones. Restore the vertical menu-side placement in landscape, aligned to the panel’s top edge rather than vertically centered. Move existing controls rather than duplicating them so state, focus order, and listeners stay consistent.

Creative movement bounds belong to the activity play area, not necessarily the food silhouette. Pizza PLAY permits crust overlap within the rectangular stage; fixed photo framing may crop placements beyond the photo edges. Keep LEARN’s preset placement rules independent.

Mode help must describe the currently selected mode: update its dialog title, instructions, and info-button accessible label together. Translate these interface strings without changing lesson vocabulary or activity state.


Panel padding must not change with LEARN/PLAY mode. The final shared workspace uses a uniform 10px inset on tablet/desktop; the 14px app default below applies outside that compact workspace. Pizza uses one
`--builder-panel-padding: 14px` value in `apps/pizza/layout.css` on all sides,
in both landscape and stacked layouts. The first heading row uses an 8px gap
and 10px bottom margin in both modes; the toggle/help pair retains its shared
6px gap and 44px targets. Compact mode may change choice artwork and card
spacing, but must not alter the panel's outer inset or shift its header controls.
Future builders should likewise define panel padding once, outside mode rules.

Parfait follows the shared workspace dimensions. Its title sits above choices, the question above the glass, and Reset/Share fill the menu action row. Keep paired fruit slots and all ingredient sections on one panel.

For four short base choices, opt into `four-choice-row` from shared/choice-row.css (after app layout). Use four equal cards with artwork above wrapping 14px labels and an 8px gap. At widths of 380px or less, use two columns. Pizza sauces and Parfait ice cream/syrups use this pattern; Pizza PLAY retains accessible labels while displaying icons only.

### Multiple-item selectors

Use this pattern whenever a builder offers two or more explicit item slots, including Parfait’s fruit pair and Sandwich’s three fillings.

- Show ingredient artwork only, with no visible slot numbers, names, plus signs, or placeholder text. Empty slots show an upright grey circle/slash symbol. Use the configured ingredient artwork and orientation.
- Use shared `ah-choice` styling and `aria-pressed` to identify the selected slot. Give each slot an accessible name containing its position and current ingredient, or a translated empty-slot instruction.
- Keep slots equal-width with a 48px minimum height and approximately 36px artwork. Place a shared-style 44px swap button with opposing arrows between every adjacent pair, with 8px gaps. Three slots therefore have two swap buttons. Preserve touch targets on narrow screens rather than shrinking them.
- Label each swap accessibly with its affected positions (for example, “Swap fillings 1 and 2”); the two-slot case may use “Swap fruit choices.” Translate control labels and announcements, while ingredient vocabulary remains English.
- Keep selection, keyboard focus, disabled states, and clear controls visible and usable. Interaction and state-preservation requirements belong to the multiple-item selector contract in WORKFLOW.md.

Parfait uses this standard for its two fruit slots.

Filled item slots expose a simple dark-green × clear button in the upper-right corner, without an enclosing circle. Use `ah-button slot-clear` from shared/controls.css: 22px × glyph, `--ah-strong` color, transparent background, 44px hit target, and shared hover/pressed/focus feedback. The glyph is aria-hidden; give the button a translated slot-specific accessible label. Keep it a sibling of the selection button, never a nested button. Hide it for empty slots and return focus to the cleared slot. Parfait and Sandwich both use this shared treatment; do not override it per app.

Parfait shows all nine fruit choices in a three-by-three grid without paging arrows or page status. Preserve both editable fruit slots in LEARN. Ice cream and syrup stay on the same panel; retain shared button sizing.

Paired-fruit choice icons and selected-slot previews use the same configured rotation as placed fruit. Keep the angle in ingredient configuration rather than duplicating per-fruit CSS. Empty-slot icons remain upright.

Parfait now provides LEARN/PLAY and contextual help beside its first heading, with HARD disabled. PLAY displays all fruit icons and a piece picker, hides paired slots, and uses the same landscape/stacked toolbar placement as Pizza. Share is available in both modes.

Parfait LEARN places the selected fruit pair and swap control on the “Add fruit” heading row. Allow wrapping only when narrow screens or enlarged text need it.

Parfait PLAY uses short section titles (Flavor, Fruit, Syrup) and picture-only flavor, fruit, and syrup choices. Hide choice text visually while keeping accessible names; LEARN retains instructional headings and vocabulary labels.

Both builders load shared/builder-card-sizing.css after app geometry and choice-row styles. It owns compact/growing card dimensions: LEARN 88–112px, PLAY 52–84px, PLAY artwork 36–56px. Use the same 6px fruit-grid gaps, 14px panel inset, 8px heading gap and 10px heading bottom margin. Landscape growth budgets for actual card rows (Pizza PLAY four, Parfait PLAY five); stacked layouts use compact minimums. Content can exceed these minimums for long labels or enlarged text. Do not add independent app-specific height formulas.

In Parfait PLAY, place the piece picker beside the Fruit heading, using the remaining width without wrapping the heading row. Preserve the accessible picker label. LEARN continues to show its paired slots in that row.

## PLAY list and visual stacking

The picker reads from back to front: item 1 is behind item 2, and so on. Preserve this relationship even when ingredient types repeat. Selection highlights a piece without changing its depth. Explicit category grouping is allowed (scoops before fruit), but items within each category retain their creation order. Previews and exports must look consistent with the editor. Implementation and verification requirements are owned by the Builder PLAY stacking contract in WORKFLOW.md.

LEARN four-choice cards use 6px vertical padding and a 3px artwork/label gap; scoop icons are 32px. Long flavor labels can still increase row height rather than shrinking vocabulary text. Paired fruit selectors use a 48px minimum height, distinct from ingredient cards. PLAY retains its shared responsive artwork sizing.

The shared PLAY toolbar includes TOP (shared/icons/top.svg) after Duplicate. It brings the selected piece to the front of its category and updates its picker position; scoops cannot cross in front of fruit. Use a translated accessible name and tooltip, and disable it when nothing is selected.

Parfait now includes Share beside Reset with equal flexible widths, using the shared camera icon, secondary button, and photo-preview dialog. Photo captions retain English target sentences; dialog controls translate.

## Pronunciation in builder results

Place a shared-style 44px speaker button beside the order sentence. Render ingredient names as inline buttons with inherited English sentence typography and a subtle dotted underline; keep complete vocabulary phrases together as one playback target. Preserve visible keyboard focus, a minimum 44px target height, and natural wrapping on smaller screens. Load `shared/pronunciation.css` in both builders. Translate playback control labels and errors, never the spoken lesson text. Unsupported browsers retain plain result text and a disabled speaker with an explanatory accessible label.

The language dialog includes a “Default voice” labelled native select and a shared “Try voice” button for pronunciation-enabled builders. Show Automatic and a distinct Device default (English) option, plus at most three recommended English voices: Google US English and up to two standard alternatives. Include language/accent code and translated on-device/online labels; omit novelty voices. Preserve 44px controls, shrink the select within the dialog, and translate helper/error text. Voice selection and preview never alter the English order or ingredients.

Pronunciation diagnostics appear only in voice settings; keep the artwork/order area free of playback messages. In settings, show immediate starting feedback and browser-reported playback status; these events do not prove the user heard sound. The preview uses secondary button styling and a persistent active treatment while speech is pending/playing. Deduplicate identical voice labels to avoid confusing device voice lists.

Use stable small-viewport height (`svh`) for builder fit budgets and card growth so mobile browser chrome cannot resize the activity during scrolling. The final shared workspace sizes the Parfait stage proportionally inside the same stable frame as Pizza and Sandwich. Keep the iPad Silent Mode note in pronunciation settings.

Recorded vocabulary uses the existing inline pronunciation buttons without changing sentence text or layout. Voice settings explain that device voice choices affect sentences and unrecorded words; recorded vocabulary retains its approved voice. Keep that explanation translated.

The English target question is also a native inline pronunciation button, using the same dotted underline, focus treatment, and minimum target height as vocabulary. Keep heading typography and play the approved question recording on tap.

Homepage applet cards—including featured applets—use a compact square preview column capped at 260px, with the remaining width assigned to the text column. Use 20px card padding, a 24px column gap, and 16px preview corners. At 620px and below, stack the card with a centered preview capped at 220px and a 20px gap. Images use proportional containment; never stretch artwork or enlarge the preview to match text height. Text may grow independently.

Sandwich shows all 16 LEARN fillings in four columns by four rows, with no paging arrows or page indicator. This is app-specific, not a new universal paging standard.

Sandwich prototype uses three icon-only editable filling slots with adjacent swap arrows and a source selector that appears for the active LEARN filling. Keep source labels readable, use native 44px selects, and preserve the selection when moving between slots. Its side-view food geometry is app-specific; shared typography, panel padding, paging, mode toggle, toolbar, and modal standards still apply.

### Builder choices-column alignment

The direct `#builder > [data-jump-section="choices"]` column is top-aligned using shared/builder-layout.css in LEARN and PLAY. Do not vertically center it to match the artwork or changing order text. Stacked layouts use horizontal auto margins only, not vertical auto margins. Keep the menu heading 12px above the panel; the vertical PLAY toolbar aligns with the top edge of the adjacent panel in landscape. Every builder, including Sandwich, loads shared/builder-card-sizing.css and declares its visible LEARN/PLAY row counts instead of setting separate card-height rules. Sandwich uses four LEARN rows and four PLAY rows, with editable bread beside the piece picker. Final workspace padding and toolbar spacing follow the responsive policy above.

Compact PLAY palettes must not inherit LEARN-sized whitespace. Use shared/builder-card-sizing.css for both modes. Default PLAY padding is 6px with 52–84px card growth; dense palettes may opt into `--play-choice-padding` and `--play-choice-max` while retaining the shared 52px minimum and 44px touch targets. Sandwich’s PLAY palette has 16 fillings in four columns and four rows, with bread separately beside the piece picker. Its icon-only cards use 72px minimum height, 4px padding, and artwork up to 64px wide, larger than LEARN. This app-specific layout is pending review before generalization. Check compact and tall landscape screens as well as stacked layouts when adding a builder.


## Non-live Builder reference candidate

`_dev/builder/index.html` demonstrates the current shared workspace plus a candidate composition of slot selectors, four-across paged quantity buttons, a dropdown, Reset/Share, and a four-column PLAY palette. It is a review surface, not automatic approval of new universal dimensions. Its README tracks unresolved sizing, overflow, artwork-bounds and component-adoption decisions. Promote approved changes here and into shared code with the workflow’s explicit consumer rollout; keep unapproved experiments scoped to the lab.

The Lab’s LEARN choice grids follow Sandwich’s 20% artwork enlargement at the tablet/desktop breakpoint (740×600 CSS px), retaining the 36px layout box and existing card heights. Apply artwork sizing/transforms to the direct root SVG (`.ingredient-art > svg`), not every descendant SVG: nested ingredient fragments must retain their configured dimensions. Check both slot-choice and quantity-choice cards, including labels, quantity dots and edge clipping. Slot previews and PLAY sizing are independent. This is implemented in the Lab and Sandwich; further rollout requires explicit migration.

Keep the textbook/unit label (`.edition`) visible in tablet/desktop builder headers, including the compact workspace. Use the actual textbook/unit in lesson applets and “TEXTBOOK NAME · Unit 0” in the Lab. Header wrapping is measured by the shared viewport script; do not hide lesson context to force a single header row. The existing phone breakpoint may hide the label.

## Shared play surface and PLAY bounds

All builders and the Lab use the same borderless tan `--ah-play-surface` (#eee6d2) on `.builder-play-area`, with the shared panel corner radius. The visible surface is the full shared frame, not the food silhouette. Keep its dimensions independent of sentences and mode. Artwork stays proportional inside it; food-specific Share scenery remains unchanged.

PLAY uses that frame for movement, converting its rectangle to the app’s existing scene coordinates. Keep the visible artwork’s center at least 22px inside the frame; allow edge overlap, clipped at the frame, rather than constraining large pieces fully inside the food. Rotation/flip offsets must be included. Recheck positions when the frame resizes.

Measure the root SVG’s visible geometry for PLAY selection and hit areas, with a small margin and a 44px minimum touch target. Transform the hit area with the artwork. Do not use the full square SVG canvas for a flat ingredient or change illustration/export coordinates to trim it. Re-measure when rendered art changes, including syrup on scoops; duplicate pieces need their own hit elements.


### Unified PLAY palette sizing

All builders and the Lab now use the shared `builder-card-sizing.css` values: 72px minimum card height, 4px padding, and 64px artwork boxes, capped to available card width without stretching. Apply this to ingredient, flavor and sauce choices. Sauce bowls retain their non-square proportions. LEARN sizing remains independent. Do not override PLAY icon sizes in compact workspace rules or duplicate these dimensions in app CSS; applets still own grid column counts. Keep root-SVG-only sizing to avoid changing nested artwork. This supersedes the older 32–56px PLAY artwork ranges and Sandwich-only sizing exception above.

Builder button panels use the shared surface fill, thin divider border, and rounded corners without a drop shadow or raised lower edge. Apply this flat panel treatment to the Lab and all Builder applets; food artwork and photo previews may retain their own shadows.

Mode switches must not change food scale: Pizza uses the full available square in both LEARN and PLAY. Remove legacy mode-specific board dimensions and workspace grid-row overrides rather than allowing them to defeat the final shared frame rules.

Mode-stable artwork also requires identical internal drawing coordinates, not just equal CSS boxes. Check SVG viewBoxes, root transforms, background-image sizing and permanent scene elements across LEARN/PLAY. Sandwich live bread use the same unscaled coordinates in both modes; only its Share renderer may apply the compact photo transform. Keep upper artwork within the viewBox rather than shrinking the whole LEARN scene.

The homepage closing note and terms link belong in a dedicated footer after the main activity directory, never between textbook sections. Align its width and horizontal padding with the directory; keep it in normal document flow. Separate adjacent textbook sections with 40px of space.

Builder headings show the activity title and target question without extra eyebrow captions such as “Made by you” or “You’re the chef!”. Apply this to the Lab as well; retain textbook/unit context in the header.

Builder section headings use shared/builder-layout.css: 18px bold text with 1.3 line height in both LEARN and PLAY, at every viewport size. Apply the same typography to h2, legend, and labelled .ah-section-heading controls (including the Lab dropdown). Do not add app- or mode-specific heading font sizes; numbered badges retain their shared sizing.

The EASY/HARD switch uses shared/icons/command.svg at 24 × 24px inside the centered knob. Do not use the ⌘ text glyph: platform font metrics can shift its visible alignment. Keep the image decorative and the native switch accessibly labelled.

App state autosaves locally without a toggle or repeated save messages. Reset remains the way to start over; keep its existing active-mode behavior. Do not reopen dialogs or resume audio automatically when restoring a saved activity.

Home-screen shortcuts use the shared site airplane by default, while browser-tab favicons and applet header marks keep their own artwork. Keep each applet’s `rel="icon"` pointed at its app-specific asset; never replace it when updating `apple-touch-icon` or manifest icons. Every app entry includes shared/icons/apple-touch-icon.png (180px) and its own manifest referencing shared 192px/512px PNGs. Keep shared/icons/site-mark.svg as the editable master; regenerate the PNGs after palette/geometry changes. Manifests retain app-specific names and launch URLs and use browser display mode; this icon convention does not imply offline support or change navigation.

App-link sharing uses a QR icon button immediately after Language in the header, with a translated accessible label. Use shared/page-qr.js and shared/page-qr.css for the native dialog, black-and-white airplane QR, PNG download and Copy link. Show the public entry URL and keep the QR square with a four-module quiet zone. Keep image/creation Share actions separate. POST follows the same Language-then-QR header order, alongside a homepage back link. Its language dialog explains that its card editor remains English; card text is never translated. The local Lab uses an explicitly labelled homepage demonstration.

QR dialog actions use the short labels “Download” and “Copy”, with a decorative download arrow or overlapping-sheets icon on the left, using the same shared button spacing as Reset/Share.

The homepage header ends with a rounded-square saved-avatar button after Language and QR. The avatar fills the button’s interior with no padding and follows its shared rounded corners. The larger Profile dialog avatar also uses a rounded-square crop with the shared control radius. Both previews show the artwork at 110% scale, anchored at the top center so the top stays visible and the extra height crops at the bottom. Use the shared grey profile silhouette when no valid local avatar is available. It opens a Profile dialog with the current selfie, a locally saved Name field, and an Edit Selfie action with a small Polaroid icon at the bottom linking to the avatar builder.

## My Blog writing and snapshots

Place native text inputs inline in the English sentence frames, with subtle underlines, visible focus and at least 44px touch height. Keep the right panel for photos and basic controls, including the usual Reset/Share pair. On small screens, use Post/Photos navigation. Display the saved homepage profile name beside the avatar; use “My blog” when absent. Share previews a compact webpage-style PNG with a small browser bar, profile, images and full sentences, using the shared dialog frame rather than the Builder Polaroid composition.


## Object color controls (Class Supplies reference)

For builders with individually recolorable objects, use native, keyboard-accessible scene selection and show the selected object's artwork in a dashed preview beside labelled color swatches. Fixed scene objects may also be selectable without becoming draggable. Use the shared numbered section heading and `ah-choice` swatch buttons, with accessible color names and `aria-pressed`; selection follows the shared border/tint treatment without checkmarks. Keep targets at least 44px. In narrow panels, wrap the preview above the swatches and allow heading controls to wrap rather than clipping or shrinking targets. Class Supplies uses two rows of five colors; palette size and color availability by difficulty remain app-specific.

Review artwork outlines at their actual default scene size, especially after resizing individual SVGs. Use one per-item size definition for matching LEARN and newly added PLAY artwork; palette thumbnails may use the shared independent card dimensions. Keep outline and detail weights visually consistent across objects, while manual PLAY scaling naturally scales the artwork.

Class Supplies is the current reference for these patterns, not a shared color-control component or a requirement to add recoloring to other builders.


### Share photo download action

Center a content-width Download button below the photo with a 12px top gap. Apply `builder-photo-preview` to the photo so shared styling removes competing bottom margins. Use `ah-button ah-button-secondary builder-photo-download` from shared/controls.css and the decorative shared/icons/download.svg icon, matching the QR modal. Put the translated “Download” label in a child span so translation preserves the icon. Keep the link hidden until the image is ready, retaining the app's filename and download behavior. Pizza, Parfait, Sandwich and Class Supplies use this pattern.

Pizza, Parfait, Sandwich and Class Supplies use fixed square Share framing across modes. Preserve per-piece transforms within that frame; crop overflow rather than automatically zooming out for PLAY. Parfait export coordinates are normalized rather than measured from the current viewport.

Junior-high My Blog lessons use a full-width title field and multiline body instead of inline sentence blanks. Put a compact Sample button beside the activity heading. Its native shared-style dialog contains a readable webpage-style sample with title, author and paragraphs; retain internal scrolling, selectable English text, Escape dismissal and focus return. NH1-5 opts into Write/Photos/Design tabs at every size: keep photos out of Write, preserve internal text-field scrolling, and put Share below the panels. NH1-5 omits whole-post Reset; its Design panel has Reset layout with the shared reset icon, preserving all text/photos. Put selection instructions in a shared help dialog opened by the labelled info button beside Arrange your post. Design uses three columns with selectable blocks, a Builder-style rail of 44px movement and size buttons, 1–3 column widths and Short/Medium/Tall photo heights. Text grows automatically. Design hides profile/name and title to concentrate on arranging blocks; retain them in Write and Share. Fit the compact preview to the available width and height while retaining usable selection targets; very tall layouts can scroll internally. Use an element picker in the editing panel, and disable toolbar actions at their limits. Always include all source elements; editing text and deleting photos belong to Write and Photos. On phones, place the horizontal editing rail and scrollable controls beneath the scrollable design preview.

JHS My Blog Share keeps variable-height webpage artwork. Use a focusable scrolling preview region inside the shared dialog; keep the heading/status and centered shared Download action outside that region. Do not force square framing. My Blog keeps textbook/unit labels visible at all breakpoints.

JHS My Blog navigation uses a tab strip, not pill action buttons: rounded upper corners, a baseline, muted inactive tabs and a surface-filled active tab with a green top indicator. Retain native tab semantics, arrow-key navigation and inset visible focus.
