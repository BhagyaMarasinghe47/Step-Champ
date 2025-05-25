// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/step-champ-logo.png';
import './Sidebar.css';


const Sidebar = ({
  activeMenuItem,
  showSettingsSubmenu,
  handleMenuClick,
  handleSubmenuClick
}) => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logo} alt="Step Champ Logo" className="logo" />
        <div className="brand-text">
          <span className="brand-name">My Step</span>
          <span className="brand-highlight">Champ</span>
          <span className="brand-tagline">Fitness Tracker</span>
        </div>
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
          <span className="menu-icon">🏁</span>
          <span className="menu-text">Challenges</span>
        </button>



        <button
          className={`menu-item ${activeMenuItem === 'Settings' ? 'active-parent' : ''}`}
          onClick={() => handleMenuClick('Settings')}
        >
          <span className="menu-icon">⚙️</span>
          <span className="menu-text">Settings</span>
          <span className={`submenu-arrow ${showSettingsSubmenu ? 'open' : ''}`}>▼</span>
        </button>


        <div className={`submenu ${showSettingsSubmenu ? 'show' : ''}`}>
          <button
            className={`submenu-item ${activeMenuItem === 'Account' ? 'active' : ''}`}
            onClick={() => handleSubmenuClick('Account')}
          >
            Account
          </button>


          <button
            className={`submenu-item ${activeMenuItem === 'Manage Users' ? 'active' : ''}`}
            onClick={() => handleSubmenuClick('Manage Users')}
          >
            Manage Users
          </button>


          <button
            className={`submenu-item ${activeMenuItem === 'Activity Logs' ? 'active' : ''}`}
            onClick={() => handleSubmenuClick('Activity Logs')}
          >
            Activity Logs
          </button>
          
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;             
