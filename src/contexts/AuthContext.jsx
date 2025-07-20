import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Always start with a mock user for demo purposes
  const [user, setUser] = useState({
    id: 'demo-user-id',
    email: 'demo@axim.global',
    user_metadata: {
      name: 'James Ellars',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'Executive',
      company: 'AXiM Global',
      department: 'Operations'
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Login is simplified for demo
  const login = async (email, password) => {
    // Always succeed with demo credentials
    return { 
      success: true, 
      user: {
        id: 'demo-user-id',
        email: 'demo@axim.global',
        user_metadata: {
          name: 'James Ellars',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          role: 'Executive',
          company: 'AXiM Global',
          department: 'Operations'
        }
      }
    };
  };

  // Mock registration - always succeeds
  const register = async (email, password, name) => {
    return { success: true };
  };

  // Mock logout - just clear the user
  const logout = async () => {
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};