# Profile Pic

Open `index.html` directly, or serve the repository and visit `/apps/avatar/`.

The active app uses user-authored SVG parts: Classic, Round and Slim faces; one eye expression with Basic/Eyelashes; nose, mouth, T-shirt; Tousled and Curly hair. Skin, iris, hair, clothing and background colors are editable. Hair, nose and clothing can be hidden. Reset restores Classic/Tousled. English/Japanese interface and local square PNG export; no accounts; appearance and selected tab autosave locally in this browser. Not deployed or listed on the homepage.

## Active files

- `index.html`, `styles.css`, `app.js`: interface and state, using shared controls.
- `config.js`, `ui-ja.js`: choices, defaults, palettes and translations.
- `svg-assets/`: original supplied SVG sources. `01-face-neck.svg` is Classic; named Round/Slim files are alternatives. `06-hair.svg` is Tousled; `hair-curly.svg` is Curly.
- `svg-parts.js`: embedded SVG markup used for both direct-file opening and export.
- `svg-art.js`: layer composition and recoloring.
- `tracing-templates/hair-curly.svg`: retained user editing copy.
- `tracing-templates/bob-fitted/`: current front/back bitmap references, placement instructions and preview against all three actual SVG heads. Bob is not yet integrated into the app.

## Updating artwork

Preserve the full 3184.762-square SVG viewBox, original positions and all group transforms. Copy revised source into `svg-assets/` and update its matching entry in `svg-parts.js`. Do not flatten away parent transforms: Curly includes the user-approved scale/translation. Add new choices in config and renderer together. No raster artwork is loaded by the main app.

Eye-specific derived changes must survive regeneration: source `path57` is the optional lashes; source `path51` is split into four outer-ring subpaths and two pupil subpaths, converting relative subpath starts to absolute coordinates. Rings follow the selected iris base color, pupils/highlights remain fixed. Lid creases and nose share a skin-derived detail tone. Skin shading for Tan/Brown/Deep brown preserves the approved mildly warm palette.

Long hair should have separate back and front groups: back hair → head/body → clothing → front hair. Extend hidden back fill behind face and neck rather than cutting face-shaped holes. Verify proportions on actual heads before delivering tracing references.

## Verification

Browser checks have covered face/hair choices, eyelashes, skin/hair/clothing colors, removal, Reset and PNG export. Curly sizing was reviewed on all three faces. Fitted bob references were reviewed against all three SVG heads, including ear placement, eye clearance and neck overlap. Physical iPad saving remains unverified.

Superseded PNG prototypes, rejected artwork, duplicate exports and older tracing references were moved out of the repository to the dated avatar archive in the Codex project workspace on 2026-10-16. The archive includes a restoration manifest.
