# My Blog engine

This is the implementation reference for the My Blog family. Project process remains in [WORKFLOW.md](WORKFLOW.md); shared visual standards remain in [STYLE-GUIDE.md](STYLE-GUIDE.md). Lesson READMEs own prompts, samples, and exceptions. JHS and ES are internal classifications, not labels shown to students or separate Git branches.

## Variants and consumers

| Variant | Reference | Contract |
| --- | --- | --- |
| JHS | `myblog/NH1-5/` | Free title/body writing, Write/Photos/Design tabs, read-only Sample, three-column composition, layout-only reset |
| ES | `myblog/NH6-5/` | Guided or independent sentence-frame writing, independent answers, Post/Photos/Design and layout-only reset |

New JHS lessons should follow NH1-5's structure with different prompts and samples. ES shares Photos/Design/Share with JHS while keeping its guided Post editor. NH1-5 is listed under NEW HORIZON 1 on the homepage; NH6-5 remains unlisted. There is no separate JHS Lab yet: any future lab must have its own draft ID, remain unlisted, and preserve shared relative paths.

## Ownership

- `shared/blog-post.js`: state validation, writing controls, uploads/rotation/deletion, autosave, profile/avatar adapter, tabs, Sample, and Share capture.
- `shared/blog-post.css`: base shell, inline/free writing, photo rows and sample article.
- `shared/blog-layout.js`: pure layout model, text splitting/wrapping, source inclusion, collision resolution, swaps, crop offsets.
- `shared/blog-design.js` / `.css`: JHS selection, toolbar, crop sliders, preview fitting and three-tab geometry.
- `shared/blog-snapshot.js`: variable-height webpage PNG, including header, profile, composition and activity credit.
- `shared/builder-photo.js`: existing shared async preview/download lifecycle, cancellation and object-URL cleanup. Food renderers remain independent.
- Shared tokens, controls, icons, translations, autosave, fullscreen, local links, QR and copyright provide suite-wide behavior. Do not copy these into lesson code.

## Creating a JHS lesson

Copy the NH1-5 lesson shell into `myblog/<textbook-unit>/`, update its manifest, title, textbook label, back destination, QR path and lesson README. Keep the new lesson unlisted until release is requested.

Configuration requires a unique `id`, `mode: 'free'`, `design: true`, an activity `title`, `images: []`, and `fields` named `title` and `body`. Use `multiline: true` on body. Current limits are 120 title characters and 2,000 body characters. Each field supplies a label, maximum length and default. `sample` supplies title, author and paragraphs; its portrait is a local asset. The NH1-5 portrait generator uses `config.sample.avatar`; other lessons should provide their own sample asset rather than overwriting Fumiya.

The entry script mounts its configuration through `BlogPost.mount`. Preserve the reference shell's IDs: `blog-title`, `blog-body`, `blog-avatar`, `blog-author-name`, `blog-upload`, `blog-images`, `blog-gallery`, `blog-status`; tab buttons and `data-blog-view` / panel attributes; Design grid, picker, toolbar, crop and help controls; Sample and Share dialogs. `blog-reset` is optional and absent in both current three-tab variants. The renderer is DOM-coupled: configuration alone is not a replacement for this shell.

Load tokens, blog base styles, shared controls and the scoped JHS styles. Load layout/design before mounting the app, and load avatar config/art plus the shared services used by the reference. Interface labels and accessible names translate; authored content and lesson English remain English.

## State and persistence

Drafts use `letseigo.app.<id>`, version 1. NH6-5 retains `world-blog`; NH1-5 uses `myblog-nh1-5`. State contains `fields`, up to three `images`, and JHS `layout`. Never reuse an existing lesson's ID for another lesson or lab.

Photos are decoded locally from JPG/PNG/WebP, limited to 15 MB input, resized to a maximum dimension of 960px and saved as validated JPEG data URLs. Rotation re-encodes the photo clockwise by 90 degrees. Uploaded photo UIDs stay stable through layout changes and rotation. Older photos receive deterministic legacy UIDs. Storage failure is reported; local drafts are not permanent backups. No external upload occurs.

The adapter reads the homepage name from `letseigo.profile` and validated avatar parts from `letseigo.app.avatar`. Missing data uses the default silhouette/name. Share serializes the avatar SVG at an explicit 512px size. Lesson actions must not overwrite the shared profile.

## Layout contract

Each non-empty explicit line becomes a numbered text element; blank lines are ignored and visual line wrapping does not create new elements. The first key remains `text` for compatibility; later keys are `text:1`, `text:2`, etc. Text placement follows its numbered position when lines are inserted or deleted. Photos use `photo:<uid>`.

`layout: null` means automatic placement: photos across the top, full-width text sections below. Custom arrays store key, column, row, width, photo height and crop offsets. Validation removes stale sources and includes any missing/new source automatically. Design never deletes source content.

