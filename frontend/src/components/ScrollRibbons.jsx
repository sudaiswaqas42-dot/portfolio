import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { gsap, ScrollTrigger } from '../utils/motion';
import { useContent } from '../utils/content';

let cachedRibbonData = null;

// The original asset includes both the curved trim paths and their peach-to-cream artwork.
// Its two stroke centers start at x=2087.125 and x=2130 on a 2880px canvas.
export default function ScrollRibbons({ containerRef, lettersRef }) {
  const content = useContent();
  const animationUrl = content('intro.ribbons') || '/documents/ll-scroll.json';
  const artworkRef = useRef(null);

  useEffect(() => {
    const host = artworkRef.current;
    const section = containerRef.current;
    const letters = lettersRef.current;
    if (!host || !section || !letters) return;

    let live = true;
    let refreshFrame;
    let animation = null;
    let tween = null;

    const align = () => {
      const stems = letters.querySelectorAll('.scroll-stem');
      if (stems.length !== 2) return;
      const origin = section.getBoundingClientRect();
      const first = stems[0].getBoundingClientRect();
      const second = stems[1].getBoundingClientRect();
      const fontSize = parseFloat(getComputedStyle(letters).fontSize) || 100;
      let stemDistance = second.left - first.left;
      if (stemDistance <= 0) stemDistance = fontSize * 0.32;
      const scale = stemDistance / (2130 - 2087.125);
      // Use the glyph ink center, not the advance width (which includes letter spacing).
      const left = first.left - origin.left + fontSize * 0.119 - 2087.125 * scale;
      const top = first.top - origin.top + fontSize * 0.79 - 3.5 * scale;
      Object.assign(host.style, {
        width: `${2880 * scale}px`,
        height: `${1897 * scale}px`,
        transform: `translate3d(${left}px, ${top}px, 0)`
      });
    };

    const scheduleRefresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (!live) return;
        align();
        ScrollTrigger.refresh();
      });
    };

    const setupAnimation = (animationData) => {
      if (!live) return;
      if (animation) {
        tween?.scrollTrigger?.kill();
        tween?.kill();
        animation.destroy();
      }

      animation = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: animationData,
        rendererSettings: { preserveAspectRatio: 'xMinYMin meet' }
      });

      const ready = () => {
        if (!live || tween) return;
        align();
        const frame = { value: 0 };
        animation.goToAndStop(0, true);
        const totalFrames = animation.totalFrames || 60;
        tween = gsap.to(frame, {
          value: totalFrames - 1,
          ease: 'none',
          onUpdate: () => animation.goToAndStop(frame.value, true),
          scrollTrigger: {
            trigger: letters,
            start: 'top 78%',
            end: () => `+=${Math.max(window.innerHeight, section.clientWidth * 0.72)}`,
            scrub: 0.45,
            invalidateOnRefresh: true,
            onRefresh: align
          }
        });
        scheduleRefresh();
      };

      if (animation.isLoaded) {
        ready();
      } else {
        animation.addEventListener('DOMLoaded', ready);
        animation.addEventListener('data_ready', ready);
      }
    };

    const loadData = async () => {
      try {
        if (cachedRibbonData) {
          setupAnimation(cachedRibbonData);
          return;
        }
        const res = await fetch(animationUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        cachedRibbonData = data;
        setupAnimation(data);
      } catch (err) {
        console.error('Failed to load ribbon animation data:', err);
        if (live && !animation) {
          animation = lottie.loadAnimation({
            container: host,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: animationUrl,
            rendererSettings: { preserveAspectRatio: 'xMinYMin meet' }
          });
          const ready = () => {
            if (!live || tween) return;
            align();
            const frame = { value: 0 };
            animation.goToAndStop(0, true);
            tween = gsap.to(frame, {
              value: (animation.totalFrames || 60) - 1,
              ease: 'none',
              onUpdate: () => animation.goToAndStop(frame.value, true),
              scrollTrigger: {
                trigger: letters,
                start: 'top 78%',
                end: () => `+=${Math.max(window.innerHeight, section.clientWidth * 0.72)}`,
                scrub: 0.45,
                invalidateOnRefresh: true,
                onRefresh: align
              }
            });
            scheduleRefresh();
          };
          if (animation.isLoaded) {
            ready();
          } else {
            animation.addEventListener('DOMLoaded', ready);
            animation.addEventListener('data_ready', ready);
          }
        }
      }
    };

    loadData();

    const resizeObserver = new ResizeObserver(scheduleRefresh);
    resizeObserver.observe(section);
    resizeObserver.observe(letters);
    window.addEventListener('resize', scheduleRefresh);
    ScrollTrigger.addEventListener('refreshInit', align);
    document.fonts.ready.then(() => { if (live) scheduleRefresh(); });

    return () => {
      live = false;
      cancelAnimationFrame(refreshFrame);
      resizeObserver.disconnect();
      window.removeEventListener('resize', scheduleRefresh);
      ScrollTrigger.removeEventListener('refreshInit', align);
      tween?.scrollTrigger?.kill();
      tween?.kill();
      animation?.destroy();
    };
  }, [containerRef, lettersRef, animationUrl]);

  return <div ref={artworkRef} className="scroll-ribbons" aria-hidden="true" />;
}
