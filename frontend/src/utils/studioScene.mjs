// Keep the authored distortion, halftone, layout and compiled shaders intact.
// The logo tilts in 3D with cursor movement without position translation or noise warp,
// exactly matching Juan Mora's original site design.
export function configureStudioScene(template, values) {
  const scene = structuredClone(template);
  const textFields = {
    text: 'studio.animated_text',
    text1: 'studio.top_left',
    text2: 'studio.top_right',
    text3: 'studio.top_center'
  };
  const layers = scene.layers || scene.history || [];
  for (const layer of layers) {
    const key = textFields[layer.id];
    if (layer.layerType === 'text' && key && typeof values[key] === 'string') {
      layer.textContent = values[key];
    }
    if (layer.layerType === 'image' && layer.id === 'image') {
      if (typeof values['studio.logo_image'] === 'string') {
        layer.src = values['studio.logo_image'];
      }
      // Ensure 3D perspective tilt is active (rotates left/right with cursor)
      // while position translation (trackMouse) is disabled so it doesn't move.
      const tilt = layer.axisTilt || 0.28;
      layer.axisTilt = tilt;
      layer.trackMouse = 0;
      if (!layer.data) layer.data = { uniforms: {} };
      if (!layer.data.uniforms) layer.data.uniforms = {};
      layer.data.uniforms.axisTilt = {
        name: 'uAxisTilt',
        type: '1f',
        value: tilt
      };
      if (layer.data.uniforms.left) {
        layer.data.uniforms.left.value = layer.left ?? 0.5;
      }
    }
  }
  return scene;
}
