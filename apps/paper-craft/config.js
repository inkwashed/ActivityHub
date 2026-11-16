/* Original flat SVG cut-outs; system-font letters require no font download. */
(() => {
 const colors={red:'#d95453',orange:'#e99544',yellow:'#efc855',green:'#75a481',brown:'#996747',blue:'#6b9fc6',purple:'#a08aba',pink:'#e5a3b4',black:'#52605e',white:'#ffffff'};
 const shapes={triangle:'<path d="M50 8 94 90H6Z"/>',circle:'<circle cx="50" cy="50" r="43"/>',square:'<path d="M8 8h84v84H8Z"/>',heart:'<path d="M50 91 12 53C-15 21 25-8 50 24 75-8 115 21 88 53Z"/>',star:'<path d="m50 4 14 29 32 5-23 23 5 33-28-16-28 16 5-33L4 38l32-5Z"/>',diamond:'<path d="m50 4 40 46-40 46L10 50Z"/>',rectangle:'<path d="M4 23h92v54H4Z"/>',oval:'<ellipse cx="50" cy="50" rx="46" ry="30"/>',semicircle:'<path d="M5 74a45 45 0 0 1 90 0Z"/>',pentagon:'<path d="m50 5 45 33-17 54H22L5 38Z"/>',cross:'<path d="M20 5 50 35 80 5 95 20 65 50 95 80 80 95 50 65 20 95 5 80 35 50 5 20Z"/>',club:'<path d="M40 65C22 80 5 65 8 49C10 36 23 31 35 36C21 17 35 4 50 5C65 4 79 17 65 36C77 31 90 36 92 49C95 65 78 80 60 65L57 72Q58 83 68 92H32Q42 83 43 72Z"/>',spade:'<path d="M50 5C40 21 10 37 8 54C5 75 27 86 43 68Q43 82 32 93H68Q57 82 57 68C73 86 95 75 92 54C90 37 60 21 50 5Z"/>'};
 const art=(id,color='blue',choice=false)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${colors[color]||colors.blue}"${choice?' stroke="var(--ah-selected-border)" stroke-width="2" stroke-linejoin="round"':''}>${shapes[id]||`<text x="50" y="80" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="86" font-weight="900">${/^[A-Z]$/.test(id)?id:''}</text>`}</g></svg>`;
 // Loose, deterministic LEARN composition: larger shapes use the whole paper.
 const learnShapes={triangle:[17,18,28,-7],circle:[49,16,29,0],square:[81,19,28,8],heart:[14,49,22,-8],star:[38,48,24,9],diamond:[62,51,22,-6],rectangle:[85,48,23,8],oval:[18,81,30,-8],semicircle:[50,82,29,4],pentagon:[81,80,29,-7],cross:[33,33,22,-8],club:[67,33,22,6],spade:[68,65,22,-6]};
 // Scatter letters across the full paper; never rerandomize on selection/reload.
 const letterPlacements=[
  [11,12,19,-9],[31,15,21,7],[51,11,20,-5],[72,14,22,8],[89,12,17,-7],
  [10,32,16,8],[26,34,18,-7],[43,30,20,6],[59,34,19,-10],[75,31,18,9],[90,34,16,-6],
  [12,52,20,-8],[32,50,22,5],[51,54,21,-7],[70,51,20,8],[88,53,18,-6],
  [10,72,17,7],[26,70,18,-8],[42,74,20,6],[59,71,21,-7],[75,74,18,9],[90,71,16,-6],
  [15,88,21,-5],[38,87,21,9],[62,89,18,-7],[85,88,20,6]
 ];
 const learnPlacements={...learnShapes,...Object.fromEntries([...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((id,i)=>[id,letterPlacements[i]]))};
 const defaultColor=id=>({cross:'red',club:'green',spade:'black'})[id]||Object.keys(colors)[(shapes[id]?Object.keys(shapes).indexOf(id):id.charCodeAt(0)-65)%10];
 const toppings=[...Object.keys(shapes),...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(id=>({id,label:id,countSingular:shapes[id]?id:'letter '+id,countPlural:shapes[id]?(id==='cross'?'crosses':id+'s'):'letter '+id+'s',color:defaultColor(id),creativeSize:22,counts:[0,1,1,1],category:shapes[id]?'shapes':'letters',x:learnPlacements[id][0],y:learnPlacements[id][1],size:learnPlacements[id][2],learnRotation:learnPlacements[id][3],art:art(id,defaultColor(id),true)}));
 window.PaperCraft={colors,art,config:{independentDifficulty:true,resetMessage:'Paper cleared.',seed:7,interaction:'layers',defaultSauce:null,sauces:[],sceneSelector:'#craft-scene',creativeSizes:{initial:1,min:.3,max:4,step:.15,smallBelow:.8,bigFrom:1.4},toppings}};
})();
