import React, { useEffect, useState } from 'react';
import './Sidenav.css';

const getFileIconClass = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (filename === 'package.json') return 'codicon codicon-package';
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'codicon codicon-symbol-variable';
    case 'ts':
    case 'tsx':
      return 'codicon codicon-symbol-interface';
    case 'json':
      return 'codicon codicon-json';
    case 'html':
      return 'codicon codicon-html';
    case 'css':
      return 'codicon codicon-symbol-key';
    case 'md':
      return 'codicon codicon-markdown';
    case 'svg':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'codicon codicon-file-media';
    case 'env':
      return 'codicon codicon-gear';
    case 'lock':
      return 'codicon codicon-lock';
    case 'd.ts':
      return 'codicon codicon-symbol-namespace';
    default:
      return 'codicon codicon-file';
  }
};

const Sidenav = ({ tree = [], onFileClick, setExplorerTree }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [newInput, setNewInput] = useState({ parentPath: null, type: null });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const initialExpand = (nodes) => {
      const expandMap = {};
      const recurse = (list) => {
        for (const node of list) {
          if (node.type === 'folder') {
            expandMap[node.path] = true;
            if (node.children) recurse(node.children);
          }
        }
      };
      recurse(nodes);
      return expandMap;
    };
    setExpandedNodes(initialExpand(tree));
  }, [tree]);

  const toggleExpand = (path) => {
    setExpandedNodes((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const handleCreate = async (parentPath, type) => {
    setNewInput({ parentPath, type });
    setInputValue('');
  };

  const handleInputKeyDown = async (e, parentPath, type) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (type === 'file') {
        await window.electronAPI.createFile(parentPath, inputValue.trim());
      } else {
        await window.electronAPI.createFolder(parentPath, inputValue.trim());
      }
      setNewInput({ parentPath: null, type: null });
      setInputValue('');
      // Refresh tree
      const tree = await window.electronAPI.openFolder();
      setExplorerTree(tree);
    } else if (e.key === 'Escape') {
      setNewInput({ parentPath: null, type: null });
      setInputValue('');
    }
  };

  const renderTree = (nodes, level = 0) => (
    <ul className="vsc-list" style={{ paddingLeft: level === 0 ? 0 : 16 }}>
      {nodes.map((node) => (
        <li key={node.path} className={node.type === 'folder' ? 'vsc-folder-li' : 'vsc-file-li'}>
          <div
            className={node.type === 'folder' ? 'vscode-folder vsc-folder-row' : 'vscode-file vsc-file-row'}
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={() => {
              if (node.type === 'folder') toggleExpand(node.path);
              else onFileClick && onFileClick(node);
            }}
          >
            {node.type === 'folder' && (
              <span className="vscode-folder-icon">{expandedNodes[node.path] ? '▼' : '▶'}</span>
            )}
            <span className="vsc-label">
              {node.type === 'file' && (
                <span className={getFileIconClass(node.name)} style={{ marginRight: 6 }}></span>
              )}
              {node.name}
            </span>
            {node.type === 'folder' && (
              <>
                <button className="vsc-add-btn" title="New File" onClick={e => { e.stopPropagation(); handleCreate(node.path, 'file'); }}>＋</button>
                <button className="vsc-add-btn" title="New Folder" onClick={e => { e.stopPropagation(); handleCreate(node.path, 'folder'); }}>📁</button>
              </>
            )}
          </div>
          {newInput.parentPath === node.path && (
            <input
              className="vsc-rename-input"
              autoFocus
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => handleInputKeyDown(e, node.path, newInput.type)}
              onBlur={() => setNewInput({ parentPath: null, type: null })}
              placeholder={newInput.type === 'file' ? 'New File Name' : 'New Folder Name'}
              style={{ marginLeft: 24, marginTop: 2 }}
            />
          )}
          {node.type === 'folder' && expandedNodes[node.path] && node.children &&
            renderTree(node.children, level + 1)}
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="vscode-sidenav vsc-sidebar">
      <div className="vsc-title">EXPLORER</div>
      {renderTree(tree)}
    </nav>
  );
};

export default Sidenav;
