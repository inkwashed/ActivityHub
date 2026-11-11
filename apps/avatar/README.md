# My Selfie (Beta)

Open `index.html` directly, or serve the repository and visit `/apps/avatar/`.

The active app uses user-authored SVG parts: Regular, Round and Slim faces; Cheerful, Angry, Worried, Sleepy, Happy, Heart, Starry and Mixed eye expressions with an optional Eyelashes checkbox (off by default); nose, mouth, T-shirt and collared-shirt choices; Tousled, Curly, Short center part and Long with bangs hair. Skin, iris, hair, clothing and background colors are editable. Eye, hair and clothing colors each include nine presets and a circular rainbow custom color picker; validated custom eye, hair and clothing colors persist in saved avatars and homepage/blog previews. Hair and nose can be hidden; clothing is required. Older saves with hidden clothing restore the default T-shirt. Reset restores Regular/Tousled. English/Japanese interface and local square PNG export; no accounts; appearance and selected tab autosave locally in this browser. Accessible through the shared Profile dialog on the homepage, My Blog lessons and Journal, but not listed as a textbook activity. Local documentation does not establish deployment status.

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

Eye-specific derived changes must survive regeneration. For the original Cheerful eyes, source `path57` is optional lashes; source `path51` contains four ring subpaths and two pupil subpaths, stored as separate ring/pupil paths in the embedded artwork. Convert relative subpath starts correctly. Other expression mappings are documented below. Rings follow the selected iris base color, pupils/highlights remain fixed. Lid creases and nose share a skin-derived detail tone. Skin shading for Tan/Brown/Deep brown preserves the approved mildly warm palette.

Long hair should have separate back and front groups: back hair → head/body → clothing → front hair. Extend hidden back fill behind face and neck rather than cutting face-shaped holes. Verify proportions on actual heads before delivering tracing references.

## Verification and limitations

Historical browser checks have covered face/hair choices, eyelashes, skin/hair/clothing colors, removal, Reset and PNG export. Curly sizing was reviewed on all three faces. Fitted bob references were reviewed against all three SVG heads, including ear placement, eye clearance and neck overlap. Physical iPad saving remains unverified.

Superseded PNG prototypes, rejected artwork, duplicate exports and older tracing references were moved out of the repository to the dated avatar archive in the Codex project workspace on 2026-10-16. The archive includes a restoration manifest.

## Hair layering

Long with bangs uses `svg-assets/hair-long-bangs-front-back.svg`: g210 is back-right, g202 back-left, and g203 front. Preserve group geometry when rebuilding the embedded parts. Rendering order is background → back hair → face/body → clothes → eyes/nose/mouth → front hair → accessories (reserved). Both hair sections share the existing hair palette.

## Mouth artwork

Mouth menu order: Neutral, Closed smile, Smile (open smile), Teeth smile, Smirk, Surprised O, Frown. Supplied alternatives are stored as `svg-assets/mouth-*.svg`, with their original full-canvas sizing and placement preserved. Teeth smile retains the supplied full-canvas position and geometry for alignment review.

Teeth smile uses the same off-white as the eye whites (`#f2f0eb`); preserve this color when refreshing the supplied mouth asset.

## Interface and accessibility

All part choice cards show pictures only; translated names remain available to screen readers.

The Face tab contains face shapes, nose choices and skin colors. Expression contains eye choices, optional eyelashes and iris colors, followed by picture-only mouth choices. Older saves on the former Mouth tab reopen Expression. Older saves on the former Nose tab reopen Face.

## Artwork alignment

The renderer shifts every mouth down 55 full-canvas units (about 7px in a 400px portrait). Keep supplied mouth source positions unchanged; this shared offset also applies to previews and exports.

Smirk shifts 55 canvas units right (about 7px in a 400px portrait). Teeth smile has its own smaller horizontal offset below; other mouths remain horizontally unchanged.

Teeth smile also shifts 24 canvas units right (about 3px in a 400px portrait), retaining the shared vertical offset.

Nose choices: original Small, Tiny wedge, Soft hook, Larger arch, Button curve, and None. New source files are `svg-assets/nose-*.svg`; preserve their original placement. Contours use the skin-derived lid-crease tone; Tiny wedge uses the skin-detail tone for its upper plane and a 15% darker tone for its lower contour.

Nose menu order: Small, Larger arch, Tiny wedge, Soft hook, Button curve, None. Soft hook and Button curve have an 80-unit downward render offset (about 10px at 400px portrait size), leaving original SVG sources unchanged.

Expression uses an Eyes heading with the Eyelashes checkbox on the same row. Mouth cards use isolated mouth previews in compact seven-column desktop/four-column mobile rows; artwork retains the shared placement offsets.

Clothes includes clothing choices/colors followed by Accessories. Design replaces the former Colors tab and is limited to background styles, background colors and borders; currently only existing background color choices are available. Part colors stay in their own tabs. Saved Accessories/Colors tabs reopen Clothes/Design respectively.

The five category tabs share one connected desktop row; small screens allow horizontal scrolling while retaining keyboard tab navigation.

## Expression artwork

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

## Clothing artwork

Pointed-collar shirt uses clothes-pointed-collar.svg. Preserve its group transform and bottom overhang. Base #edf0f4 and shadow #c5cfdd follow clothing color; dark outlines/buttons remain fixed.

