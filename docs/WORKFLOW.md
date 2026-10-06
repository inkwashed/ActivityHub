# ActivityHub applet workflow

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
- Use the shared design system for common controls. Do not fork palette, hover behavior, icons, or mode switches into app-local CSS.
- Preserve accessibility: native semantic controls, accessible labels, keyboard operation, visible focus, adequate touch targets, and reduced-motion behavior. Detailed visual specifications belong in the style guide.
- Let the main activity grow with available width and height. Allow scrolling when needed rather than clipping controls, long prompts, or enlarged text.
- Keep optional language complexity in EASY/HARD modes where relevant. Do not force a mode switch into an activity with no meaningful difference between modes.
- Preserve the common header order defined by the style guide. Textbook-back destinations must be explicit rather than relying on browser history. Unavailable destinations/languages must be clearly marked; do not present placeholders as completed features.
- Keep repository source authoritative. Old chat attachments, generated output folders, and ZIP releases are snapshots, not working copies.

## Build a new applet

1. Read this file and the style guide. Identify the textbook/unit, learning goal, target phrases, student interaction, and requested scope. Resolve only decisions that materially affect the activity; do not expand into unrelated features.
2. Create `apps/<name>/` with a clear entry point and small activity-specific files. Reuse `shared/` assets via relative paths. Load shared tokens first, app layout styles second, and shared controls last.
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
| Pizza Builder | `apps/pizza/index.html` | `node tests/check.cjs`, `node tests/check-fullscreen.cjs`, `node tests/check-sharing.cjs` from repository root | Mock-based checks; physical iPad visual/download checks outstanding. Textbook back link is a placeholder; English/Japanese interface language is supported. |

Shared today: design tokens, control CSS, and the language, Reset, and camera icons. The visual guide consumes those actual shared files.

Still app-local today: header markup, fullscreen logic, language dialog, viewport measurement, sentence generation, and photo export. Their common portions may be extracted when another app needs them. Do not claim they already update across multiple applets, and do not blindly generalize pizza-specific export or placement geometry.

Add a row when an applet is created. Update coverage as shared behavior is extracted. Preserve activity-specific details in the app's own documentation.

## Packaging and publishing

The repository structure includes both `apps/` and `shared/`. Moving only an app folder loses shared assets. For portable releases, preserve those relative paths and put a clear entry-point instruction in the package. Keep generated releases separate from source.

Deploy only when requested as part of the current work. Identify the destination, validate relative paths, publish shared assets together with app updates, and verify the resulting URL. Do not imply that a local update is already live. Hosting should remain replaceable; avoid provider-specific dependencies in app code.

## Decision history

- Initial workflow: central process reference, separate visual specification, shared executable styles, per-app exceptions, and explicit multi-applet rollout checks. Based on the current Pizza Builder and ActivityHub design system.

Add concise entries for consequential changes to project standards; routine activity edits belong in their app notes.

## Interface language boundary

Use `shared/i18n.js` for interface language and `shared/ui-ja.js` for common Japanese control translations. App-specific instructions belong in `apps/<name>/ui-ja.js`. Mark only interface text with `data-i18n`; never translate lesson vocabulary or target grammar. Mark English learning regions with `lang="en"` even when the document language is Japanese. Switching language must not change activity state. On startup, match browser/system language preferences in order to supported languages, including regional tags such as ja-JP. Fall back to English if none match. Manual selection lasts for the page visit and is not overridden during that visit.

## Copyright notices

Include `shared/copyright.js` in applets, before viewport layout measurement and after shared translations. Include the root `LICENSE.txt` in deployments and packages. Reserve the visible footer height instead of overlaying the activity. The shared English/Japanese footer is text only, with no button or terms dialog. Add the visible full-terms link to the ActivityHub home page when it is built; do not duplicate license text into each app. Preserve the permission for built-in completed-photo exports. Update the root terms and shared notice together when the owner changes the usage policy.
