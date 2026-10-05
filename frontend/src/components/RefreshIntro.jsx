import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../utils/motion';
import { usePortfolio } from '../context/PortfolioContext';

// Keyed by pathname in the layout to replay on refresh and page navigation.
export default function RefreshIntro() {
  const { data } = usePortfolio();
  const root = useRef(null);
  const [finished, setFinished] = useState(false);

  useLayoutEffect(() => {
    if (finished) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFinished(true);
      return;
    }
    const context = gsap.context(() => {
      gsap.timeline({ onComplete: () => {
        setFinished(true);
        window.dispatchEvent(new Event('portfolio-intro-complete'));
      } })
        .fromTo('.grow-line', { scaleX: 0 }, { scaleX: 1, duration: 0.5, transformOrigin: 'left', ease: 'power2.inOut' })
        .to(root.current, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' }, '+=0.1');
    }, root);
    return () => context.revert();
  }, [finished]);

  if (finished) return null;
  return <div ref={root} className="container-loader refresh-intro" aria-hidden="true">
    <div className="orange-intro">
      <div className="cont-juan-intro">
        <div className="nav-name-jm intro">{data.settings.first_name}</div>
        <div className="dot-jm intro" />
        <div className="nav-name-jm intro">{data.settings.last_name}</div>
      </div>
    </div>
    <div className="grow-line" />
  </div>;
}
