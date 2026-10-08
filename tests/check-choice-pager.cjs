const fs=require('fs'),vm=require('vm'),assert=require('assert');
const items=Array.from({length:9},(_,i)=>({quantity:i%4}));
const button=()=>({addEventListener(type,fn){this.click=fn}});
const prev=button(),next=button(),status={};
const list={children:items};
const root={dataset:{pageSize:'3'},querySelector:s=>({'[data-choice-list]':list,'[data-choice-previous]':prev,'[data-choice-next]':next,'[data-choice-status]':status}[s])};
vm.runInNewContext(fs.readFileSync('shared/choice-pager.js','utf8'),{window:{},document:{querySelectorAll:()=>[root]}});
const visible=()=>items.map((x,i)=>x.hidden?-1:i).filter(i=>i>=0);
assert.deepEqual(visible(),[0,1,2]);next.click();assert.deepEqual(visible(),[3,4,5]);next.click();assert.deepEqual(visible(),[6,7,8]);next.click();assert.deepEqual(visible(),[0,1,2]);prev.click();assert.deepEqual(visible(),[6,7,8]);assert.equal(status.textContent,'3 / 3');
items.forEach((item,i)=>assert.equal(item.quantity,i%4));
console.log('PASS: choice paging, wrapping, page indicator, and retained item state.');

list.choicePager.setExpanded(true);assert.deepEqual(visible(),[0,1,2,3,4,5,6,7,8]);assert(prev.hidden&&next.hidden&&status.hidden);
list.choicePager.setExpanded(false);assert.deepEqual(visible(),[6,7,8]);assert.equal(prev.hidden,false);
items.forEach((item,i)=>assert.equal(item.quantity,i%4));
console.log('PASS: show-all mode and restoration of the previous page without state loss.');

root.dataset.pageSize='6';
const context={window:{},document:{querySelectorAll:()=>[root]}};
vm.runInNewContext(fs.readFileSync('shared/choice-pager.js','utf8'),context);
assert.deepEqual(visible(),[0,1,2,3,4,5]);assert.equal(status.textContent,'1 / 2');
next.click();assert.deepEqual(visible(),[6,7,8]);assert.equal(status.textContent,'2 / 2');
next.click();assert.deepEqual(visible(),[0,1,2,3,4,5]);
prev.click();assert.deepEqual(visible(),[6,7,8]);
list.choicePager.setExpanded(true);assert.equal(visible().length,9);
list.choicePager.setExpanded(false);assert.deepEqual(visible(),[6,7,8]);
items.forEach((item,i)=>assert.equal(item.quantity,i%4));
console.log('PASS: six-choice pages, partial last page, wrapping, and PLAY/LEARN restoration.');
