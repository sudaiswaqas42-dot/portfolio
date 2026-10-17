// Keep the authored layout and shaders intact.
// The logo is layered in the back and tilts strictly left/right with cursor movement (no up/down/left/right translation),
// while the animated text and its authentic Perlin wave distortion effect render in front above the logo.
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

      // Lock tilt strictly to horizontal (left/right) without vertical tilting or moving
      if (layer.compiledFragmentShaders && layer.compiledFragmentShaders[0]) {
        layer.compiledFragmentShaders[0] = layer.compiledFragmentShaders[0].replace(
          'vec2 mouseRotOffset = (uMousePos - 0.5) * uAxisTilt * PI * 0.5;',
          'vec2 mouseRotOffset = vec2((uMousePos.x - 0.5) * uAxisTilt * PI * 0.5, 0.0);'
        );

        // Blend distorted text in front of the logo image:
        // The distorted text from the noise effect pass (uBgTexture) is blended on top of the logo,
        // so the logo stays in the background and only tilts horizontally in 3D, while the
        // animated text and its authentic Perlin wave distortion effect render in front above the logo.
        layer.compiledFragmentShaders[0] = layer.compiledFragmentShaders[0].replace(
          'return getOutputByMode(color, background);',
          'vec4 baseBg = vec4(0.9568627, 0.9568627, 0.9568627, 1.0); vec4 logoOnBg = mix(baseBg, color + baseBg * (1.0 - color.a), 1.0); float textAlpha = clamp((0.9568627 - dot(background.rgb, vec3(0.299, 0.587, 0.114))) / (0.9568627 - 0.2078431), 0.0, 1.0); return mix(logoOnBg, background, textAlpha);'
        );
      }
      if (layer.compiledVertexShaders && layer.compiledVertexShaders[0]) {
        layer.compiledVertexShaders[0] = layer.compiledVertexShaders[0].replace(
          'float angleX = uMousePos.y * 0.5 - 0.25;',
          'float angleX = 0.0;'
        );
      }
    }
  }

  return scene;
}
