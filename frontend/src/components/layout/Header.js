import React, { useState } from 'react';
import { FaSearch, FaBell, FaBars, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600 focus:outline-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <FaBars size={20} />
        </button>
        
        {/* Search bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-md text-sm border border-gray-300 focus:outline-none focus:border-primary"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        
        {/* Profile and notifications */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-primary">
            <FaBell size={18} />
          </button>
          
          <div className="relative">
            <button
              className="flex items-center text-gray-600 hover:text-primary"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </button>
            
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                
                <a
                  href="/settings/account"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaUser className="mr-2" />
                  <span>My Account</span>
                </a>
                
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="px-4 py-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-md text-sm border border-gray-300 focus:outline-none focus:border-primary"
            />
          </div>
          
          <nav className="mt-2">
            <a
              href="/"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </a>
            
            <a
              href="/challenges"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Challenges
            </a>
            
            <a
              href="/users"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Manage Users
            </a>
            
            <a
              href="/settings/account"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Account Settings
            </a>
            
            <a
              href="/activity-logs"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Activity Logs
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;