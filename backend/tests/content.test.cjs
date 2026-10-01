const {test,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {validate}=require('../server/server.cjs');
const pool=require('../server/db.cjs');
const defaults=require('../data/defaults.json');
after(()=>pool.end());
test('all original gallery media exist and preserve ordering',()=>{
 assert.equal(defaults.projects.length,12);
 for(const p of defaults.projects){assert.ok(p.media.length);for(const m of p.media){assert.ok(fs.existsSync('frontend/public'+m.src),m.src);if(m.poster)assert.ok(fs.existsSync('frontend/public'+m.poster),m.poster);}}
});
test('project edits preserve media and reject unsafe links',()=>{
 const p=structuredClone(defaults.projects[0]);
 assert.equal(validate('projects',{projects:[p]})[0].media[0].src,p.media[0].src);
 p.live_link='javascript:alert(1)';assert.throws(()=>validate('projects',{projects:[p]}),/https/);
});
test('duplicate slugs and malformed media are rejected before database writes',()=>{
 const p=structuredClone(defaults.projects[0]);
 assert.throws(()=>validate('projects',{projects:[p,p]}),/unique/);
 p.media[0].type='html';assert.throws(()=>validate('projects',{projects:[p]}),/media type/);
});
test('blank optional fields remain blank',()=>{
 const p={...defaults.projects[0],live_link:'',challenge:'',media:[]};
 const result=validate('projects',{projects:[p]})[0];assert.equal(result.live_link,'');assert.equal(result.challenge,'');assert.deepEqual(result.media,[]);
});
test('settings require a name and valid email',()=>{
 assert.throws(()=>validate('settings',{...defaults.settings,email:'bad'}),/email/);
 assert.throws(()=>validate('settings',{...defaults.settings,first_name:''}),/Name/);
});
test('theme accepts the entire reference palette and all supported modes',()=>{
 const theme=require('../../shared/theme.json');
 for(const mode of ['light','dark','system'])assert.deepEqual(validate('theme',{...theme,mode}),{...theme,mode});
});
test('theme rejects invalid colors and incomplete palettes before saving',()=>{
 const theme=structuredClone(require('../../shared/theme.json'));
 theme.accent.signal='url(https://example.com/image)';
 assert.throws(()=>validate('theme',theme),/Invalid hex color/);
 delete theme.accent.signal;
 assert.throws(()=>validate('theme',theme),/Invalid hex color/);
 assert.throws(()=>validate('theme',{mode:'invalid'}),/theme mode/);
});
test('theme normalizes hex values and ignores unknown CSS properties',()=>{
 const theme=structuredClone(require('../../shared/theme.json'));
 theme.accent.signal='#abcdef';theme.accent.backgroundImage='url(example.com)';
 const result=validate('theme',theme);
 assert.equal(result.accent.signal,'#ABCDEF');
 assert.equal(result.accent.backgroundImage,undefined);
});
