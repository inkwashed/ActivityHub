# Let’s EiGo! shared pronunciation library

This directory is the common library for all applets, not a builder-specific copy.

- `catalog.json`: stable clip ids, exact displayed text, synthesis prompts, consumers, and generation defaults. Current voice: Kokoro `af_heart`, US English, speed `0.7`.
- `en-US/heart-070/<id>.mp3`: approved recordings only. Contains the 190 approved recordings.
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

Class Supplies selected-item questions reuse two approved prefixes, `do-you-have-a` and `do-you-have-an`, followed by the approved singular item clip. `library.js` resolves all 13 supported exact questions with the correct article. The empty “Do you have a …?” prompt reuses the approved “Do you have a” prefix; unsupported questions use browser speech. The shared player starts on tap, reuses one audio element for both parts, cancels the sequence on another request or question/selection change, and falls back to the whole question if either part fails. Device voice settings still affect only browser speech. Physical iPad/Safari sequencing remains unverified.

The prefixes were approved from `work/audio/question-join-01/`, using its `prefix-a.mp3` and `prefix-an.mp3` (recorded as `sourceFile` in the published manifest). They were extracted from complete carrier questions, with an 80 ms lead and the end 15 ms before the carrier noun's estimated start. Catalog `endBeforeWord` records that noun; `generate.py --lead-in` supports the same extraction for future review batches. Preserve untrimmed masters. The preassembled tighter-join experiments are not used by the site.

After approval and verification of published hashes, completed batches retain only the approved trimmed/untrimmed WAV masters and generation metadata. Duplicate review MP3s, review pages, rejected audio, and superseded pilot batches can be removed. The site uses only the approved MP3s in this directory; ignored local masters, user references, and reusable generation dependencies remain outside the site. Historical batch manifests may describe rejected or superseded samples whose audio has been removed; this directory's published manifest identifies the final approved sources.

## Recorded sentence assembly

The approved library includes the 91 sentence-building clips from `sentence-pieces-01`, using the 12 replacements from `sentence-corrections-01`, plus “Tell me about your sandwich.” from `questions-01-leadin`. The corrected standalone “an” and “My sandwich is an” retain their full endings without a carrier-noun end cut. Letter A and the nine corrected Japanese place names use explicit phoneme overrides. Published provenance identifies the exact source batch, original prompt, phonemes and SHA-256 for each file.

`resolveSequence` supports the current “I have”, “I want” and “My sandwich is” outputs. It resolves all parts before playback, matches multiword phrases longest-first, expands integer counts 0–120, and reads uppercase Sandwich initials with a separate letter index (A never overwrites article a). Exact full recordings take precedence. Ellipses in the supported empty prompts are silent. Unknown words, unsupported numbers or other sentence templates fall back as a whole; never play only the recognized fragments. Existing display, copy and export text stays unchanged.

Use the original approved MP3s in sequence through the shared player; tighter joined review previews are not production assets. Selecting a different sentence/question, another tap, closing settings or leaving the page cancels the pending sequence. A failed clip falls back to speech for the full sentence. The full-sentence button remains enabled without device speech when the entire recording sequence is available. Voice previews deliberately use device speech. Keep the iPad Silent Mode guidance.

The catalog retains reviewed sentence-part/number entries and derives Sandwich letter/source consumers from its configuration. Run `node tests/check-audio-library.cjs`, `node tests/check-pronunciation.cjs` and affected-app checks after changes, then refresh the five pronunciation consumers with the asset versioning script. Automated coverage includes 1,007 sentence variants and every count from 0–120; actual browser/device playback remains a separate check.
