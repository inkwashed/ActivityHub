# Let’s EiGo!
Repository for English textbook-based activities and games for use in and out of the classroom.

## Home page

Open `index.html` locally for the textbook activity directory. It links to Pizza Builder and the usage terms, supports English/Japanese interface text, and uses shared controls. Pizza Builder’s back arrow returns to its textbook section. Publish the repository root through GitHub Pages to include the home page.

## Shared design system

Read [the style guide](docs/STYLE-GUIDE.md) and open [the interactive examples](docs/style-guide.html). Shared styles and icons live under `shared/`. Keep that folder alongside `apps/` when moving or hosting the project.

## Building and updating applets

Start with [the central workflow](docs/WORKFLOW.md). It defines project goals, where standards live, the new-applet/update process, and how shared changes roll out across the collection. Root `AGENTS.md` directs future work to that reference; activity-specific instructions stay with each app.

## Copyright and permitted use

© 2026 letseigo.com. All rights reserved. Free for personal, classroom, and non-commercial educational use under [the terms of use](LICENSE.txt). Sharing official links and completed activity photos is permitted as described there. Redistribution, rehosting, resale, and use of the code or original assets in other products require prior written permission.

## Public domain and hosting

Public brand: **Let’s EiGo!**. Domain: **letseigo.com**. The owner has configured the domain and is awaiting certificate issuance. Live HTTPS has not been independently verified. `ActivityHub` remains the repository name.

Original GitHub Pages Pizza Builder address: https://inkwashed.github.io/ActivityHub/apps/pizza/index.html

Intended address after the custom domain is connected: https://letseigo.com/apps/pizza/index.html

The intended address is not a deployment verification. This documentation update does not configure DNS, GitHub Pages, redirects, or a CNAME file. Keep internal links and shared asset references relative so the app works under either hosting path. Once the domain is connected and verified, update this section to record the live address.

Homepage usage terms open in a native, scrollable dialog with a close button and Escape dismissal; closing returns focus to the opener. Applet footers remain text only. `LICENSE.txt` is authoritative: after editing it, run `node scripts/sync-license.cjs` to update the embedded homepage text. Embedding allows direct local opening without a network request. The license wording remains English; dialog controls support English/Japanese.

The homepage pizza preview uses the applet’s original topping artwork and placement engine: regular cheese and corn with tomato sauce. Rebuild after relevant artwork changes with `node scripts/build-pizza-preview.cjs`.
