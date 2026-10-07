# ほんの手紙 POST

Featured standalone card applet for Let’s EiGo!, at `/apps/post/` (entry file: `index.html`).

This directory is the canonical site source. Keep its independent warm stationery UI, envelope reveal, and card formatting; integration with shared app styling is deferred by request. The home page opens this app in a new tab.

All CSS, scripts, artwork, fonts, and font licenses are local and use relative paths. Google font license files are in `assets/fonts/`. No build step or external service is required. PNG export uses locally loaded page fonts and supports direct file opening without fetching or embedding font files. Share links still require HTTP hosting to work on someone else’s device.

Cards are serialized in URL fragments. Links contain the card text, can be read by anyone with the link, and cannot be revoked. No messages are submitted to a server or emailed automatically. Drafts save in local browser storage; opening a received card does not overwrite the draft. Email sharing opens the user's email application. Japanese font files load when matching text requires them and are larger than Latin fonts.

Run `node tests/check-post.cjs` from the repository root. Check the home-page new-tab link, nested asset paths, envelope reveal, card flipping, and generated recipient links in a browser. Physical iPad and cross-browser checks remain outstanding.

QR images: Share → Create QR code opens a preview and Download QR PNG. Encoding and artwork drawing run entirely locally, including under file://. Codes use high error correction, a four-module white margin, integer pixel scaling, and a small envelope symbol that never covers function patterns. The encoder may increase symbol size to leave room for the envelope; very dense codes omit it. Oversized links show an error without truncating the message. Hosted links are required for scanning on another device. QR support is adapted from the locally installed BSD-licensed python-qrcode library; see qr-LICENSE.txt.

Run `node tests/check-post-qr.cjs` for matrix comparisons against independently generated python-qrcode fixtures covering all 40 versions. Physical phone/iPad scanning of branded codes remains a release check.

Opening Share automatically prepares the current card link and opens its sharing controls. Changes while on Share refresh the link and all sharing destinations. No link-generation button or network request is needed.
