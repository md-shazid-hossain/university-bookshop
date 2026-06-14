import React from "react";
import {  useNavigate } from "react-router"; // If using React Router

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* 404 Illustration/Icon */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-32 h-32 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-gray-800 mb-4">404</h1>
        
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-3">
          Page Not Found
        </h2>
        
        {/* Description */}
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard/home")} // Redirect to home/dashboard
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            Go Back Home
          </button>
          
          {/* <Link
            to="/shop"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
          >
            Browse Items
          </Link> */}
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-400 mt-8">
          Need help? <a href="/contact" className="text-indigo-600 hover:underline">Contact support</a>
        </p>
      </div>
    </div>
  );
};

export default NotFound;