const {test}=require('node:test');
const assert=require('node:assert/strict');
const template=require('../../frontend/public/documents/studio-scene.json');

test('studio card edits replace the image and all text without changing effect layers',async()=>{
 const {configureStudioScene}=await import('../../frontend/src/utils/studioScene.mjs');
 const values={'studio.logo_image':'/uploads/custom-brand.png','studio.animated_text':'DESIGN WITHOUT LIMITS','studio.top_left':'HELLO','studio.top_center':'WORLD','studio.top_right':'2027'};
 const output=configureStudioScene(template,values);
 const baseline=configureStudioScene(template,{});
 const keys={text:'studio.animated_text',text1:'studio.top_left',text2:'studio.top_right',text3:'studio.top_center'};
 for(let i=0;i<template.history.length;i++){
   const original=template.history[i],expected=structuredClone(baseline.history.find(layer=>layer.id===original.id));
   if(keys[original.id])expected.textContent=values[keys[original.id]];
   if(original.id==='image')expected.src=values['studio.logo_image'];
   assert.deepEqual(output.history.find(layer=>layer.id===original.id),expected);
 }
 assert.deepEqual(output.options,template.options);
 assert.equal(template.history.find(l=>l.id==='text').textContent,'COMING SOON');
 assert.equal(configureStudioScene(template,{'studio.animated_text':''}).history.find(l=>l.id==='text').textContent,'');
});

test('distortion is scoped to transparent text and leaves the background image animation intact',async()=>{
 const {configureStudioScene}=await import('../../frontend/src/utils/studioScene.mjs');
 const output=configureStudioScene(template,{});
 const text=output.history.find(layer=>layer.id==='text');
 const noise=output.history.find(layer=>layer.id==='noise');
 const image=output.history.find(layer=>layer.id==='image');
 assert.deepEqual(text.effects,[noise.parentLayer]);
 assert.ok(noise.parentLayer);
 assert.equal(image.trackMouse, 0);
 assert.ok(image.axisTilt > 0);
 assert.equal(image.data.uniforms.axisTilt.value, image.axisTilt);
 assert.deepEqual(noise.compiledFragmentShaders,template.history.find(layer=>layer.id==='noise').compiledFragmentShaders);
 assert.equal(text.data.compositeShader.fragmentShader,template.history.find(layer=>layer.id==='text').compiledFragmentShaders[0]);
});

test('studio text and distortion render in front above the background logo',async()=>{
 const {configureStudioScene}=await import('../../frontend/src/utils/studioScene.mjs');
 const original=structuredClone(template);
 const output=configureStudioScene(template,{});
 assert.deepEqual(output.history.map(layer=>layer.id),['gradient','image','text','noise','text1','text2','text3','halftone']);
 assert.deepEqual(template,original);
 assert.deepEqual(configureStudioScene(output,{}),output);
 const layered={layers:structuredClone(template.history)};
 assert.deepEqual(configureStudioScene(layered,{}).layers,output.history);
 assert.deepEqual(configureStudioScene({layers:[]},{}),{layers:[]});
});
