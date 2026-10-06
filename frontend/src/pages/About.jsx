import { useContent } from '../utils/content';
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolio } from '../context/PortfolioContext';
import Footer from '../components/Footer';
import CtaSection from '../components/CtaSection';
import StudioScene from '../components/StudioScene';
import BrandMark from '../components/BrandMark';
import { resolveMediaUrl } from '../utils/media';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const content = useContent();
  const { data } = usePortfolio();
  const lottieCircleRef = useRef(null);

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

  const news2Img1 = resolveMediaUrl(about.news2_img1 || '/images/domestika-juan-mora-1.png');
  const news2Img2 = resolveMediaUrl(about.news2_img2 || '/images/domestika2.jpg');
  const news2Img3 = resolveMediaUrl(about.news2_img3 || '/images/domestika-juan-mora-3.png');

  const news3Img1 = resolveMediaUrl(about.news3_img1 || '/images/dont-scroll-down-juanmora1.png');
  const news3Img2 = resolveMediaUrl(about.news3_img2 || '/images/dont-scroll-down-juanmora2.png');

  const renderHeadline = () => {
    const text = headline;
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
    const anim = lottie.loadAnimation({container:lottieCircleRef.current,renderer:'svg',rendererSettings:{preserveAspectRatio:'xMidYMid slice'},loop:false,autoplay:false,path:content('aboutHero.animation')});
    let context;
    const ready=()=>{
      // Lottie clips its entire composition independently of SVG overflow.
      // Let the expanding rings extend all the way to the viewport edges.
      lottieCircleRef.current?.querySelector('svg > g[clip-path]')?.removeAttribute('clip-path');
      context=gsap.context(()=>{
      const frames={value:0};
      gsap.to(frames,{value:anim.totalFrames-1,ease:'none',onUpdate:()=>anim.goToAndStop(frames.value,true),scrollTrigger:{trigger:'.about-scroll-wrapper',start:'top bottom',end:'bottom bottom',scrub:0.8}});
      ScrollTrigger.refresh();
    });};
    anim.addEventListener('DOMLoaded',ready);
    if (anim.isLoaded) ready();
    return ()=>{anim.removeEventListener('DOMLoaded',ready);context?.revert();anim.destroy();};
  }, [data.content?.['aboutHero.animation']]);

  return (
    <main data-barba="container" className="main">

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
                <div className="img-pill-full" style={{backgroundImage:content('aboutHero.pill_image')?`url("${resolveMediaUrl(content('aboutHero.pill_image'))}")`:'none'}}></div>
              </div>
              <div className="about-brand-icon"><BrandMark /></div>
              <div className="blue-dot-hero"></div>
            </div>
            <h1 className="text-headline-about">
              <span className="text-span-5">{content("biography.")}</span>
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
            <div className="big-about-cont" style={{backgroundImage: settings.about_image === '' ? 'none' : `url("${resolveMediaUrl(settings.about_image || '/images/about-juan-mora.jpg')}")`}}>{content('aboutHero.video')&&<video className="cms-background-video" src={resolveMediaUrl(content('aboutHero.video'))} autoPlay loop muted playsInline/>}</div>
          </div>
        </div>
      </section>

      {/* Bio Details Section */}
      </div>
      <section data-nav="grey" className="section">
        <div className="about-bio-wrapper">
          <div className="cont-bio-tem">
            <div className="cont-bio-text">
              <h3 className="headline-bio">{content("biography.who_i_am")}</h3>
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
              <h3 className="headline-bio">{content("biography.approach")}</h3>
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
              <h3 className="headline-bio">{content("biography.philosophy")}</h3>
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
              <h3 className="headline-bio">{content("biography.awards_and")} <br />{content("biography.recognitions")}</h3>
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
            <h3 className="body-copy news">{content("news.news_updates")}</h3>
          </div>
          <div className="line news"></div>

          {/* News 1: Morable Studio */}
          <div className="cont-news-wrapper">
            <div className="cont-headline-news">
              <h3 className="number-news">{content("news.1")}</h3>
              <h3 className="headline-news" style={{ whiteSpace: 'pre-line' }}>{news1Title}</h3>
              <p className="body-copy news">{news1Desc}</p>
              <div className="cont-btn-news">
                <a href={news1Link} target="_blank" rel="noreferrer" className="main-cont-button w-inline-block">
                  <div className="icon-wrapper-cta-first">
                    <img loading="lazy" src={content("news.arrow_grey_out_svg")} alt={content("news.image_description_decorative")} className="arrow-cion" />
                  </div>
                  <div className="text-wrapper-cta">{content('news.button_1')}</div>
                  <div className="icon-wrapper-cta">
                    <img loading="lazy" src={content("news.arrow_grey_out_svg")} alt={content("news.image_description_decorative")} className="arrow-cion" />
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
              <h3 className="number-news">{content("news.2")}</h3>
              <h3 className="headline-news" style={{ whiteSpace: 'pre-line' }}>{news2Title}</h3>
              <p className="body-copy news">{news2Desc}</p>
              <a href={news2Link} target="_blank" rel="noreferrer" className="main-cont-button w-inline-block">
                <div className="icon-wrapper-cta-first">
                  <img loading="lazy" src={content("news.arrow_grey_out_svg")} alt={content("news.image_description_decorative")} className="arrow-cion" />
                </div>
                <div className="text-wrapper-cta">{content('news.button_2')}</div>
                <div className="icon-wrapper-cta">
                  <img loading="lazy" src={content("news.arrow_grey_out_svg")} alt={content("news.image_description_decorative")} className="arrow-cion" />
                </div>
              </a>
            </div>
            <div className="w-layout-layout cont-img-news wf-layout-layout news2-grid" id="w-node-a8cc3bf7-e6a2-d9a3-8dca-598da0ef85fd-63a17526">
              <div className="w-layout-cell cell-2 cell-news-tall" id="w-node-_2d061a88-a9e7-91a1-0cf2-fc7148309172-63a17526">
                <img src={news2Img1} loading="lazy" alt={content("news.image_description_ux_ui_design_a_landing_page")} className="img-news" />
              </div>
              <div className="w-layout-cell cell-news-top-right">
                <img src={news2Img2} loading="lazy" alt={content("news.image_description_heart_drawing_on_laptop")} className="img-news" />
              </div>
              <div className="w-layout-cell cell cell-news-bottom-right">
                <img src={news2Img3} loading="lazy" alt={content("news.image_description_sticky_notes_planning")} className="img-news" />
              </div>
            </div>
          </div>
          <div className="line news"></div>

          {/* News 3: Don't Scroll Down */}
          <div className="cont-news-wrapper" id="news3">
            <div className="cont-headline-news">
              <h3 className="number-news">{content("news.3")}</h3>
              <h3 className="headline-news" style={{ whiteSpace: 'pre-line' }}>{news3Title}</h3>
              <p className="body-copy news">{news3Desc}</p>
              <a href={news3Link} target="_blank" rel="noreferrer" className="main-cont-button w-inline-block">
                <div className="icon-wrapper-cta-first">
                  <img loading="lazy" src={content("news.arrow_grey_out_svg")} alt={content("news.image_description_decorative")} className="arrow-cion" />
                </div>
                <div className="text-wrapper-cta">{content('news.button_3')}</div>
                <div className="icon-wrapper-cta">
                  <img loading="lazy" src={content("news.arrow_grey_out_svg")} alt={content("news.image_description_decorative")} className="arrow-cion" />
                </div>
              </a>
            </div>
            <div className="w-layout-layout cont-img-news wf-layout-layout news3-grid" id="w-node-_6a1ed807-c73e-b900-6403-161fa04ec116-63a17526">
              <div className="w-layout-cell cell-news-half">
                <img src={news3Img1} loading="lazy" alt={content("news.image_description_don_t_scroll_down_preview_1")} className="img-news" />
              </div>
              <div className="w-layout-cell cell-news-half">
                <img src={news3Img2} loading="lazy" alt={content("news.image_description_don_t_scroll_down_preview_2")} className="img-news" />
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
