import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import BrandMark from './BrandMark';

export default function WorkFolder() {
  const { data } = usePortfolio();
  const covers = (data.projects || []).map(project => project.media?.find(media => media.type === 'image' && !/arrow/.test(media.src))?.src).filter(Boolean).slice(0, 4);
  return <section data-nav="grey" className="section">
    <div className="work-cta-wrapper">
      <div className="work-cta-content-wrapper">
        <div className="body-copy">Curious?... Check out my</div>
        <Link to="/work" className="folder-wrapper w-inline-block" aria-label="Explore my portfolio">
          <div className="back-folder folder-back-panel" />
          <div className="projects-folder folder-card-stack" aria-hidden="true">
            {covers.map((src, index) => <div className="folder-project-card" style={{ '--card-index': index }} key={src}><img src={src} alt="" loading="lazy" /></div>)}
          </div>
          <div className="front-folder folder-front-panel"><span className="folder-label">Portfolio</span><BrandMark /></div>
        </Link>
        <div className="body-copy">Or keep scrolling</div>
      </div>
      <div className="work-big-text">W<span className="text-span-2">o</span>rk</div>
    </div>
  </section>;
}
