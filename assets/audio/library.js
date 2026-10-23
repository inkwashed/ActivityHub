/* Approved shared recordings; URLs resolve relative to this script, including file: previews. */
(() => {
  const base = document.currentScript.src;
  const clips = {
  "0": "en-US/heart-070/number-0.mp3?v=27012f3ccc47",
  "1": "en-US/heart-070/number-1.mp3?v=beb686edd76d",
  "10": "en-US/heart-070/number-10.mp3?v=114ce153df65",
  "100": "en-US/heart-070/number-100.mp3?v=d62a2f070fec",
  "11": "en-US/heart-070/number-11.mp3?v=cd67e09c6d03",
  "12": "en-US/heart-070/number-12.mp3?v=283363e6515e",
  "13": "en-US/heart-070/number-13.mp3?v=9f70d1753139",
  "14": "en-US/heart-070/number-14.mp3?v=53862b2b5d4a",
  "15": "en-US/heart-070/number-15.mp3?v=a823bb24d507",
  "16": "en-US/heart-070/number-16.mp3?v=0004369af684",
  "17": "en-US/heart-070/number-17.mp3?v=2cb29e55ec1e",
  "18": "en-US/heart-070/number-18.mp3?v=5902a4385997",
  "19": "en-US/heart-070/number-19.mp3?v=ec9258e26da8",
  "2": "en-US/heart-070/number-2.mp3?v=99a066de4b7a",
  "20": "en-US/heart-070/number-20.mp3?v=b71b81e10187",
  "3": "en-US/heart-070/number-3.mp3?v=e748b36b5a6f",
  "30": "en-US/heart-070/number-30.mp3?v=7a967303f69c",
  "4": "en-US/heart-070/number-4.mp3?v=756a66507dcc",
  "40": "en-US/heart-070/number-40.mp3?v=3edfdefc18e4",
  "5": "en-US/heart-070/number-5.mp3?v=291a3cde0c16",
  "50": "en-US/heart-070/number-50.mp3?v=ea2e82e7fac7",
  "6": "en-US/heart-070/number-6.mp3?v=75598d647624",
  "60": "en-US/heart-070/number-60.mp3?v=5abe3fc3086e",
  "7": "en-US/heart-070/number-7.mp3?v=4bbf84bc6c32",
  "70": "en-US/heart-070/number-70.mp3?v=9bc88d767581",
  "8": "en-US/heart-070/number-8.mp3?v=33b1843b55cf",
  "80": "en-US/heart-070/number-80.mp3?v=2d7e9748c8bc",
  "9": "en-US/heart-070/number-9.mp3?v=1e32acd8cb19",
  "90": "en-US/heart-070/number-90.mp3?v=d3ce71a6de20",
  "a": "en-US/heart-070/a.mp3?v=0e7c81b151a8",
  "a little bit of": "en-US/heart-070/a-little-bit-of.mp3?v=ef21922427e5",
  "a lot of": "en-US/heart-070/a-lot-of.mp3?v=d3da9e795fda",
  "aichi": "en-US/heart-070/source-aichi.mp3?v=7f12a3922a27",
  "alfredo sauce": "en-US/heart-070/alfredo-sauce.mp3?v=b784abcdf77b",
  "america": "en-US/heart-070/source-america.mp3?v=3610d67faafe",
  "an": "en-US/heart-070/an.mp3?v=7ac36865e709",
  "and": "en-US/heart-070/and.mp3?v=d29197ad02c4",
  "aomori": "en-US/heart-070/source-aomori.mp3?v=55c7c7d90483",
  "apple": "en-US/heart-070/apple.mp3?v=52fc30d361b9",
  "apples": "en-US/heart-070/apples.mp3?v=ce17ff093b3d",
  "australia": "en-US/heart-070/source-australia.mp3?v=68a7fad9df45",
  "bacon": "en-US/heart-070/bacon.mp3?v=964b917a6f15",
  "banana": "en-US/heart-070/banana.mp3?v=0d0af9ea1b9e",
  "bananas": "en-US/heart-070/bananas.mp3?v=fd3eda5b682b",
  "bbq sauce": "en-US/heart-070/bbq-sauce.mp3?v=9a070d6754b1",
  "beef": "en-US/heart-070/beef.mp3?v=a7c542053c47",
  "big": "en-US/heart-070/big.mp3?v=87b70c614e74",
  "black": "en-US/heart-070/black.mp3?v=51d1f5b6c8ac",
  "blue": "en-US/heart-070/blue.mp3?v=b1c20a73a5ea",
  "bread": "en-US/heart-070/bread.mp3?v=afbd9ed1b28f",
  "bread slice": "en-US/heart-070/bread-slice.mp3?v=924a3e1bd62e",
  "bread slices": "en-US/heart-070/bread-slices.mp3?v=6008929b9cf9",
  "brown": "en-US/heart-070/brown.mp3?v=526e016864ee",
  "calendar": "en-US/heart-070/calendar.mp3?v=7ab6fcba1919",
  "calendars": "en-US/heart-070/calendars.mp3?v=f63041cf7b0b",
  "caramel": "en-US/heart-070/caramel.mp3?v=91170a87dd65",
  "caramel syrup": "en-US/heart-070/caramel-syrup.mp3?v=8a307fb627c3",
  "cheese": "en-US/heart-070/cheese.mp3?v=ca84343d59dc",
  "cherries": "en-US/heart-070/cherries.mp3?v=e0aa1c5e2432",
  "cherry": "en-US/heart-070/cherry.mp3?v=d115e19a161b",
  "chicken": "en-US/heart-070/chicken.mp3?v=c3e141a3044d",
  "chile": "en-US/heart-070/source-chile.mp3?v=cfc8489d4a9c",
  "chocolate": "en-US/heart-070/chocolate.mp3?v=e06388adc213",
  "chocolate syrup": "en-US/heart-070/chocolate-syrup.mp3?v=febdc749340f",
  "colored pencil": "en-US/heart-070/colored-pencil.mp3?v=6e654e62a7b4",
  "colored pencils": "en-US/heart-070/colored-pencils.mp3?v=d5c880444491",
  "corn": "en-US/heart-070/corn.mp3?v=d9c6294c13ef",
  "cucumber": "en-US/heart-070/cucumber.mp3?v=2be2fd7452a4",
  "do you have a": "en-US/heart-070/do-you-have-a.mp3?v=f903ebc2fa30",
  "do you have an": "en-US/heart-070/do-you-have-an.mp3?v=9deb67257b2f",
  "ecuador": "en-US/heart-070/source-ecuador.mp3?v=bd6e92dd590e",
  "eraser": "en-US/heart-070/eraser.mp3?v=035002d4eec7",
  "erasers": "en-US/heart-070/erasers.mp3?v=3a34f99dec2f",
  "everything": "en-US/heart-070/everything.mp3?v=a1638c000808",
  "fukuoka": "en-US/heart-070/source-fukuoka.mp3?v=22a4abc16cdc",
  "glue stick": "en-US/heart-070/glue-stick.mp3?v=8aa8c2761ce7",
  "glue sticks": "en-US/heart-070/glue-sticks.mp3?v=1d2903b88021",
  "green": "en-US/heart-070/green.mp3?v=14d1a5d1330c",
  "green pepper": "en-US/heart-070/green-pepper.mp3?v=df4402c198e9",
  "green peppers": "en-US/heart-070/green-peppers.mp3?v=eb0bc0886648",
  "gunma": "en-US/heart-070/source-gunma.mp3?v=d771a64df725",
  "ham": "en-US/heart-070/ham.mp3?v=d57091822028",
  "hokkaido": "en-US/heart-070/source-hokkaido.mp3?v=e1cf264309a5",
  "hyogo": "en-US/heart-070/source-hyogo.mp3?v=23e324da6579",
  "i have": "en-US/heart-070/i-have.mp3?v=3b9ee28bc5d5",
  "i want": "en-US/heart-070/i-want.mp3?v=cd454ffa189a",
  "ibaraki": "en-US/heart-070/source-ibaraki.mp3?v=843663a61b7c",
  "india": "en-US/heart-070/source-india.mp3?v=3a59ba1e1193",
  "indonesia": "en-US/heart-070/source-indonesia.mp3?v=e7f43c4038ad",
  "is for": "en-US/heart-070/is-for.mp3?v=02e363f2ccb9",
  "it's from": "en-US/heart-070/it-s-from.mp3?v=b6e6e38e0626",
  "italy": "en-US/heart-070/source-italy.mp3?v=882b0fe1d9da",
  "iwate": "en-US/heart-070/source-iwate.mp3?v=1bb4a139207b",
  "kagoshima": "en-US/heart-070/source-kagoshima.mp3?v=3a051ff8adf8",
  "kiwi fruit": "en-US/heart-070/kiwi-fruit.mp3?v=2bf80883a44e",
  "kiwi fruits": "en-US/heart-070/kiwi-fruits.mp3?v=7d4b1c59db62",
  "kochi": "en-US/heart-070/source-kochi.mp3?v=0ac05e105da1",
  "kumamoto": "en-US/heart-070/source-kumamoto.mp3?v=5b623b18838e",
  "lettuce": "en-US/heart-070/lettuce.mp3?v=d11e79652670",
  "magnet": "en-US/heart-070/magnet.mp3?v=f85898372d72",
  "magnets": "en-US/heart-070/magnets.mp3?v=628a44362358",
  "marker": "en-US/heart-070/marker.mp3?v=fe48caac215d",
  "markers": "en-US/heart-070/markers.mp3?v=acf7ac63fe9d",
  "medium": "en-US/heart-070/medium.mp3?v=9b76ac10d8aa",
  "melon": "en-US/heart-070/melon.mp3?v=c1dc7529bdcf",
  "melons": "en-US/heart-070/melons.mp3?v=012a50bb7ede",
  "mexico": "en-US/heart-070/source-mexico.mp3?v=613f95bdf469",
  "mint chocolate chip": "en-US/heart-070/mint-chocolate-chip.mp3?v=94457b33c3a0",
  "mint chocolate chip ice cream": "en-US/heart-070/mint-chocolate-chip-ice-cream.mp3?v=361da97aec44",
  "mint chocolate chip scoop": "en-US/heart-070/mint-chocolate-chip-scoop.mp3?v=9ca3ba53a8f7",
  "mint chocolate chip scoops": "en-US/heart-070/mint-chocolate-chip-scoops.mp3?v=94a5df44086f",
  "miyazaki": "en-US/heart-070/source-miyazaki.mp3?v=d8de4e60c20f",
  "mushroom": "en-US/heart-070/mushroom.mp3?v=9249935a5532",
  "mushrooms": "en-US/heart-070/mushrooms.mp3?v=5114e5ff19b6",
  "my sandwich is": "en-US/heart-070/my-sandwich-is.mp3?v=0f0cbf6442b6",
  "my sandwich is a": "en-US/heart-070/my-sandwich-is-a.mp3?v=f71cfdadca44",
  "my sandwich is an": "en-US/heart-070/my-sandwich-is-an.mp3?v=9d4010b364fb",
  "nagano": "en-US/heart-070/source-nagano.mp3?v=89ca34fc5224",
  "new zealand": "en-US/heart-070/source-new-zealand.mp3?v=fb6825b94911",
  "no ice cream": "en-US/heart-070/no-ice-cream.mp3?v=443570f34c29",
  "no sauce": "en-US/heart-070/no-sauce.mp3?v=41dd2cc3cb34",
  "no syrup": "en-US/heart-070/no-syrup.mp3?v=eadcfad50f74",
  "notebook": "en-US/heart-070/notebook.mp3?v=c5abb6cdaadd",
  "notebooks": "en-US/heart-070/notebooks.mp3?v=7827b3d3f2ed",
  "onion": "en-US/heart-070/onion.mp3?v=a6ac431698b3",
  "onions": "en-US/heart-070/onions.mp3?v=bc5940dc65cd",
  "orange": "en-US/heart-070/orange.mp3?v=8992cdff9b63",
  "oranges": "en-US/heart-070/oranges.mp3?v=41ccbfd772d8",
  "peach": "en-US/heart-070/peach.mp3?v=b838e3ddf295",
  "peaches": "en-US/heart-070/peaches.mp3?v=5d9ac11b4124",
  "pen": "en-US/heart-070/pen.mp3?v=fb4629dbd83d",
  "pencil": "en-US/heart-070/pencil.mp3?v=1b5d64928b54",
  "pencil case": "en-US/heart-070/pencil-case.mp3?v=9f57456c307d",
  "pencil sharpener": "en-US/heart-070/pencil-sharpener.mp3?v=63397c4445ed",
  "pencil sharpeners": "en-US/heart-070/pencil-sharpeners.mp3?v=c1f44d6578a8",
  "pencils": "en-US/heart-070/pencils.mp3?v=0291fa846205",
  "pens": "en-US/heart-070/pens.mp3?v=ff69599740c8",
  "pepperoni": "en-US/heart-070/pepperoni.mp3?v=cf4f09fba42e",
  "pineapple": "en-US/heart-070/pineapple.mp3?v=e2687d2fa456",
  "pineapples": "en-US/heart-070/pineapples.mp3?v=d2a811530faa",
  "pink": "en-US/heart-070/pink.mp3?v=0b4f96d1d77a",
  "pizza": "en-US/heart-070/pizza.mp3?v=8cca153f9f41",
  "pork": "en-US/heart-070/pork.mp3?v=a9c6d6bf85c2",
  "purple": "en-US/heart-070/purple.mp3?v=4d304d232c6b",
  "red": "en-US/heart-070/red.mp3?v=cacfd119fea5",
  "ruler": "en-US/heart-070/ruler.mp3?v=f13d373d9cd4",
  "rulers": "en-US/heart-070/rulers.mp3?v=0d2f23ced03a",
  "saga": "en-US/heart-070/source-saga.mp3?v=aa93bf48ea6e",
  "saitama": "en-US/heart-070/source-saitama.mp3?v=a9c9c174a2ac",
  "sausage": "en-US/heart-070/sausage.mp3?v=34fb46253970",
  "sausages": "en-US/heart-070/sausages.mp3?v=54ec8b84de1a",
  "shrimp": "en-US/heart-070/shrimp.mp3?v=3edbd094dad8",
  "small": "en-US/heart-070/small.mp3?v=bfa0b59b1115",
  "some": "en-US/heart-070/some.mp3?v=bde600f480c9",
  "some of": "en-US/heart-070/some-of.mp3?v=b4db2b06c147",
  "stapler": "en-US/heart-070/stapler.mp3?v=38c5fdd6ffa3",
  "staplers": "en-US/heart-070/staplers.mp3?v=ad8582cde0d4",
  "strawberries": "en-US/heart-070/strawberries.mp3?v=c09af2693fd5",
  "strawberry": "en-US/heart-070/strawberry.mp3?v=17ade453f0e7",
  "strawberry ice cream": "en-US/heart-070/strawberry-ice-cream.mp3?v=d7ae67fb9e4f",
  "strawberry scoop": "en-US/heart-070/strawberry-scoop.mp3?v=2b30a2491ea1",
  "strawberry scoops": "en-US/heart-070/strawberry-scoops.mp3?v=8bd5790b697c",
  "strawberry syrup": "en-US/heart-070/strawberry-syrup.mp3?v=ede777eaa172",
  "tell me about your sandwich.": "en-US/heart-070/tell-me-about-your-sandwich.mp3?v=8b8c411278d1",
  "thailand": "en-US/heart-070/source-thailand.mp3?v=aa83262d4c2b",
  "the philippines": "en-US/heart-070/source-the-philippines.mp3?v=a44d0ee537ba",
  "tochigi": "en-US/heart-070/source-tochigi.mp3?v=506373ce2a46",
  "tomato": "en-US/heart-070/tomato.mp3?v=d6dd4f7fdedd",
  "tomato sauce": "en-US/heart-070/tomato-sauce.mp3?v=fb3be29ddf9c",
  "tomatoes": "en-US/heart-070/tomatoes.mp3?v=992b8a455216",
  "vanilla": "en-US/heart-070/vanilla.mp3?v=a6f4ac743c00",
  "vanilla ice cream": "en-US/heart-070/vanilla-ice-cream.mp3?v=f9c354a85754",
  "vanilla scoop": "en-US/heart-070/vanilla-scoop.mp3?v=e84f3bffb88f",
  "vanilla scoops": "en-US/heart-070/vanilla-scoops.mp3?v=1e6271189df8",
  "vietnam": "en-US/heart-070/source-vietnam.mp3?v=83f8d47d5f98",
  "what do you want?": "en-US/heart-070/what-do-you-want.mp3?v=6b17d363cbb8",
  "white": "en-US/heart-070/white.mp3?v=e68f715dfae7",
  "with": "en-US/heart-070/with.mp3?v=95ccdada9d86",
  "yellow": "en-US/heart-070/yellow.mp3?v=52f58b0c406c"
};
  const letterClips = {
  "A": "en-US/heart-070/letter-a.mp3?v=17d9dee72eea",
  "B": "en-US/heart-070/letter-b.mp3?v=6933e9bcc250",
  "C": "en-US/heart-070/letter-c.mp3?v=d3a4e3b56de3",
  "G": "en-US/heart-070/letter-g.mp3?v=2e88b55d2e7f",
  "H": "en-US/heart-070/letter-h.mp3?v=7ce27eb86cc2",
  "K": "en-US/heart-070/letter-k.mp3?v=5ea053ba262f",
  "L": "en-US/heart-070/letter-l.mp3?v=913be3a77f2b",
  "O": "en-US/heart-070/letter-o.mp3?v=e6cbffdc60ab",
  "P": "en-US/heart-070/letter-p.mp3?v=678d9e082a68",
  "S": "en-US/heart-070/letter-s.mp3?v=d091ca7faf2f",
  "T": "en-US/heart-070/letter-t.mp3?v=4f389b084610"
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
