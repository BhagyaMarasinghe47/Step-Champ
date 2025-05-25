// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChallengesPage from './pages/ChallengesPage';
import './App.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(user !== null);
    setIsLoading(false);
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
      <Router>
        <div className="app">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/challenges" element={<ChallengesPage />} />
              </>
            ) : (
              <Route path="*" element={<LoginPage />} />
            )}
          </Routes>
        </div>
      </Router>
    );
    
}

export default App;
