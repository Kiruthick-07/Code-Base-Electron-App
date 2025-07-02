import React, { useState } from 'react'
import './Sidenav.css'

const Sidenav = () => {
  const [expanded, setExpanded] = useState({
    root: true,
    src: true,
    components: true,
  });

  const toggle = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="vscode-sidenav">
      <div className="vscode-folder" onClick={() => toggle('root')}>
        <span className="vscode-folder-icon">{expanded.root ? '▼' : '▶'}</span> Code-Base-Electro...
      </div>
      {expanded.root && (
        <div className="vscode-indent">
          <div className="vscode-folder" onClick={() => toggle('src')}>
            <span className="vscode-folder-icon">{expanded.src ? '▼' : '▶'}</span> src
          </div>
          {expanded.src && (
            <div className="vscode-indent">
              <div className="vscode-folder" onClick={() => toggle('components')}>
                <span className="vscode-folder-icon">{expanded.components ? '▼' : '▶'}</span> Components
              </div>
              {expanded.components && (
                <div className="vscode-indent">
                  <div className="vscode-file"><span className="vscode-file-icon">📄</span>Header.jsx</div>
                  <div className="vscode-file"><span className="vscode-file-icon">📄</span>Header.css</div>
                </div>
              )}
              <div className="vscode-file"><span className="vscode-file-icon">📄</span>App.jsx</div>
              <div className="vscode-file"><span className="vscode-file-icon">📄</span>App.css</div>
              <div className="vscode-file"><span className="vscode-file-icon">📄</span>index.css</div>
              <div className="vscode-file"><span className="vscode-file-icon">📄</span>main.jsx</div>
              <div className="vscode-file"><span className="vscode-file-icon">📄</span>vite-env.d.ts</div>
            </div>
          )}
          <div className="vscode-file"><span className="vscode-file-icon">📄</span>index.html</div>
          <div className="vscode-file"><span className="vscode-file-icon">📄</span>package.json</div>
          <div className="vscode-file"><span className="vscode-file-icon">📄</span>vite.config.ts</div>
        </div>
      )}
    </div>
  );
}

export default Sidenav