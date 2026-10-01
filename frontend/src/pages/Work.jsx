import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { gsap } from '../utils/motion';
import Footer from '../components/Footer';
import CtaSection from '../components/CtaSection';
import BrandMark from '../components/BrandMark';

export default function Work() {
  const { data } = usePortfolio();
  const settings = data?.settings || {};
  const projects = data.projects || [];
  const [active, setActive] = useState('');

  const loaderRef = useRef(null);
  const introRef = useRef(null);
  const lineRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Intro Page Loader Animation (matching Home Page and About Page)
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setLoading(false);
      return;
    }

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
        '.text-headline-work',
        { '--heading-fill': '0%' },
        { '--heading-fill': '100%', duration: 1.4, ease: 'power2.inOut' },
        '-=0.4'
      )
      .fromTo(
        '.folder-work',
        { scale: 0.75, rotation: -12, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' },
        '-=0.7'
      )
      .fromTo(
        '.main-cont-nav-work',
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      );

    const fallback = window.setTimeout(() => setLoading(false), 2000);
    return () => {
      window.clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setActive(e.target.id);
      }),
      { rootMargin: '-10% 0px -65% 0px' }
    );
    document.querySelectorAll('.main-project-wrapper').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [projects]);

  useEffect(() => {
    const list = document.querySelector('.wrapper-work-nav');
    const item = list?.querySelector('.is-active')?.closest('li');
    if (list && item) list.scrollTo({ top: item.offsetTop - (list.clientHeight - item.offsetHeight) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }, [active]);

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

      <div className="blur work" />
      <section data-nav="grey" className="section work">
        <nav className="main-cont-nav-work" aria-label="Projects">
          <ul className="wrapper-work-nav w-list-unstyled">
            {projects.map(p => (
              <li className="wrapper-nav-work" key={p.slug}>
                <div className="nav-dot off" />
                <a
                  onFocus={() => setActive(p.slug)}
                  href={`#${p.slug}`}
                  className={`link-wrapper-project w-inline-block ${active === p.slug ? 'is-active' : ''}`}
                  aria-current={active === p.slug ? 'location' : undefined}
                >
                  <div className="nav-dot" />
                  <div className="project-cont-nav">
                    <div>{p.nav_title || p.title}</div>
                    {p.media?.find(m => m.type === 'image') && (
                      <img src={p.media.find(m => m.type === 'image').src} alt="" className="img-project-nav" loading="lazy" />
                    )}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="main-wrapper-work">
          <div className="header-work-copy">
            <h1 className="text-headline-work">
              <span className="work-heading-lead"><span className="folder-work branded-work-folder" tabIndex={0} aria-label="Portfolio folder"><BrandMark /></span><span>Passionate about the</span></span>
              <span className="work-heading-second">craft and little details</span>
            </h1>
          </div>
          {projects.map(p => (
            <article id={p.slug} className="main-project-wrapper" key={p.id || p.slug}>
              <div className="cont-project-content">
                <div className="content-project-info first">
                  <h3 className="headline-project">{p.title}</h3>
                  <div className="pill-year">{p.year}</div>
                  <div className="dot-project" />
                  {p.live_link && (
                    <div className="cont-cta-work">
                      <a href={p.live_link} target="_blank" rel="noopener noreferrer" className="main-cont-button w-inline-block">
                        <div className="icon-wrapper-cta-first">
                          <img src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                        </div>
                        <div className="text-wrapper-cta">See it live</div>
                        <div className="icon-wrapper-cta">
                          <img src="/images/arrow-grey-out.svg" alt="" className="arrow-cion" />
                        </div>
                      </a>
                    </div>
                  )}
                </div>
                <div className="content-project-info">
                  <p className="body-copy title">Challenge:</p>
                  <p className="body-copy black">{p.challenge}</p>
                </div>
                <div className="content-project-info">
                  <p className="body-copy title">Services:</p>
                  <div className="pill-services-cont">
                    {p.services_text.split(',').filter(Boolean).map((s, i) => (
                      <div className="pill-service" key={i}>{s.trim()}</div>
                    ))}
                  </div>
                </div>
                <div className="content-project-info">
                  <p className="body-copy title">Role:</p>
                  <p className="body-copy black">{p.role_text}</p>
                </div>
              </div>
              <div className={p.gallery_class || 'cont-project-imgs'}>
                {p.media?.filter(m => !(p.slug.includes('dino') && /arrow-grey/.test(m.src))).map((m, i) =>
                  m.type === 'video' ? (
                    <div id={m.id || undefined} className={m.className || 'video-cont-p2'} key={m.src + i}>
                      <div className="code-video w-embed">
                        <video autoPlay loop muted playsInline width="100%" preload="none" poster={m.poster || undefined} src={m.src} />
                      </div>
                    </div>
                  ) : (
                    <img
                      id={m.id || undefined}
                      key={m.src + i}
                      src={m.src}
                      srcSet={m.srcSet || undefined}
                      sizes="(max-width: 767px) 100vw, 80vw"
                      alt={m.alt || p.title}
                      loading="lazy"
                      className={m.className || 'img-project'}
                    />
                  )
                )}
              </div>
            </article>
          ))}
          {!projects.length && <p className="body-copy">New projects coming soon.</p>}
        </div>
      </section>
      <CtaSection />
      <Footer />
    </main>
  );
}
