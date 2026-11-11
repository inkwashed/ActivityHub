// Keep editing in the same popup so its original Teacher Tools opener survives.
(() => {
 const id=new URLSearchParams(location.search).get('selfieTransfer');
 if(!window.opener||!id||!/^[A-Za-z0-9_-]{16,128}$/.test(id))return;
 const link=document.createElement('a');link.className='ah-button';link.href='transfer.html?requestId='+encodeURIComponent(id);link.textContent='Continue to Teacher Tools';
 document.querySelector('#panels').before(link);
})();
