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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      // For demo purposes, hardcode a successful login for the demo credentials
      if (email === 'demo@axim.global' && password === 'axim2023') {
        // Create a mock user object with updated name
        const mockUser = {
          id: 'demo-user-id',
          email: 'demo@axim.global',
          user_metadata: {
            name: 'James Ellars',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            role: 'Executive',
            company: 'AXiM Global',
            department: 'Operations'
          }
        };
        setUser(mockUser);
        return { success: true, user: mockUser };
      }

      // Try actual Supabase authentication if not using demo credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if user profile exists, if not create one
      const { data: profile, error: profileError } = await supabase
        .from('users_onyx_7b9x2k')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // User doesn't exist, create profile
        const { error: insertError } = await supabase
          .from('users_onyx_7b9x2k')
          .insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || 'James Ellars',
              avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              role: 'Executive',
              company: 'AXiM Global',
              department: 'Operations'
            }
          ]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || 'James Ellars',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    // For demo user, just clear the state
    if (user?.id === 'demo-user-id') {
      setUser(null);
      return;
    }

    // For actual Supabase users
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
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