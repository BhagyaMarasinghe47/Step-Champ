/*Dashboard.js*/

import React, { useState } from 'react';
import './Dashboard.css';
import stepChampLogo from '../assets/images/step-champ-logo.png';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'test10 member',
    email: 'stepchampuser10@outlook.com'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleMenuClick = (menuItem) => {
    if (menuItem === 'Settings') {
      setShowSettingsSubmenu(!showSettingsSubmenu);
    } else {
      setActiveMenuItem(menuItem);
    }
  };

  const handleSubmenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    // Keep submenu open when a submenu item is clicked
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src={stepChampLogo} alt="Step Champ Logo" className="logo" />
       
        </div>
        
        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeMenuItem === 'Home' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Home')}
          >
            <span className="menu-icon">🏠</span>
            <span className="menu-text">Home</span>
          </button>
          
          <button 
            className={`menu-item ${activeMenuItem === 'Challenges' ? 'active' : ''}`}
            onClick={() => handleMenuClick('Challenges')}
          >
            <span className="menu-icon">🏆</span>
            <span className="menu-text">Challenges</span>
          </button>
          
          <button 
            className={`menu-item ${showSettingsSubmenu ? 'active-parent' : ''}`}
            onClick={() => handleMenuClick('Settings')}
          >
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Settings</span>
            <span className={`submenu-arrow ${showSettingsSubmenu ? 'open' : ''}`}>▼</span>
          </button>
          
          {/* Settings submenu */}
          <div className={`submenu ${showSettingsSubmenu ? 'show' : ''}`}>
            <button 
              className={`submenu-item ${activeMenuItem === 'Account' ? 'active' : ''}`}
              onClick={() => handleSubmenuClick('Account')}
            >
              <span className="menu-icon">➡️</span>
              <span className="menu-text">Account</span>
            </button>
            
            <button 
              className={`submenu-item ${activeMenuItem === 'Manage Users' ? 'active' : ''}`}
              onClick={() => handleSubmenuClick('Manage Users')}
            >
              <span className="menu-icon">➡️</span>
              <span className="menu-text">Manage Users</span>
            </button>
            
            <button 
              className={`submenu-item ${activeMenuItem === 'Activity Logs' ? 'active' : ''}`}
              onClick={() => handleSubmenuClick('Activity Logs')}
            >
              <span className="menu-icon">➡️</span>
              <span className="menu-text">Activity Logs</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <button className="profile-btn" onClick={handleLogout}>👤</button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <h1>Welcome Home</h1>
          
          <div className="user-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email Address:</strong> {user.email}</p>
          </div>
          
          
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Use</a>
          </div>
          <div className="footer-copyright">
            @2025 Powered by EVERNOTE, Made with ❤️ by GEVEO
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;