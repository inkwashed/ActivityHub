/* NEW HORIZON Elementary 6, Unit 5. Original artwork; textbook language only. */
window.WorldBlogConfig={
 id:'world-blog',
 title:'Where is it from?',
 fields:[
  {id:'item',label:'My item',maxLength:80,default:''},
  {id:'country',label:'Country',maxLength:80,default:''},
  {id:'continent',label:'Continent',maxLength:80,default:''},
  {id:'description',label:'Describe the country',maxLength:80,default:''}
 ],
 sentences:['This is my {item}.',"It's from {country}.",'{country} is in {continent}.','{country} is a {description} country.'],
 images:[{id:'cap',src:'cap.svg',alt:'A green cap'}],
 example:{fields:{item:'cap',country:'Vietnam',continent:'Asia',description:'nice'},images:[{id:'cap'}]}
};
