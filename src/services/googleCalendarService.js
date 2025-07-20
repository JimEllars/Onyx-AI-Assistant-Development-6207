import { format, addDays, parseISO } from 'date-fns';

// Service account credentials - in production, these would be environment variables
const SERVICE_ACCOUNT = {
  email: 'api-link-1-greta-via-supabase@onyx-ai-asst-1.iam.gserviceaccount.com',
  scopes: [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ]
};

// Mock access token - in production, this would be obtained via OAuth
let accessToken = null;

/**
 * Initialize Google Calendar API
 * In production, this would handle OAuth2 authentication
 */
export const initGoogleCalendar = async () => {
  try {
    console.log('Initializing Google Calendar API with service account:', SERVICE_ACCOUNT.email);
    
    // Simulate successful authentication
    accessToken = 'mock-token-for-development';
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Calendar:', error);
    return false;
  }
};

/**
 * Get upcoming events from the user's calendar
 * @param {Object} options - Options for fetching events
 * @returns {Promise<Array>} - List of calendar events
 */
export const getUpcomingEvents = async (options = {}) => {
  try {
    const { days = 7, maxResults = 10 } = options;
    
    console.log(`Getting upcoming events for next ${days} days, max ${maxResults} events`);
    
    // In development, return mock data
    const today = new Date();
    
    return [
      {
        id: 'event1',
        summary: 'Board Meeting',
        description: 'Quarterly board meeting to discuss Q3 results',
        start: {
          dateTime: addDays(today, 1).toISOString(),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: addDays(today, 1).toISOString().replace('T09:', 'T11:'),
          timeZone: 'America/New_York'
        },
        location: 'Conference Room A',
        attendees: [
          { email: 'cfo@axim.global', responseStatus: 'accepted' },
          { email: 'cto@axim.global', responseStatus: 'accepted' },
          { email: 'coo@axim.global', responseStatus: 'tentative' }
        ],
        organizer: { email: 'ceo@axim.global' }
      },
      {
        id: 'event2',
        summary: 'Client Call - XYZ Corp',
        description: 'Discuss implementation timeline for Frontier project',
        start: {
          dateTime: addDays(today, 2).toISOString().replace('T09:', 'T14:'),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: addDays(today, 2).toISOString().replace('T09:', 'T15:'),
          timeZone: 'America/New_York'
        },
        location: 'Virtual - Zoom',
        attendees: [
          { email: 'john@xyzcorp.com', responseStatus: 'accepted' },
          { email: 'sarah@xyzcorp.com', responseStatus: 'needsAction' }
        ],
        organizer: { email: 'demo@axim.global' }
      },
      {
        id: 'event3',
        summary: 'Team Standup',
        description: 'Daily team standup meeting',
        start: {
          dateTime: addDays(today, 3).toISOString().replace('T09:', 'T09:'),
          timeZone: 'America/New_York'
        },
        end: {
          dateTime: addDays(today, 3).toISOString().replace('T09:', 'T09:30'),
          timeZone: 'America/New_York'
        },
        location: 'Conference Room B',
        attendees: [
          { email: 'team@axim.global', responseStatus: 'accepted' }
        ],
        organizer: { email: 'demo@axim.global' },
        recurrence: ['RRULE:FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR']
      }
    ];
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    throw error;
  }
};

/**
 * Create a new event in the user's calendar
 * @param {Object} eventData - Event data to create
 * @returns {Promise<Object>} - Created event
 */
export const createEvent = async (eventData) => {
  try {
    console.log('Creating calendar event:', eventData);
    
    // Mock response
    return {
      id: 'new-event-' + Date.now(),
      summary: eventData.summary,
      description: eventData.description,
      start: eventData.start,
      end: eventData.end,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      htmlLink: 'https://calendar.google.com/calendar/event?eid=mock-link'
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {string} eventId - ID of the event to update
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} - Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    console.log('Updating event:', eventId, eventData);
    
    // Mock response
    return {
      id: eventId,
      summary: eventData.summary,
      description: eventData.description,
      start: eventData.start,
      end: eventData.end,
      updated: new Date().toISOString(),
      htmlLink: 'https://calendar.google.com/calendar/event?eid=mock-link'
    };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete an event from the calendar
 * @param {string} eventId - ID of the event to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteEvent = async (eventId) => {
  try {
    console.log('Deleting event:', eventId);
    
    // Mock successful deletion
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Format a calendar event for display
 * @param {Object} event - Calendar event
 * @returns {Object} - Formatted event for UI display
 */
export const formatEventForDisplay = (event) => {
  const startDate = parseISO(event.start.dateTime || event.start.date);
  const endDate = parseISO(event.end.dateTime || event.end.date);
  
  return {
    id: event.id,
    title: event.summary,
    description: event.description || '',
    start: startDate,
    end: endDate,
    location: event.location || 'No location specified',
    isAllDay: !event.start.dateTime,
    attendees: event.attendees || [],
    organizer: event.organizer || { email: 'Unknown' },
    formattedTime: `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`,
    formattedDate: format(startDate, 'MMMM d, yyyy'),
    recurrence: event.recurrence || null
  };
};

export default {
  initGoogleCalendar,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  formatEventForDisplay
};