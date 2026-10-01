const fs = require('node:fs');
const path = require('node:path');
const pool = require('../server/db.cjs');
(async () => {
  fs.mkdirSync('scratch/before-repair', { recursive: true });
  for (const file of ['src', 'server', 'index.html', 'package.json', 'vite.config.js']) {
    fs.cpSync(file, path.join('scratch/before-repair', file), { recursive: true, force: false });
  }
  const data = {};
  for (const table of ['site_settings','services','philosophy_points','projects','about_content']) {
    [data[table]] = await pool.query(`SELECT * FROM ${table}`);
  }
  fs.writeFileSync('scratch/before-repair/content.json', JSON.stringify(data, null, 2));
  const source = fs.readFileSync('src/pages/Work.jsx','utf8');
  const starts = [...source.matchAll(/<div id="([^"]+)" className="main-project-wrapper">/g)];
  const galleries = {};
  const attr = (s, name) => s.match(new RegExp('(?:^|\\s)' + name + '="([^"]*)"'))?.[1] || '';
  for (let i=0;i<starts.length;i++) {
    const block = source.slice(starts[i].index, starts[i+1]?.index || source.indexOf('<Footer'));
    const gallery = block.slice(block.indexOf('<div className="cont-project-imgs'));
    const media = [];
    const matches = gallery.matchAll(/<img\b[^>]*\/>|<div\b[^>]*className="video-cont-p2[^"]*"[^>]*>\s*<div[^>]*>\s*<video\b[\s\S]*?<\/video>/g);
    for (const m of matches) {
      const video = m[0].includes('<video');
      media.push({type:video?'video':'image',src:attr(m[0], 'src'),alt:attr(m[0],'alt'),className:attr(m[0],'className'),id:attr(m[0],'id'),poster:attr(m[0],'poster'),srcSet:attr(m[0],'srcSet')});
    }
    galleries[starts[i][1]] = {gallery_class: attr(gallery,'className'), media};
  }
  const projects = data.projects.map(p=>({...p,...galleries[p.slug]}));
  const defaults = {settings:data.site_settings[0],services:data.services.map(s=>({...s,images:JSON.parse(s.images_json||'[]'),videos:JSON.parse(s.videos_json||'[]')})),philosophy:data.philosophy_points.map(p=>p.point_text),projects,about:data.about_content[0]};
  fs.mkdirSync('src/data',{recursive:true});
  fs.writeFileSync('src/data/defaults.json',JSON.stringify(defaults,null,2));
  console.log('Backed up existing source and content. Extracted galleries:',projects.map(p=>`${p.slug}: ${p.media.length}`).join(', '));
  await pool.end();
})().catch(e=>{console.error(e);process.exit(1)});
