import React from 'react';
import Editor from '@monaco-editor/react';
import { useEditorContext } from '../EditorContext';
 

const Codeditor = ({ openTabs, activeTab, setActiveTab, onCloseTab, setOpenTabs }) => {
  const editorOptions = {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'JetBrains Mono, Consolas, monospace',
    minimap: { enabled: true },
    scrollBeyondLastLine: false,
    automaticLayout: true,
  };

 
  const activeFile = openTabs.find(tab => tab.path === activeTab);
  const { setEditorInstance } = useEditorContext();

  return (
    <div className="vsc-editor-outer">
      {/* Tab bar */}
      <div className="vsc-tabbar">
        {openTabs.map(tab => (
          <div
            key={tab.path}
            className={`vsc-tab${activeTab === tab.path ? ' vsc-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.path)}
          >
            <span className="vsc-tab-label">{tab.name}</span>
            <span className="vsc-tab-close" onClick={(e) => { e.stopPropagation(); onCloseTab(tab.path); }}>×</span>
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
            onMount={(editor, monaco) => {
              setEditorInstance(editor, monaco);
              editor.focus();
            }}
            onChange={(newValue) => {
              setOpenTabs(prev =>
                prev.map(tab =>
                  tab.path === activeFile.path ? { ...tab, content: newValue } : tab
                )
              );
              if (window.electronAPI && window.electronAPI.saveFile) {
                window.electronAPI.saveFile(activeFile.path, newValue);
              }
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