// Keep the authored Lottie transforms, mask and moving project preview intact.
// Only replace the two static letter outlines inside their animated layers.
import {heroTextSlots,fitHeroText} from './heroSpacing.mjs';
export function bindHeroName(container, names, layouts = [], animation, animationData) {
  const bindings=[];
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = "600 200px Goga, Arial, sans-serif";
  names.forEach((name, index) => {
    const layer = container.querySelector(`.hero-name-${index}`);
    if (!layer) return;
    const bounds = layer.getBBox();
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const text = document.createElementNS(group.namespaceURI, "text");
    text.textContent = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    text.setAttribute("font-family", "Goga, Arial, sans-serif");
    text.setAttribute("font-weight", "600");
    text.setAttribute("font-size", "200");
    text.setAttribute("fill", "var(--signal-tint)");
    group.appendChild(text);
    layer.appendChild(group);
    const metrics = measure.measureText(text.textContent);
    // SVG getBBox includes font ascent/descent space in Chromium. Measure visible
    // glyph ink so the letters and the preview share the exact 233-unit height.
    const natural = {
      x: -metrics.actualBoundingBoxLeft,
      y: -metrics.actualBoundingBoxAscent,
      width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      height:
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };
    if (natural.width && natural.height) {
      const sx = bounds.width / natural.width;
      const sy = 233 / natural.height;
      const targetY = layouts[index]
        ? -layouts[index].positionY + layouts[index].anchorY
        : bounds.y;
      group.setAttribute(
        "transform",
        `translate(${bounds.x - natural.x * sx} ${targetY - natural.y * sy}) scale(${sx} ${sy})`,
      );
      bindings.push({index,group,natural,targetY});
    }
    for (const child of layer.children)
      if (child !== group) child.style.display = "none";
  });
  // Fit against the actual rendered matte on every frame, including its nested
  // rectangle transform. This avoids percentage-based gaps widening at center.
  const matteIndex=animationData.layers.findIndex(layer=>layer.nm==='Mask');
  const shapes=animationData.layers[matteIndex].shapes[0].it;
  const rect=shapes.find(shape=>shape.ty==='rc');
  const transform=shapes.find(shape=>shape.ty==='tr');
  const localCenter=transform.p.k[0]+(rect.p.k[0]-transform.a.k[0])*transform.s.k[0]/100;
  const halfWidth=rect.s.k[0]*transform.s.k[0]/200;
  return ()=>{
    const elements=animation.renderer.elements;
    const matte=elements[matteIndex]?.finalTransform?.mat?.props;
    if(!matte)return;
    const left=(localCenter-halfWidth)*matte[0]+matte[12];
    const right=(localCenter+halfWidth)*matte[0]+matte[12];
    const slots=heroTextSlots(left,right,animationData.w);
    for(const {index,group,natural,targetY} of bindings){
      const matrix=elements[index]?.finalTransform?.mat?.props;
      if(!matrix)continue;
      const fit=fitHeroText(slots[index],natural,matrix,targetY);
      if(fit)group.setAttribute('transform',`translate(${fit.x} ${fit.y}) scale(${fit.sx} ${fit.sy})`);
    }
  };
}
