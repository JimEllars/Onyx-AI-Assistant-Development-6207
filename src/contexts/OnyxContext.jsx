import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import supabase from '../lib/supabase';
import { getNextOccurrence, formatRecurrence } from '../utils/rruleHelper';
import geminiService from '../services/geminiService';
import watchService from '../services/watchService';
import { useAuth } from './AuthContext';

const OnyxContext = createContext();

export const useOnyx = () => {
  const context = useContext(OnyxContext);
  if (!context) {
    throw new Error('useOnyx must be used within an OnyxProvider');
  }
  return context;
};

export const OnyxProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [systemStatus, setSystemStatus] = useState('ready');
  const [actionHistory, setActionHistory] = useState([]);
  const [scheduledActions, setScheduledActions] = useState([]);
  const [proactiveInsights, setProactiveInsights] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);
  const [geminiReady, setGeminiReady] = useState(false);
  const [watchConnected, setWatchConnected] = useState(false);
  const [watchData, setWatchData] = useState(null);

  // Initialize tools and load data
  useEffect(() => {
    // Set up enhanced tools with ML and Watch integration
    setAvailableTools([
      {
        name: 'Google Drive',
        methods: ['listFiles', 'uploadFile', 'createFolder', 'searchContent']
      },
      {
        name: 'Gmail',
        methods: ['getUnreadEmails', 'sendEmail', 'createDraft', 'smartReply']
      },
      {
        name: 'Google Calendar',
        methods: ['getEvents', 'createEvent', 'updateEvent', 'findOptimalTime']
      },
      {
        name: 'Gemini AI',
        methods: ['generateText', 'chatCompletion', 'summarize', 'analyzeData']
      },
      {
        name: 'Google Watch',
        methods: ['voiceCommands', 'healthMonitoring', 'quickActions', 'contextAwareness']
      },
      {
        name: 'Machine Learning',
        methods: ['predictiveAnalysis', 'patternRecognition', 'anomalyDetection', 'sentimentAnalysis']
      }
    ]);

    // Load mock action history with ML insights
    setActionHistory([
      {
        id: 'action1',
        type: 'Email Summary with ML',
        description: 'Generated AI-powered summary of unread emails with sentiment analysis',
        status: 'completed',
        created_at: new Date(Date.now() - 120000).toISOString(),
        completed_at: new Date(Date.now() - 115000).toISOString(),
        result: '5 unread emails processed, 2 urgent detected via ML'
      },
      {
        id: 'action2',
        type: 'Meeting Optimization',
        description: 'Used ML to find optimal meeting time based on all attendees',
        status: 'completed',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        completed_at: new Date(Date.now() - 3590000).toISOString(),
        result: 'Optimal time found: Tomorrow 2:00 PM (98% confidence)'
      },
      {
        id: 'action3',
        type: 'Health Pattern Analysis',
        description: 'Analyzing stress patterns from watch data during meetings',
        status: 'in_progress',
        created_at: new Date(Date.now() - 300000).toISOString()
      }
    ]);

    // Load mock scheduled actions
    setScheduledActions([
      {
        id: 'scheduled1',
        type: 'ML Revenue Forecast',
        description: 'Generate ML-powered weekly performance report with predictions',
        scheduled_for: new Date(Date.now() + 86400000).toISOString()
      },
      {
        id: 'scheduled2',
        type: 'Smart Client Follow-up',
        description: 'AI-optimized follow-up timing for XYZ Corp based on engagement patterns',
        scheduled_for: new Date(Date.now() + 172800000).toISOString()
      }
    ]);

    // Load enhanced proactive insights
    setProactiveInsights([
      {
        id: 'insight1',
        type: 'email_ml_analysis',
        title: 'High-Priority Email Detected',
        content: 'ML analysis shows Sarah Chen\'s email about Frontier project has 95% urgency score',
        priority: 'high',
        timestamp: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: 'insight2',
        type: 'calendar_optimization',
        title: 'Meeting Schedule Optimization',
        content: 'ML suggests moving 2 PM meeting to 3 PM for 23% better productivity score',
        priority: 'medium',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        id: 'insight3',
        type: 'health_pattern',
        title: 'Stress Pattern Alert',
        content: 'Watch data shows elevated stress during video calls. Suggest 5-min breaks.',
        priority: 'medium',
        timestamp: new Date(Date.now() - 2700000).toISOString()
      }
    ]);

    // Initialize Gemini if user is logged in
    if (user) {
      const initGemini = async () => {
        try {
          const apiKey = await geminiService.getApiKey(user.id);
          if (apiKey) {
            const success = await geminiService.initialize(apiKey);
            setGeminiReady(success);
          }
        } catch (error) {
          console.error("Failed to initialize Gemini:", error);
        }
      };
      
      initGemini();
    }
  }, [user]);

  // Watch data monitoring
  useEffect(() => {
    if (watchConnected) {
      watchService.startDataSync((data) => {
        setWatchData(data);
        
        // Generate health insights
        const insights = watchService.getHealthInsights();
        if (insights && insights.length > 0) {
          insights.forEach(insight => {
            setProactiveInsights(prev => [...prev, {
              id: `health_${Date.now()}`,
              type: 'health_insight',
              title: 'Health Alert from Watch',
              content: insight.message,
              priority: insight.priority,
              timestamp: new Date().toISOString()
            }]);
          });
        }
      });
    }
  }, [watchConnected]);

  // Enhanced message processing with ML and Watch integration
  const sendMessage = async (content) => {
    if (!content.trim()) return;

    try {
      setIsProcessing(true);
      setSystemStatus('processing');

      // Add user message to chat
      const userMessage = {
        id: Date.now().toString(),
        type: 'user',
        content,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // Enhanced response generation with context awareness
      let response;
      if (geminiReady) {
        try {
          // Add context from watch data if available
          let contextualPrompt = content;
          if (watchConnected && watchData) {
            contextualPrompt += `\n\nContext from watch: Heart rate: ${watchData.heartRate} BPM, Steps: ${watchData.steps}, Stress level: ${watchData.stressLevel}/5`;
          }

          const history = messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'model',
            content: msg.content
          }));
          
          history.push({
            role: 'user',
            content: contextualPrompt
          });
          
          const result = await geminiService.generateChat(history);
          response = result.text;
        } catch (error) {
          console.error("Error with Gemini:", error);
          response = getEnhancedMockResponse(content);
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        response = getEnhancedMockResponse(content);
      }

      // Add AI response to chat
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        confidence: Math.random() * 0.2 + 0.8,
        tools_used: getEnhancedRandomTools()
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);

      // Trigger watch notification for important responses
      if (watchConnected && (content.toLowerCase().includes('urgent') || content.toLowerCase().includes('important'))) {
        watchService.sendVoiceCommand('Important response ready');
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
      setSystemStatus('ready');
    }
  };

  // Enhanced voice recognition with watch integration
  const startVoiceRecognition = () => {
    setIsListening(true);
    setSystemStatus('listening');
    
    // If watch is connected, use watch microphone
    if (watchConnected) {
      setTimeout(() => {
        const mockWatchCommand = "Hey Onyx, schedule a meeting with the marketing team for tomorrow at 2 PM and monitor my stress levels";
        sendMessage(mockWatchCommand);
        setIsListening(false);
      }, 3000);
    } else {
      setTimeout(() => {
        const mockVoiceCommand = "Schedule a meeting with the marketing team for tomorrow at 2 PM";
        sendMessage(mockVoiceCommand);
        setIsListening(false);
      }, 3000);
    }
  };

  // Enhanced mock responses with ML and Watch context
  const getEnhancedMockResponse = (input) => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('email') || lowercaseInput.includes('mail')) {
      const mlInsight = geminiReady ? " My ML analysis detected 2 emails with high urgency scores and 1 potential sales opportunity." : "";
      const watchContext = watchConnected ? " I've sent a summary to your watch for quick review." : "";
      return `I've checked your emails using advanced sentiment analysis. You have 5 unread messages, including one marked as important from Sarah Chen regarding the Frontier project.${mlInsight}${watchContext} Would you like me to summarize the high-priority ones?`;
    }
    
    if (lowercaseInput.includes('schedule') || lowercaseInput.includes('meeting')) {
      const mlOptimization = geminiReady ? " Using ML optimization, I found the ideal time slot with 94% attendee availability confidence." : "";
      const watchIntegration = watchConnected ? " I'll monitor your stress levels during the meeting and suggest breaks if needed." : "";
      return `I've scheduled a meeting for tomorrow at 2 PM with the marketing team.${mlOptimization} Calendar invites have been sent to all team members.${watchIntegration}`;
    }
    
    if (lowercaseInput.includes('health') || lowercaseInput.includes('stress') || lowercaseInput.includes('watch')) {
      if (watchConnected) {
        return `Based on your watch data: Heart rate is ${watchData?.heartRate || 72} BPM, you've taken ${watchData?.steps || 2847} steps today. Your stress level appears ${watchData?.stressLevel > 3 ? 'elevated' : 'normal'}. I recommend ${watchData?.stressLevel > 3 ? 'a 5-minute breathing exercise' : 'maintaining your current pace'}.`;
      } else {
        return "To get personalized health insights, connect your Google Watch in settings. I can then monitor your stress levels, heart rate, and activity patterns to provide better recommendations.";
      }
    }
    
    if (lowercaseInput.includes('ml') || lowercaseInput.includes('machine learning') || lowercaseInput.includes('ai')) {
      return "I'm now enhanced with Google's machine learning capabilities including predictive analysis, pattern recognition, and sentiment analysis. I can analyze your email patterns, optimize meeting schedules, predict project timelines, and provide data-driven insights for better decision making.";
    }

    if (lowercaseInput.includes('james') || lowercaseInput.includes('ellars')) {
      return "Hello James! I'm fully configured for your executive needs with enhanced Google integrations. I can now provide ML-powered insights, connect with your Google Watch for health monitoring, and offer predictive analytics for your business decisions.";
    }
    
    return "I understand your request and I'm processing it with my enhanced AI capabilities. Would you like me to provide more specific information using machine learning analysis or check your watch data for additional context?";
  };

  // Enhanced random tools including ML and Watch
  const getEnhancedRandomTools = () => {
    const allTools = [
      'GoogleCalendarTool', 'GmailTool', 'GoogleDriveTool', 'GeminiAI', 
      'GoogleWatch', 'MachineLearning', 'PredictiveAnalysis', 'SentimentAnalysis',
      'HealthMonitoring', 'PatternRecognition'
    ];
    const numTools = Math.floor(Math.random() * 4) + 1;
    const tools = [];
    
    for (let i = 0; i < numTools; i++) {
      const randomIndex = Math.floor(Math.random() * allTools.length);
      tools.push(allTools[randomIndex]);
      allTools.splice(randomIndex, 1);
    }
    
    return tools;
  };

  const scheduleAction = async (action) => {
    try {
      const newAction = {
        id: Date.now().toString(),
        ...action,
        scheduled_for: action.scheduledFor
      };
      
      setScheduledActions(prev => [...prev, newAction]);
      return true;
    } catch (error) {
      console.error('Error scheduling action:', error);
      return false;
    }
  };

  const executeProactiveAction = (id) => {
    const insight = proactiveInsights.find(i => i.id === id);
    if (!insight) return;
    
    setProactiveInsights(prev => prev.filter(i => i.id !== id));
    sendMessage(`Execute action for: ${insight.title}`);
  };

  const value = {
    messages,
    isProcessing,
    isListening,
    systemStatus,
    actionHistory,
    scheduledActions,
    proactiveInsights,
    availableTools,
    geminiReady,
    watchConnected,
    watchData,
    setWatchConnected,
    sendMessage,
    startVoiceRecognition,
    scheduleAction,
    executeProactiveAction,
    user
  };

  return (
    <OnyxContext.Provider value={value}>
      {children}
    </OnyxContext.Provider>
  );
};