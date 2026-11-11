# My Blog Journal prototype

Entry: `myblog/journal/`. Read-only, unlisted prototype using the My Blog JHS visual language. The journal collects the latest locally saved draft from each configured lesson. It does not create, edit, clear or duplicate draft storage.

`catalog.js` declares textbook order and lesson slots, currently Elementary 6 Unit 5, Junior High 1 Unit 5, and Junior High 2 Unit 4. Every configured lesson has a page, including a blank placeholder when there is no writing or photo. Additional lessons require a config script and catalog entry; we deliberately do not invent unit lists for entire textbooks.

Contents selection and Previous/Next flip between pages. The page scrolls internally for long posts. Open activity links back to the lesson. Saved JHS designs, text blocks and crop offsets use the same model and snapshot renderer as Share; ES retains its sentence framing. Read as text exposes selectable, accessible writing. Only the selected page is rendered, and stale asynchronous results are discarded. Object URLs are released on navigation.

Drafts are normalized through BlogPost before rendering. The journal reads the shared profile/avatar and refreshes on successful same-page Profile saves, focus, storage changes and visibility restoration. All rendering stays local; no account or external storage is introduced.

## Prototype boundaries

This is a collected view of current drafts, not a versioned or multi-year backup. Editing a lesson changes that journal page. Clearing browser data can remove entries; another device/browser does not see them. Historic author profiles are not retained. Before treating it as a long-term book, add explicit archive/version and portable backup/restore designs with stable entry identifiers. Existing lesson IDs and data must remain compatible.

Shared engine reference: [MY-BLOG-ENGINE.md](../../docs/MY-BLOG-ENGINE.md). Keep the prototype off the homepage until rollout is requested.

Browser check: `node tests/check-blog-journal-browser.cjs` with Playwright, optional `CHROME_PATH`, and `BLOG_BASE_URL` (default http://127.0.0.1:8776). Checks blank pages, seeded drafts, order, navigation, refreshed data, layouts, source preservation and viewport overflow. Physical iPad/Safari checks remain pending.

Contents use left-aligned checked-circle indicators: muted for blank pages and green filled for written pages. Accessible button names retain the textual status.

Opening Journal now checks its existing drafts for permanent writing-achievement credit using the shared rules in `docs/MY-BLOG-ENGINE.md`. This writes only the separate achievement ledger; draft content remains read-only.

## Shared Profile

The header uses Profile in place of fullscreen. Its ID-card layout, name editing, themes and badges come from `shared/profile.js` and `shared/profile.css`, shared with the homepage, all My Blog lessons and Journal. Successful name saves update the current author presentation immediately; settings remain separate from lesson drafts. Change the shared component once rather than adding app-local modal markup/styles. See [integration and rollout](../../docs/WORKFLOW.md#shared-profile-integration) and the [visual specification](../../docs/STYLE-GUIDE.md#shared-profile). Run `node tests/check-profile-browser.cjs` for shared changes; physical iPad/Safari and VoiceOver checks remain outstanding.
