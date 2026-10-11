import React, { useEffect, useRef } from 'react';
import { gsap } from '../utils/motion';
import BrandMark from './BrandMark';

export default function LogoTile() {
  const containerRef = useRef(null);
  const tileRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const link = container.closest('a') || container;
    const tile = tileRef.current;
    const orbitDot = dotRef.current;
    const staticDot = tile.querySelector('.brand-mark-dot');

    let timeline;

    const runOrbit = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (timeline && timeline.isActive()) return;

      timeline?.kill();

      // Box dimensions: .jm-icon is 30px x 30px, center is (0, 0)
      // The mark dot resting position relative to center is around (8.4px, 0.8px)
      const dockX = 8.4;
      const dockY = 0.8;

      // Orbit radii around the 30px box (half-width = 15px, half-height = 15px)
      const rx = 24; // clears the 15px outer box boundary cleanly
      const ry = 9;  // 3D perspective tilt

      if (staticDot) gsap.set(staticDot, { opacity: 0 });
      gsap.set(orbitDot, {
        x: dockX,
        y: dockY,
        scale: 1,
        opacity: 1,
        zIndex: 2,
      });

      timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(orbitDot, { opacity: 0, x: dockX, y: dockY, zIndex: 0 });
          if (staticDot) gsap.set(staticDot, { opacity: 1 });
          gsap.set(tile, { clearProps: 'transform' });
        }
      });

      // Subtle organic reaction on the white box
      timeline.to(tile, {
        scaleX: 1.14,
        scaleY: 0.88,
        duration: 0.16,
        ease: 'power2.out',
      }, 0);
      timeline.to(tile, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.9,
        ease: 'elastic.out(1, 0.35)',
      }, 0.16);

      const orbitState = { progress: 0 };

      timeline.to(orbitState, {
        progress: 1,
        duration: 1.35,
        ease: 'power1.inOut',
        onUpdate: () => {
          const p = orbitState.progress;

          let x, y, scale, zIndex;

          if (p < 0.12) {
            // 1. Depart from dock outward to the right edge (rx, -1)
            const t = p / 0.12;
            const easeT = t * t * (3 - 2 * t);
            x = dockX + (rx - dockX) * easeT;
            y = dockY + (-1 - dockY) * easeT;
            scale = 1 - 0.22 * easeT;
            zIndex = easeT > 0.5 ? 0 : 2;
          } else if (p < 0.54) {
            // 2. TRAVEL BEHIND THE WHITE BOX (Right -> Top/Back -> Left)
            // Passes behind the opaque white box (zIndex: 0 vs tile zIndex: 1)
            const t = (p - 0.12) / (0.54 - 0.12);
            const angle = t * Math.PI; // 0 -> PI
            x = Math.cos(angle) * rx;  // +rx to -rx (right to left)
            y = -Math.sin(angle) * ry; // -0 to -ry to -0
            scale = 0.78;
            zIndex = 0; // Behind the white box!
          } else if (p < 0.88) {
            // 3. TRAVEL IN FRONT OF THE WHITE BOX (Left -> Bottom/Front -> Right)
            // Emerges on the left and sweeps across front of the white box (zIndex: 3)
            const t = (p - 0.54) / (0.88 - 0.54);
            const angle = Math.PI + t * Math.PI; // PI -> 2*PI
            x = Math.cos(angle) * rx;            // -rx to +rx (left to right)
            y = -Math.sin(angle) * ry;           // 0 to +ry to 0
            scale = 1.24;
            zIndex = 3; // In front of the white box!
          } else {
            // 4. Smoothly dock back into the logo mark dot
            const t = (p - 0.88) / (1.0 - 0.88);
            const easeT = t * t * (3 - 2 * t);
            x = rx + (dockX - rx) * easeT;
            y = 0 + (dockY - 0) * easeT;
            scale = 1.24 + (1.0 - 1.24) * easeT;
            zIndex = 3;
          }

          gsap.set(orbitDot, { x, y, scale, zIndex });
        }
      }, 0);
    };

    link.addEventListener('pointerenter', runOrbit);
    link.addEventListener('focus', runOrbit);

    return () => {
      timeline?.kill();
      link.removeEventListener('pointerenter', runOrbit);
      link.removeEventListener('focus', runOrbit);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="logo-tile-container"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 3D Orbiting Satellite Dot - Clean flat brand color with NO glow */}
      <div
        ref={dotRef}
        className="orbit-satellite-dot"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '5.5px',
          height: '5.5px',
          borderRadius: '50%',
          backgroundColor: 'var(--signal, #ff4d2e)',
          boxShadow: 'none',
          filter: 'none',
          pointerEvents: 'none',
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          willChange: 'transform, opacity, z-index',
        }}
      />
      {/* White Box Tile */}
      <div
        ref={tileRef}
        className="jm-icon"
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <BrandMark />
      </div>
    </div>
  );
}
