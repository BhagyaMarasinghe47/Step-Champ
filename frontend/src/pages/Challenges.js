import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ChallengeService from '../services/challenge.service';
import { FaEdit, FaTrash, FaPlus, FaRunning, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ChallengeModal = ({ isOpen, onClose, challenge, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    teams: [{ name: '' }]
  });
  
  useEffect(() => {
    if (challenge) {
      // Create a properly formatted object for editing
      setFormData({
        name: challenge.name || '',
        start_date: challenge.start_date || '',
        end_date: challenge.end_date || '',
        // Ensure teams is always an array
        teams: Array.isArray(challenge.teams) 
          ? challenge.teams.map(team => ({ name: team.name || team }))
          : [{ name: '' }]
      });
    } else {
      // Set default dates for new challenge (today and 30 days from now)
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);
      
      setFormData({
        name: '',
        start_date: today.toISOString().split('T')[0],
        end_date: nextMonth.toISOString().split('T')[0],
        teams: [{ name: '' }]
      });
    }
  }, [challenge]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTeamChange = (index, value) => {
    const updatedTeams = [...formData.teams];
    updatedTeams[index] = { name: value };
    setFormData(prev => ({ ...prev, teams: updatedTeams }));
  };
  
  const addTeamField = () => {
    setFormData(prev => ({
      ...prev,
      teams: [...prev.teams, { name: '' }]
    }));
  };
  
  const removeTeamField = (index) => {
    if (formData.teams.length === 1) return;
    
    const updatedTeams = [...formData.teams];
    updatedTeams.splice(index, 1);
    setFormData(prev => ({ ...prev, teams: updatedTeams }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty team names and prepare data for API
    const preparedData = {
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      teams: formData.teams
        .filter(team => team.name.trim() !== '')
        .map(team => ({ name: team.name }))
    };
    
    onSave(preparedData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-medium text-gray-800">
            {challenge ? 'Edit Challenge' : 'Add New Challenge'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Challenge Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="start_date" className="form-label">Start Date</label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  className="input"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="end_date" className="form-label">End Date</label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  className="input"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  min={formData.start_date}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teams
              </label>
              
              {formData.teams && formData.teams.map((team, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    placeholder={`Team ${index + 1} Name`}
                    className="input mr-2"
                    value={team.name}
                    onChange={(e) => handleTeamChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeTeamField(index)}
                    disabled={formData.teams.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                className="text-primary hover:text-primary-dark text-sm flex items-center mt-2"
                onClick={addTeamField}
              >
                <FaPlus className="mr-1" /> Add Team
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {challenge ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, challengeName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-medium text-gray-800">Confirm Delete</h2>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to delete challenge <strong>{challengeName}</strong>? This will also delete all teams and data associated with this challenge. This action cannot be undone.
          </p>
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);
  
  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const response = await ChallengeService.getAllChallenges();
      if (response.success) {
        setChallenges(response.data);
      }
    } catch (err) {
      console.error('Error fetching challenges:', err);
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchChallenges();
  }, []);
  
  const handleAddChallenge = () => {
    setCurrentChallenge(null);
    setModalOpen(true);
  };
  
  const handleEditChallenge = (challenge) => {
    // Make sure to create a proper object with expected properties
    const formattedChallenge = {
      id: challenge.id,
      name: challenge.name,
      start_date: challenge.start_date,
      end_date: challenge.end_date,
      status: challenge.status,
      // Ensure teams is always an array of objects with name property
      teams: Array.isArray(challenge.teams) 
        ? challenge.teams.map(t => typeof t === 'object' ? t : { name: t })
        : []
    };
    
    setCurrentChallenge(formattedChallenge);
    setModalOpen(true);
  };
  
  const handleDeleteClick = (challenge) => {
    setChallengeToDelete(challenge);
    setDeleteModalOpen(true);
  };
  
  const handleSaveChallenge = async (challengeData) => {
    try {
      console.log('Challenge data to save:', challengeData);
      
      if (currentChallenge) {
        // Update existing challenge
        const response = await ChallengeService.updateChallenge(currentChallenge.id, challengeData);
        toast.success('Challenge updated successfully');
      } else {
        // Create new challenge
        const response = await ChallengeService.createChallenge(challengeData);
        toast.success('Challenge created successfully');
      }
      
      setModalOpen(false);
      fetchChallenges(); // Refresh the challenge list
    } catch (err) {
      console.error('Error saving challenge:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      }
      toast.error(err.response?.data?.message || 'Failed to save challenge');
    }
  };
  
  const handleDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    
    try {
      await ChallengeService.deleteChallenge(challengeToDelete.id);
      toast.success('Challenge deleted successfully');
      setDeleteModalOpen(false);
      setChallengeToDelete(null);
      fetchChallenges(); // Refresh the challenge list
    } catch (err) {
      console.error('Error deleting challenge:', err);
      toast.error(err.response?.data?.message || 'Failed to delete challenge');
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default: // Upcoming
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Step Challenges</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={handleAddChallenge}
        >
          <FaPlus className="mr-2" />
          <span>Add Challenge</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading challenges...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teams
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {challenges.length > 0 ? (
                  challenges.map((challenge) => (
                    <tr key={challenge.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{challenge.created_at}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-primary">{challenge.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{challenge.period}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{challenge.teams}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{challenge.participants}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(challenge.status)}`}>
                          <FaRunning className="mr-1" />
                          {challenge.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditChallenge(challenge)}
                          className="text-primary hover:text-primary-dark mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(challenge)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No challenges found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <ChallengeModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        challenge={currentChallenge}
        onSave={handleSaveChallenge}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteChallenge}
        challengeName={challengeToDelete?.name}
      />
    </MainLayout>
  );
};

export default Challenges;