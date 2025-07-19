import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Plan from './pages/Plan';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import Workout from './pages/Workout';
import WorkoutComplete from './pages/WorkoutComplete';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/workout/:id" element={<Workout />} />
        <Route path="/workout-complete" element={<WorkoutComplete />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plan" element={<Plan />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;