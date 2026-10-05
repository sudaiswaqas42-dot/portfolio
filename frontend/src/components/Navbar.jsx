import { useContent } from '../utils/content';
import React from 'react';
import { Link } from 'react-router-dom';
import LogoTile from './LogoTile';
import HoverText from './HoverText';
import { usePortfolio } from '../context/PortfolioContext';

export default function Navbar() {
  const content = useContent();
  const { data } = usePortfolio();

  const firstName = data?.settings?.first_name ?? 'Sudais';
  const lastName = data?.settings?.last_name ?? 'Waqas';
  const email = data?.settings?.email ?? 'sudais@morable.co';
  const linkedin = data?.settings?.linkedin_url ?? 'https://www.linkedin.com/in/juanmmora/';
  const twitter = data?.settings?.twitter_url ?? 'https://x.com/ByMorable';
  const behance = data?.settings?.behance_url ?? 'https://www.behance.net/juanmora2';

  return (
    <>
      {/* Mobile Navigation */}
      <ul role="list" className="nav-menu-mobile w-list-unstyled">
        <li>
          <Link to={content("header.destination_about")} className="nav-link-mobile"><HoverText>{content("header.about")}</HoverText></Link>
        </li>
        <li>
          <Link to={content("header.destination")} className="w-inline-block" aria-label={content("header.accessible_label_home")}>
            <LogoTile />
          </Link>
        </li>
        <li>
          <Link to={content("header.destination_work")} className="nav-link-mobile"><HoverText>{content("header.work")}</HoverText></Link>
        </li>
      </ul>

      {/* Desktop Navigation */}
      <div className="container-2">
        <div className="cont-name-logo">
          <Link to={content("header.destination")} className="nav-name w-inline-block">
            <div className="nav-name-jm"><HoverText>{firstName}</HoverText></div>
            <div className="dot-jm"></div>
            <div className="nav-name-jm"><HoverText>{lastName}</HoverText></div>
          </Link>
        </div>

        {/* Center Pill Menu */}
        <ul role="list" className="nav-menu w-list-unstyled">
          <li className="cont-social-link">
            <Link to={content("header.destination_about")} className="nav-link"><HoverText>{content("header.about")}</HoverText></Link>
          </li>
          <li>
            <Link to={content("header.destination")} className="w-inline-block" aria-label={content("header.accessible_label_home")}>
              <LogoTile />
            </Link>
          </li>
          <li className="cont-social-link">
            <Link to={content("header.destination_work")} className="nav-link"><HoverText>{content("header.work")}</HoverText></Link>
          </li>
        </ul>

        {/* Right Social & Admin Links */}
        <ol role="list" className="nav-social-wrapper w-list-unstyled">
          <li className="cont-social-link">
            <a href={`mailto:${email}?subject=Hey%20${firstName}!`} className="nav-social-link"><HoverText>{content("header.email")}</HoverText></a>
          </li>
          <li className="cont-social-link">
            <a href={linkedin} target="_blank" rel="noreferrer" className="nav-social-link"><HoverText>{content("header.in")}</HoverText></a>
          </li>
          <li className="cont-social-link">
            <a href={twitter} target="_blank" rel="noreferrer" className="nav-social-link"><HoverText>{content("header.x")}</HoverText></a>
          </li>
          <li className="cont-social-link">
            <a href={behance} target="_blank" rel="noreferrer" className="nav-social-link"><HoverText>{content("header.be")}</HoverText></a>
          </li>
        </ol>
      </div>
    </>
  );
}
