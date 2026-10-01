import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/motion';
import BrandMark from './BrandMark';

export default function LogoTile() {
  const ref = useRef(null);
  useEffect(() => {
    const tile = ref.current;
    const link = tile.closest('a');
    const svg = tile.querySelector('svg');
    const dot = tile.querySelector('.brand-mark-dot');
    let animation;
    const play = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      animation?.kill();
      gsap.set([tile, dot], { clearProps: 'transform' });
      const units = 1000 / svg.getBoundingClientRect().width;
      const rx = tile.offsetWidth * units / 2 + 110;
      const ry = tile.offsetHeight * units / 2 + 110;
      const orbit = { progress: 0 };
      animation = gsap.timeline({ onComplete: () => gsap.set([tile, dot], { clearProps: 'transform' }) });
      animation.to(tile, { scaleX: 1.22, scaleY: .82, duration: .18, ease: 'power2.out' }, 0)
        .to(tile, { scaleX: 1, scaleY: 1, duration: 1.1, ease: 'elastic.out(1,.3)' }, .18)
        .to(orbit, { progress: 1, duration: 1.5, ease: 'none', onUpdate: () => {
          const p = orbit.progress;
          let x, y;
          if (p < .12 || p > .88) {
            const t = p < .12 ? p / .12 : (1 - p) / .12;
            const smooth = t * t * (3 - 2 * t);
            x = (500 + rx - 920) * smooth;
            y = (285 - 326) * smooth;
          } else {
            const angle = -(p - .12) / .76 * Math.PI * 2;
            x = 500 + Math.cos(angle) * rx - 920;
            y = 285 + Math.sin(angle) * ry - 326;
          }
          gsap.set(dot, { x, y });
        } }, 0);
    };
    link.addEventListener('pointerenter', play);
    link.addEventListener('focus', play);
    return () => { animation?.kill(); link.removeEventListener('pointerenter', play); link.removeEventListener('focus', play); };
  }, []);
  return <div ref={ref} className="jm-icon"><BrandMark /></div>;
}
