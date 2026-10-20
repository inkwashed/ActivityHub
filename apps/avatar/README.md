# My Selfie (Beta)

Open `index.html` directly, or serve the repository and visit `/apps/avatar/`.

The active app uses user-authored SVG parts: Regular, Round and Slim faces; Cheerful, Angry, Worried, Sleepy, Happy, Heart and Starry eye expressions with an optional Eyelashes checkbox (off by default); nose, mouth, T-shirt; Tousled, Curly, Short center part and Long with bangs hair. Skin, iris, hair, clothing and background colors are editable. Eye and hair colors each include nine presets and a circular rainbow custom color picker; validated custom eye and hair colors persist in saved avatars and homepage/blog previews. Hair and nose can be hidden; clothing is required. Older saves with hidden clothing restore the default T-shirt. Reset restores Regular/Tousled. English/Japanese interface and local square PNG export; no accounts; appearance and selected tab autosave locally in this browser. Not deployed or listed on the homepage.

## Active files

- `index.html`, `styles.css`, `app.js`: interface and state, using shared controls.
- `config.js`, `ui-ja.js`: choices, defaults, palettes and translations.
- `svg-assets/`: original supplied SVG sources. `01-face-neck.svg` is Regular; named Round/Slim files are alternatives. `06-hair.svg` is Tousled; `hair-curly.svg` is Curly; `hair-short-center-part.svg` is Short center part.
- `svg-parts.js`: embedded SVG markup used for both direct-file opening and export.
- `svg-art.js`: layer composition and recoloring.
- `icon.svg`: static render of `renderAvatar(AvatarConfig.defaults)` from the current catalog and SVG renderer, shared by the app header and favicon. Regenerate when the default artwork changes and refresh both icon cache hashes in `index.html`.
- `tracing-templates/hair-curly.svg`: retained user editing copy.
- `tracing-templates/bob-fitted/`: current front/back bitmap references, placement instructions and preview against all three actual SVG heads. Bob is not yet integrated into the app.

## Updating artwork

Preserve the full 3184.762-square SVG viewBox, original positions and all group transforms. Copy revised source into `svg-assets/` and update its matching entry in `svg-parts.js`. Do not flatten away parent transforms: Curly includes the user-approved scale/translation. Add new choices in config and renderer together. No raster artwork is loaded by the main app.

Eye-specific derived changes must survive regeneration: source `path57` is the optional lashes; source `path51` is split into four outer-ring subpaths and two pupil subpaths, converting relative subpath starts to absolute coordinates. Rings follow the selected iris base color, pupils/highlights remain fixed. Lid creases and nose share a skin-derived detail tone. Skin shading for Tan/Brown/Deep brown preserves the approved mildly warm palette.

Long hair should have separate back and front groups: back hair → head/body → clothing → front hair. Extend hidden back fill behind face and neck rather than cutting face-shaped holes. Verify proportions on actual heads before delivering tracing references.

## Verification

Browser checks have covered face/hair choices, eyelashes, skin/hair/clothing colors, removal, Reset and PNG export. Curly sizing was reviewed on all three faces. Fitted bob references were reviewed against all three SVG heads, including ear placement, eye clearance and neck overlap. Physical iPad saving remains unverified.

Superseded PNG prototypes, rejected artwork, duplicate exports and older tracing references were moved out of the repository to the dated avatar archive in the Codex project workspace on 2026-10-16. The archive includes a restoration manifest.

Long with bangs uses `svg-assets/hair-long-bangs-front-back.svg`: g210 is back-right, g202 back-left, and g203 front. Preserve group geometry when rebuilding the embedded parts. Rendering order is background → back hair → face/body → clothes → eyes/nose/mouth → front hair → accessories (reserved). Both hair sections share the existing hair palette.

Mouth choices include Smile, Teeth smile, Closed smile, Frown, Smirk, Surprised O and Neutral. Supplied alternatives are stored as `svg-assets/mouth-*.svg`, with their original full-canvas sizing and placement preserved. Teeth smile retains the supplied full-canvas position and geometry for alignment review.

Teeth smile uses the same off-white as the eye whites (`#f2f0eb`); preserve this color when refreshing the supplied mouth asset.

All part choice cards show pictures only; translated names remain available to screen readers.

