(() => {
const profiles=window.AnimalBlogCatalog||[];
const animalNames=profiles.map(profile=>profile.name);
const problemNames=profiles.flatMap(profile=>profile.problem.note);
window.AnimalBlogConfig={
 id:'myblog-nh6-6',mode:'guided',design:true,title:'Save the Animals',
 fields:[
  {id:'save',help:'Let’s save the',default:''},
  {id:'animal1',placeholder:'sea turtles',hintNames:animalNames,default:''},
  {id:'animal2',placeholder:'Sea turtles',hintNames:animalNames,default:''},
  {id:'live',help:'live in',default:''},
  {id:'habitat',placeholder:'the sea',default:''},
  {id:'problem',placeholder:'Plastic pollution',hintNames:problemNames,default:''},
  {id:'bigProblem',help:'is a big problem',default:''},
  {id:'weCan',help:'We can',default:''},
  {id:'action',placeholder:'use eco-friendly bags',default:''}
 ],
 rows:[['save','animal1'],['animal2','live','habitat'],['problem','bigProblem'],['weCan','action']],
 migrateDraft(raw){
  if(Array.isArray(raw?.typedRows)||typeof raw?.fields?.body!=='string')return raw;
  const lines=raw.fields.body.trim().split(/\r?\n/).filter(line=>line.trim());
  const sentences=lines.flatMap(line=>line.split(/(?<=[.!?])\s+/));
  const rows=[...sentences.slice(0,3),sentences.slice(3).join(' ')];
  return {...raw,showHelp:true,typedRows:rows};
 },
 images:[],
 reading:{
  profiles,
  problemImages:{
   'plastic pollution':'art/sea-turtles-problem.webp',
   'forest loss':'art/giant-pandas-problem.webp',
   'global warming':'art/polar-bears-problem.webp',
   overfishing:'art/humphead-wrasses-problem.webp',
   'traffic accidents':'art/fish-owls-problem.webp',
   'mudflat loss':'art/mudflat-loss.webp',
   'water shortage':'art/drought.webp'
  },
  imageFor(profile,section){
   if(profile[section.id].image)return profile[section.id].image;
   if(section.id==='habitat')return profile.image;
   if(section.id==='problem'){
    const tag=[].concat(profile.problem.note).find(tag=>Object.hasOwn(this.problemImages,tag));
    return this.problemImages[tag];
   }
  },
  footer:'My Encyclopedia - Animals',
  prompt:'Learn about endangered animals from around the world. Save notes with the {bookmark} button.',
  sections:[
   {id:'habitat',label:'Habitat',question:'Where do {name} live?'},
   {id:'problem',label:'Problem',question:'What’s the problem?'},
   {id:'action',label:'Action',question:'What can we do for the {name}?'}
  ]
 }
};
const {reading,images}=window.AnimalBlogConfig;
for(const profile of profiles){
 for(const section of reading.sections){
  const src=reading.imageFor(profile,section);
  if(src)images.push({id:`${profile.id}:${section.id}`,profile:profile.id,label:section.label,src,alt:`${profile.name}: ${section.label}`});
 }
}
})();
