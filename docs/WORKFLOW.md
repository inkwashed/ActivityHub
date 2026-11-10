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
| Who owns theme restore and the local preference? | `shared/theme.js`; visual contract in STYLE-GUIDE.md |
| Which common icons should we use? | `shared/icons/` |
| Where can we try the shared controls? | `docs/style-guide.html`; full Builder experiments use local `_dev/builder/index.html` |
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
2. Create `apps/<name>/` (or `myblog/<textbook-unit>/` for My Blog lessons) with a clear entry point and small activity-specific files. Reuse `shared/` assets via relative paths. Follow the stylesheet order in STYLE-GUIDE.md; keep any final app geometry overrides explicitly scoped and documented.
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
- Layout: verify that choices stay top-aligned when modes, ingredient sources, or order length change; check shared card-sizing stylesheet and row-count configuration. Check iPad portrait and landscape, desktop normal/fullscreen, narrow mobile, and enlarged text. Include both short and long order text; preserve meaningful activity space without horizontal overflow.
- Files: local assets resolve; shared relative paths survive hosting and local opening; no unnecessary network dependency has been introduced.
- Exports/dialogs where present: opening/closing, error state, current-state capture, long captions, download behavior, and state preservation.
- Evidence: distinguish syntax/source checks, mocked behavior checks, real browser checks, and physical-device checks. Missing device access is a limitation to report, not a reason to claim verification.

## Applet inventory and current shared coverage

Listing refers to the local homepage, not proof of deployment. Verification limitations are dated evidence in [BUILDER-WORKSPACE-VERIFICATION.md](BUILDER-WORKSPACE-VERIFICATION.md) and app notes; re-run checks for the change being made.

| Applet | Entry point | Behavior checks | Current limitations |
| --- | --- | --- | --- |
| ほんの手紙 POST (featured) | `apps/post/index.html` | `node tests/check-post.cjs` | Independent styling by request; English UI with paired Japanese card fonts. Static links contain card text; no server inbox. Physical-device verification outstanding. |
| My Blog Journal (prototype) | `myblog/journal/index.html` | `node tests/check-blog-journal-browser.cjs` | Unlisted; latest local draft per configured lesson, not version history or backup; physical iPad/Safari pending. |
| My Blog: Welcome to Japan | `myblog/NH2-4/index.html` | JHS browser suite with `BLOG_LESSON_PATH=/myblog/NH2-4/` | Junior High Year 2 Unit 4; original starter sample; physical iPad/Safari pending. |
| My Blog: A Place I Like | `myblog/NH1-5/index.html` | `node tests/check-blog-post.cjs`; Chrome writing/sample/snapshot checks | Junior High Year 1 Unit 5, listed after Elementary 6; physical iPad/Safari pending. |
| My Blog: Where is it from? | `myblog/NH6-5/index.html` | `node tests/check-blog-post.cjs`; Chrome responsive/state/image checks | NEW HORIZON Elementary 6 Unit 5; listed on homepage; local PNG snapshot; physical iPad/Safari review pending. |
| My Selfie (prototype) | `apps/avatar/index.html` | Browser: tabs, selections, reset, square PNG preview; shared photo regression checks | User-authored SVG parts; no unit assigned or homepage listing. Physical iPad saving unverified. |
| My Town (prototype) | `apps/mytown/index.html` | `node tests/check-my-town.cjs`; browser placement, route and Share checks | NEW HORIZON 5 Unit 5; unlisted. 12 fixed lots, street-snapped routes; physical iPad review pending. |
| Class Supplies | `apps/class-supplies/index.html` | `node tests/check-class-supplies.cjs`; in-app browser landscape/portrait/phone checks | Let’s Try! 2 Unit 5; listed on homepage. Independent LEARN/PLAY, mode-scoped palettes and per-piece PLAY colors, local saves and PNG export. Physical iPad checks pending. |
| Builder Lab (local only) | `_dev/builder/index.html` | `node tests/check-builder-lab.cjs`, `node tests/check-builder-workspace.cjs` | Non-live candidate; sample Share only; browser/device review pending. |
| Sandwich Builder | `apps/sandwich/index.html` | `node tests/check-sandwich.cjs` | Three filling slots and source choices; shared PLAY editor; local browser/device review pending. Listed under NEW HORIZON Elementary 6. |
| Parfait Builder | `apps/parfait/index.html` | `node tests/check-parfait.cjs` | Independent LEARN/PLAY and EASY/HARD; local photo export; iPad download check pending. Mock checks; device visuals outstanding. Listed on homepage. |
| Pizza Builder | `apps/pizza/index.html` | `node tests/check.cjs`, `node tests/check-fullscreen.cjs`, `node tests/check-sharing.cjs`, `node tests/check-creative.cjs` from repository root | Mock-based checks; physical iPad visual/download checks outstanding. Textbook back link returns to the home page’s Let’s Try! 2 section; English/Japanese interface language is supported. |

Shared today: builder quantity/selection/sentence/reset logic (`shared/builder.js`), fullscreen and viewport measurement, design tokens, control and dialog CSS, common action/editing icons and the paper-airplane mark, interface translation helpers/dictionary, language-dialog open/close behavior, and the copyright footer. The visual guide consumes those actual shared files.

Still app-local today: header and language-dialog markup, food drawing/animation, and export rendering. Creative editing, gestures, photo-dialog/export plumbing, and workspace fitting now have shared implementations. Fixed-slot implementations are not yet fully unified; the lab’s opt-in component is a review candidate. Do not generalize food-specific geometry merely because the surrounding engine is shared.

