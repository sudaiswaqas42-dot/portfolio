const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('node:fs');
const path = require('node:path');
const {randomUUID} = require('node:crypto');
const {port,secret} = require('./config.cjs');
const pool = require('./db.cjs');
const migrate = require('./migrate.cjs');
const defaultTheme = require('../../shared/theme.json');
const themePresets = require('../../shared/themePresets.json');
const contentCatalog = require('../../shared/contentCatalog.json');
const app = express();
const root = path.join(__dirname,'..');
const uploadDir = process.env.VERCEL ? path.join('/tmp','uploads') : path.join(root,'uploads');
try { fs.mkdirSync(uploadDir,{recursive:true}); } catch {}
app.disable('x-powered-by');
app.use(cors({origin:true,credentials:true}));
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');next();});
app.use('/api',(req,res,next)=>{res.setHeader('Cache-Control','no-store');next();});
app.use(express.json({limit:'2mb'}));
function requireAuth(req,res,next){
  try{req.admin=jwt.verify((req.headers.authorization||'').replace(/^Bearer /,''),secret,{algorithms:['HS256']});next();}
  catch{res.status(401).json({error:'Session expired. Please sign in again.'});}
}
const parse=(v)=>{try{return JSON.parse(v)||[]}catch{return []}};
async function portfolio(db=pool){
  const [[settings],[services],[philosophy],[projects],[about],[meta]]=await Promise.all([
    db.query('SELECT * FROM site_settings WHERE id=1'),db.query('SELECT * FROM services ORDER BY sort_order,id'),
    db.query('SELECT * FROM philosophy_points ORDER BY sort_order,id'),db.query('SELECT * FROM projects ORDER BY sort_order,id'),
    db.query('SELECT * FROM about_content WHERE id=1'),db.query('SELECT revision FROM cms_meta WHERE id=1')]);
  const {theme_json,footer_technologies_json,content_json,...publicSettings}=settings[0]||{};
  const theme=theme_json?parse(theme_json):defaultTheme;
  publicSettings.footer_technologies=footer_technologies_json?parse(footer_technologies_json):[];
  return {content:{...Object.fromEntries(Object.entries(contentCatalog).map(([key,field])=>[key,field.value])),...(content_json?parse(content_json):{})},settings:publicSettings,theme,theme_presets:themePresets,services:services.map(({images_json,videos_json,...s})=>({...s,images:parse(images_json),videos:parse(videos_json)})),philosophy:philosophy.map(p=>p.point_text),projects:projects.map(({media_json,...p})=>({...p,media:parse(media_json)})),about:about[0]||{},revision:meta[0].revision};
}
app.get('/api/portfolio',async(req,res,next)=>{
  try{
    res.json(await portfolio());
  }catch(e){
    console.warn('Database query failed for /api/portfolio, serving fallback content:', e.message);
    try{
      const defaults = require('../data/defaults.json');
      res.json({
        content: Object.fromEntries(Object.entries(contentCatalog).map(([key,field])=>[key,field.value])),
        settings: defaults.settings || {},
        theme: defaultTheme,
        theme_presets: themePresets,
        services: defaults.services || [],
        philosophy: defaults.philosophy || [],
        projects: defaults.projects || [],
        about: defaults.about || {},
        revision: 1
      });
    }catch(err){next(e);}
  }
});
app.get('/api/admin/theme-presets',(req,res)=>res.json(themePresets));
const attempts=new Map();
app.post('/api/auth/login',async(req,res,next)=>{
  const key=req.ip,now=Date.now();
  for(const [ip,v] of attempts)if(v.until<now)attempts.delete(ip);
  const entry=attempts.get(key)||{count:0,until:now+900000};
  const {username: rawUser, email, password}=req.body||{};
  const username = (rawUser || email || '').trim();
  if(!username||typeof password!=='string'||username.length>100||password.length>200)return res.status(400).json({error:'Enter a valid username and password.'});
  try{
    const [rows]=await pool.query('SELECT * FROM admin_users WHERE username=?',[username]);
    if(!rows[0]||!await bcrypt.compare(password,rows[0].password_hash)){entry.count++;attempts.set(key,entry);return res.status(401).json({error:'Invalid username or password'});}
    attempts.delete(key);
    res.json({token:jwt.sign({id:rows[0].id,username},secret,{expiresIn:'8h'}),username});
  }catch(e){next(e)}
});
app.get('/api/auth/me',requireAuth,(req,res)=>res.json({admin:req.admin}));
function bad(message){const e=new Error(message);e.status=400;throw e;}
function text(v,max=30000){if(typeof v!=='string'||v.length>max)bad('Invalid or overly long text');return v;}
function url(v){text(v,2048);if(v&&!/^https?:\/\/[^\s]+$/i.test(v)&&!/^\/(?!\/)[^\s]*$/.test(v)&&v!=='none')bad('Use an https:// URL or a local /path');return v;}
function list(v,max=200){if(!Array.isArray(v)||v.length>max)bad('Invalid list');return v;}
const settingsFields=['first_name','last_name','title','role','headline','email','linkedin_url','twitter_url','behance_url','hero_image','about_image','benefits_silhouette_image','benefits_dark_image','benefits_light_image','footer_video','footer_video_poster','footer_heading','footer_subheading','footer_tech_label'];
const aboutFields=['headline','who_i_am','approach','philosophy','awards','news2_img1','news2_img2','news2_img3','news3_img1','news3_img2',...Array.from({length:3},(_,i)=>[`news${i+1}_title`,`news${i+1}_desc`,`news${i+1}_link`]).flat()];
function validate(section,body){
  if(!body || typeof body!=='object')bad('Invalid content');
  if(section==='content'){
    const result={};
    for(const [key,field] of Object.entries(contentCatalog)){
      const value=body[key]??field.value;
      text(value);
      if(['image','video','url'].includes(field.type))url(value);
      if(field.type==='link'&&value&&!/^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|#[^\s]*|mailto:[^\s]+|tel:[+\d\s()-]+)$/i.test(value))bad(`Invalid link: ${field.label}`);
      result[key]=value;
    }
    return result;
  }
  if(section==='theme'){
    if(!['light','dark','system'].includes(body.mode))bad('Choose a valid theme mode');
    const theme={mode:body.mode};
    for(const group of ['light','dark','accent']){
      theme[group]={};
      for(const key of Object.keys(defaultTheme[group])){
        const color=body[group]?.[key];
        if(typeof color!=='string'||!/^#[0-9a-f]{6}$/i.test(color))bad(`Invalid hex color: ${group} ${key}`);
        theme[group][key]=color.toUpperCase();
      }
    }
    return theme;
  }
  if(section==='settings'||section==='about'){
    const fields=section==='settings'?settingsFields:aboutFields;
    const result=Object.fromEntries(fields.map(k=>[k,/url|link|image|img|video|poster/.test(k)?url(body[k]??''):text(body[k]??'',k==='headline'||k==='title'?255:30000)]));
    if(section==='settings'){
      if(!result.first_name.trim()||!/^\S+@\S+\.\S+$/.test(result.email))bad('Name and a valid email are required');
      if(Array.isArray(body.footer_technologies)){
        result.footer_technologies_json=JSON.stringify(body.footer_technologies.map(t=>typeof t==='string'?t.trim():'').filter(Boolean));
      } else if(typeof body.footer_technologies_json==='string'){
        result.footer_technologies_json=body.footer_technologies_json;
      }
    }
    return result;
  }
  if(section==='philosophy')return list(body.points,50).map(p=>text(p,2000));
  if(section==='services')return list(body.services,30).map((s,i)=>({...s,title:text(s.title,255),description:text(s.description),images:list(s.images||[],8).map(url),videos:list(s.videos||[],8).map(url),sort_order:i}));
  if(section==='projects'){
    const slugs=new Set();
    return list(body.projects,100).map((p,i)=>{
      if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)||p.slug.length>100||slugs.has(p.slug))bad('Each project needs a unique lowercase slug');
      slugs.add(p.slug);
      if(!p.title?.trim())bad('Project title is required');
      return {...p,title:text(p.title,255),nav_title:text(p.nav_title||p.title,100),year:text(p.year||'',20),challenge:text(p.challenge||''),services_text:text(p.services_text||'',255),role_text:text(p.role_text||''),live_link:url(p.live_link||''),sort_order:i,
        gallery_class:text(p.gallery_class||'cont-project-imgs',100),media:list(p.media||[],100).map(m=>{
          if(!['image','video'].includes(m.type))bad('Invalid media type');
          return {type:m.type,src:url(m.src),alt:text(m.alt||'',500),poster:url(m.poster||''),className:text(m.className||'',150),id:text(m.id||'',150),srcSet:text(m.srcSet||'',4000)};
        })};
    });
  }
  bad('Unknown section');
}

