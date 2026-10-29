const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};vm.createContext(context);for(const f of ['model','art'])vm.runInContext(fs.readFileSync(`apps/my-town/${f}.js`,'utf8'),context);
const M=context.window.TownModel,A=context.window.TownArt;
assert.equal(M.places.length,24);
assert.equal(M.inventory(['aquarium','park','park']),'We have an aquarium and 2 parks.');
assert.equal(M.directions({route:[17,12,7,8],facing:0,destination:6}),'Go straight for two blocks. Turn right. Go straight for one block.');
assert.equal(M.side([21,22],2),'left');assert.equal(M.side([24,23],2),'right');assert.equal(M.side([22,7],6),'left');assert.equal(M.side([17,12],6),'right');
assert.equal(M.side([17,12],0),null);
assert.deepEqual([...M.extend([17],11,0)],[17]);assert.deepEqual([...M.extend([12],17,0)],[12]);assert.deepEqual([...M.extend([17,12],17,0)],[17]);
assert.equal(M.restore({blocks:Array(12).fill('script'),route:[17,1],facing:9}).blocks[0],null);
assert.deepEqual([...M.restore({blocks:Array(12).fill(null),route:[17,1]}).route],[17]);
for(const mode of [false,true])assert.match(A.map(M.initial(),mode),/viewBox="0 0 720 660"/);
console.log('My Town: vocabulary, counts, relative turns/sides, route guards, saved-state validation and fixed framing passed.');

assert.equal(M.directions({route:[17,12,7,22,2],facing:0,destination:2}),'Go straight for two blocks. Cross the bridge. Continue one block.');
assert.equal(M.directions({route:[2,22,7,12,17],facing:2,destination:null}),'Go straight for one block. Cross the bridge. Continue two blocks.');
assert.equal(M.directions({route:[7,22,23],facing:0,destination:2}),'Cross the bridge. Turn right. Continue one block.');
assert.equal(M.directions({route:[22,7],facing:2,destination:6}),'Cross the bridge. You can see it on your left.');
assert.equal(M.side([7,12],6),null);
assert.deepEqual([...M.extend([2],7,2)],[2]);
assert.deepEqual([...M.extend([22],7,2)],[22,7]);
assert.deepEqual([...M.extend([22,7],22,2)],[22]);
const old={blocks:Array(12).fill('park'),route:[17,12,7,2],facing:0,destination:2};
assert.deepEqual([...M.restore(old).route],[17,12,7,22,2]);
assert.deepEqual([...M.restore(M.restore(old)).route],[17,12,7,22,2]);
assert.equal(M.restore(old).blocks.filter(Boolean).length,12);
assert.equal((A.map(M.initial(),false).match(/data-bridge=/g)||[]).length,5);
console.log('River: north/south crossings, continued counts, turns, bridge arrival guards, undo and legacy migration passed.');

