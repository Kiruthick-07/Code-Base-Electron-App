import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import ComponentLibraryModal from './ComponentLibraryModal';

const Header = ({ setExplorerTree, openFileInTab }) => {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [editMenuOpen, setEditMenuOpen] = useState(false);
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [runMenuOpen, setRunMenuOpen] = useState(false);
  const [addComponentMenuOpen, setAddComponentMenuOpen] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Button');

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setFileMenuOpen(false);
        setEditMenuOpen(false);
        setViewMenuOpen(false);
        setRunMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenFolder = async () => {
    const tree = await window.electronAPI.openFolder();
    if (tree && tree.length > 0) setExplorerTree(tree);
  };

  const handleOpenFile = async () => {
    const file = await window.electronAPI.openFile();
    if (file) openFileInTab(file);
  };

  const headerStyle = {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    fontFamily: 'Segoe UI, sans-serif',
    fontSize: '14px',
    justifyContent: 'space-between',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  const leftMenuStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    position: 'relative',
  };

  const rightTextStyle = {
    color: '#CBD5E1',
    fontWeight: '300',
    marginRight: '10px',
  };

  return (
    <>
      <div style={headerStyle} className="header-container">
        <div style={leftMenuStyle} ref={menuRef}>
          <div className="menu-btn">☰</div>
          <button className="menu-btn" onClick={() => setFileMenuOpen(prev => !prev)}>File</button>
          <button className="menu-btn" onClick={() => setEditMenuOpen(prev => !prev)}>Edit</button>
          <button className="menu-btn" onClick={() => setViewMenuOpen(prev => !prev)}>View</button>
          <button className="menu-btn" onClick={() => setRunMenuOpen(prev => !prev)}>Run</button>
          <button className="menu-btn" onClick={() => setAddComponentMenuOpen(prev => !prev)}>Add Component</button>

          {/* File Menu Dropdown */}
          {fileMenuOpen && (
            <div className="file-dropdown-menu">
              <div className="file-dropdown-item">New File</div>
              <div className="file-dropdown-item">New Folder</div>
              <div className="file-dropdown-item" onClick={handleOpenFile}>Open File...</div>
              <div className="file-dropdown-item" onClick={handleOpenFolder}>Open Folder...</div>
              <div className="file-dropdown-item">Save</div>
              <div className="file-dropdown-item">Save As...</div>
              <div className="file-dropdown-item">Close</div>
              <div className="file-dropdown-item">Close All</div>
              <div className="file-dropdown-item">Exit</div>
            </div>
          )}
        </div>

        {/* Edit Menu Dropdown */}
        {editMenuOpen && (
          <div className="edit-dropdown-menu">
            <div className="edit-dropdown-item">Undo</div>
            <div className="edit-dropdown-item">Redo</div>
            <div className="edit-dropdown-item">Cut</div>
            <div className="edit-dropdown-item">Copy</div>
            <div className="edit-dropdown-item">Paste</div>
          </div>
        )}

        {/* View Menu Dropdown */}
        {viewMenuOpen && (
          <div className="view-dropdown-menu">
            <div className="view-dropdown-item">Toggle Sidebar</div>
            <div className="view-dropdown-item">Music Player</div>
            <div className="view-dropdown-item">Iris AI</div>
            <div className="view-dropdown-item">Zoom In</div>
            <div className="view-dropdown-item">Zoom Out</div>
          </div>
        )}

        {/* Run Menu Dropdown */}
        {runMenuOpen && (
          <div className="run-dropdown-menu">
            <div className="run-dropdown-item">Start Debugging</div>
            <div className="run-dropdown-item">Stop Debugging</div>
            <div className="run-dropdown-item">Run Without Debugging</div>
            <div className="run-dropdown-item">View Terminal</div>
          </div>
        )}

        {/* Add Component Menu Dropdown */}
        {addComponentMenuOpen && (
          <div className="add-component-dropdown-menu">
            <div className="add-component-dropdown-item" onClick={() => { setSelectedComponent('Button'); setShowLibrary(true); setAddComponentMenuOpen(false); }}>Add Button</div>
            <div className="add-component-dropdown-item" onClick={() => { setSelectedComponent('Card'); setShowLibrary(true); setAddComponentMenuOpen(false); }}>Add Card</div>
          </div>
        )}

        <div className="search-bar-container">
          <input className="search-bar" type="text" placeholder="Search..." />
        </div>
        <div style={rightTextStyle}>Code Base</div>
      </div>
      <ComponentLibraryModal isOpen={showLibrary} onClose={() => setShowLibrary(false)} componentKey={selectedComponent} />
    </>
  );
};

export default Header;
