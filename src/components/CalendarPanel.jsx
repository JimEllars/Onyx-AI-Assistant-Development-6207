import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import googleCalendarService from '../services/googleCalendarService';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const { FiCalendar, FiRefreshCw, FiPlus, FiClock, FiMapPin, FiUsers } = FiIcons;

// Setup localizer for the calendar
const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

const CalendarPanel = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  const eventStyleGetter = (event) => {
    const style = {
      backgroundColor: '#0059B2',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    };
    return {
      style
    };
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
            <SafeIcon icon={FiRefreshCw} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
          >
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
        <div className="calendar-container" style={{ height: 600 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            className="custom-calendar"
          />
          
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
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              attendee.responseStatus === 'accepted' 
                                ? 'bg-success/20 text-success' 
                                : attendee.responseStatus === 'tentative'
                                  ? 'bg-warning/20 text-warning'
                                  : 'bg-axim-gray-dark/20 text-axim-gray'
                            }`}>
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
      
      <style jsx>{`
        .custom-calendar {
          background-color: rgba(26, 30, 45, 0.5);
          color: #E6E8EC;
          border-radius: 0.5rem;
          padding: 1rem;
        }
        .custom-calendar .rbc-header {
          padding: 0.5rem;
          background-color: rgba(26, 30, 45, 0.8);
          color: #B0B7C3;
        }
        .custom-calendar .rbc-day-bg {
          background-color: rgba(26, 30, 45, 0.3);
        }
        .custom-calendar .rbc-today {
          background-color: rgba(0, 89, 178, 0.2);
        }
        .custom-calendar .rbc-off-range-bg {
          background-color: rgba(18, 21, 31, 0.5);
        }
        .custom-calendar .rbc-toolbar button {
          color: #B0B7C3;
          background-color: rgba(26, 30, 45, 0.8);
          border-color: #3D4561;
        }
        .custom-calendar .rbc-toolbar button:hover {
          background-color: rgba(0, 89, 178, 0.2);
          color: #E6E8EC;
        }
        .custom-calendar .rbc-toolbar button.rbc-active {
          background-color: rgba(0, 89, 178, 0.5);
          color: white;
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarPanel;