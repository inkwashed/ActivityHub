/* Original fruit artwork; configurable vocabulary and cumulative quantities. */
window.PARFAIT_CONFIG = {
  "seed": 48271,
  "noun": "parfait",
  "sceneSelector": "#parfait",
  "resetMessage": "Parfait reset. Choose your fruit.",
  "defaultSauce": null,
  "sauces": [],
  "toppings": [
    {
      "id": "strawberries",
      "label": "strawberries",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><path d=\"M17 12Q32 8 47 12Q57 19 49 35Q42 49 32 57Q22 49 15 35Q7 19 17 12Z\" fill=\"#e95764\" stroke=\"#b83749\" stroke-width=\"2\"/><path d=\"M20 16Q32 13 44 16Q50 20 44 32Q39 42 32 49Q25 42 20 32Q14 20 20 16Z\" fill=\"#ffacaa\"/><path d=\"M27 15Q32 14 37 15L36 27Q35 36 32 43Q29 36 28 27Z\" fill=\"#fff0d7\"/><path d=\"M23 22L28 26M41 22L36 26M23 31L29 33M41 31L35 33M27 40L31 39M37 40L33 39\" stroke=\"#ffe0cf\" stroke-width=\"2\" stroke-linecap=\"round\"/><g fill=\"#ffd49e\"><ellipse cx=\"15\" cy=\"22\" rx=\"1\" ry=\"2\"/><ellipse cx=\"49\" cy=\"22\" rx=\"1\" ry=\"2\"/><ellipse cx=\"20\" cy=\"38\" rx=\"1\" ry=\"2\"/><ellipse cx=\"44\" cy=\"38\" rx=\"1\" ry=\"2\"/></g></svg>"
    },
    {
      "id": "bananas",
      "label": "bananas",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><ellipse cx=\"32\" cy=\"32\" rx=\"23\" ry=\"21\" fill=\"#fff0c3\" stroke=\"#d9c59b\" stroke-width=\"1.5\"/><path d=\"M32 24L31 39M25 28L39 35M25 36L39 28\" stroke=\"#decc9f\" stroke-width=\"1.7\" stroke-linecap=\"round\"/><g fill=\"#baa578\"><ellipse cx=\"29\" cy=\"30\" rx=\"1\" ry=\"1.4\"/><ellipse cx=\"35\" cy=\"30\" rx=\"1\" ry=\"1.4\"/><ellipse cx=\"32\" cy=\"35\" rx=\"1\" ry=\"1.4\"/></g></svg>"
    },
    {
      "id": "apples",
      "label": "apples",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><path d=\"M7 23L57 23C55 40 45 51 32 51C19 51 9 40 7 23Z\" fill=\"#fff0ce\" stroke=\"#d7bf96\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M7 23C9 40 19 51 32 51C45 51 55 40 57 23\" fill=\"none\" stroke=\"#d9514c\" stroke-width=\"1.7\" stroke-linecap=\"round\"/><path d=\"M14 28L49 28\" stroke=\"#fff9e7\" stroke-width=\"2\" stroke-linecap=\"round\"/></svg>"
    },
    {
      "id": "oranges",
      "label": "oranges",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"32\" cy=\"32\" r=\"24\" fill=\"#fda12f\" stroke=\"#d77724\" stroke-width=\"1\"/><circle cx=\"32\" cy=\"32\" r=\"22\" fill=\"#ffd080\"/><path d=\"M32 13V51M15 22L49 42M15 42L49 22\" stroke=\"#fff1bd\" stroke-width=\"3\"/></svg>"
    },
    {
      "id": "pineapples",
      "label": "pineapples",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><path d=\"M12 15L47 10L55 42L23 54Z\" fill=\"#ffdb58\" stroke=\"#d89e25\" stroke-width=\"3\"/><path d=\"M23 20L39 17M27 30L43 26M30 40L46 35\" stroke=\"#fff1a1\" stroke-width=\"4\" stroke-linecap=\"round\"/></svg>"
    },
    {
      "id": "peaches",
      "label": "peaches",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><path d=\"M7 22Q20 25 31 26Q43 25 57 22C56 39 46 50 32 51C18 50 8 39 7 22Z\" fill=\"#ffe6bf\" stroke=\"#dbb695\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M7 22C8 39 18 50 32 51C46 50 56 39 57 22\" fill=\"none\" stroke=\"#efa68e\" stroke-width=\"1.3\" stroke-linecap=\"round\"/><path d=\"M20 26Q31 29 44 26Q39 34 32 35Q25 33 20 26Z\" fill=\"#f6b9a4\"/></svg>"
    },
    {
      "id": "cherries",
      "label": "cherries",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><path d=\"M20 35Q31 20 34 8Q40 21 45 37\" fill=\"none\" stroke=\"#607a3e\" stroke-width=\"3\"/><circle cx=\"19\" cy=\"42\" r=\"13\" fill=\"#c74152\" stroke=\"#983345\" stroke-width=\"2\"/><circle cx=\"45\" cy=\"43\" r=\"12\" fill=\"#dc5260\" stroke=\"#983345\" stroke-width=\"2\"/><path d=\"M14 36l3-2M40 37l3-2\" stroke=\"#ffb5b0\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>"
    },
    {
      "id": "melons",
      "label": "melons",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><path d=\"M6 31L11 26C25 37 42 24 54 7C61 32 42 51 25 51Q11 49 6 31Z\" fill=\"#d9eaa0\" stroke=\"#9abd70\" stroke-width=\"1.3\" stroke-linejoin=\"round\"/><path d=\"M6 31Q11 49 25 51C42 51 61 32 54 7\" fill=\"none\" stroke=\"#6d9c4b\" stroke-width=\"1.5\" stroke-linecap=\"round\"/><path d=\"M13 29Q27 38 49 16\" fill=\"none\" stroke=\"#eff2bd\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>"
    },
    {
      "id": "kiwi-fruits",
      "label": "kiwi fruits",
      "counts": [
        0,
        3,
        6,
        10
      ],
      "size": 21,
      "color": "#c95852",
      "art": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 64 64\" fill=\"none\" aria-hidden=\"true\"><circle cx=\"32\" cy=\"32\" r=\"24\" fill=\"#719e49\"/><circle cx=\"32\" cy=\"32\" r=\"22.5\" fill=\"#a2cb64\"/><ellipse cx=\"32\" cy=\"32\" rx=\"8\" ry=\"12\" fill=\"#eef1b6\"/><g fill=\"#455032\"><ellipse cx=\"20\" cy=\"23\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"19\" cy=\"33\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"22\" cy=\"43\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"32\" cy=\"16\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"43\" cy=\"22\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"45\" cy=\"33\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"42\" cy=\"43\" rx=\"1.5\" ry=\"2\"/><ellipse cx=\"32\" cy=\"49\" rx=\"1.5\" ry=\"2\"/></g></svg>"
    }
  ]
};

