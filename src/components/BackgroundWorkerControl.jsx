import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import backgroundWorker from '../services/backgroundWorker';

const { FiZap, FiPlay, FiPause, FiActivity, FiClock } = FiIcons;

const BackgroundWorkerControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);
  const [nextCheck, setNextCheck] = useState(null);
  const [actionsRun, setActionsRun] = useState(0);
  
  useEffect(() => {
    // Set up timer to update the next check time countdown
    const timer = setInterval(() => {
      if (nextCheck) {
        // Force re-render to update countdown
        setNextCheck(new Date(nextCheck));
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextCheck]);
  
  const toggleWorker = () => {
    if (isRunning) {
      const stopped = backgroundWorker.stop();
      if (stopped) {
        setIsRunning(false);
        setNextCheck(null);
      }
    } else {
      const started = backgroundWorker.start();
      if (started) {
        setIsRunning(true);
        setLastCheck(new Date());
        setNextCheck(new Date(Date.now() + backgroundWorker.checkInterval));
        
        // Simulate actions run counter
        const currentCount = actionsRun;
        setTimeout(() => {
          setActionsRun(currentCount + Math.floor(Math.random() * 3) + 1);
        }, 3000);
      }
    }
  };
  
  // Calculate time remaining until next check
  const getTimeRemaining = () => {
    if (!nextCheck || !isRunning) return '--:--';
    
    const now = new Date();
    const diff = Math.max(0, nextCheck - now);
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Background Worker</h3>
        <div className={`flex items-center px-2 py-1 rounded-full text-xs ${
          isRunning 
            ? 'bg-success/20 text-success' 
            : 'bg-axim-gray-dark/30 text-axim-gray'
        }`}>
          <SafeIcon icon={FiActivity} className="w-3 h-3 mr-1" />
          {isRunning ? 'Running' : 'Stopped'}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-axim-navy-dark/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isRunning 
                ? 'bg-success/20 text-success' 
                : 'bg-axim-gray-dark/30 text-axim-gray'
            }`}>
              <SafeIcon icon={FiZap} className="w-5 h-5" />
            </div>
            <div>
              <p className="text-white font-medium">Recurring Action Worker</p>
              <p className="text-axim-gray text-sm">Processes scheduled actions</p>
            </div>
          </div>
          <button
            onClick={toggleWorker}
            className={`p-3 rounded-lg ${
              isRunning
                ? 'bg-axim-navy-light/50 text-axim-gray hover:bg-axim-navy-light'
                : 'bg-gradient-to-r from-axim-blue to-axim-blue-light text-white'
            }`}
          >
            <SafeIcon icon={isRunning ? FiPause : FiPlay} className="w-5 h-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-axim-navy-dark/30 rounded-lg p-3">
            <p className="text-axim-gray-light text-xs mb-1">Last Check</p>
            <p className="text-white">
              {lastCheck 
                ? lastCheck.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                : '--:--'}
            </p>
          </div>
          <div className="bg-axim-navy-dark/30 rounded-lg p-3">
            <p className="text-axim-gray-light text-xs mb-1">Next Check</p>
            <div className="flex items-center space-x-1">
              <SafeIcon icon={FiClock} className={`w-4 h-4 ${isRunning ? 'text-success' : 'text-axim-gray'}`} />
              <p className="text-white">{getTimeRemaining()}</p>
            </div>
          </div>
          <div className="bg-axim-navy-dark/30 rounded-lg p-3">
            <p className="text-axim-gray-light text-xs mb-1">Actions Run</p>
            <p className="text-white">{actionsRun}</p>
          </div>
        </div>
        
        <div className="bg-axim-navy-dark/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-2">Worker Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-axim-gray-light text-sm">Check Interval</p>
              <p className="text-white text-sm">60 seconds</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-axim-gray-light text-sm">Auto Retry</p>
              <div className="w-10 h-5 bg-success/30 rounded-full relative flex items-center">
                <div className="w-4 h-4 rounded-full bg-success absolute right-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-axim-gray-light text-sm">Notifications</p>
              <div className="w-10 h-5 bg-success/30 rounded-full relative flex items-center">
                <div className="w-4 h-4 rounded-full bg-success absolute right-0.5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BackgroundWorkerControl;