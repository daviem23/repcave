// Custom hooks for database operations
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as db from '../lib/database';
import type { User, Habit, Workout, UserStats, FitnessProfile } from '../types';

// ===== USER HOOKS =====

export function useUser() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await db.getUserProfile(authUser.id);
        setUser(userData);
      } catch (err) {
        console.error('Error loading user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [authUser]);

  const updateUser = async (updates: Partial<User>) => {
    if (!authUser) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedUser = await db.updateUserProfile(authUser.id, updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return { user, loading, error, updateUser };
}

// ===== FITNESS PROFILE HOOKS =====

export function useFitnessProfile() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!authUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profileData = await db.getFitnessProfile(authUser.id);
      setProfile(profileData);
    } catch (err) {
      console.error('Error loading fitness profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fitness profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [authUser]);

  const updateProfile = async (updates: Partial<FitnessProfile>) => {
    if (!authUser) {
      throw new Error('User not authenticated');
    }

    try {
      const updatedProfile = await db.updateFitnessProfile(authUser.id, updates);
      await loadProfile(); // Reload to get fresh data
      return updatedProfile;
    } catch (err) {
      console.error('Error updating fitness profile:', err);
      throw err;
    }
  };

  const createProfile = async (profileData: Omit<FitnessProfile, 'id'>) => {
    if (!authUser) {
      throw new Error('User not authenticated');
    }

    try {
      const newProfile = await db.createFitnessProfile(authUser.id, profileData);
      await loadProfile(); // Reload to get fresh data
      return newProfile;
    } catch (err) {
      console.error('Error creating fitness profile:', err);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: loadProfile,
  };
}
// ===== HABIT HOOKS =====

export function useHabits() {
  const { user: authUser } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const habitsData = await db.getUserHabits(authUser.id);
      
      // Transform database data to match our Habit interface
      const transformedHabits = await Promise.all(
        habitsData.map(async (habit) => {
          // Get recent completions to calculate streak and completion rate
          const completions = await db.getHabitCompletions(authUser.id, habit.id, 30);
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
  }, [authUser]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!authUser) throw new Error('User not authenticated');

    try {
      await db.createHabit(authUser.id, habitData);
      await loadHabits(); // Reload to get updated data
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  };

  const toggleHabit = async (habitId: string) => {
    if (!authUser) return;

    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      await db.toggleHabitCompletion(authUser.id, habitId, !habit.completed);
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
  const { user: authUser } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkouts = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const workoutsData = await db.getUserWorkouts(authUser.id);
      
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
  }, [authUser]);

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
  const { user: authUser } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    if (!authUser) return;

    try {
      setLoading(true);
      const statsData = await db.getUserStats(authUser.id);
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
  }, [authUser]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
}
