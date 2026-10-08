# Let’s EiGo! style guide

Version 0.1 — a living guide based on Pizza Builder. Revise this guide and the shared styles together as the collection develops.

## Source of truth

- `shared/tokens.css`: palette, typeface, spacing, sizes, radii, and motion duration.
- `shared/controls.css`: buttons, choices, and EASY/HARD switch.
- `shared/icons/`: balanced language, Reset, and camera icons.
- `docs/style-guide.html`: working examples using the same styles as the app.

Load tokens, app base styles, shared builder chrome, shared controls, then optional shared layout components and shared responsive policy. A documented app geometry file may follow the responsive policy, scoped to its app and matching the same breakpoints. App styles own layout and activity artwork; shared styles own control appearance and states. Reuse the shared classes instead of copying button rules into each applet.

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
- Selected: green border plus tint, `aria-pressed`, and visible checks/dots where appropriate. Do not rely on color alone.
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

Default interface language follows the first supported browser/system language preference (including regional variants), falling back to English. The language menu still allows a manual choice for the current visit.

Copyright uses the shared compact footer (`shared/copyright.js`) with a 12px text-only notice. Do not add a button or terms dialog to individual applets. Include its measured height in the viewport layout. The root home page links to the full terms.

Pizza Builder adds a LEARN/PLAY pill beside the first (sauce) heading, using the shared switch shape. PLAY disables the EASY/HARD switch in EASY state and explains this in its instructions. Editing actions reuse shared buttons; the piece picker provides access to overlapped pieces. The selection outline uses the focus-color token.

Pizza PLAY editing uses a vertical icon toolbar within the menu column, below the shared menu heading and to the left of the input panel, with a dedicated 44px lane and 12px separation. Order the vertical actions from top to bottom: larger (+), smaller (−), rotate left, rotate right, flip, duplicate, delete. Reuse the shared size, rotation, flip, duplicate, and delete SVGs with translated accessible labels/tooltips. Put the compact piece picker beside the PLAY topping heading, using the remaining row width and expose instructions through the info button beside LEARN/PLAY. Header controls may wrap on narrower screens.

The text-only footer attribution is `Let’s EiGo! © 2026 letseigo.com · All rights reserved.`; Japanese retains `Let’s EiGo!` and `letseigo.com` and translates the rights notice. Keep the domain as plain text in applet footers.

## Brand

Use **Let’s EiGo!** on the home page, in page titles, and in documentation. Applet headers display their activity name, without an additional site-brand line. Place the site brand unobtrusively before the copyright notice in the shared footer. Keep the shared palette and control styling; applets may have their own logos and favicons. The repository name and internal `ah-`/`ActivityHubI18n` identifiers remain unchanged.

Homepage usage terms open in a native, scrollable dialog with a close button and Escape dismissal; closing returns focus to the opener. Applet footers remain text only. `LICENSE.txt` is authoritative: after editing it, run `node scripts/sync-license.cjs` to update the embedded homepage text. Embedding allows direct local opening without a network request. The license wording remains English; dialog controls support English/Japanese.

For unobtrusive text actions such as the homepage’s Use & copyright modal opener, use a native button with `ah-text-action`: underlined text with no filled background or border, a 44px touch height, and visible keyboard focus. Use actual links for navigation.

The original paper-airplane logo lives in `shared/icons/site-mark.svg`. Use this SVG for the home page header and favicon, preserving its square aspect ratio and orange palette. Applets should retain their own identity: Pizza Kitchen uses `apps/pizza/icon.svg` in its header and favicon. Store activity-specific marks with their applet; use the shared airplane only as a fallback when an applet has no mark. Use empty alt text beside a visible brand/activity title to avoid duplicate announcements.

Builder applets reuse the same shared controls, modal frames, and header ordering. Parfait uses an app-specific glass and fruit artwork; these do not redefine the shared control palette. Reusable behavior belongs to the builder engine described in WORKFLOW.md.

## Featured POST exception

