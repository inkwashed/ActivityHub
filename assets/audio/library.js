/* Approved shared recordings; URLs resolve relative to this script, including file: previews. */
(() => {
  const base = document.currentScript.src;
  const clips = {
  "0": "en-US/heart-070/number-0.mp3?v=ef05ea1b75e2",
  "1": "en-US/heart-070/number-1.mp3?v=69889f387f29",
  "10": "en-US/heart-070/number-10.mp3?v=eff1bd7edc5d",
  "100": "en-US/heart-070/number-100.mp3?v=a9317bcbc961",
  "11": "en-US/heart-070/number-11.mp3?v=a9f853cddafd",
  "12": "en-US/heart-070/number-12.mp3?v=0406c9dd0e6f",
  "13": "en-US/heart-070/number-13.mp3?v=9272b57fffe7",
  "14": "en-US/heart-070/number-14.mp3?v=20b946a5bcc1",
  "15": "en-US/heart-070/number-15.mp3?v=d0ebc772d340",
  "16": "en-US/heart-070/number-16.mp3?v=0bef4eac3adf",
  "17": "en-US/heart-070/number-17.mp3?v=67dc65de51aa",
  "18": "en-US/heart-070/number-18.mp3?v=5e46815aa2d7",
  "19": "en-US/heart-070/number-19.mp3?v=26049ceb2e47",
  "2": "en-US/heart-070/number-2.mp3?v=3f72aa870d2e",
  "20": "en-US/heart-070/number-20.mp3?v=41f9b97f3d54",
  "3": "en-US/heart-070/number-3.mp3?v=05b8617d8888",
  "30": "en-US/heart-070/number-30.mp3?v=6fb698933ba0",
  "4": "en-US/heart-070/number-4.mp3?v=a544c8ff334d",
  "40": "en-US/heart-070/number-40.mp3?v=e21ab5a0a600",
  "5": "en-US/heart-070/number-5.mp3?v=d1c4a555c517",
  "50": "en-US/heart-070/number-50.mp3?v=1862b166672c",
  "6": "en-US/heart-070/number-6.mp3?v=80c516253841",
  "60": "en-US/heart-070/number-60.mp3?v=27e769b59b52",
  "7": "en-US/heart-070/number-7.mp3?v=aa1ae800e905",
  "70": "en-US/heart-070/number-70.mp3?v=18556ce4a447",
  "8": "en-US/heart-070/number-8.mp3?v=c7e0edeaa101",
  "80": "en-US/heart-070/number-80.mp3?v=adcbe2994c05",
  "9": "en-US/heart-070/number-9.mp3?v=8268671e7e98",
  "90": "en-US/heart-070/number-90.mp3?v=0400fc0524db",
  "a": "en-US/heart-070/a.mp3?v=e2d47409dc72",
  "a little bit of": "en-US/heart-070/a-little-bit-of.mp3?v=ef21922427e5",
  "a lot of": "en-US/heart-070/a-lot-of.mp3?v=d3da9e795fda",
  "aichi": "en-US/heart-070/source-aichi.mp3?v=f62376911ed4",
  "alfredo sauce": "en-US/heart-070/alfredo-sauce.mp3?v=b551c12a4c34",
  "america": "en-US/heart-070/source-america.mp3?v=d8a058fc61d4",
  "an": "en-US/heart-070/an.mp3?v=5f6efc407f84",
  "and": "en-US/heart-070/and.mp3?v=7b2e9072356d",
  "aomori": "en-US/heart-070/source-aomori.mp3?v=ca4a5ea75928",
  "apple": "en-US/heart-070/apple.mp3?v=d3f0971f03cf",
  "apples": "en-US/heart-070/apples.mp3?v=00b49a441675",
  "australia": "en-US/heart-070/source-australia.mp3?v=6b62822d6b9c",
  "bacon": "en-US/heart-070/bacon.mp3?v=4df0f57ae99e",
  "banana": "en-US/heart-070/banana.mp3?v=7f5b48db559e",
  "bananas": "en-US/heart-070/bananas.mp3?v=6c51e5b465e9",
  "bbq sauce": "en-US/heart-070/bbq-sauce.mp3?v=e226af6ed2a1",
  "beef": "en-US/heart-070/beef.mp3?v=d4fc90fa762a",
  "big": "en-US/heart-070/big.mp3?v=75febf9125ef",
  "black": "en-US/heart-070/black.mp3?v=9259331e0cd0",
  "blue": "en-US/heart-070/blue.mp3?v=b8bcd8f11069",
  "bread": "en-US/heart-070/bread.mp3?v=79f1e3af1999",
  "bread slice": "en-US/heart-070/bread-slice.mp3?v=39172b149199",
  "bread slices": "en-US/heart-070/bread-slices.mp3?v=54d9142f62a8",
  "brown": "en-US/heart-070/brown.mp3?v=8cd22b3f08ee",
  "calendar": "en-US/heart-070/calendar.mp3?v=5a751260438b",
  "calendars": "en-US/heart-070/calendars.mp3?v=c495b1df27c7",
  "caramel": "en-US/heart-070/caramel.mp3?v=2e0e64f7d901",
  "caramel syrup": "en-US/heart-070/caramel-syrup.mp3?v=995a11386f3b",
  "cheese": "en-US/heart-070/cheese.mp3?v=460ada9daa99",
  "cherries": "en-US/heart-070/cherries.mp3?v=31193bcb8ce6",
  "cherry": "en-US/heart-070/cherry.mp3?v=94aaa8afa7e9",
  "chicken": "en-US/heart-070/chicken.mp3?v=144156cd0da2",
  "chile": "en-US/heart-070/source-chile.mp3?v=863cca5950c9",
  "chocolate": "en-US/heart-070/chocolate.mp3?v=be9a665bbcc5",
  "chocolate syrup": "en-US/heart-070/chocolate-syrup.mp3?v=3f8d93d2c3d3",
  "colored pencil": "en-US/heart-070/colored-pencil.mp3?v=afe26b2b474d",
  "colored pencils": "en-US/heart-070/colored-pencils.mp3?v=880d0f90ec2f",
  "corn": "en-US/heart-070/corn.mp3?v=20ae25d6c8bb",
  "cucumber": "en-US/heart-070/cucumber.mp3?v=68dfbb137aa3",
  "do you have a": "en-US/heart-070/do-you-have-a.mp3?v=f903ebc2fa30",
  "do you have an": "en-US/heart-070/do-you-have-an.mp3?v=3b2b1449761b",
  "ecuador": "en-US/heart-070/source-ecuador.mp3?v=abbe588aeb6a",
  "eraser": "en-US/heart-070/eraser.mp3?v=6b9e6b7d5f25",
  "erasers": "en-US/heart-070/erasers.mp3?v=2e1d239fef36",
  "everything": "en-US/heart-070/everything.mp3?v=040eadb65d5e",
  "fukuoka": "en-US/heart-070/source-fukuoka.mp3?v=5d9c32177b35",
  "glue stick": "en-US/heart-070/glue-stick.mp3?v=ab21f4607bca",
  "glue sticks": "en-US/heart-070/glue-sticks.mp3?v=825aa90900b5",
  "green": "en-US/heart-070/green.mp3?v=c9ee5eb943e4",
  "green pepper": "en-US/heart-070/green-pepper.mp3?v=246e0c45cb8f",
  "green peppers": "en-US/heart-070/green-peppers.mp3?v=dfbd1eae36b2",
  "gunma": "en-US/heart-070/source-gunma.mp3?v=c3b5d901e49e",
  "ham": "en-US/heart-070/ham.mp3?v=d5fbc6af71a1",
  "hokkaido": "en-US/heart-070/source-hokkaido.mp3?v=b9a7f569e03b",
  "hyogo": "en-US/heart-070/source-hyogo.mp3?v=30f3131421b2",
  "i have": "en-US/heart-070/i-have.mp3?v=3b9ee28bc5d5",
  "i want": "en-US/heart-070/i-want.mp3?v=cd454ffa189a",
  "ibaraki": "en-US/heart-070/source-ibaraki.mp3?v=ba07cab52ad1",
  "india": "en-US/heart-070/source-india.mp3?v=56f5b6ec44ce",
  "indonesia": "en-US/heart-070/source-indonesia.mp3?v=5a4a8e30fd0a",
  "is for": "en-US/heart-070/is-for.mp3?v=c27d3f48bd60",
  "it's from": "en-US/heart-070/it-s-from.mp3?v=b6e6e38e0626",
  "italy": "en-US/heart-070/source-italy.mp3?v=c5b29371d8da",
  "iwate": "en-US/heart-070/source-iwate.mp3?v=e37d2e0f9c5b",
  "kagoshima": "en-US/heart-070/source-kagoshima.mp3?v=100b5a2b006d",
  "kiwi fruit": "en-US/heart-070/kiwi-fruit.mp3?v=e7b166d8fd99",
  "kiwi fruits": "en-US/heart-070/kiwi-fruits.mp3?v=02564c46f762",
  "kochi": "en-US/heart-070/source-kochi.mp3?v=06277b35150c",
  "kumamoto": "en-US/heart-070/source-kumamoto.mp3?v=6c3e4138cdb5",
  "lettuce": "en-US/heart-070/lettuce.mp3?v=1d6b2c9fc787",
  "magnet": "en-US/heart-070/magnet.mp3?v=fdb77e4944f0",
  "magnets": "en-US/heart-070/magnets.mp3?v=8dd67859df95",
  "marker": "en-US/heart-070/marker.mp3?v=0da7712c6b1f",
  "markers": "en-US/heart-070/markers.mp3?v=9a4025c33c1f",
  "medium": "en-US/heart-070/medium.mp3?v=b3242e15868d",
  "melon": "en-US/heart-070/melon.mp3?v=6adf97491361",
  "melons": "en-US/heart-070/melons.mp3?v=cc82a1c46e69",
  "mexico": "en-US/heart-070/source-mexico.mp3?v=a3f042bda8af",
  "mint chocolate chip": "en-US/heart-070/mint-chocolate-chip.mp3?v=cfbf64b40653",
  "mint chocolate chip ice cream": "en-US/heart-070/mint-chocolate-chip-ice-cream.mp3?v=6137b6ba5add",
  "mint chocolate chip scoop": "en-US/heart-070/mint-chocolate-chip-scoop.mp3?v=b20d77d4d8a1",
  "mint chocolate chip scoops": "en-US/heart-070/mint-chocolate-chip-scoops.mp3?v=c51b2ed653eb",
  "miyazaki": "en-US/heart-070/source-miyazaki.mp3?v=d84b1025f24c",
  "mushroom": "en-US/heart-070/mushroom.mp3?v=4a728da200a9",
  "mushrooms": "en-US/heart-070/mushrooms.mp3?v=7aba78f10000",
  "my sandwich is": "en-US/heart-070/my-sandwich-is.mp3?v=cdb8c0be7bd0",
  "my sandwich is a": "en-US/heart-070/my-sandwich-is-a.mp3?v=f71cfdadca44",
  "my sandwich is an": "en-US/heart-070/my-sandwich-is-an.mp3?v=a6a4c520d388",
  "nagano": "en-US/heart-070/source-nagano.mp3?v=3057409c400f",
  "new zealand": "en-US/heart-070/source-new-zealand.mp3?v=591e7dcba62f",
  "no ice cream": "en-US/heart-070/no-ice-cream.mp3?v=861eb7c49e4d",
  "no sauce": "en-US/heart-070/no-sauce.mp3?v=62ab1be7382b",
  "no syrup": "en-US/heart-070/no-syrup.mp3?v=e6af0dbcb935",
  "notebook": "en-US/heart-070/notebook.mp3?v=046c4d3f9c67",
  "notebooks": "en-US/heart-070/notebooks.mp3?v=1a6b3fbb18ba",
  "onion": "en-US/heart-070/onion.mp3?v=3962f20b809d",
  "onions": "en-US/heart-070/onions.mp3?v=485c0e3b36f5",
  "orange": "en-US/heart-070/orange.mp3?v=69adaf8d8aea",
  "oranges": "en-US/heart-070/oranges.mp3?v=21da0d171b03",
  "peach": "en-US/heart-070/peach.mp3?v=cdbf149e7118",
  "peaches": "en-US/heart-070/peaches.mp3?v=5b7884909ccb",
  "pen": "en-US/heart-070/pen.mp3?v=2c0cdf5611c5",
  "pencil": "en-US/heart-070/pencil.mp3?v=cb5f54763344",
  "pencil case": "en-US/heart-070/pencil-case.mp3?v=0d069d6d44cb",
  "pencil sharpener": "en-US/heart-070/pencil-sharpener.mp3?v=56c7a7b5d8e8",
  "pencil sharpeners": "en-US/heart-070/pencil-sharpeners.mp3?v=5603e15cf785",
  "pencils": "en-US/heart-070/pencils.mp3?v=f4810484fc67",
  "pens": "en-US/heart-070/pens.mp3?v=cc6d90b32833",
  "pepperoni": "en-US/heart-070/pepperoni.mp3?v=320822504b94",
  "pineapple": "en-US/heart-070/pineapple.mp3?v=5889b1ea3662",
  "pineapples": "en-US/heart-070/pineapples.mp3?v=3c20e20c80ea",
  "pink": "en-US/heart-070/pink.mp3?v=4c385f818c2b",
  "pizza": "en-US/heart-070/pizza.mp3?v=cf2799596b13",
  "pork": "en-US/heart-070/pork.mp3?v=369fd4738820",
  "purple": "en-US/heart-070/purple.mp3?v=01da17e6904e",
  "red": "en-US/heart-070/red.mp3?v=afca6c7aa40e",
  "ruler": "en-US/heart-070/ruler.mp3?v=943b4be08842",
  "rulers": "en-US/heart-070/rulers.mp3?v=b1a7f0c5bc2a",
  "saga": "en-US/heart-070/source-saga.mp3?v=e21965ddbc79",
  "saitama": "en-US/heart-070/source-saitama.mp3?v=eabc5dfd83f3",
  "sausage": "en-US/heart-070/sausage.mp3?v=199d5335c8a4",
  "sausages": "en-US/heart-070/sausages.mp3?v=962b675a40e4",
  "shrimp": "en-US/heart-070/shrimp.mp3?v=9f002218bc23",
  "small": "en-US/heart-070/small.mp3?v=07398cbdd907",
  "some": "en-US/heart-070/some.mp3?v=bde600f480c9",
  "some of": "en-US/heart-070/some-of.mp3?v=b4db2b06c147",
  "stapler": "en-US/heart-070/stapler.mp3?v=8f334b50e84a",
  "staplers": "en-US/heart-070/staplers.mp3?v=e08238b750be",
  "strawberries": "en-US/heart-070/strawberries.mp3?v=c02be82c931f",
  "strawberry": "en-US/heart-070/strawberry.mp3?v=84988921967e",
  "strawberry ice cream": "en-US/heart-070/strawberry-ice-cream.mp3?v=23a16580c0b2",
  "strawberry scoop": "en-US/heart-070/strawberry-scoop.mp3?v=2c0f4d56faad",
  "strawberry scoops": "en-US/heart-070/strawberry-scoops.mp3?v=bd79fd2544cc",
  "strawberry syrup": "en-US/heart-070/strawberry-syrup.mp3?v=6fb66815a443",
  "tell me about your sandwich.": "en-US/heart-070/tell-me-about-your-sandwich.mp3?v=d9ed85775344",
  "thailand": "en-US/heart-070/source-thailand.mp3?v=de57766f7eab",
  "the philippines": "en-US/heart-070/source-the-philippines.mp3?v=d480e4788c58",
  "tochigi": "en-US/heart-070/source-tochigi.mp3?v=da97aa374e7f",
  "tomato": "en-US/heart-070/tomato.mp3?v=18f1bb0ebb16",
  "tomato sauce": "en-US/heart-070/tomato-sauce.mp3?v=0fd0f725927b",
  "tomatoes": "en-US/heart-070/tomatoes.mp3?v=b10983160a0f",
  "vanilla": "en-US/heart-070/vanilla.mp3?v=649263e5d940",
  "vanilla ice cream": "en-US/heart-070/vanilla-ice-cream.mp3?v=d10a87fa6d69",
  "vanilla scoop": "en-US/heart-070/vanilla-scoop.mp3?v=6be56cb8975d",
  "vanilla scoops": "en-US/heart-070/vanilla-scoops.mp3?v=e3ece402ac90",
  "vietnam": "en-US/heart-070/source-vietnam.mp3?v=dd8f46359f75",
  "what do you want?": "en-US/heart-070/what-do-you-want.mp3?v=3ad714bd5490",
  "white": "en-US/heart-070/white.mp3?v=8f41a7963d57",
  "with": "en-US/heart-070/with.mp3?v=95ccdada9d86",
  "yellow": "en-US/heart-070/yellow.mp3?v=19fbf0b20bac"
};
  const letterClips = {
  "A": "en-US/heart-070/letter-a.mp3?v=6253951fb735",
  "B": "en-US/heart-070/letter-b.mp3?v=87c791ebb643",
  "C": "en-US/heart-070/letter-c.mp3?v=3535d42fbcb2",
  "G": "en-US/heart-070/letter-g.mp3?v=e4a3988d8fef",
  "H": "en-US/heart-070/letter-h.mp3?v=596874e50a76",
  "K": "en-US/heart-070/letter-k.mp3?v=d76415d5f6bf",
  "L": "en-US/heart-070/letter-l.mp3?v=edd8c34d6d93",
  "O": "en-US/heart-070/letter-o.mp3?v=a1d789c50bac",
  "P": "en-US/heart-070/letter-p.mp3?v=214c2a4a2629",
  "S": "en-US/heart-070/letter-s.mp3?v=b9ae018f3cb6",
  "T": "en-US/heart-070/letter-t.mp3?v=0350387c00b2"
};
  const clean = text => text.replace(/’/g, "'").replace(/\s+/g, " ").trim();
  const normalize = text => clean(text).toLowerCase();
  const supplies = new Set(['pencil', 'colored pencil', 'pencil case', 'ruler',
    'glue stick', 'pen', 'notebook', 'calendar', 'stapler', 'pencil sharpener',
    'marker', 'magnet', 'eraser']);
  const resolve = text => {
    const path = clips[normalize(text)];
    return path ? new URL(path, base).href : null;
  };
  const phrases = Object.keys(clips).filter(text => !/^\d+$/.test(text)).sort((a,b) => b.length-a.length);
  const numberParts = number => {
    if (number < 0 || number > 120) return null;
    if (resolve(String(number))) return [String(number)];
    if (number > 100) return ['100', ...numberParts(number-100)];
    return [String(Math.floor(number/10)*10), String(number%10)];
  };
  window.ActivityHubAudio = { resolve, resolveSequence(text) {
    const original = clean(text), normalized = normalize(text);
    // Existing exact recordings take priority over assembling the same phrase.
    if (resolve(text)) return null;
    if (/^do you have a (?:…|\.\.\.)\?$/.test(normalized)) return [resolve('Do you have a')];
    const match = /^do you have (a|an) (.+)\?$/.exec(normalized);
    if (match) {
      if (!supplies.has(match[2])) return null;
      const article = /^[aeiou]/.test(match[2]) ? 'an' : 'a';
      if (match[1] !== article) return null;
      const urls = [resolve(`Do you have ${article}`), resolve(match[2])];
      return urls.every(Boolean) ? urls : null;
    }
    // Only activity output templates are eligible. Resolve the entire sentence
    // before playback; never omit an unknown word or start a partial recording.
    if (!/^(?:i have|i want|my sandwich is)(?:\s|[.…])/i.test(original)) return null;
    const sandwich = /^my sandwich is\b/i.test(original);
    let remaining = original;
    const urls = [];
    while (remaining) {
      const separator = /^[\s,.…]+/.exec(remaining);
      if (separator) { remaining = remaining.slice(separator[0].length); continue; }
      const initial = sandwich && /^([A-Z]+)(?=[\s,.…]|$)/.exec(remaining);
      if (initial && [...initial[1]].every(letter => letterClips[letter])) {
        urls.push(...[...initial[1]].map(letter => new URL(letterClips[letter], base).href));
        remaining = remaining.slice(initial[1].length); continue;
      }
      const numeral = /^(0|[1-9]\d*)(?=[\s,.…]|$)/.exec(remaining);
      if (numeral) {
        // Decimal quantities are not emitted by the builders.
        if (/^\d+\.\d/.test(remaining)) return null;
        const parts = numberParts(Number(numeral[1]));
        if (!parts) return null;
        const resolved = parts.map(resolve);
        if (!resolved.every(Boolean)) return null;
        urls.push(...resolved); remaining = remaining.slice(numeral[1].length); continue;
      }
      const lower = remaining.toLowerCase();
      const phrase = phrases.find(phrase => lower.startsWith(phrase) && (!lower[phrase.length] || /[\s,.…]/.test(lower[phrase.length])));
      if (!phrase) return null;
      urls.push(resolve(phrase)); remaining = remaining.slice(phrase.length);
    }
    return urls.length && urls.every(Boolean) ? urls : null;
  }};
})();
