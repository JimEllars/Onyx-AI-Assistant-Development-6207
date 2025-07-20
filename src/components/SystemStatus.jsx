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
        return { icon: FiCheck, color: 'text-success', bg: 'bg-success/20', text: 'Ready' };
      case 'processing':
        return { icon: FiActivity, color: 'text-warning', bg: 'bg-warning/20', text: 'Processing' };
      case 'listening':
        return { icon: FiActivity, color: 'text-axim-blue-light', bg: 'bg-axim-blue-light/20', text: 'Listening' };
      default:
        return { icon: FiAlertCircle, color: 'text-axim-gray', bg: 'bg-axim-gray/20', text: 'Unknown' };
    }
  };

  const statusInfo = getStatusInfo(systemStatus);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${statusInfo.bg} rounded-full flex items-center justify-center`}>
            <SafeIcon icon={statusInfo.icon} className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          <div>
            <p className="text-white font-medium">{statusInfo.text}</p>
            <p className="text-axim-gray text-sm">Core System</p>
          </div>
        </div>

        <div className="border-t border-axim-gray-dark pt-4">
          <h4 className="text-sm font-medium text-axim-white mb-2">Available Tools</h4>
          <div className="space-y-2">
            {availableTools.slice(0, 4).map((tool) => (
              <div key={tool.name} className="flex items-center justify-between">
                <span className="text-sm text-axim-gray-light">{tool.name}</span>
                <SafeIcon icon={FiCheck} className="w-4 h-4 text-success" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-axim-gray-dark pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-axim-gray-light">Last Health Check</span>
            <span className="text-axim-gray">2 min ago</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-axim-gray-light">Uptime</span>
            <span className="text-axim-gray">99.9%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SystemStatus;