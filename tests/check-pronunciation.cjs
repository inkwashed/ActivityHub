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
speech.synth.getVoices=()=>{throw new Error('voice lookup failed');};speech.speak('Setup error');assert.equal(spoken.at(-1).text,'Setup error');spoken.at(-1).onend();assert.equal(speech.previewButton.attrs['data-playing'],'false');
console.log('Immediate tap feedback, start/end feedback, and setup exception checks passed.');

// Recorded playback: exact phrase lookup, no eager audio, interruption and stale failures.
(async () => {
 const audio=[];
 window.Audio=class {
  constructor(url){this.url=url;audio.push(this);}
  play(){return new Promise((resolve,reject)=>{this.reject=reject;});}
  pause(){this.paused=true;}
 };
 window.ActivityHubAudio={resolve:text=>text==='bananas'?'banana.mp3':null};
 speech.synth.getVoices=()=>[american];
 assert.equal(audio.length,0);
 speech.speak('bananas');assert.equal(audio.length,1);assert.equal(audio[0].url,'banana.mp3');
 const before=spoken.length;
 speech.speak('bananas');assert.equal(audio[0].paused,true);
 audio[0].reject(new Error('stale'));await Promise.resolve();assert.equal(spoken.length,before);
 audio[1].reject(new Error('missing'));await Promise.resolve();assert.equal(spoken.at(-1).text,'bananas');
 speech.speak('bananas');const current=audio.at(-1);speech.render('New order',[]);assert.equal(current.paused,true);
 speech.speak('I want bananas.');assert.equal(spoken.at(-1).text,'I want bananas.');
 speech.speak('bananas',speech.settingsStatus,true);assert.equal(spoken.at(-1).text,'bananas');
 unavailable.render('bananas',['bananas']);assert.equal(plain.querySelectorAll().length,1);
 console.log('Recorded playback, missing-file fallback, stale rejection, text-change cancellation and no-speech vocabulary checks passed.');
const question=new Element();question.textContent='What do you want?';
document.querySelector=selector=>selector==='[data-pronunciation-question]'?question:null;
window.ActivityHubAudio={resolve:text=>text==='What do you want?'?'question.mp3':null};
const questionOrder=new Element();questionOrder.parentElement=new Element();
const questionPlayer=new window.BuilderPronunciation(questionOrder);
question.events.click();assert.equal(questionPlayer.audio.url,'question.mp3');
assert.equal(question.attrs['aria-label'],'Listen: What do you want?');
questionPlayer.stop();
console.log('Target question uses recorded playback and an accessible button.');

// Use the real library to verify exact a/an questions and hosted/file URL resolution.
for(const base of ['https://example.test/assets/audio/library.js','file:///example/assets/audio/library.js']){
 const libraryWindow={};
 vm.runInNewContext(fs.readFileSync('assets/audio/library.js','utf8'),{window:libraryWindow,document:{currentScript:{src:base}},URL});
 const library=libraryWindow.ActivityHubAudio;
 const configWindow={};vm.runInNewContext(fs.readFileSync('apps/class-supplies/config.js','utf8'),{window:configWindow});
 for(const noun of ['pencil case',...configWindow.Supplies.config.toppings.map(item=>item.label)]){
  const article=/^[aeiou]/.test(noun)?'an':'a';
  const urls=library.resolveSequence(`Do you have ${article} ${noun}?`);
  assert.equal(urls.length,2);assert.equal(urls[0],library.resolve(`Do you have ${article}`));assert.equal(urls[1],library.resolve(noun));
 }
 assert.equal(library.resolveSequence('  DO YOU HAVE   A PEN?  ')[1],library.resolve('pen'));
 assert.equal(library.resolveSequence('Do you have a …?')[0],library.resolve('Do you have a'));
 for(const unsupported of ['Do you have a unicorn?','Do you have a red pen?','Do you have a eraser?','I have a unicorn.'])assert.equal(library.resolveSequence(unsupported),null);
 window.ActivityHubAudio=library;
}
const q='Do you have an eraser?';
const prior=audio.length;
speech.speak(q);const sequence=audio.at(-1);
assert.equal(audio.length,prior+1);assert.match(sequence.url,/do-you-have-an\.mp3/);
const oldReject=sequence.reject;
sequence.onended();assert.equal(audio.length,prior+1);assert.match(sequence.src,/eraser\.mp3/);
const spokenBefore=spoken.length;oldReject(new Error('late prefix rejection'));await Promise.resolve();assert.equal(spoken.length,spokenBefore);
sequence.onended();assert.equal(speech.audio,null);
// First or second clip errors fall back to the complete question.
speech.speak(q);audio.at(-1).onerror();assert.equal(spoken.at(-1).text,q);
speech.speak(q);audio.at(-1).onended();audio.at(-1).reject(new Error('second play blocked'));await Promise.resolve();assert.equal(spoken.at(-1).text,q);assert.equal(speech.audio,null);
speech.speak(q);const blocked=audio.at(-1);blocked.play=()=>{throw new Error('second play throws')};blocked.onended();assert.equal(spoken.at(-1).text,q);
// Another tap or changed text must prevent the pending noun from playing.
speech.speak(q);const interrupted=audio.at(-1),lateEnd=interrupted.onended;
speech.speak('pen');const newer=speech.audio;lateEnd();assert.equal(speech.audio,newer);assert.equal(interrupted.src,undefined);assert.equal(interrupted.paused,true);
speech.speak(q);const cancelledSequence=audio.at(-1),cancelledEnd=cancelledSequence.onended;
speech.render('Changed inventory',[]);cancelledEnd();assert.equal(speech.audio,null);assert.equal(cancelledSequence.src,undefined);
speech.speak(q,speech.settingsStatus,true);assert.equal(spoken.at(-1).text,q);assert.equal(speech.audio,null);
// A composed question stays available even with no speech synthesis.
question.textContent=q;
const noSpeechOrder=new Element();noSpeechOrder.parentElement=new Element();
const noSpeechQuestion=new window.BuilderPronunciation(noSpeechOrder);
assert.equal(question.disabled,false);question.events.click();assert.match(noSpeechQuestion.audio.url,/do-you-have-an\.mp3/);noSpeechQuestion.stop();
console.log('PASS: all Supplies question sequences, a/an, second-clip fallback, interruption and browser-only preview.');

// Long sentences stay recorded without device synthesis. A failure late in the
// sequence falls back to the entire original text, never just its remaining part.
const inventory='I have 1 blue pencil case, 2 red colored pencils and 1 blue colored pencil.';
const noSpeech=new Element();noSpeech.parentElement=new Element();
const recordedOnly=new window.BuilderPronunciation(noSpeech);
recordedOnly.render(inventory,['pencil case','colored pencils','colored pencil']);
assert.equal(recordedOnly.button.disabled,false);
recordedOnly.button.events.click();const inventoryAudio=recordedOnly.audio;
for(let i=1;i<window.ActivityHubAudio.resolveSequence(inventory).length;i++)inventoryAudio.onended();
inventoryAudio.onended();assert.equal(recordedOnly.audio,null);
recordedOnly.render('I have an unknown thing.',[]);assert.equal(recordedOnly.button.disabled,true);
speech.speak(inventory);const lateFailure=audio.at(-1);
lateFailure.onended();lateFailure.onended();lateFailure.onerror();
assert.equal(spoken.at(-1).text,inventory);assert.equal(speech.audio,null);
speech.speak('I have a unicorn.');assert.equal(spoken.at(-1).text,'I have a unicorn.');assert.equal(speech.audio,null);
speech.speak(inventory,speech.settingsStatus,true);assert.equal(spoken.at(-1).text,inventory);assert.equal(speech.audio,null);
console.log('PASS: complete recorded inventories without device speech, late-clip failure and explicit browser preview.');
})().catch(error=>{console.error(error);process.exitCode=1;});

const voiceProbe=Object.create(window.BuilderPronunciation.prototype);
voiceProbe.synth={getVoices:()=>{throw new Error('Device voice service unavailable')}};
assert.equal(voiceProbe.englishVoices().length,0);
voiceProbe.synth.getVoices=()=>null;
assert.equal(voiceProbe.englishVoices().length,0);
console.log('PASS: throwing and null device voice lists fail safely.');
