import React from 'react';
import Editor from '@monaco-editor/react';
 

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
    <div className="vsc-editor-outer">
      {/* Tab bar */}
      <div className="vsc-tabbar">
        {openTabs.map(tab => (
          <div
            key={tab.id}
            className={`vsc-tab${activeTab === tab.id ? ' vsc-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="vsc-tab-label">{tab.name}</span>
            <span className="vsc-tab-close" onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}>×</span>
          </div>
        ))}
      </div>

      {/* Editor */}
      <div className="vsc-editor-inner">
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