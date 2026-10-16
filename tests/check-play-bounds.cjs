const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const c={window:{},document:{createElement:()=>({style:{},setAttribute(){}})}};vm.runInNewContext(fs.readFileSync('shared/creative-builder.js','utf8'),c);
const proto=c.window.CreativeBuilder.prototype;
const frame={getBoundingClientRect:()=>({left:0,top:0,right:400,bottom:300,width:400,height:300})};
const editor={sizes:{min:.5,max:2},pizza:{closest:()=>frame,getBoundingClientRect:()=>({left:100,top:100,width:200,height:100})},topping:()=>({creativeSize:40})};
let item={x:-999,y:999,scale:1,rotate:0,flip:false,artBounds:{x:0,y:.3,width:1,height:.4}};
proto.constrain.call(editor,item);assert.equal(item.x,-39);assert.equal(item.y,178);
// A large item has the same movement range: its blank square canvas must not trap it.
item.scale=2;item.x=-999;proto.constrain.call(editor,item);assert.equal(item.x,-39);
const art={append(hit){this.hit=hit},querySelector:()=>({getBBox:()=>({x:10,y:30,width:80,height:35}),viewBox:{baseVal:{x:0,y:0,width:100,height:100}}})};
const node={querySelector:()=>art,setAttribute(){}};item={node,renderedArt:'sample'};
proto.trimArtwork.call(editor,item);assert.equal(item.artBounds.height,.35);assert(Math.abs(parseFloat(art.hit.style.cssText.match(/height:([\d.]+)/)[1])-39)<.001);assert.equal(item.measuredArt,'sample');
const hit=art.hit;proto.trimArtwork.call(editor,item);assert.equal(hit,art.hit);
item.renderedArt='changed';proto.trimArtwork.call(editor,item);assert.notEqual(hit,art.hit);
console.log('PASS: frame-relative reach, large-item freedom, non-square SVG bounds and art-change measurement.');
