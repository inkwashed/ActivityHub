# My Blog: Where is it from?

NEW HORIZON Elementary 6 Unit 5. Entry `myblog/NH6-5/`; listed under NEW HORIZON Elementary 6 on the homepage. Shared implementation reference: [My Blog engine](../../docs/MY-BLOG-ENGINE.md).

## ES Post editor

`mode: 'guided'`, `design: true` uses Post/Photos/Design. Photos, Design and Share use the same shell and shared behavior as JHS. Only Post differs: TYPE has one continuous textarea per sentence, with Show Help? enabled by default. Samples show standard phrases in grey and variable answers in faded theme green. While focused, actual text replaces sample characters from the start, leaving the remaining sample suffix visible. On blur, nonempty sentences show only entered text; empty sentences retain the full sample. Turning help off hides all samples without changing answers. Students enter punctuation themselves. Capitalization, autocorrect, and spellcheck are disabled.

Each sentence allows 320 characters and wraps along the existing 64px writing guides. Enter advances to the next sentence; IME composition is left intact. Help is visual only and never saved or exported. The computed body produces one movable text block per nonempty row.

## Compatibility

Keep draft ID `world-blog` and version 1. `typedRows` stores four complete sentences, and `fields.body` derives from these for Design and Journal. Existing segmented drafts migrate once using their previous rendered sentences, preserving typed text and missing-field underscores. Once `typedRows` exists, clearing a sentence never restores old field data. Legacy fields remain for compatibility; photo and handwriting data stay intact.

The shared profile adapter, QR dialog, photo rotation/cropping, three-image limit, natural-height Share preview, and local PNG download are inherited. No changes to the homepage profile occur.

## Checks

- `node tests/check-blog-post.cjs`: ES/JHS validation, legacy migration, independent country answers, non-answer placeholders and authored frames.
- `node tests/check-blog-es-browser.cjs`: help toggle, preserved inputs/reload, shared tabs/photos/design/export and responsive page bounds. Uses the same Playwright / CHROME_PATH / BLOG_BASE_URL setup as the JHS suite.
- Physical iPad handwriting, virtual keyboard and Safari checks remain pending.

Post uses transparent fields over repeating handwriting guides: black outer rules and dashed midline, with the writing baseline from the theme’s green `--ah-selected-border`. The writing area prefers locally installed Comic Sans MS, then Chalkboard SE/Chalkboard and a cursive fallback, for single-storey letterforms. No proprietary font is bundled; appearance depends on installed fonts. Focus outlines remain visible. JHS and exported typography remain unchanged.

## TYPE / WRITE

The profile row has a shared-style pill switch. TYPE retains the existing editable fields. WRITE uses `shared/blog-ink.js`: one pad per sentence, Pen, whole-stroke Eraser, and per-pad Undo (last 20 actions during the session). Help overlays faint example words with no supplied periods. Guides and help are never exported as handwriting. Switching modes preserves both forms of work; Share and Journal show the active mode.

Below 600px pad width, each sentence presents two consecutive writing lines. Strokes use one canonical 816×120 sentence coordinate space: the second line maps to x=408–816. Returning to a wide view joins the two segments, and Design/Share/Journal render them as one sentence strip. This is geometric composition, not handwriting recognition. Four handwriting blocks remain available in Design, with separate placement from typed text.

Version-1 state now also includes `inputMode`, `ink` (four arrays of strokes/points), and `inkLayout`. Legacy drafts default to TYPE with empty ink. Points are finite, clamped and rounded; each pad allows at most 256 strokes and each stroke 512 points, with long active strokes resampled. Undo history is transient. Completed strokes, erasures and undos persist locally. A canceled pointer rolls back its action. Drawing captures one pointer; scrolling remains available outside pads. Basic stylus palm rejection cannot be guaranteed.

Checks: `tests/check-blog-ink.cjs` and `tests/check-blog-ink-browser.cjs`, plus the existing ES/JHS browser suites. Browser mouse-driven checks do not prove physical iPad stylus or palm behavior; school-device testing remains required.

Handwriting rows now stay 64 CSS pixels tall, matching TYPE guide positions (16/30/47/57px) and 34px help text. Existing 816×120 stroke coordinates remain intact; only their on-screen mapping changes.

Writing controls use accessible pen, eraser, and undo icon buttons beside each sentence heading. Pen/eraser selection stays synchronized across all pads; undo applies only to its sentence.

The Post panel keeps its heading, Show Help toggle, and avatar/TYPE–WRITE row fixed. Only the sentence area scrolls in either mode.

Handwriting autosave waits for two seconds after the last stroke/undo. Starting another stroke cancels the pending save until the pen lifts again. Leaving or hiding the page flushes pending handwriting. The writing area disables native text selection and touch callouts.

WRITE pads start unselected with sentence headings/tools hidden. Tap a pad to activate it; only that pad accepts strokes and displays tools plus Done. Selection stays locked until Done is pressed (or the user leaves WRITE mode); outside taps and taps on other sentences do not switch or close it. Pen, eraser, and undo sit beside the sentence title; Done stays at the right. A small inset separates content from the selection border. Inactive pads support scrolling. Active canvases cancel native touch gestures, and WRITE mode suppresses page text selection to avoid iPad selection between strokes.

Country hints use the editable starter countryNames list in config and fields marked country: true. A recognized country followed by whitespace or punctuation aligns the sample suffix to the next phrase without inserting any text. Matching is case-insensitive and supports multiword names/aliases. With Show Help on, an unrecognized completed name gets a muted squiggle; partial matches (such as “New ”) wait. The list is classroom vocabulary, not an exhaustive country or spelling authority. Hints never affect saved/exported answers.

Variable sample words now yield to original vocabulary: a differing in-progress word suppresses only that sample word, preserving the following space and words. A typed space consumes that separator and advances to the next sample word. Matching prefixes retain their remaining letters. Country alignment and squiggles are preserved; only the visible hint changes.

With Show Help on, completed misspelled standard words receive the same muted squiggle. In-progress words wait until a separator or blur. Comparison ignores capitalization and accepts curly apostrophes. Country boundaries anchor following phrases; unconstrained item/description words are not spellchecked.

Country and continent sample words use the same mismatch skipping as other variables. The configurable continentNames list checks the continent after “is in”; unknown completed names get a squiggle, while partial multiword names wait. This validates names only, not country–continent associations.

Recognized country/continent names use a double underline on lowercase letters that should be capitalized according to their configured spelling (including initials in multiword names and acronyms). Lowercase articles such as “the” remain allowed. This visual hint follows Show Help and is never exported.
