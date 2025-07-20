import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import gmailService from '../services/gmailService';

const { FiMail, FiRefreshCw, FiStar, FiTrash2, FiPaperclip, FiCornerUpRight, FiClock } = FiIcons;

const EmailPanel = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emailSummary, setEmailSummary] = useState(null);

  useEffect(() => {
    initializeGmail();
  }, []);

  const initializeGmail = async () => {
    try {
      setIsLoading(true);
      const success = await gmailService.initGmail();
      
      if (success) {
        setIsInitialized(true);
        await loadEmails();
        await loadEmailSummary();
      }
    } catch (error) {
      console.error("Failed to initialize Gmail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmails = async () => {
    try {
      setIsLoading(true);
      const unreadEmails = await gmailService.getUnreadEmails({
        maxResults: 10
      });
      
      // Format emails for display
      const formattedEmails = unreadEmails.map(email => 
        gmailService.formatEmailForDisplay(email)
      );
      
      setEmails(formattedEmails);
    } catch (error) {
      console.error("Failed to load emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadEmailSummary = async () => {
    try {
      const summary = await gmailService.summarizeUnreadEmails();
      setEmailSummary(summary);
    } catch (error) {
      console.error("Failed to load email summary:", error);
    }
  };

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
    
    // In a real app, we would mark the email as read
    gmailService.markAsRead(email.id);
    
    // Update the email in the list to show as read
    setEmails(emails.map(e => 
      e.id === email.id ? { ...e, isUnread: false } : e
    ));
  };

  const handleCloseEmailDetails = () => {
    setSelectedEmail(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Email</h3>
        <button
          onClick={loadEmails}
          disabled={isLoading || !isInitialized}
          className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50 disabled:opacity-50"
        >
          <SafeIcon icon={FiRefreshCw} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!isInitialized ? (
        <div className="flex flex-col items-center justify-center py-8">
          <SafeIcon icon={FiMail} className="w-10 h-10 text-axim-gray mb-3" />
          <p className="text-axim-gray text-sm text-center">
            Gmail integration is not initialized.
          </p>
          <button
            onClick={initializeGmail}
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
                <SafeIcon icon={FiMail} className="w-4 h-4" />
                <span>Connect Gmail</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* Email Summary */}
          {emailSummary && (
            <div className="bg-axim-navy-light/30 rounded-lg p-4 mb-4 border border-axim-gray-dark/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Inbox Summary</h4>
                <div className="flex items-center space-x-1">
                  <SafeIcon icon={FiClock} className="w-4 h-4 text-axim-gray" />
                  <span className="text-axim-gray text-xs">Updated 2 min ago</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex flex-col">
                  <span className="text-axim-gray-light text-sm">Unread</span>
                  <span className="text-white text-xl font-semibold">{emailSummary.total}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-axim-gray-light text-sm">Important</span>
                  <span className="text-warning text-xl font-semibold">{emailSummary.important}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-axim-navy-dark/50 rounded-lg p-2">
                  <div className="text-axim-blue-light">{emailSummary.categories.clients}</div>
                  <div className="text-axim-gray-light mt-1">Clients</div>
                </div>
                <div className="bg-axim-navy-dark/50 rounded-lg p-2">
                  <div className="text-axim-blue-light">{emailSummary.categories.internal}</div>
                  <div className="text-axim-gray-light mt-1">Internal</div>
                </div>
                <div className="bg-axim-navy-dark/50 rounded-lg p-2">
                  <div className="text-axim-blue-light">{emailSummary.categories.leads}</div>
                  <div className="text-axim-gray-light mt-1">Leads</div>
                </div>
                <div className="bg-axim-navy-dark/50 rounded-lg p-2">
                  <div className="text-axim-blue-light">{emailSummary.categories.other}</div>
                  <div className="text-axim-gray-light mt-1">Other</div>
                </div>
              </div>
            </div>
          )}
          
          {/* Email List */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {emails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailSelect(email)}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-axim-navy-light/50 ${
                  email.isUnread 
                    ? 'border-axim-gray-dark/50 bg-axim-navy-light/30' 
                    : 'border-axim-gray-dark/20 bg-axim-navy-dark/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-axim-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {email.fromName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm ${email.isUnread ? 'text-white font-medium' : 'text-axim-gray-light'}`}>
                        {email.fromName}
                      </p>
                      <p className="text-xs text-axim-gray">
                        {email.fromEmail}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-axim-gray">
                    {format(email.date, 'HH:mm')}
                  </div>
                </div>
                
                <p className={`text-sm ${email.isUnread ? 'text-white font-medium' : 'text-axim-gray-light'}`}>
                  {email.subject}
                </p>
                
                <p className="text-xs text-axim-gray mt-1 truncate">
                  {email.snippet}
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1">
                    {email.isImportant && (
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-warning" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-axim-gray hover:text-white transition-colors rounded-full hover:bg-axim-navy-dark/50">
                      <SafeIcon icon={FiCornerUpRight} className="w-3 h-3" />
                    </button>
                    <button className="p-1 text-axim-gray hover:text-error transition-colors rounded-full hover:bg-axim-navy-dark/50">
                      <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {emails.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-axim-gray text-sm">No unread emails</p>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-axim-blue"></div>
              </div>
            )}
          </div>
          
          {/* Email Detail View */}
          {selectedEmail && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-axim-navy-dark/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-axim-navy/90 rounded-xl p-6 max-w-2xl w-full border border-axim-gray-dark/30 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedEmail.subject}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-6 h-6 bg-axim-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {selectedEmail.fromName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white text-sm">{selectedEmail.fromName}</p>
                        <p className="text-axim-gray text-xs">{selectedEmail.fromEmail}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-axim-gray">
                      {format(selectedEmail.date, 'MMM d, HH:mm')}
                    </span>
                    <button
                      onClick={handleCloseEmailDetails}
                      className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
                    >
                      <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-axim-gray-dark pt-4 mt-2">
                  <div className="text-axim-gray-light text-sm whitespace-pre-wrap">
                    {selectedEmail.body}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-axim-gray-dark">
                  <button className="px-4 py-2 bg-axim-navy-light border border-axim-gray-dark text-axim-gray-light rounded-lg flex items-center space-x-2">
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                  <button className="px-4 py-2 bg-gradient-to-r from-axim-blue to-axim-blue-light text-white rounded-lg flex items-center space-x-2">
                    <SafeIcon icon={FiCornerUpRight} className="w-4 h-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmailPanel;