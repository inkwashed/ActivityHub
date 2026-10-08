/* Page within a section without replacing controls or altering builder state. */
(() => {
 class ChoicePager {
  constructor(root) {
   this.root=root;this.list=root.querySelector('[data-choice-list]');
   this.items=[...this.list.children];this.size=Number(root.dataset.pageSize)||3;
   this.list.choicePager=this;this.expanded=false;
   this.page=0;this.pages=Math.max(1,Math.ceil(this.items.length/this.size));
   this.previous=root.querySelector('[data-choice-previous]');this.next=root.querySelector('[data-choice-next]');
   this.status=root.querySelector('[data-choice-status]');
   this.previous.addEventListener('click',()=>this.show(this.page-1));
   this.next.addEventListener('click',()=>this.show(this.page+1));
   this.show(0);
  }
  setExpanded(expanded) {
   this.expanded=expanded;
   this.root.dataset.expanded=String(expanded);
   this.show(this.page);
  }
  show(page) {
   this.page=(page+this.pages)%this.pages;
   this.items.forEach((item,i)=>{item.hidden=!this.expanded && Math.floor(i/this.size)!==this.page;});
   this.previous.hidden=this.next.hidden=this.status.hidden=this.expanded;
   this.status.textContent=`${this.page+1} / ${this.pages}`;
   this.previous.disabled=this.next.disabled=this.pages===1;
  }
 }
 window.ChoicePager=ChoicePager;
 document.querySelectorAll('[data-choice-pager]').forEach(root=>new ChoicePager(root));
})();
