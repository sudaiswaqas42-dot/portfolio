import { usePortfolio } from '../context/PortfolioContext';
import { useContent } from '../utils/content';
import React, { useEffect, useRef } from 'react';
import { gsap, SplitText } from '../utils/motion';

export default function Cursor() {
  const content = useContent();
  const {data}=usePortfolio();
  const cursorRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    const icon = iconRef.current;
    const text = textRef.current;
    if (!cursor || !icon || !text) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const tick = () => {
      const dt = 1.0 - Math.pow(1.0 - 0.09, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      gsap.set(cursor, { x: pos.x, y: pos.y });
    };

    window.addEventListener('mousemove', onMouseMove);
    gsap.ticker.add(tick);

    // Initial positioning
    gsap.set(cursor, { x: pos.x, y: pos.y });

    // Folder hover interactions
    const onFolderEnter = () => gsap.to(icon, { opacity: 1, duration: 0.3, overwrite: true });
    const onFolderLeave = () => gsap.to(icon, { opacity: 0, duration: 0.3, overwrite: true });

    // CTA hover interactions
    const onCtaEnter = () => {
      if(content('contact.destination'))return;
      text.innerText = content("cursor.hover_message");
      gsap.to(text, { opacity: 1, duration: 0.4, overwrite: true });
    };
    const onCtaLeave = () => {
      gsap.to(text, { opacity: 0, duration: 0.3, overwrite: true });
    };
    const onCtaClick = () => {
      if(content('contact.destination'))return;
      text.innerText = content("cursor.copied_message");
      try {
        const split = new SplitText(text, { type: 'chars' });
        gsap.from(split.chars, {
          opacity: 0,
          stagger: 0.05,
          duration: 0.05,
          ease: 'back.out(1.7)',
          overwrite: true
        });
      } catch (e) {
        gsap.fromTo(text, { scale: 0.8 }, { scale: 1, duration: 0.3 });
      }
    };

    // Attach listeners with delegation for dynamically mounted items
    const handleMouseOver = (e) => {
      if (e.target.closest?.('.folder-wrapper')) {
        onFolderEnter();
      }
      if (e.target.closest?.('.cta-button-wrapper')) {
        onCtaEnter();
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest?.('.folder-wrapper') && !e.relatedTarget?.closest?.('.folder-wrapper')) {
        onFolderLeave();
      }
      if (e.target.closest?.('.cta-button-wrapper') && !e.relatedTarget?.closest?.('.cta-button-wrapper')) {
        onCtaLeave();
      }
    };

    const handleClick = () => onCtaClick();

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('portfolio-email-copied', handleClick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(tick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('portfolio-email-copied', handleClick);
    };
  }, [data.content]);

  return (
    <div
      ref={cursorRef}
      className="cursor-jm"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform'
      }}
    >
      <div ref={iconRef} className="cursor-jm-icon" style={{ opacity: 0 }}>
        <img src={content("cursor.arrow_grey_svg")} loading="lazy" alt={content("cursor.image_description_decorative")} className="icon-cursor" />
      </div>
      <div ref={textRef} className="text-jm-cursor" style={{ opacity: 0 }}>{content("cursor.copy")}</div>
    </div>
  );
}
