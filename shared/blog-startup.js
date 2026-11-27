/* Legacy entrypoint for older Blog pages. Shared activity startup is the owner. */
(function(){
 var source=new URL('app-startup.js',document.currentScript.src).href;
 document.write('<script src="'+source+'"><\/script>');
 Object.defineProperty(window,'BlogStartup',{configurable:true,get:function(){return window.AppStartup;}});
})();
