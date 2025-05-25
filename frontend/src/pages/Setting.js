import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthService from '../services/auth.service';
import { FaUser, FaKey } from 'react-icons/fa';

const Settings = () => {
  const { section = 'account' } = useParams();
  const navigate = useNavigate();
  const { user, updateUserData } = useAuth();
  
  const [activeTab, setActiveTab] = useState(section);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);
  
  useEffect(() => {
    setActiveTab(section);
  }, [section]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/settings/${tab}`);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    
    if (!profileData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    try {
      setLoading(true);
      const response = await AuthService.updateProfile(profileData);
      
      if (response.success) {
        updateUserData(response.data);
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    
    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      const response = await AuthService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        toast.success('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (err) {
      console.error('Error changing password:', err);
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'account'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTabChange('account')}
          >
            <FaUser className="inline mr-2" />
            Account
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'password'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => handleTabChange('password')}
          >
            <FaKey className="inline mr-2" />
            Change Password
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'account' && (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  required
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
          
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className="input"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className="input"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="input"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;