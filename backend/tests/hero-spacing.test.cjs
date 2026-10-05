const {test}=require('node:test');
const assert=require('node:assert/strict');
test('hero keeps the same small gap at left, center, right and between keyframes',async()=>{
 const {heroTextSlots,fitHeroText}=await import('../../frontend/src/utils/heroSpacing.mjs');
 for(let step=0;step<=100;step++){
   const t=step/100,center=512+911*t,half=198+77*Math.sin(t*Math.PI);
   const slots=heroTextSlots(center-half,center+half,1916);
   assert.ok(Math.abs(center-half-slots[0].width-24)<1e-8);
   assert.ok(Math.abs(slots[1].left-center-half-24)<1e-8);
   assert.equal(slots[1].left+slots[1].width,1916);
   for(const slot of slots){
     const natural={x:-3,y:-145,width:590,height:155};
     const matrix=[.52+t,0,0,0,0,1,0,0,0,0,1,0,75,0,0,1];
     const fit=fitHeroText(slot,natural,matrix,-200);
     const renderedLeft=(fit.x+natural.x*fit.sx)*matrix[0]+matrix[12];
     const renderedWidth=natural.width*fit.sx*matrix[0];
     assert.ok(Math.abs(renderedLeft-slot.left)<1e-8);
     assert.ok(Math.abs(renderedWidth-slot.width)<1e-8);
   }
 }
});
