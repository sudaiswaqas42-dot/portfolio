import { useContent } from '../utils/content';
import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export default function Footer() {
  const content = useContent();
  const { data } = usePortfolio();
  const firstName = data?.settings?.first_name ?? 'Usman';
  const lastName = data?.settings?.last_name ?? 'Ghani';
  const email = data?.settings?.email ?? 'sudais@morable.co';
  const linkedin = data?.settings?.linkedin_url ?? 'https://www.linkedin.com/in/juanmmora/';
  const twitter = data?.settings?.twitter_url ?? 'https://x.com/ByMorable';
  const behance = data?.settings?.behance_url ?? 'https://www.behance.net/juanmora2';

  const techLabel = data?.settings?.footer_tech_label ?? 'Website made using:';
  const technologies = Array.isArray(data?.settings?.footer_technologies)
    ? data.settings.footer_technologies
    : ['Figma', 'React / Vite', 'Node.js / Express', 'MySQL Database', 'GSAP', 'Lenis Scroll'];

  const headingText = (data?.settings?.footer_heading ?? `MR ${firstName} ${lastName}`).trim();
  const subheading = data?.settings?.footer_subheading ?? 'Morable Design Studio [Coming Soon]';

  const footerVideo = data?.settings?.footer_video ?? '/videos-work/desk_jm3.mp4';
  const footerPoster = data?.settings?.footer_video_poster ?? '/videos-work/juan-video-loading.jpg';

  const getHeadingParts = (text) => {
    if (!text) return ['', ''];
    if (text.includes('|')) {
      const parts = text.split('|');
      return [parts[0].trim(), parts[1].trim()];
    }
    const trimmed = text.trim();
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace === -1) {
      return [trimmed, ''];
    }
    return [trimmed.substring(0, lastSpace), trimmed.substring(lastSpace + 1)];
  };

  const [part1, part2] = getHeadingParts(headingText);

  const renderSubheading = (text) => {
    if (!text) return null;
    const bracketIndex = text.indexOf('[');
    if (bracketIndex !== -1) {
      const main = text.substring(0, bracketIndex);
      const tag = text.substring(bracketIndex);
      return (
        <>
          {main}<span className="text-span-3">{tag}</span>
        </>
      );
    }
    return text;
  };

  return (
    <section data-nav="peach" className="section footer">
      <div className="main-wrapper-footer">
        <div className="wrapper-content-footer _1">
          {/* Made Using Column */}
          <div className="wrapper-column">
            <h3 className="body-footer fade">{techLabel}</h3>
            <ul role="list" className="list-footer w-list-unstyled">
              {technologies.map((item, idx) => (
                <li key={idx} className="wrapper-item-column">
                  <h4 className="body-footer right">{item}</h4>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Socials Column */}
          <div className="wrapper-column right">
            <h3 className="body-footer fade">{content("footer.contact")}</h3>
            <ul role="list" className="list-footer w-list-unstyled">
              <li className="wrapper-item-column">
                <a href={`mailto:${email}?subject=Hey%20${firstName}!`} className="footer-social-link">{content("footer.email")}</a>
              </li>
              <li className="wrapper-item-column">
                <a href={linkedin} target="_blank" rel="noreferrer" className="footer-social-link">{content("footer.linkedin")}</a>
              </li>
              <li className="wrapper-item-column">
                <a href={twitter} target="_blank" rel="noreferrer" className="footer-social-link">{content("footer.x")}</a>
              </li>
              <li className="wrapper-item-column">
                <a href={behance} target="_blank" rel="noreferrer" className="footer-social-link">{content("footer.behance")}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Large Name Display */}
        <div className="footer-brand-lockup">
          <h2 className="name-footer">
            <span>{part1}</span>{' '}
            <span>{part2}</span>
          </h2>
          <p className="body-footer big footer-studio-caption">
            {renderSubheading(subheading)}
          </p>
        </div>
      </div>

      {/* Video Embed Background */}
      <div className="video-cont-footer footer">
        <div className="video-embed w-embed">
          <video
            key={footerVideo}
            className="video-embed"
            muted
            autoPlay
            loop
            playsInline
            poster={footerPoster}
          >
            <source src={footerVideo} />
          </video>
        </div>
      </div>
    </section>
  );
}
