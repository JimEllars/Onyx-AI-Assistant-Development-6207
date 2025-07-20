import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSend, FiMic, FiMicOff } = FiIcons;

const InputPanel = () => {
  const [input, setInput] = useState('');
  const { sendMessage, startVoiceRecognition, isListening, isProcessing, geminiReady } = useOnyx();

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
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={geminiReady ? "Ask anything with Gemini..." : "Ask Onyx anything..."}
            className="w-full px-4 py-3 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent transition-all"
            disabled={isProcessing}
          />
          {geminiReady && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="flex items-center space-x-1 text-xs text-axim-gray-light bg-axim-navy-dark/70 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.22,11.7l-9.9-9.9c-0.6-0.6-1.5-0.6-2.1,0l-2.6,2.6l3.2,3.2l2.1-2.1l6.8,6.8l-6.8,6.8l-6.8-6.8l2.1-2.1l-3.2-3.2 l-2.6,2.6c-0.6,0.6-0.6,1.5,0,2.1l9.9,9.9c0.6,0.6,1.5,0.6,2.1,0l9.9-9.9C22.82,13.3,22.82,12.3,22.22,11.7z"/>
                </svg>
                <span>Gemini</span>
              </div>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={handleVoiceInput}
          disabled={isProcessing}
          className={`p-3 rounded-lg transition-all duration-200 ${
            isListening
              ? 'bg-error hover:bg-error text-white'
              : 'bg-axim-navy-light border border-axim-gray-dark text-axim-gray-light hover:text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isListening ? (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMicOff} className="w-5 h-5" />
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-white rounded-full voice-wave"></div>
                <div
                  className="w-1 h-4 bg-white rounded-full voice-wave"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-1 h-4 bg-white rounded-full voice-wave"
                  style={{ animationDelay: '0.2s' }}
                ></div>
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
          className="p-3 bg-gradient-to-r from-axim-blue to-axim-blue-light rounded-lg text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-axim-blue/25"
        >
          <SafeIcon icon={FiSend} className="w-5 h-5" />
        </motion.button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          'Check my emails',
          'Schedule overview',
          'Frontier project status',
          'Revenue report',
          ...(geminiReady ? ['Analyze latest trends', 'Summarize this document'] : [])
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => !isProcessing && setInput(suggestion)}
            className="px-3 py-1 bg-axim-navy-light border border-axim-gray-dark/50 text-axim-gray-light text-sm rounded-full transition-all duration-200 hover:text-white hover:border-axim-blue-light/50"
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