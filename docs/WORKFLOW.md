# Let’s EiGo! applet workflow

Status: living reference. Update this document when the way we build, maintain, or release applets changes. This is the process source of truth for the whole project; do not use another applet as an undocumented specification.

## Goals

Build lightweight, textbook-related English activities that students can begin using immediately, in class or independently. The activity supports spoken practice and student choices without requiring accounts, typing, or unnecessary setup.

Prioritize classroom iPads and touch interaction, while supporting desktop, fullscreen, smaller screens, keyboard use, and enlarged text. Make the activity itself the primary use of screen space.

Keep the collection maintainable: shared styles and behaviors should have one implementation, while lesson vocabulary, artwork, prompts, and activity rules stay configurable or local where appropriate.

## Start here: reference ownership

| Question | Authoritative reference |
| --- | --- |
| What are our goals and how do we work? | This file: `docs/WORKFLOW.md` |
| What should the interface look and feel like? | `docs/STYLE-GUIDE.md` |
| Which colors, dimensions, and control behaviors actually render? | `shared/tokens.css` and `shared/controls.css` |
| Which common icons should we use? | `shared/icons/` |
| Where can we try the shared controls? | `docs/style-guide.html` |
| What is specific to an applet? | Its configuration, source, README, and scoped `AGENTS.md` under `apps/<name>/` |
| What should an assistant read first? | Root `AGENTS.md`, which points here rather than duplicating these policies |

Written references define intent. Shared code implements it. Editing a Markdown rule alone does not change running applets; complete the implementation and rollout steps below. Keep examples synchronized with shared code, never as a second implementation.

## Project-wide standards

- Use plain HTML, CSS, and JavaScript with no external dependencies unless the user requests otherwise. Preserve static hosting and direct desktop opening of the app's HTML with the repository structure intact.
- Collect no student information. Keep export/preview operations local unless an external service is explicitly part of the request.
- Use original or appropriately licensed artwork. Keep textbook vocabulary faithful without copying textbook illustrations.
- Keep applet-specific logos and favicons local to each app; the main site uses the shared paper airplane. Use the shared design system for common controls. Do not fork palette, hover behavior, icons, or mode switches into app-local CSS.
- Preserve accessibility: native semantic controls, accessible labels, keyboard operation, visible focus, adequate touch targets, and reduced-motion behavior. Detailed visual specifications belong in the style guide.
- Let the main activity grow with available width and height. Allow scrolling when needed rather than clipping controls, long prompts, or enlarged text.
- Keep optional language complexity in EASY/HARD modes where relevant. Do not force a mode switch into an activity with no meaningful difference between modes.
- Preserve the common header order defined by the style guide. Textbook-back destinations must be explicit rather than relying on browser history. Unavailable destinations/languages must be clearly marked; do not present placeholders as completed features.
- Keep repository source authoritative. Old chat attachments, generated output folders, and ZIP releases are snapshots, not working copies.

## Build a new applet

1. Read this file and the style guide. Identify the textbook/unit, learning goal, target phrases, student interaction, and requested scope. Resolve only decisions that materially affect the activity; do not expand into unrelated features.
2. Create `apps/<name>/` with a clear entry point and small activity-specific files. Reuse `shared/` assets via relative paths. Follow the stylesheet order in STYLE-GUIDE.md; keep any final app geometry overrides explicitly scoped and documented.
3. Put lesson vocabulary, item data, and quantities in configuration when useful. Keep rendering and activity state separate from that data. Avoid premature frameworks for hypothetical activities.
4. Reuse existing common implementations. If a needed behavior exists only inside another applet, extract the genuinely common part into `shared/`, integrate both consumers, and check the original app rather than copying it.
5. Implement the smallest complete requested activity, then add responsive behavior, accessibility, and relevant empty/error/reset states. Keep incomplete functionality visibly unavailable.
6. Validate according to the checklist below. Record the entry point, checks, and limitations in the app README and in the inventory in this file.
7. Explain what changed and how to open it. Do not create a ZIP or deploy by default when working-copy changes are the requested result.

## Update an existing applet

1. Read its scoped instructions and current code. Preserve user changes and current behavior outside the requested scope.
2. Classify the change: app-only content/rules, shared appearance/behavior, or project process. Edit the appropriate source of truth, not whichever file is most convenient.
3. For a shared change, follow the rollout procedure below. For an app-only change, keep its styling limited to layout and artwork rather than overriding shared control conventions.
4. Check the changed behavior and affected existing flows. Update documentation that would otherwise become misleading.
5. Report the result and any outstanding visual/device checks. Never describe mock-based checks as browser testing.

## Change a shared standard and roll it out

1. Record the new decision in its owning reference: process here, appearance in the style guide. Remove or revise the old rule rather than leaving contradictory instructions.
2. Change the common implementation once in `shared/`. Update the interactive style examples for visible control changes. If no shared implementation exists yet, extract it rather than adding multiple copies.
3. Consult the applet inventory and search for every consumer of the affected class, token, icon, or function. The inventory is a starting point, not proof that all consumers were found.
4. Prefer backward-compatible changes. When changing markup or APIs, migrate every affected app in the same update and remove obsolete local overrides. Do not leave mixed generations of controls accidentally.
5. Run relevant checks for all affected applets. Visually inspect representative screen sizes and states when browser access is available. If blocked, state precisely what was checked and what remains unverified.
6. Update the app notes and the short decision history below for significant standards changes. Keep temporary implementation chatter out of the reference documents.
7. Shared-file changes are picked up by local consumers on reload. Live deployments and previously downloaded ZIPs do not update themselves: publish the revised shared assets and consumers together when deployment is requested. Account for stale browser caches when validating a deployment.

## Verification checklist

Use checks proportional to the change; do not add tests that merely restate CSS declarations.

- Activity: initial state, selection/removal, reset, relevant modes, long prompts, and fully populated states.
- Shared controls: default, hover on pointer devices, touch press, keyboard focus/activation, selected, disabled, and reduced motion.
- Layout: iPad portrait and landscape, desktop normal/fullscreen, narrow mobile, and enlarged text. Include both short and long order text; preserve meaningful activity space without horizontal overflow.
- Files: local assets resolve; shared relative paths survive hosting and local opening; no unnecessary network dependency has been introduced.
- Exports/dialogs where present: opening/closing, error state, current-state capture, long captions, download behavior, and state preservation.
- Evidence: distinguish syntax/source checks, mocked behavior checks, real browser checks, and physical-device checks. Missing device access is a limitation to report, not a reason to claim verification.

## Applet inventory and current shared coverage

| Applet | Entry point | Behavior checks | Current limitations |
| --- | --- | --- | --- |
| ほんの手紙 POST (featured) | `apps/post/index.html` | `node tests/check-post.cjs` | Independent styling by request; English UI with paired Japanese card fonts. Static links contain card text; no server inbox. Physical-device verification outstanding. |
| Parfait Builder (prototype) | `apps/parfait/index.html` | `node tests/check-parfait.cjs` | LEARN/PLAY; EASY only; local photo export; iPad download check pending. Mock checks; device visuals outstanding. Not on homepage. |
| Pizza Builder | `apps/pizza/index.html` | `node tests/check.cjs`, `node tests/check-fullscreen.cjs`, `node tests/check-sharing.cjs`, `node tests/check-creative.cjs` from repository root | Mock-based checks; physical iPad visual/download checks outstanding. Textbook back link returns to the home page’s Let’s Try! 2 section; English/Japanese interface language is supported. |

Shared today: builder quantity/selection/sentence/reset logic (`shared/builder.js`), fullscreen and viewport measurement, design tokens, control and dialog CSS, common action/editing icons and the paper-airplane mark, interface translation helpers/dictionary, language-dialog open/close behavior, and the copyright footer. The visual guide consumes those actual shared files.

Still app-local today: header and language-dialog markup, pizza sauce animation, creative editing, and photo export. Their common portions may be extracted when another app needs them. Do not claim they already update across multiple applets, and do not blindly generalize pizza-specific export or placement geometry.

Add a row when an applet is created. Update coverage as shared behavior is extracted. Preserve activity-specific details in the app's own documentation.

## Packaging and publishing

