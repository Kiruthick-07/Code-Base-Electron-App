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

  const toHTML = () => {
    const { text, backgroundColor, color, padding, borderRadius } = propsState;
    const style = [
      `background-color: ${backgroundColor};`,
      `color: ${color};`,
      `padding: ${padding};`,
      `border: none;`,
      `border-radius: ${borderRadius};`,
      `cursor: pointer;`,
    ].join(' ');
    return `<button style="${style}">${escapeHtml(text)}</button>`;
  };

  const handleInsert = async () => {
    insertSnippetAtCursor(toHTML());
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

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ width: 440, background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, padding: 16, color: '#e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Add {componentKey}</h3>
          <button onClick={onClose} style={{ background: 'transparent', color: '#e5e7eb', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>

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

        <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>Preview</div>
        <div style={{ marginTop: 6, padding: 16, background: '#0b0f19', borderRadius: 6, border: '1px solid #111', display: 'flex', justifyContent: 'center' }}>
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
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={handleInsert} className="cb-btn cb-btn-primary cb-btn-small">Insert</button>
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#333' }} />

        <div style={{ fontWeight: 600, marginBottom: 8 }}>Presets</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Preset name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
          <button onClick={handleSavePreset} style={{ padding: '6px 10px' }}>Save Preset</button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10 }}>
          <select value={selectedPreset} onChange={e => setSelectedPreset(e.target.value)} style={{ flex: 1, padding: 8, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }}>
            <option value="">Select preset</option>
            {Object.entries(presets[componentKey] || {}).map(([k]) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button onClick={handleApplyPreset} style={{ padding: '6px 10px' }}>Apply Preset</button>
          <button onClick={handleDeletePreset} style={{ padding: '6px 10px' }}>Delete Preset</button>
        </div>
      </div>
    </div>
  );
}


