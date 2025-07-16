import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiUser, FiEye, FiEyeOff } = FiIcons;

const LoginScreen = () => {
  const [email, setEmail] = useState('jrellars@gmail.com');
  const [password, setPassword] = useState('demo');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-onyx-900 via-onyx-800 to-onyx-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4"
      >
        <div className="glass-morphism rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center"
            >
              <span className="text-3xl font-bold text-white">O</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Onyx AI Assistant</h1>
            <p className="text-onyx-300">v1.2 - Executive Assistant for Axim Systems</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-onyx-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiUser} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-onyx-400 w-5 h-5"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-onyx-800/50 border border-onyx-600 rounded-lg text-white placeholder-onyx-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-onyx-200 mb-2">
                Password
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiLock} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-onyx-400 w-5 h-5"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-onyx-800/50 border border-onyx-600 rounded-lg text-white placeholder-onyx-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-onyx-400 hover:text-onyx-300"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Authenticating...' : 'Access Onyx'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-onyx-400 text-sm">
              Demo Credentials: jrellars@gmail.com / demo
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;