Rounded-collar shirt uses clothes-rounded-collar.svg. Both collared shirts retain their source placement/overhang and share the clothing palette. Derived artwork overlays the first two closed subpaths of path4 in outline-dark #141d30 for the inner collar behind the neck; originals stay unchanged.

## Teacher Tools transfer

`transfer.html` provides user-confirmed, local-only avatar transfer to tools.letseigo.com. See [TRANSFER.md](TRANSFER.md) for the receiver contract and outstanding cross-site verification. `transfer-return.js` adds a return action only when editing from that popup.

## Workspace and shared standards

The choices panel begins with tabs, without a repeated app title. The portrait column has only its prompt and play area; no sentence/output card. At tablet/desktop widths the play area fills the remaining column height.

Accessibility alignment: invisible page heading, selected-only tab semantics, custom-color selection descriptions/rings, shared control/spacing tokens and Download presentation. Short landscape windows (380px high or less) use stacked page flow. Picture-card heights follow their scaled previews rather than fixed 90px/64px minimums, while retaining at least 44px touch targets. `workspace.css` loads after shared workspace styles. The choices column reuses the shared stable scrollbar gutter and lower shadow plus the independent `BuilderScrollCue` helper, without initializing the food panel adapter. The cue disappears at the bottom or when the panel uses page flow. Compact desktop nose/mouth grids wrap to preserve 44px targets; phone grids retain three/four columns. Enlarged tab labels can scroll horizontally by touch/trackpad or keyboard focus, without visible tab-strip scrollbars or vertical scrolling. The short-wide stack exposes the shared section-jump control and reserves bottom space for it; the square portrait keeps its existing phone/desktop/short-window sizing.

The native tabs support Left/Right, Home/End and one tab stop; `aria-selected` describes tab selection. Picture buttons retain `aria-pressed`, translated screen-reader names and selection announcements. Custom color inputs have visible selected rings and translated descriptions distinguishing custom versus preset selection. Save opens the existing local photo dialog with a centered Download action and shared icon (800×800 PNG). The header QR action still says Share and shares only the public app URL, never avatar data. Reset returns to the defaults and temporarily becomes Restore using shared `BuilderReset`; changing tabs, language or theme retains recovery, while changing the avatar discards it. Resetting an already-default avatar does not create a recovery snapshot. Reload ends the temporary recovery opportunity.

Use shared control dimensions and spacing tokens for chrome, while keeping app-owned preview proportions and face/nose/mouth grids. My Selfie does not use CreativeBuilder’s movable-piece engine or food-panel density adapters. The app title remains in the header and as an invisible page heading; the right panel begins directly with tabs.

Review verification (2026-11-11): `tests/check-avatar-browser.cjs` exercises real Chrome at 739/740×380/381 boundaries, 1024×300, 1280×380/381, 768×1024, 1024×768, 1440×900, 390×844 and 320×568. Coverage includes square portrait sizing, no horizontal page/choices overflow, section-jump focus, bottom-of-panel reachability, accurate overflow cues, both languages/all five themes, keyboard tab navigation and ARIA selection, simulated 200% text size, reload persistence, 800×800 PNG download, export failure/retry and QR link/image/download/focus. Run with Playwright available via NODE_PATH and optionally CHROME_PATH. The shared cue helper was also smoke-tested in Pizza, Parfait, Sandwich, Class Supplies and Builder Lab. This is automated desktop Chrome testing, not physical Safari or VoiceOver verification.

`tests/check-avatar-recovery.cjs` runs the real avatar adapter, shared recovery and autosave with injected rendering/storage failures: Reset/Restore, tab independence, edits invalidating recovery, failure before/after mutation, failed rollback/retry, pagehide save inhibition, blocked-storage retry, legacy save validation and startup-restore protection. Existing autosave, reset-recovery, restore-failures, panel-workspace, style-ownership and avatar-transfer checks also pass. The project-wide asset-version check passes, including `transfer-return.js` and the Download icon. Physical iPad Safari touch/scrolling, text enlargement, native color picker/PNG saving and VoiceOver announcements/focus still require device testing.

## Local state and maintenance

`shared/autosave.js` stores `letseigo.app.avatar` as `{version:1,value:{state,active}}`. `persistence.js` validates parts, palettes and supported custom colors on restore and adapts shared recovery without changing this format. Recovery is in memory only; successful Reset/Restore flushes the actual resulting avatar. Failed mutations attempt rollback and pause autosave until a successful Restore retry. Initial saved-avatar rendering failure protects the existing record for the rest of the session and announces a reload retry. Blocked storage retains its previous record; subsequent flushes retry the current state. It migrates former Nose/Mouth/Accessories/Colors tab names to Face/Expression/Clothes/Design. Old independent-eye settings are ignored in favor of the paired expression. Shared Profile owns names, theme settings and avatar previews separately; see `../../shared/profile.js` and the integration section in `../../docs/WORKFLOW.md`.

After changing assets or scripts, refresh their registered consumers with `node scripts/version-builder-assets.cjs` and verify using `--check`. Run `node tests/check-style-ownership.cjs` for shared ownership/order changes and `node tests/check-avatar-transfer.cjs` for the transfer sender. These source/mock checks do not replace visual or cross-site tests. Keep the transfer protocol in [TRANSFER.md](TRANSFER.md) rather than duplicating it here.
