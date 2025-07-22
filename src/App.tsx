import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Plan from './pages/Plan';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Workout from './pages/Workout';
import WorkoutComplete from './pages/WorkoutComplete';
import Auth from './pages/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/workout/:id" element={
            <ProtectedRoute>
              <Workout />
            </ProtectedRoute>
          } />
          <Route path="/workout-complete" element={
            <ProtectedRoute>
              <WorkoutComplete />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="plan" element={<Plan />} />
            <Route path="progress" element={<Progress />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;