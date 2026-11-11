# My Blog: Welcome to Japan

NEW HORIZON Junior High 2 Unit 4. Entry: `myblog/NH2-4/`. Uses the same JHS shell and shared engines as NH1-5; see [My Blog engine](../../docs/MY-BLOG-ENGINE.md).

Students consider questions or worries of overseas students coming to Japan for a homestay, then write advice about things to do or avoid. The starter prompt and original sample are intentionally simple and can be expanded later. The sample is not a textbook quotation and uses the default profile silhouette.

Draft ID `myblog-nh2-4` isolates writing/photos/layout from other lessons. Title/body begin blank. All JHS writing, photo, design, crop, QR and snapshot features are retained. Share credits the activity as Welcome to Japan. Listed after Junior High 1 on the homepage.

## Shared Profile

The header uses Profile in place of fullscreen. Its ID-card layout, name editing, themes and badges come from `shared/profile.js` and `shared/profile.css`, shared with the homepage, all My Blog lessons and Journal. Successful name saves update the current author presentation immediately; settings remain separate from lesson drafts. Change the shared component once rather than adding app-local modal markup/styles. See [integration and rollout](../../docs/WORKFLOW.md#shared-profile-integration) and the [visual specification](../../docs/STYLE-GUIDE.md#shared-profile). Run `node tests/check-profile-browser.cjs` for shared changes; physical iPad/Safari and VoiceOver checks remain outstanding.
