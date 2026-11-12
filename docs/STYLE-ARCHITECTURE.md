# Styling ownership audit — November 2026

This is an ownership map and a record of the conservative cleanup, not a replacement for the visual specifications in STYLE-GUIDE.md. No framework, preprocessing or build step is required.

## Owners and extension boundaries

| Source | Owns | Keep elsewhere |
| --- | --- | --- |
| `shared/profile.js`, `shared/profile.css` | Shared Profile markup, translations, ID-card layout, name editing, avatar preview and badge presentation for homepage/My Blog/Journal | Theme definitions/persistence and lesson draft state |
| `shared/theme.js` | Validated site theme key, before-style restore, radio selection and cross-tab/page restore | Profile data and creations |
| `shared/tokens.css` | Five curated site palettes, type, radii, spacing, control and icon sizes | SVG dimensions and illustrated colors |
| `shared/controls.css` | Shared buttons, choices, focus/pressed/disabled states, mode switches, dialogs, native scrollbar appearance, visually hidden utility, fullscreen icon state | Activity geometry and specialized editing layouts |
| `shared/app-shell.css` | Opt-in viewport header/content separation for Builders and POST, content overflow and Jump clearance | Artwork, applet main/panel geometry and scrollbar colors |
| `shared/builder-layout.css` | Builder header and basic panel chrome | Food artwork |
| `shared/builder-responsive.css` | Baseline responsive behavior | Final opted-in workspace policy |
| `shared/builder-editor.css` | CreativeBuilder item positioning, minimum hit area, artwork transforms, inactive-layer pointer suppression and keyboard outline | App shadows, stacking groups, selected artwork decoration |
| `shared/builder-workspace.css` | Final frame, nested toolbar and safe base-fitting region | Item-specific dimensions |
| `shared/builder-food-panels.css` | Food-builder density and content-aware choices | Supplies color swatches or map menus |
| `shared/builder-reference-panels.css` | Class Supplies and Lab density | Other app families |
| `shared/builder-panel-workspace.css` | Approved right-column sentence/scrolling pattern | My Town/My Selfie layouts |
| `shared/blog-post.css`, `shared/blog-design.css` | Blog shell and optional design editor | Builder layout conventions |
| `home.css` | Homepage cards, filters, fixed header row and independent content scroll region | Profile modal layout and copies of shared control states |
| App CSS and documented geometry adapters | Artwork, vocabulary-specific controls and deliberate exceptions | Copies of the editor coordinate contract |

Every maintained suite entrypoint first loads blocking `shared/theme.js`, before CSS. Builder style order is tokens → app base → builder chrome → controls → optional components/responsive baseline → app geometry → editor → workspace → family panel density → panel-workspace → explicit app adapter. The editor sheet is required by Pizza, Parfait, Sandwich, Class Supplies and Lab. Opted-in Builders and POST load app-shell.css last for the outer header/content boundary; Blog and Journal retain their existing shells. Avatar and My Town do not use that coordinate contract.

Blog order remains tokens → blog shell → controls → optional design styles. POST intentionally retains its separate typography and postcard UI; its shared tokens/controls support shared utilities. Do not reorder every page into the Builder sequence.

## Historical cleanup record — November 2026

The ownership map above is current guidance. The following changes and verification results describe that cleanup revision, not a fresh test run or deployment status.

- Extracted five copies of `.free-layer`, `.free-piece` and `.free-art` coordinate/hit-area rules into the shared editor stylesheet. App layer order, shadows and selected-art outlines remain local.
- Consolidated visually hidden and fullscreen icon states into controls.css across the homepage, Builders and Blog shell.
- Removed superseded food-layout toolbar rules and obsolete homepage card declarations whose later authoritative rules already supplied the same computed values.
- Shared control/icon dimensions now use their existing tokens; Blog action icons follow the icon token. Corrected the homepage badge radius token spelling (its previous fallback was the same 12px value).
- Added a read-only asset-version check and a narrow ownership/order check. New shared files must be included with the HTML that references them when eventually publishing.

## Explicit remaining exceptions

