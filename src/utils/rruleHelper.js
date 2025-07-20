import { RRule } from 'rrule';

export const frequencies = [
  { value: RRule.DAILY, label: 'Daily' },
  { value: RRule.WEEKLY, label: 'Weekly' },
  { value: RRule.MONTHLY, label: 'Monthly' },
  { value: RRule.YEARLY, label: 'Yearly' }
];

export const createRRule = (frequency, interval = 1, endDate = null, daysOfWeek = []) => {
  const options = {
    freq: frequency,
    interval: interval,
    dtstart: new Date()
  };

  if (endDate) {
    options.until = new Date(endDate);
  }

  if (daysOfWeek.length > 0 && frequency === RRule.WEEKLY) {
    options.byweekday = daysOfWeek.map(day => {
      switch(day) {
        case 'MO': return RRule.MO;
        case 'TU': return RRule.TU;
        case 'WE': return RRule.WE;
        case 'TH': return RRule.TH;
        case 'FR': return RRule.FR;
        case 'SA': return RRule.SA;
        case 'SU': return RRule.SU;
        default: return RRule.MO;
      }
    });
  }

  return new RRule(options);
};

export const formatRecurrence = (rruleString) => {
  if (!rruleString) return '';
  try {
    const rule = RRule.fromString(rruleString);
    return rule.toText();
  } catch (error) {
    console.error("Error formatting RRule string:", error);
    return "Custom schedule";
  }
};

export const getNextOccurrence = (rruleString) => {
  if (!rruleString) return new Date();
  try {
    const rule = RRule.fromString(rruleString);
    return rule.after(new Date());
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