/**
 * Gmail Service
 * 
 * This service provides an interface for interacting with Gmail.
 * In a production environment, this would use the Gmail API.
 * For the demo, we simulate the Gmail API with mock data.
 */

// Service account credentials - in production, these would be environment variables
const SERVICE_ACCOUNT = {
  email: 'api-link-1-greta-via-supabase@onyx-ai-asst-1.iam.gserviceaccount.com',
  scopes: [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels'
  ]
};

// Mock access token - in production, this would be obtained via OAuth
let accessToken = null;

/**
 * Initialize Gmail API
 * In production, this would handle OAuth2 authentication
 */
export const initGmail = async () => {
  try {
    console.log('Initializing Gmail API with service account:', SERVICE_ACCOUNT.email);
    
    // Simulate successful authentication
    accessToken = 'mock-token-for-development';
    return true;
  } catch (error) {
    console.error('Failed to initialize Gmail:', error);
    return false;
  }
};

/**
 * Get unread emails from the user's inbox
 * @param {Object} options - Options for fetching emails
 * @returns {Promise<Array>} - List of unread emails
 */
export const getUnreadEmails = async (options = {}) => {
  try {
    const { maxResults = 10, labelIds = ['INBOX'] } = options;
    
    console.log(`Getting up to ${maxResults} unread emails with labels:`, labelIds);
    
    // In development, return mock data
    return [
      {
        id: 'email1',
        threadId: 'thread1',
        labelIds: ['INBOX', 'IMPORTANT', 'UNREAD'],
        snippet: 'Hi John, I wanted to follow up on our conversation about the Frontier project...',
        payload: {
          headers: [
            { name: 'From', value: 'Sarah Chen <sarah@xyzcorp.com>' },
            { name: 'Subject', value: 'Frontier Project Follow-up' },
            { name: 'Date', value: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
          ],
          mimeType: 'text/html',
          body: {
            data: 'Hi John, I wanted to follow up on our conversation about the Frontier project. We\'re excited to move forward with the implementation. Could you share the timeline for the next steps? Best, Sarah'
          }
        }
      },
      {
        id: 'email2',
        threadId: 'thread2',
        labelIds: ['INBOX', 'UNREAD'],
        snippet: 'REMINDER: Board Meeting Tomorrow at 10:00 AM...',
        payload: {
          headers: [
            { name: 'From', value: 'Executive Assistant <assistant@axim.global>' },
            { name: 'Subject', value: 'REMINDER: Board Meeting Tomorrow' },
            { name: 'Date', value: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
          ],
          mimeType: 'text/html',
          body: {
            data: 'REMINDER: The quarterly board meeting is scheduled for tomorrow at 10:00 AM in Conference Room A. Please review the attached Q3 report before the meeting.'
          }
        }
      },
      {
        id: 'email3',
        threadId: 'thread3',
        labelIds: ['INBOX', 'UNREAD'],
        snippet: 'New Lead: ABC Corporation interested in Frontier solution...',
        payload: {
          headers: [
            { name: 'From', value: 'Lead Generation <leads@axim.global>' },
            { name: 'Subject', value: 'New Lead: ABC Corporation' },
            { name: 'Date', value: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() }
          ],
          mimeType: 'text/html',
          body: {
            data: 'A new lead has been generated through the website. ABC Corporation is interested in our Frontier solution for their global operations. Contact: Michael Johnson, CTO (michael@abccorp.com)'
          }
        }
      }
    ];
  } catch (error) {
    console.error('Error getting unread emails:', error);
    throw error;
  }
};

/**
 * Send an email
 * @param {Object} emailData - Email data to send
 * @returns {Promise<Object>} - Sent email
 */
export const sendEmail = async (emailData) => {
  try {
    console.log('Sending email:', emailData);
    
    // Mock response
    return {
      id: 'sent-email-' + Date.now(),
      threadId: 'new-thread-' + Date.now(),
      labelIds: ['SENT'],
      message: emailData
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

/**
 * Mark an email as read
 * @param {string} emailId - ID of the email to mark as read
 * @returns {Promise<boolean>} - Success status
 */
export const markAsRead = async (emailId) => {
  try {
    console.log('Marking email as read:', emailId);
    
    // Mock successful operation
    return true;
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
};

/**
 * Format an email for display
 * @param {Object} email - Gmail email object
 * @returns {Object} - Formatted email for UI display
 */
export const formatEmailForDisplay = (email) => {
  const getHeader = (name) => {
    const header = email.payload.headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };
  
  const from = getHeader('From');
  const subject = getHeader('Subject');
  const date = getHeader('Date');
  
  return {
    id: email.id,
    from: from,
    fromName: from.split('<')[0].trim(),
    fromEmail: (from.match(/<(.+?)>/) || ['', ''])[1],
    subject: subject,
    date: new Date(date),
    snippet: email.snippet,
    isUnread: email.labelIds.includes('UNREAD'),
    isImportant: email.labelIds.includes('IMPORTANT'),
    body: email.payload.body.data
  };
};

/**
 * Summarize unread emails
 * @returns {Promise<Object>} - Email summary
 */
export const summarizeUnreadEmails = async () => {
  try {
    const unreadEmails = await getUnreadEmails({ maxResults: 20 });
    
    // In a real app, this would use AI to generate a summary
    // For the demo, we'll create a mock summary
    const importantCount = unreadEmails.filter(email => email.labelIds.includes('IMPORTANT')).length;
    
    return {
      total: unreadEmails.length,
      important: importantCount,
      categories: {
        clients: unreadEmails.filter(email => getEmailCategory(email) === 'client').length,
        internal: unreadEmails.filter(email => getEmailCategory(email) === 'internal').length,
        leads: unreadEmails.filter(email => getEmailCategory(email) === 'lead').length,
        other: unreadEmails.filter(email => getEmailCategory(email) === 'other').length
      },
      topSenders: getTopSenders(unreadEmails, 3),
      recentSubjects: unreadEmails.slice(0, 5).map(email => {
        const subject = email.payload.headers.find(h => h.name === 'Subject').value;
        return subject;
      })
    };
  } catch (error) {
    console.error('Error summarizing unread emails:', error);
    throw error;
  }
};

// Helper function to categorize emails
const getEmailCategory = (email) => {
  const from = email.payload.headers.find(h => h.name === 'From').value.toLowerCase();
  const subject = email.payload.headers.find(h => h.name === 'Subject').value.toLowerCase();
  
  if (from.includes('xyzcorp.com') || from.includes('abccorp.com')) {
    return 'client';
  }
  
  if (from.includes('axim.global')) {
    return 'internal';
  }
  
  if (subject.includes('lead') || from.includes('leads@')) {
    return 'lead';
  }
  
  return 'other';
};

// Helper function to get top senders
const getTopSenders = (emails, count) => {
  const senders = {};
  
  emails.forEach(email => {
    const from = email.payload.headers.find(h => h.name === 'From').value;
    senders[from] = (senders[from] || 0) + 1;
  });
  
  return Object.entries(senders)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([sender, count]) => ({ sender, count }));
};

export default {
  initGmail,
  getUnreadEmails,
  sendEmail,
  markAsRead,
  formatEmailForDisplay,
  summarizeUnreadEmails
};