- `builder-create.css` is currently a Pizza-only legacy component despite its general name. It is not a template for new apps. Do not remove its remaining rules without checking Pizza's sauce/palette states.
- App layout files still contain vocabulary- and slot-specific geometry. Some repetition is intentional; equal numbers are not proof of shared ownership.
- Avatar's tabs, My Town's map/workspace, POST's identity, Blog design tools and Class Supplies' geometry adapter stay separate.
- Hidden legacy Parfait nodes remain because the markup/JavaScript still references them. A hidden selector is not sufficient evidence of dead code.
- Fixed geometry inside the mode switch is not blindly replaced with control-size tokens: its track and knob must agree.
- Some older app base styles are overridden by family policy. This pass removed verified duplicates, not every historical selector. A wholesale flattening would require a broader state-by-state migration and carries unnecessary visual risk.

## Verification for this cleanup

Before/after DOM measurements of rectangles and computed display, padding, gaps, type size, colors, borders, overflow and transforms matched for all sampled selectors in 36 page/viewport cases:

- 1133×678: homepage, Pizza, Parfait, Sandwich, Class Supplies, Lab, Avatar, My Town, NH1-5 Blog, NH6-5 Blog, Journal and POST.
- 1440×900, 1133×599, 768×1024 and 390×844: homepage, three food Builders, NH1-5 and NH6-5 Blog.

These are sampled element measurements, not an assertion of pixel-perfect equality of every state. Interactive and additional accessibility checks are recorded in the task report. Physical iPad Safari, touch gestures, on-screen keyboard and operating-system reduced-motion rendering still require device review. No intentional layout or artwork change was made.

## Checks

Run `node tests/check-style-ownership.cjs` and `node scripts/version-builder-assets.cjs --check`. The latter fails without writing if any registered entrypoint has stale CSS/JS/SVG hashes, including the style-guide reference page. Run the version script without `--check` to refresh them after edits.

The ownership test checks known editor consumers and common utilities, not arbitrary duplicate declarations. Media queries, fallback declarations and app-specific art are legitimate. Extend its explicit consumer lists when adding an app; document an exception here before bypassing a contract. Browser checks remain necessary: static order checks cannot prove the cascade is visually equivalent.

Additional checks: all 33 non-browser Node checks passed, including the new ownership/order check; asset-version validation and `git diff --check` passed. Browser spot checks covered homepage search/profile, Parfait LEARN/PLAY and rotation/Save preview, Japanese language dialog and workspace, visible 3px keyboard focus, Blog Write/Photos/Design and fullscreen icon switching. At 150% injected text size, populated Sandwich retained 44×44 tools and one intentional right-column scroll area (576px viewport, 1260px contents); Blog phone layout at 390px had no horizontal document overflow. Reduced-motion source rules and the automated Pizza reduced-motion branch passed; OS-level reduced-motion rendering was not emulated. Full per-app touch/export/language matrices were not repeated for this CSS-only cleanup.

## Files touched by this cleanup

- New: `shared/builder-editor.css`, `tests/check-style-ownership.cjs`, this ownership document.
- Shared: `shared/controls.css`, `shared/blog-post.css`.
- Local CSS: `home.css`; Pizza `styles.css`/`layout.css`; Parfait `styles.css`/`layout.css`; Sandwich `styles.css`/`layout.css`; Class Supplies, Avatar and My Town `styles.css`; Lab `lab.css`.
- References/check tooling: `docs/STYLE-GUIDE.md`, `docs/WORKFLOW.md`, `_dev/builder/README.md`, `scripts/version-builder-assets.cjs`.
- HTML dependencies/hashes: root homepage; Pizza, Parfait, Sandwich, Class Supplies, Avatar, My Town, POST and Lab entrypoints; all four Blog entrypoints; `docs/style-guide.html`. Only the five CreativeBuilder entrypoints gain the editor dependency; other HTML changes refresh existing asset hashes.

The working tree also contains earlier workspace/behavior changes. They were preserved and are not attributed to this CSS cleanup. Nothing was committed or deployed.

## Theme extension boundary

Theme palettes belong only in tokens.css; preference picker visuals belong in controls.css and behavior in theme.js. App chrome consumes tokens; do not copy theme selectors into app CSS. Preserve POST’s independent identity and all activity/export art. New suite entrypoints must include the pre-style bootstrap. The independent `letseigo.theme` key must never be mixed into profile or creation saves. Theme contrast/behavior checks and dated browser/device evidence are documented in STYLE-GUIDE.md and STYLE-ARCHITECTURE.md#theme-verification.

