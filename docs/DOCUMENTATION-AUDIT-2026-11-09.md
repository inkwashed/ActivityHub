# Documentation audit — November 9, 2026

This is an audit record, **not another standards document**. Current process belongs in [WORKFLOW.md](WORKFLOW.md), visual policy in [STYLE-GUIDE.md](STYLE-GUIDE.md), stylesheet ownership in [STYLE-ARCHITECTURE.md](STYLE-ARCHITECTURE.md), and lesson rules in app READMEs. No app code, tests, saved data or production behavior changed. No commit or deployment was made.

## Scope and evidence

Reviewed all 25 existing maintained Markdown files discovered outside ignored working material, plus `docs/style-guide.html`. Compared the relevant guidance with current shared Builder mode/recovery/geometry/panel code, food/Supplies configurations and sentence renderers, Parfait glass artwork, Sandwich sources, My Town adapter, homepage listings, Blog references and audio playback. This was a documentation consistency audit, not a new browser/device acceptance run or an exhaustive line-by-line audit of every artwork path.

### Documents changed

| Document | Main corrections |
| --- | --- |
| `README.md` | Homepage describes the actual directory/search/filter and feedback links, rather than Pizza alone. |
| `docs/WORKFLOW.md` | Removed Pizza PLAY-forces-EASY, Parfait HARD-disabled and future-Parfait adoption instructions. Current shared consumer coverage, mode/difficulty contract, paired slots, unpaged food grids, right-column output, full movement bounds, export/glass ownership, source controls and publication authorization. Dated measurements moved to the existing verification history. |
| `docs/STYLE-GUIDE.md` | Removed header-difficulty, menu-toolbar, fixed output, title/eyebrow, fixed-crop and old glass assumptions. Scoped panel workspaces versus legacy layouts; reconciled density, section typography, 739px labels, Save wording, touch targets, source controls and current ES Blog documentation. |
| `docs/style-guide.html` | Documentation samples say Save, identify difficulty as a panel control rather than header layout, describe nested tools and independent modes, and omit obsolete selection checkmarks. No production interface changed. |
| `docs/STYLE-ARCHITECTURE.md` | Current ownership map distinguished from historical cleanup results; inactive-layer styling ownership included. |
| `docs/BUILDER-WORKSPACE-VERIFICATION.md` | Explicitly historical evidence; retained earlier measurements relocated from workflow, with superseded boundaries identified. |
| `docs/HOME-PREVIEWS.md` | Correct command working-directory instructions. |
| `docs/MY-BLOG-ENGINE.md` | Shared Design ownership, guided-state fields and full-consumer asset-version command; no Blog behavior change. |
| `_dev/builder/AGENTS.md`, `_dev/builder/README.md` | Save sample wording; approved scrolling no longer a pending strict-no-scroll decision; shared toolbar ownership and deliberate legacy difficulty exception. |
| `apps/pizza/AGENTS.md`, `apps/pizza/README.md` | Distinguish mock/browser evidence, current right-column sentence, expanding centered exports and agreed Pizza quantity rules. |
| `apps/parfait/AGENTS.md`, `apps/parfait/README.md` | Independent HARD counts/sizes, current panel density/title, authoritative uniformly scaling glass paths, no fixed-crop export instruction. |
| `apps/sandwich/README.md` | Per-type origins survive slot replacement as agreed; remove obsolete browser blocker/no-recordings claims; current Save and grid descriptions. |
| `apps/class-supplies/README.md` | All four combinations permit colors, base fitting separated from item bounds, current full-frame export, approved workspace scope, historical sizing evidence and resolved fixture note. |
| `apps/mytown/README.md` | Existing BUILD/ROUTE recovery, fixed initial heading and Save action; preserve separate grid-map layout. |
| `apps/avatar/README.md` | Catalog overview and existing homepage Profile access distinguished from textbook-directory listing. |
| `myblog/NH1-5/README.md` | NH6-5 now uses guided TYPE/WRITE; segmented fields are save-migration history. |
| `assets/audio/README.md` | Continuous Web Audio versus media fallback; runtime trimming distinguished from the separate published MP3 boundary cleanup. |

### Reviewed without changes

Root `AGENTS.md`; `apps/sandwich/AGENTS.md`; `apps/post/README.md`; `myblog/NH2-4/README.md`; `myblog/NH6-5/README.md`; `myblog/journal/README.md`. Their relevant scoped exceptions and ownership remain valid. POST keeps its separate identity; Blog keeps Share and its own writing/help rules. Ignored audio review batches and old work probes are not maintained standards.

## Decisions and remaining boundaries

- User confirmed during this audit that Class Supplies' empty-selection prompt should remain **“Do you have a …?”**. The documentation records that decision; code already matches it.
- No unresolved new standard was selected on the user's behalf. Lab intentionally remains mode-coupled; Pizza, Parfait, Sandwich and Class Supplies remain independent. App-specific quantity, count/size, origin and color language are not interchangeable.
- My Selfie and My Town are not migrated to the panel-workspace layout. My Town already uses Save and temporary recovery; My Selfie still uses Share. Blog labels/help are unchanged.
- Historical test counts, measurements and “not deployed” statements describe their recorded revision, not current release status. No live-site/deployment status was inferred from source.
- Existing pending product reviews (export tagline, generic slot-component adoption and physical iPad verification) remain pending; this audit does not approve them.

## Checks performed

- Broad stale-phrase searches: removed current instructions claiming Pizza forces EASY, Parfait HARD is unavailable, tools belong in the menu, old fixed output budgets apply to panel workspaces, or fixed cropping is mandatory for reviewed exports.
- Local Markdown link/anchor and explicit source/test-path checks; phoneme examples inside code are not links. Documentation HTML local links/assets checked. No broken references found.
- `node tests/check-style-ownership.cjs`: passed, including the single phone-label breakpoint and removed Pizza slogan checks.
- `node scripts/version-builder-assets.cjs --check`: passed without writing.
- Extracted documentation-example JavaScript syntax check: passed.
- Before/after file hashes confirm the only non-Markdown change is `docs/style-guide.html`; app code, tests and assets were untouched.
- Git status/diff remains unavailable because the system Git launcher requires Xcode license acceptance. No license was accepted; local snapshots/hashes were used to distinguish this audit's edits from existing work.

External web links were not network-tested. No app/browser/device regression matrix was rerun for this documentation-only pass; earlier browser claims remain explicitly dated evidence.