The repository structure includes both `apps/` and `shared/`. Moving only an app folder loses shared assets. For portable releases, preserve those relative paths and put a clear entry-point instruction in the package. Keep generated releases separate from source.

Deploy only when requested as part of the current work. Identify the destination, validate relative paths, publish shared assets together with app updates, and verify the resulting URL. Do not imply that a local update is already live. Hosting should remain replaceable; avoid provider-specific dependencies in app code.

## Decision history

- Current standards: Let’s EiGo! public branding; textbook-section back navigation; shared English/Japanese interface controls with English lesson content; text-only app copyright with home-page terms; vertical editing actions ordered larger before smaller. See the style guide for visual details.
- Initial workflow: central process reference, separate visual specification, shared executable styles, per-app exceptions, and explicit multi-applet rollout checks. Based on the current Pizza Builder and Let’s EiGo! design system.

Add concise entries for consequential changes to project standards; routine activity edits belong in their app notes.

## Interface language boundary

Use `shared/i18n.js` for interface language and `shared/ui-ja.js` for common Japanese control translations. App-specific instructions belong in `apps/<name>/ui-ja.js`. Mark only interface text with `data-i18n`; never translate lesson vocabulary or target grammar. Mark English learning regions with `lang="en"` even when the document language is Japanese. Switching language must not change activity state. On startup, match browser/system language preferences in order to supported languages, including regional tags such as ja-JP. Fall back to English if none match. Manual selection lasts for the page visit and is not overridden during that visit.

## Copyright notices

Include `shared/copyright.js` in applets, before viewport layout measurement and after shared translations. Include the root `LICENSE.txt` in deployments and packages. Reserve the visible footer height instead of overlaying the activity. The shared English/Japanese footer is text only, with no button or terms dialog. Keep the visible full-terms link on the root home page; do not duplicate license text into each app. Preserve the permission for built-in completed-photo exports. Update the root terms and shared notice together when the owner changes the usage policy.

Creative interaction modes should preserve their own compositions and keep learning modes unambiguous. Pizza Builder PLAY forces EASY, restores LEARN difficulty on return, and keeps photo export faithful to manual transforms. Shared `piece-gestures.js` supports one-finger dragging and two-finger pinch resizing in Pizza PLAY. Keep gesture rotation disabled; rotation and flipping remain toolbar actions. Apply app-specific size and placement limits through the gesture callbacks, and update size-based language during resizing. Verify pointer transitions, second-finger starts on the canvas outside the selected piece, and cancellation whenever changing gesture handling. Responsive toolbar placement moves the existing controls between the landscape menu and stacked artwork; do not create duplicate controls.

## Public identity and domain

Use **Let’s EiGo!** as the public brand; applet headers retain their activity titles and the shared footer carries the site brand. Use `letseigo.com` in shared copyright attribution. `ActivityHub` remains the repository name; existing `ah-` styles and `ActivityHubI18n` identifiers are internal compatibility names. See the root README for deployment status. Preserve relative app/asset links and do not change DNS, CNAME, or redirects unless domain setup is requested.

## Home page

The root `index.html` is the textbook activity directory. Home-specific layout and translations live in `home.css` and `home-ja.js`; use shared tokens, controls, copyright, and `shared/language-dialog.js`. Add real, available activities to their textbook section and point each app’s back link to that section. Keep lesson vocabulary and grammar examples in English. Update the home page alongside new app releases.

Homepage usage terms open in a native, scrollable dialog with a close button and Escape dismissal; closing returns focus to the opener. Applet footers remain text only. `LICENSE.txt` is authoritative: after editing it, run `node scripts/sync-license.cjs` to update the embedded homepage text. Embedding allows direct local opening without a network request. The license wording remains English; dialog controls support English/Japanese.

Use relative trailing-slash directory URLs for home and applet navigation (for example `apps/pizza/` and `../../#lets-try-2`). Keep `index.html` as the actual entry file. Include `shared/local-links.js` to resolve directory links to explicit entry files only under `file:` for offline use. Public links use HTTPS on letseigo.com.

## Builder engine ownership

