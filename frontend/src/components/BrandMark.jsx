import React, { useId } from 'react';
import { useContent } from '../utils/content';

// Vector version of the supplied mark; the dot remains independently animated.
export default function BrandMark({ className = '' }) {
  const id = useId().replace(/:/g, '');
  const content = useContent();
  if(content('brand.logo'))return <svg className={`brand-mark ${className}`} viewBox="0 0 1000 570" aria-hidden="true"><image href={content('brand.logo')} width="1000" height="570" preserveAspectRatio="xMidYMid meet"/><ellipse className="brand-mark-dot" cx="920" cy="326" rx="80" ry="77" opacity="0"/></svg>;
  return <svg className={`brand-mark ${className}`} viewBox="0 0 1000 570" fill="currentColor" aria-hidden="true">
    <defs>
      <filter id={`${id}-silhouette`} colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 -1.3 0 1.2  0 0 -1.3 0 1.2  0 0 -1.3 0 1.2  0 0 0 1 0" />
      </filter>
      <mask id={`${id}-body`} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="570" style={{maskType:'luminance'}}>
        <image href="/images/brand-reference.jpg" width="1000" height="570" filter={`url(#${id}-silhouette)`} />
        <rect x="838" y="245" width="162" height="165" fill="black" />
      </mask>
    </defs>
    <rect width="1000" height="570" mask={`url(#${id}-body)`} />
    <ellipse className="brand-mark-dot" cx="920" cy="326" rx="80" ry="77" />
  </svg>;
}
