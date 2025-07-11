import React from 'react';
import { TrendingUp, Activity, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface EnhancedFullPageLoaderProps {
  progress: number;
  currentStep: string;
  error?: string | null;
}

export const EnhancedFullPageLoader: React.FC<EnhancedFullPageLoaderProps> = ({
  progress,
  currentStep,
  error,
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          CryptoTracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Professional Dashboard
        </p>

        {/* Error State */}
        {error ? (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="text-red-600 dark:text-red-400 font-medium text-lg">
                Error Loading Data
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Loading Animation */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              {progress === 100 ? (
                <CheckCircle className="h-8 w-8 text-green-500" />
              ) : (
                <LoadingSpinner size="lg" />
              )}
              <span className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                {currentStep}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Loading Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Activity className="h-4 w-4" />
              <span>Connecting to live market data</span>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>

            {/* Powered by CoinGecko */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href="https://www.coingecko.com/en/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                <span>Powered by CoinGecko API</span>
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Loading Steps */}
            <div className="mt-8 space-y-2">
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className={`flex items-center space-x-2 ${progress >= 25 ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {progress >= 25 ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                  <span>Global Data</span>
                </div>
                <div className={`flex items-center space-x-2 ${progress >= 50 ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {progress >= 50 ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                  <span>Trending Coins</span>
                </div>
                <div className={`flex items-center space-x-2 ${progress >= 75 ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {progress >= 75 ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                  <span>Top Cryptos</span>
                </div>
                <div className={`flex items-center space-x-2 ${progress >= 100 ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {progress >= 100 ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                  <span>All Markets</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};