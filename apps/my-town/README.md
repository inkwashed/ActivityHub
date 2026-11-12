# My Town — prototype

NEW HORIZON Elementary 5, Unit 5: “Let’s go to the zoo.” Open `apps/my-town/index.html` with the repository structure intact, or serve the repository and visit `/apps/my-town/`. Not listed on the homepage or deployed yet.

BUILD: the upper-left lot (A1) is selected on page open, so a place can be inserted immediately. Select any of the 12 lots, then choose from the 24 textbook places. Selecting another place replaces that lot; The BUILD-only trash button at the right edge of the creation area removes the selected landmark; it is disabled for an empty or unselected block. Clicking outside a lot clears selection. The sentence groups repeated places: “We have a park and 2 libraries.”

ROUTE: buildings are locked. Select an occupied lot or use Destination, trace/tap adjacent street intersections from the blue car. Its starting point is always the south-center intersection, facing north; routes may begin with a left or right turn. Undo removes an edge; Reset clears only the route. Returning to BUILD preserves the town. BUILD Reset clears the whole town. State saves locally using shared autosave. The same Reset button offers temporary Restore independently for BUILD and ROUTE; new edits invalidate that mode’s recovery. This uses the map-specific BuilderReset adapter, not CreativeBuilder’s state schema.

Directions count one street segment as one block. Turns follow the traveller's heading, not the screen. The final “on your right/left” is included at the near corner of the destination lot, when it is diagonally ahead in the traveller’s current heading. It is not included once the traveller has passed that lot. The initial facing applies when the route has no edges. Continuing the route updates this condition. Immediate backtracking undoes an edge; loops and U-turns are omitted from this introductory prototype. Changing destination clears the path; the initial heading is fixed north. A river separates block rows 1 and 2, with a road on each bank and five bridges. A bridge edge produces “Cross the bridge.” rather than counting as a city block; subsequent street runs say “Continue one block.” or “Continue two blocks.” Turns still follow the traveller’s heading. A bridge exit can complete the directions if the destination is immediately ahead on either side. Existing saved routes are migrated across the new north-bank intersections without clearing buildings. The left water edge remains a coastline. There are no adjective/color options yet.

`model.js` owns vocabulary, validated saved state and route language. `art.js` owns original SVG landmarks and shared 720-wide coordinates (height expands for railway streets), used in both live modes and Save; exports omit editing controls but retain the chosen destination and route. `app.js` owns map interactions and uses shared sentence/audio, autosave and photo helpers. New town phrases use the shared browser-speech fallback when recordings are unavailable; new recordings have not been produced.

Check: `node tests/check-my-town.cjs` verifies inventory grammar, relative turns/arrival sides, invalid routes, undo, restore validation and consistent framing. Browser checks cover placement, mode switching, a three-edge route, reload restoration and PNG preview. A 390px viewport check found no horizontal overflow. The shared QR control points to https://letseigo.com/apps/my-town/; that destination requires publication before students can use it. Physical iPad/Safari and classroom audio review remain outstanding.

## Station railways

Each row containing a station receives a horizontal railway on the station side of the road below it. Stations in the same row share one line; removing/replacing the last station removes that line. Five striped level crossings align with the north–south streets. All modes and Save render the same tracks.

Each railway has a full-width street on its south side. On the north side, the north–south streets continue straight, with a distinct node and a crosswalk beside the neighboring lots. There is no east–west street linking those northern nodes. Students explicitly tap or trace between those nodes to cross; skipping straight to a more distant intersection is not allowed. The map expands vertically to accommodate these streets without compressing lots or artwork. The compact railway corridor retains a small gap around the rails. Tracks continue off both map edges; the coastal end crosses a rail bridge. Students can travel horizontally along the southern street. Crossing says “Cross the tracks.” and does not count as an extra block. Subsequent movement says “Continue … blocks.” Parallel travel does not trigger crossing language. Arrival on the opposite side of a railway is suppressed; approaching a destination immediately beyond the rails stops on the destination side without walking past it. Dragging stops on arrival; Undo can remove the crossing. Saved routes from older versions gain the appropriate crossing segments on restore. Building edits reset the route to the fixed south-center start. Older saved towns retain their buildings; routes with a different start or initial facing are cleared.

Checks cover shared lines, removal, north/south crossing counts, parallel travel, arrival and saved-route migration. Browser verified an existing station produces tracks and a route finishes with “Cross the tracks. You can see it on your left.” Physical touch-device review remains pending. Tracks are horizontal only; custom orientation and railway connections between rows are future design work.

