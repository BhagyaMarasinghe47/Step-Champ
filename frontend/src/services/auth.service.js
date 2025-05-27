import axiosInstance from '../utils/axios';

const AuthService = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await axiosInstance.put('/auth/changepassword', {
      currentPassword,
      newPassword
    });
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/admins/profile', userData);
    if (response.data.success) {
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  }
};

export default AuthService;