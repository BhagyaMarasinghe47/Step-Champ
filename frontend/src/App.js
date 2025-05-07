import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!user);
    };

    // Check auth status initially
    checkAuth();

    // Set up event listener for storage changes (logout from other tabs)
    window.addEventListener('storage', checkAuth);

    // Clean up event listener
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <div className="app">
      {isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
}

export default App;