Add a row when an applet is created. Update coverage as shared behavior is extracted. Preserve activity-specific details in the app's own documentation.

## Packaging and publishing

The repository structure includes both `apps/` and `shared/`. Moving only an app folder loses shared assets. For portable releases, preserve those relative paths and put a clear entry-point instruction in the package. Keep generated releases separate from source.

Deploy only when requested as part of the current work. Identify the destination, validate relative paths, publish shared assets together with app updates, and verify the resulting URL. Do not imply that a local update is already live. Hosting should remain replaceable; avoid provider-specific dependencies in app code.

## Decision history

- Current standards: Let’s EiGo! public branding; textbook-section back navigation; shared English/Japanese interface controls with English lesson content; text-only app copyright with home-page terms; vertical editing actions ordered larger before smaller. See the style guide for visual details.
- Initial workflow: central process reference, separate visual specification, shared executable styles, per-app exceptions, and explicit multi-applet rollout checks. Based on the current Pizza Builder and Let’s EiGo! design system.

Add concise entries for consequential changes to project standards; routine activity edits belong in their app notes.

## Interface language boundary

Use `shared/i18n.js` for interface language and `shared/ui-ja.js` for common Japanese control translations. App-specific instructions belong in `apps/<name>/ui-ja.js`. Mark only interface text with `data-i18n`; never translate lesson vocabulary or target grammar. Mark English learning regions with `lang="en"` even when the document language is Japanese. Switching language must not change activity state. On startup, match browser/system language preferences in order to supported languages, including regional tags such as ja-JP. Fall back to English if none match. A valid saved manual language choice takes precedence over browser preferences on later visits; save it locally across the suite. With no saved choice, follow the browser as above.

## Copyright notices

Include `shared/copyright.js` in applets, before viewport layout measurement and after shared translations. Include the root `LICENSE.txt` in deployments and packages. Reserve the visible footer height instead of overlaying the activity. The shared English/Japanese footer is text only, with no button or terms dialog. Keep the visible full-terms link on the root home page; do not duplicate license text into each app. Preserve the permission for built-in completed-photo exports. Update the root terms and shared notice together when the owner changes the usage policy.

## Builder modes and difficulty

Pizza, Parfait, Sandwich and Class Supplies opt into `config.independentDifficulty`: LEARN/PLAY and EASY/HARD are independent. Preserve the chosen difficulty across mode changes, reload and temporary Restore; retain separate creations per build mode. Difficulty changes language, not saved placement. Pizza uses names/amount bands, Parfait names/counts and sizes, Sandwich initials/origins, and Class Supplies names/colors; app READMEs own those lesson rules. Builder Lab deliberately retains legacy mode-coupled difficulty; do not copy that exception into a new independent-difficulty app. A difficulty control is optional.

Creative interaction modes preserve their own compositions and keep photo export faithful to manual transforms. Shared `piece-gestures.js` supports one-finger dragging and two-finger pinch resizing in Pizza PLAY. Keep gesture rotation disabled; rotation and flipping remain toolbar actions. Apply app-specific size and placement limits through the gesture callbacks, and update size-based language during resizing. Verify pointer transitions, second-finger starts on the canvas outside the selected piece, and cancellation whenever changing gesture handling. The shared workspace moves the existing PLAY tools into the play frame once; responsive CSS handles reserved inset strips. Approved panel-workspace consumers fit bases to the inner toolbar-safe surface, while individual item movement uses the outer play frame. Legacy consumers retain their existing bounds until reviewed. Do not duplicate controls or reparent them into the menu on resize. Preserve tool selection and prevent toolbar pointer events from reaching background deselection or editing gestures. STYLE-GUIDE.md owns the placement and dimensions.

## Public identity and domain

Use **Let’s EiGo!** as the public brand; applet headers retain their activity titles and the shared footer carries the site brand. Use `letseigo.com` in shared copyright attribution. `ActivityHub` remains the repository name; existing `ah-` styles and `ActivityHubI18n` identifiers are internal compatibility names. See the root README for deployment status. Preserve relative app/asset links and do not change DNS, CNAME, or redirects unless domain setup is requested.

## Home page

The root `index.html` is the textbook activity directory. Home-specific layout and translations live in `home.css` and `home-ja.js`; use shared tokens, controls, copyright, and `shared/language-dialog.js`. Add real, available activities to their textbook section and point each app’s back link to that section. Keep lesson vocabulary and grammar examples in English. Update the home page alongside new app releases.

Homepage usage terms open in a native, scrollable dialog with a close button and Escape dismissal; closing returns focus to the opener. Applet footers remain text only. `LICENSE.txt` is authoritative: after editing it, run `node scripts/sync-license.cjs` to update the embedded homepage text. Embedding allows direct local opening without a network request. The license wording remains English; dialog controls support English/Japanese.

Use relative trailing-slash directory URLs for home and applet navigation (for example `apps/pizza/` and `../../#lets-try-2`). Keep `index.html` as the actual entry file. Include `shared/local-links.js` to resolve directory links to explicit entry files only under `file:` for offline use. Public links use HTTPS on letseigo.com.

## Builder engine ownership

Before a Builder functional change, inspect all consumers of the affected shared engine (Pizza, Parfait, Sandwich, Class Supplies and Lab). Shared quantity cycles, retained placements, accessible selection state, EASY/HARD order language, and reset live in `shared/builder.js`; the four reviewed lesson Builders and Lab load that engine. Subclasses own visual geometry/rendering (pizza sauce animation, parfait glass placement). Ingredients, counts, artwork, and nouns live in app configuration. Preserve each app's behavior and run affected consumers' checks after engine changes. Avoid copying functional fixes between applets. Creative editing and photo-export plumbing use shared implementations; food-specific renderers remain local.

