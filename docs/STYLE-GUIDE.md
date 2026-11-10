# Let’s EiGo! style guide

Living visual specification for the shared site and explicitly scoped app families. Update this owning guide when an agreed standard changes; dated verification belongs in the verification records.

## Source of truth

- `shared/tokens.css`: palette, typeface, spacing, sizes, radii, and motion duration.
- `shared/controls.css`: buttons, choices, theme radio picker, and EASY/HARD switch.
- `shared/theme.js`: validated local theme selection, early restore, and picker synchronization.
- `shared/icons/`: balanced language, Reset, and camera icons.
- `docs/style-guide.html`: working examples using the same styles as the app.

Load the blocking local `shared/theme.js` before any styles (no `defer`/`async`), then tokens, app base styles, shared builder chrome, shared controls, then optional shared layout components and shared responsive policy. A documented app geometry file may follow the responsive policy. Load shared/builder-editor.css after app geometry for CreativeBuilder consumers, then shared/builder-workspace.css, followed by the approved panel spacing and builder-panel-workspace adapters; together they own final stage, output, and tablet/desktop fit geometry. App styles own layout and activity artwork; shared styles own control appearance and states. Reuse the shared classes instead of copying button rules into each applet.

See [styling ownership and exceptions](STYLE-ARCHITECTURE.md) for the family boundaries and verification record. Shared visually-hidden and fullscreen icon states belong in `controls.css`; CreativeBuilder positioning/hit-area rules belong in `builder-editor.css`. App geometry may decorate those elements but should not copy their coordinate rules.

## Visual direction

A warm, clear classroom workspace: pale backgrounds, near-white surfaces, dark text, softly shaded controls, and restrained accents. Green retains the original cream/sage identity and is the default. Keep the activity prominent. Avoid decorative content that reduces its available space.

## Palette

| Role | Token | Color |
| --- | --- | --- |
| Page background | `--ah-canvas` | #f8f6ed |
| Panel/control surface | `--ah-surface` | #fffefa |
| Main text | `--ah-ink` | #263f36 |
| Supporting text | `--ah-muted` | #4b594f |
| Thin control border | `--ah-border` | #697a68 |
| Hover fill | `--ah-hover` | #e8eddf |
| Pressed fill | `--ah-pressed` | #d5e1cc |
| Secondary action fill | `--ah-secondary` | #e0ead7 |
| Secondary action hover | `--ah-secondary-hover` | #cedfc2 |
| Selected fill / border | `--ah-selected` / `--ah-selected-border` | #eef4e8 / #417655 |
| Strong fill (HARD mode) | `--ah-strong` | #294e40 |
| Decorative accent | `--ah-accent` | #d85836 |
| Keyboard focus | `--ah-focus` | #245eb3 |

Do not use orange as small text on cream without checking contrast. Food/artwork colors are activity-specific, not UI palette tokens.

## Curated site themes

