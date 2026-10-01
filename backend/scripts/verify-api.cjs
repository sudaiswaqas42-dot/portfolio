const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.TEST_API_URL||'http://localhost:5000';
async function run(){
 let token;
 async function api(route,method='GET',body){const res=await fetch(base+route,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body?JSON.stringify(body):undefined});return {status:res.status,data:await res.json()};}
 assert.equal((await api('/api/admin/projects','PUT',{projects:[]})).status,401);
 const login=await api('/api/auth/login','POST',{username:process.env.TEST_ADMIN_USER||'admin',password:process.env.TEST_ADMIN_PASSWORD||'admin123'});assert.equal(login.status,200);token=login.data.token;
 const original=(await api('/api/portfolio')).data;
 let identityChanged=false;
 try {
   const settings={...original.settings,first_name:'Alexandra',last_name:'Montgomery'};
   assert.equal((await api('/api/admin/settings','PUT',{...settings,revision:original.revision})).status,200);
   identityChanged=true;
   const saved=(await api('/api/portfolio')).data;
   assert.equal(saved.settings.first_name,settings.first_name);
   assert.equal(saved.settings.last_name,settings.last_name);
 } finally {
   if(identityChanged){
     const latest=(await api('/api/portfolio')).data;
     assert.equal((await api('/api/admin/settings','PUT',{...original.settings,revision:latest.revision})).status,200);
     original.revision=(await api('/api/portfolio')).data.revision;
   }
 }
 console.log('PASS: admin first/last name persistence; original identity restored.');
 const picture=fs.readFileSync('frontend/public/images/favicon.png');
 const upload=await fetch(base+'/api/admin/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'image/png'},body:picture});assert.equal(upload.status,201);
 const image=await upload.json();assert.ok(image.url.startsWith('/uploads/'));
 assert.deepEqual(Buffer.from(await (await fetch(base+image.url)).arrayBuffer()),picture);
 const invalid=await fetch(base+'/api/admin/upload',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'image/png'},body:'not an image'});assert.equal(invalid.status,400);
 const slug=`verification-${Date.now()}`;
 let changed=false;
 try{
   const project={slug,title:'Persistence verification',nav_title:'Verification',year:'2026',challenge:'',services_text:'Design',role_text:'',live_link:'',media:[{type:'image',src:image.url,alt:'Uploaded verification image'}]};
   const created=await api('/api/admin/projects','PUT',{revision:original.revision,projects:[...original.projects,project]});assert.equal(created.status,200);changed=true;
   const read=(await api('/api/portfolio')).data,p=read.projects.find(p=>p.slug===slug);assert.ok(p.id);assert.equal(p.media[0].src,image.url);
   const stale=await api('/api/admin/projects','PUT',{revision:original.revision,projects:original.projects});assert.equal(stale.status,409);
   p.title='Updated verification';p.media[0].alt='Edited and persisted';
   assert.equal((await api('/api/admin/projects','PUT',{revision:read.revision,projects:read.projects})).status,200);
   const edited=(await api('/api/portfolio')).data.projects.find(p=>p.slug===slug);assert.equal(edited.title,p.title);assert.equal(edited.media[0].alt,'Edited and persisted');
   console.log('PASS: authentication, binary upload, invalid file rejection, project creation, editing, persisted media, stale-save protection');
 }finally{
   if(changed){const current=(await api('/api/portfolio')).data;const restored=await api('/api/admin/projects','PUT',{revision:current.revision,projects:current.projects.filter(p=>p.slug!==slug)});assert.equal(restored.status,200);console.log('Verification project removed; original projects retained.');}
 }
}
run().catch(e=>{console.error(e);process.exitCode=1});

