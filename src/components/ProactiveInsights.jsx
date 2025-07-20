import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiCalendar, FiTrendingUp, FiPlay } = FiIcons;

const ProactiveInsights = () => {
  const { proactiveInsights, executeProactiveAction } = useOnyx();

  const getInsightIcon = (type) => {
    switch (type) {
      case 'email_summary': return FiMail;
      case 'calendar_alert': return FiCalendar;
      case 'revenue_update': return FiTrendingUp;
      default: return FiMail;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-error/50 bg-error/10';
      case 'medium': return 'border-warning/50 bg-warning/10';
      case 'low': return 'border-success/50 bg-success/10';
      default: return 'border-axim-gray-dark/50 bg-axim-navy-light/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Proactive Insights</h3>
      
      <div className="space-y-3">
        <AnimatePresence>
          {proactiveInsights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-axim-gray-dark rounded-full flex items-center justify-center">
                  <SafeIcon icon={getInsightIcon(insight.type)} className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                  <p className="text-axim-gray-light text-xs mt-1">{insight.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-axim-gray">
                      {format(new Date(insight.timestamp), 'HH:mm')}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => executeProactiveAction(insight.id)}
                      className="p-1 bg-axim-blue/20 hover:bg-axim-blue/30 text-axim-blue-light rounded"
                    >
                      <SafeIcon icon={FiPlay} className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {proactiveInsights.length === 0 && (
          <div className="text-center py-8">
            <p className="text-axim-gray text-sm">No new insights</p>
            <p className="text-axim-gray-dark text-xs mt-1">I'll notify you when I find something important</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProactiveInsights;