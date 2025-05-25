import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import UserService from '../services/user.service';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Participant',
    account_status: 'Active'
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't pre-fill password for security
        role: user.role || 'Participant',
        account_status: user.account_status || 'Active'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'Participant',
        account_status: 'Active'
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-medium text-gray-800">
            {user ? 'Edit User' : 'Add New User'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
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
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password {user && <span className="text-xs text-gray-500">(Leave blank to keep current password)</span>}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="input"
                value={formData.password}
                onChange={handleChange}
                required={!user}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                className="input"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Participant">Participant</option>
                <option value="Moderator">Moderator</option>
              </select>
            </div>
            
            <div className="form-group mb-0">
              <label htmlFor="account_status" className="form-label">Status</label>
              <select
                id="account_status"
                name="account_status"
                className="input"
                value={formData.account_status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
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
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-medium text-gray-800">Confirm Delete</h2>
        </div>
        
        <div className="px-6 py-4">
          <p className="text-gray-700">
            Are you sure you want to delete user <strong>{userName}</strong>? This action cannot be undone.
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleAddUser = () => {
    setCurrentUser(null);
    setModalOpen(true);
  };
  
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setModalOpen(true);
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };
  
  const handleSaveUser = async (userData) => {
    try {
      if (currentUser) {
        // Update existing user
        const data = { ...userData };
        if (!data.password) delete data.password; // Don't send password if empty
        
        await UserService.updateUser(currentUser.id, data);
        toast.success('User updated successfully');
      } else {
        // Create new user
        await UserService.createUser(userData);
        toast.success('User created successfully');
      }
      
      setModalOpen(false);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error saving user:', err);
      toast.error(err.response?.data?.message || 'Failed to save user');
    }
  };
  
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await UserService.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      setDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <button
          className="btn btn-primary flex items-center"
          onClick={handleAddUser}
        >
          <FaPlus className="mr-2" />
          <span>Add User</span>
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
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.account_status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.account_status === 'Active' ? (
                            <FaCheck className="mr-1" />
                          ) : (
                            <FaTimes className="mr-1" />
                          )}
                          {user.account_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.last_login || 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary hover:text-primary-dark mr-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
      />
      
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name}
      />
    </MainLayout>
  );
};

export default Users;