The builder engine supports optional `bases` and `sauces` configuration, validated selection, reset defaults, and base-aware order sentences. App subclasses provide `renderBase`/`renderSauce` for visual treatment. Parfait scoops and drizzle remain local; pizza keeps its spiral sauce renderer.

## Featured standalone card app

ほんの手紙 POST lives at `apps/post/index.html` and is featured separately from textbook activities on the home page. Its home-page link opens a new tab. By user request, it retains its own branding, styles, fonts, controls, and layout rather than adopting the shared app shell for now. The home-page feature uses the site design and English/Japanese translations. `apps/post/` is the canonical working copy; the earlier postcard-applet folder is the import source, not the site working copy. No deployment is implied by local integration.

Builder navigation/heading spacing is owned by `shared/builder-layout.css`, loaded by Builder consumers after app base CSS and before shared controls. Check affected consumers whenever changing it; food-stage proportions remain local.

Option paging is a shared opt-in builder feature (`builder-panes.js`/`.css`), independent of ingredient state. The food Builders show their sections together; whole-section paging is a retained optional component, not the current Parfait layout. Never rebuild ingredient controls when changing pages.

Builder placement strategies: the default remains cached circular scatter for Pizza. `placement.mode: ordered-rows` enables selection-order tracking, row reflow, and per-ingredient orientation in the shared engine. This is a retained optional quantity-placement strategy, not Parfait’s current paired-slot interaction. Amount changes redistribute the existing row evenly without recreating pieces; removal closes gaps, re-addition appends a new top layer, and reset clears the order. Run affected placement and app suites for changes.

Paired-layer interaction is implemented by `shared/layer-builder.js`, extending FoodBuilder. Parfait opts into one two-slot row: identical choices produce a uniform row, mixed choices alternate; both difficulties retain direct editing. Parfait overrides sentence rendering: EASY names ingredients and HARD adds counts/sizes. The older slot-dialogue capability is not its active language policy. Quantity mode remains Pizza’s interaction. Parfait no longer uses the earlier click-order quantity-row prototype. Run `tests/check-parfait.cjs` and pizza checks for shared changes.

Pizza’s creative mode is labelled PLAY (formerly FREE/CREATE). Its legacy palette-specific rules remain in `shared/builder-create.css`, not a template for new Builders; behavior and internal free-mode IDs remain unchanged.

Shared `choice-pager.js` pages existing controls within a section without replacing them or changing builder state. Pizza and Parfait now show all nine choices in 3×3 grids and Sandwich shows all 16 in 4×4; Lab exercises paging. This complements whole-section `builder-panes.js`; use the appropriate pattern for the activity. Run `tests/check-choice-pager.cjs` for pager changes.

Builder workspace policy: follow the stylesheet order in STYLE-GUIDE.md and initialize the shared workspace/panel adapter before autosave restoration. Approved panel-workspace consumers use a stable creation frame beside one scrolling choices-and-sentence column. Output grows naturally; there is no old sentence-height reservation below the creation. Phones stack, and extremely short windows deliberately use page flow. My Selfie and My Town retain their separately scoped layouts. STYLE-GUIDE.md owns the exact thresholds, dimensions, and output-box styling. Verify short/long sentences, mode changes, portrait/landscape toolbar arrangements, pronunciation, and all affected Builder consumers after shared workspace changes.

Numbered activity sections use the shared `ah-section-number` component and style-guide heading convention. Keep section numbering stable when switching panes, layers, language, or modes.

The shared engine supports count/size grouping for PLAY summaries; app-specific difficulty rules decide whether to use it. Pizza uses quantity bands rather than spoken sizes; Parfait HARD uses counts/sizes; Sandwich and Class Supplies use their own rules. Shared FoodBuilder owns count/size wording and band classification; each app config supplies countable labels and size policy. Pizza starts at scale 2, ranges 1.25–4 in .25 steps, with small below 1.75 and big at 2.75 or above. Resizing must update the sentence, picker, accessible labels, export, and containment. LEARN language remains unchanged.


## Builder adoption checklist

Reuse shared standards by reference, not by copying a production app. [STYLE-ARCHITECTURE.md](STYLE-ARCHITECTURE.md) maps stylesheet ownership and load order; the app inventory above identifies consumers.

1. Define the lesson's mode and difficulty rules explicitly. Enable independent difficulty where appropriate; keep configuration optional for activities without it.
2. Reuse `builder.js` for common controls/sentences, `layer-builder.js` for paired slots where appropriate, and `creative-builder.js`/`piece-gestures.js` for free composition. Do not replace slot interaction with quantity cycling just to share code.
3. Use the approved panel workspace for applicable new Builders: one scrolling choices/output column, nested tools, independent safe-base fitting and full-frame item bounds. Keep geometry and art local; see the style guide for thresholds and exceptions.
4. Use `builder-autosave.js` for separate creations and temporary recovery; supply validated adapters for app-specific data. Use `builder-photo.js` for preview/download lifecycle and an app renderer for artwork/framing. Lab's Save dialog is intentionally not an exporter.
5. Verify modes, difficulties, languages, long/enlarged text, actual rendered geometry, rapid transitions, reload, Restore, picker recovery and export. Run affected app tests, not only Lab fixtures. Browser checks do not establish physical iPad behavior.

