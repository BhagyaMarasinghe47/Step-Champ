import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initAuth = () => {
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };
  
  const logout = () => {
    AuthService.logout();
    setUser(null);
  };
  
  const updateUserData = (newData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...newData
    }));
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUserData,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;