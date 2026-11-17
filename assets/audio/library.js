/* Approved shared recordings; URLs resolve relative to this script, including file: previews. */
(() => {
  const base = document.currentScript.src;
  const clips = {
  "alfredo sauce": "en-US/heart-070/alfredo-sauce.mp3?v=b784abcdf77b",
  "apple": "en-US/heart-070/apple.mp3?v=52fc30d361b9",
  "apples": "en-US/heart-070/apples.mp3?v=ce17ff093b3d",
  "banana": "en-US/heart-070/banana.mp3?v=0d0af9ea1b9e",
  "bananas": "en-US/heart-070/bananas.mp3?v=fd3eda5b682b",
  "bbq sauce": "en-US/heart-070/bbq-sauce.mp3?v=9a070d6754b1",
  "caramel": "en-US/heart-070/caramel.mp3?v=91170a87dd65",
  "caramel syrup": "en-US/heart-070/caramel-syrup.mp3?v=8a307fb627c3",
  "cheese": "en-US/heart-070/cheese.mp3?v=ca84343d59dc",
  "cherries": "en-US/heart-070/cherries.mp3?v=e0aa1c5e2432",
  "cherry": "en-US/heart-070/cherry.mp3?v=d115e19a161b",
  "chocolate": "en-US/heart-070/chocolate.mp3?v=e06388adc213",
  "chocolate syrup": "en-US/heart-070/chocolate-syrup.mp3?v=febdc749340f",
  "corn": "en-US/heart-070/corn.mp3?v=d9c6294c13ef",
  "green pepper": "en-US/heart-070/green-pepper.mp3?v=df4402c198e9",
  "green peppers": "en-US/heart-070/green-peppers.mp3?v=eb0bc0886648",
  "kiwi fruit": "en-US/heart-070/kiwi-fruit.mp3?v=2bf80883a44e",
  "kiwi fruits": "en-US/heart-070/kiwi-fruits.mp3?v=7d4b1c59db62",
  "melon": "en-US/heart-070/melon.mp3?v=c1dc7529bdcf",
  "melons": "en-US/heart-070/melons.mp3?v=012a50bb7ede",
  "mint chocolate chip": "en-US/heart-070/mint-chocolate-chip.mp3?v=94457b33c3a0",
  "mint chocolate chip ice cream": "en-US/heart-070/mint-chocolate-chip-ice-cream.mp3?v=361da97aec44",
  "mint chocolate chip scoop": "en-US/heart-070/mint-chocolate-chip-scoop.mp3?v=9ca3ba53a8f7",
  "mint chocolate chip scoops": "en-US/heart-070/mint-chocolate-chip-scoops.mp3?v=94a5df44086f",
  "mushroom": "en-US/heart-070/mushroom.mp3?v=9249935a5532",
  "mushrooms": "en-US/heart-070/mushrooms.mp3?v=5114e5ff19b6",
  "no ice cream": "en-US/heart-070/no-ice-cream.mp3?v=443570f34c29",
  "no sauce": "en-US/heart-070/no-sauce.mp3?v=41dd2cc3cb34",
  "no syrup": "en-US/heart-070/no-syrup.mp3?v=eadcfad50f74",
  "onion": "en-US/heart-070/onion.mp3?v=a6ac431698b3",
  "onions": "en-US/heart-070/onions.mp3?v=bc5940dc65cd",
  "orange": "en-US/heart-070/orange.mp3?v=8992cdff9b63",
  "oranges": "en-US/heart-070/oranges.mp3?v=41ccbfd772d8",
  "peach": "en-US/heart-070/peach.mp3?v=b838e3ddf295",
  "peaches": "en-US/heart-070/peaches.mp3?v=5d9ac11b4124",
  "pepperoni": "en-US/heart-070/pepperoni.mp3?v=cf4f09fba42e",
  "pineapple": "en-US/heart-070/pineapple.mp3?v=e2687d2fa456",
  "pineapples": "en-US/heart-070/pineapples.mp3?v=d2a811530faa",
  "sausage": "en-US/heart-070/sausage.mp3?v=34fb46253970",
  "sausages": "en-US/heart-070/sausages.mp3?v=54ec8b84de1a",
  "strawberries": "en-US/heart-070/strawberries.mp3?v=c09af2693fd5",
  "strawberry": "en-US/heart-070/strawberry.mp3?v=17ade453f0e7",
  "strawberry ice cream": "en-US/heart-070/strawberry-ice-cream.mp3?v=d7ae67fb9e4f",
  "strawberry scoop": "en-US/heart-070/strawberry-scoop.mp3?v=2b30a2491ea1",
  "strawberry scoops": "en-US/heart-070/strawberry-scoops.mp3?v=8bd5790b697c",
  "strawberry syrup": "en-US/heart-070/strawberry-syrup.mp3?v=ede777eaa172",
  "tomato": "en-US/heart-070/tomato.mp3?v=d6dd4f7fdedd",
  "tomato sauce": "en-US/heart-070/tomato-sauce.mp3?v=fb3be29ddf9c",
  "tomatoes": "en-US/heart-070/tomatoes.mp3?v=992b8a455216",
  "vanilla": "en-US/heart-070/vanilla.mp3?v=a6f4ac743c00",
  "vanilla ice cream": "en-US/heart-070/vanilla-ice-cream.mp3?v=f9c354a85754",
  "vanilla scoop": "en-US/heart-070/vanilla-scoop.mp3?v=e84f3bffb88f",
  "vanilla scoops": "en-US/heart-070/vanilla-scoops.mp3?v=1e6271189df8",
  "what do you want?": "en-US/heart-070/what-do-you-want.mp3?v=6b17d363cbb8",
  "beef": "en-US/heart-070/beef.mp3?v=a7c542053c47",
  "chicken": "en-US/heart-070/chicken.mp3?v=c3e141a3044d",
  "cucumber": "en-US/heart-070/cucumber.mp3?v=2be2fd7452a4",
  "ham": "en-US/heart-070/ham.mp3?v=d57091822028",
  "lettuce": "en-US/heart-070/lettuce.mp3?v=d11e79652670",
  "pork": "en-US/heart-070/pork.mp3?v=a9c6d6bf85c2",
  "shrimp": "en-US/heart-070/shrimp.mp3?v=3edbd094dad8",
  "bacon": "en-US/heart-070/bacon.mp3?v=964b917a6f15",
  "blue": "en-US/heart-070/blue.mp3?v=b1c20a73a5ea",
  "colored pencil": "en-US/heart-070/colored-pencil.mp3?v=6e654e62a7b4",
  "colored pencils": "en-US/heart-070/colored-pencils.mp3?v=d5c880444491",
  "pencil": "en-US/heart-070/pencil.mp3?v=1b5d64928b54",
  "pencil case": "en-US/heart-070/pencil-case.mp3?v=9f57456c307d",
  "pencils": "en-US/heart-070/pencils.mp3?v=0291fa846205",
  "purple": "en-US/heart-070/purple.mp3?v=4d304d232c6b",
  "red": "en-US/heart-070/red.mp3?v=cacfd119fea5",
  "eraser": "en-US/heart-070/eraser.mp3?v=035002d4eec7",
  "erasers": "en-US/heart-070/erasers.mp3?v=3a34f99dec2f",
  "marker": "en-US/heart-070/marker.mp3?v=fe48caac215d",
  "markers": "en-US/heart-070/markers.mp3?v=acf7ac63fe9d",
  "pen": "en-US/heart-070/pen.mp3?v=fb4629dbd83d",
  "pens": "en-US/heart-070/pens.mp3?v=ff69599740c8",
  "ruler": "en-US/heart-070/ruler.mp3?v=f13d373d9cd4",
  "rulers": "en-US/heart-070/rulers.mp3?v=0d2f23ced03a",
  "calendar": "en-US/heart-070/calendar.mp3?v=7ab6fcba1919",
  "calendars": "en-US/heart-070/calendars.mp3?v=f63041cf7b0b",
  "glue stick": "en-US/heart-070/glue-stick.mp3?v=8aa8c2761ce7",
  "glue sticks": "en-US/heart-070/glue-sticks.mp3?v=1d2903b88021",
  "notebook": "en-US/heart-070/notebook.mp3?v=c5abb6cdaadd",
  "notebooks": "en-US/heart-070/notebooks.mp3?v=7827b3d3f2ed",
  "stapler": "en-US/heart-070/stapler.mp3?v=38c5fdd6ffa3",
  "staplers": "en-US/heart-070/staplers.mp3?v=ad8582cde0d4",
  "black": "en-US/heart-070/black.mp3?v=51d1f5b6c8ac",
  "brown": "en-US/heart-070/brown.mp3?v=526e016864ee",
  "green": "en-US/heart-070/green.mp3?v=14d1a5d1330c",
  "magnet": "en-US/heart-070/magnet.mp3?v=f85898372d72",
  "magnets": "en-US/heart-070/magnets.mp3?v=628a44362358",
  "pencil sharpener": "en-US/heart-070/pencil-sharpener.mp3?v=63397c4445ed",
  "pencil sharpeners": "en-US/heart-070/pencil-sharpeners.mp3?v=c1f44d6578a8",
  "pink": "en-US/heart-070/pink.mp3?v=0b4f96d1d77a",
  "white": "en-US/heart-070/white.mp3?v=e68f715dfae7",
  "yellow": "en-US/heart-070/yellow.mp3?v=52f58b0c406c",
  "do you have a": "en-US/heart-070/do-you-have-a.mp3?v=f903ebc2fa30",
  "do you have an": "en-US/heart-070/do-you-have-an.mp3?v=9deb67257b2f",
  "i have": "en-US/heart-070/i-have.mp3?v=3b9ee28bc5d5",
  "i want": "en-US/heart-070/i-want.mp3?v=cd454ffa189a",
  "a": "en-US/heart-070/a.mp3?v=b1ca4539124a",
  "an": "en-US/heart-070/an.mp3?v=7ac36865e709",
  "and": "en-US/heart-070/and.mp3?v=d29197ad02c4",
  "with": "en-US/heart-070/with.mp3?v=95ccdada9d86",
  "a little bit of": "en-US/heart-070/a-little-bit-of.mp3?v=ef21922427e5",
  "some": "en-US/heart-070/some.mp3?v=bde600f480c9",
  "a lot of": "en-US/heart-070/a-lot-of.mp3?v=d3da9e795fda",
  "some of": "en-US/heart-070/some-of.mp3?v=b4db2b06c147",
  "my sandwich is": "en-US/heart-070/my-sandwich-is.mp3?v=0f0cbf6442b6",
  "my sandwich is a": "en-US/heart-070/my-sandwich-is-a.mp3?v=f71cfdadca44",
  "my sandwich is an": "en-US/heart-070/my-sandwich-is-an.mp3?v=9d4010b364fb",
  "is for": "en-US/heart-070/is-for.mp3?v=02e363f2ccb9",
  "it's from": "en-US/heart-070/it-s-from.mp3?v=b6e6e38e0626",
  "small": "en-US/heart-070/small.mp3?v=bfa0b59b1115",
  "medium": "en-US/heart-070/medium.mp3?v=9b76ac10d8aa",
  "big": "en-US/heart-070/big.mp3?v=87b70c614e74",
  "everything": "en-US/heart-070/everything.mp3?v=a1638c000808",
  "pizza": "en-US/heart-070/pizza.mp3?v=8cca153f9f41",
  "bread": "en-US/heart-070/bread.mp3?v=afbd9ed1b28f",
  "bread slice": "en-US/heart-070/bread-slice.mp3?v=924a3e1bd62e",
  "bread slices": "en-US/heart-070/bread-slices.mp3?v=6008929b9cf9",
  "0": "en-US/heart-070/number-0.mp3?v=27012f3ccc47",
  "1": "en-US/heart-070/number-1.mp3?v=beb686edd76d",
  "2": "en-US/heart-070/number-2.mp3?v=99a066de4b7a",
  "3": "en-US/heart-070/number-3.mp3?v=e748b36b5a6f",
  "4": "en-US/heart-070/number-4.mp3?v=756a66507dcc",
  "5": "en-US/heart-070/number-5.mp3?v=291a3cde0c16",
  "6": "en-US/heart-070/number-6.mp3?v=75598d647624",
  "7": "en-US/heart-070/number-7.mp3?v=4bbf84bc6c32",
  "8": "en-US/heart-070/number-8.mp3?v=33b1843b55cf",
  "9": "en-US/heart-070/number-9.mp3?v=1e32acd8cb19",
  "10": "en-US/heart-070/number-10.mp3?v=114ce153df65",
  "11": "en-US/heart-070/number-11.mp3?v=cd67e09c6d03",
  "12": "en-US/heart-070/number-12.mp3?v=283363e6515e",
  "13": "en-US/heart-070/number-13.mp3?v=9f70d1753139",
  "14": "en-US/heart-070/number-14.mp3?v=53862b2b5d4a",
  "15": "en-US/heart-070/number-15.mp3?v=a823bb24d507",
  "16": "en-US/heart-070/number-16.mp3?v=0004369af684",
  "17": "en-US/heart-070/number-17.mp3?v=2cb29e55ec1e",
  "18": "en-US/heart-070/number-18.mp3?v=5902a4385997",
  "19": "en-US/heart-070/number-19.mp3?v=ec9258e26da8",
  "20": "en-US/heart-070/number-20.mp3?v=b71b81e10187",
  "30": "en-US/heart-070/number-30.mp3?v=7a967303f69c",
  "40": "en-US/heart-070/number-40.mp3?v=3edfdefc18e4",
  "50": "en-US/heart-070/number-50.mp3?v=ea2e82e7fac7",
  "60": "en-US/heart-070/number-60.mp3?v=5abe3fc3086e",
  "70": "en-US/heart-070/number-70.mp3?v=9bc88d767581",
  "80": "en-US/heart-070/number-80.mp3?v=2d7e9748c8bc",
  "90": "en-US/heart-070/number-90.mp3?v=d3ce71a6de20",
  "100": "en-US/heart-070/number-100.mp3?v=d62a2f070fec",
  "aichi": "en-US/heart-070/source-aichi.mp3?v=7f12a3922a27",
  "america": "en-US/heart-070/source-america.mp3?v=3610d67faafe",
  "aomori": "en-US/heart-070/source-aomori.mp3?v=55c7c7d90483",
  "australia": "en-US/heart-070/source-australia.mp3?v=68a7fad9df45",
  "chile": "en-US/heart-070/source-chile.mp3?v=cfc8489d4a9c",
  "ecuador": "en-US/heart-070/source-ecuador.mp3?v=bd6e92dd590e",
  "fukuoka": "en-US/heart-070/source-fukuoka.mp3?v=22a4abc16cdc",
  "gunma": "en-US/heart-070/source-gunma.mp3?v=d771a64df725",
  "hokkaido": "en-US/heart-070/source-hokkaido.mp3?v=e1cf264309a5",
  "hyogo": "en-US/heart-070/source-hyogo.mp3?v=23e324da6579",
  "ibaraki": "en-US/heart-070/source-ibaraki.mp3?v=843663a61b7c",
  "india": "en-US/heart-070/source-india.mp3?v=3a59ba1e1193",
  "indonesia": "en-US/heart-070/source-indonesia.mp3?v=e7f43c4038ad",
  "italy": "en-US/heart-070/source-italy.mp3?v=882b0fe1d9da",
  "iwate": "en-US/heart-070/source-iwate.mp3?v=1bb4a139207b",
  "kagoshima": "en-US/heart-070/source-kagoshima.mp3?v=3a051ff8adf8",
  "kochi": "en-US/heart-070/source-kochi.mp3?v=0ac05e105da1",
  "kumamoto": "en-US/heart-070/source-kumamoto.mp3?v=5b623b18838e",
  "mexico": "en-US/heart-070/source-mexico.mp3?v=613f95bdf469",
  "miyazaki": "en-US/heart-070/source-miyazaki.mp3?v=d8de4e60c20f",
  "nagano": "en-US/heart-070/source-nagano.mp3?v=89ca34fc5224",
  "new zealand": "en-US/heart-070/source-new-zealand.mp3?v=fb6825b94911",
  "saga": "en-US/heart-070/source-saga.mp3?v=aa93bf48ea6e",
  "saitama": "en-US/heart-070/source-saitama.mp3?v=a9c9c174a2ac",
  "thailand": "en-US/heart-070/source-thailand.mp3?v=aa83262d4c2b",
  "tochigi": "en-US/heart-070/source-tochigi.mp3?v=506373ce2a46",
  "vietnam": "en-US/heart-070/source-vietnam.mp3?v=83f8d47d5f98",
  "the philippines": "en-US/heart-070/source-the-philippines.mp3?v=a44d0ee537ba",
  "tell me about your sandwich.": "en-US/heart-070/tell-me-about-your-sandwich.mp3?v=8b8c411278d1",
  "amusement park": "en-US/heart-070/amusement-park.mp3?v=734f5d323697",
  "amusement parks": "en-US/heart-070/amusement-parks.mp3?v=0cba73d123b4",
  "aquarium": "en-US/heart-070/aquarium.mp3?v=5e8a8b8b88df",
  "aquariums": "en-US/heart-070/aquariums.mp3?v=1aaa5de6e817",
  "bookstore": "en-US/heart-070/bookstore.mp3?v=169a84378602",
  "bookstores": "en-US/heart-070/bookstores.mp3?v=4e8b8e19d07d",
  "bus stop": "en-US/heart-070/bus-stop.mp3?v=10fd4bf686e8",
  "bus stops": "en-US/heart-070/bus-stops.mp3?v=3640d25d2d89",
  "castle": "en-US/heart-070/castle.mp3?v=ee8b21a31354",
  "castles": "en-US/heart-070/castles.mp3?v=55478b50de8e",
  "church": "en-US/heart-070/church.mp3?v=26d0dbe84f0f",
  "churches": "en-US/heart-070/churches.mp3?v=668695fb63dd",
  "circle": "en-US/heart-070/circle.mp3?v=925dc6cf7aac",
  "circles": "en-US/heart-070/circles.mp3?v=10d86a34329b",
  "club": "en-US/heart-070/club.mp3?v=624a8e43f0db",
  "clubs": "en-US/heart-070/clubs.mp3?v=15caadc16a3c",
  "continue eight blocks.": "en-US/heart-070/continue-eight-blocks.mp3?v=453284d6efa6",
  "continue eleven blocks.": "en-US/heart-070/continue-eleven-blocks.mp3?v=8625fbe8b51f",
  "continue five blocks.": "en-US/heart-070/continue-five-blocks.mp3?v=7ab12fb97b06",
  "continue four blocks.": "en-US/heart-070/continue-four-blocks.mp3?v=e37a63533f83",
  "continue nine blocks.": "en-US/heart-070/continue-nine-blocks.mp3?v=5e65c34e1cc3",
  "continue one block.": "en-US/heart-070/continue-one-block.mp3?v=4a99ea21bb01",
  "continue seven blocks.": "en-US/heart-070/continue-seven-blocks.mp3?v=634f089a035f",
  "continue six blocks.": "en-US/heart-070/continue-six-blocks.mp3?v=7a6e2d146a59",
  "continue ten blocks.": "en-US/heart-070/continue-ten-blocks.mp3?v=af2dcd1f6eb1",
  "continue three blocks.": "en-US/heart-070/continue-three-blocks.mp3?v=a6d2ce5733c4",
  "continue twelve blocks.": "en-US/heart-070/continue-twelve-blocks.mp3?v=1088900861e6",
  "continue two blocks.": "en-US/heart-070/continue-two-blocks.mp3?v=d3a3ec51237b",
  "convenience store": "en-US/heart-070/convenience-store.mp3?v=d5b72e65870b",
  "convenience stores": "en-US/heart-070/convenience-stores.mp3?v=c3d75d517b41",
  "cross": "en-US/heart-070/cross.mp3?v=e70420e750ae",
  "cross the bridge.": "en-US/heart-070/cross-the-bridge.mp3?v=fae64c537596",
  "cross the tracks.": "en-US/heart-070/cross-the-tracks.mp3?v=d17d71cfda1f",
  "crosses": "en-US/heart-070/crosses.mp3?v=9c978ce7e53c",
  "diamond": "en-US/heart-070/diamond.mp3?v=f1f5dde73287",
  "diamonds": "en-US/heart-070/diamonds.mp3?v=579c33e26522",
  "elementary school": "en-US/heart-070/elementary-school.mp3?v=0b8652ae34f1",
  "elementary schools": "en-US/heart-070/elementary-schools.mp3?v=c513fd137b44",
  "fire station": "en-US/heart-070/fire-station.mp3?v=766f1e5723ae",
  "fire stations": "en-US/heart-070/fire-stations.mp3?v=75b309cf312e",
  "go straight for eight blocks.": "en-US/heart-070/go-straight-for-eight-blocks.mp3?v=c88e92658d56",
  "go straight for eleven blocks.": "en-US/heart-070/go-straight-for-eleven-blocks.mp3?v=ef77367d6f48",
  "go straight for five blocks.": "en-US/heart-070/go-straight-for-five-blocks.mp3?v=1d22ad79723f",
  "go straight for four blocks.": "en-US/heart-070/go-straight-for-four-blocks.mp3?v=e7bba5d3482b",
  "go straight for nine blocks.": "en-US/heart-070/go-straight-for-nine-blocks.mp3?v=cdcc1fb33eab",
  "go straight for one block.": "en-US/heart-070/go-straight-for-one-block.mp3?v=5aee243052c0",
  "go straight for seven blocks.": "en-US/heart-070/go-straight-for-seven-blocks.mp3?v=41ff0a882771",
  "go straight for six blocks.": "en-US/heart-070/go-straight-for-six-blocks.mp3?v=943710cadc15",
  "go straight for ten blocks.": "en-US/heart-070/go-straight-for-ten-blocks.mp3?v=1c8c9aab4e23",
  "go straight for three blocks.": "en-US/heart-070/go-straight-for-three-blocks.mp3?v=5ee11c4c4b8c",
  "go straight for twelve blocks.": "en-US/heart-070/go-straight-for-twelve-blocks.mp3?v=af0e14b39d1d",
  "go straight for two blocks.": "en-US/heart-070/go-straight-for-two-blocks.mp3?v=9171301dabc7",
  "heart": "en-US/heart-070/heart.mp3?v=048832e9ac89",
  "hearts": "en-US/heart-070/hearts.mp3?v=b8df1510de66",
  "hospital": "en-US/heart-070/hospital.mp3?v=3f98c7297cc0",
  "hospitals": "en-US/heart-070/hospitals.mp3?v=36f0b2789f3f",
  "house": "en-US/heart-070/house.mp3?v=e24b61f15b9f",
  "houses": "en-US/heart-070/houses.mp3?v=07f938f7f0ca",
  "junior high school": "en-US/heart-070/junior-high-school.mp3?v=e47cb8503e8e",
  "junior high schools": "en-US/heart-070/junior-high-schools.mp3?v=0e940f148632",
  "letter": "en-US/heart-070/letter.mp3?v=84405ed63404",
  "letter as": "en-US/heart-070/letter-a-plural.mp3?v=29279899991d",
  "letter bs": "en-US/heart-070/letter-b-plural.mp3?v=f52b51632758",
  "letter cs": "en-US/heart-070/letter-c-plural.mp3?v=2fa0d714dc18",
  "letter ds": "en-US/heart-070/letter-d-plural.mp3?v=93f643af2f50",
  "letter es": "en-US/heart-070/letter-e-plural.mp3?v=1254b94c34ee",
  "letter fs": "en-US/heart-070/letter-f-plural.mp3?v=546890466160",
  "letter gs": "en-US/heart-070/letter-g-plural.mp3?v=d1dbacb805f3",
  "letter hs": "en-US/heart-070/letter-h-plural.mp3?v=d65a626381ff",
  "letter is": "en-US/heart-070/letter-i-plural.mp3?v=368cf42cfc09",
  "letter js": "en-US/heart-070/letter-j-plural.mp3?v=f01c5e5c8253",
  "letter ks": "en-US/heart-070/letter-k-plural.mp3?v=7c453adab925",
  "letter ls": "en-US/heart-070/letter-l-plural.mp3?v=0682575500c0",
  "letter ms": "en-US/heart-070/letter-m-plural.mp3?v=fc1891fc33cc",
  "letter ns": "en-US/heart-070/letter-n-plural.mp3?v=af10491c2652",
  "letter os": "en-US/heart-070/letter-o-plural.mp3?v=b4180723c961",
  "letter ps": "en-US/heart-070/letter-p-plural.mp3?v=70324e77c1c0",
  "letter qs": "en-US/heart-070/letter-q-plural.mp3?v=186ffef18511",
  "letter rs": "en-US/heart-070/letter-r-plural.mp3?v=a1ba36ca2ca4",
  "letter ss": "en-US/heart-070/letter-s-plural.mp3?v=36e3f071b20a",
  "letter ts": "en-US/heart-070/letter-t-plural.mp3?v=f3599632c6f5",
  "letter us": "en-US/heart-070/letter-u-plural.mp3?v=d9fcd634806c",
  "letter vs": "en-US/heart-070/letter-v-plural.mp3?v=22f7ab3fd7cc",
  "letter ws": "en-US/heart-070/letter-w-plural.mp3?v=087b46d15372",
  "letter xs": "en-US/heart-070/letter-x-plural.mp3?v=a16195e2cf98",
  "letter ys": "en-US/heart-070/letter-y-plural.mp3?v=7d552764577e",
  "letter zs": "en-US/heart-070/letter-z-plural.mp3?v=17f5fc664921",
  "libraries": "en-US/heart-070/libraries.mp3?v=7a04759ab1e2",
  "library": "en-US/heart-070/library.mp3?v=5b26884cb020",
  "museum": "en-US/heart-070/museum.mp3?v=56263f1ef6c5",
  "museums": "en-US/heart-070/museums.mp3?v=dcba91526a7b",
  "oval": "en-US/heart-070/oval.mp3?v=f149c82b70ff",
  "ovals": "en-US/heart-070/ovals.mp3?v=86e59d72c024",
  "park": "en-US/heart-070/park.mp3?v=bd0cdb2807ca",
  "parks": "en-US/heart-070/parks.mp3?v=07af5900269e",
  "pentagon": "en-US/heart-070/pentagon.mp3?v=7e8baea7f95f",
  "pentagons": "en-US/heart-070/pentagons.mp3?v=dbfa03e751fa",
  "police station": "en-US/heart-070/police-station.mp3?v=bc1a04658343",
  "police stations": "en-US/heart-070/police-stations.mp3?v=5466247bd5bf",
  "post office": "en-US/heart-070/post-office.mp3?v=49c3c8c85de7",
  "post offices": "en-US/heart-070/post-offices.mp3?v=590e3a6d8a49",
  "rectangle": "en-US/heart-070/rectangle.mp3?v=884eb522cf0d",
  "rectangles": "en-US/heart-070/rectangles.mp3?v=cf22300416e5",
  "restaurant": "en-US/heart-070/restaurant.mp3?v=3c07a35d9feb",
  "restaurants": "en-US/heart-070/restaurants.mp3?v=cc81aff5c4a0",
  "semicircle": "en-US/heart-070/semicircle.mp3?v=cc42e3e11e01",
  "semicircles": "en-US/heart-070/semicircles.mp3?v=a431479ecdaf",
  "shrine": "en-US/heart-070/shrine.mp3?v=318c89f36f4c",
  "shrines": "en-US/heart-070/shrines.mp3?v=457b84afc7e4",
  "spade": "en-US/heart-070/spade.mp3?v=2f849012ce44",
  "spades": "en-US/heart-070/spades.mp3?v=4ec1e1e83cc5",
  "square": "en-US/heart-070/square.mp3?v=b27557f910e7",
  "squares": "en-US/heart-070/squares.mp3?v=51770c6e3449",
  "stadium": "en-US/heart-070/stadium.mp3?v=7008e572e33b",
  "stadiums": "en-US/heart-070/stadiums.mp3?v=5d0bbbb66763",
  "star": "en-US/heart-070/star.mp3?v=13111ad56217",
  "stars": "en-US/heart-070/stars.mp3?v=2562efd01845",
  "station": "en-US/heart-070/station.mp3?v=bc7784f78fe5",
  "stations": "en-US/heart-070/stations.mp3?v=0e9404a11653",
  "supermarket": "en-US/heart-070/supermarket.mp3?v=9fac69d5b8b0",
  "supermarkets": "en-US/heart-070/supermarkets.mp3?v=c2074ee82cb2",
  "temple": "en-US/heart-070/temple.mp3?v=e4f752f0d18e",
  "temples": "en-US/heart-070/temples.mp3?v=f8220dbaa4e0",
  "this is for you.": "en-US/heart-070/this-is-for-you.mp3?v=4831faa60347",
  "triangle": "en-US/heart-070/triangle.mp3?v=9f8fac695068",
  "triangles": "en-US/heart-070/triangles.mp3?v=238057b806a2",
  "turn left.": "en-US/heart-070/turn-left.mp3?v=b2d7148b07f4",
  "turn right.": "en-US/heart-070/turn-right.mp3?v=63708aa063b6",
  "we have": "en-US/heart-070/we-have.mp3?v=2c90f7203f8b",
  "what do you have in your town?": "en-US/heart-070/what-do-you-have-in-your-town.mp3?v=b6dd3c66fd7d",
  "where is the": "en-US/heart-070/where-is-the.mp3?v=4bfbff4788f2",
  "you can see it on your left.": "en-US/heart-070/you-can-see-it-on-your-left.mp3?v=6fa6d41a8b3f",
  "you can see it on your right.": "en-US/heart-070/you-can-see-it-on-your-right.mp3?v=3225ea78ff24",
  "zoo": "en-US/heart-070/zoo.mp3?v=7f1d582ef9e6",
  "zoos": "en-US/heart-070/zoos.mp3?v=aa35f7853a0e"
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
  "T": "en-US/heart-070/letter-t.mp3?v=4f389b084610",
  "D": "en-US/heart-070/letter-d.mp3?v=85d0a461d6f1",
  "E": "en-US/heart-070/letter-e.mp3?v=d11281a7c4d3",
  "F": "en-US/heart-070/letter-f.mp3?v=6701cc16903b",
  "I": "en-US/heart-070/letter-i.mp3?v=4af93b92e86c",
  "J": "en-US/heart-070/letter-j.mp3?v=bb8fcc4a93cc",
  "M": "en-US/heart-070/letter-m.mp3?v=2f9551e4c456",
  "N": "en-US/heart-070/letter-n.mp3?v=da768987cf17",
  "Q": "en-US/heart-070/letter-q.mp3?v=0febfd4ef7bc",
  "R": "en-US/heart-070/letter-r.mp3?v=36cfacef4aab",
  "U": "en-US/heart-070/letter-u.mp3?v=3ec27fbdb63e",
  "V": "en-US/heart-070/letter-v.mp3?v=da6040f77988",
  "W": "en-US/heart-070/letter-w.mp3?v=99e831eeae88",
  "X": "en-US/heart-070/letter-x.mp3?v=8db7beda0d3f",
  "Y": "en-US/heart-070/letter-y.mp3?v=bd5739a52e70",
  "Z": "en-US/heart-070/letter-z.mp3?v=84ea8450d069"
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
  const townPlaces = new Set(["house", "park", "library", "museum", "hospital", "bus stop", "station", "police station", "fire station", "post office", "bookstore", "restaurant", "supermarket", "castle", "shrine", "temple", "church", "aquarium", "stadium", "zoo", "amusement park", "convenience store", "elementary school", "junior high school"]);
  window.ActivityHubAudio = { resolve, resolveSequence(text) {
    const original = clean(text), normalized = normalize(text);
    // Existing exact recordings take priority over assembling the same phrase.
    if (resolve(text)) return null;
    // Inline singular-letter vocabulary uses the same approved parts as sentences.
    const standaloneLetter = /^letter ([A-Z])$/.exec(original);
    if (standaloneLetter) {
      const prefix = resolve('letter'), letter = letterClips[standaloneLetter[1]];
      return prefix && letter ? [prefix, new URL(letter, base).href] : null;
    }
    if (/^do you have a (?:…|\.\.\.)\?$/.test(normalized)) return [resolve('Do you have a')];
    const match = /^do you have (a|an) (.+)\?$/.exec(normalized);
    if (match) {
      if (!supplies.has(match[2])) return null;
      const article = /^[aeiou]/.test(match[2]) ? 'an' : 'a';
      if (match[1] !== article) return null;
      const urls = [resolve(`Do you have ${article}`), resolve(match[2])];
      return urls.every(Boolean) ? urls : null;
    }
    // Town question prefixes and complete route sentences are eligible only
    // when every requested recording has been reviewed and published.
    const townQuestion = /^where is the (.+)\?$/.exec(normalized);
    if(townQuestion){
      if(!townPlaces.has(townQuestion[1]))return null;
      const urls=[resolve('Where is the'),resolve(townQuestion[1])];
      return urls.every(Boolean)?urls:null;
    }
    if(/^(?:go straight for|continue|turn left|turn right|cross the|you can see it)/i.test(original)){
      const parts=original.match(/[^.]+(?:\.|$)/g)||[];
      const routePart=/^(?:(?:go straight for|continue) (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) blocks?\.|turn (?:left|right)\.|cross the (?:bridge|tracks)\.|you can see it on your (?:left|right)\.)$/i;
      if(!parts.length||!parts.every(part=>routePart.test(part.trim())))return null;
      const urls=parts.map(part=>resolve(part.trim()));
      return urls.length&&urls.every(Boolean)?urls:null;
    }
    // Only activity output templates are eligible. Resolve the entire sentence
    // before playback; never omit an unknown word or start a partial recording.
    if (!/^(?:i have|i want|we have|my sandwich is)(?:\s|[.…])/i.test(original)) return null;
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
      // Paper Craft's letter A differs from article a; plural letter forms
      // are their own clips so Ns/Os retain their spoken plural endings.
      const letterNoun=/^letter ([A-Z])(s?)(?=[\s,.…]|$)/.exec(remaining);
      if(letterNoun){
        const letter=letterNoun[1];
        if(letterNoun[2]){const url=resolve('letter '+letter+'s');if(!url)return null;urls.push(url);}
        else {const prefix=resolve('letter');if(!prefix||!letterClips[letter])return null;urls.push(prefix,new URL(letterClips[letter],base).href);}
        remaining=remaining.slice(letterNoun[0].length);continue;
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