assert.equal(M.directions({route:[17,12],facing:0,destination:6}),'Go straight for one block. You can see it on your right.');
assert.equal(M.directions({route:[17,12,7],facing:0,destination:6}),'Go straight for two blocks.');
assert.equal(M.directions({route:[12],facing:0,destination:6}),'You can see it on your right.');
assert.equal(M.side([12],6,2),null);
assert.equal(M.directions({route:[17,12,7,22],facing:0,destination:2}),'Go straight for two blocks. Cross the bridge. You can see it on your right.');
console.log('Arrival: near corners in all four headings, passed destinations, initial heading and bridge exits passed.');
const tracks=Array(12).fill(null);tracks[9]='station';tracks[8]='station';
assert.deepEqual([...M.railRows(tracks)],[2]);
assert.equal(M.railNode(17,12,tracks),37);
assert.deepEqual([...M.extend([17],12,0,tracks)],[17]);
assert.deepEqual([...M.extend([17],37,0,tracks)],[17,37]);
assert.equal(M.side([17],9,0,tracks),null);
assert.equal(M.side([17,37],9,0,tracks),'left');
assert.equal(M.directions({blocks:tracks,route:[17,37],facing:0,destination:9}),'Cross the tracks. You can see it on your left.');
assert.equal(M.directions({blocks:tracks,route:[17,37,12,7],facing:0,destination:null}),'Cross the tracks. Continue two blocks.');
assert.equal(M.directions({blocks:tracks,route:[12,37,17],facing:2,destination:null}),'Go straight for one block. Cross the tracks.');
assert.equal(M.directions({blocks:tracks,route:[16,17,18],facing:1,destination:null}),'Go straight for two blocks.');
assert.deepEqual([...M.restore({topology:2,blocks:tracks,route:[17,12],facing:0}).route],[17,37,12]);
assert.equal((A.map({...M.initial(),blocks:tracks},false).match(/data-rail-row/g)||[]).length,1);
tracks[9]=null;assert.deepEqual([...M.railRows(tracks)],[2]);tracks[8]=null;assert.equal(M.railRows(tracks).length,0);
assert.deepEqual([...M.extend([17],12,0,tracks)],[17,12]);
console.log('Railways: shared rows, crossing counts, station-side arrival, parallel roads, removal and save migration passed.');
tracks[9]='station';
assert.equal(M.side([16,17],10,1,tracks),null);
assert.equal(M.side([18,17],9,3,tracks),null);
assert.equal(M.directions({route:[17,16],facing:0,destination:null}),'Turn left. Go straight for one block.');
assert.equal(M.directions({route:[17,18],facing:0,destination:null}),'Turn right. Go straight for one block.');
const movedStart=M.restore({topology:3,blocks:Array(12).fill('park'),route:[2,22],facing:2});
assert.deepEqual([...movedStart.route],[17]);assert.equal(movedStart.facing,0);assert.equal(movedStart.blocks.length,12);
assert.deepEqual([...M.restore({topology:3,blocks:Array(12).fill(null),route:[17,16],facing:0}).route],[17,16]);

assert.equal(M.mapHeight(tracks),692);
assert.equal(M.point(17,tracks)[1]-M.point(37,tracks)[1],56);
assert.equal(M.activeNode(37,tracks),true);
assert.equal(M.activeNode(27,tracks),false);
assert.deepEqual([...M.extend([17,37],36,0,tracks)],[17,37]);
assert.deepEqual([...M.extend([17,37],12,0,tracks)],[17,37,12]);
assert.deepEqual([...M.restore({topology:3,blocks:tracks,route:[17,37,36],facing:0}).route],[17,37]);
const everyRow=Array(12).fill(null);[0,4,8].forEach(i=>everyRow[i]='station');
assert.equal(M.mapHeight(everyRow),756);
assert.equal(M.point(20,everyRow)[1]-M.point(25,everyRow)[1],56);
assert.equal(M.point(10,everyRow)[1]-M.point(30,everyRow)[1],56);
assert.equal(M.side([30],4,2,everyRow),null);
console.log('Explicit crossings: separate streets/nodes, horizontal routes, expanded geometry and saved paths passed.');

assert.equal((A.map({...M.initial(),blocks:everyRow},false).match(/data-rail-bridge=/g)||[]).length,3);

const movable=Array(12).fill(null);movable[0]='station';movable[1]='park';
const swapped=M.movePlace(movable,0,1);assert.equal(swapped[0],'park');assert.equal(swapped[1],'station');assert.equal(movable[0],'station');
const moved=M.movePlace(swapped,1,8);assert.equal(moved[1],null);assert.equal(moved[8],'station');assert.deepEqual([...M.railRows(moved)],[2]);
assert.equal(M.movePlace(moved,1,2),moved);assert.equal(M.movePlace(moved,8,8),moved);assert.equal(M.movePlace(moved,8,12),moved);

for(let i=0;i<12;i++){const r=M.blockRect(i,everyRow);assert.equal(r.width,r.height);}

assert.equal((A.map(M.initial(),false).match(/data-sidewalk=/g)||[]).length,12);

// The car tracks the route endpoint and heading, including undo/reset states.
for(const [route,angle] of [[[17],0],[[17,12],0],[[17,18],90],[[17,12,17],180],[[17,16],270]]){
 const state={...M.initial(),route};const [x,y]=M.point(route.at(-1),state.blocks);
 assert.ok(A.map(state,true).includes(`data-town-car="" transform="translate(${x} ${y}) rotate(${angle})"`));
 const [sx,sy]=M.point(17,state.blocks);
 assert.ok(A.map(state,false).includes(`data-town-car="" transform="translate(${sx} ${sy}) rotate(0)"`));
}
console.log('Car: route endpoint, four headings, undo/reset positions and BUILD start passed.');
