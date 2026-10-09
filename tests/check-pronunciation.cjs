const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
class Element {
 constructor(){this.children=[];this.attrs={};this.events={};this._text='';}
 set textContent(t){this._text=t;this.children=[];} get textContent(){return this._text+this.children.map(x=>x.textContent).join('');}
 append(x){this.children.push(x);} after(){} setAttribute(k,v){this.attrs[k]=v;}
 addEventListener(k,v){this.events[k]=v;} replaceChildren(){this.children=[];this._text='';}
 querySelectorAll(){return this.children.filter(x=>x.className==='pronunciation-word');}
}
let spoken=[],cancelled=0;
let timerCallback;
const window={setTimeout(fn){timerCallback=fn;return 1;},clearTimeout(){timerCallback=null;},addEventListener(){},SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'ja-JP',default:true},{lang:'en-US'}],speak:u=>spoken.push(u),cancel:()=>cancelled++}};
const document={addEventListener(){},createElement:()=>new Element(),createTextNode:text=>({textContent:text})};
vm.runInNewContext(fs.readFileSync('shared/pronunciation.js','utf8'),{window,document});
const p=new Element();p.parentElement=new Element();
const speech=new window.BuilderPronunciation(p);
speech.settingsStatus=new Element();
const text='I want 2 medium vanilla scoops and green peppers with tomato sauce.';
speech.render(text,['vanilla scoops','green peppers','tomato sauce','tomato']);
assert.equal(p.textContent,text);
assert.deepEqual(p.children.filter(x=>x.className).map(x=>x.textContent),['vanilla scoops','green peppers','tomato sauce']);
speech.button.events.click();assert.equal(spoken[0].text,text);assert.equal(spoken[0].lang,'en-US');
p.querySelectorAll()[1].events.click();assert.equal(cancelled,1);assert.equal(spoken[1].text,'green peppers');
speech.render('I want pineapple.',['pineapple']);assert.equal(cancelled,2);
speech.synth.getVoices=()=>[];speech.speak('pineapple');assert.equal(spoken.at(-1).lang,'en-US');
window.speechSynthesis=null;const plain=new Element();plain.parentElement=new Element();const unavailable=new window.BuilderPronunciation(plain);unavailable.render(text,['green peppers']);assert.equal(plain.textContent,text);assert.equal(unavailable.button.disabled,true);assert.equal(plain.querySelectorAll().length,0);
console.log('Pronunciation checks passed (mock DOM and speech).');
const british={name:'English UK',voiceURI:'uk',lang:'en-GB',localService:true};
const american={name:'English US',voiceURI:'us',lang:'en-US',localService:true};
speech.synth.getVoices=()=>[american,british];
speech.preferredVoice=speech.voiceKey(british);speech.speak('Hello');assert.equal(spoken.at(-1).voice,british);
speech.preferredVoice='missing';speech.speak('Hello');assert.equal(spoken.at(-1).voice,american);
const previewStatus=speech.settingsStatus;speech.speak('Preview',previewStatus);spoken.at(-1).onerror({error:'network'});assert.match(previewStatus.textContent,/could not play/);
console.log('Saved voice selection, unavailable voice fallback, and preview error checks passed.');
const google={name:'Google US English',voiceURI:'google',lang:'en-US',localService:false};
const bubbles={name:'Bubbles',voiceURI:'bubbles',lang:'en-US',default:true};
speech.synth.getVoices=()=>[bubbles,american,british,google,{name:'Extra',lang:'en-AU'}];
assert.equal(speech.recommendedVoices().length,3);
assert.equal(speech.recommendedVoices()[0],google);
assert.ok(!speech.recommendedVoices().includes(bubbles));
speech.preferredVoice='';speech.speak('Default');assert.equal(spoken.at(-1).voice,google);
speech.preferredVoice=speech.voiceKey(bubbles);speech.speak('Excluded');assert.equal(spoken.at(-1).voice,google);
speech.preferredVoice=speech.voiceKey(american);speech.speak('Chosen');assert.equal(spoken.at(-1).voice,american);
speech.synth.getVoices=()=>[bubbles,american,british];speech.preferredVoice='';speech.speak('Fallback');assert.equal(spoken.at(-1).voice,american);
console.log('Curated shortlist, Google default, novelty exclusion and device fallback checks passed.');

speech.preferredVoice='device-default';speech.speak('Device voice');assert.equal(spoken.at(-1).voice,undefined);assert.equal(spoken.at(-1).lang,'en-US');
timerCallback();assert.match(speech.settingsStatus.textContent,/Speech did not start/);assert.equal(speech.utterance,null);
let resumed=0;speech.synth.paused=true;speech.synth.resume=()=>resumed++;
speech.speak('Resume');assert.equal(resumed,1);spoken.at(-1).onstart();assert.equal(timerCallback,null);
speech.synth.getVoices=()=>[{...american},{...american},british];assert.equal(speech.recommendedVoices().length,2);
console.log('Device-default voice, paused engine, startup timeout, and deduplication checks passed.');
speech.previewButton=new Element();
speech.speak('Feedback');assert.equal(speech.settingsStatus.textContent,'Starting audio…');assert.equal(speech.previewButton.attrs['data-playing'],'true');
spoken.at(-1).onstart();assert.match(speech.settingsStatus.textContent,/started/);
spoken.at(-1).onend();assert.match(speech.settingsStatus.textContent,/finished/);assert.equal(speech.previewButton.attrs['data-playing'],'false');
speech.synth.getVoices=()=>{throw new Error('voice lookup failed');};speech.speak('Setup error');assert.match(speech.settingsStatus.textContent,/could not play/);assert.equal(speech.previewButton.attrs['data-playing'],'false');
console.log('Immediate tap feedback, start/end feedback, and setup exception checks passed.');
