import React from 'react';
import { TrendingUp, Activity } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

export const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          CryptoTracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Professional Dashboard
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <LoadingSpinner size="lg" />
          <span className="text-gray-600 dark:text-gray-400 font-medium">
            Loading market data...
          </span>
        </div>

        {/* Live indicator */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Activity className="h-4 w-4" />
          <span>Connecting to live data</span>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};