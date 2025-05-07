import React, { useState } from 'react';
import './LoginPage.css';
import stepChampLogo from '../assets/images/step-champ-logo.png';
import geveoLogo from '../assets/images/geveo-logo.png';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    // Mock authentication - in a real app, this would call an API
    // For demo purposes, we'll accept any non-empty username/password
    if (username && password) {
      const user = {
        id: '123',
        name: 'test10 member',
        email: username,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      // Force page refresh to show dashboard
      window.location.reload();
    } else {
      setError('Invalid username or password');
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality will be implemented soon.');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-container">
          <img src={stepChampLogo} alt="Step Champ Logo" className="step-champ-logo" />
          
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-box">
          <h2>Sign In</h2>
          
          <form onSubmit={handleSignIn} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <div className="forgot-password">
                <span onClick={handleForgotPassword}>Forgot password?</span>
              </div>
            </div>
            
            <button type="submit" className="sign-in-button">
              Sign In
            </button>
          </form>
          
          <div className="login-footer">
            <img src={geveoLogo} alt="Geveo Logo" className="geveo-logo" />
            <p className="version-text">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;