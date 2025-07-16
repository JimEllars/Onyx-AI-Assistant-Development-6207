import React from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiCheck, FiClock, FiAlertCircle } = FiIcons;

const SystemStatus = () => {
  const { systemStatus, availableTools } = useOnyx();

  const getStatusInfo = (status) => {
    switch (status) {
      case 'ready':
        return { icon: FiCheck, color: 'text-green-400', bg: 'bg-green-400/20', text: 'Ready' };
      case 'processing':
        return { icon: FiActivity, color: 'text-yellow-400', bg: 'bg-yellow-400/20', text: 'Processing' };
      case 'listening':
        return { icon: FiActivity, color: 'text-blue-400', bg: 'bg-blue-400/20', text: 'Listening' };
      default:
        return { icon: FiAlertCircle, color: 'text-gray-400', bg: 'bg-gray-400/20', text: 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo(systemStatus);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-morphism rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${statusInfo.bg} rounded-full flex items-center justify-center`}>
            <SafeIcon icon={statusInfo.icon} className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          <div>
            <p className="text-white font-medium">{statusInfo.text}</p>
            <p className="text-onyx-400 text-sm">Core System</p>
          </div>
        </div>

        <div className="border-t border-onyx-700 pt-4">
          <h4 className="text-sm font-medium text-onyx-200 mb-2">Available Tools</h4>
          <div className="space-y-2">
            {availableTools.slice(0, 4).map((tool) => (
              <div key={tool.name} className="flex items-center justify-between">
                <span className="text-sm text-onyx-300">{tool.name}</span>
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-onyx-700 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-onyx-300">Last Health Check</span>
            <span className="text-onyx-400">2 min ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-onyx-300">Uptime</span>
            <span className="text-onyx-400">99.9%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemStatus;