import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import googleCalendarService from '../services/googleCalendarService';

const { FiCalendar, FiRefreshCw, FiPlus, FiClock, FiMapPin, FiUsers } = FiIcons;

// Simplified Calendar component without react-big-calendar dependency
const CalendarPanel = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    initializeCalendar();
  }, []);

  const initializeCalendar = async () => {
    try {
      setIsLoading(true);
      const success = await googleCalendarService.initGoogleCalendar();
      if (success) {
        setIsInitialized(true);
        await loadEvents();
      }
    } catch (error) {
      console.error("Failed to initialize Google Calendar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const upcomingEvents = await googleCalendarService.getUpcomingEvents({
        days: 30,
        maxResults: 50
      });
      
      // Format events for the calendar
      const formattedEvents = upcomingEvents.map(event => {
        const formatted = googleCalendarService.formatEventForDisplay(event);
        return {
          id: formatted.id,
          title: formatted.title,
          start: formatted.start,
          end: formatted.end,
          allDay: formatted.isAllDay,
          resource: formatted // Store the full formatted event as a resource
        };
      });
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event.resource);
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null);
  };

  // Generate calendar days for the current month view
  const generateCalendarDays = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = startOfWeek(monthStart);
    
    const days = [];
    let day = startDate;
    
    for (let i = 0; i < 35; i++) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    
    return days;
  };

  // Find events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === day.getDate() && 
             eventDate.getMonth() === day.getMonth() &&
             eventDate.getFullYear() === day.getFullYear();
    });
  };

  // Format date for display
  const formatDay = (date) => {
    return format(date, 'd');
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Navigate to previous month
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadEvents}
            disabled={isLoading || !isInitialized}
            className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50 disabled:opacity-50"
          >
            <SafeIcon
              icon={FiRefreshCw}
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}
            />
          </button>
          <button className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50">
            <SafeIcon icon={FiPlus} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isInitialized ? (
        <div className="flex flex-col items-center justify-center py-8">
          <SafeIcon icon={FiCalendar} className="w-10 h-10 text-axim-gray mb-3" />
          <p className="text-axim-gray text-sm text-center">
            Google Calendar integration is not initialized.
          </p>
          <button
            onClick={initializeCalendar}
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-axim-blue text-white rounded-lg flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                <span>Connect Calendar</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="calendar-container">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </h4>
            <div className="flex items-center space-x-2">
              <button 
                onClick={previousMonth}
                className="p-1 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
              >
                <SafeIcon icon={FiIcons.FiChevronLeft} className="w-5 h-5" />
              </button>
              <button 
                onClick={nextMonth}
                className="p-1 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
              >
                <SafeIcon icon={FiIcons.FiChevronRight} className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-axim-gray text-sm py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, i) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              const inCurrentMonth = isCurrentMonth(day);
              
              return (
                <div 
                  key={i}
                  className={`min-h-[80px] p-1 border border-axim-gray-dark/30 rounded-md ${
                    isCurrentDay 
                      ? 'bg-axim-blue/20' 
                      : inCurrentMonth 
                        ? 'bg-axim-navy-dark/30' 
                        : 'bg-axim-navy-dark/10'
                  }`}
                >
                  <div className={`text-right text-sm mb-1 ${
                    inCurrentMonth ? 'text-white' : 'text-axim-gray'
                  }`}>
                    {formatDay(day)}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event, idx) => (
                      <div 
                        key={idx}
                        onClick={() => handleEventSelect(event)}
                        className="text-xs p-1 rounded bg-axim-blue text-white truncate cursor-pointer"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-axim-gray-light text-center">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-axim-navy-dark/50 backdrop-blur-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-axim-blue"></div>
            </div>
          )}

          {selectedEvent && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-axim-navy-dark/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-axim-navy/90 rounded-xl p-6 max-w-md w-full border border-axim-gray-dark/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{selectedEvent.title}</h3>
                  <button
                    onClick={handleCloseEventDetails}
                    className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
                  >
                    <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <SafeIcon icon={FiClock} className="w-5 h-5 text-axim-blue-light" />
                    <div>
                      <p className="text-white">{selectedEvent.formattedDate}</p>
                      <p className="text-axim-gray-light text-sm">{selectedEvent.formattedTime}</p>
                    </div>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiMapPin} className="w-5 h-5 text-axim-blue-light" />
                      <p className="text-white">{selectedEvent.location}</p>
                    </div>
                  )}
                  {selectedEvent.description && (
                    <div className="border-t border-axim-gray-dark pt-3 mt-3">
                      <p className="text-axim-gray-light">{selectedEvent.description}</p>
                    </div>
                  )}
                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div className="border-t border-axim-gray-dark pt-3 mt-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <SafeIcon icon={FiUsers} className="w-4 h-4 text-axim-blue-light" />
                        <p className="text-axim-gray-light">Attendees</p>
                      </div>
                      <div className="space-y-1">
                        {selectedEvent.attendees.map((attendee, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <p className="text-white text-sm">{attendee.email}</p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                attendee.responseStatus === 'accepted'
                                  ? 'bg-success/20 text-success'
                                  : attendee.responseStatus === 'tentative'
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-axim-gray-dark/20 text-axim-gray'
                              }`}
                            >
                              {attendee.responseStatus === 'accepted'
                                ? 'Accepted'
                                : attendee.responseStatus === 'tentative'
                                ? 'Tentative'
                                : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end space-x-3 pt-3 mt-3 border-t border-axim-gray-dark">
                    <button className="px-4 py-2 bg-axim-navy-light border border-axim-gray-dark text-axim-gray-light rounded-lg">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-axim-blue to-axim-blue-light text-white rounded-lg">
                      Add to Schedule
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default CalendarPanel;