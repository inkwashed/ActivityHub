# Teacher Tools: local selfie transfer v1

Sender URL: `https://letseigo.com/apps/avatar/transfer.html?requestId=<random-id>`.
Canonical origin is `https://letseigo.com` (see root CNAME). Deploy both sides before production use. This change does not deploy anything.

Teacher Tools must open this URL from a direct user click, retaining the window handle and opener connection (no noopener/noreferrer features). Use crypto.randomUUID() or an equivalent unpredictable 16–128 character ASCII letters/digits/underscore/hyphen ID. No avatar or identity data goes in the URL. Headers such as Cross-Origin-Opener-Policy must not sever this popup relationship; verify this on both deployed sites.

The only permitted receiver is `https://tools.letseigo.com`, fixed in transfer.js. URL parameters cannot override it. No localhost or staging receivers are enabled in production.

Nothing is sent until the user clicks Use this selfie. The sender reads localStorage key `letseigo.app.avatar`, envelope `{version:1,value:{state,active}}`, and validates every appearance field. Only the sanitized state is sent:

`{type:'letseigo.selfie.import',version:1,requestId,avatar}`

`avatar` is the flat appearance object. Required keys and allowed values are in AvatarConfig.defaults/optionsFor in config.js. Custom six-digit hex colors are allowed only through isCustomColor (eyeColor, hairColor, shirtColor). No name, active tab, SVG, image URL or other local data is sent. For v1, receiver should reject unknown fields and invalid/missing fields. The protocol version also identifies this avatar schema; coordinate upgrades.

Teacher Tools validates event.origin === 'https://letseigo.com', event.source === its popup handle, the pending request ID, version, type and schema. Only after saving successfully reply to event.source with exact target origin 'https://letseigo.com':

`{type:'letseigo.selfie.import.ack',version:1,requestId}`

The sender checks receiver origin, opener identity, request ID, version and pending state before closing. A 15-second acknowledgement timeout enables retry; receiving the same request twice should safely replace the same avatar. Cancellation before confirmation sends nothing; cancellation after sending cannot undo a copy already received.

No saved/compatible avatar: Create / Edit Selfie navigates within the same popup to the editor. Continue to Teacher Tools returns to confirmation after normal local autosave. Opening confirmation directly without an opener or valid ID disables transfer. Storage unavailable/corrupt also disables transfer until a valid local save exists.

Teacher Tools should bundle compatible config.js, svg-parts.js and svg-art.js and render validated choices locally. Coordinate updates so new part IDs are not silently substituted. Keep saved avatars independent of Let’s EiGo!’s storage. Existing avatar privacy and backup practices apply.

Verification: `node tests/check-avatar-transfer.cjs` exercises sender logic with a mocked browser. A real cross-origin end-to-end test requires the Teacher Tools receiver, matching deployed origins and compatible popup headers; it remains outstanding. Check popup blocking, create/edit/return, local storage unavailable, acknowledgement timeout, reload, and Safari/iPad before release.
