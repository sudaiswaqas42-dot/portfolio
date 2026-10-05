const {test}=require('node:test');
const assert=require('node:assert/strict');
const template=require('../../frontend/public/documents/studio-scene.json');
test('studio card edits replace the image and all text without changing effect layers',async()=>{
 const {configureStudioScene}=await import('../../frontend/src/utils/studioScene.mjs');
 const values={'studio.logo_image':'/uploads/custom-brand.png','studio.animated_text':'DESIGN WITHOUT LIMITS','studio.top_left':'HELLO','studio.top_center':'WORLD','studio.top_right':'2027'};
 const output=configureStudioScene(template,values);
 const keys={text:'studio.animated_text',text1:'studio.top_left',text2:'studio.top_right',text3:'studio.top_center'};
 for(let i=0;i<template.history.length;i++){
   const original=template.history[i],expected=structuredClone(original);
   if(keys[original.id])expected.textContent=values[keys[original.id]];
   if(original.id==='image')expected.src=values['studio.logo_image'];
   assert.deepEqual(output.history[i],expected);
 }
 assert.deepEqual(output.options,template.options);
 assert.equal(template.history.find(l=>l.id==='text').textContent,'COMING SOON');
 assert.equal(configureStudioScene(template,{'studio.animated_text':''}).history.find(l=>l.id==='text').textContent,'');
});
