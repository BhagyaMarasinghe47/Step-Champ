
// App.js
import React  from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Dashboard from './pages/Dashboard';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// Pages
import Login from './pages/Login';
import Users from './pages/Users';
import Settings from './pages/Setting';
import NotFound from './pages/NotFound';
import ActivityLogs from './pages/ActivityLogs';
import Challenges from './pages/Challenges';
import Dashboard from './pages/Dashboard';




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