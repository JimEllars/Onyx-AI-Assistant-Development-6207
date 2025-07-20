import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import watchService from '../services/watchService';

const { FiWatch, FiCheck, FiLoader, FiAlertCircle, FiActivity, FiHeart, FiZap } = FiIcons;

const WatchSettings = () => {
  const { watchConnected, setWatchConnected } = useOnyx();
  const [isConnecting, setIsConnecting] = useState(false);
  const [watchData, setWatchData] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (watchConnected) {
      // Start listening for watch data
      watchService.startDataSync((data) => {
        setWatchData(data);
      });
    }
  }, [watchConnected]);

  const handleConnectWatch = async () => {
    try {
      setIsConnecting(true);
      setStatus({ type: '', message: '' });

      const success = await watchService.connectWatch();
      
      if (success) {
        setWatchConnected(true);
        setStatus({ type: 'success', message: 'Google Watch connected successfully!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to connect to Google Watch.' });
      }
    } catch (error) {
      console.error("Error connecting watch:", error);
      setStatus({ type: 'error', message: 'An error occurred while connecting to your watch.' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWatch = async () => {
    try {
      await watchService.disconnectWatch();
      setWatchConnected(false);
      setWatchData(null);
      setStatus({ type: 'success', message: 'Watch disconnected successfully.' });
    } catch (error) {
      console.error("Error disconnecting watch:", error);
      setStatus({ type: 'error', message: 'Failed to disconnect watch.' });
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
            <SafeIcon icon={FiWatch} className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Google Watch Integration</h3>
            <p className="text-axim-gray text-sm">Connect your Wear OS device for enhanced features</p>
          </div>
        </div>
        {watchConnected && (
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

      {!watchConnected ? (
        <div className="space-y-6">
          <div className="text-center py-8">
            <SafeIcon icon={FiWatch} className="w-16 h-16 text-axim-gray mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Connect Your Google Watch</h4>
            <p className="text-axim-gray text-sm mb-6">
              Enable voice commands, health monitoring, and quick actions directly from your wrist
            </p>
            <button
              onClick={handleConnectWatch}
              disabled={isConnecting}
              className="px-6 py-3 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white rounded-lg flex items-center space-x-2 mx-auto disabled:opacity-50"
            >
              {isConnecting ? (
                <>
                  <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiWatch} className="w-5 h-5" />
                  <span>Connect Watch</span>
                </>
              )}
            </button>
          </div>

          <div className="border-t border-axim-gray-dark/30 pt-6">
            <h4 className="text-white font-medium mb-4">Watch Features</h4>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-axim-navy-light/20 rounded-lg">
                <SafeIcon icon={FiActivity} className="w-5 h-5 text-axim-blue-light" />
                <div>
                  <p className="text-white text-sm font-medium">Voice Commands</p>
                  <p className="text-axim-gray text-xs">Activate Onyx with "Hey Onyx"</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-axim-navy-light/20 rounded-lg">
                <SafeIcon icon={FiHeart} className="w-5 h-5 text-axim-blue-light" />
                <div>
                  <p className="text-white text-sm font-medium">Health Monitoring</p>
                  <p className="text-axim-gray text-xs">Track stress levels during meetings</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-axim-navy-light/20 rounded-lg">
                <SafeIcon icon={FiZap} className="w-5 h-5 text-axim-blue-light" />
                <div>
                  <p className="text-white text-sm font-medium">Quick Actions</p>
                  <p className="text-axim-gray text-xs">Schedule meetings, send messages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Watch Status */}
          <div className="bg-axim-navy-light/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Watch Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-success text-xs">Live</span>
              </div>
            </div>
            
            {watchData && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{watchData.batteryLevel}%</div>
                  <div className="text-xs text-axim-gray">Battery</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{watchData.heartRate}</div>
                  <div className="text-xs text-axim-gray">BPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{watchData.steps}</div>
                  <div className="text-xs text-axim-gray">Steps</div>
                </div>
              </div>
            )}
          </div>

          {/* Watch Controls */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Watch Controls</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-axim-navy-light/30 rounded-lg text-left hover:bg-axim-navy-light/50 transition-colors">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiActivity} className="w-4 h-4 text-axim-blue-light" />
                  <span className="text-white text-sm">Voice Commands</span>
                </div>
                <p className="text-axim-gray text-xs mt-1">Enable/disable voice activation</p>
              </button>
              
              <button className="p-3 bg-axim-navy-light/30 rounded-lg text-left hover:bg-axim-navy-light/50 transition-colors">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiHeart} className="w-4 h-4 text-axim-blue-light" />
                  <span className="text-white text-sm">Health Sync</span>
                </div>
                <p className="text-axim-gray text-xs mt-1">Sync health data automatically</p>
              </button>
            </div>
          </div>

          {/* Disconnect Button */}
          <div className="border-t border-axim-gray-dark/30 pt-4">
            <button
              onClick={handleDisconnectWatch}
              className="px-4 py-2 bg-axim-navy-light border border-axim-gray-dark text-axim-gray-light rounded-lg hover:bg-axim-navy hover:text-white transition-colors"
            >
              Disconnect Watch
            </button>
          </div>
        </div>
      )}

      <div className="border-t border-axim-gray-dark/30 pt-4 mt-6">
        <h4 className="text-white font-medium mb-2">Compatible Devices</h4>
        <div className="space-y-2 text-axim-gray-light text-sm">
          <p>• Google Pixel Watch & Pixel Watch 2</p>
          <p>• Samsung Galaxy Watch (Wear OS 3+)</p>
          <p>• Fossil Gen 6 & other Wear OS devices</p>
          <p>• TicWatch Pro series</p>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchSettings;