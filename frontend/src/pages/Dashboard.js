import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import stepChampLogo from '../assets/images/step-champ-logo.png';
import ManageUsers from './ManageUsers'; // Import the ManageUsers component
import { Link } from 'react-router-dom';





const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'test10 member',
    email: 'stepchampuser10@outlook.com'
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };
  
  const profileMenuRef = useRef(null);
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };
  
  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    
    // Attach the event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Render the appropriate content based on activeMenuItem
  const renderContent = () => {
    switch(activeMenuItem) {
      case 'Manage Users':
        return <ManageUsers />;
      case 'Home':
        return (
          <div className="page-content">
            <h1>Welcome Home</h1>
            
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email Address:</strong> {user.email}</p>
            </div>
            
            <div className="action-buttons">
              <button className="primary-btn" onClick={() => handleMenuClick('Challenges')}>
                Show Challenges
              </button>
            </div>
          </div>
        );
      case 'Challenges':
        return (
          <div className="page-content">
            <h1>Challenges</h1>
            <p>Your challenges will appear here.</p>
          </div>
        );
      case 'Account':
        return (
          <div className="page-content">
            <h1>Account Settings</h1>
            <p>Manage your account settings here.</p>
          </div>
        );
      case 'Activity Logs':
        return (
          <div className="page-content">
            <h1>Activity Logs</h1>
            <p>View your activity logs here.</p>
          </div>
        );
      default:
        return (
          <div className="page-content">
            <h1>Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
          </div>
        );
    }
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
          
          <Link to="/challenges" className={`menu-item ${activeMenuItem === 'Challenges' ? 'active' : ''}`}>
              <span className="menu-icon">🏆</span>
              <span className="menu-text">Challenges</span>
          </Link>

          
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
            <div className="profile-menu-container" ref={profileMenuRef}>
              <button className="profile-btn" onClick={toggleProfileMenu}>👤</button>
              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="profile-name">{user.name}</div>
                    <div className="profile-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <span className="logout-icon">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Render content based on active menu item */}
        {renderContent()}

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