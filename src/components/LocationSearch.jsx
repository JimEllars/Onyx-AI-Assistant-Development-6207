import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import googleApi from '../utils/googleApiHelper';

const { FiSearch, FiMapPin, FiLoader } = FiIcons;

const LocationSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await googleApi.searchPlaces(query);
      setResults(response.results || []);
    } catch (err) {
      setError('Failed to search locations. Please try again.');
      console.error('Location search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-axim-navy/90 backdrop-blur-md rounded-2xl p-6 border border-axim-gray-dark/30">
      <h3 className="text-lg font-semibold text-white mb-4">Location Search</h3>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a location..."
            className="w-full px-4 py-2 pl-10 bg-axim-navy-dark/50 border border-axim-gray-dark rounded-lg text-white placeholder-axim-gray"
          />
          <SafeIcon
            icon={FiSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-axim-gray"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full bg-gradient-to-r from-axim-blue to-axim-blue-light text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <SafeIcon icon={FiLoader} className="animate-spin" />
              <span>Searching...</span>
            </div>
          ) : (
            <span>Search</span>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">
          {error}
        </div>
      )}

      <div className="mt-4 space-y-2">
        {results.map((result) => (
          <motion.div
            key={result.place_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 border border-axim-gray-dark/30 rounded-lg bg-axim-navy-light/20"
          >
            <div className="flex items-start space-x-3">
              <SafeIcon
                icon={FiMapPin}
                className="w-5 h-5 text-axim-blue-light mt-1"
              />
              <div>
                <h4 className="text-white font-medium">{result.name}</h4>
                <p className="text-axim-gray-light text-sm">
                  {result.formatted_address}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LocationSearch;