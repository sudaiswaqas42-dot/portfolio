import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolio } from '../context/PortfolioContext';
import Footer from '../components/Footer';
import CtaSection from '../components/CtaSection';
import StudioScene from '../components/StudioScene';
import BrandMark from '../components/BrandMark';
import { themeColors } from '../utils/theme';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { data } = usePortfolio();
  const lottieCircleRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef(null);
  const introRef = useRef(null);
  const lineRef = useRef(null);

  const about = data?.about || {};
  const settings = data?.settings || {};
  const email = settings?.email || 'sudais@morable.co';

  const headline = about.headline ?? '';
  const whoIAm = about.who_i_am ?? '';
  const approach = about.approach ?? '';
  const philosophy = about.philosophy ?? '';
  const awards = about.awards ?? '';

  const news1Title = about.news1_title ?? '';
  const news1Desc = about.news1_desc ?? '';
  const news1Link = about.news1_link ?? '';

  const news2Title = about.news2_title ?? '';
  const news2Desc = about.news2_desc ?? '';
  const news2Link = about.news2_link ?? '';

  const news3Title = about.news3_title ?? '';
  const news3Desc = about.news3_desc ?? '';
  const news3Link = about.news3_link ?? '';

  const news2Img1 = about.news2_img1 || '/images/domestika-juan-mora-1.png';
  const news2Img2 = about.news2_img2 || '/images/domestika2.jpg';
  const news2Img3 = about.news2_img3 || '/images/domestika-juan-mora-3.png';

  const news3Img1 = about.news3_img1 || '/images/dont-scroll-down-juanmora1.png';
  const news3Img2 = about.news3_img2 || '/images/dont-scroll-down-juanmora2.png';

  // Intro Page Loader Animation (matching Home Page)
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setLoading(false);
      return;
    }

    const colors = themeColors(data.theme);
    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: 'left' })
      .to(introRef.current, { yPercent: -100, duration: 0.7, delay: 0.1 })
      .to(loaderRef.current, {
        height: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        onComplete: () => setLoading(false)
      })
      .fromTo(
        '.pill-hero-about-wrapper',
        { scale: 0.65, rotation: -15, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.3'
      )
      .fromTo(
        '.about-hero-word',
        { color: colors.signal, opacity: 0.85 },
        {
          color: colors['text-secondary'],
          opacity: 1,
          duration: 0.65,
          stagger: 0.12,
          ease: 'power2.out',
          onComplete: () => gsap.set('.about-hero-word', { clearProps: 'color,opacity' })
        },
        '-=0.4'
      );

    const fallback = window.setTimeout(() => setLoading(false), 2000);
    return () => {
      window.clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  const renderHeadline = () => {
    const text = headline || 'Designer based in Miami, working globally';
    if (text === 'Designer based in Miami, working globally') {
      return (
        <>
          <span className="about-hero-line"><span className="about-hero-word">Designer</span></span><br />
          <span className="about-hero-line"><span className="about-hero-word">based</span>{' '}<span className="about-hero-word">in</span>{' '}<span className="about-hero-word">Miami,</span></span><br />
          <span className="about-hero-line"><span className="about-hero-word">working</span>{' '}<span className="about-hero-word">globally</span></span>
        </>
      );
    }
    const lines = text.split('\n');
    return lines.map((line, li) => (
      <React.Fragment key={li}>
        <span className="about-hero-line">
          {line.split(' ').map((word, wi) => (
            <React.Fragment key={wi}>
              <span className="about-hero-word">{word}</span>{' '}
            </React.Fragment>
          ))}
        </span>
        {li < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  useEffect(() => {
    const anim = lottie.loadAnimation({container:lottieCircleRef.current,renderer:'svg',rendererSettings:{preserveAspectRatio:'xMidYMid slice'},loop:false,autoplay:false,path:'/documents/circles-about.json'});
    let context;
    const ready=()=>{context=gsap.context(()=>{
      const frames={value:0};
      gsap.to(frames,{value:anim.totalFrames-1,ease:'none',onUpdate:()=>anim.goToAndStop(frames.value,true),scrollTrigger:{trigger:'.about-scroll-wrapper',start:'top bottom',end:'bottom bottom',scrub:0.8}});
      ScrollTrigger.refresh();
    });};
    anim.addEventListener('DOMLoaded',ready);
    if (anim.isLoaded) ready();
    return ()=>{anim.removeEventListener('DOMLoaded',ready);context?.revert();anim.destroy();};
  }, []);

  return (
    <main data-barba="container" className="main">
      {/* Intro Page Loader */}
      {loading && (
        <div
          ref={loaderRef}
          className="container-loader"
          aria-hidden="true"
          style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 10000 }}
        >
          <div ref={introRef} className="orange-intro">
            <div className="cont-juan-intro">
              <div className="nav-name-jm intro">{settings.first_name || 'Sudais'}</div>
              <div className="dot-jm intro" />
              <div className="nav-name-jm intro">{settings.last_name || 'Waqas'}</div>
            </div>
          </div>
          <div ref={lineRef} className="grow-line" />
        </div>
      )}

      <div className="top-glow">
        <div className="blur"></div>
      </div>

      {/* Hero Pill & Headline */}
      <div className="about-intro-flow">
      <section data-nav="grey" className="section">
        <div className="hero-about-wrapper">
          <div className="wrapper-cont-50 _70">
            <div className="pill-hero-about-wrapper">
              <div className="img-pill-mask">
                <div className="img-pill-full"></div>
              </div>
              <div className="about-brand-icon"><BrandMark /></div>
              <div className="blue-dot-hero"></div>
            </div>
            <h1 className="text-headline-about">
              <span className="text-span-5">----</span>
              {renderHeadline()}
            </h1>
          </div>
        </div>
      </section>

      <section data-nav="peach" className="section">
        <div className="about-scroll-wrapper">
          <div className="sticky-cont-about">
            <div className="circle-lottie-cont"><div ref={lottieCircleRef} className="lottie-circles" /></div>
            <div className="cont-shine-mask"><div className="glow-orange" /></div>
            <div className="big-about-cont" style={settings.about_image ? {backgroundImage: `url(${settings.about_image})`} : undefined} />
          </div>
        </div>
      </section>

      {/* Bio Details Section */}
      </div>
      <section data-nav="grey" className="section">
        <div className="about-bio-wrapper">
          <div className="cont-bio-tem">
            <div className="cont-bio-text">
              <h3 className="headline-bio">Who I Am</h3>
            </div>
            <div className="cont-bio-text right">
              {whoIAm.split(/\n\s*\n/).filter(Boolean).map((para, i) => (
                <p key={i} className="body-copy">{para}</p>
              ))}
            </div>
          </div>
          <div className="line about"></div>

          <div className="cont-bio-tem">
            <div className="cont-bio-text">
              <h3 className="headline-bio">Approach</h3>
            </div>
            <div className="cont-bio-text right">
              {approach.split(/\n\s*\n/).filter(Boolean).map((para, i) => (
                <p key={i} className="body-copy">{para}</p>
              ))}
            </div>
          </div>
          <div className="line about"></div>

          <div className="cont-bio-tem">
            <div className="cont-bio-text">
              <h3 className="headline-bio">Philosophy</h3>
            </div>
            <div className="cont-bio-text right">
              {philosophy.split(/\n\s*\n/).filter(Boolean).map((para, i) => (
                <p key={i} className="body-copy">{para}</p>
              ))}
            </div>
          </div>
          <div className="line about"></div>

          <div className="cont-bio-tem">
            <div className="cont-bio-text">
              <h3 className="headline-bio">Awards and <br />Recognitions</h3>
            </div>
            <div className="cont-bio-text right awards-list">
              {awards.split(/\n+/).filter(Boolean).map((para, i) => (
                <p key={i} className="body-copy">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section data-nav="peach" className="section">
        <div className="about-news-wrapper">
          <div className="news-cont-top">
            <div className="square-news"></div>
            <h3 className="body-copy news">News &amp; Updates</h3>
          </div>
          <div className="line news"></div>

          {/* News 1: Morable Studio */}
          <div className="cont-news-wrapper">
            <div className="cont-headline-news">
              <h3 className="number-news">1</h3>
              <h3 className="headline-news" style={{ whiteSpace: 'pre-line' }}>{news1Title}</h3>
              <p className="body-copy news">{news1Desc}</p>
              <div className="cont-btn-news">
                <a href={news1Link} target="_blank" rel="noreferrer" className="main-cont-button w-inline-block">
                  <div className="icon-wrapper-cta-first">
                    <img loading="lazy" src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                  </div>
                  <div className="text-wrapper-cta">Learn more</div>
                  <div className="icon-wrapper-cta">
                    <img loading="lazy" src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                  </div>
                </a>
              </div>
            </div>
            <StudioScene />
          </div>
          <div className="line news"></div>

          {/* News 2: Domestika Course */}
          <div className="cont-news-wrapper" id="news2">
            <div className="cont-headline-news">
              <h3 className="number-news">2</h3>
              <h3 className="headline-news" style={{ whiteSpace: 'pre-line' }}>{news2Title}</h3>
              <p className="body-copy news">{news2Desc}</p>
              <a href={news2Link} target="_blank" rel="noreferrer" className="main-cont-button w-inline-block">
                <div className="icon-wrapper-cta-first">
                  <img loading="lazy" src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                </div>
                <div className="text-wrapper-cta">Learn more</div>
                <div className="icon-wrapper-cta">
                  <img loading="lazy" src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                </div>
              </a>
            </div>
            <div className="w-layout-layout cont-img-news wf-layout-layout news2-grid" id="w-node-a8cc3bf7-e6a2-d9a3-8dca-598da0ef85fd-63a17526">
              <div className="w-layout-cell cell-2 cell-news-tall" id="w-node-_2d061a88-a9e7-91a1-0cf2-fc7148309172-63a17526">
                <img src={news2Img1} loading="lazy" alt="UX/UI Design a Landing Page" className="img-news" />
              </div>
              <div className="w-layout-cell cell-news-top-right">
                <img src={news2Img2} loading="lazy" alt="Heart drawing on laptop" className="img-news" />
              </div>
              <div className="w-layout-cell cell cell-news-bottom-right">
                <img src={news2Img3} loading="lazy" alt="Sticky notes planning" className="img-news" />
              </div>
            </div>
          </div>
          <div className="line news"></div>

          {/* News 3: Don't Scroll Down */}
          <div className="cont-news-wrapper" id="news3">
            <div className="cont-headline-news">
              <h3 className="number-news">3</h3>
              <h3 className="headline-news" style={{ whiteSpace: 'pre-line' }}>{news3Title}</h3>
              <p className="body-copy news">{news3Desc}</p>
              <a href={news3Link} target="_blank" rel="noreferrer" className="main-cont-button w-inline-block">
                <div className="icon-wrapper-cta-first">
                  <img loading="lazy" src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                </div>
                <div className="text-wrapper-cta">Learn more</div>
                <div className="icon-wrapper-cta">
                  <img loading="lazy" src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                </div>
              </a>
            </div>
            <div className="w-layout-layout cont-img-news wf-layout-layout news3-grid" id="w-node-_6a1ed807-c73e-b900-6403-161fa04ec116-63a17526">
              <div className="w-layout-cell cell-news-half">
                <img src={news3Img1} loading="lazy" alt="Don't scroll down preview 1" className="img-news" />
              </div>
              <div className="w-layout-cell cell-news-half">
                <img src={news3Img2} loading="lazy" alt="Don't scroll down preview 2" className="img-news" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaSection about />

      <Footer />
    </main>
  );
}
