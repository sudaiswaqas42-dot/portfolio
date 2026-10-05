// All dimensions are in the original animation's viewBox coordinates.
export function heroTextSlots(cardLeft, cardRight, width, gap=24) {
  return [
    {left:0,width:Math.max(0,cardLeft-gap)},
    {left:cardRight+gap,width:Math.max(0,width-cardRight-gap)},
  ];
}

export function fitHeroText(slot, natural, matrix, targetY) {
  const parentScale=matrix[0];
  if(!parentScale||!natural.width||!natural.height)return null;
  const sx=slot.width/(parentScale*natural.width);
  const sy=233/natural.height;
  return {x:(slot.left-matrix[12])/parentScale-natural.x*sx,y:targetY-natural.y*sy,sx,sy};
}
