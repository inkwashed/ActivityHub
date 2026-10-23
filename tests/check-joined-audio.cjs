const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
(async()=>{
let downloads=0;const sources=[];
const window={clearTimeout(){},fetch:async()=>{downloads++;return {ok:true,arrayBuffer:async()=>new ArrayBuffer(1)}},AudioContext:class{
 constructor(){this.currentTime=10;this.destination={}}
 resume(){return Promise.resolve()}
 decodeAudioData(){return Promise.resolve({sampleRate:1000,getChannelData:()=>Float32Array.from({length:1000},(_,i)=>i>=200&&i<800?.1:.0003)})}
 createBufferSource(){const s={connect(){},disconnect(){},start(...args){this.started=args},stop(){this.stopped=true}};sources.push(s);return s}
}};
vm.runInNewContext(fs.readFileSync('shared/pronunciation.js','utf8'),{window});
const player=Object.create(window.BuilderPronunciation.prototype);let fallback;
player.speak=text=>{fallback=text};
await player.playJoined(['one','two','three'],'I want 2 small vanilla scoops.');
assert.equal(downloads,3);assert.equal(sources.length,3);
for(let i=1;i<3;i++)assert.ok(Math.abs(sources[i].started[0]-sources[i-1].started[0]-sources[i-1].started[2])<1e-9);
assert.equal(sources[0].started[1],.14);assert.equal(sources[0].started[2],.72);
await player.playJoined(['one','two'],'repeat');assert.equal(downloads,3);assert.ok(sources[0].stopped);
const pending=player.playJoined(['one'],'cancelled');player.stop();await pending;assert.equal(sources.length,5);
window.fetch=async()=>({ok:false});await player.playJoined(['broken'],'whole sentence');assert.equal(fallback,'whole sentence');
console.log('PASS: contiguous audio scheduling, conservative silence bounds, cache reuse, cancellation and whole-sentence fallback.');
})().catch(e=>{console.error(e);process.exitCode=1});
