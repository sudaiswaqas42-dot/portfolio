export function initWebflowAndHovers() {
  if (typeof window === 'undefined') return;

  // 1. Re-initialize Webflow IX2 (Interactions 2.0)
  if (window.Webflow) {
    try {
      window.Webflow.destroy();
      window.Webflow.ready();
      const ix2 = window.Webflow.require('ix2');
      if (ix2 && ix2.init) {
        ix2.init();
      }
    } catch (e) {
      // Ignored for graceful handling
    }
  }

  // 2. Main CTA button hovers with GSAP elastic spring
  if (window.gsap) {
    const ctaLinks = document.querySelectorAll('.main-cont-button');
    ctaLinks.forEach((link) => {
      if (link._hasHover) return;
      link._hasHover = true;

      const firstIcon = link.querySelector('.icon-wrapper-cta-first');
      const lastIcon = link.querySelector('.icon-wrapper-cta');
      if (!firstIcon || !lastIcon) return;

      link.addEventListener('mouseenter', () => {
        window.gsap.to(firstIcon, {
          width: '2.8rem',
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'elastic.out(0.5, 0.3)',
          overwrite: true
        });
        window.gsap.to(lastIcon, {
          width: '0rem',
          rotation: -90,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out',
          overwrite: true
        });
      });

      link.addEventListener('mouseleave', () => {
        window.gsap.to(firstIcon, {
          width: '0rem',
          rotation: -90,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
          overwrite: true
        });
        window.gsap.to(lastIcon, {
          width: '2.8rem',
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'elastic.out(0.6, 0.3)',
          overwrite: true
        });
      });
    });
  }

  // 3. Unicorn Studio
  if (window.UnicornStudio && window.UnicornStudio.init) {
    window.UnicornStudio.init().catch(() => {});
  }
}
