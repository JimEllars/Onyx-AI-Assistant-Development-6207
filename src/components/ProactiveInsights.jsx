import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiCalendar, FiTrendingUp, FiPlay, FiX } = FiIcons;

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
      case 'high': return 'border-red-500/50 bg-red-500/10';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10';
      case 'low': return 'border-green-500/50 bg-green-500/10';
      default: return 'border-onyx-600/50 bg-onyx-700/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-morphism rounded-2xl p-6"
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
                <div className="w-8 h-8 bg-onyx-600 rounded-full flex items-center justify-center">
                  <SafeIcon 
                    icon={getInsightIcon(insight.type)} 
                    className="w-4 h-4 text-white" 
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{insight.title}</h4>
                  <p className="text-onyx-300 text-xs mt-1">{insight.content}</p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-onyx-400">
                      {format(new Date(insight.timestamp), 'HH:mm')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => executeProactiveAction(insight.id)}
                        className="p-1 bg-accent-500/20 hover:bg-accent-500/30 text-accent-400 rounded"
                      >
                        <SafeIcon icon={FiPlay} className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {proactiveInsights.length === 0 && (
          <div className="text-center py-8">
            <p className="text-onyx-400 text-sm">No new insights</p>
            <p className="text-onyx-500 text-xs mt-1">I'll notify you when I find something important</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProactiveInsights;