
// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ChallengesPage from './pages/ChallengesPage';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Users from './pages/Users';
import Settings from './pages/Setting';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/settings/:section" element={<Settings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;