// Explorer.jsx
import React, { useState } from 'react';

function ExplorerNode({ node, onFileClick }) {
  const [expanded, setExpanded] = useState(true);

  if (node.type === 'folder') {
    return (
      <div>
        <div onClick={() => setExpanded(e => !e)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          {expanded ? '▼' : '▶'} {node.name}
        </div>
        {expanded && node.children && (
          <div style={{ paddingLeft: 16 }}>
            {node.children.map(child => (
              <ExplorerNode key={child.id} node={child} onFileClick={onFileClick} />
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div onClick={() => onFileClick(node)} style={{ cursor: 'pointer' }}>
        📄 {node.name}
      </div>
    );
  }
}

export default function Explorer({ tree, onFileClick }) {
  if (!tree) return null;
  return <ExplorerNode node={tree} onFileClick={onFileClick} />;
}


