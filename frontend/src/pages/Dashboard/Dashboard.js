/*Dashboard.js*/

import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import ManageUsersPage from '../ManageUsers/ManageUsers';
import ChallengesPage from '../Challenges/ChallengesPage';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'test10 member',
    email: 'stepchampuser10@outlook.com'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleMenuClick = (menuItem) => {
    if (menuItem === 'Settings') {
      setShowSettingsSubmenu(!showSettingsSubmenu);
    } else {
      setActiveMenuItem(menuItem);
    }
  };

  const handleSubmenuClick = (submenuItem) => {
    setActiveMenuItem(submenuItem);
  };

  const renderContent = () => {
    switch (activeMenuItem) {
      case 'Home':
        return (
          <div className="page-content">
            <h1>Welcome to My Step Champ</h1>
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="action-buttons">
              <button className="primary-btn" onClick={() => handleMenuClick('Challenges')}>
                View Challenges
              </button>
            </div>
          </div>
        );
      case 'Challenges':
        return <ChallengesPage />;
      case 'Manage Users':
        return <ManageUsersPage />;
     
      default:
        return (
          <div className="page-content">
            <h1>Page Not Found</h1>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        activeMenuItem={activeMenuItem}
        showSettingsSubmenu={showSettingsSubmenu}
        handleMenuClick={handleMenuClick}
        handleSubmenuClick={handleSubmenuClick}
      />

      <div className="main-content">
        <header className="dashboard-header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>👤</button>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-name">{user.name}</div>
                    <div className="profile-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {renderContent()}

        <footer className="dashboard-footer">
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms</a>
          </div>
          <div>@2025 My Step Champ | GEVEO ❤️</div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;