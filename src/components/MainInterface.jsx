import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import ConversationPanel from './ConversationPanel';
import InputPanel from './InputPanel';
import SystemStatus from './SystemStatus';
import ProactiveInsights from './ProactiveInsights';
import ToolsPanel from './ToolsPanel';

const MainInterface = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-onyx-900 via-onyx-800 to-onyx-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Conversation Area */}
          <div className="lg:col-span-3 space-y-6">
            <ConversationPanel />
            <InputPanel />
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
            <SystemStatus />
            <ProactiveInsights />
            <ToolsPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainInterface;