# My Blog · Save the Animals

NEW HORIZON Elementary 6, Unit 6. Open `index.html` within the repository for
local/offline use. From the ActivityHub homepage, find the lesson under
NEW HORIZON Elementary 6. The repository structure provides shared styles,
scripts and artwork. The reader has no audio dependency.

## Lesson content

Edit `animals.js` for animal names, notes, illustrations, facts and sources.
Reusable problem illustrations are listed by vocabulary tag in `config.js`.
When an entry has no custom problem illustration, the reader uses the first
problem tag with a listed image.

`config.js` owns question patterns and the four optional ES sentence frames. The shared
Blog engine mounts `blog-reading.js` only for a design-style lesson with a
`reading` configuration. Notes and the last opened profile use a local key
separate from the normal draft. Export reads only the editor/design data.
The ES editor supports typing and handwriting, with optional Show Help overlays.
Earlier text drafts migrate into the four rows. A local copy of the original title
and body is retained under `letseigo.app.myblog-nh6-6.original-writing`.

The catalog has 36 profiles, including all 19 entries from the supplied handout.
The profile header uses Animal and Sea animal as classroom vocabulary labels.
The sea label includes sea birds and species that live in coastal mudflats.

| Profile | What changed for the lesson |
| --- | --- |
| Sea turtles | Added from the dictionary. Plastic waste and reusable shopping bags provide a concrete problem/action pair. |
| Giant pandas | Combined mountains and forests into one habitat and focused the forest-loss example on access to bamboo. Restoring forest in panda habitats is the action. |
| Polar bears | Specified Arctic sea ice where the handout says “the ice.” Saving energy is an everyday climate action. |
| Philippine crocodiles | Covers rivers, lakes and wetlands, with hunting and wetland loss as the problem tags. |
| Humphead wrasses | Kept overfishing and narrowed “the sea” to coral reefs. The action applies to this fish when it appears on a menu. |
| Blakiston’s fish owls | Kept the PDF's traffic-accident example and specified forests near rivers in Hokkaido. The action is for adults driving through owl habitat. |
| Malayan tapirs | Pairs forest loss with planting trees to reconnect habitat. |
| Japanese eels | Shows both river and sea habitats and pairs overfishing with choosing other fish. |
| Iriomote cats | Uses a second Japanese wildlife example to connect traffic accidents with slower driving. |
| Asian elephants | Forests and grasslands, with connected habitat for elephants to travel between forests. |
| Red pandas | Mountain forests and bamboo, with tree planting as a response to forest loss. |
| Emperor penguins | Antarctic sea ice and how early break-up affects chicks. |
| Bornean orangutans | Rainforest trees provide food, shelter and routes between habitat areas. |
| Koalas | Connects eucalyptus habitat and forest loss to planting suitable food trees. |
| Laysan albatrosses | Shows how seabirds can pick up floating plastic and feed it to their chicks. |
| Tigers | Uses forests, rainforests and grasslands, with connected habitat as an action. |
| Okapis | Focuses on the Congo rainforest and protecting it from forest loss. |
| Chimpanzees | Includes forest and savanna habitats, with connected forests as a response to habitat loss. |
| Giant armadillos | Introduces forest and savanna habitats and the burrows these animals dig. |
| Komodo dragons | Pairs savannas and forests with forest loss and rising seas. |
| Pygmy hippos | Focuses on forests near rivers in West Africa. |
| Blue corals | Shows blue skeletons on shallow reefs and uses a warm-seas illustration for global warming. |
| Horseshoe crabs | Focuses on tidal mudflats where young Japanese horseshoe crabs grow. |
| Mudskippers | Shares the mudflat loss and protection illustrations with horseshoe crabs. |
| Wild camels | Adds a desert example with drying springs and water-source protection. |
| Grévy’s zebras | Adds a savanna example with water shortages and access to watering places. |
| Amami rabbits | Reuses the traffic-accident illustrations for a Japanese forest species. |
| Singapore freshwater crabs | Adds a true crab from forest streams and a water pollution example. |
| North Atlantic right whales | Pairs boat strikes with slowing down where whales swim. |
| Oceanic whitetip sharks | Pairs the fishing nets tag with fishing gear that catches fewer sharks by mistake. |
| Southern Darwin’s frogs | Introduces a forest amphibian and reuses forest-loss artwork. |
| Przewalski’s horses | Adds a grassland example and a successful return to the wild. |
| Māui dolphins | Connects fishing net risk to fishing restrictions in dolphin habitat. |
| Salt-marsh harvest mice | Pairs wetland loss with restoring marsh habitat around San Francisco Bay. |
| Mountain gorillas | Connects forest loss to protecting mountain forests and reuses the forest illustrations. |
| Darwin’s foxes | Shows how keeping dogs under control near fox habitat can protect this Chilean species. |

The catalogue lists conservation references. The local WebP images are
original generated classroom illustrations and can be reviewed for species
appearance before publication. The PDF's artwork and dictionary illustrations
were used as teaching references only.

## Verification

Browser test: `node tests/check-blog-reading-browser.cjs` with Playwright and, if
needed, `CHROME_PATH`. The test uses the local HTML file. Existing Blog checks
include `node tests/check-blog-post.cjs`, `node tests/check-blog-layout.cjs`,
and `node tests/check-blog-ink.cjs`. Physical iPad touch and Safari testing
remain to be done.
