import { useContent } from '../utils/content';
import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

import Footer from '../components/Footer';
import CtaSection from '../components/CtaSection';
import BrandMark from '../components/BrandMark';

export default function Work() {
  const content = useContent();
  const { data } = usePortfolio();
  const settings = data?.settings || {};
  const projects = data.projects || [];
  const [active, setActive] = useState('');

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

      <div className="blur work" />
      <section data-nav="grey" className="section work">
        <nav className="main-cont-nav-work" aria-label={content("work.accessible_label_projects")}>
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
                      <img src={p.media.find(m => m.type === 'image').src} alt={content("work.image_description_decorative")} className="img-project-nav" loading="lazy" />
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
              <span className="work-heading-lead"><span className="folder-work branded-work-folder" tabIndex={0} aria-label={content("work.accessible_label_portfolio_folder")}><BrandMark /></span><span>{content("work.heading_line_1").split(' ').map((word, index) => <React.Fragment key={word}>{index > 0 && ' '}<span className="work-hero-word">{word}</span></React.Fragment>)}</span></span>
              <span className="work-heading-second">{content("work.heading_line_2").split(' ').map((word, index) => <React.Fragment key={word}>{index > 0 && ' '}<span className="work-hero-word">{word}</span></React.Fragment>)}</span>
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
                          <img src={content("work.arrow_grey_out_svg")} alt={content("work.image_description_decorative")} className="arrow-cion" />
                        </div>
                        <div className="text-wrapper-cta">{content("work.see_it_live")}</div>
                        <div className="icon-wrapper-cta">
                          <img src={content("work.arrow_grey_out_svg")} alt={content("work.image_description_decorative")} className="arrow-cion" />
                        </div>
                      </a>
                    </div>
                  )}
                </div>
                <div className="content-project-info">
                  <p className="body-copy title">{content("work.challenge")}</p>
                  <p className="body-copy black">{p.challenge}</p>
                </div>
                <div className="content-project-info">
                  <p className="body-copy title">{content("work.services")}</p>
                  <div className="pill-services-cont">
                    {p.services_text.split(',').filter(Boolean).map((s, i) => (
                      <div className="pill-service" key={i}>{s.trim()}</div>
                    ))}
                  </div>
                </div>
                <div className="content-project-info">
                  <p className="body-copy title">{content("work.role")}</p>
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
          {!projects.length && <p className="body-copy">{content("work.new_projects_coming_soon")}</p>}
        </div>
      </section>
      <CtaSection />
      <Footer />
    </main>
  );
}
