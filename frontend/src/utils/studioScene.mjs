// Keep the authored layout and shaders intact.
// The logo is layered in the back and tilts in 3D with cursor movement,
// while the animated text and wave distortion render in front above the logo.
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
      // Ensure 3D perspective axis tilt is active so it tilts left/right with cursor
      // while position translation (trackMouse) is disabled so it stays anchored.
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
      if (Array.isArray(layer.breakpoints)) {
        for (const bp of layer.breakpoints) {
          if (bp.props) {
            if (bp.name === 'Desktop') bp.props.axisTilt = tilt;
            if (bp.name === 'Tablet') bp.props.axisTilt = tilt;
          }
        }
      }
    }
  }

  // The scene paints back to front. Place the logo in the background
  // and keep text + distortion in the foreground above the logo.
  const textIndex = layers.findIndex(layer => layer.id === 'text' && layer.layerType === 'text');
  const imageIndex = layers.findIndex(layer => layer.id === 'image' && layer.layerType === 'image');
  if (textIndex !== -1 && imageIndex > textIndex) {
    const [image] = layers.splice(imageIndex, 1);
    layers.splice(textIndex, 0, image);
  }

  // Scope the distortion effect to the text layer so the wave distortion renders
  // in front with the text without warping the background logo.
  const text = layers.find(layer => layer.id === 'text' && layer.layerType === 'text');
  const distortion = layers.find(layer => layer.id === 'noise' && layer.layerType === 'effect');
  if (text && distortion && !distortion.parentLayer) {
    distortion.parentLayer = 'studio-text-distortion';
    text.effects = [...(text.effects || []), distortion.parentLayer];
    text.data = {
      ...text.data,
      compositeShader: {
        vertexShader: text.compiledVertexShaders[0],
        fragmentShader: text.compiledFragmentShaders[0],
      },
      compositeUniforms: {
        resolution: { name: 'uResolution', type: '2f', value: { type: 'Vec2', _x: 1440, _y: 900 } },
        mousePos: { name: 'uMousePos', type: '2f', value: { type: 'Vec2', _x: 0.5, _y: 0.5 } },
      }
    };
  }

  return scene;
}
