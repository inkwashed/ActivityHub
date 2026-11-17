# Let’s EiGo! shared pronunciation library

This directory is the common library for all applets, not a builder-specific copy.

- `catalog.json`: stable clip ids, exact displayed text, synthesis prompts, consumers, and generation defaults. Current voice: Kokoro `af_heart`, US English, speed `0.7`.
- `en-US/heart-070/<id>.mp3`: approved recordings only. Contains 340 approved recordings.
- `work/audio/<batch>/` (ignored): source WAVs, compressed review MP3s, a generation manifest, and `review.html` for auditioning. Keep original WAVs here for later editing.
- `work/audio/model-cache/` and `.venv/` (ignored): local generation dependencies, never student downloads.

## Generate and review

1. Run `node scripts/audio/catalog.cjs` after adding vocabulary. Existing prompts/metadata are preserved; review removed vocabulary manually since another app might need it.
2. Create `work/audio/.venv` with Python 3.11, then install `scripts/audio/requirements.txt`.
3. Run `work/audio/.venv/bin/python scripts/audio/generate.py --ids strawberries green-peppers alfredo-sauce mint-chocolate-chip-ice-cream what-do-you-want --batch pilot-01`.
4. Open the batch’s `review.html`. Listen for extra syllables, missing consonants, stress, pacing, and complete endings. Generation is not pronunciation approval.
5. Once the voice/prompt approach is approved, omit `--ids` for a full batch. A new batch name avoids overwriting previous recordings.
6. Publish only reviewed clips under `en-US/heart-070/`, retaining their provenance and generation manifest. Builder applets use `library.js` for vocabulary and complete recorded sentence sequences, with browser speech for unsupported text and missing/failed clips.

For experiments with reusable sentence pieces, pass `--catalog work/audio/<batch>/catalog.json` to `generate.py` alongside `--batch` and `--lead-in`. This keeps speculative vocabulary out of the production catalog. The review catalog uses the same schema and may group entries with `reviewGroup`; `endBeforeWord` extracts a phrase from a carrier sentence. Combined sentence previews are review artifacts, not approved web assets. Review individual pieces as well as joins, especially letter names, numbers and place names; approval of a sentence pattern does not approve every new recording.

## Recording standard

Use one complete vocabulary phrase per file. Reuse identical text across apps, but record singular/plural and full phrase variants independently. Display text remains English lesson vocabulary; prompts can expand spelling (e.g. BBQ → Barbecue). Start with punctuated target-only prompts. If a lead-in is necessary, record and trim it in a separate reviewed batch: never blindly cut a fixed duration or auto-delete the initial sound of every word.

Keep WAV masters at 24 kHz mono; generated masters use 16-bit PCM. Web copies use 24 kHz mono MP3 at 64 kbps. Preserve leading consonants and final sounds; don't over-trim to minimize a few bytes. Review compressed copies as well as masters.

Kokoro official model: https://huggingface.co/hexgrad/Kokoro-82M (Apache-2.0 weights). Tool: https://github.com/hexgrad/kokoro. Record the installed dependency versions and prompt/phonemes with each batch. Do not redistribute the model with the site. User reference recordings were generated using kokoroweb.app, Heart at 0.7×, with category lead-ins; they are comparison material, not ready-to-publish clips.

Shared playback resolves exact phrases and complete sentence sequences from `library.js`, loads audio on demand, and falls back to browser speech for unsupported text or missing/failed clips. Never generate separate audio copies per applet or ship the model to student browsers.

Pilot-01 review: user heard an unwanted opening “eh” in target-only clips, especially strawberries. Pilot-02 uses `--lead-in`: generate `Listen: <target>` in a single inference, retain the untrimmed WAV, and cut 80ms before the model-estimated first target word timestamp. The user approved the five Pilot-02 samples. Use this approach for the full vocabulary batch, but review each additional recording for leftover lead-in and clipped initial consonants before publishing. Trim metadata is saved in the batch manifest. Example: add `--lead-in --batch pilot-02-leadin` to the pilot command above.

