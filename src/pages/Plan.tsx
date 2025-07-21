import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useWorkouts, useDatabaseWithFallback } from '../hooks/useDatabase';
import { mockWorkouts } from '../lib/supabase';

import WorkoutCard from '../components/WorkoutCard'; 

const PlanTabs = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const navigate = useNavigate();
  const { isConnected } = useDatabaseWithFallback();
  const { workouts: dbWorkouts, loading } = useWorkouts();
  
  // Choose data source based on connection status
  const allWorkouts = isConnected ? dbWorkouts : mockWorkouts;
  const currentDay = 4;

  const workoutsForWeek = allWorkouts.filter(
    (workout) => workout.week === selectedWeek
  );

  const handleStartWorkout = (workoutId: string) => {
    navigate(`/workout/${workoutId}`);
  };

  const handleRegeneratePlan = () => {
    navigate('/onboarding?regenerate=true');
  };

  if (loading) {
    return <div className="p-4 text-center">Loading workouts...</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Your Weekly Plan</h1>
        <p className="text-gray-600">Swipe through each week to stay on track</p>
      </div>

      {/* Week Tabs */}
      <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
        {[1, 2, 3, 4].map((week) => (
          <button
            key={week}
            onClick={() => setSelectedWeek(week)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              selectedWeek === week
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Week {week}
          </button>
        ))}
      </div>

      {/* Workout List using your component */}
      <div className="space-y-4">
        {workoutsForWeek.map((workout) => (
          <WorkoutCard
            key={workout.id}
            workout={workout}
            onStart={() => handleStartWorkout(workout.id)}
            isToday={workout.week === selectedWeek && workout.day === currentDay}
          />
        ))}

        {workoutsForWeek.length === 0 && (
          <div className="text-center text-gray-500 text-sm pt-4">
            No workouts available for this week.
          </div>
        )}
      </div>

      {/* Regenerate Plan Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleRegeneratePlan}
          className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <RefreshCw size={16} />
          <span className="font-medium">Regenerate Plan</span>
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Update your fitness level, equipment, or goals
        </p>
      </div>
    </div>
  );
};

export default PlanTabs;