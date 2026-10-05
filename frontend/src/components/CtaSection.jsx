import { useContent } from '../utils/content';
import React, { useRef, useState } from 'react';
import { gsap } from '../utils/motion';
import { usePortfolio } from '../context/PortfolioContext';

export default function CtaSection({ about = false }) {
  const content = useContent();
  const { data } = usePortfolio();
  const email = data.settings.email;
  const buttonRef = useRef(null);
  const [status, setStatus] = useState('');
  const animateHover = active => {
    const button = buttonRef.current;
    if (!button) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 0 : 0.5;
    gsap.to(button.querySelector('.hover-main-cta'), { height: active ? '100%' : '0%', duration, ease: 'power3.inOut', overwrite: true });
    // One transform owner: CSS transitions both labels between their two states.
    button.dataset.hovered = String(active);
  };
  async function copy(event) {
    if(content('contact.destination'))return;
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setStatus(content("contact.copied_message"));
      window.dispatchEvent(new CustomEvent('portfolio-email-copied'));
    } catch {
      setStatus(content("contact.fallback_message"));
      window.location.href = `mailto:${email}`;
    }
  }
  return <section data-nav="grey" className="section" id="cta"><div className="main-cta-wrapper"><div className="content-cta-wrapper">
    <div className="cta-text-wrapper"><h2 className="heading-cta main">{about ? content("contact.about_heading") : content("contact.home_and_work_heading")}</h2><p className="body-copy-cta">{content("contact.from_global_tech_companies_to_growing_startups")}</p></div>
    <a ref={buttonRef} href={content('contact.destination')||`mailto:${email}`} onClick={copy} onPointerEnter={() => animateHover(true)} onPointerLeave={() => animateHover(false)} onFocus={() => animateHover(true)} onBlur={() => animateHover(false)} className="cta-button-wrapper w-inline-block">
      <div className="hover-main-cta" aria-hidden="true" />
      <div className="cta-label-viewport"><h2 className="heading-cta cta-talk">{content("contact.let_s_talk")}</h2><span className="email-cta">{content('contact.hover_label')||email}</span></div>
      <span role="status" className="copy-status">{status}</span>
    </a>
  </div></div></section>;
}