The Face tab contains face shapes, nose choices and skin colors. Expression contains eye choices, optional eyelashes and iris colors, followed by picture-only mouth choices. Older saves on the former Mouth tab reopen Expression. Older saves on the former Nose tab reopen Face.

The renderer shifts every mouth down 55 full-canvas units (about 7px in a 400px portrait). Keep supplied mouth source positions unchanged; this shared offset also applies to previews and exports.

Smirk alone also shifts 55 canvas units to the right (about 7px in a 400px portrait); other mouths remain horizontally unchanged.

Teeth smile also shifts 24 canvas units right (about 3px in a 400px portrait), retaining the shared vertical offset.

Nose choices: original Small, Tiny wedge, Soft hook, Larger arch, Button curve, and None. New source files are `svg-assets/nose-*.svg`; preserve their original placement. Contours use the skin-derived lid-crease tone; Tiny wedge uses the skin-detail tone for its upper plane and a 15% darker tone for its lower contour.

Nose menu order: Small, Larger arch, Tiny wedge, Soft hook, Button curve, None. Soft hook and Button curve have an 80-unit downward render offset (about 10px at 400px portrait size), leaving original SVG sources unchanged.

Expression uses an Eyes heading with the Eyelashes checkbox on the same row. Mouth cards use isolated mouth previews in compact seven-column desktop/four-column mobile rows; artwork retains the shared placement offsets.

Clothes includes clothing choices/colors followed by Accessories. Design replaces the former Colors tab and is limited to background styles, background colors and borders; currently only existing background color choices are available. Part colors stay in their own tabs. Saved Accessories/Colors tabs reopen Clothes/Design respectively.

The five category tabs share one connected desktop row; small screens allow horizontal scrolling while retaining keyboard tab navigation.

Angry eyes use `svg-assets/eyes-angry.svg`, preserving the supplied group transform. Derived path57 is optional lashes; path51 splits into two iris-ring subpaths followed by two pupil subpaths (relative starts converted to absolute). Rings follow iris color, pupils remain fixed, and creases follow skin. Eye thumbnails must pass the selected eye key to the renderer.

When separating compound eye paths, preserve implicit relative line segments after each move. Changing a relative `m` to absolute `M` also makes trailing implicit lines absolute unless an explicit `l` is inserted; this caused the former diagonal iris-ring artifact. Angry source revisions consolidate brows and creases and trim the whites.

Angry eyes render 8 canvas units lower (about 1px in a 400px portrait), moving brows, lids, irises and optional lashes together. Source SVG placement stays unchanged.

Eyebrows use 75% of the selected hair RGB color in portraits and eye thumbnails. Derived `data-brows` markers identify Cheerful path47 and Angry path16; preserve these when importing updates. Lash lines, lashes and pupils retain their original colors.


Worried uses eyes-worried.svg, preserving group and brow transforms. Its iris/pupil geometry matches Cheerful and reuses the derived ring and pupil paths. Path9 is the hair-colored brow; path57 is optional lashes. Available as a paired expression.

Expression choices are paired presets; the experimental independent Left/Right controls have been removed. Worried renders 24 canvas units higher and 8 units left (about 3px up and 1px left at 400px), preserving source placement. Older independent-eye saves use their paired expression selection.

Sleepy uses eyes-sleepy.svg with supplied transforms preserved. Path3 is brows; path9 optional lashes. Path51 subpaths alternate ring/pupil/ring/pupil; only rings follow iris color. Creases retain the shared skin-detail color.

Sleepy renders 16 canvas units lower (about 2px in a 400px portrait), moving the full expression together while preserving the source SVG.

Happy uses eyes-happy.svg at its supplied placement. Path3 is hair-colored brows, path57 optional lashes, and path46 skin-toned creases. Closed eyes have no visible iris; the selected eye color is retained for other expressions.

Heart and Starry use eyes-heart.svg and eyes-starry.svg at their supplied placement. Preserve pink hearts and gold stars independently of the iris picker. Hidden original iris paths are omitted from embedded artwork. Path47 is hair-colored brows, path57 optional lashes, and path46 skin-toned creases.

Mixed is a paired preset with picture-left Cheerful and picture-right Worried. Nested SVG viewports preserve each source expression’s positioning, including the Worried offset. Brows, creases and optional lashes follow the shared settings.
