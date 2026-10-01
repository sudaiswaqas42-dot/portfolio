import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, CustomEase, SplitText } from '../utils/motion';
import { usePortfolio } from '../context/PortfolioContext';
import { themeColors } from '../utils/theme';

export default function PageMotion() {
  const { pathname, hash } = useLocation();
  const { data } = usePortfolio();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useLayoutEffect(() => {
    if (/^\/(admin|login)/.test(pathname)) return;

    const colors = themeColors(data.theme);
    const disposers = [];
    const listen = (el, event, fn) => {
      el.addEventListener(event, fn);
      disposers.push(() => el.removeEventListener(event, fn));
    };

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Lenis Smooth Scroll
      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        gestureOrientation: 'vertical',
        normalizeWheel: false,
        smoothTouch: false
      });

      lenis.on('scroll', ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      // Helper for split text wrapping
      const splitIntoSpans = (elements, type = 'words') => {
        try {
          const split = new SplitText(elements, { type });
          disposers.push(() => split.revert());
          return split[type] || [];
        } catch (e) {
          return elements;
        }
      };

      // 2. Generic Reveal for other elements
      const genericSelector = pathname === '/about' || pathname === '/work' ? '.cont-bio-tem' : '.cont-bio-tem, .cont-news-wrapper';
      gsap.utils.toArray(genericSelector).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 45 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 94%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // 3. HOME PAGE ANIMATIONS
      if (pathname === '/') {
        // --- A. Hero Section Parallax ---
        gsap.to('.conter-content-hero', {
          yPercent: 30,
          opacity: 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: '.wrapper-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        });

        gsap.to('.img-hero-wrapper', {
          yPercent: 15,
          scale: 1.08,
          ease: 'none',
          scrollTrigger: {
            trigger: '.wrapper-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8
          }
        });

        // --- B. "16 years making users click and scroll" Section ---
        const clickScrollSection = document.querySelector('.click-scroll-height');
        const clickScrollSticky = document.querySelector('.wrapper-cont-50');

        if (clickScrollSection && clickScrollSticky) {
          // Floating Icons Parallax & Rotations
          const iconsTrigger = {
            trigger: clickScrollSection,
            start: 'top 80%',
            end: 'bottom 10%',
            scrub: 0.8
          };

          gsap.fromTo('.square-scroll', { y: '15vw', rotation: 70 }, { y: '-25vw', rotation: 0, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.pill-scroll', { y: '-10vw', rotation: 30 }, { y: '25vw', rotation: 0, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.blue-hex', { y: '5vw', rotation: -160 }, { y: '-15vw', rotation: 60, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.blue-pill', { y: '5vw', rotation: -160 }, { y: '-15vw', rotation: 60, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.blue-circle', { y: '5vw', rotation: -160 }, { y: '-15vw', rotation: 60, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.circle-left-scroll', { y: '8vw', rotation: -160 }, { y: '-8vw', rotation: 60, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.circle-center-scroll', { y: '-6vw', rotation: -160 }, { y: '12vw', rotation: 60, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.circle-plus-scroll', { y: '15vw', rotation: 0 }, { y: '-15vw', rotation: 80, ease: 'power2.out', scrollTrigger: iconsTrigger });
          gsap.fromTo('.hex-scroll', { y: '6vw', rotation: 0 }, { y: '-10vw', rotation: 60, ease: 'power2.out', scrollTrigger: iconsTrigger });

          // Word-by-word scrolling color animation
          const clickWords = document.querySelectorAll('.click-scroll-word');
          if (clickWords.length) {
            gsap.fromTo(
              clickWords,
              { color: colors['signal-tint'], opacity: 1 },
              {
                color: colors['text-secondary'],
                opacity: 1,
                ease: 'none',
                duration: 0.2,
                stagger: 0.19,
                scrollTrigger: {
                  trigger: '.click-scroll-height',
                  start: 'top 75%',
                  end: 'top -20%',
                  scrub: 0.8
                }
              }
            );
          }
        }

        // --- C. Services Section ---
        // Service Headline Word Color Scrub
        const serviceHeadlineWords = splitIntoSpans('.service-headline', 'words');
        if (serviceHeadlineWords.length) {
          gsap.fromTo(
            serviceHeadlineWords,
            { color: colors['signal-tint'], opacity: 1 },
            {
              color: colors['text-secondary'],
              opacity: 1,
              ease: 'power2.out',
              duration: 0.2,
              stagger: 0.19,
              scrollTrigger: {
                trigger: '.service-headline',
                start: 'top 95%',
                end: 'top 25%',
                scrub: 0.8
              }
            }
          );
        }

        // Service Titles Scrub
        gsap.utils.toArray('.service-h2').forEach((title) => {
          const titleWords = splitIntoSpans(title, 'words');
          if (titleWords.length) {
            gsap.fromTo(
              titleWords,
              { color: colors['signal'], opacity: 0.35, scale: 0.98 },
              {
                color: colors['text-secondary'],
                opacity: 1,
                scale: 1,
                ease: 'power2.out',
                stagger: { amount: 0.4, from: 'start' },
                scrollTrigger: {
                  trigger: title,
                  start: 'top 85%',
                  end: 'top 50%',
                  scrub: 0.8
                }
              }
            );
          }
        });

        // 3D Card Reveal / Unfold Animation (matching Webflow t-6d9588ef)
        gsap.utils.toArray('.service-wrapper').forEach((card) => {
          const row = card.querySelector('.cont-imgs-service');
          const masks = card.querySelectorAll('.mask-img-service');
          if (row && masks.length) {
            const reveal = gsap.timeline({ scrollTrigger: {
              trigger: row, start: 'top 95%', end: 'top 38%', scrub: 0.65,
              invalidateOnRefresh: true
            }});
            masks.forEach((mask, index) => {
              const outer = index === 0 || index === masks.length - 1;
              reveal.fromTo(mask, {
                y: outer ? 110 : 155, rotationX: outer ? 58 : 72,
                rotationZ: (index - (masks.length - 1) / 2) * 3,
                scale: 0.94, opacity: 0.15, transformOrigin: '50% 100%'
              }, {
                y: 0, rotationX: 0, rotationZ: 0, scale: 1, opacity: 1,
                duration: 1, ease: 'power2.out'
              }, index * 0.12);
            });
          }

          // Card text slight parallax
          const cardText = card.querySelector('.cont-text-service');
          if (cardText) {
            gsap.fromTo(
              cardText,
              { y: '0vw' },
              {
                y: '5vw',
                ease: 'none',
                scrollTrigger: {
                  trigger: card,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.8
                }
              }
            );
          }
        });

        // Framer & Webflow badge parallax
        gsap.fromTo(
          '.webflow-frame, .framer-frame',
          { yPercent: 15 },
          {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: '.cont-title-service.webflow',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            }
          }
        );

        // --- D. "Good Design Takes Time" Pinned Storytelling Section ---
        const benefitsWrapper = document.querySelector('.benefits-main-wrapper');
        const benefitsSticky = document.querySelector('.bg-benefits-wrapper');

        if (benefitsWrapper && benefitsSticky) {
          // 1. GSAP ScrollTrigger Pinning
          ScrollTrigger.create({
            trigger: benefitsWrapper,
            pin: benefitsSticky,
            start: 'top top',
            end: 'bottom bottom',
            pinSpacing: false
          });

          // 2. Scrubbed Storytelling Timeline
          const benefitsTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: benefitsWrapper,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.8
            }
          });

          // Initial positions
          gsap.set('.light-jm-img', { opacity: 0 });
          gsap.set('.dark-jm-img', { opacity: 1 });
          gsap.set('.main-cont-step1', { opacity: 1, y: 0 });
          gsap.set('.main-cont-step2', { opacity: 0, y: 30 });
          gsap.set('.line.step1', { scaleX: 0, transformOrigin: 'left' });
          gsap.set('.line-step2', { scaleX: 0, transformOrigin: 'left' });
          gsap.set('.line-benefit', { scaleX: 0, transformOrigin: 'left' });
          gsap.set('.check-icon', { opacity: 0, scale: 0.7 });
          gsap.set('.cont-cta-benefitc', { opacity: 0, y: 12 });

          gsap.fromTo('.h2-headline-step1-1', { x: () => { const el = document.querySelector('.h2-headline-step1-1'); return (el.parentElement.clientWidth - el.offsetWidth) / 2; } }, {
            x: '0%', ease: 'none', scrollTrigger: { trigger: benefitsWrapper,
              start: 'top 85%', end: 'top top', scrub: 0.8, invalidateOnRefresh: true }
          });
          gsap.fromTo('.h2-headline-step1-2', { x: () => { const el = document.querySelector('.h2-headline-step1-2'); return -(el.parentElement.clientWidth - el.offsetWidth) / 2; } }, {
            x: '0%', ease: 'none', scrollTrigger: { trigger: benefitsWrapper,
              start: 'top 85%', end: 'top top', scrub: 0.8, invalidateOnRefresh: true }
          });
          const savingsWords = splitIntoSpans('.h2-headline-step1-3', 'words');

          // Step 1: Text slides & Line draws (0% - 30%)
          benefitsTimeline
            .fromTo('.h2-headline-step1-1', { x: '0%' }, { x: '-10vw', ease: 'none', immediateRender: false, duration: 0.3 }, 0)
            .fromTo('.h2-headline-step1-2', { x: '0%' }, { x: '10vw', ease: 'none', immediateRender: false, duration: 0.3 }, 0)
            .fromTo('.line.step1', { scaleX: 0 }, { scaleX: 1, ease: 'power2.inOut', duration: 0.18 }, 0.08)
            .fromTo(savingsWords, { opacity: 0, y: 18, clipPath: 'inset(0 100% 0 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0% 0 0)', duration: 0.045, stagger: 0.022, ease: 'power2.out' }, 0.09)
            .to(savingsWords, { opacity: 0, y: -12, duration: 0.035, stagger: 0.012 }, 0.29)
            .fromTo('.jm-siluete-img, .dark-jm-img', { y: '-2vw' }, { y: '2vw', ease: 'none', duration: 0.3 }, 0);

          // Transition: Step 1 fades out, image turns light, Step 2 enters (30% - 44%)
          benefitsTimeline
            .to('.main-cont-step1', { opacity: 0, y: -30, duration: 0.06, ease: 'power2.in' }, 0.39)
            .to('.light-jm-img', { opacity: 1, duration: 0.14, ease: 'power2.inOut' }, 0.3)
            .to('.main-cont-step2', { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.32);

          // Step 2: Checklist & CTA Reveal (44% - 68%)
          benefitsTimeline
            .fromTo('.step2-headline-wrapper', { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.44)
            .fromTo('.line-step2', { scaleX: 0 }, { scaleX: 1, duration: 0.12, ease: 'power2.out' }, 0.48)
            .fromTo('.item-benefits-cont', { opacity: 0, y: 15 }, { opacity: 1, y: 0, stagger: 0.04, duration: 0.18 }, 0.52)
            .fromTo('.check-icon', { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, stagger: 0.04, duration: 0.15 }, 0.54)
            .fromTo('.line-benefit', { scaleX: 0 }, { scaleX: 1, stagger: 0.04, duration: 0.15 }, 0.56)
            .fromTo('.cont-cta-benefitc', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.12 }, 0.65)
            // Include the CTA's bottom breathing room when fitting the checklist to the viewport.
            .to('.main-cont-step2', { y: () => -Math.max(0, document.querySelector('.main-cont-step2').offsetHeight + parseFloat(getComputedStyle(document.querySelector('.main-cont-step2')).top) + window.innerWidth * 0.025 - window.innerHeight), duration: 0.3, ease: 'none' }, 0.7);
        }

        // --- E. Work Folder CTA Section ---
        gsap.fromTo(
          '.work-cta-content-wrapper',
          { y: '5vw' },
          {
            y: '-5vw',
            ease: 'none',
            scrollTrigger: {
              trigger: '.work-cta-wrapper',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8
            }
          }
        );

        // Work Folder Hover 3D Flap & Ambient Background Text
        const folder = document.querySelector('.folder-wrapper');
        const workText = document.querySelector('.work-big-text');
        let folderHovered = false;

        if (workText) {
          gsap.set(workText, {
            opacity: 0.52,
            color: 'var(--ribbon-accent, #FFBC95)'
          });

          ScrollTrigger.create({
            trigger: '.work-cta-wrapper',
            start: 'top 85%',
            end: 'bottom 15%',
            onEnter: () => {
              if (!folderHovered) {
                gsap.to(workText, { opacity: 0.52, color: 'var(--ribbon-accent, #FFBC95)', duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
              }
            },
            onLeaveBack: () => {
              if (!folderHovered) {
                gsap.to(workText, { opacity: 0.2, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
              }
            }
          });
        }

        if (folder) {
          const front = folder.querySelector('.front-folder');
          const projects = folder.querySelector('.projects-folder');
          const files = folder.querySelectorAll('.folder-project-card');

          const onFolderEnter = () => {
            folderHovered = true;
            if (front) gsap.to(front, { rotationX: -35, duration: 0.68, ease: 'elastic.out(0.7, 0.3)', overwrite: true });
            if (projects) gsap.to(projects, { y: -40, duration: 0.65, ease: 'power2.out', overwrite: true });
            gsap.to(files, { y: i => -(i + 1) * 22, x: i => (i - (files.length - 1) / 2) * 12, rotation: i => (i - (files.length - 1) / 2) * 3, duration: 0.8, stagger: 0.055, ease: 'power3.out', overwrite: true });
            if (workText) {
              gsap.to(workText, {
                opacity: 1,
                color: 'var(--signal-hover-dark, #FF6A4F)',
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true
              });
            }
          };

          const onFolderLeave = () => {
            folderHovered = false;
            if (front) gsap.to(front, { rotationX: 0, duration: 0.5, ease: 'power2.inOut', overwrite: true });
            if (projects) gsap.to(projects, { y: 0, duration: 0.6, ease: 'power2.inOut', overwrite: true });
            gsap.to(files, { y: i => i * -7, x: 0, rotation: 0, duration: 0.7, ease: 'power3.out', overwrite: true });
            if (workText) {
              gsap.to(workText, {
                opacity: 0.52,
                color: 'var(--ribbon-accent, #FFBC95)',
                duration: 0.4,
                ease: 'power2.out',
                overwrite: true
              });
            }
          };

          listen(folder, 'mouseenter', onFolderEnter);
          listen(folder, 'mouseleave', onFolderLeave);
          listen(folder, 'focus', onFolderEnter);
          listen(folder, 'blur', onFolderLeave);
        }

        // --- F. CTA & Footer Section ---
        // CTA text scrub
        const ctaHeadingWords = splitIntoSpans('.heading-cta.main', 'words');
        if (ctaHeadingWords.length) {
          gsap.fromTo(
            ctaHeadingWords,
            { opacity: 0 },
            {
              opacity: 1,
              stagger: { amount: 0.4, from: 'start' },
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '.content-cta-wrapper',
                start: 'top bottom',
                end: 'top 40%',
                scrub: 0.8
              }
            }
          );
        }

        // Footer Name Reveal (masked rise from 10vw -> 0vw)
        gsap.fromTo(
          '.name-footer',
          { y: '10vw' },
          {
            y: '0vw',
            ease: 'power2.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: '.main-cta-wrapper',
              start: 'bottom center',
              end: 'bottom top',
              scrub: 0.8
            }
          }
        );

        // Footer slide-up
        gsap.fromTo(
          '.section.footer',
          { y: '-15vw' },
          {
            y: '0vw',
            ease: 'none',
            scrollTrigger: {
              trigger: '.main-cta-wrapper',
              start: 'bottom 105%',
              end: 'bottom top',
              scrub: 0.8
            }
          }
        );
      }

      // 4. ABOUT PAGE ANIMATIONS
      if (pathname === '/about') {
        // A. Hero Headline & Pill Entrance
        gsap.fromTo(
          '.text-headline-about',
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 1, delay: 0.15, ease: 'power3.out' }
        );

        gsap.from('.pill-hero-about-wrapper', {
          scale: 0.65,
          rotation: -15,
          duration: 1,
          ease: 'back.out(1.4)'
        });

        // B. Sticky Circles Lottie & Big Portrait Timeline (matching Webflow t-4b300411)
        gsap.set('.big-about-cont', { opacity: 0, scale: 1.12 });
        gsap.set('.circle-lottie-cont', { opacity: 1 });

        const aboutScrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.about-scroll-wrapper',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8
          }
        });

        aboutScrollTl
          // 0 to 45% scroll: Circles scale up and fill the screen over clean warm background
          .fromTo('.circle-lottie-cont', { scale: 0.9, opacity: 1 }, { scale: 1.45, opacity: 1, duration: 2.4, ease: 'none' }, 0)
          .fromTo('.cont-shine-mask', { y: '12vw', opacity: 0 }, { y: '-22vw', opacity: 0.7, duration: 1.5, ease: 'none' }, 0)
          // 45% to 75% scroll: Big portrait photo smoothly fades in from behind
          .fromTo('.big-about-cont',
            { opacity: 0, scale: 1.12 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.inOut' },
            1.2
          )
          // 75% to 100% scroll: Circles fade out cleanly, leaving portrait photo ready for bio transition
          .to('.circle-lottie-cont', { opacity: 0, scale: 1.65, duration: 0.8, ease: 'power1.in' }, 2.4)
          .to('.cont-shine-mask', { opacity: 0, duration: 0.8, ease: 'power1.in' }, 2.4);

        // C. Parallax Drift on Big Portrait as user enters bio
        const bioWrapper = document.querySelector('.about-bio-wrapper');
        if (bioWrapper) {
          gsap.to('.big-about-cont', {
            y: '10vw',
            ease: 'none',
            scrollTrigger: {
              trigger: bioWrapper,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.8
            }
          });

          // Bio divider lines drawing animation
          document.querySelectorAll('.line.about').forEach((line) => {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: 'left center' },
              {
                scaleX: 1,
                duration: 0.85,
                ease: 'power2.inOut',
                scrollTrigger: {
                  trigger: line,
                  start: 'top 90%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          });

          // Bio Items Reveal: Line-by-Line Editorial Animation
          document.querySelectorAll('.cont-bio-tem').forEach((item) => {
            const headline = item.querySelector('.headline-bio');
            const copy = item.querySelector('.body-copy');

            if (headline) {
              gsap.fromTo(
                headline,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: 'power3.out',
                  scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }

            const paragraphs = item.querySelectorAll('.body-copy');
            if (paragraphs.length) {
              paragraphs.forEach((p) => {
                const lines = splitIntoSpans(p, 'words');
                if (lines && lines.length) {
                  gsap.fromTo(
                    lines,
                    { opacity: 0.2, clipPath: 'inset(0 100% 0 0)' },
                    {
                      opacity: 1,
                      clipPath: 'inset(0 0% 0 0)',
                      duration: 0.3,
                      stagger: 0.035,
                      ease: 'power3.out',
                      scrollTrigger: {
                        trigger: p,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                      }
                    }
                  );
                }
              });
            }
          });
        }

        // D. News & Updates Section Animations
        const newsWrapper = document.querySelector('.about-news-wrapper');
        if (newsWrapper) {
          // News Top Header
          const newsTop = newsWrapper.querySelector('.news-cont-top');
          if (newsTop) {
            gsap.fromTo(
              newsTop,
              { opacity: 0, y: 25 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: newsTop,
                  start: 'top 90%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          }

          // News Divider Lines Drawing
          document.querySelectorAll('.line.news').forEach((line) => {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: 'left center' },
              {
                scaleX: 1,
                duration: 0.85,
                ease: 'power2.inOut',
                scrollTrigger: {
                  trigger: line,
                  start: 'top 90%',
                  toggleActions: 'play none none reverse'
                }
              }
            );
          });

          // Each News Block (News 1, News 2, News 3)
          document.querySelectorAll('.cont-news-wrapper').forEach((block) => {
            const headlineNews = block.querySelector('.cont-headline-news');
            if (headlineNews) {
              const children = Array.from(headlineNews.children);
              gsap.fromTo(
                children,
                { opacity: 0, y: 35 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  stagger: 0.1,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: block,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }

            // Cards Reveal (Domestika 3 cards, Don't Scroll Down 2 cards)
            const cards = block.querySelectorAll('.cont-img-news .w-layout-cell');
            if (cards.length) {
              gsap.fromTo(
                cards,
                { opacity: 0, y: 35 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.9,
                  stagger: 0,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: block,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                  }
                }
              );
            }

            // 3D Perspective Tilt on Scroll Exit (Exact Webflow t-4e4505a1 Interaction)
            gsap.fromTo(
              block,
              { y: '0vw', scale: 1, rotationX: 0, rotationZ: 0, opacity: 1 },
              {
                y: '40vw',
                scale: 0.9,
                rotationX: -10,
                rotationZ: -3,
                opacity: 0.9,
                ease: 'none',
                transformOrigin: '50% 100%',
                scrollTrigger: {
                  trigger: block,
                  start: 'bottom 50%',
                  end: 'bottom top',
                  scrub: 0.8
                }
              }
            );
          });
        }
      }

      // Project cards enter with a gentle upward reveal, without scale or bounce.
      if (pathname === '/work') {
        gsap.utils.toArray('.main-project-wrapper').forEach(project => {
          const media = project.querySelectorAll('.cont-project-imgs > *');
          media.forEach(item => gsap.fromTo(item,
            { clipPath: 'inset(8% 0 0 0)', y: 48, opacity: 0.25 },
            { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 1.05, ease: 'power2.out',
              scrollTrigger: { trigger: item, start: 'top 94%', once: true } }
          ));
        });
      }

      // 6. BUTTON ELASTIC HOVERS (.main-cont-button)
      document.querySelectorAll('.main-cont-button').forEach((link) => {
        const first = link.querySelector('.icon-wrapper-cta-first');
        const last = link.querySelector('.icon-wrapper-cta');
        if (!first || !last) return;

        const onEnter = () => {
          gsap.to(first, {
            width: '2.8rem',
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'elastic.out(0.5, 0.3)',
            overwrite: true
          });
          gsap.to(last, {
            width: '0rem',
            rotation: -90,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: true
          });
        };

        const onLeave = () => {
          gsap.to(first, {
            width: '0rem',
            rotation: -90,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            overwrite: true
          });
          gsap.to(last, {
            width: '2.8rem',
            rotation: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'elastic.out(0.6, 0.3)',
            overwrite: true
          });
        };

        listen(link, 'mouseenter', onEnter);
        listen(link, 'mouseleave', onLeave);
        listen(link, 'focus', onEnter);
        listen(link, 'blur', onLeave);
      });

      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    // 7. Navigation Theme Switcher (data-nav="peach" / "grey")
    const navItems = document.querySelectorAll('.nav-name-jm, .nav-link-mobile, .nav-link, .nav-social-link');
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const isPeach = entry.target.dataset.nav === 'peach';
            navItems.forEach((el) => el.classList.toggle('is-peach', isPeach));
          }
        });
      },
      { rootMargin: '-50px 0px -85% 0px' }
    );
    document.querySelectorAll('[data-nav]').forEach((el) => navObserver.observe(el));

    // 8. Video Autoplay In-View Observer
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) target.play().catch(() => {});
          else target.pause();
        });
      },
      { rootMargin: '200px' }
    );
    document.querySelectorAll('video[autoplay]').forEach((el) => videoObserver.observe(el));

    // 9. ScrollTrigger Refresh on Load & Font Ready
    let frame;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    document.querySelectorAll('img').forEach((el) => listen(el, 'load', refresh));

    let live = true;
    document.fonts.ready.then(() => {
      if (live) refresh();
    });

    // Refresh after short delay for dynamic DOM settling
    const timer = setTimeout(() => {
      if (live) refresh();
    }, 400);

    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    }

    return () => {
      live = false;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      disposers.forEach((fn) => fn());
      navObserver.disconnect();
      videoObserver.disconnect();
      mm.revert();
    };
  }, [pathname, data]);

  return null;
}

