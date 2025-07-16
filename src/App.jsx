import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OnyxProvider } from './contexts/OnyxContext';
import MainInterface from './components/MainInterface';
import LoginScreen from './components/LoginScreen';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <OnyxProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-onyx-900 via-onyx-800 to-onyx-900">
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <MainInterface />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </OnyxProvider>
    </AuthProvider>
  );
}

export default App;