By user request, `apps/post/` retains its independent stationery styling and formatting for now, including its header, controls, fonts, and footer. Its home-page feature follows this site guide. Unifying the app shell is deferred.

## Builder layout standards

Pizza and parfait use `body.ah-builder` and `shared/builder-layout.css` (after app styles, before controls). This owns header padding, logo size, navigation gaps, title/eyebrow/question typography, workspace gutters, panel padding, and section headings. Change common dimensions there rather than adding app overrides. Desktop headers use 6px vertical/24px horizontal padding; logos are 30px and control targets remain 44px. Main titles use 28–39px on tablet/desktop, the target question 22px, section headings 20px, and helper text 14px. Mobile layouts wrap and scroll.

Artwork stages remain app-specific. On tablet/desktop, Parfait reserves at least 40px below its heading and allocates spare viewport height above the glass for future decorative stacking. The workspace subtracts measured header/footer heights and vertical padding; long orders or enlarged text may naturally expand it. This spacing change does not implement above-rim ingredient placement, which still needs its own rendering update.

## Builder option panes

For crowded builders, use `shared/builder-panes.js` and `shared/builder-panes.css`. A `[data-builder-panes]` panel contains named `[data-builder-pane]` sections, a live `[data-pane-status]`, and shared 44px previous/next icon buttons in side rails. Arrows cycle through panes. Hidden panes retain their controls and selections but leave the tab order. Keep the panel footprint stable; allow scrolling on short screens or enlarged text. Page labels and accessible navigation names translate, while ingredient vocabulary stays English.

Parfait filling uses a restrained contrasting contour so pale cream stays visible against the glass. Decorative fruit rows use consistent orientation and even spacing rather than broad random rotation; strawberry points face upward. Layer ordering is content behind the glass outline, with the open rim allowing above-glass decoration.

Paired-layer builders replace quantity dots with two explicit selectable slots and separate previous/next layer controls. The selected slot uses shared choice styling; fruit cards indicate membership in the current row. Keep dialogue and order summaries in English with preserved line breaks. Translate editing controls. Option-pane arrows and layer arrows must retain distinct accessible names.

Creative builder palettes may opt into `shared/builder-create.css` using `.is-create` on the workspace. In landscape use a bounded icon-only palette with at least 44px touch targets; portrait places the compact tray below the artwork. Hide labels visually, preserve accessible names, and retain the piece picker. Pizza calls this mode PLAY; internal free-mode identifiers remain for compatibility. LEARN retains labelled choices.

Keep the activity title and eyebrow visible above the choices in both LEARN and PLAY. The target-language question stays above the artwork. Budget compact choice heights for the visible menu heading.

In both LEARN and PLAY, place Reset/Share permanently after the ingredient sections in the menu. The canvas has no action row.

The landscape PLAY palette scales ingredient buttons from 52–84px tall and artwork from 36–56px using viewport height minus measured header/footer space. Size the palette within a stable mode-independent menu column; Pizza’s dimensions are specified below. Portrait keeps its compact tray.

Pizza keeps LEARN/PLAY and its info control at the right of the first sauce heading in both modes. PLAY section titles are “1 Sauce” and “2 Toppings” (translated as interface text); LEARN retains the full instructions. The compact sidebar accommodates that header in one row, and portrait uses full-width sections in the bottom tray.

For long ingredient lists, use `shared/choice-pager.js` and `.css`: keep each section heading visible and page its existing choice buttons in groups of three with 44px side arrows and a page indicator. Unlike whole-section panes, this keeps sauce and toppings together. Hidden choices retain their state and leave keyboard navigation; arrows wrap. Pizza uses six-choice paging (two rows of three) in LEARN, reserving both rows on the final three-choice page; PLAY displays all nine compact topping icons in a three-column grid, without paging arrows or a page indicator. Returning to LEARN restores its previous page.

Pizza places its eyebrow and activity title above the right-hand buttons panel in both LEARN and PLAY. The English question stays above the pizza. On narrow screens the intro stays with the menu as the columns stack.