Base and sauce options may supply `buttonLabel` for a shorter choice label while retaining `label` for complete order sentences. Parfait uses flavor-only buttons and full ice-cream names in orders.

Paired-layer ingredients may override the default `layerLayout.pieceSize` with `layerSize` and set `rotation` in app configuration. Use these for visual balance without changing row counts or shared default sizing.

Paired-layer draw order follows row then piece position: each successive fruit overlaps the previous one regardless of ingredient type. Keep ingredient wrappers free of stacking contexts so per-piece depth can interleave; upper rows remain above lower rows. This belongs to layer-builder.js, not Pizza’s ingredient stacking.

Creative editing uses shared/creative-builder.js in Pizza, Parfait, Sandwich, Class Supplies and Lab. App adapters own catalogs, help and geometry; the shared engine owns mode transitions, editing and ordering. Run affected creative, recovery, autosave and export checks. Independent difficulty follows the policy above.

## Multiple-item selector contract

Apply this contract to builders with two or more explicit item slots. Visual specifications belong to “Multiple-item selectors” in STYLE-GUIDE.md.

- Start with slot 1 selected. Adding or replacing an ingredient keeps that slot selected; do not auto-advance. Clearing selects the cleared slot and returns keyboard focus to its selection button. Reset returns to slot 1.
- Each intervening swap button exchanges only its two neighboring slots, including empty slots. Move the complete item state, including source choices and any other item-specific metadata, without recreating or discarding it.
- Selection follows the moved item when the active slot is in the exchanged pair. Otherwise the active slot stays unchanged. Update contextual controls, artwork, and output together; announce the swap through the existing accessible announcement mechanism.
- Disable a swap when both slots are empty or when exchanging them would make no meaningful change. Compare all relevant item state: identical ingredients with different sources must still be swappable.
- Preserve the app’s rendering and sentence rules while updating them to reflect the new slot order. Keep slot editing independent of PLAY placements and ingredient paging.
- Verify swaps in both directions, filled/empty pairs, identical items with different metadata, active selection inside/outside the pair, source retention, reset, and mode isolation. Include keyboard and touch checks when browser/device access is available.

Current implementations are Parfait’s two-slot interaction in `shared/layer-builder.js` and Sandwich’s three-slot interaction in `apps/sandwich/builder.js`. This is a common behavior contract, not a claim that both already use one generic slot component. Reuse the existing shared implementation where it fits; keep app-specific source data and grammar local.

Shared card-sizing defaults live in builder-card-sizing.css; food/reference panel adapters own final density. App row-count variables describe different menus. Follow STYLE-ARCHITECTURE.md for load order and inspect every consumer before changing shared defaults.

CreativeBuilder supports an optional item catalog, artwork callback, and synchronization callback for app-specific editable categories. Parfait adds scoops to this catalog without adding them to LEARN fruit choices; category layer plus insertion order determines both picker order and drawing depth. Syrup artwork remains Parfait-owned.

## Builder PLAY stacking contract

This is the default for every current and future builder using CreativeBuilder.

- `orderedItems()` is the single source of truth for the dropdown and visual depth. First entry is at the back; each later entry is above earlier entries. Repeated ingredient types interleave normally.
- Preserve insertion order within each category. Do not sort by ingredient name, ingredient catalog position, size, or current selection. Selecting, dragging, resizing, rotating, or flipping must not bring a piece to the front.
- An app may explicitly define category `layer` values when needed (Parfait scoops before fruit). Missing values default to zero. Within each category, new pieces and duplicates append after existing pieces; TOP explicitly moves the selected piece to the end of its category, keeping selection and transforms intact; do not regroup individual flavors or fruits.
- After adding/removing items, synchronize drawing depth and picker order. Delete selects the previous displayed item, or the first remaining item if the first was removed; empty lists clear selection.
- Any preview/export must consume the same ordered list. Do not reconstruct PLAY order by looping through ingredient definitions. All CreativeBuilder exports must follow this rule, including Parfait’s scoop/fruit categories.
- LEARN owns its separate composition rules: Pizza uses configured topping order; Parfait alternates its fruit pair. This contract does not change LEARN placement.

When modifying ordering, verify mixed repeated ingredients, duplicates, deletion, selection without reordering, category boundaries, and export parity. Run both creative-editor suites and the affected export checks. Any future user-controlled reorder feature must update this same ordered list rather than introducing a second visual order.

Creative artwork callbacks are cached per piece: transforms update position/scale only, preserving artwork nodes and in-progress animations. Replace artwork only when its content changes (for example syrup flavor). Verify transform operations do not restart decoration animations.

The four reviewed lesson Builders share builder-photo.js for asynchronous image generation, local PNG preview/download, error handling, and object-URL cleanup. App sharing.js supplies SVG composition and caption; Parfait preserves its dessert appearance and PLAY order, while Pizza retains baked-photo artwork. Run check-sharing.cjs and check-parfait-creative.cjs after export changes.

Parfait live/export artwork uses `apps/parfait/glass-art.js` as the authoritative back/front SVG layers with uniformly scaling strokes. Do not restore the superseded non-scaling-stroke/mask implementation. Preserve LEARN ingredient clipping and above-rim content separately from glass drawing.

## Builder pronunciation

