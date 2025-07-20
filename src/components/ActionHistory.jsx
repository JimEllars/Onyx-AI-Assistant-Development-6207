import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiClock, FiXCircle } = FiIcons;

const ActionHistory = () => {
  const { actionHistory } = useOnyx();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return FiCheckCircle;
      case 'in_progress': return FiClock;
      case 'failed': return FiXCircle;
      default: return FiClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in_progress': return 'text-warning';
      case 'failed': return 'text-error';
      default: return 'text-axim-gray';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Action History</h3>
      <div className="space-y-3">
        {actionHistory.map((action) => (
          <div
            key={action.id}
            className="border border-axim-gray-dark/50 rounded-lg p-3 bg-axim-navy-light/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={getStatusIcon(action.status)} className={getStatusColor(action.status)} />
                <span className="text-white text-sm font-medium">{action.type}</span>
              </div>
              <span className="text-xs text-axim-gray">
                {format(new Date(action.completed_at || action.created_at), 'MMM d, HH:mm')}
              </span>
            </div>
            <p className="text-axim-gray-light text-sm mt-1">{action.description}</p>
            {action.result && (
              <p className="text-axim-blue-light text-xs mt-2">{action.result}</p>
            )}
          </div>
        ))}
        {actionHistory.length === 0 && (
          <div className="text-center py-8">
            <p className="text-axim-gray text-sm">No actions recorded yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ActionHistory;