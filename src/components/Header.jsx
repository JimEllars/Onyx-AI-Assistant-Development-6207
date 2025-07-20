import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import GeminiConfig from './GeminiConfig';
import WatchSettings from './WatchSettings';

const { FiLogOut, FiActivity, FiUser, FiSettings, FiX, FiWatch } = FiIcons;

const Header = () => {
  const { user, logout } = useAuth();
  const { systemStatus, geminiReady, watchConnected } = useOnyx();
  const [showSettings, setShowSettings] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-success';
      case 'processing': return 'text-warning';
      case 'listening': return 'text-axim-blue-light';
      default: return 'text-axim-gray';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md border-b border-axim-gray-dark/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 bg-gradient-to-r from-axim-blue to-axim-blue-light rounded-xl flex items-center justify-center shadow-lg"
            >
              <span className="text-xl font-bold text-white">O</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-axim-blue to-axim-blue-light bg-clip-text text-transparent">
                Onyx AI Assistant
              </h1>
              <div className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={FiActivity} className={`w-4 h-4 ${getStatusColor(systemStatus)}`} />
                <span className="text-axim-white capitalize">{systemStatus}</span>
                <span className="text-axim-gray-dark">•</span>
                <span className="text-axim-gray">AXiM Global</span>
                {geminiReady && (
                  <>
                    <span className="text-axim-gray-dark">•</span>
                    <span className="text-success flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.22,11.7l-9.9-9.9c-0.6-0.6-1.5-0.6-2.1,0l-2.6,2.6l3.2,3.2l2.1-2.1l6.8,6.8l-6.8,6.8l-6.8-6.8l2.1-2.1l-3.2-3.2 l-2.6,2.6c-0.6,0.6-0.6,1.5,0,2.1l9.9,9.9c0.6,0.6,1.5,0.6,2.1,0l9.9-9.9C22.82,13.3,22.82,12.3,22.22,11.7z"/>
                      </svg>
                      Gemini
                    </span>
                  </>
                )}
                {watchConnected && (
                  <>
                    <span className="text-axim-gray-dark">•</span>
                    <span className="text-success flex items-center">
                      <SafeIcon icon={FiWatch} className="w-3 h-3 mr-1" />
                      Watch
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                alt={user?.user_metadata?.name || 'User'}
                className="w-10 h-10 rounded-full border-2 border-axim-blue/50"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user?.user_metadata?.name || user?.email || 'James Ellars'}
                </p>
                <p className="text-xs text-axim-gray">Executive</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
              >
                <SafeIcon icon={FiSettings} className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
              >
                <SafeIcon icon={FiLogOut} className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-axim-navy-dark/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-axim-navy/95 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Settings & Integrations</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
                >
                  <SafeIcon icon={FiX} className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GeminiConfig />
                <WatchSettings />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;