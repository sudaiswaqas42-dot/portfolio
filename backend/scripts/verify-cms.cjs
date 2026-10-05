// Real MySQL + HTTP verification, without a browser. Restore the edited fields in finally.
const assert=require('node:assert/strict');
const jwt=require('jsonwebtoken');
const {secret}=require('../server/config.cjs');
const {app}=require('../server/server.cjs');
const pool=require('../server/db.cjs');
const migrate=require('../server/migrate.cjs');
async function main(){
 await migrate();
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const base=`http://127.0.0.1:${server.address().port}`;
 const token=jwt.sign({id:1,username:'cms-verification'},secret,{expiresIn:'5m'});
 async function api(route,body,auth=true){
   const response=await fetch(base+route,{method:body?'PUT':'GET',headers:{'Content-Type':'application/json',...(auth?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});
   return {status:response.status,body:await response.json()};
 }
 let original,changed=false;
 try{
   original=(await api('/api/portfolio')).body;
   assert.equal((await api('/api/admin/document',original,false)).status,401);
   const draft=structuredClone(original);
   draft.content['header.about']='About verification';
   draft.content['news.button_1']='';
   draft.settings.title='CMS verification heading';
   draft.about.who_i_am='CMS verification biography';
   draft.content['studio.animated_text']='YOUR NEW STUDIO';
   draft.content['studio.logo_image']='/images/favicon.png';
   const saved=await api('/api/admin/document',draft);
   assert.equal(saved.status,200,JSON.stringify(saved.body));changed=true;
   assert.equal(saved.body.revision,original.revision+1);
   const loaded=(await api('/api/portfolio')).body;
   assert.equal(loaded.content['header.about'],draft.content['header.about']);
   assert.equal(loaded.content['news.button_1'],'');
   assert.equal(loaded.settings.title,draft.settings.title);
   assert.equal(loaded.about.who_i_am,draft.about.who_i_am);
   assert.equal(loaded.content['studio.animated_text'],'YOUR NEW STUDIO');
   assert.equal(loaded.content['studio.logo_image'],'/images/favicon.png');
   assert.deepEqual(loaded.projects,original.projects);
   assert.equal((await api('/api/admin/document',draft)).status,409);
   const invalid={...loaded,settings:{...loaded.settings,title:'Must not save'},content:{...loaded.content,'header.destination_work':'javascript:alert(1)'}};
   assert.equal((await api('/api/admin/document',invalid)).status,400);
   assert.equal((await api('/api/portfolio')).body.settings.title,draft.settings.title);
   // Check migration does not resurrect cleared content after a restart.
   await migrate();
   assert.equal((await api('/api/portfolio')).body.content['news.button_1'],'');
   console.log(`PASS: ${Object.keys(loaded.content).length} CMS fields, authenticated atomic save, blank text, MySQL persistence, unchanged galleries, stale-save conflict, rejected unsafe URL, no partial save.`);
 }finally{
   if(changed){
     const latest=(await api('/api/portfolio')).body;
     // Preserve unrelated changes if another local session used the site during verification.
     latest.content['header.about']=original.content['header.about'];
     latest.content['news.button_1']=original.content['news.button_1'];
     latest.settings.title=original.settings.title;
     latest.about.who_i_am=original.about.who_i_am;
     latest.content['studio.animated_text']=original.content['studio.animated_text'];
     latest.content['studio.logo_image']=original.content['studio.logo_image'];
     const restored=await api('/api/admin/document',latest);
     assert.equal(restored.status,200,'Could not restore verification fields');
     console.log('Original published content restored.');
   }
   await new Promise(resolve=>server.close(resolve));
   await pool.end();
 }
}
main().catch(e=>{console.error(e);process.exitCode=1;pool.end();});
