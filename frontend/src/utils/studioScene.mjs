// Keep the authored layout and shaders, with the animated text above the logo.
export function configureStudioScene(template, values) {
  const scene=structuredClone(template);
  const textFields={text:'studio.animated_text',text1:'studio.top_left',text2:'studio.top_right',text3:'studio.top_center'};
  const layers=scene.layers||scene.history||[];
  for(const layer of layers) {
    const key=textFields[layer.id];
    if(layer.layerType==='text'&&key&&typeof values[key]==='string')layer.textContent=values[key];
    if(layer.layerType==='image'&&layer.id==='image'&&typeof values['studio.logo_image']==='string')layer.src=values['studio.logo_image'];
  }
  const textIndex=layers.findIndex(layer=>layer.id==='text'&&layer.layerType==='text');
  const imageIndex=layers.findIndex(layer=>layer.id==='image'&&layer.layerType==='image');
  // The scene paints back to front. Keep text and its following distortion
  // together, above the image and below the captions and final halftone pass.
  if(textIndex!==-1&&imageIndex>textIndex) {
    const [image]=layers.splice(imageIndex,1);
    layers.splice(textIndex,0,image);
  }
  const text=layers.find(layer=>layer.id==='text'&&layer.layerType==='text');
  const distortion=layers.find(layer=>layer.id==='noise'&&layer.layerType==='effect');
  if(text&&distortion&&!distortion.parentLayer) {
    // A global distortion warps everything already painted, including the logo.
    // Unicorn child effects sample only the parent's transparent text texture;
    // the composite then places that result over the untouched image pass.
    distortion.parentLayer='studio-text-distortion';
    text.effects=[...(text.effects||[]),distortion.parentLayer];
    text.data={...text.data,compositeShader:{
      vertexShader:text.compiledVertexShaders[0],
      fragmentShader:text.compiledFragmentShaders[0],
    },compositeUniforms:{
      resolution:{name:'uResolution',type:'2f',value:{type:'Vec2',_x:1440,_y:900}},
      mousePos:{name:'uMousePos',type:'2f',value:{type:'Vec2',_x:0.5,_y:0.5}},
    }};
  }
  return scene;
}
