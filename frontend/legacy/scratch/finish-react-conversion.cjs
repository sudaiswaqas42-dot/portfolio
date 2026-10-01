const fs=require('node:fs');
let html=fs.readFileSync('index.html','utf8');
html=html.replace(/  <script src=[^\n]+\n/g,'').replace(/  <style>[\s\S]*?<\/style>/,'');
fs.writeFileSync('index.html',html);
let about=fs.readFileSync('src/pages/About.jsx','utf8');
const start=about.indexOf('  useEffect(() => {');
const end=about.indexOf('\n  return (',start);
about=about.slice(0,start)+`  useEffect(() => {
    const anim = lottie.loadAnimation({container:lottieCircleRef.current,renderer:'svg',loop:false,autoplay:false,path:'/documents/circles-about.json'});
    let context;
    const ready=()=>{context=gsap.context(()=>{
      const frames={value:0};
      gsap.to(frames,{value:anim.totalFrames-1,ease:'none',onUpdate:()=>anim.goToAndStop(frames.value,true),scrollTrigger:{trigger:'.about-scroll-wrapper',start:'top bottom',end:'bottom top',scrub:true}});
      ScrollTrigger.refresh();
    });};
    anim.addEventListener('DOMLoaded',ready);
    return ()=>{anim.removeEventListener('DOMLoaded',ready);context?.revert();anim.destroy();};
  }, []);
`+about.slice(end);
const a=about.indexOf('      {/* Sticky Scroll');
const b=about.indexOf('      {/* Bio Details',a);
about=about.slice(0,a)+`      <section className="section">
        <div className="about-scroll-wrapper">
          <div className="sticky-cont-about">
            <div className="circle-lottie-cont"><div ref={lottieCircleRef} className="lottie-circles" /></div>
            <div className="cont-shine-mask"><div className="glow-orange" /></div>
            <div className="big-about-cont" style={settings.about_image ? {backgroundImage: \`url(\${settings.about_image})\`} : undefined} />
          </div>
        </div>
      </section>
\n`+about.slice(b);
about=about.replace(' style={{ overflowX: \'hidden\' }}','');
fs.writeFileSync('src/pages/About.jsx',about);
const pkg=JSON.parse(fs.readFileSync('package.json'));
pkg.scripts={...pkg.scripts,dev:'node scripts/dev.cjs','dev:client':'vite','dev:server':'node --watch server/server.cjs',start:'node server/server.cjs','db:init':'node server/init_db.cjs',test:'node --test tests/*.test.cjs'};
fs.writeFileSync('package.json',JSON.stringify(pkg,null,2)+'\n');
