import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import RecurringActionForm from './RecurringActionForm';
import RecurringActionsList from './RecurringActionsList';

const { FiCalendar, FiClock, FiCheck, FiRepeat } = FiIcons;

const ActionScheduler = () => {
  const [showRecurring, setShowRecurring] = useState(false);
  const { scheduleAction, scheduledActions } = useOnyx();
  const [newAction, setNewAction] = useState({
    type: '',
    description: '',
    scheduledFor: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await scheduleAction(newAction);
    setNewAction({ type: '', description: '', scheduledFor: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Schedule Actions</h3>
        <button
          onClick={() => setShowRecurring(!showRecurring)}
          className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
            showRecurring
              ? 'bg-axim-blue text-white'
              : 'bg-axim-navy-light/30 text-axim-gray-light'
          }`}
        >
          <SafeIcon icon={FiRepeat} className="w-4 h-4" />
          <span>Recurring</span>
        </button>
      </div>

      {showRecurring ? (
        <RecurringActionsList />
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-axim-white mb-2">
                Action Type
              </label>
              <input
                type="text"
                value={newAction.type}
                onChange={(e) =>
                  setNewAction((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
                placeholder="e.g., Email Review, Project Update"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-axim-white mb-2">
                Description
              </label>
              <textarea
                value={newAction.description}
                onChange={(e) =>
                  setNewAction((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
                placeholder="Action details..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-axim-white mb-2">
                Schedule For
              </label>
              <input
                type="datetime-local"
                value={newAction.scheduledFor}
                onChange={(e) =>
                  setNewAction((prev) => ({ ...prev, scheduledFor: e.target.value }))
                }
                className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-axim-blue to-axim-blue-light text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg hover:shadow-axim-blue/25 hover:translate-y-[-2px]"
            >
              Schedule Action
            </button>
          </form>

          <div className="mt-6">
            <h4 className="text-sm font-medium text-axim-white mb-3">
              Upcoming Actions
            </h4>
            <div className="space-y-3">
              {scheduledActions.map((action) => (
                <div
                  key={action.id}
                  className="border border-axim-gray-dark/50 rounded-lg p-3 bg-axim-navy-light/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCalendar} className="text-axim-blue-light" />
                      <span className="text-white text-sm font-medium">
                        {action.type}
                      </span>
                    </div>
                    <span className="text-xs text-axim-gray">
                      {new Date(action.scheduled_for).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-axim-gray-light text-sm mt-1">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default ActionScheduler;