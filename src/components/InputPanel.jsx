import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend, FiMic, FiMicOff } = FiIcons;

const InputPanel = () => {
  const [input, setInput] = useState('');
  const { sendMessage, startVoiceRecognition, isListening, isProcessing } = useOnyx();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleVoiceInput = () => {
    if (!isListening && !isProcessing) {
      startVoiceRecognition();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-morphism rounded-2xl p-6"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Onyx anything..."
            className="w-full px-4 py-3 bg-onyx-800/50 border border-onyx-600 rounded-lg text-white placeholder-onyx-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
            disabled={isProcessing}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleVoiceInput}
          disabled={isProcessing}
          className={`p-3 rounded-lg transition-all duration-200 ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-onyx-700 hover:bg-onyx-600 text-onyx-300 hover:text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMicOff} className="w-5 h-5" />
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-white rounded-full voice-wave"></div>
                <div className="w-1 h-4 bg-white rounded-full voice-wave" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1 h-4 bg-white rounded-full voice-wave" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <SafeIcon icon={FiMic} className="w-5 h-5" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SafeIcon icon={FiSend} className="w-5 h-5" />
        </motion.button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {['Check my emails', 'Schedule overview', 'Frontier project status', 'Revenue report'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => !isProcessing && setInput(suggestion)}
            className="px-3 py-1 bg-onyx-700/50 hover:bg-onyx-600/50 text-onyx-300 hover:text-white text-sm rounded-full transition-all duration-200"
            disabled={isProcessing}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default InputPanel;