import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLogOut, FiActivity, FiUser } = FiIcons;

const Header = () => {
  const { user, logout } = useAuth();
  const { systemStatus } = useOnyx();

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'listening': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism border-b border-onyx-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">O</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Onyx AI Assistant</h1>
              <div className="flex items-center space-x-2 text-sm">
                <SafeIcon icon={FiActivity} className={`w-4 h-4 ${getStatusColor(systemStatus)}`} />
                <span className="text-onyx-300 capitalize">{systemStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-8 h-8 rounded-full border-2 border-accent-500/50"
              />
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-onyx-300">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-onyx-400 hover:text-white transition-colors rounded-lg hover:bg-onyx-700/50"
            >
              <SafeIcon icon={FiLogOut} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;