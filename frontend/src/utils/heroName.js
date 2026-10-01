// Keep the authored Lottie transforms, mask and moving project preview intact.
// Only replace the two static letter outlines inside their animated layers.
export function bindHeroName(container, names, layouts = []) {
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = "600 200px Goga, Arial, sans-serif";
  names.forEach((name, index) => {
    const layer = container.querySelector(`.hero-name-${index}`);
    if (!layer) return;
    const bounds = layer.getBBox();
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const text = document.createElementNS(group.namespaceURI, "text");
    text.textContent = name.toUpperCase();
    text.setAttribute("font-family", "Goga, Arial, sans-serif");
    text.setAttribute("font-weight", "600");
    text.setAttribute("font-size", "200");
    text.setAttribute("fill", "var(--signal-tint)");
    group.appendChild(text);
    const sweep = text.cloneNode(true);
    sweep.setAttribute("fill", "var(--signal)");
    sweep.classList.add("hero-name-fill");
    group.appendChild(sweep);
    layer.appendChild(group);
    const metrics = measure.measureText(text.textContent);
    // SVG getBBox includes font ascent/descent space in Chromium. Measure visible
    // glyph ink so the letters and the preview share the exact 200-unit height.
    const natural = {
      x: -metrics.actualBoundingBoxLeft,
      y: -metrics.actualBoundingBoxAscent,
      width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
      height:
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
    };
    if (natural.width && natural.height) {
      const sx = bounds.width / natural.width;
      const sy = 200 / natural.height;
      const targetY = layouts[index]
        ? 16 - layouts[index].positionY + layouts[index].anchorY
        : bounds.y;
      group.setAttribute(
        "transform",
        `translate(${bounds.x - natural.x * sx} ${targetY - natural.y * sy}) scale(${sx} ${sy})`,
      );
    }
    for (const child of layer.children)
      if (child !== group) child.style.display = "none";
  });
}
