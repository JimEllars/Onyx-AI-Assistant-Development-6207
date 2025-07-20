import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useOnyx } from '../contexts/OnyxContext';
import geminiService from '../services/geminiService';
import watchService from '../services/watchService';

const { FiArrowRight, FiCheck, FiX, FiWatch, FiCpu, FiSettings, FiZap } = FiIcons;

const OnboardingWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isConnectingGemini, setIsConnectingGemini] = useState(false);
  const [isConnectingWatch, setIsConnectingWatch] = useState(false);
  const [geminiConnected, setGeminiConnected] = useState(false);
  const [watchConnected, setWatchConnected] = useState(false);
  const { user } = useAuth();
  const { setWatchConnected: setGlobalWatchConnected } = useOnyx();

  const totalSteps = 4;

  const handleNextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleConnectGemini = async () => {
    if (!geminiApiKey.trim()) return;
    
    try {
      setIsConnectingGemini(true);
      const success = await geminiService.initialize(geminiApiKey);
      
      if (success && user) {
        await geminiService.storeApiKey(geminiApiKey, user.id);
        setGeminiConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect Gemini:", error);
    } finally {
      setIsConnectingGemini(false);
    }
  };

  const handleConnectWatch = async () => {
    try {
      setIsConnectingWatch(true);
      const success = await watchService.connectWatch();
      
      if (success) {
        setWatchConnected(true);
        setGlobalWatchConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect watch:", error);
    } finally {
      setIsConnectingWatch(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-axim-blue to-axim-blue-light rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl font-bold text-white">O</span>
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Welcome to Onyx AI</h2>
            <p className="text-axim-gray text-center">
              Your executive assistant powered by Google's advanced AI and integrated with your Google Watch.
            </p>
            <p className="text-axim-gray-light text-sm text-center">
              Let's set up your personalized experience in just a few steps.
            </p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleNextStep}
                className="px-6 py-3 bg-gradient-to-r from-axim-blue to-axim-blue-light text-white rounded-lg flex items-center space-x-2"
              >
                <span>Get Started</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-full flex items-center justify-center mx-auto">
              <SafeIcon icon={FiCpu} className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Connect Gemini AI</h2>
            <p className="text-axim-gray text-center">
              Enhance Onyx with Google's advanced AI for better insights and personalized responses.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-axim-white mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full px-4 py-2 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray"
                  disabled={geminiConnected}
                />
                <p className="mt-1 text-xs text-axim-gray">
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
              <div className="flex justify-between">
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-axim-navy-light border border-axim-gray-dark text-axim-gray-light rounded-lg"
                >
                  Skip for now
                </button>
                {geminiConnected ? (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-success/20 text-success rounded-lg flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    <span>Connected</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConnectGemini}
                    disabled={isConnectingGemini || !geminiApiKey.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isConnectingGemini ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <span>Connect Gemini</span>
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-full flex items-center justify-center mx-auto">
              <SafeIcon icon={FiWatch} className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Connect Google Watch</h2>
            <p className="text-axim-gray text-center">
              Link your Wear OS device for health monitoring, voice commands, and quick actions.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="py-4">
                  {watchConnected ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-2">
                        <SafeIcon icon={FiCheck} className="w-6 h-6 text-success" />
                      </div>
                      <p className="text-success">Watch connected successfully!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <SafeIcon icon={FiWatch} className="w-16 h-16 text-axim-gray mb-3" />
                      <p className="text-axim-gray text-sm mb-3">
                        Make sure your Google Watch is nearby and Bluetooth is enabled.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-axim-navy-light border border-axim-gray-dark text-axim-gray-light rounded-lg"
                >
                  Skip for now
                </button>
                {watchConnected ? (
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-2 bg-success/20 text-success rounded-lg flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiCheck} className="w-4 h-4" />
                    <span>Watch Connected</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConnectWatch}
                    disabled={isConnectingWatch}
                    className="px-4 py-2 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
                  >
                    {isConnectingWatch ? (
                      <span>Connecting...</span>
                    ) : (
                      <>
                        <span>Connect Watch</span>
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-axim-blue to-axim-blue-light rounded-full flex items-center justify-center mx-auto">
              <SafeIcon icon={FiZap} className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">You're All Set!</h2>
            <p className="text-axim-gray text-center">
              Onyx is now configured for James Ellars with enhanced AI capabilities.
            </p>
            <div className="space-y-4">
              <div className="bg-axim-navy-light/30 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">Activated Features:</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={geminiConnected ? FiCheck : FiX} className={geminiConnected ? "text-success" : "text-axim-gray"} />
                    <span className={geminiConnected ? "text-white" : "text-axim-gray"}>Gemini AI Integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={watchConnected ? FiCheck : FiX} className={watchConnected ? "text-success" : "text-axim-gray"} />
                    <span className={watchConnected ? "text-white" : "text-axim-gray"}>Google Watch Integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="text-success" />
                    <span className="text-white">Machine Learning Insights</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiCheck} className="text-success" />
                    <span className="text-white">Executive Profile: James Ellars</span>
                  </div>
                </div>
              </div>
              <p className="text-axim-gray-light text-sm text-center">
                You can adjust these settings anytime in the app.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-gradient-to-r from-axim-blue to-axim-blue-light text-white rounded-lg flex items-center space-x-2"
                >
                  <span>Start Using Onyx</span>
                  <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-axim-navy-dark/80 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-axim-navy/95 rounded-xl p-8 w-full max-w-md border border-axim-gray-dark/30"
      >
        <div className="relative">
          <div className="absolute top-0 right-0">
            <button
              onClick={onComplete}
              className="p-2 text-axim-gray hover:text-white transition-colors rounded-full hover:bg-axim-navy-dark/50"
            >
              <SafeIcon icon={FiX} className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-2 mb-8">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full ${
                    index + 1 <= step ? 'bg-axim-blue w-8' : 'bg-axim-gray-dark w-6'
                  }`}
                />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;