## Responsive layout policy (all builders)

Load `shared/builder-responsive.css` after shared layout components; only documented app geometry exceptions (Pizza `layout.css`) follow it. Prefer a single-screen, side-by-side workspace in landscape at least 900 CSS px wide and 600px tall (including iPad mini-class landscape). Budget using measured header/footer height and keep 44px targets. Avoid page scrolling where content fits; long orders, enlarged text, or translated content may still scroll instead of clipping. Never force fit by hiding overflow.

Portrait tablets, phones, and shorter/narrower windows stack activity first, controls second. Use `data-jump-section="activity"` and `"choices"` with `tabindex="-1"`, and load `shared/builder-jump.js`. A discreet bottom-edge control jumps between sections, moves keyboard focus, translates its label, and respects reduced motion. Reserve bottom space and safe-area insets so it cannot cover final controls. No automatic scrolling on mode/orientation changes. This applies to both pizza and parfait; verify landscape 1024×768/1133×744, portrait 768×1024, phones, enlarged text, and long content.

## Numbered section headings

Use `ah-section-number` from shared/controls.css for numbered activity sections: a dark green circle with a bold white number (30px normally, 26px for compact/tablet layouts). Pair it with heading text using `ah-section-heading`, or an existing flex heading with an 8–10px gap. Use real `legend` or heading elements, with the number in its own span so translation never removes it. Keep numbering stable across option pages and modes. Section numbers describe steps/categories, not changing layer or page counts. Pizza uses 1 Sauce / 2 Toppings; parfait uses 1 Ice cream / 2 Fruit layers / 3 Syrup. Reuse this component in future applets with numbered sections; do not create app-local badge styles.

PLAY uses English count-and-size language (small/medium/big), independent of LEARN’s EASY/HARD wording. Piece touch areas grow with their artwork and retain a 44px minimum. Size words describe relative ingredient size, not identical pixel dimensions across different foods.

PLAY touch editing uses one finger to move a piece and two fingers on that piece to resize it. Keep the +/− controls as an accessible alternative; rotate and flip remain explicit toolbar actions. Pinching respects the same size limits and size labels as the toolbar. In PLAY, reserve native touch gestures on the artwork canvas for editing; preserve page scrolling outside it. Start on a piece, then place the second finger anywhere on the canvas to resize that piece.

In landscape, both Pizza modes use the same bounded 420–444px menu column. LEARN fills it, keeping “Choose a sauce” beside the mode toggle and help control on standard landscape screens; PLAY divides it into a 44px toolbar, a 12px gutter, and its compact input panel. The menu heading spans the full column. The pizza, question, and order retain the same column and stage sizing across modes (long order text may still require more space). Use 14px panel padding and a 32px menu title, retaining labelled choices, two rows of three toppings, and 44px navigation targets. Keep this activity-specific sizing in Pizza `layout.css`, loaded after shared responsive rules; the shared stacked-layout policy still takes precedence for portrait and smaller screens.


## Stable mode layout and review

Changing interaction mode should not move the main question or menu title, or
change the canvas width merely to accommodate tools. Reserve editing tools
inside the choices column and center the menu title over the whole column.
Keep long text and enlarged interface fonts free to expand vertically.

When changing a dimension, remove superseded declarations rather than stacking
more overrides. Check both modes at identical viewport sizes and inspect the
winning CSS rule when only one mode changes. Use shared controls unchanged;
keep food geometry and app-specific menu sizing in the app layout file.

In stacked portrait/phone layouts, move the same editing toolbar below the artwork and above its order sentence. Lay its 44px buttons out horizontally, centered, wrapping on narrow phones. Restore the vertical menu-side placement in landscape. Move existing controls rather than duplicating them so state, focus order, and listeners stay consistent.

Creative movement bounds belong to the activity play area, not necessarily the food silhouette. Pizza PLAY permits crust overlap within the rectangular stage; exports must include those placements. Keep LEARN’s preset placement rules independent.
