import axiosInstance from '../utils/axios';

const ChallengeService = {
  getAllChallenges: async () => {
    try {
      const response = await axiosInstance.get('/challenges');
      return response.data;
    } catch (error) {
      console.error('Error getting challenges:', error);
      throw error;
    }
  },
  
  getChallengeById: async (id) => {
    try {
      const response = await axiosInstance.get(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting challenge by ID:', error);
      throw error;
    }
  },
  
  createChallenge: async (challengeData) => {
    try {
      console.log('Creating challenge with data:', challengeData);
      const response = await axiosInstance.post('/challenges', challengeData);
      return response.data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  },
  
  updateChallenge: async (id, challengeData) => {
    try {
      console.log('Updating challenge with ID:', id);
      console.log('Update data:', challengeData);
      const response = await axiosInstance.put(`/challenges/${id}`, challengeData);
      return response.data;
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  },
  
  deleteChallenge: async (id) => {
    try {
      const response = await axiosInstance.delete(`/challenges/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw error;
    }
  },
  
  addTeam: async (challengeId, teamData) => {
    try {
      const response = await axiosInstance.post(`/challenges/${challengeId}/teams`, teamData);
      return response.data;
    } catch (error) {
      console.error('Error adding team:', error);
      throw error;
    }
  }
};

export default ChallengeService;