FoodBuilder consumers use optional `shared/pronunciation.js` through `FoodBuilder.setSentence` (including paired-fruit and PLAY output). Keep result text unchanged: vocabulary buttons contain only the original phrase, so copying and photo exports continue to use `textContent`. Match configured labels and count nouns longest-first; do not split multiword ingredients. Use approved recordings through `assets/audio/library.js` for exact vocabulary phrases, with complete recorded sequences for supported orders and browser speech for unsupported text or missing/failed clips. Resolve audio relative to the library script for hosted and local use; start on the tap without awaiting a manifest fetch. Stop both audio and speech when another request begins, the sentence changes, or the page is left; ignore failures from interrupted clips. Use an English browser voice regardless of interface language; prefer Google US English when exposed by the browser, then a standard US-English voice, then another standard English voice. Playback starts only on a user tap, replaces previous playback, and stops when the sentence changes or the page is left. Do not speak on ingredient selection. No speech service, API key, or audio upload is added. Device voices and offline availability vary. Verify with `tests/check-pronunciation.cjs` plus affected app checks; physical iPad audio testing remains necessary.

Pronunciation settings are mounted by the shared pronunciation component inside each builder's language dialog. Offer Google US English plus at most two standard English alternatives (first US-English match, then default/other English), excluding novelty voices. Automatic uses the first shortlisted voice; explicit saved choices are honored only within that shortlist. Refresh on `voiceschanged` and dialog opening, and offer explicit preview playback. Save the voice URI/name plus language in `letseigo.englishVoice` local storage (shared by applets on the same origin); blocked storage falls back to the current session. Missing or excluded saved voices temporarily use automatic English without discarding the preference. Voice quality must be judged on actual devices; names and online/local metadata are not quality rankings.

Before an authorized publication, run `node scripts/version-builder-assets.cjs` and include updated entry pages with their changed assets. Commit or deploy only when requested. Builder consumers use content-versioned script/style/icon URLs so returning browsers fetch the matching release rather than mixing cached shared engines with new markup. This does not replace a reload of an already open page, and does not deploy anything. For tablet regressions, distinguish browser-sized desktop verification from physical iPad gesture/audio checks; inspect published assets before assuming a responsive-layout problem.

Speech troubleshooting: Device default (English) explicitly sets en-US without binding a voice object, letting the browser resolve its English default. Keep it available even before voice enumeration completes. Resume a paused speech engine within the tap handler. Cancel a request that has not fired a start/end/error event after ten seconds and show a diagnostic in language settings; clear the timer on stop/start/end/error so older requests cannot interrupt new ones. Do not assume ordinary audio playback proves browser speech synthesis works. This is a compatibility option, not a confirmed fix for every iPad speech failure.

Speech feedback must cover the entire request, including voice enumeration and utterance construction failures. Show starting feedback synchronously on tap in settings, then browser-reported start/end or failure; do not display these messages beneath the activity. Do not interpret start/end events as proof of audible output. Preserve playback feedback when the voice list refreshes.

## Shared recorded vocabulary

Approved multi-clip questions and output sentences use the shared library resolver and pronunciation player. Resolve the full sequence before playing; unsupported text or any failed clip falls back to speech for the entire sentence. Preserve display/copy/export text, stop the whole sequence when text or selection changes, and load recordings only on a tap. Pizza, Parfait, Sandwich and Class Supplies share this behavior; the Lab retains fallback for unsupported fixtures. Recording coverage, number/initial handling and provenance belong in `assets/audio/README.md`.

The site-wide audio library belongs in `assets/audio/`; its README owns generation/review/format guidance and `catalog.json` owns vocabulary ids and prompts. Applets must reuse approved clips rather than maintain per-app recordings. Generation tools live in `scripts/audio/`. Keep local models, WAV masters, and unreviewed batches in ignored `work/audio/`; only reviewed web audio belongs in published assets. Heart (`af_heart`) at 0.7× is the initial voice target. New clips require review and shared playback verification before entering the production library.

The approved vocabulary library now contains 190 Heart recordings, including corrected banana/bananas. The lesson Builders load the shared library before pronunciation.js. Publish assets/audio along with shared files and app entry pages. The voice setting controls browser-synthesized sentences/fallbacks, not recorded vocabulary. Retain approved provenance in assets/audio/manifest.json.

Homepage builder examples (Pizza, Parfait, Sandwich and Class Supplies) are generated by `node scripts/generate-home-previews.cjs` using production Save renderers. Follow [HOME-PREVIEWS.md](HOME-PREVIEWS.md) for sample compositions, measured framing, dependencies and checks. Artwork/export changes require regeneration, `--check`, `tests/check-home-previews.cjs`, and asset hash refresh. Workspace-fitting changes also require reviewing the measured framing fixture. Decorative icons are separate.

CreativeBuilder supports an optional `onSelect(editor)` callback for contextual controls. Sandwich uses it to update the source dropdown for the selected filling in PLAY as well as LEARN; bread has no source. It follows selection without changing stacking or requiring app-local replacement of editor methods. Source-choice mappings and initials grammar remain sandwich-specific.

ChoicePager supports `data-choice-play-only="true"` options: exclude them from LEARN page counts and reveal them only when expanded for PLAY. Sandwich uses this for editable bread; its fixed bottom bread remains part of the scene.

Builder results use the shared output box without decorative quotation spans. Keep speech/copy/export text and normal sentence punctuation unmodified. Legacy fixed-height output fitting observes text and output bounds and restores preferred font size when content shortens. Approved panel workspaces disconnect that fitting loop and grow naturally. Sentence fitting never mutates builder state or scene transforms.

## Builder Lab staging and rollout

