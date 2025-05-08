// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">STEP CHAMP</h2>
      <Link to="/" className="sidebar-btn">🏠 Home</Link>
      <Link to="/challenges" className="sidebar-btn">🎮 Challenges</Link>
      <Link to="/settings" className="sidebar-btn">⚙️ Settings</Link>
    </div>
  );
}

export default Sidebar;
