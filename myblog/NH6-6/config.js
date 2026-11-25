(() => {
const catalog=window.AnimalBlogCatalog||[];
const profiles=catalog.filter(profile=>!profile.hidden);
const habitatNouns=['desert','forest','rainforest','lake','mountain','river','savanna','wetland'];
const animalNouns=[
 'whale','dolphin','penguin','sea turtle','shark','crab','bear','elephant','tiger','lion',
 'horse','zebra','camel','giraffe','gorilla','monkey','orangutan','panda','koala','dog','cat',
 'rabbit','crocodile','snake','frog','bird','polar bear'
];
const animalVariants=['fox','foxes','mouse','mice','fish','jellyfish','fishes','jellyfishes'];
const problems=['forest loss','global warming','plastic','hunting','overfishing','air pollution','chemicals','traffic accidents','plastic pollution'];
const actions=['plant trees','save energy','use eco-friendly bags','refuse','reduce','reuse','recycle'];
const pluralForms=words=>words.flatMap(word=>[word,word+'s']);
const habitats=[...pluralForms(habitatNouns),'sea','ice','sea ice'];
const animals=[...pluralForms(animalNouns),...animalVariants];
const suggestions=(core,section)=>[...new Set([...core,...profiles.flatMap(profile=>profile[section].note)])];
const habitatNames=suggestions(habitats,'habitat').flatMap(term=>term.startsWith('the ')?[term]:[term,'the '+term]);
const animalNames=[...new Set([...animals,...profiles.map(profile=>profile.name)])];
window.AnimalBlogConfig={
 id:'myblog-nh6-6',mode:'guided',design:true,designGridColumns:6,separateImageLimits:true,title:'Save the Animals',
 fields:[
  {id:'save',help:'Let’s save the',default:''},
  {id:'animal1',placeholder:'sea turtles',hintNames:animalNames,default:''},
  {id:'animal2',placeholder:'Sea turtles',hintNames:animalNames,default:''},
  {id:'live',help:'live in',default:''},
  {id:'habitat',placeholder:'the sea',hintNames:habitatNames,allowList:true,default:''},
  {id:'problem',placeholder:'Plastic pollution',hintNames:suggestions([...problems,'chemical pollution'],'problem'),default:''},
  {id:'bigProblem',help:'is a big problem',default:''},
  {id:'weCan',help:'We can',default:''},
  {id:'action',placeholder:'use eco-friendly bags',hintNames:suggestions([...actions,'reuse plastic bags'],'action'),default:''}
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
  catalog,
  vocabulary:['nature','sea animals','animals',...habitats,...animals,...problems,...actions,
   'hunted','reused','reduced','recycled','refused'],
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
for(const profile of catalog){
 for(const section of reading.sections){
  const src=reading.imageFor(profile,section);
  if(src)images.push({id:`${profile.id}:${section.id}`,profile:profile.id,label:section.label,src,alt:`${profile.name}: ${section.label}`});
 }
}
})();
