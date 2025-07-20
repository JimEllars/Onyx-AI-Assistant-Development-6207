import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import geminiService from '../services/geminiService';

const { FiBrain, FiKey, FiCheck, FiLoader, FiAlertCircle } = FiIcons;

const GeminiConfig = () => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('mock-gemini-api-key');
  const [isConfigured, setIsConfigured] = useState(true); // Start as true for demo
  const [isLoading, setIsLoading] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState({
    type: 'success',
    message: 'Gemini API is connected and ready to use!'
  });

  // For demo purposes, Gemini is already configured
  useEffect(() => {
    geminiService.initialize('mock-gemini-api-key');
  }, []);

  const handleSaveApiKey = async () => {
    try {
      setIsLoading(true);
      setStatus({ type: '', message: '' });
      
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always succeed in demo
      setIsConfigured(true);
      setStatus({ 
        type: 'success', 
        message: 'API key saved successfully!' 
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      setStatus({
        type: 'error',
        message: 'An error occurred while saving the API key.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestGemini = async () => {
    try {
      setIsTesting(true);
      setStatus({ type: '', message: '' });
      
      if (!testMessage.trim()) {
        setStatus({ type: 'warning', message: 'Please enter a test message.' });
        setIsTesting(false);
        return;
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock response
      setTestResponse("I'm Gemini, your AI assistant. I understand your message and I'm here to help with any tasks or information you need. How else can I assist you today?");
    } catch (error) {
      console.error("Error testing Gemini:", error);
      setStatus({
        type: 'error',
        message: 'Failed to generate response. Check your API key.'
      });
      setTestResponse('');
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      default: return 'text-axim-gray';
    }
  };

  const getStatusBg = (type) => {
    switch (type) {
      case 'success': return 'bg-success/10';
      case 'error': return 'bg-error/10';
      case 'warning': return 'bg-warning/10';
      default: return 'bg-axim-navy-light/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-full flex items-center justify-center">
            <SafeIcon icon={FiBrain} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Google Gemini Configuration</h3>
            <p className="text-axim-gray text-sm">Connect Onyx to Google's Gemini AI</p>
          </div>
        </div>
        {isConfigured && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-success/20 text-success rounded-full">
            <SafeIcon icon={FiCheck} className="w-4 h-4" />
            <span className="text-xs">Connected</span>
          </div>
        )}
      </div>

      {status.message && (
        <div className={`mb-4 p-3 ${getStatusBg(status.type)} rounded-lg`}>
          <p className={`text-sm ${getStatusColor(status.type)}`}>{status.message}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-axim-white mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <SafeIcon icon={FiKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axim-gray" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
              placeholder="Enter your Gemini API key"
            />
          </div>
          <p className="mt-2 text-xs text-axim-gray">
            Get your API key from the{' '}
            <a
              href="https://makersuite.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-axim-blue-light hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSaveApiKey}
            disabled={isLoading || !apiKey.trim()}
            className="px-4 py-2 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
                <span>Save API Key</span>
              </>
            )}
          </button>
        </div>

        {isConfigured && (
          <div className="border-t border-axim-gray-dark/30 pt-6 mt-6">
            <h4 className="text-white font-medium mb-4">Test Gemini Integration</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-axim-white mb-2">
                  Test Message
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Enter a test message for Gemini..."
                  rows={3}
                  className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray focus:outline-none focus:ring-2 focus:ring-axim-blue-light focus:border-transparent"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleTestGemini}
                  disabled={isTesting || !testMessage.trim() || !isConfigured}
                  className="px-4 py-2 bg-axim-blue text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <SafeIcon icon={FiLoader} className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiBrain} className="w-4 h-4" />
                      <span>Test Gemini</span>
                    </>
                  )}
                </button>
              </div>
              {testResponse && (
                <div className="mt-4 p-4 bg-axim-navy-light/30 border border-axim-gray-dark/30 rounded-lg">
                  <h5 className="text-sm font-medium text-axim-white mb-2">Gemini Response:</h5>
                  <p className="text-axim-gray-light text-sm whitespace-pre-wrap">{testResponse}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-axim-gray-dark/30 pt-4 mt-4">
          <h4 className="text-white font-medium mb-2">How to Get Started</h4>
          <ol className="space-y-2 text-axim-gray-light text-sm list-decimal list-inside">
            <li>Create an account at <a href="https://makersuite.google.com/" target="_blank" rel="noopener noreferrer" className="text-axim-blue-light hover:underline">Google AI Studio</a></li>
            <li>Generate an API key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-axim-blue-light hover:underline">API Keys</a> section</li>
            <li>Copy the API key and paste it above</li>
            <li>Click "Save API Key" to connect Onyx to Gemini</li>
          </ol>
        </div>
      </div>
    </motion.div>
  );
};

export default GeminiConfig;