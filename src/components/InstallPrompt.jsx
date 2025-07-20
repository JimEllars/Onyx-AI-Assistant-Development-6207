import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDownload, FiX, FiWatch } = FiIcons;

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setShowPrompt(false);
      return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      
      // Show the install prompt
      setShowPrompt(true);
    });

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = () => {
    // Hide the prompt
    setShowPrompt(false);
    
    // Show the install prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used again
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-axim-navy/90 backdrop-blur-md rounded-xl p-4 border border-axim-gray-dark/30 shadow-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-axim-blue to-axim-blue-light rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">O</span>
              </div>
              <div>
                <h3 className="text-white font-medium">Install Onyx AI</h3>
                <p className="text-axim-gray text-sm">Add to home screen for better experience</p>
                <p className="text-axim-blue-light text-xs mt-1 flex items-center">
                  <SafeIcon icon={FiWatch} className="w-3 h-3 mr-1" />
                  <span>Includes Google Watch companion</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPrompt(false)}
                className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
              <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-gradient-to-r from-axim-blue to-axim-blue-light text-white rounded-lg flex items-center space-x-2"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
                <span>Install</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;