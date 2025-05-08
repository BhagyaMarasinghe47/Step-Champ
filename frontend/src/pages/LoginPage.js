/*Loginpage.js*/

import React, { useEffect } from 'react';
import './LoginPage.css';
import stepChampLogo from '../assets/images/step-champ-logo.png';
import geveoLogo from '../assets/images/geveo-logo.png';

const LoginPage = () => {
  // Function to initialize Google Sign-In API
  useEffect(() => {
    // Load the Google Sign-In API script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        initializeGoogleSignIn();
      };
    };

    // Initialize Google Sign-In button
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
          callback: handleGoogleSignIn,
          auto_select: false,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
          }
        );
      }
    };

    loadGoogleScript();
    
    return () => {
      // Clean up if needed
      const scriptElement = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  // Handle Google Sign-In response
  const handleGoogleSignIn = (response) => {
    // This function is called when the user successfully signs in with Google
    if (response && response.credential) {
      // For a real implementation, you would:
      // 1. Send the ID token to your server
      // 2. Verify the token on the server-side
      // 3. Create a session for the user
      
      // For demo purposes, we're just saving to localStorage
      const userData = parseJwt(response.credential);
      
      const user = {
        id: userData.sub,
        name: userData.name || 'test10 member',
        email: userData.email || 'stepchampuser10@outlook.com',
        picture: userData.picture,
        provider: 'google',
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      window.location.reload();
    }
  };

  // Helper function to decode JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Simulated sign-in for testing
  const handleSimulatedSignIn = () => {
    const user = {
      id: 'test-user-123',
      name: 'test10 member',
      email: 'stepchampuser10@outlook.com',
      provider: 'google',
    };
    localStorage.setItem('user', JSON.stringify(user));
    window.location.reload();
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
          <p className="login-subtitle">Sign in to stay connected</p>
          
          <div className="login-options">
            {/* Google Sign-In Button - Will be replaced by Google's button */}
            <div id="google-signin-button" className="google-signin-container"></div>
            
            {/* Fallback button for testing */}
            <button 
              className="social-login-button google-button"
              onClick={handleSimulatedSignIn}
            >
              <span className="button-icon google-icon">G</span>
              <span>Test Sign-in (Simulated)</span>
            </button>
          </div>
          
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