// src/pages/Home.tsx (Final Complete Version)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Trophy, Target, MessageCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/StatCard';
import HabitTracker from '../components/HabitTracker';
import { useHabits, useUserStats } from '../hooks/useDatabase';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Use real database data
  const { habits, toggleHabit, loading: habitsLoading } = useHabits();
  const { stats, loading: statsLoading } = useUserStats();
  const loading = habitsLoading || statsLoading;
  
  const [currentTip] = useState(
    "Progressive overload is key! Gradually increase intensity, volume, or difficulty to keep challenging your muscles."
  );

  const handleToggleHabit = (habitId: string) => {
    toggleHabit(habitId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const completedHabits = habits.filter(habit => habit.completed).length;

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-6">
        <h1 className="text-2xl font-bold text-text-dark mb-2">
          {getGreeting()}, {user?.user_metadata?.name || 'User'}! 👋
        </h1>
        <p className="text-text-light">
          Ready to crush today's workout?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Workout Streak"
          value={stats?.workoutStreak || 0}
          subtitle="days in a row"
          icon={Flame}
          color="primary"
          onClick={() => navigate('/plan')}
        />
        <StatCard
          title="Plan Progress"
          value={`${Math.round(((stats?.completedWorkouts || 0) / Math.max(stats?.totalWorkouts || 1, 1)) * 100)}%`}
          subtitle={`${stats?.completedWorkouts || 0}/${stats?.totalWorkouts || 0} workouts`}
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
          value={(stats?.averageRPE || 0).toFixed(1)}
          subtitle="effort level"
          icon={MessageCircle}
        />
      </div>

      {/* Habit Tracker */}
      <HabitTracker
        habits={habits}
        onToggleHabit={handleToggleHabit}
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