import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import ConversationPanel from './ConversationPanel';
import InputPanel from './InputPanel';
import SystemStatus from './SystemStatus';
import ProactiveInsights from './ProactiveInsights';
import ToolsPanel from './ToolsPanel';
import ActionScheduler from './ActionScheduler';
import ActionHistory from './ActionHistory';
import DriveIntegrationPanel from './DriveIntegrationPanel';
import CalendarPanel from './CalendarPanel';
import EmailPanel from './EmailPanel';
import BackgroundWorkerControl from './BackgroundWorkerControl';
import WatchCompanion from './WatchCompanion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiWatch } = FiIcons;

const MainInterface = () => {
  const [showWatchPreview, setShowWatchPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-axim-navy-dark via-axim-navy to-axim-navy-dark">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Conversation Area */}
          <div className="lg:col-span-3 space-y-6">
            <ConversationPanel />
            <InputPanel />
            
            {/* Tools Grid */}
            <div className="grid grid-cols-1 gap-6">
              <CalendarPanel />
              <EmailPanel />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionScheduler />
                <ActionHistory />
              </div>
              <DriveIntegrationPanel />
            </div>
          </div>
          
          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            <SystemStatus />
            <ProactiveInsights />
            <BackgroundWorkerControl />
            <ToolsPanel />
            
            {/* Watch Preview Button */}
            <motion.button
              onClick={() => setShowWatchPreview(!showWatchPreview)}
              className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-[#4285F4] to-[#34A853] rounded-full flex items-center justify-center shadow-lg z-40"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <SafeIcon icon={FiWatch} className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Watch Companion Preview */}
      {showWatchPreview && <WatchCompanion />}
    </div>
  );
};

export default MainInterface;