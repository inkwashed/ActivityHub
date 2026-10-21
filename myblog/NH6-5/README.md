# My Blog: Where is it from?

Entry: `myblog/NH6-5/index.html` (direct URL only; intentionally unlisted on the homepage during development).

First reusable BlogPost consumer: NEW HORIZON Elementary 6 Unit 5. The optional example post is “This is my cap. It's from Vietnam. Vietnam is in Asia. Vietnam is a nice country.” The question is “Where is it from?” New posts and Reset start with blank inline text fields. Students type an item, country, continent, and description; repeated country blanks stay synchronized. All four sentence frames remain fixed. Native text inputs also accept device-provided handwriting input. The example corresponds to Deepa's lesson text without identifying student posts as Deepa.

Organization: `myblog/<textbook-unit>/` groups the family by lesson. This lesson retains the existing `world-blog` storage ID so hosted drafts survive the path change; future lessons need distinct IDs.

## Engine contract

`shared/blog-post.js` owns validated state, inline text fields, sentence interpolation, zero-to-three images, local persistence, preview/edit navigation, and avatar loading. `config.js` supplies a unique storage ID, fields with labels/length limits/defaults, sentence templates, built-in image IDs/paths/alt text, and example state. Another app can reuse the shell and engine with its own configuration. No food Builder engine changes are required.

`shared/blog-post.css` owns a viewport-height grid, bounded header/footer, independently scrollable editor and preview, and Post/Photos switching below 740px width or 600px height. Keyboard users can focus both scrolling regions. Unlike the food Builder phone stack, this requested type keeps page scrolling disabled at all sizes, while retaining controls inside scrollable regions. No whole-interface scale or text-fitting script is used.

Uses shared tokens, controls, icons, language menu, fullscreen, QR, local links, copyright, and autosave read/write helpers. Explicit writes report storage failure. Interface language is English/Japanese; lesson words remain English. No account, separate name field, external upload or publishing is added.

## Pictures and saved data

Posts start without pictures and allow up to three optional images. Every image can be removed, including the last. Old saved cap placeholders are discarded while uploaded pictures and writing are preserved. JPG/PNG/WebP input is capped at 15 MB per file, decoded and resized to at most 960px, and re-encoded locally as JPEG. The saved snapshot contains compressed image data (a necessary exception to the Builder data-only save rule), never original files or their metadata. Storage may fail or be cleared; this is a browser draft, not permanent storage. Reset clears the writing and all images. Use example fills the sample answers. Changing the item text does not change uploaded pictures.

The avatar adapter reads version 1 of `letseigo.app.avatar`, validates parts and colors against `AvatarConfig`, then reuses the existing avatar SVG renderer. No avatar UI/bootstrap is loaded. Missing, corrupt or unavailable saves use `shared/icons/profile-default.svg`. Updates in another same-origin tab refresh on focus/storage events. Direct `file:` storage sharing depends on the browser; hosted applets must share an origin. Existing avatar source files are reused without changes.

## Verification

- `node tests/check-blog-post.cjs`: example grammar, free answers and length limits, invalid saved fields/images, missing state, image bounds.
- Real headless Chrome: 1366×768, 1024×768, 768×1024, 744×1133, 390×844, 320×568, 844×390; Edit/Preview and page-overflow checks. Choice/reload, avatar/fallback, upload/remove/three-image limit/reload, Japanese, reset/reload, doubled interface text passed. No JavaScript page errors.
- Physical iPad, virtual keyboard, touch image picker and Safari remain unverified. No student publishing. Free answers are preserved without vocabulary correction; blanks remain visible in snapshots.

## Profile and Share

The author name reads version 1 of `letseigo.profile`, matching the homepage's Name field. Empty/missing names use a translated “My blog” fallback. Names render as text, never HTML; Reset leaves the homepage profile untouched. Storage/focus/visibility events refresh both name and avatar.

Share uses the existing `shared/builder-photo.js` modal/download lifecycle with its optional `canvas` renderer. `shared/blog-snapshot.js` captures the current title, name, avatar, up to 3 images, and full sentences in a compact webpage-style PNG. It wraps long text and expands image height as needed, independent of the scrolling editor. It does not publish the post. The food Builders retain their existing Polaroid export path.

Inline update verification: real Chrome at six desktop/tablet/phone/short-window sizes; typing/caret retention, repeated fields, reload/reset/example, homepage name and cross-tab refresh, Japanese, three images, long answers, PNG download and dialog URL cleanup passed. Model and existing Builder export regression checks passed. Physical iPad handwriting/Safari remain unverified.

Text-only posts and snapshots omit the image area. Use example supplies sentence answers without adding a picture.
