import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import ActivityLogService from '../services/activityLog.service';
import { FaSearch, FaTimes } from 'react-icons/fa';

const LogFilters = ({ onFilter, logTypes }) => {
  const [filters, setFilters] = useState({
    user: '',
    type: 'ALL',
    from_date: '',
    to_date: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };
  
  const handleClear = () => {
    setFilters({
      user: '',
      type: 'ALL',
      from_date: '',
      to_date: ''
    });
    onFilter({
      user: '',
      type: 'ALL',
      from_date: '',
      to_date: ''
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-group mb-0">
            <label htmlFor="user" className="form-label">User Name</label>
            <input
              type="text"
              id="user"
              name="user"
              className="input"
              placeholder="Search by user's name or email"
              value={filters.user}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group mb-0">
            <label htmlFor="type" className="form-label">Type</label>
            <select
              id="type"
              name="type"
              className="input"
              value={filters.type}
              onChange={handleChange}
            >
              {logTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group mb-0">
            <label htmlFor="from_date" className="form-label">From</label>
            <input
              type="date"
              id="from_date"
              name="from_date"
              className="input"
              value={filters.from_date}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group mb-0">
            <label htmlFor="to_date" className="form-label">To</label>
            <input
              type="date"
              id="to_date"
              name="to_date"
              className="input"
              value={filters.to_date}
              onChange={handleChange}
              min={filters.from_date}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4 space-x-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleClear}
          >
            <FaTimes className="mr-1" />
            Clear
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <FaSearch className="mr-1" />
            Filter
          </button>
        </div>
      </form>
    </div>
  );
};

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [logTypes, setLogTypes] = useState(['ALL']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [, setFilters] = useState({
    user: '',
    type: 'ALL',
    from_date: '',
    to_date: ''
  });
  
  const fetchLogTypes = async () => {
    try {
      const response = await ActivityLogService.getLogTypes();
      if (response.success) {
        setLogTypes(response.data);
      }
    } catch (err) {
      console.error('Error fetching log types:', err);
    }
  };
  
  const fetchLogs = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await ActivityLogService.getLogs(filterParams);
      if (response.success) {
        setLogs(response.data);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLogTypes();
    fetchLogs();
  }, []);
  
  const handleFilter = (filterParams) => {
    setFilters(filterParams);
    fetchLogs(filterParams);
  };
  
  const getTypeClass = (type) => {
    switch(type) {
      case 'ERROR':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'AUDIT':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Activity Logs</h1>
        <p className="text-gray-600 mt-1">Track all system activities and user actions</p>
      </div>
      
      <LogFilters onFilter={handleFilter} logTypes={logTypes} />
      
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activity logs...</p>
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
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{log.created}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(log.type)}`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{log.user}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{log.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{log.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{log.action}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No activity logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ActivityLogs;