Before every pizza or parfait functional change, explicitly evaluate whether it benefits both builders. Shared quantity cycles, retained placements, accessible selection state, EASY/HARD order language, and reset live in `shared/builder.js`; both applets load that engine. Subclasses own visual geometry/rendering (pizza sauce animation, parfait glass placement). Ingredients, counts, artwork, and nouns live in app configuration. Preserve existing pizza behavior and run both builders' checks after engine changes. Avoid copying functional fixes between applets. Creative editing and photo export remain pizza-specific implementations for now; extract reusable portions when adding them to another builder.

The builder engine supports optional `bases` and `sauces` configuration, validated selection, reset defaults, and base-aware order sentences. App subclasses provide `renderBase`/`renderSauce` for visual treatment. Parfait scoops and drizzle remain local; pizza keeps its spiral sauce renderer.

## Featured standalone card app

ほんの手紙 POST lives at `apps/post/index.html` and is featured separately from textbook activities on the home page. Its home-page link opens a new tab. By user request, it retains its own branding, styles, fonts, controls, and layout rather than adopting the shared app shell for now. The home-page feature uses the site design and English/Japanese translations. `apps/post/` is the canonical working copy; the earlier postcard-applet folder is the import source, not the site working copy. No deployment is implied by local integration.

Builder navigation/heading spacing is owned by `shared/builder-layout.css`, loaded by both builders after their app layout CSS and before shared controls. Check both consumers whenever changing it; food-stage proportions remain local.

Option paging is a shared opt-in builder feature (`builder-panes.js`/`.css`), independent of ingredient state. Both builders currently show all sections in one panel; Parfait whole-section paging was removed for a layout review. Never rebuild ingredient controls when changing pages.

Builder placement strategies: the default remains cached circular scatter for Pizza. `placement.mode: ordered-rows` enables selection-order tracking, row reflow, and per-ingredient orientation in the shared engine. Parfait supplies the glass-specific row coordinates and fruit size in config. Amount changes redistribute the existing row evenly without recreating pieces; removal closes gaps, re-addition appends a new top layer, and reset clears the order. Run both builders’ tests for placement changes.

Paired-layer interaction is implemented by `shared/layer-builder.js`, extending FoodBuilder. Parfait opts into one two-slot row: identical choices produce a uniform row, mixed choices alternate; EASY is direct editing and HARD provides dialogue. Quantity mode remains Pizza’s interaction. Parfait no longer uses the earlier click-order quantity-row prototype. Run `tests/check-parfait.cjs` and pizza checks for shared changes.

Pizza’s creative mode is labelled PLAY (formerly FREE/CREATE). Its compact palette layout lives in `shared/builder-create.css` for future builder reuse; behavior and internal free-mode IDs remain unchanged.

Shared `choice-pager.js` pages existing controls within a section without replacing them or changing builder state. Pizza uses six topping choices per page while all sections remain visible. This complements whole-section `builder-panes.js`; use the appropriate pattern for the activity. Run `tests/check-choice-pager.cjs` for pager changes.

Shared responsive policy supersedes blanket no-scroll requirements: target a one-screen landscape workspace on tablet/desktop, and stack activity above controls on portrait/tablet and phone layouts. Reuse `builder-responsive.css` and `builder-jump.js`; preserve natural overflow for accessibility. See STYLE-GUIDE.md for thresholds and verification sizes.

Numbered activity sections use the shared `ah-section-number` component and style-guide heading convention. Keep section numbering stable when switching panes, layers, language, or modes.

PLAY order summaries use actual creative pieces grouped by ingredient and size band. Shared FoodBuilder owns count/size wording and band classification; each app config supplies countable labels and size policy. Pizza starts at scale 2, ranges 1.25–4 in .25 steps, with small below 1.75 and big at 2.75 or above. Resizing must update the sentence, picker, accessible labels, export, and containment. LEARN language remains unchanged.


## Builder adoption checklist: Parfait and future applets

Reuse standards by reference, not by copying Pizza files. Current ownership:

