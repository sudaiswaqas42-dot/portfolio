import { useContent } from '../utils/content';
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { usePortfolio } from '../context/PortfolioContext';
import { bindHeroName } from '../utils/heroName';
import { configureHeroCards } from '../utils/heroCards.mjs';
import { resolveMediaUrl } from '../utils/media';

export default function Hero() {
  const content = useContent();
  const { data } = usePortfolio();
  const s = data.settings || {};
  const cardImages=[1,2,3,4].map(index=>resolveMediaUrl(content(`hero.card_${index}`)));
  const cardSignature=JSON.stringify(cardImages);

  const heroWrapperRef = useRef(null);
  const lottieContainerRef = useRef(null);
  const animRef = useRef(null);

  // 1. Initialize Hero Mouse Lottie Animation
  useEffect(() => {
    let anim;
    let fitNames;
    let live = true;
    const controller = new AbortController();
    const load = async () => {
      const response = await fetch('/documents/juan-name-mouse.json', { signal: controller.signal });
      const animationData = configureHeroCards(await response.json(),JSON.parse(cardSignature));
      await document.fonts.ready;
      if (!live || !lottieContainerRef.current) return;
      animationData.layers[0].cl = 'hero-name-0';
      animationData.layers[1].cl = 'hero-name-1';

      anim = lottie.loadAnimation({
        container: lottieContainerRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData
      });

      anim.addEventListener('DOMLoaded', () => {
        fitNames=bindHeroName(
          lottieContainerRef.current,
          [s.first_name ?? 'Sudais', s.last_name ?? ''],
          animationData.layers.slice(0, 2).map(layer => ({ anchorY: layer.ks.a.k[1], positionY: layer.ks.p.k[0].s[1] })),
          anim,animationData
        );
        // Set to middle frame initially
        const mid = Math.floor((anim.totalFrames || 60) / 2);
        anim.goToAndStop(mid, true);
        fitNames?.();
      });

      animRef.current = anim;
    };
    load().catch(error => { if (error.name !== 'AbortError') console.error('Hero animation:', error); });

    // Mouse Tracking across Hero Wrapper
    let currentProgress = 0.5;
    let targetProgress = 0.5;
    let rafId;

    const updateLottie = () => {
      // Smooth lerp for liquid responsiveness
      currentProgress += (targetProgress - currentProgress) * 0.12;
      if (animRef.current && animRef.current.totalFrames) {
        const total = animRef.current.totalFrames;
        const frame = Math.max(0, Math.min(total - 1, currentProgress * (total - 1)));
        animRef.current.goToAndStop(frame, true);
        fitNames?.();
      }
      rafId = requestAnimationFrame(updateLottie);
    };
    rafId = requestAnimationFrame(updateLottie);

    const handleMouseMove = (e) => {
      const hero = heroWrapperRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      targetProgress = Math.max(0, Math.min(1, x));
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      live = false;
      controller.abort();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      if (anim) anim.destroy();
      animRef.current = null;
    };
  }, [s.first_name, s.last_name, cardSignature]);

  return (
    <div ref={heroWrapperRef}>

      <div className="top-glow">
        <div className="blur" />
      </div>

      <div id="home" data-nav="peach" className="wrapper-hero">
        <div
          className="img-hero-wrapper"
          style={{
            backgroundImage: s.hero_image === '' ? 'none' : `url("${resolveMediaUrl(s.hero_image || '/images/hero-photo-test2.jpg')}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {content('hero.video')&&<video className="cms-background-video" src={resolveMediaUrl(content('hero.video'))} poster={s.hero_image ? resolveMediaUrl(s.hero_image) : undefined} autoPlay loop muted playsInline/>}
          <div className="black-overlay-top" />
          <div className="black-overlay" />
        </div>

        <div className="w-layout-blockcontainer wrapper-hero-home w-container">
          <div className="conter-content-hero">
            <div className="hero-top">
              <h1 className="heading hero-title" style={{ whiteSpace: 'pre-line' }}>
                {(s.title ?? 'Brand & Web Design Specialist').replace(/Web\s+Design/i, 'Web\nDesign')}
              </h1>
            </div>

            <div className="hero-bottom">
              <div
                ref={lottieContainerRef}
                className="name-mouse-lottie"
                role="img"
                aria-label={`${s.first_name ?? 'Sudais'} ${s.last_name ?? ''}`.trim()}
                data-is-ix2-target="1"
                style={{ width: '100%', minHeight: '8vw' }}
              />
              <p className="heading right hero-role">
                {s.role ?? 'Freelance Design Director'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