All palettes live in `shared/tokens.css`, selected with `html[data-ah-theme]`. Green uses the root defaults. Keep muted surfaces dominant; do not recolor activity artwork, student choices, lesson content or export artwork. The palette is related to Teacher Tools through restrained colored controls and pale surfaces, without copying its stronger Ocean Blue (#1e40af / #60a5fa). Blue also echoes the original Let’s Go! blue/white direction. Maroon takes POST’s #963f4c and #f1e3d8 directly.

| Theme | Canvas | Surface | Ink | Secondary | Selected border / dot | Strong | Focus |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Green (default) | #f8f6ed | #fffefa | #263f36 | #e0ead7 | #417655 | #294e40 | #245eb3 |
| Blue | #f3f7fb | #fdfefe | #253e50 | #deecf7 | #346a94 | #294f70 | #245eb3 |
| Maroon | #fcf5ef | #fffdfa | #49342c | #f2e1dc | #963f4c | #74323e | #326c68 |
| Gold | #fbf7ed | #fffefa | #493c24 | #f1e5c6 | #846321 | #70521d | #245a8e |
| Purple | #f8f5fa | #fffdff | #41354d | #eadef1 | #78538e | #624275 | #315e9b |

The full hover, press, muted, border, disabled and play-surface values are executable tokens, not copies in app styles. Green’s canvas, surfaces, primary text, fills, focus and accents are preserved; its control border and supporting text are slightly darker to meet contrast checks. Decorative dividers remain subtle. Accent colors are decorative, not small-text colors. Disabled controls are intentionally muted and are exempt from active-control contrast requirements.

Profile places the shared theme picker immediately below Name. Use a labelled fieldset and native radios with descriptive accessible names and native checked state. Five 22px colored dots sit in 44×44px labels with 4px gaps. Selection uses a dark ring separated from the dot by the panel color; keyboard focus uses a distinct 3px outline outside that ring. Arrow keys change/wrap selection; Space selects; Tab enters/leaves the group. Theme swatches are preference radios, not app artwork swatches. Keep the same shared picker in the interactive guide. Forced-color mode retains swatch colors with system-colored selection/focus rings.

`shared/theme.js` owns the independent `letseigo.theme` string key and only accepts green/blue/maroon/gold/purple. Startup never writes a default or overwrites an unknown stored value. Explicit user selection writes only that key; names, avatar, badges, language, and app saves are independent. Shared entrypoints load this small local script synchronously before CSS so a saved palette is applied before rendering. Storage and pageshow/visibility events synchronize other tabs and restored pages. A failed save keeps the choice for the current page and exposes a translated status message; it cannot promise persistence/navigation without working storage. With JavaScript unavailable, the root green styles remain usable.

POST keeps its documented independent warm typography/editor/postcard identity; shared navigation buttons and dialogs adopt the selected suite tokens. Its preview art and the homepage’s POST illustration background stay warm. Avatar pictures, food artwork, My Town map/route colors and Blog’s exported composition are content, not generic chrome. Do not theme their source art. Fixed SVG utility icons retain their dark stroke; the five pale palettes keep these readable.

Run `tests/check-themes.cjs` for validated restore/storage isolation, entrypoint order and WCAG sRGB contrast. Active text and supporting text must reach 4.5:1 on all interactive light fills; inverse labels on strong fills must reach 4.5:1; selected borders, focus and dot identities must reach 3:1 against adjacent light surfaces. Control boundaries are checked against canvas, surface, hover and selected fills. `tests/check-themes-browser.cjs` covers responsive pages, native radio keyboard use, focus, reload/navigation, first-style restore, cross-tab updates and unavailable storage. See [theme verification](STYLE-ARCHITECTURE.md#theme-verification) for dated evidence and physical-device limitations.

## Type and spacing

Use `--ah-font` (rounded system fonts with Trebuchet/Arial fallbacks); do not download fonts. Body/action text is 16px; regular labels and supporting text are at least 14px. Only nonessential metadata may reach 12px. Headings may scale fluidly. Keep student-facing wording short.

Use 4, 8, 12, 16, and 24px spacing tokens as a baseline. Quantity dots sit close to their labels (2px padding plus the card gap), not at a distant card edge. Surplus card height surrounds centered content.

## Controls

| Purpose | Shared classes | Examples |
| --- | --- | --- |
| Neutral action | `ah-button` | Reset |
| Secondary action | `ah-button ah-button-secondary` | Save, Download photo |
| Icon action | `ah-button ah-button-icon` | Language, fullscreen, close, back |
| Selectable card | `ah-choice` | Sauce, topping |
| Difficulty | `ah-mode-toggle` and switch markup | EASY/HARD with command knob |

Actions use a thin 1px border and dark text. Secondary actions start a shade darker rather than using an unrelated solid fill. Choice cards retain a 2px border for selection clarity and use `--ah-radius-control` (12px) for rounded corners. Their corner radius belongs in the shared control rule, not in app or example overrides. Text buttons are pills; icon buttons have 12px corners; panels use roughly 20px corners.

### Behavior contract

- Default: light shade and visible border.
- Hover: darker shading and theme-selected border, only on devices supporting hover. Selected cards retain a distinct tinted hover state.
- Press/tap: deeper shade and subtle 0.98 scale, without reflow. The mode switch uses an inset stroke instead of scaling.
- Keyboard focus: 3px theme-focus outline with 3px offset.
- Selected: theme-selected border plus tint and `aria-pressed`. Do not add selection checkmarks to choice buttons or swatches. Preserve quantity dots when they communicate an amount; selection must not add content or change button dimensions.
- Disabled: muted shading, no hover or press response. Use native `disabled`. For links, `aria-disabled` alone does not suppress activation; prevent navigation explicitly.
- Motion: 150ms control transitions. Reduced motion disables transitions and press scaling; activity animations also respect it.
- Touch: minimum 44×44 CSS pixels. Hover is optional feedback, never required.
- Use native buttons for actions, links for navigation/downloads, and checkbox switches for modes. Give icon-only controls accessible names and hide decorative art from screen readers.

## Shared header and icons

Left: textbook-back control, applet-specific mark (or shared mark), activity title. Right: Language, app-link QR, textbook/unit context, fullscreen. Use 24px icons in 44px targets. For the reviewed food/Supplies Builders, LEARN/PLAY belongs beside the first choices heading; EASY/HARD and its separate touch/keyboard help belong in the app’s documented choices heading. Do not put difficulty back in the header. Wrap rather than overflow. The phone-only textbook-label policy below owns label visibility. Legacy Lab retains its documented difficulty fixture; Blog/POST have separate shells.

Reset uses `reset.svg`; picture preview/Save uses `camera.svg`. Both have a 24×24 viewBox, 1.8px rounded strokes, and similar drawing bounds; render them at the shared 24px icon size. Avoid font glyphs for these actions because their apparent size varies by platform.

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

## Verification records

See [STYLE-ARCHITECTURE.md](STYLE-ARCHITECTURE.md) for ownership/audit history and [BUILDER-WORKSPACE-VERIFICATION.md](BUILDER-WORKSPACE-VERIFICATION.md) for dated Builder checks. Those records do not replace fresh checks for a new change or establish physical-device coverage.

## Interface languages

Language settings offer English and 日本語. Translate functional labels, mode wording, instructions, dialog messages, and accessible control labels. Keep lesson vocabulary and target English sentences unchanged. Use the shared translation helper and common dictionary; extend only app-specific strings locally. Japanese mode labels are かんたん / むずかしい. Allow wrapping instead of clipping Japanese instructions.

Default interface language follows the first supported browser/system language preference (including regional variants), falling back to English. The language menu allows a manual choice that is remembered locally across visits and applets.

Copyright uses the shared compact footer (`shared/copyright.js`) with a 12px text-only notice. Do not add a button or terms dialog to individual applets. Include its measured height in the viewport layout. The root home page links to the full terms.

Reviewed Builders preserve independent LEARN/PLAY and EASY/HARD choices. Mode help describes building; separate difficulty help describes the lesson’s language rules. Use the optional shared switch and accessible help-dialog pattern. The piece picker provides access to overlapping pieces; selection and keyboard focus remain distinguishable. Builder Lab’s legacy mode-coupled fixture is an explicit exception, not a production default.

Builder PLAY editing uses the shared inset quick-tools toolbar inside the play frame, following the responsive placement policy below. It does not reserve a lane in the choices panel. Order the vertical actions from top to bottom: larger (+), smaller (−), rotate left, rotate right, flip, duplicate, TOP, delete. Reuse the shared size, rotation, flip, duplicate, and delete SVGs with translated accessible labels/tooltips. Put the compact piece picker in its app-documented row below or beside the choices heading, leaving difficulty and slot controls unobstructed and expose instructions through the info button beside LEARN/PLAY. Header controls may wrap on narrower screens.

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

Pizza and parfait use `body.ah-builder` and `shared/builder-layout.css` (after app styles, before controls). This provides baseline header padding, logo size, navigation gaps and typography. The later workspace and explicit panel adapters own final responsive dimensions and panel spacing. Desktop headers use 6px vertical/24px horizontal padding; logos are 30px and control targets remain 44px. Main titles use 28–39px on tablet/desktop, the target question 22px, section headings 18px, and helper text 14px. Mobile layouts wrap and scroll.

Artwork stages remain app-specific within the shared stable play frame. The workspace subtracts measured header/footer space; approved panel workspaces place output in the choices column without reducing the left stage. The current preferred-artwork fitting policy below supersedes historical Parfait heading/stage spacer experiments.

## Builder option panes

Whole-section paging is an optional retained component (`shared/builder-panes.js` and `.css`), not the default approved scrolling workspace. A `[data-builder-panes]` panel contains named `[data-builder-pane]` sections, a live `[data-pane-status]`, and shared 44px previous/next icon buttons in side rails. Arrows cycle through panes. Hidden panes retain their controls and selections but leave the tab order. Keep the panel footprint stable; allow scrolling on short screens or enlarged text. Page labels and accessible navigation names translate, while ingredient vocabulary stays English.

Parfait filling uses a restrained contrasting contour so pale cream stays visible against the glass. Decorative fruit rows use consistent orientation and even spacing rather than broad random rotation; strawberry points face upward. Layer ordering is content behind the glass outline, with the open rim allowing above-glass decoration.

Builders with a fixed set of ingredient slots follow the multiple-item selector standard below. Ingredient paging is separate from slot swapping; give paging and swap controls distinct accessible names. Keep lesson output in English with natural wrapping.

`shared/builder-create.css` is a Pizza-only legacy component, not a reusable layout template. New palettes use shared editor/workspace and the applicable panel-density adapter. PLAY may show icon-only choices with accessible names and a picker; LEARN retains labelled choices. Layout follows width and available space, not a blanket portrait bottom-tray rule.

Keep the target-language question above the artwork. Approved panel workspaces visually hide the redundant choices title while preserving its accessible heading and numbered sections. Do not add decorative eyebrows; legacy grid-map titles retain their documented context.

In both LEARN and PLAY, place Reset/Save permanently after the ingredient sections in the menu. Give both buttons equal flexible widths so together they fill the panel’s inner width, with the final panel adapter’s gap (6px in food panels; documented 8px defaults elsewhere). Preserve the neutral Reset and secondary Save styling and minimum 44px touch height. The canvas has no action row. Pizza implements the common action-row sizing in shared/choice-pager.css, without mode-specific width overrides.

PLAY palette sizing follows the current per-panel adapter described below, using available choices height. Keep the menu column stable between modes.

Pizza keeps LEARN/PLAY and its info control at the right of the first sauce heading in both modes. PLAY section titles are “1 Sauce” and “2 Toppings” (translated as interface text); LEARN retains the full instructions. The compact sidebar accommodates that header in one row, and stacked phone layouts use full-width sections below the creation. Portrait tablets retain the two-column layout when at least 740px wide.

For long ingredient lists, use `shared/choice-pager.js` and `.css`: keep each section heading visible and page its existing choice buttons in app-configured groups (Lab uses four) with 44px side arrows and a page indicator. Unlike whole-section panes, this keeps sauce and toppings together. Hidden choices retain their state and leave keyboard navigation; arrows wrap. Pizza displays all nine toppings in a three-column, three-row grid in both LEARN and PLAY, without paging arrows or a page indicator. Paged layouts remain available for other builders and the Lab.

Pizza keeps its English question above the creation. The redundant choices title is visually hidden in the approved panel workspace; numbered Sauce/Toppings headings retain context.

## Responsive layout policy (approved panel-workspace Builders)

Load `shared/builder-editor.css` after app geometry/card sizing for CreativeBuilder consumers, then `shared/builder-workspace.css`, followed by the applicable panel spacing adapter and `builder-panel-workspace.css`. Load `builder-workspace.js` after builder initialization, then initialize `BuilderPanelWorkspace` before autosave restoration. These shared components own the approved layout for Pizza, Parfait, Sandwich, Class Supplies and Lab; My Selfie/My Town await separate review.

At 740 CSS px wide or larger, including portrait iPads, use a single-screen two-column workspace. Subtract measured header/footer heights from `100svh`; reserve 6–10px vertical padding, a 12–16px column gap, and a choices column of at least 350px (otherwise 42%). Keep choices top-aligned. Use content-aware card heights from the applicable panel adapter; the former 46px compact PLAY minimum is obsolete. Keep all interactive targets at least 44px. Do not scale down the whole interface or hide overflowing controls. Normal tablet/desktop use should require no page scrolling; exceptional enlarged text or unusually long content may scroll inside the bounded choices/output region.

The activity column has a question row of at least 44px and a flexible, sentence-independent play frame with a 6–8px gap. The choices column contains the controls and naturally growing output and scrolls as one region. Changing sentence length or difficulty must not resize the left frame. PLAY fits the base beside its tools while pieces can use the whole frame, as detailed in the approved workspace section. Stable viewport units reduce changes from browser chrome.

Style the output with `--ah-surface`, a 1px `--ah-divider` border, `--ah-radius-panel` corners, and 10px vertical / 12px horizontal padding. Use preferred 21px text and natural wrapping; no fixed output height or inner scrollbar in approved panel workspaces. Preserve speaker/vocabulary controls. Legacy consumers that have not adopted the panel workspace retain the older `clamp(76px,14svh,140px)` output box and 21→16px fitting until individually reviewed; do not copy that budget into a new panel workspace.

The bordered output box provides visual separation: do not add decorative quotation marks around builder results. Keep ordinary sentence punctuation, pronunciation controls, and Sandwich initials intact. This applies to the Lab and all production builders.

Below 740px width, deliberately stack activity above controls with a stable 404px play frame and the growable output beneath choices. Keep `data-jump-section` hooks and `shared/builder-jump.js` for keyboard-accessible section navigation. Nest the existing PLAY toolbar inside the play frame: centered on the right in landscape, or centered at the bottom in portrait/compact layouts. Never duplicate controls. Test landscape 1024×768/1133×744, portrait 744×1133/768×1024, desktop 1366×768, phones, enlarged text, and long content in every affected Builder.

## Numbered section headings

Use `ah-section-number` from shared/controls.css for numbered activity sections: a theme-strong circle with a bold surface-colored number (30px normally, 26px for compact/tablet layouts). Pair it with heading text using `ah-section-heading`, or an existing flex heading with an 8–10px gap. Use real `legend` or heading elements, with the number in its own span so translation never removes it. Keep numbering stable across option pages and modes. Section numbers describe steps/categories, not changing layer or page counts. Pizza uses 1 Sauce / 2 Toppings; parfait uses 1 Ice cream / 2 Choose some fruit / 3 Syrup. Reuse this component in future applets with numbered sections; do not create app-local badge styles.

Legacy PLAY builders use English count-and-size language (small/medium/big). Reviewed builders opt into independent build mode and difficulty: Class Supplies, Pizza, Parfait and Sandwich preserve the selected difficulty across LEARN/PLAY and apply their app-specific language rules consistently. Parfait places difficulty beside (3) Syrup to preserve fruit-slot space; EASY names ingredients, HARD counts size-grouped pieces. Piece touch areas grow with their artwork and retain a 44px minimum. Size words describe relative ingredient size, not identical pixel dimensions across different foods.

PLAY touch editing uses one finger to move a piece and two fingers on that piece to resize it. Keep the +/− controls as an accessible alternative; rotate and flip remain explicit toolbar actions. Pinching respects the same size limits and size labels as the toolbar. In PLAY, reserve native touch gestures on the artwork canvas for editing; preserve page scrolling outside it. Start on a piece, then place the second finger anywhere on the canvas to resize that piece.

Tablet/desktop geometry for all builders is owned by the responsive policy above. App layout files retain food-specific drawing geometry, but must not independently size the stage from output height or override the final shared workspace.


## Stable mode layout and review

Changing interaction mode should not move the main question or change canvas width merely to accommodate tools. Tools stay nested in the play frame; redundant choices titles are visually hidden in approved panel workspaces. Controls and sentence share the scrolling right column. Keep long text and enlarged fonts free to wrap.

When changing a dimension, remove superseded declarations rather than stacking
more overrides. Check both modes at identical viewport sizes and inspect the
winning CSS rule when only one mode changes. Use shared controls unchanged;
keep food geometry and app-specific menu sizing in the app layout file.

PLAY quick tools sit inside the frame, above movable artwork. Keep 44px buttons, 6px gaps and 10px edge clearance. In landscape at viewport widths of at least 740px, a frame at least 344px wide and 414px high uses a single right rail (64px reserved). Shorter frames at least 394px wide and 214px high use a 2-column by 4-row right rail (114px reserved), leaving at least 280px for the base. Otherwise use a bottom strip: one row at frame widths of at least 414px (64px reserved), two rows of four below that (114px reserved). The reservation protects base fitting, not individual item placement in full-frame consumers. The outer frame clips pieces at its real edges; the picker recovers covered pieces. Preserve listeners and pointer isolation, and never export tools. See the approved workspace section for bounds ownership.

Height does not switch a sufficiently wide workspace into a portrait stack. Compact output and spacing first. Keep a minimum 240px play frame; in 740–840px-wide workspaces reserve at least 354px for artwork above a bottom toolbar. Legacy bounded layouts may scroll the activity internally. Approved panel workspaces keep the creation fixed while the choices column scrolls, with deliberate page flow at heights of 380px or less. Below 740px, retain the intentional activity-first page stack and section-jump control. Never shrink touch targets to force a tiny viewport to fit.

Creative movement bounds belong to the actual play frame in approved panel-workspace consumers, including space behind tools. Keep LEARN presets independent. Square exports include the editing frame; Pizza additionally expands symmetrically for its full composition. Do not reintroduce fixed cropping as a shared default.

Mode help must describe the currently selected mode: update its dialog title, instructions, and info-button accessible label together. Translate these interface strings without changing lesson vocabulary or activity state.


Panel padding is owned by the final panel adapter, independent of LEARN/PLAY. Food builders use the available-height rules below (10px regular, 8px compact); do not reintroduce the obsolete 14px Pizza override. Other builders retain their documented adapter/default until reviewed.

Parfait follows the approved panel workspace: the question stays above the glass, the redundant choices title is visually hidden, and Reset/Save fill the menu action row. Keep the paired fruit slots and ingredient sections together. Difficulty is beside (3) Syrup.

For four short base choices, opt into `four-choice-row` from shared/choice-row.css (after app layout). Use four equal cards with artwork above wrapping 14px labels and an 8px gap. At widths of 380px or less, use two columns. Pizza sauces and Parfait ice cream/syrups use this pattern; Pizza PLAY retains accessible labels while displaying icons only.

### Multiple-item selectors

Use this pattern whenever a builder offers two or more explicit item slots, including Parfait’s fruit pair and Sandwich’s three fillings.

- Show ingredient artwork only, with no visible slot numbers, names, plus signs, or placeholder text. Empty slots show an upright grey circle/slash symbol. Use the configured ingredient artwork and orientation.
- Use shared `ah-choice` styling and `aria-pressed` to identify the selected slot. Give each slot an accessible name containing its position and current ingredient, or a translated empty-slot instruction.
- Keep slots equal-width with a 48px minimum height and approximately 36px artwork. Place a shared-style 44px swap button with opposing arrows between every adjacent pair, with 8px gaps. Three slots therefore have two swap buttons. Preserve touch targets on narrow screens rather than shrinking them.
- Label each swap accessibly with its affected positions (for example, “Swap fillings 1 and 2”); the two-slot case may use “Swap fruit choices.” Translate control labels and announcements, while ingredient vocabulary remains English.
- Keep selection, keyboard focus, disabled states, and clear controls visible and usable. Interaction and state-preservation requirements belong to the multiple-item selector contract in WORKFLOW.md.

Parfait uses this standard for its two fruit slots.

Filled item slots expose a simple theme-strong × clear button in the upper-right corner, without an enclosing circle. Use `ah-button slot-clear` from shared/controls.css: 22px × glyph, `--ah-strong` color, transparent background, 44px hit target, and shared hover/pressed/focus feedback. The glyph is aria-hidden; give the button a translated slot-specific accessible label. Keep it a sibling of the selection button, never a nested button. Hide it for empty slots and return focus to the cleared slot. Parfait and Sandwich both use this shared treatment; do not override it per app.

Parfait shows all nine fruit choices in a three-by-three grid without paging arrows or page status. Preserve both editable fruit slots in LEARN. Ice cream and syrup stay on the same panel; retain shared button sizing.

Paired-fruit choice icons and selected-slot previews use the same configured rotation as placed fruit. Keep the angle in ingredient configuration rather than duplicating per-fruit CSS. Empty-slot icons remain upright.

Parfait now provides LEARN/PLAY and contextual help beside its first heading, with HARD disabled. PLAY displays all fruit icons and a piece picker, hides paired slots, and uses the same landscape/stacked toolbar placement as Pizza. Share is available in both modes.

Parfait LEARN places the selected fruit pair and swap control on the “Add fruit” heading row. Allow wrapping only when narrow screens or enlarged text need it.

Parfait PLAY uses short section titles (Flavor, Fruit, Syrup) and picture-only flavor, fruit, and syrup choices. Hide choice text visually while keeping accessible names; LEARN retains instructional headings and vocabulary labels.

Food panel padding, heading separation and card sizing are owned by shared/builder-food-panels.css as described below. Minimum card height is not a fixed rendered height; wrapping labels, quantity dots and enlarged text must be allowed to increase it. Do not add independent app-specific height formulas.

In Parfait PLAY, place the piece picker beside the Fruit heading, using the remaining width without wrapping the heading row. Preserve the accessible picker label. LEARN continues to show its paired slots in that row.

## PLAY list and visual stacking

The picker reads from back to front: item 1 is behind item 2, and so on. Preserve this relationship even when ingredient types repeat. Selection highlights a piece without changing its depth. Explicit category grouping is allowed (scoops before fruit), but items within each category retain their creation order. Previews and exports must look consistent with the editor. Implementation and verification requirements are owned by the Builder PLAY stacking contract in WORKFLOW.md.

LEARN four-choice cards use 6px vertical padding and a 3px artwork/label gap; scoop icons are 32px. Long flavor labels can still increase row height rather than shrinking vocabulary text. Paired fruit selectors use a 48px minimum height, distinct from ingredient cards. PLAY retains its shared responsive artwork sizing.

The shared PLAY toolbar includes TOP (shared/icons/top.svg) after Duplicate. It brings the selected piece to the front of its category and updates its picker position; scoops cannot cross in front of fruit. Use a translated accessible name and tooltip, and disable it when nothing is selected.

Parfait now includes Share beside Reset with equal flexible widths, using the shared camera icon, secondary button, and photo-preview dialog. Photo captions retain English target sentences; dialog controls translate.

## Pronunciation in builder results

Place a shared-style 44px speaker button beside the order sentence. Render ingredient names as inline buttons with inherited English sentence typography and a subtle dotted underline; keep complete vocabulary phrases together as one playback target. Preserve visible keyboard focus, a minimum 44px target height, and natural wrapping on smaller screens. Load `shared/pronunciation.css` in pronunciation-enabled Builders. Translate playback control labels and errors, never the spoken lesson text. If neither a complete recording sequence nor browser speech is available, retain plain result text and disable playback with an explanatory accessible label. A complete recorded sequence remains playable without device speech.

The language dialog includes a “Default voice” labelled native select and a shared “Try voice” button for pronunciation-enabled builders. Show Automatic and a distinct Device default (English) option, plus at most three recommended English voices: Google US English and up to two standard alternatives. Include language/accent code and translated on-device/online labels; omit novelty voices. Preserve 44px controls, shrink the select within the dialog, and translate helper/error text. Voice selection and preview never alter the English order or ingredients.

Pronunciation diagnostics appear only in voice settings; keep the artwork/order area free of playback messages. In settings, show immediate starting feedback and browser-reported playback status; these events do not prove the user heard sound. The preview uses secondary button styling and a persistent active treatment while speech is pending/playing. Deduplicate identical voice labels to avoid confusing device voice lists.

Use stable small-viewport height (`svh`) for builder fit budgets and card growth so mobile browser chrome cannot resize the activity during scrolling. The final shared workspace sizes the Parfait stage proportionally inside the same stable frame as Pizza and Sandwich. Keep the iPad Silent Mode note in pronunciation settings.

Recorded vocabulary uses the existing inline pronunciation buttons without changing sentence text or layout. Voice settings explain that device voice choices affect speech fallback and voice previews; recorded vocabulary and supported recorded sentences retain their approved voice. Keep that explanation translated.

The English target question is also a native inline pronunciation button, using the same dotted underline, focus treatment, and minimum target height as vocabulary. Keep heading typography and play the approved question recording on tap.

Homepage applet cards—including featured applets—use a compact square preview column capped at 260px, with the remaining width assigned to the text column. Use 20px card padding, a 24px column gap, and 16px preview corners. At 620px and below, stack the card with a centered preview capped at 220px and a 20px gap. Images use proportional containment; never stretch artwork or enlarge the preview to match text height. Text may grow independently.

Sandwich shows all 16 LEARN fillings in four columns by four rows, with no paging arrows or page indicator. This is app-specific, not a new universal paging standard.

Sandwich prototype uses three icon-only editable filling slots with adjacent swap arrows and a source selector that appears for the active LEARN filling. Keep source labels readable, use native 44px selects, and preserve the selection when moving between slots. Its side-view food geometry is app-specific; shared typography, panel padding, paging, mode toggle, toolbar, and modal standards still apply.

### Builder choices-column alignment

The direct `#builder > [data-jump-section="choices"]` column is top-aligned using shared/builder-layout.css in LEARN and PLAY. Do not vertically center it to match the artwork or changing order text. Stacked layouts use horizontal auto margins only, not vertical auto margins. Approved panel-workspace consumers visually hide the redundant menu title while retaining its accessible heading; legacy consumers keep their existing heading. The PLAY toolbar reserves space inside the play frame according to the responsive policy. CreativeBuilder palette consumers load shared/builder-card-sizing.css and declare row counts; final food/reference adapters own density. My Town and My Selfie retain their separate layouts. Sandwich uses four LEARN rows and four PLAY rows, with editable bread beside the piece picker. Final workspace padding and toolbar spacing follow the responsive policy above.

Sandwich’s PLAY palette keeps all 16 fillings in four columns and four rows, with bread beside the piece picker. Grid column counts remain app-owned; use the food-panel sizing policy below rather than independent growth formulas.


## Non-live Builder reference candidate

`_dev/builder/index.html` demonstrates the current shared workspace plus a candidate composition of slot selectors, four-across paged quantity buttons, a dropdown, Reset/Save, and a four-column PLAY palette. It is a review surface, not automatic approval of new universal dimensions. Its README tracks unresolved sizing, overflow, artwork-bounds and component-adoption decisions. Promote approved changes here and into shared code with the workflow’s explicit consumer rollout; keep unapproved experiments scoped to the lab.

The Lab’s LEARN choice grids follow Sandwich’s 20% artwork enlargement at the tablet/desktop breakpoint (740×600 CSS px), retaining the 36px layout box and existing card heights. Apply artwork sizing/transforms to the direct root SVG (`.ingredient-art > svg`), not every descendant SVG: nested ingredient fragments must retain their configured dimensions. Check both slot-choice and quantity-choice cards, including labels, quantity dots and edge clipping. Slot previews and PLAY sizing are independent. This is implemented in the Lab and Sandwich; further rollout requires explicit migration.

Keep the textbook/unit label (`.edition`) visible in tablet/desktop builder headers, including the compact workspace. Use the actual textbook/unit in lesson applets and “TEXTBOOK NAME · Unit 0” in the Lab. Header wrapping is measured by the shared viewport script; do not hide lesson context to force a single header row. The single phone-layout breakpoint is **max-width:739px**: hide `.edition` at 739px and below; show it at 740px and above, regardless of height or orientation. This matches the shared activity-first/tablet workspace boundary. A landscape phone at 740px+ follows the wider policy; do not add height or device-detection exceptions that also hide labels on short tablet windows. `shared/builder-layout.css` is the only owner of Builder `.edition` styling/visibility. App styles and workspace adapters must not override it. Blog has a separate policy and is unchanged.

## Shared play surface and PLAY bounds

Shared Builder play frames use the borderless tan `--ah-play-surface` (#eee6d2) on `.builder-play-area`, with the shared panel corner radius. The visible surface is the full shared frame, not the food silhouette. Keep its dimensions independent of sentences and mode. Artwork stays proportional inside it; food-specific Save scenery remains unchanged.

PLAY uses that frame for movement, converting its rectangle to the app’s existing scene coordinates. Use rotated visible selection bounds plus editing clearance against the real frame; minimum hit targets remain 44px. Ordinary pieces stay reachable, and oversized pieces may overlap/crop at the edge while remaining recoverable. Do not constrain them to the food silhouette or toolbar-safe base rectangle. Recheck positions when the frame resizes.

Measure the root SVG’s visible geometry for PLAY selection and hit areas, with a small margin and a 44px minimum touch target. Transform the hit area with the artwork. Do not use the full square SVG canvas for a flat ingredient or change illustration/export coordinates to trim it. Re-measure when rendered art changes, including syrup on scoops; duplicate pieces need their own hit elements.


### Unified PLAY palette sizing

Shared `builder-card-sizing.css` defaults remain available to existing consumers: 72px minimum PLAY cards, 4px padding and 64px artwork boxes (normally 76px rendered height including borders). Pizza, Parfait and Sandwich opt into the food-panel policy below. Class Supplies and Builder Lab use the reference-panel adapter below. Avatar/My Selfie and My Town retain their separate policies. Keep proportional root-SVG sizing and app-owned column counts.

Builder button panels use the shared surface fill, thin divider border, and rounded corners without a drop shadow or raised lower edge. Apply this flat panel treatment to the Lab and all Builder applets; food artwork and photo previews may retain their own shadows.

Mode switches start from identical preferred food geometry; toolbar clearance may require a minimal shift or last-resort scale as specified below. Pizza uses the full available square as its preference in both LEARN and PLAY. Remove legacy mode-specific board dimensions and workspace grid-row overrides rather than allowing them to defeat the final shared frame rules.

Mode-stable artwork also requires identical internal drawing coordinates, not just equal CSS boxes. Check SVG viewBoxes, root transforms, background-image sizing and permanent scene elements across LEARN/PLAY. Sandwich live bread use the same unscaled coordinates in both modes; only its Save renderer may apply the compact photo transform. Keep upper artwork within the viewBox rather than shrinking the whole LEARN scene.

The homepage closing note and terms link belong in a dedicated footer after the main activity directory, never between textbook sections. Align its width and horizontal padding with the directory; keep it in normal document flow. Separate adjacent textbook sections with 40px of space.

Builder headings show the activity title and target question without extra eyebrow captions such as “Made by you” or “You’re the chef!”. Apply this to the Lab as well; retain textbook/unit context in the header.

Builder section headings use shared/builder-layout.css: 18px bold text with 1.3 line height in both LEARN and PLAY, at every viewport size. Apply the same typography to h2, legend, and labelled .ah-section-heading controls (including the Lab dropdown). Do not add app- or mode-specific heading font sizes; numbered badges retain their shared sizing.

The EASY/HARD switch uses shared/icons/command.svg at 24 × 24px inside the centered knob. Do not use the ⌘ text glyph: platform font metrics can shift its visible alignment. Keep the image decorative and the native switch accessibly labelled.

App state autosaves locally without a toggle or repeated save messages. Reset remains the way to start over; keep its existing active-mode behavior. Do not reopen dialogs or resume audio automatically when restoring a saved activity.

Home-screen shortcuts use the shared site airplane by default, while browser-tab favicons and applet header marks keep their own artwork. Keep each applet’s `rel="icon"` pointed at its app-specific asset; never replace it when updating `apple-touch-icon` or manifest icons. Every app entry includes shared/icons/apple-touch-icon.png (180px) and its own manifest referencing shared 192px/512px PNGs. Keep shared/icons/site-mark.svg as the editable master; regenerate the PNGs after palette/geometry changes. Manifests retain app-specific names and launch URLs and use browser display mode; this icon convention does not imply offline support or change navigation.

App-link sharing uses a QR icon button immediately after Language in the header, with a translated accessible label. Use shared/page-qr.js and shared/page-qr.css for the native dialog, black-and-white airplane QR, PNG download and Copy link. Show the public entry URL and keep the QR square with a four-module quiet zone. Keep image/creation actions separate from QR sharing; reviewed Builders label the picture action Save. POST follows the same Language-then-QR header order, alongside a homepage back link. Its language dialog explains that its card editor remains English; card text is never translated. The local Lab uses an explicitly labelled homepage demonstration.

QR dialog actions use the short labels “Download” and “Copy”, with a decorative download arrow or overlapping-sheets icon on the left, using the same shared button spacing as Reset/Save.

The homepage header ends with a rounded-square saved-avatar button after Language and QR. The avatar fills the button’s interior with no padding and follows its shared rounded corners. The larger Profile dialog avatar also uses a rounded-square crop with the shared control radius. Both previews show the artwork at 110% scale, anchored at the top center so the top stays visible and the extra height crops at the bottom. Use the shared grey profile silhouette when no valid local avatar is available. It opens a Profile dialog with the current selfie, a locally saved Name field, and an Edit Selfie action with a small Polaroid icon at the bottom linking to the avatar builder.

## My Blog writing and snapshots

ES My Blog uses Post/Photos/Design, with guided TYPE textareas or WRITE pads rather than the former segmented fields. Show Help controls visual samples only; hints and guides do not enter saved/exported answers. Keep the profile beside writing and use layout-only reset. The ES lesson README and MY-BLOG-ENGINE.md own the current focus, handwriting and help behavior; Builder changes must not alter it.


## Object color controls (Class Supplies reference)

For builders with individually recolorable objects, use native, keyboard-accessible scene selection and show the selected object's artwork in a dashed preview beside labelled color swatches. Fixed scene objects may also be selectable without becoming draggable. Use the shared numbered section heading and `ah-choice` swatch buttons, with accessible color names and `aria-pressed`; selection follows the shared border/tint treatment without checkmarks. Keep targets at least 44px. In narrow panels, wrap the preview above the swatches and allow heading controls to wrap rather than clipping or shrinking targets. Class Supplies uses two rows of five colors; palette size and color availability by difficulty remain app-specific.

Review artwork outlines at their actual default scene size, especially after resizing individual SVGs. Use one per-item size definition for matching LEARN and newly added PLAY artwork; palette thumbnails may use the shared independent card dimensions. Keep outline and detail weights visually consistent across objects, while manual PLAY scaling naturally scales the artwork.

Class Supplies is the current reference for these patterns, not a shared color-control component or a requirement to add recoloring to other builders.


### Builder Save photo download action

Center a content-width Download button below the photo with a 12px top gap. Apply `builder-photo-preview` to the photo so shared styling removes competing bottom margins. Use `ah-button ah-button-secondary builder-photo-download` from shared/controls.css and the decorative shared/icons/download.svg icon, matching the QR modal. Put the translated “Download” label in a child span so translation preserves the icon. Keep the link hidden until the image is ready, retaining the app's filename and download behavior. Pizza, Parfait, Sandwich and Class Supplies use this pattern.

Pizza, Parfait, Sandwich and Class Supplies export a proportional square artwork region inside the captioned image. Approved panel-workspace exports union the original framing with the real editing frame, retaining edge and toolbar-covered pieces without exporting controls. Extra background can vary with viewport. Pizza adds symmetric expansion around its intended center for rotated/extreme pieces; other app coordinate mappings remain local. See app READMEs and HOME-PREVIEWS.md; matching artwork does not imply an identical crop at every viewport.

Junior-high My Blog lessons use a full-width title field and multiline body instead of inline sentence blanks. Put a compact Sample button beside the activity heading. Its native shared-style dialog contains a readable webpage-style sample with title, author and paragraphs; retain internal scrolling, selectable English text, Escape dismissal and focus return. NH1-5 opts into Write/Photos/Design tabs at every size: keep photos out of Write, preserve internal text-field scrolling, and put Share below the panels. NH1-5 omits whole-post Reset; its Design panel has Reset layout with the shared reset icon, preserving all text/photos. Put selection instructions in a shared help dialog opened by the labelled info button beside Arrange your post. Design uses three columns with selectable blocks, a Builder-style rail of 44px movement and size buttons, 1–3 column widths and Short/Medium/Tall photo heights. Text grows automatically. Design hides profile/name and title to concentrate on arranging blocks; retain them in Write and Share. Fit the compact preview to the available width and height while retaining usable selection targets; very tall layouts can scroll internally. Use an element picker in the editing panel, and disable toolbar actions at their limits. Always include all source elements; editing text and deleting photos belong to Write and Photos. On phones, place the horizontal editing rail and scrollable controls beneath the scrollable design preview.

JHS My Blog Share keeps variable-height webpage artwork. Use a focusable scrolling preview region inside the shared dialog; keep the heading/status and centered shared Download action outside that region. Do not force square framing. My Blog keeps textbook/unit labels visible at all breakpoints.

JHS My Blog navigation uses a tab strip, not pill action buttons: rounded upper corners, a baseline, muted inactive tabs and a surface-filled active tab with a theme-selected top indicator. Retain native tab semantics, arrow-key navigation and inset visible focus.

ES My Blog offers TYPE/WRITE via a shared-style pill opposite the author/avatar. WRITE pads use theme-selected baseline and black guide rules, one or two writing lines per sentence according to available width. Keep help as a faint overlay, omit automatic periods, and expose Pen/Eraser and per-sentence Undo as labelled 44px controls. Restrict touch drawing behavior to pads so the surrounding Post panel can still scroll.

Profile badges appear beneath Name and above Edit Selfie. Show only the highest earned rank per badge family, in an evenly spaced responsive grid, with a 30px My Blog icon matching its app header and an invisible 44px touch target. No visible button border, fill, or label; retain native button semantics and a visible keyboard focus outline. Green preserves the original My Blog SVG; bronze, silver, gold and aqua diamond reuse its geometry with rank palettes in `shared/badges/`. The accessible button name includes the rank as a non-color cue. A native button expands one inline help bubble beneath it, showing the title “Budding Journalist” without a rank descriptor, completion counts and the next threshold; it supports keyboard activation and `aria-expanded`. An empty collection explains how to earn the first badge. Labels and details support English/Japanese.


## Grid-map Builder workspaces (My Town reference)

Grid-map activities retain the common Builder chrome rather than copying food-specific markup. Use `#builder`, a `.kitchen` activity column with `data-jump-section="activity"`, and a top-aligned choices column with `data-jump-section="choices"`; make both section targets focusable with `tabindex="-1"`. Mark the app-owned scene with `data-builder-scene`. The shared workspace script wraps that scene and `.order` in the standard play area and bounded output container. Keep the question above the map; omit a redundant choices title when space is constrained.

Load shared tokens, layout, controls, responsive and workspace styles in their established order. A final app adapter may handle map fitting and the internal choices layout, but must not fork button colors, heading typography, dialog styling or output fitting. Use the compact 26px choices title, shared 18px section heading and 14px help/choice labels; section numbers are appropriate for distinct steps, not required for a single map-editing category.

For the My Town-specific adapter (not a general Builder breakpoint), its 740px width threshold selects the two-column workspace independently of height; short windows compact padding and retain intentional section scrolling. Keep the choices heading and action controls visible while the place list scrolls inside the panel. Allow exceptional enlarged text to scroll rather than hiding controls. Labelled place cards use four columns, a 6px gap, 68px minimum height and 36px artwork in the compact My Town adapter. Reset and Save occupy equal widths with an 8px gap. BUILD/ROUTE may replace LEARN/PLAY for an activity whose second mode practices routes rather than free composition; keep the shared mode-switch treatment.

Preserve map proportions as railway rows or other features change its height. Use one coordinate model for artwork, hit targets, route tracing and Share. My Town retains a 360px minimum map width and permits scrolling inside the play area on narrow screens instead of compressing the map further. Below the shared threshold, stack the activity above choices, retain the 404px play frame and enable the shared section-jump control. My Town relocates the sentence below the buttons panel using its map-specific workspace adapter, disables legacy text shrinking, and reserves natural output height up to 45% of the right column. The list scrolls independently; when measured chrome leaves too little list space, the buttons panel scrolls as one region while output scrolls separately. This is a deliberate exception to the food Builders’ unified right-column scrolling.

Include the shared header QR control using the intended public app path. Before publication, state that the QR destination is not yet available; enabling the control is not deployment. Use the shared picture-preview lifecycle and centered download action; use Save for the picture-preview action. Map art and logical lots remain app-specific, and BUILD edits, drag/swap behavior, route rules and save migration belong in the app README/model rather than global style rules.

Verify empty and populated maps, BUILD/ROUTE, station-dependent resizing, drag/swap, output overflow, QR/Share, and desktop/tablet/phone layouts. Preserve keyboard access, visible route nodes and touch editing; physical-device checks remain necessary before classroom release.

### Builder recovery, selection and picture saving

Use the existing Reset button for temporary Restore, with translated visible/accessibility labels and no extra controls or confirmation. Use **Save** for the reviewed Builder English picture-preview/export action (food Builders, Class Supplies, My Town and Lab’s sample). My Selfie and Blog retain their existing Share wording pending separate review; QR sharing keeps its own Share wording. Preserve the existing preview and centered Download action.

Selected LEARN fruit/filling slots use a 3px inset ink outline and subtle selected tint inside their existing footprint. Keep unselected slots visible and keyboard focus as a separate outside focus outline. Do not change selection behavior, dimensions, or add animation.

A site/app-name export tagline is under review, not an enabled standard. The `?export-tagline=preview` review flag uses the Blog approach (muted 14px text) in the existing upper white margin only. Normal exports omit it; never include student information or reduce artwork/sentence space for this preview.

### PLAY artwork fitting

Builders with a persistent base use full-frame LEARN dimensions as their preferred artwork coordinates. Pizza, Parfait, Sandwich, Class Supplies and Builder Lab consume this shared fitting policy. Reserve the nested toolbar strip independently. For approved full-placement workspaces, fit the visible persistent base and fixed hit targets independently of movable PLAY pieces: preserve size/position first, translate the minimum distance second, scale proportionally only when the base cannot fit. Transparent SVG/frame margins do not force shrinking. Keep six pixels for outlines/shadows and retain 44px editing targets. Background artwork supplies normalized bounds in its app markup; Sandwich’s bounds include the bottom bread and its stroke.

Fit on mode entry, viewport changes and restoration. Full-placement workspaces keep base framing stable during dragging, resizing, deletion and reset; oversized items do not shrink the base. Legacy union-fitting consumers may refit an oversized edit. Base fitting itself must not rewrite piece coordinates, sizes or layer order. Outer-edge constraints can clamp an item when its available frame becomes smaller, and picker recovery intentionally changes position. Bases and ingredients use one fitted coordinate container; exports map the normalized composition into their full-frame photo bounds. Grid builders and other non-opted-in scenes retain their own geometry pending an explicit review.


### Food choice panels: available-height spacing

Pizza, Parfait and Sandwich opt in with `main.food-builder` and load `shared/builder-food-panels.css` after workspace and card styles. That file owns final panel padding and section rhythm. Remove app panel-padding variables; keep other shared consumers on their existing defaults.

Regular food panels use 10px padding and 8px section separation; compact panels use 8px and 6px. Neighboring controls/grids retain 6px gaps. Parent flex/grid gaps own section separation; fieldset legends own only the gap before their content. Avoid adding heading, fieldset and grid margins together. Functional text and Japanese labels retain their size and may wrap.

On bounded two-column layouts, use the choices column’s measured container height, to select density. The title is visually hidden in the approved workspace; sentence length contributes scroll content but does not change density. Compact budgets are 600px for Pizza, 640px for Sandwich and 700px for Parfait, based on rendered regular-panel requirements. Thus the taller Parfait panel stays compact longer while Pizza regains larger previews sooner. These are content budgets, not device names. Phones retain a naturally growing panel and intentional page scrolling.

LEARN cards have a 68px minimum, 36px artwork and 6px vertical padding (4px compact). Actual cards grow for wrapped labels and Pizza quantity dots. PLAY cards use 76px minimum/64px artwork normally and 68px minimum/56px artwork compact, with 4px padding; these budgets include the shared borders. Sauce artwork retains its proportions. Sandwich slot selectors use a 48px minimum and natural height. All action, info, mode, clear and swap controls remain at least 44×44px, with the existing focus styling. Keep all choices available and designated section scrolling when content cannot comfortably fit.

Pizza’s former decorative slogan/footer is removed in every mode and viewport. Do not reintroduce it through a responsive exception. The old 600px-height breakpoint must not enlarge food section badges in a shorter tablet workspace; food tablet badges keep their established 26px size. Artwork fitting, toolbar reservations, sentence output, Save and Restore are independent of this panel policy.

### Class Supplies and Builder Lab panels

These two opt into `reference-builder` and `shared/builder-reference-panels.css`, loaded after workspace/card styles. Use 10px padding/8px section gaps normally, 8px/6px below a 650px available choices-column height. LEARN cards grow from 68px; PLAY uses 76px/64px card/art budgets or compact 68px/56px. At phone widths up to 420px, icon-only previews use 60px cards/48px art to retain four comfortable columns. All action targets remain at least 44px. Class Supplies keeps its two rows of five 44px color swatches with 6px gaps; its preview moves above them when necessary. Lab paging arrows move below the full-width choices on narrow phones; the four-choice page size is unchanged.

These panel adapters do not change scene coordinates. Class Supplies and Lab now explicitly opt into the shared preferred-artwork fitting policy: preserve full-frame position/size, shift minimally, then scale only if necessary. Class Supplies preserves preset LEARN positions and existing export framing. Lab Save is a sample dialog, not a production exporter; its English vocabulary/long-label examples are deliberate fixtures.

Scene integration: put `data-builder-fit` on the scene wrapper discovered by the workspace. Mark the persistent base with `data-builder-fit-base`: an SVG or a wrapper with a direct SVG child uses visible SVG bounds; a plain rectangular base uses its full rectangle. Do not accidentally measure a descendant ingredient as the base. Use `data-builder-fixed-hit` for fixed interactive surfaces (the pencil-case selector). Keep movable SVG pieces in the same coordinate container, but in full-placement workspaces exclude them from base fitting and bound their rotated 44px-minimum targets against the outer play frame. Keep six pixels of editing clearance. Never resize the base independently, rewrite stored item coordinates during viewport fitting, or count transparent viewBox margins as artwork.

Class Supplies measures the case’s transformed SVG silhouette and fixed selector; its square 100×100 viewBox contains unused space and is not the case outline. Lab deliberately treats its full board rectangle as the base, demonstrating a base that can genuinely need a shift or reduction sooner than a sparse silhouette. Its sample Save does not represent a production export. Both return exactly to full-frame LEARN geometry on mode exit. Physical touch/pinch verification remains necessary.


### Approved choices-and-sentence workspace

Pizza, Parfait, Sandwich, Class Supplies and Builder Lab load `builder-panel-workspace.css/js` after the shared workspace. Initialize `BuilderPanelWorkspace(builder)` (or use the script's `data-builder` global name). The existing output, including pronunciation and optional source sentence, moves below choices into one independently scrolling right column. Hide the redundant title visually, retain its accessible heading/label, and preserve numbered section headings. Short output is content-height; long/enlarged text wraps without an inner scrollbar. Native scrollbars and a subtle lower inset shadow indicate more content. Do not auto-scroll to new sentences; preserve the current panel offset for choice edits.

At widths of at least 740px, give the left frame the height remaining after its question. Do not retain the former sentence-height allowance in food geometry. Below 740px, stack activity then controls/output with intentional page scrolling. Extremely short windows (380px high or less) also use page flow with a usable creation height. Keep 44px controls; content growth is preferable to clipped text. My Selfie and My Town retain their separately reviewed layouts.

Fit the base within the toolbar-safe inner rectangle using the full frame as preferred dimensions: preserve size/position, translate minimally, then scale proportionally only if necessary. Ingredients share that transform. Full-placement consumers set `data-builder-placement="full"`; the toolbar strip is a base-fitting exclusion, **not** an item movement boundary. `placementBounds` returns the outer frame. Keep rotated visible hit bounds reachable at real edges; oversized pieces may crop but their center remains recoverable. Toolbar events remain separate from captured drag gestures.

Selecting a partly or fully covered item through the existing piece picker moves it minimally into the safe region and saves that new position. It is not a temporary visual offset or undo history. A very large piece may not fit wholly beside the toolbar, but remains selected and accessible to move or shrink. Do not add another recovery control.

The shared `exportFrame(mapping, baseline)` hook unions the complete editable frame with the app's original photo framing and pads to a square. Each exporter owns its mapping: Pizza preserves its baked 94% inset; Parfait maps to its 376×249.6 ingredient plane at (12,0) in 400×320 glass coordinates; Sandwich retains its 90% photo transform and compact LEARN stack. No tools/selection outlines enter exported art. Tall/narrow frames add background and make the creation smaller within the square; preserving all edge pieces takes priority over filling the photo. Existing non-opted-in exporters retain their fixed framing.

Class Supplies alone retains its reviewed width-limited preferred-frame adapter to preserve case vertical placement. This exception must not become a leftover sentence budget in new Builders. Lab uses a full rectangular base and a clearly labelled non-exporting Save sample.

Sandwich difficulty controls sentence detail, not quantity language: EASY explains filling initials; HARD adds explicitly selected origins. Store one country per filling type, separately for each build mode. Bread has no origin. Missing choices stay unresolved rather than being inferred.

#### Growing sentence regions and layout ownership

The approved right-column workspace uses content-height output, not the legacy 21–16px fixed-height fitting loop. Its adapter calls `output.stopFitting()` to disconnect that loop's observers and clears the fitted font override. My Selfie and My Town still use the legacy bounded output layout and retain fitting. Keep the native scrollbar and existing lower inset shadow (`has-more`) as the unobtrusive scroll cue; do not add permanent sentence navigation without review. Listen remains a normal focusable 44px control at the top right of its sentence box and is reached by scrolling the column or keyboard navigation.

Geometry observers belong to the shared workspace coordinator, not panel adapters or artwork renderers. This ownership does not change the preferred-size/minimal-shift/last-resort-scale policy, full-frame piece placement, or app-specific base geometry. See WORKFLOW.md for repaint and recovery contracts.

#### Mode artwork visibility

Shared editor layers retain their sizing boxes across LEARN/PLAY changes. The editor sets inactive layers to `opacity:0`, `inert` and `aria-hidden`; `.builder-inactive-layer` disables pointer events. Opacity leaves sizing and inherited visibility stable through rapid transitions. Avoid app overrides that force inactive descendants visible or focusable. This is an internal sizing/accessibility contract, not a visual layout change; keep existing clipping, glass translucency and toolbar geometry.

### PLAY piece selection accessibility
Movable pieces retain native button semantics and expose `aria-pressed="true"` only for the selected piece, `false` otherwise. Keep the existing item name and visual selection treatment; focus is separate from selection. Use the shared creative editor selection path so pointer, keyboard, picker and restored selections agree. Do not use `aria-selected` on ordinary buttons.

### Builder toggle language
LEARN/PLAY and EASY/HARD use the shared toggle typography and dimensions from `shared/controls.css` in both interface languages; do not shrink labels with app-specific Japanese overrides. Visible EASY/HARD labels remain English learning words. The switch accessible name (for example, “Hard mode”), checked state and localized help explain the control in the selected interface language. Language changes must not change mode or difficulty.

## Homepage feedback announcement

The feedback invitation is a small, in-flow aside beside the introduction at widths of 1000px and above (224px column with a 32px gap). Below that, it stacks after the introduction and stays at most 360px wide. Use a surface fill, subtle divider border and a narrow selected-color top edge; retain the shared feedback button and visible new-tab notice. Keep the bug-report link independent. This homepage-only layout belongs in home.css.
