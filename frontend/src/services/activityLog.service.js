import axiosInstance from '../utils/axios';

const ActivityLogService = {
  getLogs: async (filters = {}) => {
    const response = await axiosInstance.get('/logs', { params: filters });
    return response.data;
  },
  
  getLogTypes: async () => {
    const response = await axiosInstance.get('/logs/types');
    return response.data;
  }
};

export default ActivityLogService;