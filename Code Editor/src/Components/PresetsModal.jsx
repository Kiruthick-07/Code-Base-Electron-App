import React, { useState, useEffect } from 'react';
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

const escapeHtml = (s) => (s || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const generateJSX = (componentKey, props) => {
  if (componentKey === 'Button') {
    const { text, backgroundColor, color, padding, borderRadius } = props;
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
    const { heading, subheading, content, backgroundColor, textColor, padding, borderRadius, boxShadow } = props;
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

const renderPreview = (componentKey, props) => {
  if (componentKey === 'Button') {
    return (
      <button
        style={{
          backgroundColor: props.backgroundColor,
          color: props.color,
          padding: props.padding,
          border: 'none',
          borderRadius: props.borderRadius,
          cursor: 'pointer',
        }}
      >
        {props.text}
      </button>
    );
  } else if (componentKey === 'Card') {
    const { heading, subheading, content, backgroundColor, textColor, padding, borderRadius, boxShadow } = props;
    const shadowCSS = getBoxShadowCSS(boxShadow);
    
    return (
      <div
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          padding: padding,
          borderRadius: borderRadius,
          boxShadow: shadowCSS,
          maxWidth: '200px',
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

export default function PresetsModal({ isOpen, onClose }) {
  const { insertSnippetAtCursor } = useEditorContext();
  const [presets, setPresets] = useState({});
  const [selectedPreset, setSelectedPreset] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPresets(loadPresets());
    }
  }, [isOpen]);

  const handleApplyPreset = () => {
    if (selectedPreset) {
      const jsx = generateJSX(selectedPreset.componentKey, selectedPreset.props);
      insertSnippetAtCursor(jsx);
      onClose();
    }
  };

  const handleDeletePreset = (componentKey, presetName) => {
    const newPresets = { ...presets };
    delete newPresets[componentKey][presetName];
    if (Object.keys(newPresets[componentKey]).length === 0) {
      delete newPresets[componentKey];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
    setPresets(newPresets);
    setSelectedPreset(null);
  };

  if (!isOpen) return null;

  const allPresets = [];
  Object.entries(presets).forEach(([componentKey, componentPresets]) => {
    Object.entries(componentPresets).forEach(([presetName, props]) => {
      allPresets.push({
        componentKey,
        presetName,
        props,
        displayName: `${componentKey} - ${presetName}`
      });
    });
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
      <div style={{ width: 600, background: '#1e1e1e', border: '1px solid #333', borderRadius: 8, padding: 16, color: '#e5e7eb', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Saved Presets</h3>
          <button onClick={onClose} style={{ background: 'transparent', color: '#e5e7eb', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>

        {allPresets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>No presets saved yet</div>
            <div style={{ fontSize: '14px' }}>Create and save presets in the component library to see them here</div>
          </div>
        ) : (
          <>
            <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>
              Select a preset to apply to your code:
            </div>
            
            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
              {allPresets.map((preset) => (
                <div
                  key={`${preset.componentKey}-${preset.presetName}`}
                  style={{
                    border: selectedPreset === preset ? '2px solid #0078d4' : '1px solid #374151',
                    borderRadius: 8,
                    padding: 12,
                    cursor: 'pointer',
                    background: selectedPreset === preset ? '#1a1a1a' : '#111827',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setSelectedPreset(preset)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        {preset.displayName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>
                        {preset.componentKey} component
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px', background: '#0b0f19', borderRadius: 4 }}>
                        {renderPreview(preset.componentKey, preset.props)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePreset(preset.componentKey, preset.presetName);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px',
                        marginLeft: '8px'
                      }}
                      title="Delete preset"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button 
                onClick={handleApplyPreset} 
                className="cb-btn cb-btn-primary cb-btn-small"
                disabled={!selectedPreset}
                style={{ opacity: selectedPreset ? 1 : 0.5, cursor: selectedPreset ? 'pointer' : 'not-allowed' }}
              >
                Apply Selected Preset
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
