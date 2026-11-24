# School Tour

Let’s Try! 2 · Unit 8 · “This is my favorite place.”

Open `apps/school-tour/index.html` from the intact ActivityHub checkout, or serve the checkout root and open `/apps/school-tour/`. This classroom preview is unlisted in the activity directory while artwork and pronunciation are under review. The header’s back arrow returns to Let’s Try! 2.

## Play

- **LEARN** starts at the library. Tap any of the 16 places for its scene, two-line model, and on-demand audio. The first line is the speaking model. The second line is exposure. Mark one favorite to see the partner exchange. Selecting a new favorite replaces the previous star.
- **QUIZ** draws eight distinct rooms from the full catalog. The clue has a separate recording and an optional picture hint. A wrong choice displays a cross and invites another try. Correct choices unlock the room model and Next. The round waits at each reveal until the student is ready. Switching modes preserves the current quiz and favorite for the visit.
- At phone widths the map reflows within the same floor and area groups. A room selection in LEARN brings the detail into view. Back to map returns focus to the selected room.

## Content and assets

`rooms.js` owns the room order, areas, labels, models, clues, hint objects, media references, and the content hash for local media. Map tiles and detail cards share the scene files. The map thumbnails keep the full scene in view at every screen size. All 16 room scenes are ImageGen illustrations exported as 480 × 220 WebP files. The approved library and teachers’ office set the visual direction for the remaining scenes. The quiz uses 16 separate illustrated WebP object hints.

The labels use lowercase room vocabulary. The label **teachers’ office** follows the [MEXT Unit 8 lesson plan](https://www.mext.go.jp/content/20220525-mxt_kyoiku01-000022931_17.pdf). The reception-window pass, principal’s visitor meeting, and shoe cubbies are examples specific to this illustrated school. Review them and the longer clue phrases such as “the head of our school” and “microscope” for the class.

The 32 bundled draft clips use Kokoro US English Heart at 0.7×, with the repo’s lead-in workflow, 24 kHz mono and 64 kbps MP3. Each model reads its two lines as a complete clip. Each clue uses only its written clue text. The audition sheet, untrimmed masters, exact prompts, and generation provenance are under `work/audio/school-tour-preview-20261120/` in this checkout. The corrected teachers’ office model and its audition sheet are in `work/audio/school-tour-teachers-office-20261120/`. These drafts are for the local preview and require pronunciation review before release. Review pacing, sentence boundaries, final consonants and the room and clue vocabulary. Follow the approved shared audio workflow when preparing the release.

When updating media, refresh `mediaVersion` in `rooms.js` with the first 12 hex digits of SHA-256 over the concatenated WebP and MP3 bytes, sorted by relative file path, then run `node scripts/version-builder-assets.cjs apps/school-tour`. The catalog and entry-point checks detect stale hashes.

## Verification

```sh
SCHOOL_TOUR_BASE_URL=http://127.0.0.1:8765 node tests/check-school-tour-browser.cjs
node scripts/version-builder-assets.cjs --check apps/school-tour
```

The browser test expects a static server at the base URL and Playwright on the Node module path. Set `CHROME_PATH` to use installed Chrome. The test checks both eight-question rounds and all 16 clue, thumbnail, reveal and picture-hint mappings, retry, hint privacy, playback events and replay, favorite replacement, mode retention, language, keyboard focus, and responsive geometry between 320 and 1440 CSS pixels. Local asset paths and media hashes are checked independently of the browser. Chromium testing used a loopback server with outside requests blocked. Direct opening of a local file in the automated browser was blocked by its URL policy. Physical iPad Safari touch, VoiceOver and audible playback are pending.
