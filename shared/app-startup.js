/* Load synchronously before activity dependencies. No storage or network writes. */
(function () {
 var bootstrapURL=document.currentScript.src;
 var recoveryLesson=null;
 if(location.pathname.endsWith('/shared/app-recover.html')){
  var candidate=new URL(location.href).searchParams.get('lesson');
  if(candidate){var target=new URL(candidate,location.origin);if(target.origin===location.origin&&/^\/(?:apps|myblog|_dev)\/[^/]+\/(?:index\.html)?$/.test(target.pathname))recoveryLesson=target.pathname+target.search+target.hash;}
 }
 var ready=false, mounted=false, failures=[], timer;
 var missing=[];
 if(typeof HTMLDialogElement==='undefined'||typeof document.createElement('dialog').showModal!=='function')missing.push('native dialogs');
 if(typeof ResizeObserver==='undefined')missing.push('ResizeObserver');
 if(typeof Promise==='undefined'||typeof URL==='undefined'||typeof fetch==='undefined')missing.push('modern browser APIs');
 function record(message){if(!ready)failures.push(message);}
 window.addEventListener('error',function(event){
  var node=event.target;
  if(node&&node.tagName==='SCRIPT')record('Script download failed: '+node.src.split('/').pop().split('?')[0]);
  else if(event.message)record('Startup error: '+event.message);
 },true);
 window.addEventListener('unhandledrejection',function(){record('A startup operation failed.');});
 function show(){
  if(ready||!document.body)return;
  var existing=document.getElementById('app-startup-error');if(existing)return;
  var ja=((recoveryLesson?navigator.language:document.documentElement.lang)||navigator.language||'').indexOf('ja')===0;
  var box=document.createElement('section');box.id='app-startup-error';box.setAttribute('role','alert');
  box.style.cssText='position:fixed;inset:0;z-index:10000;overflow:auto;padding:32px;box-sizing:border-box;background:var(--ah-canvas,#fff);color:var(--ah-ink,#253e50);font:18px/1.6 system-ui';
  var title=document.createElement('h1');title.textContent=ja?'アクティビティを読み込めませんでした':'The activity couldn’t finish loading';
  var text=document.createElement('p');text.textContent=ja?'通信を確認して、もう一度お試しください。再読み込みで保存済みの作品は削除されません。':'Check your connection and try again. Retrying reloads the page without clearing saved work.';
  var retry=document.createElement('button');retry.type='button';retry.className='ah-button';retry.textContent=ja?'もう一度読み込む':'Retry loading';retry.onclick=function(){location.reload();};
  var fresh=document.createElement('button');fresh.type='button';fresh.className='ah-button';fresh.id='app-load-fresh';fresh.textContent=ja?'最新のファイルを読み込む':'Load fresh files';fresh.style.margin='12px';
  var recoveryStatus=document.createElement('p');recoveryStatus.setAttribute('role','status');
  fresh.onclick=function(){
   if(location.protocol!=='https:'&&location.protocol!=='http:'){
    recoveryStatus.textContent=ja?'最新のファイルを取得するには、オンラインの授業ページをSafariで開いてください。':'Open the online lesson in Safari to download fresh files.';return;
   }
   if(!recoveryLesson){
    var destination=new URL('app-recover.html',bootstrapURL);destination.searchParams.set('lesson',location.pathname+location.search+location.hash);destination.searchParams.set('__app_fresh',String(Date.now()));location.assign(destination.href);return;
   }
   fresh.disabled=true;retry.disabled=true;
   recoveryStatus.textContent=ja?'最新のファイルを取得しています…':'Requesting fresh files…';
   var stamp=String(Date.now()),url=new URL(recoveryLesson,location.origin);url.hash='';url.searchParams.set('__app_fresh',stamp);
   fetch(url.href,{cache:'reload',credentials:'same-origin'}).then(function(response){
    if(!response.ok||new URL(response.url||url.href).origin!==location.origin)throw Error('download');
    return response.text();
   }).then(function(html){
    var parsed=new DOMParser().parseFromString(html,'text/html');
    if(!parsed.querySelector('script[src*="app-startup.js"]')||!parsed.querySelector('body[data-startup-app]'))throw Error('page');
    Array.prototype.forEach.call(parsed.querySelectorAll('script[src],link[rel="stylesheet"][href]'),function(node){
     var attr=node.tagName==='SCRIPT'?'src':'href',asset=new URL(node.getAttribute(attr),url.href);
     if(asset.origin===location.origin){asset.searchParams.set('__app_fresh',stamp);node.setAttribute(attr,asset.href);}
    });
    var clean=new URL(recoveryLesson,location.origin);clean.searchParams.delete('__app_fresh');history.replaceState(null,'',clean.href);
    ready=true;clearTimeout(timer);
    document.open();document.write('<!doctype html>'+parsed.documentElement.outerHTML);document.close();
   }).catch(function(){
    fresh.disabled=false;retry.disabled=false;
    recoveryStatus.textContent=ja?'取得できませんでした。通信を確認して、先生に詳細を見せてください。':'Fresh files could not be loaded. Check the connection and show your teacher the details below. Saved work has not been cleared.';
   });
  };
  var guidance=document.createElement('p');
  guidance.textContent=missing.length?(ja?'このブラウザには必要な機能がありません。Safariで開き、iPadOSの更新について先生に確認してください。最新ファイルの取得だけでは解決しません。':'This browser is missing required features. Open the lesson directly in Safari and ask your teacher about updating iPadOS or the browser. Loading fresh files cannot add missing browser features.'):(ja?'Safariで開いていることを確認してください。最新ファイルでも解決しない場合は、先生に詳細とiPadOSのバージョンを見せてください。':'Make sure the lesson is open directly in Safari on iPad, or an up-to-date browser on other devices. If fresh files do not help, show your teacher the details and your OS/browser version. A compatibility issue is possible, but has not been confirmed.');
  var details=document.createElement('details'),summary=document.createElement('summary'),info=document.createElement('p');summary.textContent=ja?'先生向けの詳細':'Details for your teacher';
  info.textContent=(missing.length?'Missing browser features: '+missing.join(', ')+'\n':'')+(failures.length?failures.join('\n'):'Startup did not complete. A download may be delayed, or this browser may not support a required feature.');info.style.whiteSpace='pre-wrap';details.appendChild(summary);details.appendChild(info);
  box.appendChild(title);box.appendChild(text);box.appendChild(retry);box.appendChild(fresh);box.appendChild(recoveryStatus);box.appendChild(guidance);box.appendChild(details);document.body.appendChild(box);
 }
 function finish(){if(mounted&&!failures.length&&!missing.length){ready=true;clearTimeout(timer);var box=document.getElementById('app-startup-error');if(box)box.remove();}else show();}
 window.AppStartup={isReady:function(){return ready;},ready:function(){mounted=true;if(document.readyState==='complete')finish();}};
 window.addEventListener('load',finish);
 timer=setTimeout(show,30000);
 if(recoveryLesson){show();document.getElementById('app-load-fresh').click();}
})();