Use `_dev/builder/index.html` as the non-live layout/feature review surface before future Builder rollouts. It consumes shared implementations, with candidate-only fixtures clearly identified in its README. `_dev` is excluded from GitHub Pages/Jekyll in `_config.yml`; any replacement deployment pipeline must exclude it too. Do not add a homepage link or publish the lab. Dated verification belongs in BUILDER-WORKSPACE-VERIFICATION.md; do not append superseded layout instructions to this process reference.

Stage unapproved changes in lab-scoped code, review representative sizes and states, then update the owning guide and shared implementation. Migrate every affected production builder explicitly and run its checks before publishing. Passing lab checks alone does not verify app-specific layout, state, artwork or exports. The current slot component is opt-in and has not replaced the existing Parfait/Sandwich implementations. Pending standards decisions and the device review matrix live in `_dev/builder/README.md`.

My Selfie uses the shared photo lifecycle with opt-in `square: true`: an 800×800 image without a food caption or border. Existing builder exports retain their default layout. Its catalog and original vector artwork live under `apps/avatar/`.

Shared PLAY geometry is owned by CreativeBuilder and builder-workspace: use the inner toolbar-safe region for base fitting and the outer play frame for individual movement in approved panel-workspace consumers. Use measured SVG geometry for hit regions and preserve scene coordinates for exporters. Legacy consumers retain their documented bounds. Run creative tests for Pizza, Parfait, Sandwich and Lab plus `tests/check-play-bounds.cjs` when changing this contract. Verify narrow/large rotated art, duplication, art changes, resize, touch targets and usable-region edge containment; mock geometry checks do not replace physical touch review.


## Automatic local saves

Apps automatically restore the last local state without an opt-in setting or account. Use `shared/autosave.js` with a stable app ID, versioned data-only capture, and a validating restore adapter. Builder apps and the Lab load `shared/builder-autosave.js` after their engines and workspace scripts; Profile Pic registers its own adapter. POST retains its existing draft saver and read-only shared-card behavior.

Save after interactions (debounced), and flush on pagehide/hidden visibility. Keep LEARN and PLAY compositions separate; preserve mode, difficulty, selected slots, source choices, placement, transforms and layer order. Reset replaces the active composition's saved state and must not resurrect it on reload. Never serialize DOM nodes, SVG markup, dialogs, or generated exports. Restore only known catalog IDs, valid sources and bounded numeric values; ignore corrupt or incompatible data. Storage failures must not disable the app. Add meaningful restore/reset/invalid-data checks when creating or changing an adapter.

These saves stay in the current browser on the current site, with separate keys per app and a separate Lab key. No email, account lookup or cloud synchronization is involved. Clearing site data removes saves; shared-device users share the saved state. Browser storage may be unavailable or temporary, and file:// persistence varies by browser. Do not promise permanent storage. Use `node tests/check-autosave.cjs` for shared and Builder restoration checks, and retain POST's existing draft tests. Manual language and voice choices are suite-wide local preferences.

App QR links use explicit canonical https://letseigo.com/ entry paths via the page-qr script’s data-app-path attribute. Never encode file paths, localhost, query strings, shared-card payloads or stored user creations. The shared high-error-correction encoder lives in shared/qr.js with its BSD notice in shared/qr-LICENSE.txt; POST card QR also consumes this engine. Keep function patterns intact under the central mark, test decoding of the final branded image, and preserve the four-module border. No external QR service is used. Future applets include this header action.

## Blog post type

`shared/blog-post.js` and `shared/blog-post.css` own guided post editing, preview, image limits, validated local draft state, and viewport-contained scrolling. Lesson vocabulary/templates live in each app configuration. The first consumer is `myblog/NH6-5/`; its README documents the API and verification. Reuse avatar catalog/art via a validated adapter; never start the avatar editor inside a post. Blog drafts use the shared autosave read/write format, with explicit writes to report failures. Unlike Builder snapshots, blog snapshots include bounded, resized JPEG data for student-selected pictures. Keep these local and validate restored data. Narrow/short screens switch between Post and Photos rather than stacking a whole-page scroll.

My Blog lessons are grouped under `myblog/<textbook-unit>/`, starting with `myblog/NH6-5/` for NEW HORIZON Elementary 6 Unit 5. Keep the reusable engine in `shared/` and each lesson’s vocabulary, artwork, and entry page in its lesson directory. Give future lessons distinct storage IDs; NH6-5 retains its original `world-blog` ID to preserve existing hosted drafts.

Blog sentence templates contain free inline text fields with bounded lengths; repeated field IDs stay synchronized without rebuilding the active input. Keep typed English outside interface translation. Read the author name from the homepage’s versioned `letseigo.profile` record. Blog Share supplies `shared/blog-snapshot.js` through the optional canvas renderer in `shared/builder-photo.js`, reusing its preview, download, cancellation and URL cleanup. Existing food/avatar export paths retain their behavior.


## Recolorable objects and export proportions

Class Supplies demonstrates per-object PLAY colors: duplication preserves color, local restore validates it, and inventory sentences group matching item/color pairs while keeping different colors separate. LEARN may use one color per item type. Keep the selected-object preview, swatch state, sentence and export synchronized; changing selection must not remove an object or change its stacking order. Difficulty-specific color language remains lesson configuration. The visual pattern is documented in STYLE-GUIDE.md; extract a shared component when another app adopts it rather than copying this implementation.

For image exports, give the source SVG explicit dimensions with the same aspect ratio as its viewBox and fit it proportionally into the photo area. Verify both LEARN and PLAY at wide and tall editor sizes. When a lesson uses fixed photo framing, keep its scale and crop identical across modes rather than fitting PLAY to the editor viewport; document edge cropping in that app's README. Background scenery remains app-specific.

