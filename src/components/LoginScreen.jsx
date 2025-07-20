import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLock, FiUser, FiEye, FiEyeOff } = FiIcons;

const LoginScreen = () => {
  const [email, setEmail] = useState('demo@axim.global');
  const [password, setPassword] = useState('axim2023');
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
        // Dispatch event for first-time login detection
        window.dispatchEvent(new Event('onyxLoggedIn'));
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1A1E2D] via-[#252A3D] to-[#1A1E2D] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#0059B2]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0059B2]/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <div className="bg-[#252A3D]/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-[#3D4561]/30">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#0059B2] to-[#0086FF] rounded-full flex items-center justify-center shadow-lg glow-effect"
            >
              <span className="text-3xl font-bold text-white">O</span>
            </motion.div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#0059B2] to-[#0086FF] bg-clip-text text-transparent mb-2">
              Onyx AI Assistant
            </h1>
            <p className="text-[#B0B7C3]">v1.4 - Executive Assistant for AXiM Global</p>
            <p className="text-[#8A94A6] text-sm mt-2">Enhanced with Google Watch & ML Integration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#E6E8EC] mb-2">
                Email Address
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A94A6] w-5 h-5"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1E2D] border border-[#3D4561] rounded-lg text-white placeholder-[#8A94A6] focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E6E8EC] mb-2">
                Password
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiLock}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A94A6] w-5 h-5"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-[#1A1E2D] border border-[#3D4561] rounded-lg text-white placeholder-[#8A94A6] focus:outline-none focus:ring-2 focus:ring-[#0086FF] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8A94A6] hover:text-[#B0B7C3]"
                >
                  <SafeIcon icon={showPassword ? FiEyeOff : FiEye} className="w-5 h-5" />
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FF3B3B]/20 border border-[#FF3B3B]/50 rounded-lg p-3 text-[#FF8080] text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#0059B2] to-[#0086FF] py-3 px-6 rounded-lg text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[#0086FF]/25 hover:translate-y-[-2px]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                'Access Onyx'
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8A94A6] text-sm">
              Demo Credentials: demo@axim.global / axim2023
            </p>
            <p className="text-[#8A94A6] text-xs mt-2">
              Executive: James Ellars | Watch & ML Enabled
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;