| Concern | Implementation | Adoption status |
| --- | --- | --- |
| Tokens, buttons, switches, numbered headings, dialogs | shared/tokens.css, controls.css, icons/ | Both builders |
| Header/title spacing | shared/builder-layout.css | Both builders |
| Landscape/stacked layout and quick jump | shared/builder-responsive.css, builder-jump.js | Both builders; device verification pending |
| Paging choices within a section | shared/choice-pager.js and .css | Pizza (six per page), Parfait fruit (three per page) |
| Paging whole sections | shared/builder-panes.js and .css | Available; Parfait currently shows all sections together |
| Quantity and count/size sentences | shared/builder.js plus app config | Pizza; Parfait uses paired layers |
| Two-slot fruit layers and dialogue | shared/layer-builder.js | Parfait |
| Pointer drag/pinch primitives | shared/piece-gestures.js | Pizza; reusable callbacks for app bounds/size limits |
| Compact choice presentation | shared/builder-create.css | Pizza opt-in; some selectors still assume sauce/topping markup |
| Stable toolbar/menu arrangement | apps/pizza/layout.css and markup | Pizza-specific until another consumer needs extraction |
| Creative composition and photo export | apps/pizza/creative.js, sharing.js | Pizza only; not a complete shared editor |

For the upcoming Parfait pass:
1. Apply shared visual standards while retaining the glass geometry, paired fruit
   layers, English dialogue, and current optional ice cream/syrup behavior.
2. Decide which paging model suits each section; do not replace paired-slot
   behavior with Pizza quantity cycling just to reuse its layout.
3. If adding PLAY, extract common composition/editing responsibilities first.
   Supply Parfait-specific placement, containment, and export rendering; do not
   copy Pizza’s rectangular play-area bounds or baked-photo treatment.
4. Keep LEARN/PLAY columns stable and title above all menu tools. Use the shared
   touch, translation, accessibility, and size-language contracts.
5. Check both builders after shared changes. Compare identical landscape sizes
   (1024×768, 1133×744, desktop), portrait 768×1024, narrow phones, Japanese,
   long orders, and enlarged text. Verify drag/pinch and saving on an actual iPad.

A passing mock suite does not establish visual fit. Keep browser/device checks
explicitly outstanding until performed. No Parfait release or homepage listing
is implied by this documentation or by adopting shared styles.

Base and sauce options may supply `buttonLabel` for a shorter choice label while retaining `label` for complete order sentences. Parfait uses flavor-only buttons and full ice-cream names in orders.

Paired-layer ingredients may override the default `layerLayout.pieceSize` with `layerSize` and set `rotation` in app configuration. Use these for visual balance without changing row counts or shared default sizing.

Paired-layer draw order follows row then piece position: each successive fruit overlaps the previous one regardless of ingredient type. Keep ingredient wrappers free of stacking contexts so per-piece depth can interleave; upper rows remain above lower rows. This belongs to layer-builder.js, not Pizza’s ingredient stacking.

Creative editing now uses shared/creative-builder.js in both builders; Pizza has a bootstrap and Parfait supplies local bounds, help, and EASY-only policy. Test both check-creative.cjs and check-parfait-creative.cjs after editing it. Photo workflow is shared; dessert/pizza rendering stays app-specific. Parfait HARD is disabled pending redesign.

Paired fruit selection starts at slot 1 and stays on the selected slot after each choice, allowing repeated substitutions. Changing slots is explicit; clearing selects the cleared slot, and Reset returns to slot 1.

Shared card sizing is owned by builder-card-sizing.css and loaded by both applets after choice-row.css. App configuration via CSS row-count variables accounts for different menu contents while retaining identical sizing limits. Check both applets when changing this file.

CreativeBuilder supports an optional item catalog, artwork callback, and synchronization callback for app-specific editable categories. Parfait adds scoops to this catalog without adding them to LEARN fruit choices; category layer plus insertion order determines both picker order and drawing depth. Syrup artwork remains Parfait-owned.

## Builder PLAY stacking contract

This is the default for every current and future builder using CreativeBuilder.

