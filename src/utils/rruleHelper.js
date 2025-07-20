// Mock RRule implementation
// In a production environment, this would use the actual rrule library

// Define frequencies constants
const RRule = {
  DAILY: 0,
  WEEKLY: 1,
  MONTHLY: 2,
  YEARLY: 3,
  MO: 'MO',
  TU: 'TU',
  WE: 'WE',
  TH: 'TH',
  FR: 'FR',
  SA: 'SA',
  SU: 'SU',
  fromString: (str) => {
    // Mock implementation
    return {
      toText: () => {
        // Parse the string and return human-readable text
        if (str.includes('DAILY')) return 'Every day';
        if (str.includes('WEEKLY')) return 'Every week';
        if (str.includes('MONTHLY')) return 'Every month';
        if (str.includes('YEARLY')) return 'Every year';
        return 'Custom schedule';
      },
      after: (date) => {
        // Calculate next occurrence after the given date
        const next = new Date(date);
        next.setDate(next.getDate() + 1); // Default to next day
        return next;
      }
    };
  }
};

export const frequencies = [
  { value: RRule.DAILY, label: 'Daily' },
  { value: RRule.WEEKLY, label: 'Weekly' },
  { value: RRule.MONTHLY, label: 'Monthly' },
  { value: RRule.YEARLY, label: 'Yearly' }
];

export const createRRule = (frequency, interval = 1, endDate = null, daysOfWeek = []) => {
  // Mock implementation that returns a string representation
  let rule = `RRULE:FREQ=`;
  
  switch (frequency) {
    case RRule.DAILY:
      rule += 'DAILY';
      break;
    case RRule.WEEKLY:
      rule += 'WEEKLY';
      break;
    case RRule.MONTHLY:
      rule += 'MONTHLY';
      break;
    case RRule.YEARLY:
      rule += 'YEARLY';
      break;
    default:
      rule += 'DAILY';
  }
  
  if (interval > 1) {
    rule += `;INTERVAL=${interval}`;
  }
  
  if (endDate) {
    const formattedDate = new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    rule += `;UNTIL=${formattedDate}`;
  }
  
  if (daysOfWeek.length > 0 && frequency === RRule.WEEKLY) {
    rule += `;BYDAY=${daysOfWeek.join(',')}`;
  }
  
  return {
    toString: () => rule,
    after: (date) => {
      // Calculate next occurrence after the given date
      const next = new Date(date);
      next.setDate(next.getDate() + interval); // Simplified: just add the interval in days
      return next;
    }
  };
};

export const formatRecurrence = (rruleString) => {
  if (!rruleString) return '';
  
  try {
    // Simple parsing for common patterns
    if (rruleString.includes('FREQ=DAILY')) {
      return rruleString.includes('INTERVAL=') 
        ? `Every ${rruleString.match(/INTERVAL=(\d+)/)[1]} days` 
        : 'Every day';
    }
    
    if (rruleString.includes('FREQ=WEEKLY')) {
      return rruleString.includes('INTERVAL=') 
        ? `Every ${rruleString.match(/INTERVAL=(\d+)/)[1]} weeks` 
        : 'Every week';
    }
    
    if (rruleString.includes('FREQ=MONTHLY')) {
      return rruleString.includes('INTERVAL=') 
        ? `Every ${rruleString.match(/INTERVAL=(\d+)/)[1]} months` 
        : 'Every month';
    }
    
    if (rruleString.includes('FREQ=YEARLY')) {
      return rruleString.includes('INTERVAL=') 
        ? `Every ${rruleString.match(/INTERVAL=(\d+)/)[1]} years` 
        : 'Every year';
    }
    
    return "Custom schedule";
  } catch (error) {
    console.error("Error formatting RRule string:", error);
    return "Custom schedule";
  }
};

export const getNextOccurrence = (rruleString) => {
  if (!rruleString) return new Date();
  
  try {
    // Calculate next occurrence based on rule pattern
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tomorrow; // Simplified: just return tomorrow's date
  } catch (error) {
    console.error("Error getting next occurrence:", error);
    return new Date();
  }
};

export default {
  frequencies,
  createRRule,
  formatRecurrence,
  getNextOccurrence
};