import React, { useState } from 'react'
import './Sidenav.css'

const uuid = () => '_' + Math.random().toString(36).substr(2, 9)

const initialTree = [
  {
    id: uuid(),
    type: 'folder',
    name: 'src',
    expanded: true,
    children: [
      {
        id: uuid(),
        type: 'folder',
        name: 'Components',
        expanded: true,
        children: [
          { id: uuid(), type: 'file', name: 'Header.jsx', content: "// Header component" },
          { id: uuid(), type: 'file', name: 'Header.css', content: "/* Header styles */" },
        ],
      },
      { id: uuid(), type: 'file', name: 'App.jsx', content: "// App component" },
      { id: uuid(), type: 'file', name: 'App.css', content: "/* App styles */" },
      { id: uuid(), type: 'file', name: 'index.css', content: "/* index styles */" },
      { id: uuid(), type: 'file', name: 'main.jsx', content: "// main entry" },
      { id: uuid(), type: 'file', name: 'vite-env.d.ts', content: "// Vite types" },
    ],
  },
  { id: uuid(), type: 'file', name: 'index.html', content: "<!DOCTYPE html>" },
  { id: uuid(), type: 'file', name: 'package.json', content: "{\n  \"name\": \"project\"\n}" },
  { id: uuid(), type: 'file', name: 'vite.config.ts', content: "// Vite config" },
]

// icon mapping remains unchanged
const getFileIconClass = (filename) => {
  const ext = filename.split('.').pop().toLowerCase()
  if (filename === 'package.json') return 'codicon codicon-package'
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'codicon codicon-symbol-variable'
    case 'ts':
    case 'tsx':
      return 'codicon codicon-symbol-interface'
    case 'json':
      return 'codicon codicon-json'
    case 'html':
      return 'codicon codicon-html'
    case 'css':
      return 'codicon codicon-symbol-key'
    case 'md':
      return 'codicon codicon-markdown'
    case 'svg':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
      return 'codicon codicon-file-media'
    case 'env':
      return 'codicon codicon-gear'
    case 'lock':
      return 'codicon codicon-lock'
    case 'd.ts':
      return 'codicon codicon-symbol-namespace'
    default:
      return 'codicon codicon-file'
  }
}

const Sidenav = ({ onFileOpen }) => {
  const [tree, setTree] = useState(initialTree)
  const [editing, setEditing] = useState(null)
  const [newFileInput, setNewFileInput] = useState(null)

  const renderTree = (nodes, parentId = null, level = 0) => (
    <ul className="vsc-list" style={{ paddingLeft: level === 0 ? 0 : 16 }}>
      {nodes.map((node) => (
        <li key={node.id} className={node.type === 'folder' ? 'vsc-folder-li' : 'vsc-file-li'}>
          <div
            className={
              node.type === 'folder'
                ? 'vscode-folder vsc-folder-row'
                : 'vscode-file vsc-file-row'
            }
            style={{ display: 'flex', alignItems: 'center' }}
            onClick={node.type === 'folder' ? (e) => {
              e.stopPropagation()
              toggleExpand(node.id)
            } : () => {
              if (onFileOpen) onFileOpen(node)
            }}
          >
            {node.type === 'folder' && (
              <span className="vscode-folder-icon">{node.expanded ? '▼' : '▶'}</span>
            )}
            {editing && editing.id === node.id ? (
              <input
                className="vsc-rename-input"
                autoFocus
                value={editing.value}
                onChange={e => setEditing({ ...editing, value: e.target.value })}
                onBlur={() => finishRename(node)}
                onKeyDown={e => {
                  if (e.key === 'Enter') finishRename(node)
                  if (e.key === 'Escape') setEditing(null)
                }}
              />
            ) : (
              <span
                className="vsc-label"
                onDoubleClick={() => setEditing({ id: node.id, value: node.name })}
              >
                {node.type === 'file' && (
                  <span className={getFileIconClass(node.name)} style={{ marginRight: 6 }}></span>
                )}
                {node.name}
              </span>
            )}
            {node.type === 'folder' && (
              <>
                <button
                  className="vsc-add-btn"
                  title="New File"
                  onClick={e => { e.stopPropagation(); setNewFileInput({ parentId: node.id, value: '' }) }}
                >
                  ＋
                </button>
                <button
                  className="vsc-add-btn"
                  title="New Folder"
                  onClick={e => { e.stopPropagation(); addNode(node.id, 'folder') }}
                >
                  📁
                </button>
              </>
            )}
          </div>

          {/* New File Input */}
          {newFileInput && newFileInput.parentId === node.id && node.type === 'folder' && node.expanded && (
            <div style={{ paddingLeft: 24, margin: '2px 0' }}>
              <input
                className="vsc-rename-input"
                autoFocus
                placeholder="File name"
                value={newFileInput.value}
                onChange={e => setNewFileInput({ ...newFileInput, value: e.target.value })}
                onBlur={() => setNewFileInput(null)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newFileInput.value.trim()) {
                    addNode(node.id, 'file', newFileInput.value.trim())
                    setNewFileInput(null)
                  }
                  if (e.key === 'Escape') setNewFileInput(null)
                }}
              />
            </div>
          )}

          {node.type === 'folder' && node.expanded && node.children && renderTree(node.children, node.id, level + 1)}
        </li>
      ))}
    </ul>
  )

  const toggleExpand = (id) => {
    setTree(prev => updateNode(prev, id, node => ({ ...node, expanded: !node.expanded })))
  }

  const addNode = (parentId, type, name) => {
    setTree(prev => addNodeToTree(prev, parentId, type, name))
  }

  const finishRename = (node) => {
    if (editing && editing.value.trim()) {
      setTree(prev => updateNode(prev, node.id, n => ({ ...n, name: editing.value })))
    }
    setEditing(null)
  }

  const updateNode = (nodes, id, updater) => {
    return nodes.map(node => {
      if (node.id === id) return updater(node)
      if (node.type === 'folder' && node.children) {
        return { ...node, children: updateNode(node.children, id, updater) }
      }
      return node
    })
  }

  const addNodeToTree = (nodes, parentId, type, name) => {
    return nodes.map(node => {
      if (node.id === parentId && node.type === 'folder') {
        const newNode = {
          id: uuid(),
          type,
          name: name || 'New File',
          ...(type === 'file' ? { content: '' } : { expanded: true, children: [] }),
        }
        return {
          ...node,
          expanded: true,
          children: [...(node.children || []), newNode],
        }
      } else if (node.type === 'folder' && node.children) {
        return { ...node, children: addNodeToTree(node.children, parentId, type, name) }
      }
      return node
    })
  }

  return (
    <nav className="vscode-sidenav vsc-sidebar">
      <div className="vsc-title">EXPLORER</div>
      {renderTree(tree)}
    </nav>
  )
}

export default Sidenav
