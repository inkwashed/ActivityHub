# Let’s EiGo! style guide

Version 0.1 — a living guide based on Pizza Builder. Revise this guide and the shared styles together as the collection develops.

## Source of truth

- `shared/tokens.css`: palette, typeface, spacing, sizes, radii, and motion duration.
- `shared/controls.css`: buttons, choices, and EASY/HARD switch.
- `shared/icons/`: balanced language, Reset, and camera icons.
- `docs/style-guide.html`: working examples using the same styles as the app.

Load tokens first, app layout styles second, and shared controls last. App styles own layout and activity artwork; shared styles own control appearance and states. Reuse the shared classes instead of copying button rules into each applet.

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

Pizza Builder adds a TAP/FREE pill beside the topping heading, using the shared switch shape. FREE disables the EASY/HARD switch in EASY state and explains this in its instructions. Editing actions reuse shared buttons; the piece picker provides access to overlapped pieces. The selection outline uses the focus-color token.

FREE editing uses a vertical icon toolbar to the right of the pizza, with a dedicated 44px lane and 12px separation. Order the vertical actions from top to bottom: larger (+), smaller (−), rotate left, rotate right, flip, duplicate, delete. Reuse the shared size, rotation, flip, duplicate, and delete SVGs with translated accessible labels/tooltips. Put the compact piece picker in the topping header and expose instructions through the info button beside TAP/FREE. Header controls may wrap on narrower screens.

The text-only footer attribution is `Let’s EiGo! © 2026 letseigo.com · All rights reserved.`; Japanese retains `Let’s EiGo!` and `letseigo.com` and translates the rights notice. Keep the domain as plain text in applet footers.

## Brand

Use **Let’s EiGo!** on the home page, in page titles, and in documentation. Applet headers display their activity name, without an additional site-brand line. Place the site brand unobtrusively before the copyright notice in the shared footer. Keep the shared palette and control styling; applets may have their own logos and favicons. The repository name and internal `ah-`/`ActivityHubI18n` identifiers remain unchanged.

Homepage usage terms open in a native, scrollable dialog with a close button and Escape dismissal; closing returns focus to the opener. Applet footers remain text only. `LICENSE.txt` is authoritative: after editing it, run `node scripts/sync-license.cjs` to update the embedded homepage text. Embedding allows direct local opening without a network request. The license wording remains English; dialog controls support English/Japanese.

For unobtrusive text actions such as the homepage’s Use & copyright modal opener, use a native button with `ah-text-action`: underlined text with no filled background or border, a 44px touch height, and visible keyboard focus. Use actual links for navigation.

The original paper-airplane logo lives in `shared/icons/site-mark.svg`. Use this SVG for the home page header and favicon, preserving its square aspect ratio and orange palette. Applets should retain their own identity: Pizza Kitchen uses `apps/pizza/icon.svg` in its header and favicon. Store activity-specific marks with their applet; use the shared airplane only as a fallback when an applet has no mark. Use empty alt text beside a visible brand/activity title to avoid duplicate announcements.
