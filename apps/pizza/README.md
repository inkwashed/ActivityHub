
Pronunciation: the result speaker reads the full English order; dotted-underlined ingredient phrases play individually. Vocabulary phrases and supported full orders (including PLAY counts and sizes) use the approved shared Kokoro recordings. Unsupported text or a failed clip falls back to browser speech for the complete order. Recordings load only when tapped. Device voices are used only for fallback/voice preview; physical iPad verification of recorded sequences remains pending.

Layout uses the final shared builder-workspace CSS/JS: tablet/desktop viewport fit, a stable food frame, and a reserved sentence box with limited text fitting. Long/enlarged content retains accessible overflow. Physical iPad layout verification remains necessary.

All nine toppings appear together in a three-column, three-row grid in LEARN and PLAY, without paging arrows or a page indicator. Quantity cycling, topping order and independent mode state are unchanged.

Pizza uses the full available square within its fixed play frame in both LEARN and PLAY. Mode-specific board sizes and workspace row overrides must not override the shared stage/output layout.

State saves automatically on this device/browser through shared/autosave.js and shared/builder-autosave.js, including independent LEARN/PLAY compositions and difficulty. Reset persists the cleared active mode. Storage failure leaves the activity usable; there is no cloud sync. Shared restore checks: `node tests/check-autosave.cjs`.

The Share photo uses the shared centered Download action with a 12px photo gap and the QR modal’s download icon.

Share uses fixed proportional framing in both modes; pieces beyond the photo edges crop instead of changing zoom. Verified by `node tests/check-photo-framing.cjs`.
