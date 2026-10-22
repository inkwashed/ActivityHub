/* ES guided writing; answer fields are independent on every row. */
window.WorldBlogConfig={
 id:'world-blog',mode:'guided',design:true,title:'Where is it from?',
 // Starter classroom list; extend this for the countries taught in a lesson.
 countryNames:['Japan','China','South Korea','Korea','Taiwan','Vietnam','Thailand','India','Indonesia','Malaysia','Singapore','the Philippines','Philippines','Australia','New Zealand','the United States','United States','the USA','USA','America','Canada','Mexico','Brazil','Peru','the UK','UK','the United Kingdom','United Kingdom','England','France','Germany','Italy','Spain','Russia','Egypt','Kenya','South Africa'],
 continentNames:['Asia','Africa','North America','South America','Antarctica','Europe','Oceania','Australia'],
 fields:[
  {id:'start',label:'Sentence 1 beginning',help:'This is',default:''},
  {id:'item',label:'My item',placeholder:'my sweater',default:''},
  {id:'from',label:'Sentence 2 beginning',help:"It's from",default:''},
  {id:'country',country:true,label:'Country in sentence 2',placeholder:'New Zealand',default:''},
  {id:'country2',country:true,label:'Country in sentence 3',placeholder:'New Zealand',default:''},
  {id:'location',label:'Sentence 3 middle',help:'is in',default:''},
  {id:'continent',continent:true,label:'Continent',placeholder:'Oceania',default:''},
  {id:'country3',country:true,label:'Country in sentence 4',placeholder:'New Zealand',default:''},
  {id:'article',label:'Sentence 4 middle',help:'is a',default:''},
  {id:'description',label:'Describe the country',placeholder:'beautiful',default:''},
  {id:'ending',label:'Sentence 4 ending',help:'country',default:''}
 ],
 rows:[['start','item'],['from','country'],['country2','location','continent'],['country3','article','description','ending']],
 images:[],
 example:{fields:{start:'This is',from:"It's from",location:'is in',article:'is a',ending:'country',item:'my cap',country:'Vietnam',country2:'Vietnam',country3:'Vietnam',continent:'Asia',description:'nice'},images:[]}
};
