import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';

const OnyxContext = createContext();

export const useOnyx = () => {
  const context = useContext(OnyxContext);
  if (!context) {
    throw new Error('useOnyx must be used within an OnyxProvider');
  }
  return context;
};

export const OnyxProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ready');
  const [availableTools, setAvailableTools] = useState([]);
  const [proactiveInsights, setProactiveInsights] = useState([]);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: '1',
      type: 'assistant',
      content: 'Good morning, Mr. Ellars. I\'m Onyx, your AI executive assistant. I\'m ready to help you manage your projects, schedule, and business operations. How can I assist you today?',
      timestamp: new Date(),
      tools_used: [],
      confidence: 0.95
    };
    setMessages([welcomeMessage]);

    // Load available tools
    loadAvailableTools();

    // Start proactive monitoring
    startProactiveMonitoring();
  }, []);

  const loadAvailableTools = async () => {
    // Simulate loading tools from backend
    const tools = [
      { name: 'GoogleDriveTool', methods: ['searchFiles', 'readFile', 'writeFile', 'updateFile'] },
      { name: 'GoogleSheetsTool', methods: ['appendRow', 'readRange', 'updateCell'] },
      { name: 'GmailTool', methods: ['readEmails', 'summarizeUnread', 'sendEmail'] },
      { name: 'WordPressTool', methods: ['createPost', 'updatePost'] },
      { name: 'CameraTool', methods: ['captureImage', 'analyzeImage'] },
      { name: 'FrontierTool', methods: ['generateLeads', 'updateCRM'] }
    ];
    setAvailableTools(tools);
  };

  const startProactiveMonitoring = () => {
    // Simulate proactive insights
    setTimeout(() => {
      const insights = [
        {
          id: '1',
          type: 'email_summary',
          title: 'Unread Email Summary',
          content: 'You have 3 unread emails from high-priority contacts',
          priority: 'high',
          suggested_action: 'Review and respond to urgent emails',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'calendar_alert',
          title: 'Upcoming Meeting',
          content: 'Board meeting in 30 minutes - Conference Room A',
          priority: 'medium',
          suggested_action: 'Prepare meeting materials',
          timestamp: new Date()
        }
      ];
      setProactiveInsights(insights);
    }, 3000);
  };

  const sendMessage = async (content, type = 'user') => {
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await processCommand(content);
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        tools_used: response.tools_used || [],
        confidence: response.confidence || 0.9
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processCommand = async (command) => {
    // Simulate intelligent command processing
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('email') || lowerCommand.includes('mail')) {
      return {
        content: 'I\'ve checked your Gmail. You have 3 unread emails: 2 from potential clients and 1 from your development team regarding the Frontier project. Would you like me to summarize them or draft responses?',
        tools_used: ['GmailTool.readEmails', 'GmailTool.summarizeUnread'],
        confidence: 0.92
      };
    }

    if (lowerCommand.includes('schedule') || lowerCommand.includes('calendar')) {
      return {
        content: 'Your calendar shows a board meeting at 2:00 PM today and a client call at 4:30 PM. Tomorrow you have a team standup at 9:00 AM. Would you like me to prepare materials for any of these meetings?',
        tools_used: ['GoogleCalendarTool.getEvents'],
        confidence: 0.88
      };
    }

    if (lowerCommand.includes('project') || lowerCommand.includes('frontier')) {
      return {
        content: 'I\'ve reviewed the Frontier project status. Development is 78% complete, with the lead generation module in final testing. The team has flagged 2 minor issues that need your attention. Shall I create a summary report?',
        tools_used: ['GoogleDriveTool.searchFiles', 'GoogleSheetsTool.readRange'],
        confidence: 0.85
      };
    }

    if (lowerCommand.includes('revenue') || lowerCommand.includes('sales')) {
      return {
        content: 'Current month revenue is tracking at $47,300, which is 12% above target. The Frontier project has generated 3 new qualified leads this week. I\'ve prepared a detailed revenue report in your Google Drive.',
        tools_used: ['GoogleSheetsTool.readRange', 'GoogleDriveTool.writeFile'],
        confidence: 0.91
      };
    }

    // Default response
    return {
      content: 'I understand you\'re asking about: "' + command + '". I\'m processing this request and will provide you with the most relevant information from your connected systems. Is there a specific aspect you\'d like me to focus on?',
      tools_used: [],
      confidence: 0.7
    };
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      // This would normally contain the transcribed text
      const mockTranscription = "Check my emails and update me on the Frontier project status";
      sendMessage(mockTranscription);
    }, 3000);
  };

  const executeProactiveAction = async (insightId) => {
    const insight = proactiveInsights.find(i => i.id === insightId);
    if (insight) {
      setIsProcessing(true);
      
      // Simulate executing the suggested action
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const actionMessage = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `I've executed the suggested action: ${insight.suggested_action}. The task has been completed successfully.`,
        timestamp: new Date(),
        tools_used: ['AutomatedAction'],
        confidence: 0.95
      };

      setMessages(prev => [...prev, actionMessage]);
      setProactiveInsights(prev => prev.filter(i => i.id !== insightId));
      setIsProcessing(false);
    }
  };

  const value = {
    messages,
    isListening,
    isProcessing,
    systemStatus,
    availableTools,
    proactiveInsights,
    sendMessage,
    startVoiceRecognition,
    executeProactiveAction
  };

  return (
    <OnyxContext.Provider value={value}>
      {children}
    </OnyxContext.Provider>
  );
};