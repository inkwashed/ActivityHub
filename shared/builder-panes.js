/* Optional builder pane controller. Retains the actual ingredient nodes/state. */
(() => {
 class BuilderPanes {
  constructor(root) {
   this.root=root; this.panes=[...root.querySelectorAll('[data-builder-pane]')]; this.index=0;
   this.previous=root.querySelector('[data-pane-previous]'); this.next=root.querySelector('[data-pane-next]');
   this.status=root.querySelector('[data-pane-status]');
   this.previous.addEventListener('click',()=>this.show(this.index-1));
   this.next.addEventListener('click',()=>this.show(this.index+1));
   document.addEventListener('activityhub:languagechange',()=>this.show(this.index));
   this.show(0);
  }
  show(index) {
   this.index=(index+this.panes.length)%this.panes.length;
   this.panes.forEach((pane,i)=>{pane.hidden=i!==this.index;});
   const t=text=>window.ActivityHubI18n?.t(text)||text;
   this.status.textContent=`${this.index+1} / ${this.panes.length} · ${t(this.panes[this.index].dataset.builderPane)}`;
   this.previous.disabled=this.next.disabled=this.panes.length<2;
  }
 }
 window.BuilderPanes=BuilderPanes;
 document.querySelectorAll('[data-builder-panes]').forEach(root=>new BuilderPanes(root));
})();
