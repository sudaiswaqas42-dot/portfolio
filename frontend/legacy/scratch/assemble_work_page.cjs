const fs = require('fs');

const nav = fs.readFileSync('scratch/work_nav.jsx.txt', 'utf8');
const projects = fs.readFileSync('scratch/work_projects.jsx.txt', 'utf8');

const header = `import React, { useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import Footer from '../components/Footer';
import { initWebflowAndHovers } from '../utils/animations';

export default function Work() {
  const { data } = usePortfolio();
  const dbProjects = data?.projects || [];
  const settings = data?.settings || {};
  const email = settings?.email || 'sudais@morable.co';

  // Helper to get dynamic field or fallback
  const getProj = (slug, field, fallback) => {
    const found = dbProjects.find(p => p.slug === slug);
    return (found && found[field]) ? found[field] : fallback;
  };

  useEffect(() => {
    const t = setTimeout(() => {
      initWebflowAndHovers();
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <main data-barba="container" className="main">
      <div className="blur work"></div>
      <section data-nav="grey" className="section work">
`;

const ctaAndFooter = `
      {/* CTA Section */}
      <section data-nav="grey" className="section">
        <div className="main-cta-wrapper">
          <div className="content-cta-wrapper">
            <div className="cta-text-wrapper">
              <h2 className="heading-cta main">Let’s build something people remember</h2>
              <p className="body-copy-cta">from global tech companies to growing startups.</p>
            </div>
            <a href={\`mailto:\${email}\`} className="cta-button-wrapper w-inline-block">
              <div className="cont-icon-cta">
                <img src="/images/arrow-grey.svg" loading="lazy" alt="" className="arrow-cta" />
              </div>
              <h2 className="heading-cta">Let's talk</h2>
              <h2 className="email-cta">{email}</h2>
              <div className="hover-main-cta"></div>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
`;

const fullCode = header + nav + '\n' + projects + ctaAndFooter;
fs.writeFileSync('src/pages/Work.jsx', fullCode, 'utf8');
console.log('src/pages/Work.jsx assembled successfully! Length:', fullCode.length);
