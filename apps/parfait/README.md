# Little Parfait Cafe — prototype

Open `apps/parfait/index.html` directly, or serve the repository and visit `/apps/parfait/`. Not yet listed on the home page; noindex is a search-engine hint, not access control.

Nine configurable fruits, whipped-cream-base startup, optional vanilla/strawberry/mint chocolate chip ice cream, optional chocolate/strawberry/caramel syrup, TAP quantities (three levels then removal), EASY/HARD grouped English orders, reset, English/Japanese instructions, fullscreen. FREE editing and photo export are not included in this initial prototype.

Fruit artwork and glass geometry are original and app-specific. The initial vocabulary follows this teacher-created Unit 7 list, pending confirmation against the user's textbook: https://wordwall.net/pt/resource/65806826/lets-try-2-unit-7-vegetables-fruits

Run `node tests/check-parfait.cjs` from repository root. Logic uses DOM mocks; visual/browser and physical iPad checks remain outstanding.

Fruit art direction: simple flat SVG shapes with restrained outlines and a few interior details, matching the strawberry slice. Prioritize recognizable cut silhouettes over realism: apple slices have a nearly straight cut edge and curved peel edge; peaches have a shallow central indentation; melon details remain minimal. Avoid texture, elaborate highlights, or extra perspective faces.

Keep peel/rind accents thin; kiwi slices are peeled, with a medium-green edge instead of brown skin.

Glass silhouette: a short, wide trapezoidal bowl with a flared rim, narrower flat bottom, sloped pedestal stem, matching the app icon. This is app-specific presentation; ingredient placement behavior remains independent.

The bowl uses a shared rounded SVG silhouette for its mask and thicker outline; the pedestal flares into a sloped base instead of an oval foot.

Keep the stem behind the bowl so its top edge cannot interrupt the bowl outline. Bowl outline is 6px visible (12px centered stroke clipped to the silhouette); pedestal outline is 5.5px.

On tablet/desktop the left workspace uses available viewport height, placing extra space above the glass and keeping the order/Reset beneath it. Short screens retain the compact layout; long content may scroll rather than clip. This prepares room for FREE mode without enabling it yet.

Ice cream uses original flat SVG scoop drawings with softly uneven outlines and sparse scoop marks, shared between flavor buttons and bowl rendering. Scoop boxes keep a square aspect ratio independent of glass dimensions; avoid percentage heights or gradient-ball shading.

Preset assembly: permanent inset whipped cream fills the lower 50% of the bowl. Selecting syrup adds a middle band (cream–syrup–cream); reset removes syrup and scoops while retaining cream. Two round scoops rest above it; their crowns can extend above the open rim. Glass background, contents, and foreground outline are separate layers. Rendering stays app-specific; shared selection/order behavior is unchanged.

Whipped cream has a softly peaked top silhouette, with smooth tapered sides and bottom. The standard two scoops sit side by side on the taller cream base.

Fruit placement uses shared ordered rows. The first four selected fruits occupy lower cream, upper cream, cream peaks, and scoop tops. Additional varieties build overlapping decorative rows above those (all-nine arrangements will be busy). Strawberries point up; other fruits retain their illustrated orientation with only ±2° variation. Amount changes evenly redistribute a row; removing fruit closes the gap, re-adding puts it last. Fruit is in front of filling/highlights, behind the glass outline, and may extend above the rim. Whipped cream has a light warm-beige contour for definition.
