// The authored layers appear in reverse asset order as the cursor moves right.
export const heroCardAssets = ['image_3', 'image_2', 'image_1', 'image_0'];

export function configureHeroCards(template, images) {
  const animation=structuredClone(template);
  heroCardAssets.forEach((id,index)=>{
    const asset=animation.assets?.find(item=>item.id===id);
    // Clearing an override restores the embedded original; never remove a card.
    if(asset&&images[index])Object.assign(asset,{p:images[index],u:'',e:1});
  });
  return animation;
}
