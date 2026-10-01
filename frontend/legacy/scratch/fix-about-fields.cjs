const fs=require('node:fs');
const file='src/pages/About.jsx';
let s=fs.readFileSync(file,'utf8');
const keys={headline:'headline',whoIAm:'who_i_am',approach:'approach',philosophy:'philosophy',awards:'awards'};
for(let n=1;n<=3;n++)for(const [cap,field] of [['Title','title'],['Desc','desc'],['Link','link']])keys['news'+n+cap]='news'+n+'_'+field;
for(const [name,key] of Object.entries(keys))s=s.replace(new RegExp('  const '+name+' =[^\\n]*'), '  const '+name+' = about.'+key+" ?? '';");
fs.writeFileSync(file,s);