- `orderedItems()` is the single source of truth for the dropdown and visual depth. First entry is at the back; each later entry is above earlier entries. Repeated ingredient types interleave normally.
- Preserve insertion order within each category. Do not sort by ingredient name, ingredient catalog position, size, or current selection. Selecting, dragging, resizing, rotating, or flipping must not bring a piece to the front.
- An app may explicitly define category `layer` values when needed (Parfait scoops before fruit). Missing values default to zero. Within each category, new pieces and duplicates append after existing pieces; TOP explicitly moves the selected piece to the end of its category, keeping selection and transforms intact; do not regroup individual flavors or fruits.
- After adding/removing items, synchronize drawing depth and picker order. Delete selects the previous displayed item, or the first remaining item if the first was removed; empty lists clear selection.
- Any preview/export must consume the same ordered list. Do not reconstruct PLAY order by looping through ingredient definitions. Pizza Share already follows this rule; future Parfait export must too.
- LEARN owns its separate composition rules: Pizza uses configured topping order; Parfait alternates its fruit pair. This contract does not change LEARN placement.

When modifying ordering, verify mixed repeated ingredients, duplicates, deletion, selection without reordering, category boundaries, and export parity. Run both creative-editor suites and the affected export checks. Any future user-controlled reorder feature must update this same ordered list rather than introducing a second visual order.

Creative artwork callbacks are cached per piece: transforms update position/scale only, preserving artwork nodes and in-progress animations. Replace artwork only when its content changes (for example syrup flavor). Verify transform operations do not restart decoration animations.

Both builders now share builder-photo.js for asynchronous image generation, local PNG preview/download, error handling, and object-URL cleanup. App sharing.js supplies SVG composition and caption; Parfait preserves its dessert appearance and PLAY order, while Pizza retains baked-photo artwork. Run check-sharing.cjs and check-parfait-creative.cjs after export changes.

Parfait export must reproduce the bowl/cream interior masks, not just their stroke widths: the live masks clip the outer half of those outlines. The pedestal retains its full outline.

## Builder pronunciation

Both builders use optional `shared/pronunciation.js` through `FoodBuilder.setSentence` (including paired-fruit and PLAY output). Keep result text unchanged: vocabulary buttons contain only the original phrase, so copying and photo exports continue to use `textContent`. Match configured labels and count nouns longest-first; do not split multiword ingredients. Use browser speech synthesis with an English voice regardless of interface language; prefer Google US English when exposed by the browser, then a standard US-English voice, then another standard English voice. Playback starts only on a user tap, replaces previous playback, and stops when the sentence changes or the page is left. Do not speak on ingredient selection. No speech service, API key, or audio upload is added. Device voices and offline availability vary. Verify with `tests/check-pronunciation.cjs` plus both builders' checks; physical iPad audio testing remains necessary.

Pronunciation settings are mounted by the shared pronunciation component inside each builder's language dialog. Offer Google US English plus at most two standard English alternatives (first US-English match, then default/other English), excluding novelty voices. Automatic uses the first shortlisted voice; explicit saved choices are honored only within that shortlist. Refresh on `voiceschanged` and dialog opening, and offer explicit preview playback. Save the voice URI/name plus language in `letseigo.englishVoice` local storage (shared by applets on the same origin); blocked storage falls back to the current session. Missing or excluded saved voices temporarily use automatic English without discarding the preference. Voice quality must be judged on actual devices; names and online/local metadata are not quality rankings.

Before publishing builder updates, run `node scripts/version-builder-assets.cjs` and commit its updated app entry pages together with changed assets. Both builders use content-versioned script/style/icon URLs so returning browsers fetch the matching release rather than mixing cached shared engines with new markup. This does not replace a reload of an already open page, and does not deploy anything. For tablet regressions, distinguish browser-sized desktop verification from physical iPad gesture/audio checks; inspect published assets before assuming a responsive-layout problem.

Speech troubleshooting: Device default (English) explicitly sets en-US without binding a voice object, letting the browser resolve its English default. Keep it available even before voice enumeration completes. Resume a paused speech engine within the tap handler. Cancel a request that has not fired a start/end/error event after ten seconds and show a visible diagnostic; clear the timer on stop/start/end/error so older requests cannot interrupt new ones. Do not assume ordinary audio playback proves browser speech synthesis works. This is a compatibility option, not a confirmed fix for every iPad speech failure.
