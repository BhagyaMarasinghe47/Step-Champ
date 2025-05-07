// src/services/authService.js

// Function to handle Google authentication
export const signInWithGoogle = async () => {
    try {
      // This is a placeholder for actual Google OAuth implementation
      // In a real app, you'd use the Google OAuth API or Firebase Auth
      
      // Simulating successful login for demo purposes
      const mockUser = {
        id: 'google-user-123',
        name: 'Google User',
        email: 'user@gmail.com',
        provider: 'google',
        token: 'mock-token-123',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };
  
  // Function to handle Microsoft authentication
  export const signInWithMicrosoft = async () => {
    try {
      // This is a placeholder for actual Microsoft OAuth implementation
      // In a real app, you'd use the Microsoft Authentication Library (MSAL)
      
      // Simulating successful login for demo purposes
      const mockUser = {
        id: 'microsoft-user-123',
        name: 'Microsoft User',
        email: 'user@outlook.com',
        provider: 'microsoft',
        token: 'mock-token-456',
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      return mockUser;
    } catch (error) {
      console.error('Microsoft sign-in error:', error);
      throw error;
    }
  };
  
  // Logout function
  export const logout = () => {
    localStorage.removeItem('user');
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    return localStorage.getItem('user') !== null;
  };
  
  // Get current user
  export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  };