const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const template=require('../../frontend/public/documents/juan-name-mouse.json');
const catalog=require('../../shared/contentCatalog.json');

test('hero card defaults preserve the exact original images in cursor order',async()=>{
 const {heroCardAssets}=await import('../../frontend/src/utils/heroCards.mjs');
 heroCardAssets.forEach((id,i)=>{
   const asset=template.assets.find(a=>a.id===id);
   const file='frontend/public'+catalog[`hero.card_${i+1}`].value;
   assert.deepEqual(fs.readFileSync(file),Buffer.from(asset.p.split(',')[1],'base64'));
 });
});
test('hero image edits preserve all animation layers, timings, dimensions and masks',async()=>{
 const {configureHeroCards,heroCardAssets}=await import('../../frontend/src/utils/heroCards.mjs');
 const images=['/uploads/one.png','https://example.com/two.jpg','/uploads/three.webp','/uploads/four.gif'];
 const result=configureHeroCards(template,images);
 const expected=structuredClone(template);
 heroCardAssets.forEach((id,i)=>Object.assign(expected.assets.find(a=>a.id===id),{p:images[i],u:'',e:1}));
 assert.deepEqual(result,expected);
 assert.deepEqual(configureHeroCards(template,['','','','']),template);
 assert.ok(template.assets.find(a=>a.id==='image_0').p.startsWith('data:image/jpeg;base64,'));
});