Homepage discovery uses home.js to filter existing cards by title, unit, description and optional data-keywords, combined with a textbook selector. Keep full cards and textbook/unit order for now; hide empty sections, announce result counts, and support English/Japanese UI and a Show all reset. Add new activities with searchable metadata and a current artwork preview. An expandable compact grid is a future design direction, not implemented yet.

Builder PLAY clears piece selection on a primary click/tap on unoccupied play-area space, including outside the food silhouette. Do not remove items or interrupt an active drag/two-finger gesture. Interactive scene controls retain their own selection actions. LEARN apps with scene selection may opt into the same background callback.

Pronunciation is optional: shared Builder sentence rendering must preserve plain text and allow artwork/state initialization when voice setup or rendering throws. Do not repeatedly retry failed initialization on Reset. App-specific vocabulary should pass extra phrases to the shared setSentence method rather than constructing a separate pronunciation instance. Pizza, Parfait, Sandwich, Class Supplies and Builder Lab use this fallback.

My Blog supports `mode: 'free'` for junior-high writing: a title and multiline body with independent lesson storage, preserving paragraph breaks. NH1-5 is NEW HORIZON 1 (Junior High Year 1), ordered after NEW HORIZON Elementary 6. Its optional read-only sample modal uses configured author/title/paragraphs and never populates the student draft. Keep new blog lessons unlisted while under development unless rollout is requested.

NH1-5 opts into the three-step blog designer with `design: true`. Shared `blog-layout.js` owns positions/collision resolution and text wrapping; both Design and Share consume its computed arrangement. Save stable photo UIDs and validated layout data, migrate older drafts, and automatically include every source element. Keep NH6-5 guided TYPE/WRITE behavior unchanged. Run `tests/check-blog-layout.cjs` and `tests/check-blog-post.cjs` for changes, plus browser checks for source deletion, automatic inclusion, reset, layout restore, tabs and export parity.

## My Blog engine reference

Use [MY-BLOG-ENGINE.md](MY-BLOG-ENGINE.md) for the JHS/ES variant contracts, ownership, configuration, persistence and current checks. JHS uses NH1-5 as its reference; ES retains NH6-5-specific behavior pending a separate review.

## Local achievements and app visits

Writing completion rules and ledger ownership live in `MY-BLOG-ENGINE.md`; Profile presentation lives in the style guide. Shared achievement state is independent of app drafts, and future award families should extend that shared system rather than store badges inside app saves.

`shared/app-usage.js` counts local app visits for future practice levels. All current `apps/*` and `myblog/*` entry pages load it with a stable `data-app-id`; the homepage and development Lab do not count. Add it to new student applets. `letseigo.usage` version 1 stores each app's visit count and most recent counted visit timestamp, with a 30-minute per-app cooldown to avoid counting reloads and quick returns. It measures access, not engagement time or completed learning, and has no visible level UI yet. Counts stay in this browser and fail harmlessly if storage is unavailable. They are not analytics sent to a server. Shared browser users share counts; clearing site data removes them. Tests live in `tests/check-achievements.cjs`.

Recorded sentence playback prepares only the requested clips on tap and schedules decoded audio continuously where Web Audio is available, avoiding a new media load at each word boundary. Preserve cancellation, whole-sentence fallback, bounded clip caching, and approved source files. Run tests/check-joined-audio.cjs alongside pronunciation/library checks; real-device listening remains necessary to assess pacing.


### Temporary Builder reset recovery

Use `BuilderReset` in shared/builder-autosave.js for whole-creation recovery. Keep one in-memory snapshot per app/mode; the same Reset action becomes Restore. Restoring must preserve other-mode edits, selections, transforms, order and app-specific data. Adding new content discards that mode’s snapshot; empty resets must not replace it. Do not serialize recovery or add individual-deletion history. Flush the actual cleared/restored creation through autosave immediately after success; failure handling below protects persisted data and pending recovery. Trusted temporary restoration must not apply the persisted-save item-count cap. Grid-map adapters supply their own capture/restore and content signature. Run check-reset-recovery, check-class-supplies, check-autosave and app-specific export checks; verify mode isolation and reload behavior in the browser.


### Approved panel-workspace rollout — 2026-11-05

Class Supplies' reviewed layout is now a shared opt-in (`builder-panel-workspace.css/js`) consumed by Pizza, Parfait, Sandwich and Builder Lab as well. STYLE-GUIDE.md owns its visual/geometry contract. Keep app export coordinate mappings local; use the shared square frame union instead of copying another app's drawing geometry. Preserve normalized saved state, per-mode Reset/Restore, and existing pronunciation nodes when relocating output. My Selfie/My Town are not opted in.

For future integration, test base fitting separately from outer-frame placement; move large/rotated pieces to all edges and beneath tools, recover through the picker, reload, Restore, and export. Picker recovery intentionally changes stored coordinates. Include full-frame export margins in visual review. Run `check-panel-workspace.cjs`, `check-photo-framing.cjs`, workspace/base-fit/creative/bounds, recovery/autosave and each affected app's suites. Browser results and outstanding physical-device checks belong in the rollout verification note, not a second set of style rules.

Local rollout measurements, interaction results and remaining device checks: [Builder workspace verification](BUILDER-WORKSPACE-VERIFICATION.md).

## Shared styling maintenance

Use the ownership map in [STYLE-ARCHITECTURE.md](STYLE-ARCHITECTURE.md) alongside the style guide. Before removing an override, inspect every consumer, generated state and responsive condition; compare rendered results before and after. Preserve intentional artwork and family-specific geometry. Record exceptions with their owner and reason rather than adding more-specific patches.

