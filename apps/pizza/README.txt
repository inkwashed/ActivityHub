PIZZA BUILDER · v0.13

GET STARTED
Open apps/pizza/index.html from the ActivityHub folder in a desktop browser.
Keep the apps/ and shared/ folders together; both contain required assets.
No installation, internet connection, account, or build step is required.
For an iPad, serve ActivityHub through a local/static web server and open its
address in Safari. iPad Files previews may not execute JavaScript as a browser does.

PLAY
Start with a dry crust. Choose no sauce, tomato sauce, alfredo sauce, or BBQ sauce.
Sauces spread from the center in a ladle-like spiral. Choose no sauce to remove
the sauce. Switching sauces restarts the spread; reduced-motion skips it.
Tap a topping: none → light → regular → extra → none.
The three dots indicate the amount. A fourth tap removes that ingredient.
Higher levels preserve earlier pieces and sprinkle in additional pieces.
Clear Pizza removes all toppings and returns to a dry crust with no sauce choice selected.
Cheese is rendered beneath other toppings, as scattered seven-shred clusters.
The sentence reflects the selected toppings; with none, it names the sauce. An explicit no-sauce choice is included
in the sentence when toppings are present.

ACCESSIBILITY
Native buttons support touch, keyboard Tab, Enter, and Space. Visible focus
rings, screen-reader quantity labels and announcements, and reduced-motion
support are included. There are no sound effects or external requests.

FILES / EXTENDING
config.js: recipe data, sauce palette, original SVG food art, piece sizes,
           cumulative quantity counts, and initial pseudo-random seed.
builder.js: FoodBuilder engine, stable placements, state, rendering, controls.
styles.css: responsive layout, pizza base, ingredient cards, and animation.
index.html: page structure and English-learning prompts.

A new recipe can reuse FoodBuilder with another configuration of sauces and
toppings. Adapt the base CSS and page wording for parfaits or other activities.
The current base is circular; a parfait glass will need a different placement
boundary in placements(). The engine is separated from recipe data, rather
than claiming every possible food shape is already implemented.

Placements use a seeded pseudo-random generator and are retained until Clear
Pizza. Removing/re-adding a topping restores its positions. Clear Pizza creates
a fresh layout for the next pizza. State lasts only for the current page visit.
All graphics are original simple SVG/CSS illustrations; no textbook art is used.

v0.6: Even dough color with edge shading. Sauce uses a continuously growing
spiral path instead of a dashed mask, avoiding disconnected patches.

Nine toppings now include sausage and pepperoni, with cheese first.
The compact tablet layout targets 768 x 1024 portrait and 1024 x 768 landscape,
including reduced browser content heights of 900 and 650 pixels respectively.
Nine topping cards stay in three rows. The pizza scales with available height.
Scrolling remains available on phones, short windows, and with enlarged text.
The tablet layout has not yet been visually verified on a physical iPad.

v0.6: Button and bottom-to-top layer order: cheese, pepperoni, sausage,
tomatoes, green peppers, mushrooms, onions, pineapples, corn.
Layer order stays fixed regardless of the order ingredients are tapped.

v0.6: Fullscreen toggle beside the lesson info. Tap again to exit; browser exit
controls and Escape also update the icon. Pizza selections are preserved.
Uses the browser Fullscreen API, including the WebKit-prefixed variant where
available. Unsupported browsers show a short message and remain usable.
fullscreen.js contains this behavior independently of the builder engine.

v0.7: Quantity dots sit directly below their labels, with shorter topping cards.
The compact layout also applies to wide desktop/fullscreen windows, removing
the previous 1400px limit. Matching closing quotation mark added to the order.

v0.8: Tablet/desktop layout fills the current viewport height. Header height is
measured automatically; the pizza uses the largest square that fits between
its heading and order controls. Ingredient rows expand with the available
height while label-to-dot gaps stay tight. Width remains bounded by the columns.
Small windows and enlarged text retain natural scrolling. Modern container
units size the pizza; older browsers retain the previous bounded pizza size.
Actual device/browser visual verification is still needed.

v0.9: Advanced Mode switch appears left of the lesson info and starts off.
All selected sauces now appear as "with tomato sauce", "with alfredo sauce",
"with BBQ sauce", or "with no sauce". No sauce phrase appears before a choice.
Advanced Mode adds "a little bit of" for light and "a lot of" for extra; regular
amounts keep their plain names. When all nine toppings share a nonzero level,
the order becomes "a little bit of everything", "some of everything", or
"a lot of everything", followed by the selected sauce. Turning the mode off
restores plain ingredient names. Clear Pizza preserves the mode setting.

Basic Mode says "I want everything" plus the sauce when all nine toppings are
present, regardless of their individual amounts.

v0.10: Advanced Mode groups toppings by quantity: a little bit of, some, then
 a lot of. Each amount is spoken once per group. Ingredients retain tray order
within their group. Sauce remains at the end. Basic Mode and everything
shortcuts retain their behavior. Regular amounts now explicitly say "some".

v0.11: The header mode control is now a wide pill with EASY/HARD text inside
and a sliding knob. EASY is the default basic mode; HARD uses grouped quantity
phrases. Keyboard and screen-reader switch behavior are preserved.

v0.12: Command symbol in the mode knob; disabled back-to-textbook placeholder;
language settings showing English and Japanese coming soon; Clear Pizza is now
Reset. Share opens a completed pizza photo preview with a Download photo link.
The photo is a PNG with a white instant-photo frame, the current order sentence,
and a stylized baked crust/cheese treatment. Topping positions and amounts are
preserved. It is rendered locally without uploading anything. This does not
publish a link or send a message. The editable pizza remains uncooked.
Keep sharing.js with the other app files. Browser-dependent image decoding and
download behavior, especially iPad saving, still need real-device verification.
The back button is deliberately disabled until the textbook resource list exists.

v0.13: Shared button styles, palette, and balanced language icon. Keep the
ActivityHub shared/ folder alongside apps/. The app folder alone no longer
contains all UI assets. See ../../docs/STYLE-GUIDE.md and style-guide.html.

Japanese interface support: choose 日本語 from the language button. Controls and
instructions translate; food vocabulary, the question, order, and photo caption
remain English. Selection lasts for the current page visit and preserves pizza
and difficulty state. Shared i18n scripts and the app ui-ja.js must be included.

The starting interface language follows supported browser/system preferences
(ja-JP → Japanese, en-US → English). If none match, English is used. Manual
selection lasts for this page visit; the lesson content remains English.

FREE MODE
Use TAP / FREE beside the topping heading. TAP and FREE retain separate pizzas
and sauces for this page visit. FREE adds one piece per ingredient tap and
forces EASY; TAP restores its previous difficulty. Reset clears only the active
pizza. Select a piece, drag it, or use Smaller/Larger, rotate, Flip, Duplicate,
and Delete. The piece list can select items hidden under other toppings.
Arrow keys move a focused piece (Shift moves farther); Delete removes it.
Pieces stay within the pizza with scale limited to 0.5–2.5 and 120 pieces max.
Share captures FREE positions, sizes, rotations, flips, and fixed layer order.
Touch/mouse dragging uses pointer events. Pinch/twist gestures are not included.
creative.js is required. Real-device drag and export rendering checks remain.

FREE controls now use a vertical icon toolbar beside the pizza. The compact
piece picker sits in the toppings header. The info button beside TAP/FREE opens
the instructions. Icons retain translated screen-reader labels and tooltips.

Public identity: letseigo.com. See the repository README for current hosting
and planned domain status. Copyright attribution uses the shared domain notice.
