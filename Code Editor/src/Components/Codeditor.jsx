import React from 'react';
import Editor from '@monaco-editor/react';
 // Optional styling for tabs

const Codeditor = ({ openTabs, activeTab, setActiveTab, onCloseTab, setOpenTabs }) => {
  const editorOptions = {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
  };

  // Get current active file
  const activeFile = openTabs.find(tab => tab.id === activeTab);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #333', backgroundColor: '#252526' }}>
        {openTabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              backgroundColor: activeTab === tab.id ? '#1e1e1e' : '#2d2d2d',
              color: '#ccc',
              borderRight: '1px solid #333',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {tab.name}
            <span onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }} style={{ cursor: 'pointer' }}>×</span>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div style={{ flexGrow: 1 }}>
        {activeFile ? (
          <Editor
            height="100%"
            theme="vs-dark"
            language="javascript"
            value={activeFile.content}
            onChange={(newValue) => {
              setOpenTabs(prev =>
                prev.map(tab =>
                  tab.id === activeFile.id ? { ...tab, content: newValue } : tab
                )
              );
            }}
            options={editorOptions}
          />
        ) : (
          <div style={{ color: '#999', padding: 16 }}>Open a file to start editing</div>
        )}
      </div>
    </div>
  );
};

export default Codeditor;
336