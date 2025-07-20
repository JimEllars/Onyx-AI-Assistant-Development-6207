import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useOnyx } from '../contexts/OnyxContext';
import supabase from '../lib/supabase';
import { createRRule, frequencies } from '../utils/rruleHelper';

const { FiRepeat, FiCalendar, FiClock, FiCheck } = FiIcons;

const RecurringActionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 3, // RRule.DAILY
    interval: 1,
    actionType: 'email_check',
    endDate: '',
    daysOfWeek: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useOnyx();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const rrule = createRRule(
        formData.frequency,
        formData.interval,
        formData.endDate,
        formData.daysOfWeek
      );

      const nextRun = rrule.after(new Date());

      const { error } = await supabase.from('recurring_actions_ax7y2k').insert([{
        user_id: user?.id || 'demo-user-id',
        title: formData.title,
        description: formData.description,
        rrule: rrule.toString(),
        next_run: nextRun.toISOString(),
        action_type: formData.actionType,
        action_data: {}
      }]);

      if (error) throw error;

      onSuccess?.();
      setFormData({
        title: '',
        description: '',
        frequency: 3,
        interval: 1,
        actionType: 'email_check',
        endDate: '',
        daysOfWeek: []
      });
    } catch (error) {
      console.error('Error creating recurring action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            Action Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
            placeholder="e.g., Daily Email Summary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
            placeholder="Action details..."
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            Action Type
          </label>
          <select
            value={formData.actionType}
            onChange={(e) => handleInputChange('actionType', e.target.value)}
            className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
          >
            <option value="email_check">Email Check</option>
            <option value="calendar_sync">Calendar Sync</option>
            <option value="report_generation">Report Generation</option>
            <option value="data_backup">Data Backup</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            Frequency
          </label>
          <select
            value={formData.frequency}
            onChange={(e) => handleInputChange('frequency', parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
          >
            {frequencies.map((freq) => (
              <option key={freq.value} value={freq.value}>
                {freq.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            Interval
          </label>
          <input
            type="number"
            min="1"
            max="99"
            value={formData.interval}
            onChange={(e) => handleInputChange('interval', parseInt(e.target.value))}
            className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
          />
          <p className="mt-1 text-xs text-axim-gray">
            {formData.frequency === 0 && `Every ${formData.interval} day(s)`}
            {formData.frequency === 1 && `Every ${formData.interval} week(s)`}
            {formData.frequency === 2 && `Every ${formData.interval} month(s)`}
            {formData.frequency === 3 && `Every ${formData.interval} year(s)`}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            End Date (Optional)
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formData.title}
          className="w-full bg-gradient-to-r from-axim-blue to-axim-blue-light text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg hover:shadow-axim-blue/25 hover:translate-y-[-2px] disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              <span>Creating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiRepeat} className="w-4 h-4" />
              <span>Create Recurring Action</span>
            </div>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default RecurringActionForm;