Streets use grey pavement with dashed white center lines, continuing to the north, east and south map edges. Western ends finish flush with the westernmost street edge on land. Road bridges carry matching pavement and center lines; route nodes have a light rim for contrast.

Intersections have simple zebra crossings and clear centers without lane dashes. Occupied map lots show centered artwork without captions; accessible lot labels and the place-menu captions retain the place names.

The river has a narrower water channel bordered by small grassy banks. Road bridges use pale curbs, highlighted guard rails and regularly spaced posts; road geometry and bridge-direction counting stay unchanged.

BUILD: drag an occupied lot to move it to the nearest lot, swapping occupants when needed. A dashed target and floating icon preview the drop. Releasing outside the map or cancelling preserves the town. Alt+arrow keys move/swap a focused occupied lot for keyboard use. Successful moves clear the route and destination and autosave; station railways follow their new rows. Map artwork uses larger, tighter framing.

Map lots are 98×98 squares; row spacing and all river/railway artwork follow the shorter rows. BUILD drops resolve the final pointer position on pointerup (including fast gestures), store the target before highlighting it, and commit before pointer capture is released. Native browser dragging is suppressed; pointer cancellation and leaving the window cancel safely.

Every lot retains its light-green grass beneath the artwork, surrounded by an 8px light-grey sidewalk aligned with neighboring crosswalks. Icons are inset to leave the sidewalk visible. Saved routes that used a removed northern railway street stop at the last valid node.

Northern railway nodes overlap the existing road at the lot-side crosswalk, rather than occupying a separate approach space. The tracks sit just beyond the sidewalks, with only a narrow grass gap; the southern street and subsequent rows move up accordingly.

Road-colored backing fills the small outer corners around each rounded sidewalk. All 12 lots, including empty ones, use the same visible sidewalk border. Coastal rail bridges share the road bridges’ pale curbs, highlighted rails and capped posts.

Non-building islands between streets—including river/rail corridors and the open northern/southern edge spaces—also receive sidewalk edging and road-colored rounded corner joins. Bridge and railway artwork remains above this edging.

Perimeter sidewalks extend beyond the north, south and east viewBox edges, so the map crops through open blocks rather than enclosing them with an outer sidewalk border.


## Shared Builder layout

The app uses the shared workspace via `data-builder-scene`, with the compact title, bounded sentence box, section-jump navigation, QR dialog and standard Reset/Save row. `workspace.css` is the local grid-map adapter: it fits the proportional map, keeps it at least 360px wide with internal scrolling when necessary, and uses the shared scrolling choices/sentence column. BUILD and ROUTE share the same frame. See `docs/STYLE-GUIDE.md` → Grid-map Builder workspaces for the reusable convention.

Validation: model/route suite and shared workspace fitting tests pass. Browser review covered desktop, 768×1024 portrait and 390×844 stacked layout, QR destination, and scrolling choices. Physical iPad/Safari and classroom audio review are still pending. No publication was performed.

The overhead blue car follows the current route endpoint and faces the last travelled direction; Undo and Reset update it too. BUILD shows it at the starting point. Bright yellow street dots retain their touch targets; the current dot is hidden beneath the car. Block selection uses highlighting without an extra status line.

The canonical URL is `/apps/my-town/`. The alternate `/apps/mytown/` address redirects here. Internal autosave and usage identifiers remain unchanged to preserve existing towns and history.

## Shared-pattern review (November 2026)

BUILD/ROUTE remains the map's single mode control: there is no difficulty switch or free-piece toolbar. The shared switch, icon button and native help dialog explain pointer and keyboard workflows in both languages. Current route location uses `aria-current="location"`; street labels follow the interface language, while textbook place names stay English. Closing help returns focus to its trigger.

Width (740px) controls stacking; short height no longer triggers a different layout. The map uses the left column. Sentence and directions sit beneath the right-hand buttons panel. Choices, Reset/Save and directions share one scrolling column. Narrow phones intentionally scroll the page and may pan the 360px-minimum map; Jump to choices remains. No food-editor coordinate assumptions are used.

Reset errors and initial-load errors announce through the existing shared translated messages in a polite status region. The custom adapter forwards recovery's save guard; failed resets retain recovery without persisting partial state. Clear/mode changes cancel active block pickup. The persisted town schema and key are unchanged. BUILD/ROUTE remains a session choice (reload opens BUILD), as before.

