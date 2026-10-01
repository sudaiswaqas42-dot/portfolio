import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { themeColors } from '../utils/theme';

// Recolor decorative artwork while retaining its original light and shadow.
export default function ThemeFilters() {
  const { data } = usePortfolio();
  const colors = themeColors(data.theme);
  const rgb = value => [1,3,5].map(offset => parseInt(value.slice(offset,offset+2),16)/255);
  const stops = [colors['signal-pressed'], colors.signal, colors['signal-tint']].map(rgb);
  return <svg width="0" height="0" aria-hidden="true" style={{position:'absolute',pointerEvents:'none'}}><defs>
    <filter id="theme-artwork" colorInterpolationFilters="sRGB">
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncR type="table" tableValues={stops.map(color => color[0]).join(' ')} />
        <feFuncG type="table" tableValues={stops.map(color => color[1]).join(' ')} />
        <feFuncB type="table" tableValues={stops.map(color => color[2]).join(' ')} />
      </feComponentTransfer>
    </filter>
    <filter id="theme-icon" colorInterpolationFilters="sRGB"><feFlood floodColor="var(--text-secondary)" /><feComposite in2="SourceAlpha" operator="in" /></filter>
    <filter id="theme-tint" colorInterpolationFilters="sRGB"><feFlood floodColor="var(--signal-tint)" /><feComposite in2="SourceAlpha" operator="in" /></filter>
    <filter id="theme-ribbon" colorInterpolationFilters="sRGB"><feFlood floodColor="var(--ribbon-accent, #FFBC95)" /><feComposite in2="SourceAlpha" operator="in" /></filter>
  </defs></svg>;
}