const documentSections=['settings','about','services','philosophy','projects','theme','content'];
function validateDocument(body){
  if(!body||typeof body!=='object')bad('Invalid document');
  return Object.fromEntries(documentSections.map(section=>{
    if(body[section]===undefined)bad('Missing section: '+section);
    const payload=section==='services'?{services:body.services}:section==='projects'?{projects:body.projects}:section==='philosophy'?{points:body.philosophy}:body[section];
    return [section,validate(section,payload)];
  }));
}
async function persistSection(conn,section,value){
    if(section==='settings'||section==='about'){
      const table=section==='settings'?'site_settings':'about_content';
      await conn.query(`UPDATE ${table} SET ${Object.keys(value).map(k=>`${k}=?`).join(',')} WHERE id=1`,Object.values(value));
    }else if(section==='content'){
      await conn.query('UPDATE site_settings SET content_json=? WHERE id=1',[JSON.stringify(value)]);
    }else if(section==='theme'){
      await conn.query('UPDATE site_settings SET theme_json=? WHERE id=1',[JSON.stringify(value)]);
    }else if(section==='philosophy'){
      await conn.query('DELETE FROM philosophy_points');
      for(const [i,p] of value.entries())await conn.query('INSERT INTO philosophy_points (point_text,sort_order) VALUES (?,?)',[p,i]);
    }else if(section==='services'){
      for(const s of value)await conn.query('UPDATE services SET title=?,description=?,images_json=?,videos_json=?,sort_order=? WHERE id=?',[s.title,s.description,JSON.stringify(s.images),JSON.stringify(s.videos),s.sort_order,s.id]);
    }else{
      const kept=[];
      for(const p of value){
        const values=[p.slug,p.title,p.nav_title,p.year,p.challenge,p.services_text,p.role_text,p.live_link,p.sort_order,JSON.stringify(p.media),p.gallery_class];
        const columns='slug,title,nav_title,year,challenge,services_text,role_text,live_link,sort_order,media_json,gallery_class';
        if(p.id){await conn.query(`UPDATE projects SET ${columns.split(',').map(k=>`${k}=?`).join(',')} WHERE id=?`,[...values,p.id]);kept.push(p.id);}
        else{const [r]=await conn.query(`INSERT INTO projects (${columns}) VALUES (${values.map(()=>'?').join(',')})`,values);kept.push(r.insertId);}
      }
      if(kept.length)await conn.query('DELETE FROM projects WHERE id NOT IN (?)',[kept]);else await conn.query('DELETE FROM projects');
    }

}
app.put('/api/admin/document',requireAuth,async(req,res,next)=>{
  let conn;
  try{
    const values=validateDocument(req.body);
    conn=await pool.getConnection();await conn.beginTransaction();
    const [[meta]]=await conn.query('SELECT revision FROM cms_meta WHERE id=1 FOR UPDATE');
    if(req.body.revision!==meta.revision){await conn.rollback();return res.status(409).json({error:'Another session published changes. Your draft is retained. Reload saved content before publishing again.'});}
    const previous=await portfolio(conn);
    await conn.query('INSERT INTO cms_history (section,content) VALUES (?,?)',['document',JSON.stringify(previous)]);
    for(const section of documentSections)await persistSection(conn,section,values[section]);
    await conn.query('UPDATE cms_meta SET revision=revision+1 WHERE id=1');
    const saved=await portfolio(conn);
    await conn.commit();res.json(saved);
  }catch(e){if(conn)await conn.rollback();next(e)}finally{conn?.release();}
});

