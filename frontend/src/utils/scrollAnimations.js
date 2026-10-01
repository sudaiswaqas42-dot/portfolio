import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes all Home page scroll-driven parallax and reveal animations
 */
export function initHomeScrollAnimations() {
  // 1. Clean up any existing ScrollTriggers to prevent duplicates
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id && st.vars.id.startsWith('home_')) {
      st.kill();
    }
  });

  // 2. Hero Section Parallax
  const heroWrapper = document.querySelector('.wrapper-hero');
  const heroContent = document.querySelector('.conter-content-hero');
  const heroImg = document.querySelector('.img-hero-wrapper');

  if (heroWrapper && heroContent) {
    gsap.to(heroContent, {
      y: 100,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        id: 'home_hero_content',
        trigger: heroWrapper,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }

  if (heroWrapper && heroImg) {
    gsap.to(heroImg, {
      yPercent: 15,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        id: 'home_hero_bg',
        trigger: heroWrapper,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }

  // 3. Click & Scroll Section - Floating Geometric Shapes Parallax Scrub
  const clickSection = document.querySelector('.click-scroll-height');
  if (clickSection) {
    // Parallax on 3D and vector shapes at different scrub speeds
    const shapes = [
      { sel: '.hex-scroll', y: -280, rot: 15 },
      { sel: '.pill-scroll', y: -190, rot: -10 },
      { sel: '.circle-plus-scroll', y: -240, rot: 25 },
      { sel: '.circle-center-scroll', y: -160, rot: -5 },
      { sel: '.square-scroll', y: -140, rot: 20 },
      { sel: '.circle-left-scroll', y: -110, rot: -15 },
      { sel: '.blue-pill', y: -220, rot: -8 },
      { sel: '.blue-hex', y: -130, rot: 12 },
      { sel: '.blue-circle', y: -90, rot: 0 },
      { sel: '.ll-scroll', y: -180, rot: 0 }
    ];

    shapes.forEach((item, index) => {
      const el = clickSection.querySelector(item.sel);
      if (el) {
        gsap.fromTo(el, 
          { y: 80, rotation: 0 },
          {
            y: item.y,
            rotation: item.rot,
            ease: 'none',
            scrollTrigger: {
              id: `home_shape_${index}`,
              trigger: clickSection,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6
            }
          }
        );
      }
    });
  }

  // 4. Services Cards - Staggered Scroll Reveal & Parallax
  const serviceWrappers = document.querySelectorAll('.service-wrapper');
  serviceWrappers.forEach((card, index) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0.1 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          id: `home_service_${index}`,
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Subtle image parallax inside masks
    const imgs = card.querySelectorAll('.mask-img-service img');
    imgs.forEach((img, imgIdx) => {
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            id: `home_srv_img_${index}_${imgIdx}`,
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5
          }
        }
      );
    });
  });

  // 5. 3D Work Folder - Hover & Scroll Animation
  const folderLink = document.querySelector('.folder-wrapper');
  if (folderLink && !folderLink._hasHoverSetup) {
    folderLink._hasHoverSetup = true;
    const front = folderLink.querySelector('.front-folder');
    const projects = folderLink.querySelector('.projects-folder');
    const back = folderLink.querySelector('.back-folder');

    folderLink.addEventListener('mouseenter', () => {
      if (front) {
        gsap.to(front, {
          rotateX: -38,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true
        });
      }
      if (projects) {
        gsap.to(projects, {
          y: -55,
          scale: 1.06,
          duration: 0.7,
          ease: 'back.out(1.5)',
          overwrite: true
        });
      }
    });

    folderLink.addEventListener('mouseleave', () => {
      if (front) {
        gsap.to(front, {
          rotateX: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
          overwrite: true
        });
      }
      if (projects) {
        gsap.to(projects, {
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.inOut',
          overwrite: true
        });
      }
    });
  }

  // 6. Benefits Section - Drawing Lines & Checklist Reveal
  const benefitsSec = document.querySelector('.benefits-main-wrapper');
  if (benefitsSec) {
    const line1 = benefitsSec.querySelector('.line.step1');
    const line2 = benefitsSec.querySelector('.line-step2');
    const jmImg = benefitsSec.querySelector('.jm-siluete-img');
    const items = benefitsSec.querySelectorAll('.item-benefits-cont');

    if (line1) {
      gsap.fromTo(line1,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            id: 'home_line1',
            trigger: line1,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (jmImg) {
      gsap.fromTo(jmImg,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            id: 'home_jmImg',
            trigger: jmImg,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (line2) {
      gsap.fromTo(line2,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.inOut',
          scrollTrigger: {
            id: 'home_line2',
            trigger: line2,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (items.length > 0) {
      gsap.fromTo(items,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            id: 'home_benefits_items',
            trigger: items[0],
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  }

  ScrollTrigger.refresh();
}

/**
 * Initializes About page scroll animations, fixes circle Lottie clipping and fading
 */
export function initAboutScrollAnimations() {
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars.id && st.vars.id.startsWith('about_')) {
      st.kill();
    }
  });

  const scrollWrapper = document.querySelector('.about-scroll-wrapper');
  const circleCont = document.querySelector('.circle-lottie-cont');
  const bioWrapper = document.querySelector('.about-bio-wrapper');

  if (scrollWrapper && circleCont) {
    // Fade out circle lottie smoothly as user enters bio so it never overlaps or overflows
    gsap.to(circleCont, {
      opacity: 0,
      scale: 0.85,
      ease: 'power1.in',
      scrollTrigger: {
        id: 'about_circles_fade',
        trigger: scrollWrapper,
        start: 'center top',
        end: 'bottom top',
        scrub: 0.5
      }
    });
  }

  // Stagger bio items
  if (bioWrapper) {
    const bioItems = bioWrapper.querySelectorAll('.cont-bio-tem');
    bioItems.forEach((item, idx) => {
      gsap.fromTo(item,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            id: `about_bio_${idx}`,
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  ScrollTrigger.refresh();
}