## Theme verification

Local Chrome verification on 2026-11-09; no commit or deployment. The existing working tree contained substantial earlier app/workspace changes, which were preserved.

### Changed files for themes

- New: `shared/theme.js`, `tests/check-themes.cjs`, `tests/check-themes-browser.cjs`.
- Shared palette and picker: `shared/tokens.css`, `shared/controls.css`.
- Chrome cleanup: `shared/builder-layout.css` (heading color), `shared/pronunciation.css` (hover uses the existing selected token), `home.css` (card shadow and generic preview surround), `apps/pizza/styles.css` (heading, panel border, empty quantity dots), `apps/parfait/styles.css` (empty quantity dots). Food previews and illustrations keep their colors.
- Profile selector and Japanese names/status: `index.html`, `home-ja.js`. `home-profile.js` and existing name/creation storage were not changed.
- Before-style bootstrap and refreshed asset references: root `index.html`; `apps/{pizza,parfait,sandwich,class-supplies,avatar,mytown,post}/index.html`; `myblog/{NH1-5,NH2-4,NH6-5,journal}/index.html`; `_dev/builder/index.html`; `docs/style-guide.html`. The guide includes the shared working picker.
- Owning references: `docs/STYLE-GUIDE.md`, `docs/STYLE-ARCHITECTURE.md`, `docs/WORKFLOW.md`.

### Automated checks

`node tests/check-themes.cjs` passes: validated early restore of every theme, no startup writes, invalid values left untouched, independent profile/creation keys, reload restoration, blocked storage, cross-tab storage events, back/forward cache refresh and pre-style bootstrap in all 14 maintained entrypoints. sRGB contrast checks cover ink/muted text on nine light fills, inverse text on strong fills, selection/focus against all light fills, control borders and all swatch colors. Lowest tested active text contrast is 4.55:1. Decorative dividers and disabled controls are intentionally excluded; activity-art contrast is not inferred from these UI token checks.

`node tests/check-themes-browser.cjs` passes with Playwright and installed Chrome. It serves the checkout locally if BLOG_BASE_URL is unset; NODE_PATH can locate an existing Playwright installation and CHROME_PATH can select installed Chrome. No package or browser download is required by the implementation.

The browser matrix contains 135 cases: five palettes × nine pages × three viewports (1133×744 landscape, 768×1024 portrait, 390×844 phone). Pages: homepage, Pizza, Parfait, Class Supplies, Avatar, My Town, JHS NH1-5 Blog, ES NH6-5 Blog and POST. Checks include root horizontal overflow, modal containment, native checked state and 44px targets. Per-theme interactions include Pizza selected sauce and keyboard focus, HARD/PLAY switches, adding a piece, language dialog, and Profile at enlarged text size. Profile arrow-key wrapping, Tab exit, Escape focus return, Japanese accessible names, reload, navigation, saved palette before CSS delivery, two-tab updates, real profile-name preservation, a separate creation sentinel and unavailable-storage status also pass. Existing creation behavior is additionally covered by the autosave suites below.

Offline checks pass for selection on an already-loaded HTTP page, and file:// selection, reload and navigation to Pizza in an offline Chrome context. There is no service-worker offline shell; uncached HTTP navigation/reload is not promised. File storage sharing worked in this Chrome test but varies by browser. Unavailable storage keeps selection on the current page and reports failed persistence, rather than disabling selection.

Existing non-browser checks passed: `check-style-ownership`, `check-autosave` (including its Builder/Lab/Avatar fixtures), `check-blog-post`, `check-post`, `check-class-supplies`, `check`, `check-parfait`, `check-sandwich`, and `check-my-town`. JavaScript syntax checks and read-only asset-version verification passed. Repository-wide `git diff --check` reports a pre-existing extra blank line at the end of `docs/BUILDER-WORKSPACE-VERIFICATION.md`; that unrelated file was preserved.

### Visual review and remaining device checks

