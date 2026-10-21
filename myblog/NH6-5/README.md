# My Blog: Where is it from?

NEW HORIZON Elementary 6 Unit 5. Entry `myblog/NH6-5/`; unlisted on the homepage. Shared implementation reference: [My Blog engine](../../docs/MY-BLOG-ENGINE.md).

## ES Post editor

`mode: 'guided'`, `design: true` uses Post/Photos/Design. Photos, Design and Share use the same shell and shared behavior as JHS. Only Post differs: four segmented sentence rows with Show Help? enabled by default. Help shows grey placeholders for standard phrases and faded theme-green placeholders for variable answers in both TYPE and WRITE modes. Entered text and handwriting remain dark. Turning it off hides all placeholders. The same fields remain editable and identically sized in both modes; all typed text survives toggling and reloading. Punctuation stays supplied.

Answer placeholders are my sweater, New Zealand, Oceania and beautiful. They are green hints only: never saved as answers or included in exports. All three country fields are independently editable. Fields allow 80 characters each. Untouched rows do not create written content; partially completed rows display underscores for missing answers in Design/Share. Only typed content contributes to the output; help never supplies words automatically. The computed body produces one movable text block per nonempty row.

`config.rows` lists field IDs per sentence. Fields with `help` provide the guided frame; fields with `placeholder` are answer fields. No automatic country synchronization or correction is performed. Reset layout only resets the arrangement/crop, preserving writing and photos. No whole-post Reset or example-fill button is provided.

## Compatibility

Keep draft ID `world-blog` and version 1. On first migration only, old country values populate the separate country fields to preserve existing writing. A saved `showHelp` flag distinguishes new drafts; subsequent input never copies across fields. Photos receive stable UIDs through the shared normalization path. `fields.body` is derived from the active help mode for the shared designer and journal. Old uploaded photos and answers survive; the obsolete cap placeholder remains discarded.

The shared profile adapter, QR dialog, photo rotation/cropping, three-image limit, natural-height Share preview, and local PNG download are inherited. No changes to the homepage profile occur.

## Checks

- `node tests/check-blog-post.cjs`: ES/JHS validation, legacy migration, independent country answers, non-answer placeholders and authored frames.
- `node tests/check-blog-es-browser.cjs`: help toggle, preserved inputs/reload, shared tabs/photos/design/export and responsive page bounds. Uses the same Playwright / CHROME_PATH / BLOG_BASE_URL setup as the JHS suite.
- Physical iPad handwriting, virtual keyboard and Safari checks remain pending.

The first frame is “This is” so students supply their own determiner/possessive with the item. Input fields flex to use available row width, with extra room for the item description; narrow screens wrap fields without horizontal page overflow.

Post uses transparent fields over repeating handwriting guides: black outer rules and dashed midline, with the writing baseline from the theme’s green `--ah-selected-border`. The writing area prefers locally installed Comic Sans MS, then Chalkboard SE/Chalkboard and a cursive fallback, for single-storey letterforms. No proprietary font is bundled; appearance depends on installed fonts. Focus outlines remain visible. JHS and exported typography remain unchanged.

Field widths now follow measured typed text, growing and shrinking during input. Empty fields reserve their help/example width even when hints are hidden. Each field can wrap independently; the period stays with the final field. Width is capped to the row so very long single-field text scrolls inside its input.

## TYPE / WRITE

The profile row has a shared-style pill switch. TYPE retains the existing editable fields. WRITE uses `shared/blog-ink.js`: one pad per sentence, Pen, whole-stroke Eraser, and per-pad Undo (last 20 actions during the session). Help overlays faint example words with no supplied periods. Guides and help are never exported as handwriting. Switching modes preserves both forms of work; Share and Journal show the active mode.

Below 600px pad width, each sentence presents two consecutive writing lines. Strokes use one canonical 816×120 sentence coordinate space: the second line maps to x=408–816. Returning to a wide view joins the two segments, and Design/Share/Journal render them as one sentence strip. This is geometric composition, not handwriting recognition. Four handwriting blocks remain available in Design, with separate placement from typed text.

Version-1 state now also includes `inputMode`, `ink` (four arrays of strokes/points), and `inkLayout`. Legacy drafts default to TYPE with empty ink. Points are finite, clamped and rounded; each pad allows at most 256 strokes and each stroke 512 points, with long active strokes resampled. Undo history is transient. Completed strokes, erasures and undos persist locally. A canceled pointer rolls back its action. Drawing captures one pointer; scrolling remains available outside pads. Basic stylus palm rejection cannot be guaranteed.

Checks: `tests/check-blog-ink.cjs` and `tests/check-blog-ink-browser.cjs`, plus the existing ES/JHS browser suites. Browser mouse-driven checks do not prove physical iPad stylus or palm behavior; school-device testing remains required.

Handwriting rows now stay 64 CSS pixels tall, matching TYPE guide positions (16/30/47/57px) and 34px help text. Existing 816×120 stroke coordinates remain intact; only their on-screen mapping changes.

Writing controls use accessible pen, eraser, and undo icon buttons beside each sentence heading. Pen/eraser selection stays synchronized across all pads; undo applies only to its sentence.

The Post panel keeps its heading, Show Help toggle, and avatar/TYPE–WRITE row fixed. Only the sentence area scrolls in either mode.
