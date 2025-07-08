import React, { useState, useRef, useEffect } from 'react';
import './Header.css';

const Header = () => {
  /*File Menu*/
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setFileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  /*File Menu*/

/*Edit Menu*/
const [editMenuOpen, setEditMenuOpen] = useState(false);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setEditMenuOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
/*Edit Menu*/
  

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
          <button className="menu-btn">View</button>
          <button className="menu-btn">Run</button>
          <button className="menu-btn">Add Component</button>

          {/* File Menu Dropdown */}
          {fileMenuOpen && (
            <div className="file-dropdown-menu">
              <div className="file-dropdown-item">New File</div>
              <div className="file-dropdown-item">New Folder</div>
              <div className="file-dropdown-item">Open File...</div>
              <div className="file-dropdown-item">Open Folder...</div>
              <div className="file-dropdown-item">Save</div>
              <div className="file-dropdown-item">Save As...</div>
              <div className="file-dropdown-item">Close</div>
              <div className="file-dropdown-item">Close All</div>
              <div className="file-dropdown-item">Exit</div>
            </div>
          )}
        </div>
        {/* Edit Menu Dropdown */}
        {editMenuOpen &&(
        <div className="edit-dropdown-menu">
        <div className="edit-dropdown-item">Undo</div>
              <div className="edit-dropdown-item">Redo</div>
              <div className="edit-dropdown-item">Cut</div>
              <div className="edit-dropdown-item">Copy</div>
              <div className="edit-dropdown-item">Paste</div>
        </div>
        )}
       
       

        <div className="search-bar-container">
          <input className="search-bar" type="text" placeholder="Search..." />
        </div>
        <div style={rightTextStyle}>Code Base</div>
      </div>
    </>
  );
};

export default Header;
