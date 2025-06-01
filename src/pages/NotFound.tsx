import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary-dark rounded-xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors duration-200 font-medium"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            Need help? <Link to="/" className="text-primary hover:text-primary-dark underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
