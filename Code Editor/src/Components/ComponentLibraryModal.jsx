









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
    const parsed = raw ? JSON.parse(raw) : {};
    console.log('Loaded presets from localStorage:', parsed);
    return parsed;
  } catch (error) {
    console.error('Error loading presets from localStorage:', error);
    return {};
  }
}

function savePresets(obj) {
  try {
    // Ensure we only save serializable data
    const serializableObj = {};
    Object.keys(obj).forEach(componentKey => {
      serializableObj[componentKey] = {};
      Object.keys(obj[componentKey] || {}).forEach(presetName => {
        const preset = obj[componentKey][presetName];
        serializableObj[componentKey][presetName] = {};
        Object.keys(preset).forEach(propKey => {
          const value = preset[propKey];
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            serializableObj[componentKey][presetName][propKey] = value;
          }
        });
      });
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableObj));
  } catch (error) {
    console.error('Error saving presets to localStorage:', error);
    // Don't throw error, just log it to prevent app crashes
  }
}

export default function ComponentLibraryModal({ isOpen, onClose, componentKey = 'Button' }) {
  const { insertSnippetAtCursor } = useEditorContext();
  const [presets, setPresets] = useState(loadPresets());
  const [name, setName] = useState('');
  
  // Debug logging
  console.log('ComponentLibraryModal rendered with componentKey:', componentKey);
  console.log('Initial presets:', presets);
  
  // Safety check: ensure componentKey exists in defaultConfig
  const defaultProps = defaultConfig[componentKey]?.defaultProps || {};
  const [propsState, setPropsState] = useState(defaultProps);
  const [selectedPreset, setSelectedPreset] = useState('');



  useEffect(() => {
    console.log('Presets changed:', presets);
    console.log('Current componentKey:', componentKey);
    console.log('Presets for current component:', presets[componentKey]);
    savePresets(presets);
  }, [presets, componentKey]);

  // Save current component settings to sessionStorage for convenience
  useEffect(() => {
    try {
      if (componentKey && Object.keys(propsState).length > 0) {
        // Only save serializable data to sessionStorage
        const serializableProps = {};
        Object.keys(propsState).forEach(key => {
          const value = propsState[key];
          if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            serializableProps[key] = value;
          }
        });
        sessionStorage.setItem(`cb_component_${componentKey}_session`, JSON.stringify(serializableProps));
      }
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      // Don't throw error to prevent app crashes
    }
  }, [propsState, componentKey]);

  // Load last used settings from sessionStorage when component type changes
  useEffect(() => {
    try {
      // Safety check: ensure componentKey exists in defaultConfig
      if (!defaultConfig[componentKey]) {
        console.error(`Component type "${componentKey}" not found in defaultConfig`);
        return;
      }
      
      const sessionKey = `cb_component_${componentKey}_session`;
      const sessionData = sessionStorage.getItem(sessionKey);
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          // Merge with defaults to ensure all properties exist
          setPropsState(prev => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error('Error parsing sessionStorage data:', e);
          // If parsing fails, fall back to defaults
          setPropsState(defaultConfig[componentKey].defaultProps);
        }
      } else {
        setPropsState(defaultConfig[componentKey].defaultProps);
      }
    } catch (error) {
      console.error('Error loading from sessionStorage:', error);
      // Fall back to defaults if there's any error
      if (defaultConfig[componentKey]) {
        setPropsState(defaultConfig[componentKey].defaultProps);
      }
    }
  }, [componentKey]);

  const config = useMemo(() => defaultConfig[componentKey] || {}, [componentKey]);

  if (!isOpen) return null;
  
  console.log('Modal is open, componentKey:', componentKey);
  console.log('Available component types:', Object.keys(defaultConfig));
  
  // Safety check: ensure componentKey exists in defaultConfig
  if (!defaultConfig[componentKey]) {
    console.error(`Component type "${componentKey}" not found in defaultConfig`);
    return null;
  }

  const handleChange = (key, value) => {
    try {
      setPropsState(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Error updating propsState:', error);
    }
  };

  const escapeHtml = (s) => (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const toHTML = () => {
    try {
      if (componentKey === 'Button') {
        const { text, backgroundColor, color, padding, borderRadius } = propsState;
        const style = [
          `background-color: ${backgroundColor || '#007bff'};`,
          `color: ${color || '#fff'};`,
          `padding: ${padding || '10px 16px'};`,
          `border: none;`,
          `border-radius: ${borderRadius || '4px'};`,
          `cursor: pointer;`,
        ].join(' ');
        return `<button style="${style}">${escapeHtml(text || 'Button')}</button>`;
      } else if (componentKey === 'Card') {
        const { heading, subheading, content, backgroundColor, textColor, padding, borderRadius, boxShadow } = propsState;
        
        // Map box shadow intensity to CSS values
        const shadowMap = {
          none: 'none',
          small: '0 2px 4px rgba(0,0,0,0.1)',
          medium: '0 4px 8px rgba(0,0,0,0.15)',
          large: '0 8px 16px rgba(0,0,0,0.2)'
        };
        
        const boxShadowValue = shadowMap[boxShadow] || shadowMap.small;
        
        // Generate HTML for Card component
        return `<div style="
  background-color: ${backgroundColor || '#ffffff'};
  color: ${textColor || '#333333'};
  padding: ${padding || '16px'};
  border-radius: ${borderRadius || '8px'};
  box-shadow: ${boxShadowValue};
  max-width: 400px;
  font-family: Arial, sans-serif;
">
  <h2 style="margin: 0 0 8px; font-size: 1.25rem;">${escapeHtml(heading || 'Card Heading')}</h2>
  <h4 style="margin: 0 0 12px; font-size: 1rem; color: rgba(0,0,0,0.6);">${escapeHtml(subheading || 'Subheading')}</h4>
  <p style="margin: 0; font-size: 0.95rem;">${escapeHtml(content || 'This is the card content.')}</p>
</div>`;
      }
      return '';
    } catch (error) {
      console.error('Error generating HTML:', error);
      return '<div>Error generating component</div>';
    }
  };

  const handleInsert = async () => {
    try {
      const html = toHTML();
      if (html) {
        insertSnippetAtCursor(html);
        onClose();
      } else {
        alert('Error generating component. Please try again.');
      }
    } catch (error) {
      console.error('Error inserting component:', error);
      alert('Error inserting component. Please try again.');
    }
  };

  const handleSavePreset = () => {
    try {
      if (!name.trim()) return;
      
      // Check if preset name already exists
      const existingPresets = presets[componentKey] || {};
      if (existingPresets[name.trim()]) {
        alert(`Preset "${name.trim()}" already exists. Please use a different name.`);
        return;
      }
      
      // Create a clean copy of propsState with only serializable data
      const cleanPropsState = {};
      Object.keys(propsState).forEach(key => {
        const value = propsState[key];
        // Only save primitive values (strings, numbers, booleans)
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          cleanPropsState[key] = value;
        }
      });
      
      // Debug logging
      console.log('Original propsState:', propsState);
      console.log('Clean propsState:', cleanPropsState);
      console.log('Component Key:', componentKey);
      
      // Check if we have any data to save
      if (Object.keys(cleanPropsState).length === 0) {
        alert('No valid data to save. Please customize the component first.');
        return;
      }
      
      setPresets(prev => {
        const newPresets = {
          ...prev,
          [componentKey]: {
            ...(prev[componentKey] || {}),
            [name.trim()]: cleanPropsState,
          },
        };
        console.log('New presets state:', newPresets);
        return newPresets;
      });
      
      setName('');
      
      console.log(`Preset "${name.trim()}" saved successfully!`);
      console.log('Current presets after save:', presets);
    } catch (error) {
      console.error('Error saving preset:', error);
      alert('Error saving preset. Please try again.');
    }
  };

  const handleApplyPreset = () => {
    try {
      const compPresets = presets[componentKey] || {};
      const data = compPresets[selectedPreset];
      if (data) {
        setPropsState({ ...data }); 
        console.log(`Preset "${selectedPreset}" applied successfully!`);
      }
    } catch (error) {
      console.error('Error applying preset:', error);
      alert('Error applying preset. Please try again.');
    }
  };

  const handleDeletePreset = () => {
    try {
      if (!selectedPreset) return;
      
      
      if (confirm(`Are you sure you want to delete the preset "${selectedPreset}"?`)) {
        const presetName = selectedPreset; 
        setPresets(prev => {
          const comp = { ...(prev[componentKey] || {}) };
          delete comp[selectedPreset];
          return { ...prev, [componentKey]: comp };
        });
        setSelectedPreset('');
        console.log(`Preset "${presetName}" deleted successfully!`);
      }
    } catch (error) {
      console.error('Error deleting preset:', error);
      alert('Error deleting preset. Please try again.');
    }
  };



  const handleClearAllPresets = () => {
    const componentPresets = presets[componentKey] || {};
    if (Object.keys(componentPresets).length === 0) {
      alert('No presets to clear for this component type.');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ALL presets for ${componentKey}? This action cannot be undone.`)) {
      setPresets(prev => {
        const newPresets = { ...prev };
        delete newPresets[componentKey];
        return newPresets;
      });
      setSelectedPreset('');
      alert(`All ${componentKey} presets have been cleared.`);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
      <div style={{ 
        maxWidth: '90vw', 
        maxHeight: '90vh', 
        width: '500px',
        background: '#1e1e1e', 
        border: '1px solid #333', 
        borderRadius: 8, 
        color: '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #333',
          background: '#252525'
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>Add {componentKey}</h3>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', 
              color: '#e5e7eb', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#444'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div style={{ 
          padding: '20px', 
          overflowY: 'auto',
          flex: 1,
          maxHeight: 'calc(90vh - 120px)'
        }}>

        {componentKey === 'Button' && (
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Button text</label>
            <input value={propsState.text} onChange={e => handleChange('text', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
          </div>
        )}

        {componentKey === 'Card' && (
          <>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Heading text</label>
              <input value={propsState.heading} onChange={e => handleChange('heading', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Subheading text</label>
              <input value={propsState.subheading} onChange={e => handleChange('subheading', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Content text</label>
              <textarea value={propsState.content} onChange={e => handleChange('content', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6, minHeight: '60px', resize: 'vertical' }} />
            </div>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Background color</label>
            <input type="color" value={propsState.backgroundColor} onChange={e => handleChange('backgroundColor', e.target.value)} style={{ width: '100%', height: 36, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Text color</label>
            <input type="color" value={componentKey === 'Button' ? propsState.color : propsState.textColor} onChange={e => handleChange(componentKey === 'Button' ? 'color' : 'textColor', e.target.value)} style={{ width: '100%', height: 36, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }} />
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

        {componentKey === 'Card' && (
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#9ca3af' }}>Box shadow</label>
            <select value={propsState.boxShadow} onChange={e => handleChange('boxShadow', e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, background: '#111827', color: '#e5e7eb', border: '1px solid #374151', borderRadius: 6 }}>
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>Preview</div>
        <div style={{ marginTop: 6, padding: 16, background: '#0b0f19', borderRadius: 6, border: '1px solid #111', display: 'flex', justifyContent: 'center' }}>
          {componentKey === 'Button' ? (
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
          ) : componentKey === 'Card' ? (
            <div
              style={{
                backgroundColor: propsState.backgroundColor,
                color: propsState.textColor,
                padding: propsState.padding,
                borderRadius: propsState.borderRadius,
                boxShadow: propsState.boxShadow === 'none' ? 'none' : 
                           propsState.boxShadow === 'small' ? '0 2px 4px rgba(0,0,0,0.1)' :
                           propsState.boxShadow === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                           '0 8px 16px rgba(0,0,0,0.2)',
                maxWidth: '300px',
                fontFamily: 'Arial, sans-serif'
              }}
            >
              <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>{propsState.heading}</h2>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: 'rgba(0,0,0,0.6)' }}>{propsState.subheading}</h4>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{propsState.content}</p>
            </div>
          ) : null}
        </div>

        <hr style={{ margin: '16px 0', borderColor: '#333' }} />

        <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '14px', color: '#e5e7eb' }}>Presets</div>
        
        {/* Save Preset Section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 8 }}>
            Debug: name state = "{name}", type = {typeof name}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input 
              placeholder="Enter preset name..." 
              value={name} 
              onChange={e => {
                console.log('Input onChange:', e.target.value);
                setName(e.target.value);
              }}
              onKeyPress={e => e.key === 'Enter' && handleSavePreset()}
              style={{ 
                flex: 1, 
                padding: '8px 12px', 
                background: '#111827', 
                color: '#e5e7eb', 
                border: '2px solid #374151', 
                borderRadius: 6,
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
                position: 'relative',
                zIndex: 1
              }}
              onMouseEnter={(e) => e.target.style.borderColor = '#0078d4'}
              onMouseLeave={(e) => e.target.style.borderColor = '#374151'}
              onFocus={(e) => {
                console.log('Input focused');
                e.target.style.borderColor = '#0078d4';
              }}
              onBlur={(e) => {
                console.log('Input blurred');
                e.target.style.borderColor = '#374151';
              }}
            />
            <button 
              onClick={handleSavePreset} 
              disabled={!name.trim()}
              style={{ 
                padding: '8px 12px', 
                background: name.trim() ? '#0078d4' : '#374151',
                color: '#e5e7eb',
                border: 'none',
                borderRadius: 6,
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Save Preset
            </button>
            <button 
              onClick={() => {
                console.log('Current name state:', name);
                setName('Test Preset');
                console.log('Set name to Test Preset');
              }}
              style={{ 
                padding: '4px 8px',
                background: '#6c757d',
                color: '#e5e7eb',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '11px'
              }}
            >
              Test
            </button>
          </div>
        </div>

                {/* Load/Manage Presets Section */}
        {Object.keys(presets[componentKey] || {}).length > 0 ? (
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <select 
                value={selectedPreset} 
                onChange={e => setSelectedPreset(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: 8, 
                  background: '#111827', 
                  color: '#e5e7eb', 
                  border: '1px solid #374151', 
                  borderRadius: 6,
                  fontSize: '13px'
                }}
              >
                <option value="">Select a preset...</option>
                {Object.entries(presets[componentKey] || {}).map(([presetName]) => (
                  <option key={presetName} value={presetName}>{presetName}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button 
                onClick={handleApplyPreset} 
                disabled={!selectedPreset}
                style={{ 
                  flex: 1,
                  padding: '8px 12px', 
                  background: selectedPreset ? '#28a745' : '#374151',
                  color: '#e5e7eb',
                  border: 'none',
                  borderRadius: 6,
                  cursor: selectedPreset ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Apply Preset
              </button>
              <button 
                onClick={handleDeletePreset} 
                disabled={!selectedPreset}
                style={{ 
                  padding: '8px 12px', 
                  background: selectedPreset ? '#dc3545' : '#374151',
                  color: '#e5e7eb',
                  border: 'none',
                  borderRadius: 6,
                  cursor: selectedPreset ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '16px', 
            color: '#9ca3af', 
            fontSize: '13px',
            fontStyle: 'italic',
            background: '#111827',
            borderRadius: 6,
            border: '1px dashed #374151'
          }}>
            No presets saved yet. Create your first preset above!
          </div>
        )}

                {/* Clear All Presets Section */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #333' }}>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: 8 }}>Preset Management</div>
          <button 
            onClick={handleClearAllPresets}
            disabled={Object.keys(presets[componentKey] || {}).length === 0}
            style={{ 
              width: '100%',
              padding: '8px 12px', 
              background: Object.keys(presets[componentKey] || {}).length > 0 ? '#dc3545' : '#374151',
              color: '#e5e7eb',
              border: 'none',
              borderRadius: 6,
              cursor: Object.keys(presets[componentKey] || {}).length > 0 ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            Clear All Presets
          </button>
        </div>
        
        {/* Close scrollable content div */}
        </div>
        
        {/* Footer with Insert Button */}
        <div style={{ 
          padding: '16px 20px', 
          borderTop: '1px solid #333',
          background: '#252525',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button 
            onClick={onClose}
            style={{ 
              padding: '8px 16px',
              background: '#6c757d',
              color: '#e5e7eb',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
          >
            Cancel
          </button>
          <button 
            onClick={handleInsert} 
            className="cb-btn cb-btn-primary cb-btn-small"
            style={{ 
              padding: '8px 16px',
              background: '#0078d4',
              color: '#ffffff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#106ebe'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#0078d4'}
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}


