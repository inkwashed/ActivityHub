/* POST QR preview and PNG export. Uses only local canvas drawing. */
function postQRCanvas(url){
 let qr=PostQR.encode(url),box=PostQR.logoBox(qr);
 // Try a slightly larger symbol if an alignment marker occupies the center.
 // Never erase function patterns just to fit the envelope.
 if(!box&&qr.version<35){for(let version=qr.version+1;version<=34;version++){const candidate=PostQR.encode(url,{version}),space=PostQR.logoBox(candidate);if(space){qr=candidate;box=space;break;}}}
 const n=qr.modules.length,scale=8,border=4,canvas=document.createElement('canvas');
 canvas.width=canvas.height=(n+border*2)*scale;
 const context=canvas.getContext('2d');context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);context.fillStyle='#000000';
 qr.modules.forEach((row,y)=>row.forEach((dark,x)=>{if(dark)context.fillRect((x+border)*scale,(y+border)*scale,scale,scale);}));
 if(box){
  const origin=(box.start+border)*scale,extent=box.size*scale;
  context.fillStyle='#ffffff';context.fillRect(origin,origin,extent,extent);
  context.save();context.translate(origin+scale,origin+scale);context.scale((extent-2*scale)/64,(extent-2*scale)/64);
  context.fillStyle='#fff8ed';context.strokeStyle='#49342c';context.lineWidth=3;
  const body=new Path2D('M10 12H54Q59 12 59 17V47Q59 52 54 52H10Q5 52 5 47V17Q5 12 10 12Z');context.fill(body);context.stroke(body);
  context.lineWidth=2.5;context.lineCap=context.lineJoin='round';context.stroke(new Path2D('M7 49L26 32M57 49L38 32M7 15L32 36L57 15'));
  context.fillStyle='#963f4c';context.strokeStyle='#fff8ed';context.lineWidth=2;
  const heart=new Path2D('M32 42L22.5 33a6.4 6.4 0 0 1 9.5-8.5A6.4 6.4 0 0 1 41.5 33Z');context.fill(heart);context.stroke(heart);context.restore();
 }
 return {canvas,hasLogo:!!box};
}
function showPostQR(url){
 const {canvas,hasLogo}=postQRCanvas(url),dialog=document.createElement('dialog');
 dialog.className='qr-dialog';dialog.setAttribute('aria-labelledby','qr-title');dialog.setAttribute('aria-describedby','qr-help');
 dialog.innerHTML='<h2 id="qr-title">Your card QR code</h2><p id="qr-help"></p><img class="qr-image" alt="QR code for your card link"><div class="dialog-actions"><a class="button primary" download="post-card-qr.png">Download QR PNG</a><button type="button">Close</button></div>';
 const isLocal=location.protocol==='file:'||['localhost','127.0.0.1','::1','[::1]'].includes(location.hostname);
 dialog.querySelector('p').textContent=(isLocal?'Local preview: this code points to this computer. Generate a new code on the hosted site before sharing. ':'Scan to open this version of your card. ')+(hasLogo?'':'The envelope is omitted for this dense code to preserve its scan patterns. ');
 const image=canvas.toDataURL('image/png');dialog.querySelector('img').src=image;dialog.querySelector('a').href=image;
 dialog.querySelector('button').addEventListener('click',()=>dialog.close());
 const opener=document.activeElement;dialog.addEventListener('close',()=>{dialog.remove();if(opener?.isConnected)opener.focus();},{once:true});
 document.body.appendChild(dialog);dialog.showModal();
}
