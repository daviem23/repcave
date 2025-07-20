// src/pages/Home.tsx (Final Complete Version)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ADDED: For navigation
import { Flame, Trophy, Target, MessageCircle, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import HabitTracker from '../components/HabitTracker';
import { mockUser, mockHabits, mockStats } from '../lib/supabase';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Home: React.FC = () => {
  const navigate = useNavigate(); // ADDED: Initialize navigate function

  const [habits, setHabits] = useLocalStorage('habits', mockHabits);
  const [currentTip] = useState(
    "Progressive overload is key! Gradually increase intensity, volume, or difficulty to keep challenging your muscles."
  );

  const handleToggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed, streak: !habit.completed ? habit.streak + 1 : Math.max(0, habit.streak - 1) }
          : habit
      )
    );
  };

  // REMOVED: The old handleAddHabit function is no longer needed.
  // The functionality is now handled by navigating to the profile page.

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedHabits = habits.filter(habit => habit.completed).length;

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-text-dark mb-2">
          {getGreeting()}, {mockUser.name}! 👋
        </h1>
        <p className="text-text-light">
          Ready to crush today's workout?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Workout Streak"
          value={mockStats.workoutStreak}
          subtitle="days in a row"
          icon={Flame}
          color="primary"
          onClick={() => navigate('/plan')}
        />
        <StatCard
          title="Plan Progress"
          value={`${Math.round((mockStats.completedWorkouts / mockStats.totalWorkouts) * 100)}%`}
          subtitle={`${mockStats.completedWorkouts}/${mockStats.totalWorkouts} workouts`}
          icon={Trophy}
          color="success"
          onClick={() => navigate('/progress')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Habits Today"
          value={`${completedHabits}/${habits.length}`}
          subtitle="completed"
          icon={Target}
          color={completedHabits === habits.length ? 'success' : 'warning'}
        />
        <StatCard
          title="Avg. RPE"
          value={mockStats.averageRPE.toFixed(1)}
          subtitle="effort level"
          icon={MessageCircle}
        />
      </div>

      {/* Habit Tracker */}
      <HabitTracker
        habits={habits}
        onToggleHabit={handleToggleHabit}
        // MODIFIED: The onClick for the '+' button now navigates to the profile habits tab
        onAddHabit={() => navigate('/profile', { state: { openTab: 'habits' } })}
      />

      {/* Tip of the Day */}
      <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-4 text-white">
        <h3 className="font-semibold mb-2">💡 Tip of the Day</h3>
        <p className="text-sm opacity-90">{currentTip}</p>
      </div>
    </div>
  );
};

export default Home;