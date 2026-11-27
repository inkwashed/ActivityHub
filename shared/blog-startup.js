/* Load synchronously before lesson dependencies. No storage or network writes. */
(function () {
 var ready=false, failures=[], timer;
 function record(message){if(!ready)failures.push(message);}
 window.addEventListener('error',function(event){
  var node=event.target;
  if(node&&node.tagName==='SCRIPT')record('Script download failed: '+node.src.split('/').pop().split('?')[0]);
  else if(event.message)record('Startup error: '+event.message);
 },true);
 window.addEventListener('unhandledrejection',function(){record('A startup operation failed.');});
 function show(){
  if(ready||!document.body)return;
  var existing=document.getElementById('blog-startup-error');if(existing)existing.remove();
  var ja=(document.documentElement.lang||navigator.language||'').indexOf('ja')===0;
  var box=document.createElement('section');box.id='blog-startup-error';box.setAttribute('role','alert');
  box.style.cssText='position:fixed;inset:0;z-index:10000;overflow:auto;padding:32px;box-sizing:border-box;background:var(--ah-canvas,#fff);color:var(--ah-ink,#253e50);font:18px/1.6 system-ui';
  var title=document.createElement('h1');title.textContent=ja?'アクティビティを読み込めませんでした':'The activity couldn’t finish loading';
  var text=document.createElement('p');text.textContent=ja?'通信を確認して、もう一度お試しください。再読み込みで保存済みの作品は削除されません。':'Check your connection and try again. Retrying reloads the page without clearing saved work.';
  var retry=document.createElement('button');retry.type='button';retry.className='ah-button';retry.textContent=ja?'もう一度読み込む':'Retry loading';retry.onclick=function(){location.reload();};
  var details=document.createElement('details'),summary=document.createElement('summary'),info=document.createElement('p');summary.textContent=ja?'先生向けの詳細':'Details for your teacher';
  info.textContent=(failures.length?failures.join('\n'):'Startup did not complete. A download may be delayed, or this browser may not support a required feature.');info.style.whiteSpace='pre-wrap';details.appendChild(summary);details.appendChild(info);
  box.appendChild(title);box.appendChild(text);box.appendChild(retry);box.appendChild(details);document.body.appendChild(box);
 }
 window.BlogStartup={ready:function(){ready=true;clearTimeout(timer);var box=document.getElementById('blog-startup-error');if(box)box.remove();}};
 window.addEventListener('load',function(){if(!ready)show();});
 timer=setTimeout(show,30000);
})();
