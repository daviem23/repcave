// Custom hooks for database operations
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import * as db from '../lib/database';
import type { User, Habit, Workout, UserStats } from '../types';

// Mock user ID for development (will be replaced with auth)
const MOCK_USER_ID = 'mock-user-123';

// ===== USER HOOKS =====

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const userData = await db.getUserProfile(MOCK_USER_ID);
        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    try {
      const updatedUser = await db.updateUserProfile(MOCK_USER_ID, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return { user, loading, error, updateUser };
}

// ===== HABIT HOOKS =====

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const habitsData = await db.getUserHabits(MOCK_USER_ID);
      
      // Transform database data to match our Habit interface
      const transformedHabits = await Promise.all(
        habitsData.map(async (habit) => {
          // Get recent completions to calculate streak and completion rate
          const completions = await db.getHabitCompletions(MOCK_USER_ID, habit.id, 30);
          const today = new Date().toISOString().split('T')[0];
          const isCompletedToday = completions.some(c => c.completed_date === today);
          
          // Calculate streak (consecutive days from today backwards)
          let streak = 0;
          const sortedCompletions = completions.map(c => c.completed_date).sort().reverse();
          let checkDate = new Date();
          
          for (let i = 0; i < 30; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (sortedCompletions.includes(dateStr)) {
              streak++;
            } else if (i > 0) { // Allow for today not being completed yet
              break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
          }

          const completionRate = Math.round((completions.length / 30) * 100);

          return {
            id: habit.id,
            name: habit.name,
            description: habit.description,
            completed: isCompletedToday,
            streak,
            createdAt: habit.created_at,
            category: 'Health' as const, // Default category
            completionRate,
          };
        })
      );

      setHabits(transformedHabits);
    } catch (err) {
      console.error('Error loading habits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    try {
      await db.createHabit(MOCK_USER_ID, habitData);
      await loadHabits(); // Reload to get updated data
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      await db.toggleHabitCompletion(MOCK_USER_ID, habitId, !habit.completed);
      await loadHabits(); // Reload to get updated data
    } catch (err) {
      console.error('Error toggling habit:', err);
    }
  };

  const deleteHabit = async (habitId: string) => {
    try {
      await db.deleteHabit(habitId);
      await loadHabits(); // Reload to get updated data
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  };

  return {
    habits,
    loading,
    error,
    addHabit,
    toggleHabit,
    deleteHabit,
    refetch: loadHabits,
  };
}

// ===== WORKOUT HOOKS =====

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const workoutsData = await db.getUserWorkouts(MOCK_USER_ID);
      
      // Transform database data to match our Workout interface
      const transformedWorkouts = workoutsData.map((workout) => ({
        id: workout.id,
        day: workout.day_number,
        week: workout.week_number,
        title: workout.title,
        duration: workout.duration_minutes,
        completed: workout.is_completed,
        rpe: workout.rpe_rating,
        completedAt: workout.completed_at,
        exercises: workout.workout_exercises.map((we: any) => ({
          id: we.exercise_id,
          name: we.exercises.name,
          sets: we.sets,
          reps: we.reps,
          duration: we.duration_seconds,
          equipment: we.exercises.equipment_required[0] || 'bodyweight',
          description: we.exercises.description,
        })),
      }));

      setWorkouts(transformedWorkouts);
    } catch (err) {
      console.error('Error loading workouts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const completeWorkout = async (workoutId: string, rpe?: number) => {
    try {
      await db.updateWorkoutCompletion(workoutId, true, rpe);
      await loadWorkouts(); // Reload to get updated data
    } catch (err) {
      console.error('Error completing workout:', err);
      throw err;
    }
  };

  return {
    workouts,
    loading,
    error,
    completeWorkout,
    refetch: loadWorkouts,
  };
}

// ===== STATS HOOKS =====

export function useUserStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await db.getUserStats(MOCK_USER_ID);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
}

// ===== FALLBACK HOOK FOR DEVELOPMENT =====

// This hook provides a fallback to localStorage when Supabase is not connected
export function useDatabaseWithFallback() {
  const [isConnected, setIsConnected] = useState(false);

  // Check if Supabase is properly configured
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    setIsConnected(
      supabaseUrl && 
      supabaseKey && 
      supabaseUrl !== 'https://placeholder.supabase.co' &&
      supabaseKey !== 'placeholder-key'
    );
  }, []);

  return { isConnected };
}