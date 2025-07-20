import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase from '../lib/supabase';
import { formatRecurrence } from '../utils/rruleHelper';

const { FiRepeat, FiCalendar, FiTrash2, FiPause, FiPlay } = FiIcons;

const RecurringActionsList = () => {
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecurringActions();
  }, []);

  const loadRecurringActions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('recurring_actions_ax7y2k')
        .select('*')
        .order('next_run', { ascending: true });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error('Error loading recurring actions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleActionStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('recurring_actions_ax7y2k')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setActions(actions.map(action => 
        action.id === id ? { ...action, is_active: !currentStatus } : action
      ));
    } catch (error) {
      console.error('Error toggling action status:', error);
    }
  };

  const deleteAction = async (id) => {
    try {
      const { error } = await supabase
        .from('recurring_actions_ax7y2k')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setActions(actions.filter(action => action.id !== id));
    } catch (error) {
      console.error('Error deleting recurring action:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium">Recurring Actions</h4>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-axim-blue"></div>
        </div>
      ) : actions.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          <AnimatePresence>
            {actions.map((action) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="border border-axim-gray-dark/50 rounded-lg p-3 bg-axim-navy-light/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiRepeat} className="text-axim-blue-light" />
                    <span className="text-white text-sm font-medium">{action.title}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    action.is_active 
                      ? 'bg-success/20 text-success' 
                      : 'bg-axim-gray-dark/20 text-axim-gray'
                  }`}>
                    {action.is_active ? 'Active' : 'Paused'}
                  </div>
                </div>
                
                <p className="text-axim-gray-light text-xs mb-3">{action.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center text-axim-gray">
                      <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                      <span>Next: {format(new Date(action.next_run), 'MMM d, HH:mm')}</span>
                    </div>
                    <div className="text-axim-gray">
                      {formatRecurrence(action.rrule)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleActionStatus(action.id, action.is_active)}
                      className="p-1.5 bg-axim-navy-dark/50 rounded-lg hover:bg-axim-navy"
                    >
                      <SafeIcon 
                        icon={action.is_active ? FiPause : FiPlay} 
                        className={`w-3 h-3 ${
                          action.is_active ? 'text-warning' : 'text-success'
                        }`} 
                      />
                    </button>
                    <button
                      onClick={() => deleteAction(action.id)}
                      className="p-1.5 bg-axim-navy-dark/50 rounded-lg hover:bg-axim-navy"
                    >
                      <SafeIcon icon={FiTrash2} className="w-3 h-3 text-error" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-axim-gray text-sm">No recurring actions set up</p>
          <p className="text-axim-gray-dark text-xs mt-1">Create one to get started</p>
        </div>
      )}
    </div>
  );
};

export default RecurringActionsList;