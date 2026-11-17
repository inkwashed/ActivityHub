/* Compare maintained vocabulary against approved files, without promoting drafts. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'../..');
function audit(){
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/audio/catalog.json'))),manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/audio/manifest.json'))),approved=new Map(manifest.map(x=>[x.id,x]));
 const invalid=[];for(const record of manifest){const file=path.join(root,'assets/audio/en-US/heart-070',record.id+'.mp3');if(!fs.existsSync(file)||crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==record.sha256)invalid.push(record.id);}
 const apps={};for(const clip of catalog.clips)for(const app of clip.apps||[]){const row=apps[app]||= {required:0,approved:0,missing:[]};row.required++;if(approved.has(clip.id))row.approved++;else row.missing.push({id:clip.id,text:clip.text});}
 return {approvedFiles:manifest.length,invalidApprovedFiles:invalid,apps};
}
if(require.main===module){const report=audit();if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));else {for(const [name,row] of Object.entries(report.apps))console.log(`${name}: ${row.approved}/${row.required} approved; ${row.missing.length} missing`);console.log(`Approved-file integrity: ${report.invalidApprovedFiles.length?'FAIL '+report.invalidApprovedFiles.join(', '):'PASS'}`);}if(report.invalidApprovedFiles.length)process.exitCode=1;}
module.exports={audit};