app.put('/api/admin/:section',requireAuth,async(req,res,next)=>{
  let conn;
  try{
    const section=req.params.section,value=validate(section,req.body);
    conn=await pool.getConnection();await conn.beginTransaction();
    const [[meta]]=await conn.query('SELECT revision FROM cms_meta WHERE id=1 FOR UPDATE');
    if(req.body.revision!==meta.revision){await conn.rollback();return res.status(409).json({error:'Content changed in another session. Reload before saving.'});}
    const previous=await portfolio(conn);
    await conn.query('INSERT INTO cms_history (section,content) VALUES (?,?)',[section,JSON.stringify(previous[section])]);
    await persistSection(conn,section,value);
    await conn.query('UPDATE cms_meta SET revision=revision+1 WHERE id=1');
    await conn.commit();res.json({success:true,revision:meta.revision+1});
  }catch(e){if(conn)await conn.rollback();next(e)}finally{if(conn)conn.release();}
});
app.post('/api/admin/upload',requireAuth,express.raw({type:['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm'],limit:'50mb'}),async(req,res,next)=>{
  try{
    const b=req.body,type=req.headers['content-type'];
    if(!Buffer.isBuffer(b)||!b.length)return res.status(400).json({error:'Choose a JPG, PNG, WebP, GIF, MP4 or WebM file (maximum 50 MB).'});
    const signatures={
      'image/jpeg':()=>b[0]===255&&b[1]===216&&b[2]===255,
      'image/png':()=>b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),
      'image/webp':()=>b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP',
      'image/gif':()=>/^GIF8[79]a/.test(b.toString('ascii',0,6)),
      'video/mp4':()=>b.toString('ascii',4,8)==='ftyp',
      'video/webm':()=>b.subarray(0,4).equals(Buffer.from([26,69,223,163]))};
    if(!signatures[type]?.())return res.status(400).json({error:'The file contents do not match its type.'});
    const ext={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif','video/mp4':'mp4','video/webm':'webm'}[type];
    const filename=`${randomUUID()}.${ext}`;
    try { await fs.promises.writeFile(path.join(uploadDir,filename),b,{flag:'wx'}); } catch {}
    try {
      await pool.query(
        'INSERT INTO cms_uploads (filename, mime_type, data) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE mime_type=VALUES(mime_type), data=VALUES(data)',
        [filename, type, b]
      );
    } catch(err) {
      console.error('Failed to persist upload in DB:', err.message);
    }
    res.status(201).json({url:`/uploads/${filename}`,type:type.startsWith('image/')?'image':'video'});
  }catch(e){next(e)}
});
app.get('/uploads/:filename', async (req, res, next) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  try {
    const [rows] = await pool.query('SELECT mime_type, data FROM cms_uploads WHERE filename = ?', [filename]);
    if (rows && rows[0] && rows[0].data) {
      try { await fs.promises.writeFile(filePath, rows[0].data); } catch {}
      res.setHeader('Content-Type', rows[0].mime_type || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(rows[0].data);
    }
  } catch (err) {
    console.error('Failed to load upload from db:', err.message);
  }
  return res.status(404).json({ error: 'Media file not found' });
});
app.use('/uploads',express.static(uploadDir,{immutable:true,maxAge:'1y'}));
app.use('/api',(req,res)=>res.status(404).json({error:'API route not found'}));
const frontendDist = fs.existsSync(path.join(root, '..', 'dist'))
  ? path.join(root, '..', 'dist')
  : path.join(root, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('/{*path}',(req,res)=>res.sendFile(path.join(frontendDist,'index.html')));
app.use((err,req,res,next)=>{console.error(err.message);res.status(err.status||500).json({error:err.status===400?err.message:err.status===413?'File or request is too large.':'Unable to save or load content. Check the database connection.'});});
if(require.main===module){
  const host = process.env.HOST || '0.0.0.0';
  migrate()
    .then(()=>app.listen(port,host,()=>console.log(`Portfolio API: http://${host}:${port}`)))
    .catch(e=>{
      console.warn('Database startup warning (running in resilient mode):', e.message);
      app.listen(port,host,()=>console.log(`Portfolio API (resilient mode): http://${host}:${port}`));
    });
}
module.exports={app,portfolio,validate,validateDocument};