For individual pronunciation corrections, the catalog's `prompt` can use Kokoro/Misaki's phoneme override syntax, such as `[banana](/bʌnˈænə/).`; keep `text` unchanged. The approved banana/bananas replacements use a stronger “buh” vowel because Heart's dictionary schwa sounded like “bee” to the reviewer. These overrides still require listening approval; phoneme correctness alone does not guarantee natural audio. Generate corrections in a fresh batch and compare against the original before publishing.

Published provenance is in `manifest.json` (source batch, prompt, phonemes, trim, voice, speed and SHA-256). `library.js` contains exact text-to-file mappings and content hashes for cache refresh. When replacing approved clips, update both files and rerun the builder asset versioning script. Never include unreviewed variants in this index.

The approved bacon prompt is `[bacon](/bˈAkn/).`: the reviewer preferred no vowel between k and n over both the dictionary schwa and a stronger “uh”. Preserve this override when refreshing the catalog.

Class Supplies selected-item questions reuse two approved prefixes, `do-you-have-a` and `do-you-have-an`, followed by the approved singular item clip. `library.js` resolves all 13 supported exact questions with the correct article. The empty “Do you have a …?” prompt reuses the approved “Do you have a” prefix; unsupported questions use browser speech. The shared player starts on tap, uses continuous Web Audio scheduling where supported (sequential media-element fallback otherwise), cancels the sequence on another request or question/selection change, and falls back to the whole question if either part fails. Device voice settings still affect only browser speech. Physical iPad/Safari sequencing remains unverified.

The prefixes were approved from `work/audio/question-join-01/`, using its `prefix-a.mp3` and `prefix-an.mp3` (recorded as `sourceFile` in the published manifest). They were extracted from complete carrier questions, with an 80 ms lead and the end 15 ms before the carrier noun's estimated start. Catalog `endBeforeWord` records that noun; `generate.py --lead-in` supports the same extraction for future review batches. Preserve untrimmed masters. The preassembled tighter-join experiments are not used by the site.

After approval and verification of published hashes, completed batches retain only the approved trimmed/untrimmed WAV masters and generation metadata. Duplicate review MP3s, review pages, rejected audio, and superseded pilot batches can be removed. The site uses only the approved MP3s in this directory; ignored local masters, user references, and reusable generation dependencies remain outside the site. Historical batch manifests may describe rejected or superseded samples whose audio has been removed; this directory's published manifest identifies the final approved sources.

## Recorded sentence assembly

The approved library includes the 91 sentence-building clips from `sentence-pieces-01`, using the 12 replacements from `sentence-corrections-01`, plus “Tell me about your sandwich.” from `questions-01-leadin`. The corrected standalone “an” and “My sandwich is an” retain their full endings without a carrier-noun end cut. Letter A and the nine corrected Japanese place names use explicit phoneme overrides. Published provenance identifies the exact source batch, original prompt, phonemes and SHA-256 for each file.

`resolveSequence` supports the current “I have”, “I want” and “My sandwich is” outputs. It resolves all parts before playback, matches multiword phrases longest-first, expands integer counts 0–120, and reads uppercase Sandwich initials with a separate letter index (A never overwrites article a). Exact full recordings take precedence. Ellipses in the supported empty prompts are silent. Unknown words, unsupported numbers or other sentence templates fall back as a whole; never play only the recognized fragments. Existing display, copy and export text stays unchanged.

Use the current approved MP3s and published hashes through the shared player; supported hosted browsers download/decode the requested sequence together and schedule buffers continuously through Web Audio, caching up to 64 decoded clips. Quiet boundary padding below -60 dB (0.001 amplitude) is skipped, retaining 60ms around speech; a near-digital threshold left audible gaps because synthesis/MP3 tails contained low-level noise; runtime trimming does not rewrite files; the separate published boundary cleanup below did update the MP3s. Older browsers and file previews retain sequential media-element playback; tighter joined review previews are not production assets. Selecting a different sentence/question, another tap, closing settings or leaving the page cancels the pending sequence. A failed clip falls back to speech for the full sentence. The full-sentence button remains enabled without device speech when the entire recording sequence is available. Voice previews deliberately use device speech. Keep the iPad Silent Mode guidance.

The catalog retains reviewed sentence-part/number entries and derives Sandwich letter/source consumers from its configuration. Run `node tests/check-audio-library.cjs`, `node tests/check-pronunciation.cjs` and affected-app checks after changes, then refresh all pronunciation-enabled entry points with the asset versioning script. Automated coverage includes 818 sentence variants and every count from 0–120; actual browser/device playback remains a separate check.

