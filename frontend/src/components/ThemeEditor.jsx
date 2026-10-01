import React from 'react';
import { defaultTheme, themePresets } from '../utils/theme';

const labels = {
  'ribbon-accent': 'Click, scroll & ribbons',
  background: 'Background',
  surface: 'Surface',
  'surface-alt': 'Alternate surface',
  border: 'Border',
  muted: 'Muted',
  'text-secondary': 'Secondary text',
  ink: 'Main text',
  'signal-tint': 'Tint',
  'signal-hover-dark': 'Hover on dark',
  signal: 'Signal',
  'signal-hover': 'Hover',
  'signal-pressed': 'Pressed',
  'signal-text': 'Text on tint'
};

export default function ThemeEditor({ value, onChange }) {
  const currentSignal = value?.accent?.signal?.toUpperCase();

  const handleApplyPreset = (presetKey) => {
    const preset = themePresets[presetKey];
    if (!preset) return;
    onChange({
      mode: value.mode || preset.mode,
      light: { ...preset.light },
      dark: { ...preset.dark },
      accent: { ...preset.accent }
    });
  };

  return (
    <>
      <section className="editor-card">
        <div className="section-heading">
          <div>
            <h2>Site color scheme</h2>
            <p>Save to apply these colors across every public page, including animations and loading screens.</p>
          </div>
          <button type="button" onClick={() => onChange(structuredClone(defaultTheme))}>
            Restore original reference
          </button>
        </div>

        <h3 style={{ marginTop: '20px', marginBottom: '6px', fontSize: '15px', color: '#ffbc95' }}>
          Color scheme palettes
        </h3>
        <p style={{ fontSize: '13px', color: '#a3a9af', margin: '0 0 16px' }}>
          Select Juan Mora's real original cobalt blue palette or switch to the customized warm orange palette.
        </p>

        <div className="preset-grid">
          {Object.entries(themePresets).map(([key, preset]) => {
            const isActive = currentSignal === preset.accent.signal.toUpperCase();
            return (
              <div key={key} className={`preset-card ${isActive ? 'is-active' : ''}`}>
                <div>
                  <div className="preset-header">
                    <span className="preset-tag">{isActive ? '✓ Active on site' : preset.tag}</span>
                  </div>
                  <h4 className="preset-title">{preset.name}</h4>
                  <p className="preset-desc">{preset.description}</p>
                  <div className="preset-swatches">
                    <span className="preset-swatch" style={{ background: preset.accent.signal }} title={`--_color---blue: ${preset.accent.signal}`} />
                    <span className="preset-swatch" style={{ background: preset.accent['signal-tint'] }} title={`--_color---orange1: ${preset.accent['signal-tint']}`} />
                    <span className="preset-swatch" style={{ background: preset.accent['signal-hover-dark'] }} title={`--_color---orange2: ${preset.accent['signal-hover-dark']}`} />
                    <span className="preset-swatch" style={{ background: preset.light.background }} title={`--_color---bg-warm: ${preset.light.background}`} />
                    <span className="preset-swatch" style={{ background: preset.light['surface-alt'] }} title={`--_color---bg-grey: ${preset.light['surface-alt']}`} />
                    <span className="preset-swatch" style={{ background: preset.light.muted }} title={`--_color---grey: ${preset.light.muted}`} />
                  </div>
                </div>
                <button
                  type="button"
                  className={isActive ? 'primary' : ''}
                  onClick={() => handleApplyPreset(key)}
                  disabled={isActive}
                  style={isActive ? { opacity: 0.9, cursor: 'default' } : {}}
                >
                  {isActive ? '✓ Currently Active' : `Apply ${preset.name}`}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #30363b' }}>
          <label className="editor-field" style={{ maxWidth: '380px' }}>
            <span>Theme mode</span>
            <select value={value.mode} onChange={e => onChange({ ...value, mode: e.target.value })}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">Follow visitor's device</option>
            </select>
          </label>
        </div>
      </section>

      {['light', 'dark', 'accent'].map(group => (
        <section className="editor-card" key={group}>
          <h2>{group === 'accent' ? 'Signal accent colors' : `${group === 'light' ? 'Light' : 'Dark'} mode`}</h2>
          <div className="theme-color-grid">
            {Object.entries(value[group]).map(([key, color]) => (
              <div className="theme-color-field" key={key}>
                <input
                  type="color"
                  aria-label={`${group} ${labels[key]} color picker`}
                  value={/^#[0-9a-f]{6}$/i.test(color) ? color : defaultTheme[group][key]}
                  onChange={e => onChange({
                    ...value,
                    [group]: { ...value[group], [key]: e.target.value.toUpperCase() }
                  })}
                />
                <label className="editor-field">
                  <span>{labels[key]}</span>
                  <input
                    aria-label={`${group} ${labels[key]} hex code`}
                    value={color}
                    required
                    pattern="#[0-9A-Fa-f]{6}"
                    maxLength={7}
                    title="Enter a six-digit hex color, such as #2E54FE or #FF4D2E"
                    onChange={e => onChange({
                      ...value,
                      [group]: { ...value[group], [key]: e.target.value }
                    })}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