Run `node tests/check-style-ownership.cjs` after styling changes. Refresh hashes with `node scripts/version-builder-assets.cjs`, then verify with its read-only `--check` option. Include newly referenced stylesheets in the eventual publication together with their consumers; an HTML hash does not ensure a new file was committed. Keep browser/device verification honest and separate from static checks.

### Mode restore visibility regression

Verify rendered geometry as well as state using the [Restore safety contract](#restore-geometry-and-failure-safety) below. Regression fixtures must retain the real editor: the Sandwich fixture’s deliberate audio-failure check temporarily nulls it, so autosave coverage must restore that editor before testing PLAY. Include rapid switches, pending autosave, mode-specific origins and reload in either mode.

### Builder update ownership and performance checks

- `builder-workspace.js` owns geometry observation and schedules one animation-frame transaction for related surface, frame, preferred-frame and mode-class notifications. Fit first, then invoke the editor's repaint callback. Panel adapters register additional measured boxes through `surface.observeLayout`; do not install competing fitting observers. Explicit synchronous mode/geometry operations may still use `surface.fitArtwork()` when coordinates are needed immediately.
- `creative-builder.js` owns active PLAY repainting and stacking. Inactive pieces are retained without resize paints and are painted when activated. A sync transaction sorts once, assigns stack indices, and shares that order with sentence/picker consumers. Do not sort the full list from each piece's paint method.
- App artwork adapters invalidate appearance only when its inputs change. Class Supplies caches the rendered color of the case, palette icons and pieces; geometry-only gestures must not rebuild every SVG.
- `LayerBuilder.updateSlotControls()` updates slot UI independently of language. A custom sentence renderer (currently Parfait) calls it as needed and renders its own sentence once; do not call the parent's sentence renderer first.
- `BuilderReset` restores the active creation, not global language preferences. `independentDifficulty` apps retain the current EASY/HARD setting even if it changed since Reset. Legacy mode-coupled consumers retain their previous recovery semantics. Recovery stays temporary and mode-scoped; adding a new item invalidates it. This changes no saved-data format.
- Run `tests/check-builder-update-work.cjs`, `check-reset-recovery.cjs`, `check-class-supplies.cjs`, workspace/fitting, autosave, audio and export checks for changes to these paths. Operation counts from fixtures are not browser frame-rate measurements. Include real-browser resize, scroll/focus and activation checks, and identify physical iPad testing separately.

### Restore geometry and failure safety

`CreativeBuilder.switchMode()` owns user mode/state changes; `renderMode()` applies the already-selected final state to the interface. The autosave adapter hydrates LEARN and PLAY data, calls `renderMode()` once, then mounts pieces with saved coordinates preserved. Do not simulate user mode toggles to rebuild hidden creations. Inactive artwork remains mounted but invisible, inert and aria-hidden; resize callbacks still skip its JavaScript paints. Visual opacity is coalesced to the final mode in a microtask; state, inertness and accessibility update synchronously. This trades a retained layout subtree for reliable sizing without forced layout flushes.

Geometry-dependent fitting, bounds and pointer movement must reject zero/non-finite dimensions before division or coordinate assignment. Keep last valid positions/fit; normal resize notification or mode activation resumes work. Existing invalid saved axes recover independently to the validated default (50), retaining the item and valid other axes. Save format is unchanged.

Reset/Restore retains its retry snapshot on failure, attempts to roll back the pre-restore state, announces failure in the existing status region, logs the local error, and inhibits autosave until a successful retry. If initial page-load restore throws, protect the existing saved record for the rest of that session and announce a reload retry; do not silently overwrite it with partial/default data. These diagnostics send no telemetry or saved snapshots.

Use `_dev/builder/restore-check.html` on an isolated local origin for real rendered-bounds regressions (not just state fixtures). It backs up/restores each tested app save key. It checks empty LEARN/PLAY, the full reported Parfait sequence, both populated, difficulties, repeat/add, visible SVG and hit boxes, keyboard selection/movement, reload, rapid mode changes, resize, language and Save preview. The fixture uses synthetic DOM clicks; separately verify actual pointer drag and physical iPad touch. Run `check-restore-failures.cjs`, autosave/recovery, geometry/bounds, gestures and Pizza reload-animation suites alongside it.

Reset captures recovery **before** clearing starts. Autosave is blocked during the operation and after a failed clear/restore until every failed mode has recovered successfully. A failed mode retains its original retry snapshot even if partial rendering or subsequent edits trigger refresh; unlike a successful Reset, adding content cannot discard this safety snapshot. Custom `BuilderReset.connect` consumers must forward `recovery.canSave()` to their autosave adapter. Fault injection should cover before mutation, partial mutation, rendering/post-clear capture, failed retry, cross-mode recovery and pagehide.

## Site theme rollout

All maintained suite entry pages, including POST, Blog, Lab and the interactive guide, load shared/theme.js synchronously before CSS. Use the shared tokens and picker; do not duplicate palette definitions or fold theme preferences into app state. Include the bootstrap when creating a new entrypoint. After theme changes run check-themes.cjs, check-themes-browser.cjs and check-style-ownership.cjs, inspect representative applets and refresh/check asset hashes. Preserve documented POST/artwork exceptions. Local-file behavior and already-loaded-page offline selection do not imply offline HTTP reload support: this project has no service-worker offline shell. Report storage, browser and physical-device limits separately.
