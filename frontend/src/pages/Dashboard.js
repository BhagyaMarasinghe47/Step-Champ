import React, { useState } from 'react';
import './Dashboard.css';
import stepChampLogo from '../assets/images/step-champ-logo.png';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  const [activePage, setActivePage] = useState('home');

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-section">
          <img src={stepChampLogo} alt="Step Champ Logo" className="dashboard-logo" />
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            <span className="nav-icon">⌂</span>
            Home
          </button>

          <button 
            className={`nav-item ${activePage === 'challenges' ? 'active' : ''}`}
            onClick={() => setActivePage('challenges')}
          >
            <span className="nav-icon">🏆</span>
            Challenges
          </button>

          <button 
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => setActivePage('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>

        <div className="account-section">
          <button className="account-item">
            <span className="nav-icon">👤</span>
            Account
          </button>

          <button className="account-item">
            <span className="nav-icon">👥</span>
            Manage Users
          </button>

          <button className="account-item">
            <span className="nav-icon">📋</span>
            Activity Logs
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="search-container">
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <div className="header-actions">
            <button className="notification-button">🔔</button>
            <button className="profile-button" onClick={handleLogout}>👤</button>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <h1>Welcome Home</h1>
          <div className="user-info-section">
            <p><strong>Name:</strong> {user.name || 'test10 member'}</p>
            <p><strong>Email Address:</strong> {user.email || 'stepchampuser10@outlook.com'}</p>
          </div>

          <div className="action-section">
            <button className="show-challenges-button">Show Challenges</button>
          </div>
        </div>

        {/* Footer */}
        <footer className="main-footer">
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
          <div className="footer-copyright">
            @2023 Powered by EVERNOTE, Made with ❤ by GEVEO
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;