// Optional base and sauce categories are understood by the shared builder engine.
// One original flat illustration per flavor, reused in buttons and the bowl.
const scoopArt = base => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" aria-hidden="true">
 <path d="M13 54C9 30 25 13 50 13C75 13 91 30 87 54Q94 62 87 69Q88 79 77 80Q72 90 62 86Q51 94 42 87Q30 91 24 81Q13 81 14 71Q6 64 13 54Z" fill="${base.color}" stroke="${base.edge}" stroke-width="1.8" stroke-linejoin="round"/>
 <path d="M20 66Q26 71 30 68M30 77Q36 82 42 78M50 81Q56 84 61 79M70 73Q77 76 80 69M20 49Q17 42 23 37M69 28Q77 31 78 38M37 24Q43 20 49 23" stroke="${base.edge}" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/>
 <path d="M29 31Q34 26 39 27M24 55L28 57M48 67L53 65M61 36L65 39" stroke="${base.light}" stroke-width="3.5" stroke-linecap="round"/>
 ${base.chips ? '<g class="scoop-chips" fill="#654a3b"><path d="M33 37l6-2 3 6-7 2ZM60 23l5 2-2 6-5-3ZM69 49l7-2 2 6-6 3ZM47 52l5 1-1 5-5-1ZM27 62l5-2 3 5-6 3ZM58 72l6-1 2 5-7 2Z"/></g>' : ''}
 </svg>`;
window.PARFAIT_CONFIG.bases = [
 {id:'none',label:'no ice cream',empty:true},
 {id:'vanilla',label:'vanilla ice cream',color:'#fff0ce',edge:'#cfb989',light:'#fff9e9'},
 {id:'strawberry',label:'strawberry ice cream',color:'#f3b0b9',edge:'#cf8796',light:'#ffdae0'},
 {id:'mint',label:'mint chocolate chip ice cream',color:'#b8ddc6',edge:'#80b09a',light:'#e0f2e5',chips:true}
].map(base => {
 const scoop = base.empty ? '' : scoopArt(base);
 return {...base,scoop,art:`<span class="scoop-icon" aria-hidden="true">${base.empty?'−':scoop}</span>`};
});
window.PARFAIT_CONFIG.sauces = [
 {id:'none',label:'no syrup',empty:true,color:'#eff6ed',highlight:'#fff'},
 {id:'chocolate',label:'chocolate syrup',color:'#70432c',highlight:'#9c6948'},
 {id:'strawberry',label:'strawberry syrup',color:'#c9455b',highlight:'#ee7990'},
 {id:'caramel',label:'caramel syrup',color:'#bc7830',highlight:'#e7b066'}
];

// Four fixed layers; each row alternates the two choices.
window.PARFAIT_CONFIG.interaction = 'layers';
window.PARFAIT_CONFIG.layerLayout = {
 pieceSize:14, piecesPerRow:6,
 rows:[{y:82,left:33,right:67},{y:59,left:28,right:72},
       {y:39,left:22,right:78},{y:-5,left:24,right:76}]
};
window.PARFAIT_CONFIG.toppings.find(item => item.id === 'strawberries').rotation = 180;
