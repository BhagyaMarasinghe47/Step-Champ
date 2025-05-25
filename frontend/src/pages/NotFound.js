import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="mt-8 inline-flex items-center justify-center btn btn-primary"
        >
          <FaHome className="mr-2" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;