## Boundary cleanup — 2026-10-23

At the user's request, all 190 published clips were audited for quiet start/end padding; 180 were trimmed and 10 retained. `scripts/audio/trim-padding.py` uses a conservative 0.0005 peak threshold (-66 dB), keeps 35 ms before and 50 ms after detected speech, and skips changes below 50 ms. Original MP3s and trimmed WAVs are preserved in ignored `work/audio/boundary-trim-2026-10-23/`, alongside audit.json and an original/trimmed review.html. The script refuses to overwrite backups or run a second lossy pass. Original generation provenance remains intact; boundaryTrim records the separate edit and original hash. These trims have automated verification, not new listening approval. Compare quiet consonants and endings on the review page before release; restore individual originals if necessary.


## My Town / Paper Craft expansion — approved and integrated (2026-11-17)

All 150 additions are approved and included in the shared production library: 81 for My Town and 69 for Paper Craft / Shape Builder. The library now contains 340 recordings; the original 190 files are unchanged. No recordings were regenerated for this rollout.

The approved sources are `town-shapes-20261116-01` and `town-shapes-plurals-20261116-01`, with restaurant/restaurants from `town-shapes-corrections-20261116-01` and the final normal-speed R from `town-shapes-r-20261116-03`. Restaurant uses an explicit final ah vowel; R uses `[R](/ˈɑɹ/)!` at 0.7× with its full generated ending. Earlier R variants are superseded. Provenance, approval date and file hashes are recorded in manifest.json; WAV masters remain under ignored work/audio.

| Consumer | Approved / required catalogue clips | Missing |
| --- | --- | --- |
| Pizza | 64 / 64 | 0 |
| Parfait | 81 / 81 | 0 |
| Sandwich | 64 / 64 | 0 |
| My Pencil Case | 81 / 81 | 0 |
| My Town | 97 / 97 | 0 |
| Paper Craft / Shape Builder | 124 / 124 | 0 |

Counts overlap between apps. Run `node scripts/audio/audit.cjs` to check catalogue coverage and approved-file integrity. My Selfie and POST have no defined vocabulary-recording requirements; My Blog/Journal writing is not a finite recording catalogue.

My Town uses recorded place singular/plural forms, inventory and destination questions, and complete reusable route instructions for one–twelve blocks. Paper Craft uses recorded shapes, singular/plural letter names and the gifting phrase. Singular letter A stays separate from article a. All sequence parts resolve before playback; unknown text, incomplete routes and missing/failed files retain whole-text browser-speech fallback.

`tests/check-audio-expansion.cjs` checks the actual production library and file existence for Town places/counts/questions/routes and 1,560 colored shape/letter forms. `tests/check-my-town-audio.cjs` checks question cancellation/availability and plural vocabulary metadata. Existing playback and hash-integrity checks remain required. User listening approval is complete; physical iPad/Safari playback remains a separate device check.

The local review pages and tracks are retained as historical review artifacts. Production apps load only approved files from assets/audio. This rollout is local; commit, push and deployment remain separate actions.

Singular inline Paper Craft phrases such as “letter R” resolve to the approved “letter” and letter-name clips, just like the full sentence. Expansion checks cover all 26 singular and plural inline letter phrases and preserve article a separately.

## Article ending revisions — 2026-11-17

The user approved the full-ending replacements for article a and “Where is the” from `article-joins-20261117-01`. Both retain the complete generated ending without carrier-noun end cuts, using `[a](/ə/)!` and `Where is [the](/ðə/)!` at Heart 0.7×. The shared library now uses these recordings; the count remains 340. Previous approved MP3s and provenance are retained in that local batch. Playback boundary rules are unchanged.

At the user’s request, the approved “Where is the” clip’s quiet tail was shortened on November 17, retaining 25ms after the last sample at or above -60dB. The original WAV was used to avoid repeated MP3 encoding. This reduces the joined-player trailing margin by about 35ms; the next word and global playback rules are unchanged. Previous MP3/provenance remain in `work/audio/the-join-trim-20261117`. Audible join confirmation remains pending.
