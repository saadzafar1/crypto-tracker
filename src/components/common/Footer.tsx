import React from 'react';
import { TrendingUp, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  CryptoTracker
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional Dashboard
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Real-time cryptocurrency market data with advanced analytics and professional design.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• Real-time market data</li>
              <li>• Advanced price charts</li>
              <li>• Comprehensive analytics</li>
              <li>• Dark/Light theme</li>
              <li>• Responsive design</li>
            </ul>
          </div>

          {/* Data Source Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Data Source
            </h4>
            <div className="space-y-3">
              <a
                href="https://www.coingecko.com/en/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
              >
                <span>Powered by CoinGecko API</span>
                <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Reliable cryptocurrency data from one of the world's largest independent crypto data aggregators.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>using modern React development practices</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} CryptoTracker. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};