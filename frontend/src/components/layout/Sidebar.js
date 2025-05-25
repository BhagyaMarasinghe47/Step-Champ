import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaTrophy, 
  FaUsers, 
  FaCog, 
 
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import stepChampLogo from '../../assets/images/step-champ-logo.png';

const Sidebar = () => {
  const location = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="w-64 bg-sidebar shadow-md hidden md:block">
      <div className="p-4 border-b">
        <div className="flex items-center justify-center">
          <img src={stepChampLogo} alt="StepChamp Logo" className="h-12" />
        </div>
      </div>
      
      <nav className="py-4">
        <ul>
          <li className="mb-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-3 text-sm ${
                isActive('/') 
                  ? 'text-primary bg-primary-light font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaHome className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className="mb-1">
            <Link
              to="/challenges"
              className={`flex items-center px-4 py-3 text-sm ${
                isActive('/challenges') 
                  ? 'text-primary bg-primary-light font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaTrophy className="mr-3" />
              <span>Challenges</span>
            </Link>
          </li>
          
          <li className="mb-1">
            <Link
              to="/users"
              className={`flex items-center px-4 py-3 text-sm ${
                isActive('/users') 
                  ? 'text-primary bg-primary-light font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaUsers className="mr-3" />
              <span>Manage Users</span>
            </Link>
          </li>
          
          <li className="mb-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center justify-between w-full px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 ${
                showSettings && 'bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <FaCog className="mr-3" />
                <span>Settings</span>
              </div>
              {showSettings ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </button>
            
            {showSettings && (
              <ul className="pl-8 py-1 bg-gray-50">
                <li>
                  <Link
                    to="/settings/account"
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/settings/account') 
                        ? 'text-primary font-medium' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <span>Account</span>
                  </Link>
                </li>
                
                <li>
                  <Link
                    to="/activity-logs"
                    className={`flex items-center px-4 py-2 text-sm ${
                      isActive('/activity-logs') 
                        ? 'text-primary font-medium' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <span>Activity Logs</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;