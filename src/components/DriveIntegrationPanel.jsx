import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import googleDriveService from '../services/googleDriveService';

const { FiFile, FiFileText, FiFilePlus, FiRefreshCw, FiExternalLink } = FiIcons;

const DriveIntegrationPanel = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeDrive();
  }, []);

  const initializeDrive = async () => {
    try {
      setIsLoading(true);
      const success = await googleDriveService.initGoogleDrive();
      
      if (success) {
        setIsInitialized(true);
        await loadFiles();
      }
    } catch (error) {
      console.error("Failed to initialize Google Drive:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const filesList = await googleDriveService.listFiles();
      setFiles(filesList);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('spreadsheet')) return FiFileText;
    if (mimeType.includes('document')) return FiFile;
    if (mimeType.includes('pdf')) return FiFile;
    return FiFile;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Google Drive Files</h3>
        <button
          onClick={loadFiles}
          disabled={isLoading || !isInitialized}
          className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50 disabled:opacity-50"
        >
          <SafeIcon icon={FiRefreshCw} className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!isInitialized ? (
        <div className="flex flex-col items-center justify-center py-8">
          <SafeIcon icon={FiFilePlus} className="w-10 h-10 text-axim-gray mb-3" />
          <p className="text-axim-gray text-sm text-center">
            Google Drive integration is not initialized.
          </p>
          <button
            onClick={initializeDrive}
            disabled={isLoading}
            className="mt-4 px-4 py-2 bg-axim-blue text-white rounded-lg flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <SafeIcon icon={FiFilePlus} className="w-4 h-4" />
                <span>Connect Drive</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="border border-axim-gray-dark/50 rounded-lg p-3 bg-axim-navy-light/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-axim-navy-dark rounded-full flex items-center justify-center">
                    <SafeIcon icon={getFileIcon(file.mimeType)} className="w-4 h-4 text-axim-blue-light" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{file.name}</p>
                    <p className="text-axim-gray text-xs">
                      Modified: {formatDate(file.modifiedTime)}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-axim-gray hover:text-white transition-colors rounded-lg hover:bg-axim-navy-dark/50">
                  <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {files.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-axim-gray text-sm">No files found</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-axim-blue"></div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DriveIntegrationPanel;