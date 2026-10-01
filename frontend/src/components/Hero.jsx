import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import { gsap } from '../utils/motion';
import { usePortfolio } from '../context/PortfolioContext';
import { bindHeroName } from '../utils/heroName';

export default function Hero() {
  const { data } = usePortfolio();
  const s = data.settings || {};

  const heroWrapperRef = useRef(null);
  const lottieContainerRef = useRef(null);
  const animRef = useRef(null);
  const loaderRef = useRef(null);
  const introRef = useRef(null);
  const lineRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 1. Initialize Hero Mouse Lottie Animation
  useEffect(() => {
    let anim;
    let live = true;
    const controller = new AbortController();
    const load = async () => {
      const response = await fetch('/documents/juan-name-mouse.json', { signal: controller.signal });
      const animationData = await response.json();
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
        bindHeroName(
          lottieContainerRef.current,
          [s.first_name || 'Sudais', s.last_name || ''],
          animationData.layers.slice(0, 2).map(layer => ({ anchorY: layer.ks.a.k[1], positionY: layer.ks.p.k[0].s[1] }))
        );
        // Set to middle frame initially
        const mid = Math.floor((anim.totalFrames || 60) / 2);
        anim.goToAndStop(mid, true);
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
  }, [s.first_name, s.last_name]);

  // 2. Page Load Animation
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setLoading(false);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' }
    });

    // Animate loader line
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6, transformOrigin: 'left' })
      .to(introRef.current, { yPercent: -100, duration: 0.7, delay: 0.1 })
      .to(loaderRef.current, {
        height: 0,
        duration: 0.4,
        onComplete: () => setLoading(false)
      })
      .fromTo(
        '.img-hero-wrapper',
        { opacity: 0.5, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        '.hero-top .heading, .hero-bottom .heading.right',
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
        '-=0.7'
      );

    const fallback = window.setTimeout(() => setLoading(false), 2000);
    return () => {
      window.clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  return (
    <div ref={heroWrapperRef}>
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
              <div className="nav-name-jm intro">{s.first_name || 'Sudais'}</div>
              <div className="dot-jm intro" />
              <div className="nav-name-jm intro">{s.last_name || 'Waqas'}</div>
            </div>
          </div>
          <div ref={lineRef} className="grow-line" />
        </div>
      )}

      <div className="top-glow">
        <div className="blur" />
      </div>

      <div id="home" data-nav="peach" className="wrapper-hero">
        <div
          className="img-hero-wrapper"
          style={{
            backgroundImage: `url(${s.hero_image || '/images/hero-photo-test2.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="black-overlay-top" />
          <div className="black-overlay" />
        </div>

        <div className="w-layout-blockcontainer wrapper-hero-home w-container">
          <div className="conter-content-hero">
            <div className="hero-top">
              <h1 className="heading hero-title" style={{ whiteSpace: 'pre-line' }}>
                {(s.title || 'Brand & Web Design Specialist').replace(/Web\s+Design/i, 'Web\nDesign')}
              </h1>
            </div>

            <div className="hero-bottom">
              <div
                ref={lottieContainerRef}
                className="name-mouse-lottie"
                role="img"
                aria-label={`${s.first_name || 'Sudais'} ${s.last_name || ''}`.trim()}
                data-is-ix2-target="1"
                style={{ width: '100%', minHeight: '8vw' }}
              />
              <p className="heading right hero-role">
                {s.role || 'Freelance Design Director'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
