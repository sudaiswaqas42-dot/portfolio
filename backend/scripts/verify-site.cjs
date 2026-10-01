const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const base='http://127.0.0.1:5000';
 for(const route of ['/','/about','/work','/login','/admin','/index.html','/about.html','/work.html']){
  const r=await fetch(base+route);assert.equal(r.status,200,route);assert.match(await r.text(),/id="root"/,route);
 }
 const content=await (await fetch(base+'/api/portfolio')).json();
 const urls=new Set();
 function walk(v){if(typeof v==='string'&&/^\/(images|videos-work|uploads)\//.test(v)&&!v.includes(','))urls.add(v);else if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')Object.values(v).forEach(walk);}
 walk(content);
 function sources(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())sources(p);else if(/\.(jsx|js|css)$/.test(p)){const s=fs.readFileSync(p,'utf8');for(const m of s.matchAll(/["'`](\/(?:images|documents|videos-work|js)\/[^"'`\s$]+)["'`]/g))urls.add(m[1]);}}}
 sources('frontend/src');
 const queue=[...urls];let checked=0;
 await Promise.all(Array.from({length:6},async()=>{while(queue.length){const url=queue.pop();const r=await fetch(base+url,{method:'HEAD'});assert.equal(r.status,200,url);assert.ok(!r.headers.get('content-type')?.includes('text/html'),url);checked++;}}));
 console.log(`PASS: 8 production routes, ${content.projects.length} projects, ${checked} referenced assets served correctly.`);
})().catch(e=>{console.error(e);process.exitCode=1});
