import React, { useEffect, useMemo, useState } from 'react';
import { useEditorContext } from '../EditorContext';
import './Button.css';

const STORAGE_KEY = 'cb_component_presets_v1';

const defaultConfig = {
  Button: {
    importStatement: "import Button from './Components/Button';\n",
    defaultProps: {
      label: 'Click Me',
      size: 'medium',
      variant: 'primary',
    },
    propOptions: {
      size: ['small', 'medium', 'large'],
      variant: ['primary', 'secondary'],
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
  const { insertComponentWithImport } = useEditorContext();
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

  const toJSX = () => {
    const attrs = Object.entries(propsState)
      .map(([k, v]) => `${k}="${v}"`)
      .join(' ');
    return `<${componentKey} ${attrs} />`;
  };

  const handleInsert = async () => {
    await insertComponentWithImport({ jsx: toJSX(), importStatement: config.importStatement });
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
          <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Label</label>
          <input value={propsState.label} onChange={e => handleChange('label', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Size</label>
            <select value={propsState.size} onChange={e => handleChange('size', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }}>
              {config.propOptions.size.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Variant</label>
            <select value={propsState.variant} onChange={e => handleChange('variant', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }}>
              {config.propOptions.variant.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>Preview</div>
        <div style={{ marginTop: 6, padding: 10, background: '#0b0f19', borderRadius: 6, border: '1px solid #111' }}>
          <code>{`<${componentKey} label="${propsState.label}" size="${propsState.size}" variant="${propsState.variant}" />`}</code>
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


