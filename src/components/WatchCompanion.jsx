import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiWatch, FiMic, FiSend, FiHeart, FiCalendar, FiMail, FiX } = FiIcons;

// This is a simulated watch interface for demonstration purposes
const WatchCompanion = () => {
  const [showWatch, setShowWatch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState(null);
  const [view, setView] = useState('home');
  const { watchConnected, watchData, sendMessage } = useOnyx();

  useEffect(() => {
    // Check if the app is running on a small screen (like a watch)
    const isWatchSize = window.matchMedia('(max-width: 280px)').matches;
    if (isWatchSize) {
      setShowWatch(true);
    }

    // For demo purposes, you can toggle the watch view with a key press
    const handleKeyPress = (e) => {
      if (e.key === 'w') {
        setShowWatch(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleVoiceCommand = () => {
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setCommand('Check my calendar for today');
      
      // Simulate processing
      setTimeout(() => {
        setResponse({
          text: "You have 2 meetings today: Board Meeting at 10:00 AM and Client Call with XYZ Corp at 2:00 PM.",
          action: "calendar"
        });
      }, 1000);
    }, 2000);
  };

  const handleSendCommand = () => {
    if (!command.trim()) return;
    
    setResponse(null);
    sendMessage(command);
    
    // Simulate response
    setTimeout(() => {
      let responseText = '';
      let responseAction = '';
      
      if (command.toLowerCase().includes('calendar')) {
        responseText = "You have 2 meetings today: Board Meeting at 10:00 AM and Client Call with XYZ Corp at 2:00 PM.";
        responseAction = "calendar";
      } else if (command.toLowerCase().includes('email') || command.toLowerCase().includes('mail')) {
        responseText = "You have 5 unread emails, including one important from Sarah Chen regarding the Frontier project.";
        responseAction = "email";
      } else if (command.toLowerCase().includes('heart') || command.toLowerCase().includes('health')) {
        responseText = `Your heart rate is ${watchData?.heartRate || 72} BPM, which is within normal range.`;
        responseAction = "health";
      } else {
        responseText = "I understand your request. How else can I assist you?";
        responseAction = "general";
      }
      
      setResponse({
        text: responseText,
        action: responseAction
      });
    }, 1000);
  };

  const clearResponse = () => {
    setResponse(null);
    setCommand('');
  };

  const changeView = (newView) => {
    setView(newView);
    setResponse(null);
  };

  // Don't render anything if the watch view is not active
  if (!showWatch) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative">
        <motion.div 
          className="w-64 h-64 rounded-full bg-black border-4 border-gray-800 overflow-hidden shadow-xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Watch Screen */}
          <div className="w-full h-full bg-axim-navy-dark p-4 flex flex-col">
            {/* Watch Header */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <SafeIcon icon={FiWatch} className="w-3 h-3 text-axim-blue-light" />
                <span className="text-xs text-axim-blue-light ml-1">Onyx</span>
              </div>
              <div className="text-xs text-axim-gray">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            {/* Watch Content */}
            {view === 'home' && (
              <div className="flex-1 flex flex-col items-center justify-center">
                {response ? (
                  <div className="text-center">
                    <div className="mb-2">
                      <SafeIcon 
                        icon={
                          response.action === "calendar" ? FiCalendar : 
                          response.action === "email" ? FiMail :
                          response.action === "health" ? FiHeart : FiWatch
                        } 
                        className="w-8 h-8 text-axim-blue-light mx-auto mb-1" 
                      />
                    </div>
                    <p className="text-xs text-white mb-3">{response.text}</p>
                    <button 
                      onClick={clearResponse}
                      className="bg-axim-navy-light/30 p-1 rounded-full"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4 text-axim-gray" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-gradient-to-r from-axim-blue to-axim-blue-light rounded-full flex items-center justify-center mb-3">
                      <span className="text-lg font-bold text-white">O</span>
                    </div>
                    <p className="text-sm text-white mb-1">Hey James!</p>
                    <p className="text-xs text-axim-gray-light mb-3">How can I help?</p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleVoiceCommand}
                        className="p-2 bg-axim-blue-light/20 rounded-full"
                      >
                        <SafeIcon icon={FiMic} className="w-5 h-5 text-axim-blue-light" />
                      </button>
                      <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Type..."
                        className="bg-axim-navy-light/30 text-white text-xs p-1 rounded w-24"
                      />
                      <button 
                        onClick={handleSendCommand}
                        className="p-2 bg-axim-blue-light/20 rounded-full"
                      >
                        <SafeIcon icon={FiSend} className="w-4 h-4 text-axim-blue-light" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {view === 'health' && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-sm text-white font-medium mb-3 text-center">Health Data</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-axim-navy-light/30 rounded-lg p-2 text-center">
                    <SafeIcon icon={FiHeart} className="w-5 h-5 text-red-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{watchData?.heartRate || 72}</div>
                    <div className="text-xs text-axim-gray">BPM</div>
                  </div>
                  <div className="bg-axim-navy-light/30 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-white">{watchData?.steps || 2847}</div>
                    <div className="text-xs text-axim-gray">Steps</div>
                  </div>
                </div>
                <div className="mt-2 bg-axim-navy-light/30 rounded-lg p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-axim-gray-light">Stress Level</span>
                    <span className="text-xs text-white">{watchData?.stressLevel || 2}/5</span>
                  </div>
                  <div className="w-full bg-axim-navy-dark rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-axim-blue-light h-1.5 rounded-full" 
                      style={{ width: `${(watchData?.stressLevel || 2) * 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Watch Navigation */}
            <div className="flex justify-around pt-2 border-t border-axim-gray-dark/30">
              <button 
                onClick={() => changeView('home')}
                className={`p-1 rounded-full ${view === 'home' ? 'bg-axim-blue-light/20' : ''}`}
              >
                <SafeIcon icon={FiWatch} className={`w-4 h-4 ${view === 'home' ? 'text-axim-blue-light' : 'text-axim-gray'}`} />
              </button>
              <button 
                onClick={() => changeView('health')}
                className={`p-1 rounded-full ${view === 'health' ? 'bg-axim-blue-light/20' : ''}`}
              >
                <SafeIcon icon={FiHeart} className={`w-4 h-4 ${view === 'health' ? 'text-axim-blue-light' : 'text-axim-gray'}`} />
              </button>
              <button 
                onClick={() => setShowWatch(false)}
                className="p-1 rounded-full"
              >
                <SafeIcon icon={FiX} className="w-4 h-4 text-axim-gray" />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Watch Band */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gray-800 rounded-b-lg"></div>
      </div>
    </div>
  );
};

export default WatchCompanion;