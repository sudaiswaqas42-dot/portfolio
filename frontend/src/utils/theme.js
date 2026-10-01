import defaults from '../../../shared/theme.json';
import presets from '../../../shared/themePresets.json';

export { defaults as defaultTheme, presets as themePresets };
export function normalizeTheme(theme = {}) {
  const result = { mode: ['light', 'dark', 'system'].includes(theme.mode) ? theme.mode : defaults.mode };
  for (const group of ['light', 'dark', 'accent']) {
    result[group] = Object.fromEntries(Object.entries(defaults[group]).map(([key, fallback]) =>
      [key, /^#[0-9a-f]{6}$/i.test(theme[group]?.[key]) ? theme[group][key] : fallback]));
  }
  return result;
}
export function themeColors(theme) {
  const value = normalizeTheme(theme);
  const mode = value.mode === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : value.mode;
  return { ...value[mode], ...value.accent };
}
export function applyTheme(theme) {
  const value = normalizeTheme(theme);
  const root = document.documentElement;
  const activeMode = value.mode === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : value.mode;
  for (const group of ['light', 'dark']) {
    for (const [key, color] of Object.entries(value[group])) root.style.setProperty(`--${group}-${key}`, color);
  }
  for (const [key, color] of Object.entries(themeColors(value))) root.style.setProperty(`--${key}`, color);
  root.style.setProperty('--_color---bg-warm', value[activeMode]?.background || '#FAF6EF');
  root.style.setProperty('--_color---bg-grey', value[activeMode]?.['surface-alt'] || '#F4F4F4');
  root.style.setProperty('--_color---bg-cold', value[activeMode]?.border || '#E8E9EF');
  root.style.setProperty('--_color---grey', value[activeMode]?.['text-secondary'] || '#96908C');
  root.style.setProperty('--_color---orange1', value.accent['signal-tint'] || '#FFBC95');
  root.style.setProperty('--_color---orange2', value.accent['signal-hover-dark'] || '#F99E76');
  root.style.setProperty('--_color---blue', value.accent.signal || '#2E54FE');
  root.style.setProperty('--ribbon-filter', value.accent['ribbon-accent'].toUpperCase() === '#FFBC95' ? 'none' : 'url(#theme-ribbon)');
  root.dataset.theme = activeMode;
}
