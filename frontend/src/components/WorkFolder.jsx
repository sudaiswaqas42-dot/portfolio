import { useContent } from '../utils/content';
import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import BrandMark from './BrandMark';

export default function WorkFolder() {
  const content = useContent();
  const { data } = usePortfolio();
  const projectCovers = (data.projects || []).map(project => project.media?.find(media => media.type === 'image' && !/arrow/.test(media.src))?.src).filter(Boolean).slice(0, 4);
  const covers = [1,2,3,4].map((n,i)=>content(`folder.cover_${n}`)||projectCovers[i]).filter(Boolean);
  return <section data-nav="grey" className="section">
    <div className="work-cta-wrapper">
      <div className="work-cta-content-wrapper">
        <div className="body-copy">{content("folder.curious_check_out_my")}</div>
        <Link to={content("folder.destination_work")} className="folder-wrapper w-inline-block" aria-label={content("folder.accessible_label_explore_my_portfolio")}>
          <div className="back-folder folder-back-panel" />
          <div className="projects-folder folder-card-stack" aria-hidden="true">
            {covers.map((src, index) => <div className="folder-project-card" style={{ '--card-index': index }} key={src}><img src={src} alt={content("folder.image_description_decorative")} loading="lazy" /></div>)}
          </div>
          <div className="front-folder folder-front-panel"><span className="folder-label">{content("folder.portfolio")}</span><BrandMark /></div>
        </Link>
        <div className="body-copy">{content("folder.or_keep_scrolling")}</div>
      </div>
      <div className="work-big-text">{content("folder.w")}<span className="text-span-2">{content("folder.o")}</span>{content("folder.rk")}</div>
    </div>
  </section>;
}
