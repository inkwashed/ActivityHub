const fs=require('node:fs'),vm=require('node:vm');
for(const [file,name,global,nested] of [['check-creative.cjs','pizza','pizza',true],['check-parfait-creative.cjs','parfait','parfait',true],['check-sandwich.cjs','sandwich','sandwich',false],['check-class-supplies.cjs','supplies','supplies',false],['check-builder-lab.cjs','lab','lab',false]]){
 let source=fs.readFileSync('tests/'+file,'utf8').replace('b.creative=null;','const retainedEditor=b.creative;b.creative=null;');
 const extra=`\n{const target=context.window.${global}Builder;if(!target.creative)target.creative=retainedEditor;require('./layer-order-fixture.cjs')(target,context,'${name}',${name==='supplies'?'adapter':'undefined'});}\n`;
 if(nested){const end=source.lastIndexOf('`,{require,console});');source=source.slice(0,end)+extra+source.slice(end)}else source+=extra;
 vm.runInNewContext(source,{require,console});
}
