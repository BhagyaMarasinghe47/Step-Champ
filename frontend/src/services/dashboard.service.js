import axiosInstance from '../utils/axios';

const DashboardService = {
  getStats: async () => {
    const response = await axiosInstance.get('/admins/dashboard');
    return response.data;
  }
};

export default DashboardService;