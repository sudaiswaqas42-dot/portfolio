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
    <path d="M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z"/>
  </svg>
);

const UpworkIcon = () => (
  <svg className="nav-social-svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.076.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.828v7.112c-.002 1.406-1.141 2.546-2.547 2.548-1.405-.002-2.543-1.143-2.545-2.548V3.492H0v7.112c0 2.914 2.37 5.303 5.281 5.303 2.913 0 5.283-2.389 5.283-5.303v-1.19c.529 1.107 1.182 2.229 1.974 3.221l-1.673 7.873h2.797l1.213-5.71c1.063.679 2.285 1.109 3.686 1.109 3 0 5.439-2.452 5.439-5.45 0-3-2.439-5.439-5.439-5.439z"/>
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
