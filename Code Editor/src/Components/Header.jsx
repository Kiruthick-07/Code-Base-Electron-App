import React from 'react'
import './Header.css';

const Header = () => {
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
  };

  const rightTextStyle = {
    color: '#CBD5E1',
    fontWeight: '300',
    marginRight: '10px',
  };

  return (
    <div style={headerStyle} className="header-container">
      <div style={leftMenuStyle}>
        <div className="menu-btn">☰</div>
        <button className="menu-btn">File</button>
        <button className="menu-btn">Edit</button>
        <button className="menu-btn">View</button>
        <button className="menu-btn">Run</button>
        <button className="menu-btn">Add Component</button>
        
      </div>
      <div className="search-bar-container">
        <input className="search-bar" type="text" placeholder="Search..." />
      </div>
      <div style={rightTextStyle}>Code Base</div>
    </div>
  );
}

export default Header