Theme support was already present at review: the early shared theme script and current tokens remain authoritative. Map/route artwork keeps its own content colors. No theme definitions were changed.

### Unified choices and directions column
The current layout uses `shared/builder-panel-workspace.css`: choices, actions and directions scroll together on tablet/desktop while the map stays fixed. `workspace.js` moves the existing output nodes, disables legacy text shrinking and adds the shared scroll indication without opting into free-piece editing. Place cards use shared `ah-choice` colors, borders, selected/hover/focus states and app-specific 36px artwork; action buttons use `ah-button` and 44px targets. There are no inner list, panel or sentence scroll windows.

Phones retain the shared activity-first page and Jump navigation. Extremely short desktop windows (380px or less) use the shared deliberate page-scroll fallback. Directions may be below the fold; keyboard navigation and the column scrollbar keep them reachable. `_dev/builder/town-layout-check.html` covers both languages/modes, five viewport sizes, enlarged text, long output and final choice/action/output reachability. Physical iPad scroll behavior still needs testing.

Map coordinate guides A–D and 1–3 appear in yellow with dark outlines in the north/west margins, in both live modes and Save images. Row guides follow railway expansion and match the existing block names.

BUILD toolbar Duplicate copies the selected landmark into the first empty lot in row-major order (A1–D1, A2–D2, A3–D3), then selects the copy. It is disabled for empty/no selection or a full map. Like other building edits, duplication resets the route and destination; stations update railway geometry.

BUILD toolbar arrows move the selected landmark one adjacent lot, swapping occupants if needed and retaining selection on the moved landmark. Invalid edge directions and all directions for empty/no selection are disabled. The toolbar scrolls internally only when a very short map frame cannot accommodate its six 44px controls.

Choosing a landmark from the BUILD palette advances selection one block in reading order (including occupied blocks). D3 stays selected at the end; there is no wrap. Students may select any block manually. Duplicate and directional movement retain their existing selection-following behavior.

Deleting a landmark selects the nearest occupied block before it in reading order, skipping gaps. If no earlier landmark exists, the cleared block remains selected; deletion never wraps to a later block.

Keyboard: Alt+arrow moves/swaps the focused occupied block. In BUILD, Delete/Backspace within the workspace deletes the selected landmark using the trash action, including backward selection. Focus follows that selection when deleting from a focused map block. Editing fields, dialogs, composition input, modified shortcuts and held-key repeats do not delete landmarks. ROUTE ignores deletion keys.

Station palette icons retain the short track cue. Map station artwork omits it; each station instead has a parked carriage on the shared railway directly in front of its lot, between crossings. Carriages follow station placement, movement and removal in both modes and Save images, without altering route geometry.

Directions use a content-height sentence row with a top-right, 44px sticky Listen button. The whole right column scrolls (page flow on phones), not a separate directions window. The button occupies its own flex column and remains bounded by the sentence row.

Route pointer taps resolve the nearest active node within the existing 44px square targets using rendered pixel distances. This avoids DOM stacking choosing the wrong side of close railway crossings. Keyboard activation still selects the focused node; route adjacency and tracing rules are unchanged. Physical touch accuracy and VoiceOver remain device checks.

Verification: the local browser layout harness passed 40 combinations at 1133×678, 1133×599, 1133×380, 768×1024 and 390×844, both languages, BUILD/ROUTE and normal/200% text. Route fixtures render long model-generated directions through pronunciation and check sticky Listen geometry, 44px size, text clearance and focus after scrolling. Model checks cover every node center at map widths 360, 390, 540 and 720px, including all three railway rows. These are browser geometry and automated model/control checks, not physical touch or VoiceOver results.

### Practice badges
Creation edits now earn a local first-builder badge, with higher ranks after 5/10/15/20 qualifying sessions, at most once per 30 minutes. Opening/restoring alone does not award credit. Reset does not remove earned badges. See docs/WORKFLOW.md → Local achievements and app visits for shared ownership and checks.

## Header and overflow

This app loads `shared/app-shell.css` last: navigation stays outside the named activity scroll region, while narrow/short screens and long content retain necessary scrolling. Scrollbar appearance comes from shared controls.css. See [the shared contract](../../docs/STYLE-GUIDE.md#app-headers-and-overflow) and run `node tests/check-app-scroll-browser.cjs` for shell changes.
