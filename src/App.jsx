import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OnyxProvider } from './contexts/OnyxContext';
import MainInterface from './components/MainInterface';
import LoginScreen from './components/LoginScreen';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPrompt from './components/InstallPrompt';
import OnboardingWizard from './components/OnboardingWizard';
import './App.css';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(
    localStorage.getItem('onyx_onboarding_completed') === 'true'
  );
  
  // Automatically skip login for demo purposes
  const [autoLogin, setAutoLogin] = useState(true);

  useEffect(() => {
    // Check if this is a first-time login
    const checkFirstTimeLogin = () => {
      const isFirstTime = localStorage.getItem('onyx_onboarding_completed') !== 'true';
      if (isFirstTime) {
        // Wait a bit to show the onboarding after login
        setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
      }
    };

    window.addEventListener('onyxLoggedIn', checkFirstTimeLogin);
    
    // For demo purposes, trigger login event automatically
    if (autoLogin) {
      window.dispatchEvent(new Event('onyxLoggedIn'));
      setAutoLogin(false);
    }
    
    return () => {
      window.removeEventListener('onyxLoggedIn', checkFirstTimeLogin);
    };
  }, [autoLogin]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setOnboardingCompleted(true);
    localStorage.setItem('onyx_onboarding_completed', 'true');
  };

  return (
    <AuthProvider>
      <OnyxProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-axim-navy-dark via-axim-navy to-axim-navy-dark">
            <InstallPrompt />
            {showOnboarding && !onboardingCompleted && (
              <OnboardingWizard onComplete={handleOnboardingComplete} />
            )}
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route
                path="/"
                element={
                  <MainInterface /> // Skip auth for demo
                }
              />
            </Routes>
          </div>
        </Router>
      </OnyxProvider>
    </AuthProvider>
  );
}

export default App;