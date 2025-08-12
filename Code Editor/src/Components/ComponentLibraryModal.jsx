









import React, { useEffect, useMemo, useState } from 'react';
import { useEditorContext } from '../EditorContext';

const STORAGE_KEY = 'cb_component_presets_v1';

const defaultConfig = {
  Button: {
    defaultProps: {
      text: 'Click Me',
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px 16px',
      borderRadius: '4px',
    },
  },
  Card: {
    defaultProps: {
      heading: 'Card Heading',
      subheading: 'Subheading',
      content: 'This is the card content.',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: 'small',
    },
  },
};

function loadPresets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePresets(obj) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export default function ComponentLibraryModal({ isOpen, onClose, componentKey = 'Button' }) {
  const { insertSnippetAtCursor } = useEditorContext();
  const [presets, setPresets] = useState(loadPresets());
  const [name, setName] = useState('');
  const [propsState, setPropsState] = useState(defaultConfig[componentKey].defaultProps);
  const [selectedPreset, setSelectedPreset] = useState('');

  useEffect(() => {
    setPropsState(defaultConfig[componentKey].defaultProps);
  }, [componentKey]);

  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  const config = useMemo(() => defaultConfig[componentKey], [componentKey]);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setPropsState(prev => ({ ...prev, [key]: value }));
  };

  const escapeHtml = (s) => (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const getBoxShadowCSS = (intensity) => {
    switch (intensity) {
      case 'small':
        return '0 2px 4px rgba(0,0,0,0.1)';
      case 'medium':
        return '0 4px 8px rgba(0,0,0,0.15)';
      case 'large':
        return '0 8px 16px rgba(0,0,0,0.2)';
      default:
        return 'none';
    }
  };

  const toJSX = () => {
    if (componentKey === 'Button') {
      const { text, backgroundColor, color, padding, borderRadius } = propsState;
      const style = [
        `backgroundColor: '${backgroundColor}',`,
        `color: '${color}',`,
        `padding: '${padding}',`,
        `border: 'none',`,
        `borderRadius: '${borderRadius}',`,
        `cursor: 'pointer',`,
      ].join(' ');
      return `<button style={{${style}}}>${escapeHtml(text)}</button>`;
    } else if (componentKey === 'Card') {
      const { heading, subheading, content, backgroundColor, textColor, padding, borderRadius, boxShadow } = propsState;
      const shadowCSS = getBoxShadowCSS(boxShadow);
      
      return `<div style={{
  backgroundColor: '${backgroundColor}', // Customize background color
  color: '${textColor}', // Customize text color
  padding: '${padding}', // Customize padding
  borderRadius: '${borderRadius}', // Customize border radius
  boxShadow: '${shadowCSS}', // Customize shadow (none/small/medium/large)
  maxWidth: '400px',
  fontFamily: 'Arial, sans-serif'
}}>
  <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>${escapeHtml(heading)}</h2> {/* Customize heading text */}
  <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>${escapeHtml(subheading)}</h4> {/* Customize subheading text */}
  <p style={{ margin: 0, fontSize: '0.95rem' }}>${escapeHtml(content)}</p> {/* Customize content text */}
</div>`;
    }
    return '';
  };

  const handleInsert = async () => {
    insertSnippetAtCursor(toJSX());
    onClose();
  };

  const handleSavePreset = () => {
    if (!name.trim()) return;
    setPresets(prev => ({
      ...prev,
      [componentKey]: {
        ...(prev[componentKey] || {}),
        [name.trim()]: propsState,
      },
    }));
    setName('');
  };

  const handleApplyPreset = () => {
    const compPresets = presets[componentKey] || {};
    const data = compPresets[selectedPreset];
    if (data) setPropsState(data);
  };

  const handleDeletePreset = () => {
    setPresets(prev => {
      const comp = { ...(prev[componentKey] || {}) };
      delete comp[selectedPreset];
      return { ...prev, [componentKey]: comp };
    });
    setSelectedPreset('');
  };

  const renderButtonConfig = () => (
    <>
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Button text</label>
        <input value={propsState.text} onChange={e => handleChange('text', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Background color</label>
          <input type="color" value={propsState.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} style={{ width: '100%', height: 36, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Text color</label>
          <input type="color" value={propsState.color} onChange={e => handleChange('color', e.target.value)} style={{ width: '100%', height: 36, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Padding</label>
          <input value={propsState.padding} onChange={e => handleChange('padding', e.target.value)} placeholder="e.g. 10px 16px" style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Border radius</label>
          <input value={propsState.borderRadius} onChange={e => handleChange('borderRadius', e.target.value)} placeholder="e.g. 4px" style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
      </div>
    </>
  );

  const renderCardConfig = () => (
    <>
      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Heading</label>
        <input value={propsState.heading} onChange={e => handleChange('heading', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Subheading</label>
        <input value={propsState.subheading} onChange={e => handleChange('subheading', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Content</label>
        <textarea value={propsState.content} onChange={e => handleChange('content', e.target.value)} rows={3} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6, resize: 'vertical' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Background color</label>
          <input type="color" value={propsState.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} style={{ width: '100%', height: 36, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Text color</label>
          <input type="color" value={propsState.textColor} onChange={e => handleChange('textColor', e.target.value)} style={{ width: '100%', height: 36, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Padding</label>
          <input value={propsState.padding} onChange={e => handleChange('padding', e.target.value)} placeholder="e.g. 16px" style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Border radius</label>
          <input value={propsState.borderRadius} onChange={e => handleChange('borderRadius', e.target.value)} placeholder="e.g. 8px" style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Box shadow</label>
        <select value={propsState.boxShadow} onChange={e => handleChange('boxShadow', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }}>
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>
    </>
  );

  const renderPreview = () => {
    if (componentKey === 'Button') {
      return (
        <button
          style={{
            backgroundColor: propsState.backgroundColor,
            color: propsState.color,
            padding: propsState.padding,
            border: 'none',
            borderRadius: propsState.borderRadius,
            cursor: 'pointer',
          }}
        >
          {propsState.text}
        </button>
      );
    } else if (componentKey === 'Card') {
      const { heading, subheading, content, backgroundColor, textColor, padding, borderRadius, boxShadow } = propsState;
      const shadowCSS = getBoxShadowCSS(boxShadow);
      
      return (
        <div
          style={{
            backgroundColor: backgroundColor,
            color: textColor,
            padding: padding,
            borderRadius: borderRadius,
            boxShadow: shadowCSS,
            maxWidth: '300px',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>{heading}</h2>
          <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>{subheading}</h4>
          <p style={{ margin: 0, fontSize: '0.95rem' }}>{content}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ width: 480, background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, padding: 16, color: '#e5e7eb', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Add {componentKey}</h3>
          <button onClick={onClose} style={{ background: 'transparent', color: '#e5e7eb', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>

        {componentKey === 'Button' && renderButtonConfig()}
        {componentKey === 'Card' && renderCardConfig()}

        <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>Preview</div>
        <div style={{ marginTop: 6, padding: 16, background: '#0b0f19', borderRadius: 6, border: '1px solid #111', display: 'flex', justifyContent: 'center' }}>
          {renderPreview()}
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={handleInsert} className="cb-btn cb-btn-primary cb-btn-small">Insert</button>
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#333' }} />

        <div style={{ fontWeight: 600, marginBottom: 8 }}>Presets</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Preset name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
          <button onClick={handleSavePreset} className="cb-btn cb-btn-secondary cb-btn-small">Save Preset</button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
          <select value={selectedPreset} onChange={e => setSelectedPreset(e.target.value)} style={{ flex: 1, padding: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }}>
            <option value="">Select preset</option>
            {Object.entries(presets[componentKey] || {}).map(([k]) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button onClick={handleApplyPreset} className="cb-btn cb-btn-secondary cb-btn-small">Apply Preset</button>
          <button onClick={handleDeletePreset} className="cb-btn cb-btn-secondary cb-btn-small">Delete Preset</button>
        </div>
      </div>
    </div>
  );
}


