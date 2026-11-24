const animalBlog=window.AnimalBlogConfig;
const draftKey=`letseigo.app.${animalBlog.id}`;
const previous=window.ActivityAutosave.read(draftKey,1);
// Retain the original text if it exceeds the four guided rows or includes a custom title.
if(!Array.isArray(previous?.typedRows)&&(previous?.fields?.title||previous?.fields?.body)){
 window.ActivityAutosave.write(`${draftKey}.original-writing`,1,previous.fields);
}
window.BlogPost.mount(animalBlog);
