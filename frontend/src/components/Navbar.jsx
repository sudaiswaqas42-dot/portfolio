import { useContent } from '../utils/content';
import React from 'react';
import { Link } from 'react-router-dom';
import LogoTile from './LogoTile';
import HoverText from './HoverText';
import { usePortfolio } from '../context/PortfolioContext';

const EmailIcon = () => (
  <svg className="nav-social-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2.5" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="nav-social-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const XIcon = () => (
  <svg className="nav-social-svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const BehanceIcon = () => (
  <svg className="nav-social-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-4.726 3-3.659 0-6-2.588-6-6 0-3.633 2.521-6 6-6 3.738 0 5.674 2.766 5.32 6.002h-8.32c.074 1.838 1.42 2.654 3.033 2.654 1.341 0 2.222-.589 2.593-1.656h2.1zm-6.726-4h5.279c-.065-1.467-.981-2.433-2.629-2.433-1.625 0-2.551.986-2.65 2.433zm-10.457 7h-6.543v-16h6.816c3.084 0 4.887 1.345 4.887 4.004 0 1.642-.907 2.894-2.281 3.518 1.879.623 2.779 2.115 2.779 3.992 0 2.787-2.072 4.486-5.658 4.486zm-3.543-9.172h3.125c1.477 0 2.404-.613 2.404-1.898 0-1.16-.838-1.73-2.295-1.73h-3.234v3.628zm0 6.372h3.424c1.697 0 2.658-.729 2.658-2.193 0-1.391-1.076-2.007-2.646-2.007h-3.436v4.2z"/>
  </svg>
);

const UpworkIcon = () => (
  <svg className="nav-social-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-3.225 0-5.467 2.308-6.096 4.675-1.398-2.052-2.457-4.526-2.92-6.546H9.546v8.528c0 1.708-1.39 3.098-3.098 3.098S3.35 13.383 3.35 11.675V3.147H0v8.528c0 3.565 2.898 6.463 6.462 6.463 3.565 0 6.463-2.898 6.463-6.463V8.892c.381 1.458 1.157 3.25 2.197 4.792l-1.875 8.784h3.497l1.353-6.347c1.111.758 2.38 1.196 3.828 1.196 3.351 0 6.079-2.728 6.079-6.079 0-3.35-2.728-6.22-6.074-6.22z"/>
  </svg>
);

export default function Navbar() {
  const content = useContent();
  const { data } = usePortfolio();

  const firstName = data?.settings?.first_name ?? 'Sudais';
  const lastName = data?.settings?.last_name ?? 'Waqas';
  const email = data?.settings?.email ?? 'sudais@morable.co';
  const linkedin = data?.settings?.linkedin_url ?? 'https://www.linkedin.com/in/juanmmora/';
  const twitter = data?.settings?.twitter_url ?? 'https://x.com/ByMorable';
  const behance = data?.settings?.behance_url ?? 'https://www.behance.net/juanmora2';
  const upwork = data?.settings?.upwork_url ?? 'https://www.upwork.com';

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

        {/* Right Social Links with Large, Crisp SVG Icons */}
        <ol role="list" className="nav-social-wrapper w-list-unstyled">
          <li className="cont-social-link">
            <a
              href={`mailto:${email}?subject=Hey%20${firstName}!`}
              className="nav-social-link nav-social-icon-btn"
              title="Email"
              aria-label="Email"
            >
              <EmailIcon />
            </a>
          </li>
          <li className="cont-social-link">
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              className="nav-social-link nav-social-icon-btn"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </li>
          <li className="cont-social-link">
            <a
              href={twitter}
              target="_blank"
              rel="noreferrer"
              className="nav-social-link nav-social-icon-btn"
              title="X / Twitter"
              aria-label="X / Twitter"
            >
              <XIcon />
            </a>
          </li>
          <li className="cont-social-link">
            <a
              href={behance}
              target="_blank"
              rel="noreferrer"
              className="nav-social-link nav-social-icon-btn"
              title="Behance"
              aria-label="Behance"
            >
              <BehanceIcon />
            </a>
          </li>
          <li className="cont-social-link">
            <a
              href={upwork}
              target="_blank"
              rel="noreferrer"
              className="nav-social-link nav-social-icon-btn"
              title="Upwork"
              aria-label="Upwork"
            >
              <UpworkIcon />
            </a>
          </li>
        </ol>
      </div>
    </>
  );
}