Reviewed screenshots of all five Profile palettes and the landscape Pizza, JHS Blog and POST pages. The panel/surface hierarchy stays pale, selected rings remain distinct, and food, avatar and postcard art retain their colors. POST deliberately retains its independently specified identity; only shared utility controls/dialogs follow suite colors. Gold uses dark ochre for meaningful borders/dots rather than low-contrast bright yellow. Green's muted text and control borders are darker than the original, while its other palette roles remain unchanged.

Still required on a physical iPad/Safari: portrait/landscape touch selection, native focus with an external keyboard, Profile scrolling with the on-screen keyboard and enlarged text, persistence across Safari restarts/back navigation/private browsing, and local-file behavior where supported. VoiceOver must confirm the fieldset label, descriptive color names, checked announcements, swipe order, focus ring usability and storage-failure announcement in English/Japanese. Forced-colors support is defined in CSS but has not been visually reviewed on an OS using that mode. Browser-sized desktop tests do not establish these device/accessibility results.

## Profile ID card verification November 11 2026

Historical initial homepage-only implementation: index.html, home.css, home-profile.js, home-ja.js and the Profile specification in STYLE-GUIDE.md. The shared integration below supersedes those file owners. The existing shared pen icon, controls, themes and version-1 profile record are reused. The avatar stays left and the name right; themes and badges follow beneath. Narrow/short screens may scroll vertically rather than enforcing an aspect ratio.

The new `tests/check-profile-browser.cjs` passed 50 combinations (five themes, English/Japanese, desktop, portrait tablet, phone, narrow phone and short landscape). Checks cover explicit Save/Enter, unsaved input isolation, Cancel/Escape/close discard, reload persistence, empty and long/hostile names as literal text, failed storage writes retaining the editor, concurrent-tab changes without destroying a draft, preservation of extra profile fields and an independent creation key, left/right positioning, horizontal containment and enlarged text. A desktop screenshot was reviewed. The theme browser suite now uses the explicit name-save flow. Shared ownership, token contrast, asset hashes and changed-file whitespace checks also passed. Physical iPad Safari on-screen keyboard and VoiceOver announcements/focus remain device checks; no commit or deployment was made.

### Shared Profile ownership (homepage and My Blog)

The current Profile implementation supersedes the homepage-only ownership above: `shared/profile.js` owns modal markup, translations, avatar/name editing, and badge presentation; `shared/profile.css` owns its styling. The homepage, NH6-5, NH1-5, NH2-4, and Journal all load these same files. My Blog replaces fullscreen with the Profile trigger. Update the shared component and version every consumer together; `tests/check-profile-browser.cjs` covers home and app integration, same-page author updates, responsive layouts, and local-file asset resolution.

## App scrolling audit November 12 2026

The Blog and Journal shells already separate navigation from their scrolling panels. Before this change, phone/very-short Builder layouts and POST still scrolled the document: sampled root overflow ranged from 252px to 1370px. These are intentional content layouts, not a reason to hide required controls. The eight page-flow consumers (six production Builders, POST and Lab) now opt into shared/app-shell.css, leaving the header outside the named activity scroller. The My Town legacy URL is a redirect and was excluded. BuilderJump captures nested scroll events; shared copyright already targets the named scroller. App source/artwork and saved-data formats are unchanged.

`tests/check-app-scroll-browser.cjs` passed 240 combinations (12 active app/Lab entrypoints × four viewport sizes × five themes). It creates temporary real overflow inside each native scrolling region, verifies header/document isolation and inherited scrollbar colors, exercises keyboard scrolling, Builder jumps, Japanese headers, LEARN/PLAY changes and footer placement, then removes the fixture. Viewports were 1133×744, 768×1024, 390×844 and 844×360. All four My Blog/Journal entries were included; existing hidden Avatar tab scrollbars remain an intentional exception. Before/after measurements of 63 sampled main/artwork/panel boxes across seven production applets found no width/height differences over 1px. A scrolled phone Pizza screenshot was reviewed.

Existing workspace, base-fit, artwork-fit, panel-workspace, photo-framing, fullscreen and jump checks passed, alongside POST/My Town behavior checks, style-ownership validation, asset versions and changed-file whitespace checks. Fullscreen checks are logic tests; the browser audit did not repeat physical fullscreen, drag/pinch, all exports or device saving. Physical iPad/Safari overlay scrollbar visibility, touch/keyboard scrolling, orientation changes and VoiceOver remain device checks. No commit or deployment was made.
