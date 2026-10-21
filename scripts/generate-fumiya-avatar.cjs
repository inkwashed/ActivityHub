/* Rebuild the sample portrait with the same SVG renderer as the character creator. */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),context={window:{}};vm.createContext(context);
for(const file of ['apps/avatar/config.js','apps/avatar/svg-parts.js','apps/avatar/svg-art.js','myblog/NH1-5/config.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const {AvatarConfig,PlaceBlogConfig,renderAvatar}=context.window;
fs.writeFileSync(path.join(root,'myblog/NH1-5/fumiya.svg'),renderAvatar({...AvatarConfig.defaults,...PlaceBlogConfig.sample.avatar})+'\n');
console.log('Generated Fumiya sample avatar.');
