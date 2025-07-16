import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUser, FiCpu, FiCheck, FiTool } = FiIcons;

const ConversationPanel = () => {
  const { messages, isProcessing } = useOnyx();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="glass-morphism rounded-2xl p-6 h-96 overflow-y-auto">
      <div className="space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                message.type === 'user' 
                  ? 'bg-accent-500/20 border-accent-500/50' 
                  : 'bg-onyx-700/50 border-onyx-600/50'
              } border rounded-xl p-4 message-bubble`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-accent-500' 
                      : 'bg-onyx-600'
                  }`}>
                    <SafeIcon 
                      icon={message.type === 'user' ? FiUser : FiCpu} 
                      className="w-4 h-4 text-white" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm leading-relaxed">
                      {message.content}
                    </p>
                    
                    {message.tools_used && message.tools_used.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.tools_used.map((tool, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-onyx-600/50 text-xs text-onyx-300 rounded-full"
                          >
                            <SafeIcon icon={FiTool} className="w-3 h-3 mr-1" />
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-onyx-400">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </span>
                      {message.confidence && (
                        <span className="text-xs text-onyx-400">
                          {Math.round(message.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-onyx-700/50 border border-onyx-600/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-onyx-600 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiCpu} className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-onyx-300 text-sm">Processing your request...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ConversationPanel;