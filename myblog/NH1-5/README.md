# My Blog: A Place I Like

Entry: `myblog/NH1-5/index.html`. NEW HORIZON 1 Unit 5 is Junior High Year 1, after NEW HORIZON Elementary 6 in textbook order. This app is intentionally unlisted on the homepage during development. The back button returns to the homepage because no public junior-high section is listed yet.

Students write about a place they have visited or want to visit. They supply a title (120 characters) and multiline body (2,000 characters), with no sentence frames or automatic wording. Paragraph breaks survive saving and Share. Photos are optional: zero to three, using the shared upload/remove controls. This lesson has no whole-post Reset button; Reset layout preserves writing and photos.

## Reusable engine

Uses `shared/blog-post.js` with `mode: 'free'` and `design: true`, fields named `title` and `body`, and `multiline: true` on the body. The HTML supplies labelled `blog-title` and `blog-body` controls. Inline mode remains available for NH6-5. Draft ID `myblog-nh1-5` is separate from NH6-5's legacy `world-blog` ID. Both use the existing homepage name/avatar and shared local snapshot lifecycle.

`config.sample` supplies the read-only sample title, author and paragraphs. Sample opens a native, viewport-constrained dialog beside the activity heading. Its webpage-style article uses semantic, selectable text and shared styling; it never replaces or saves over student work. The user supplied the Cafe Maria passage, attributed to Fumiya; no textbook illustration or cafe photograph is included. No web claims about the cafe are made beyond the supplied sample.

## Verification

Model checks: `node tests/check-blog-post.cjs` covers free text, paragraph preservation, length bounds and separate lesson IDs, plus NH6-5 regression checks.

Real Chrome checks passed at 1024×768, 1366×768, 768×1024, 390×844, 320×568 and 844×390: title/body editing, paragraph restore, sample opening/Escape/focus return/draft preservation, PNG download, Japanese UI, reset, and lesson isolation. Desktop editor, sample modal and exported snapshot were visually inspected. Physical iPad/Safari handwriting and image-picker behavior remain unverified. No deployment is part of this change.

Write places the title field to the right of the author/avatar on wider screens, stacking below it on narrow screens. The sample and Share snapshot place the author/avatar before the post title. Free-composition snapshots use the shared renderer’s `authorFirst` option; NH6-5 retains its existing question-first layout.

Fumiya’s sample portrait uses creator options face 3, nose 4, skin 2, eyes 1, eye color 2, mouth 3, hair 3, hair color 3, with a dark-grey (#444444) shirt. The fixed settings live in `config.sample.avatar`; regenerate `fumiya.svg` with `node scripts/generate-fumiya-avatar.cjs`. This asset uses the character creator renderer and never reads or writes the student profile.

## Write, Photos and Design

Three native tab controls appear at all screen sizes, with arrow-key/Home/End navigation. Write contains only the profile, title and internally scrolling text box. Photos holds up to three source images. Design shows only the editable three-column arrangement and independently scrolling controls. The compact layout preview fits the available height where possible, with a minimum width to retain usable selection targets; tall layouts can still scroll. Profile/name and title remain in Write and Share. Share remains available below every tab; the page itself stays viewport-contained.

`shared/blog-layout.js` owns validated placements, wrapping, automatic text height, and collision resolution. `shared/blog-design.js` renders/selects blocks and updates controls; `shared/blog-design.css` scopes this shell to `blog-three`. `shared/blog-snapshot.js` consumes the same computed positions and text lines for PNG export. No drag/pinch dependency or external editor is used.

Each source photo has a stable local UID so deleting or reordering sources cannot attach an old placement to another photo. Existing drafts without UIDs migrate deterministically. `layout: null` uses the automatic arrangement (photos across the top, full-width text below); an array stores a custom layout, automatically including any omitted or newly uploaded source elements. Each non-empty line becomes a numbered Text element (blank lines are ignored), alongside one block per source photo. The original body remains a single editable text field. Text placements follow their numbered position when lines are inserted or removed; new sections are included automatically.

Select a block to move it up/down/left/right, choose 1–3 columns, or set photo height to Short/Medium/Tall (1–3 rows). Text rows grow automatically from its content and width; text is never cropped. Vertical moves swap order with touching blocks using their actual rendered height, keeping them directly adjacent; moves into empty space nudge by one row. Horizontal moves swap beside touching blocks using their widths; resizing prioritizes the selected block and pushes collisions downward. Manual down moves are bounded to row 24; long text can naturally extend farther. The preview scales proportionally within its panel; touch controls remain 44px. Share scales unusually tall exports to a maximum 16,000px height without cutting off text.

The Builder-style editing rail provides movement and width/height buttons, with disabled states at limits. Select an element in the layout or the panel picker. All source elements are always included; Design has no add/remove controls. Edit writing in Write and delete photos in Photos. Reset layout restores automatic placement without changing writing/photos. The info button beside Arrange your post opens the selection/editing instructions in the same shared help dialog used by Builder.

Design verification: `node tests/check-blog-layout.cjs` covers packing, collisions, long text, wrapping, invalid layouts and automatic source inclusion. `node tests/check-blog-post.cjs` covers draft migration/UIDs. Real Chrome checks passed for all three tabs, three uploads, moving/resizing, automatic inclusion, snapshot download, saved-layout restoration, source deletion, default/reset, keyboard tabs, Japanese, and NH6-5 regression at six viewport sizes. Physical iPad/Safari checks remain outstanding.

Design shows horizontal and vertical grid guides and rounded element corners; photo corners also stay rounded in Share.

Photos use centered cover cropping in Design and Share, filling each block without gaps. Photo rows offer clockwise 90-degree rotation and the shared trash icon; rotation is saved locally with the image.

Selected photos show crop-position sliders only on overflowing axes. Position is saved with the layout and applied identically in Share; Reset layout recenters crops.

Share uses a rounded, thin-bordered website frame matching Sample. Its lower-left credit uses the configured activity title: Let's EiGo! ・A Place I Like.

Share renders the profile avatar at 96 logical pixels from an explicitly sized 512px SVG and exports at 2× resolution (subject to the tall-image limit) for clearer previews and downloads.
