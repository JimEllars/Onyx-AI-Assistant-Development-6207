import React from 'react';
import { motion } from 'framer-motion';
import { useOnyx } from '../contexts/OnyxContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiTool, FiCheck, FiX } = FiIcons;

const ToolsPanel = () => {
  const { availableTools } = useOnyx();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-morphism rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-4">Available Tools</h3>
      
      <div className="space-y-3">
        {availableTools.map((tool) => (
          <div key={tool.name} className="border border-onyx-600/50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiTool} className="w-4 h-4 text-accent-400" />
                <span className="text-white text-sm font-medium">{tool.name}</span>
              </div>
              <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-400" />
            </div>
            
            <div className="flex flex-wrap gap-1">
              {tool.methods.map((method) => (
                <span
                  key={method}
                  className="px-2 py-1 bg-onyx-700/50 text-onyx-300 text-xs rounded"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ToolsPanel;