// Only change editable layer content. Keep the authored distortion, halftone,
// mouse interaction, layout and compiled shaders byte-for-byte intact.
export function configureStudioScene(template, values) {
  const scene=structuredClone(template);
  const textFields={text:'studio.animated_text',text1:'studio.top_left',text2:'studio.top_right',text3:'studio.top_center'};
  for(const layer of scene.layers||scene.history||[]) {
    const key=textFields[layer.id];
    if(layer.layerType==='text'&&key&&typeof values[key]==='string')layer.textContent=values[key];
    if(layer.layerType==='image'&&layer.id==='image'&&typeof values['studio.logo_image']==='string')layer.src=values['studio.logo_image'];
  }
  return scene;
}