The model uses 816 logical pixels, three columns, 12px gaps and 120px rows. Widths span 1–3 columns; photos span 1–3 rows. Text height is calculated from wrapping and grows to fit. Adjacent vertical/horizontal moves swap order; moves into empty space nudge one grid unit. Remaining collisions push blocks downward. Manual downward movement stops at row 24; long text can extend farther.

Selection works through the element picker or block buttons. Blank canvas clicks deselect. Toolbar controls disable at applicable limits. Photos cover their blocks; 0–100 crop offsets default to 50. Sliders appear only for cropped axes. Reset layout clears custom placement/cropping and preserves all writing/photos.

## Viewport and Share

JHS stays within the stable viewport. Write's body field scrolls internally; Photos, Design's canvas and its editing panel have intentional scroll regions. Short-window Design may scroll its workspace. Keep shared 44px controls and visible keyboard focus; do not shrink the entire interface to fit. Textbook/unit information remains visible.

Share is a natural-height webpage snapshot, never forced square. Its modal uses the shared dialog frame, with a keyboard-focusable scrolling image region. Heading/status and centered shared Download action remain outside that region. Only the preview scrolls for tall posts. Sample/help retain native dialog behavior and shared styling.

Preview and export consume the same computed layout and crop offsets. Exports include rounded frame/photo corners, a 96px logical avatar, and `Let's EiGo! ・<activity title>` at lower left. Rendering normally uses 2× resolution, capped at 16,000px output height. Export layout is independent of the current screen size. Closing Share cancels pending work and releases its URL.

## Verification and releases

Run from repository root:

- `node tests/check-blog-post.cjs`: both variants' state, grammar, limits and migration.
- `node tests/check-blog-layout.cjs`: layout, source inclusion, text splitting, swaps and wrapping.
- `node tests/check-blog-jhs-browser.cjs`: current JHS photo rotation/deletion, crop state, reload, export, text sections, deselection, responsive Share and basic keyboard/help checks.
- `node tests/check-sharing.cjs` when shared export plumbing changes.

The browser check needs Playwright available to Node and a local HTTP server. `BLOG_BASE_URL` defaults to `http://127.0.0.1:8776`; `CHROME_PATH` optionally selects installed Chrome. `NODE_PATH` can point to an existing Playwright installation. Older `work/check-*.cjs` files are historical development probes, not the current acceptance suite.

Browser checks do not substitute for physical iPad/Safari, onscreen keyboard, handwriting, image-picker, screen-reader or actual browser-zoom testing. Keep those limitations explicit.

Run `node scripts/version-builder-assets.cjs myblog/NH1-5 myblog/NH6-5` after shared asset changes. Publish consumers and shared files together only when requested. Review both variants for shared behavior changes; do not migrate ES to the JHS UI implicitly.

The shared QR button follows Language in both variants. `page-qr.js` accepts `/myblog/<lesson>/` routes and shares only the public lesson URL, never draft contents. Textbook labels use the shared muted color and textbook/unit wording without a school-level suffix.

JHS consumer NH2-4 (Welcome to Japan) follows NH1-5 with a separate draft ID, a simple homestay-advice prompt and an original starter sample. It is listed under NEW HORIZON Junior High 2 after Junior High 1.

## Journal prototype

`myblog/journal/` is an unlisted, read-only collection of the latest draft per catalogued lesson. It reuses validation/layout/snapshot rendering and supplies blank pages for unfilled slots. See its README for catalog extension and the explicit distinction between a current-draft collection and a future durable, versioned archive.

JHS photo progress/errors stay in Photos; successful uploads clear their progress message. The shared action footer has no routine status text. A save failure remains an explicit global alert until a successful save.

ES guided mode uses configurable rows of field IDs, `help` placeholder text for sentence frames and `placeholder` examples for answers. `showHelp` defaults true and persists; authored frame text remains stored separately. Help only changes placeholder visibility, never field sizing or output. The typed sentence output derives `fields.body` for Design and Journal. Old repeated-country data migrates once; new answer fields never synchronize. See NH6-5 README and `tests/check-blog-es-browser.cjs`.

## ES handwriting

`shared/blog-ink.js` owns bounded stroke validation, pad input and rendering. Load it before BlogPost wherever guided configurations are normalized, including Journal. Guided state has separate `ink` and `inkLayout` data plus an `inputMode` defaulting to type. The shared layout planner accepts an optional ink array and produces `ink:<sentence-index>` blocks; Design and Snapshot use the same stroke renderer. Typed and handwritten layouts are preserved independently. Journal checks strokes when determining written status and renders the active mode. No recognition or external service is used. See NH6-5 README for responsive line mapping, limits and device caveats.
