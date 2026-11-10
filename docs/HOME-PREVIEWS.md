# Homepage export previews

Run these commands from the repository root (or use an absolute path to the script from another directory):

```
node scripts/generate-home-previews.cjs
node scripts/generate-home-previews.cjs --check
node tests/check-home-previews.cjs
node scripts/version-builder-assets.cjs
node scripts/version-builder-assets.cjs --check
```

The four `assets/*-preview.svg` files are static exports, not independent drawings. The homepage loads only images; it never initializes the apps to make previews. The older `build-pizza-preview.cjs` is a compatibility redirect to the complete generator, including `--check`. Do not add a second renderer there.

| Preview | Sample | Authoritative sources |
| --- | --- | --- |
| Pizza | LEARN, tomato sauce, regular (level 2) cheese and corn, configured deterministic seed | Pizza config, FoodBuilder placements, Pizza sharing.js baked-photo renderer |
| Parfait | LEARN, vanilla, chocolate syrup, strawberries in both fruit slots | Parfait config, builder scoopArtwork, glass-art.js and sharing.js |
| Sandwich | LEARN, slots bacon → lettuce → tomato, no origin labels | Sandwich config, model.js through the actual sharing.js registration |
| Class Supplies | LEARN, one of every supply; configured colors except red pen; blue case | Supplies config/art and sharing.js |

The generator captures each production `BuilderPhoto` render callback. Class Supplies' unchanged export function is separated from editor initialization in `sharing.js` so both consumers can use it. Parfait loads `glass-art.js`; in this export-only environment there is no DOM stage to mount. The glass still supplies the same back/front artwork around the ingredients. The test also exercises its live mounting hook. Unexpected DOM dependencies fail explicitly rather than silently returning arbitrary fake elements.

## Framing policy

`scripts/home-preview-frames.json` records frame and scene rectangles measured in the live LEARN apps at a 1133×678 CSS-pixel viewport, English UI, normal text size. The generator passes these through the production `BuilderPanelWorkspace.photoFrame` function. It preserves proportional scaling, configured layering and the full-frame background included by Save.

The SVG is the square artwork portion of the export. The white polaroid margin, caption and sentence are intentionally omitted because the homepage already supplies a title and example text. Do not stretch the SVG to match a card. PLAY framing and other viewport/text sizes can include different amounts of background; these static examples do not promise identical crops everywhere.

After workspace/base-fitting changes, remeasure `.builder-play-area` and the app's scene (`#pizza`, `#parfait`, `#sandwich`, `#supplies-scene`) with the same sample/viewport and update the framing fixture if needed. Do not guess new rectangles or redraw artwork to compensate. The stored fixture deliberately avoids requiring a browser installation to regenerate assets.

## Freshness and maintenance

Regenerate after changing any preview's artwork, seed/placements, export renderer, sample, framing fixture or shared export framing. `assets/home-previews.json` records content hashes of the loaded sources, generator, framing fixture and outputs. `--check` regenerates in memory and fails on missing/stale files without writing. All renderers run successfully before the generator writes the set, preventing a missing Parfait dependency from leaving Pizza updated alone. Source fingerprints also detect changes that happen not to alter the selected sample.

The check cannot discover a new dependency that no renderer references yet, nor measure a changed responsive layout. Keep the dependency list explicit and use browser verification for those changes. Review all four fresh Save images alongside the static previews; inspect glass strokes, ingredient order and base proportions. Then test homepage desktop/tablet/phone image fitting and run relevant export tests.

Blog/POST and other decorative icons are not export previews. Their artwork and generation paths are unchanged.

## Local verification — November 2026

The original generator was run and failed on missing `ParfaitGlass.back` after writing Pizza. The old Pizza command was confirmed to target the same asset with a different handwritten renderer. Both paths now use the single production-renderer generator.

Fresh browser Save previews were produced for all four samples at 1133×678 and visually compared with regenerated SVGs: composition, ingredient order, proportions, glass back/front translucency and strokes agree. This is visual comparison, not a pixel-diff assertion; PNG rasterization and omitted polaroid text are expected differences. Class Supplies now reflects its current desk framing, default placement and artwork through the production renderer.

Homepage measurements at actual 1440×900, 768×1024 and 390×844 viewports confirmed all four images loaded, stayed square with `object-fit:contain`, and introduced no horizontal overflow. Desktop/tablet images were 260×260; phone images were 220×220. The four static SVGs total approximately 69 KB uncompressed. No homepage runtime or CSS changes were needed.

Passed: preview generation/freshness test, Class Supplies behavior/export test, sharing, Parfait creative export, Sandwich, photo framing, panel workspace, asset-version validation and whitespace checks. Physical iPad Safari and every possible PLAY viewport/crop were not tested in this pass. Nothing committed or deployed.
