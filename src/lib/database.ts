// Database service layer for Supabase operations
import { supabase } from './supabase';
import type { User, Habit, Workout, Exercise, UserStats, FitnessProfile } from '../types';

// ===== USER OPERATIONS =====

export async function createUserProfile(userId: string, name: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      name,
      subscription_status: 'trial',
    })
    .select()
    .single();

  if (error) throw error;
  
  // Also create user stats record
  await supabase
    .from('user_stats')
    .insert({
      user_id: userId,
    });
  
  return data;
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== FITNESS PROFILE OPERATIONS =====

export async function createFitnessProfile(userId: string, profile: Omit<FitnessProfile, 'id'>) {
  const { data, error } = await supabase
    .from('fitness_profiles')
    .insert({
      user_id: userId,
      pushup_level: profile.pushupLevel,
      squat_level: profile.squatLevel,
      effort_level: profile.effortLevel,
      equipment: profile.equipment,
      workout_duration: profile.workoutDuration,
      goals: profile.goals,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getFitnessProfile(userId: string) {
  const { data, error } = await supabase
    .from('fitness_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  
  if (!data) return null;
  
  // Transform database data to match our interface
  return {
    id: data.id,
    pushupLevel: data.pushup_level,
    squatLevel: data.squat_level,
    effortLevel: data.effort_level,
    equipment: data.equipment,
    workoutDuration: data.workout_duration,
    goals: data.goals,
  };
}

export async function updateFitnessProfile(userId: string, updates: Partial<FitnessProfile>) {
  const dbUpdates: any = {};
  
  if (updates.pushupLevel) dbUpdates.pushup_level = updates.pushupLevel;
  if (updates.squatLevel) dbUpdates.squat_level = updates.squatLevel;
  if (updates.effortLevel) dbUpdates.effort_level = updates.effortLevel;
  if (updates.equipment) dbUpdates.equipment = updates.equipment;
  if (updates.workoutDuration) dbUpdates.workout_duration = updates.workoutDuration;
  if (updates.goals) dbUpdates.goals = updates.goals;

  const { data, error } = await supabase
    .from('fitness_profiles')
    .update(dbUpdates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== HABIT OPERATIONS =====

export async function getUserHabits(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createHabit(userId: string, habit: Omit<Habit, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('habits')
    .insert({
      user_id: userId,
      name: habit.name,
      description: habit.description,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateHabit(habitId: string, updates: Partial<Habit>) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', habitId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(habitId: string) {
  const { error } = await supabase
    .from('habits')
    .update({ is_active: false })
    .eq('id', habitId);

  if (error) throw error;
}

export async function toggleHabitCompletion(userId: string, habitId: string, completed: boolean) {
  if (completed) {
    // Add completion record
    const { error } = await supabase
      .from('habit_completions')
      .insert({
        habit_id: habitId,
        user_id: userId,
        completed_date: new Date().toISOString().split('T')[0],
      });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      throw error;
    }
  } else {
    // Remove completion record for today
    const { error } = await supabase
      .from('habit_completions')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('completed_date', new Date().toISOString().split('T')[0]);

    if (error) throw error;
  }
}

export async function getHabitCompletions(userId: string, habitId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('habit_completions')
    .select('completed_date')
    .eq('user_id', userId)
    .eq('habit_id', habitId)
    .gte('completed_date', startDate.toISOString().split('T')[0])
    .order('completed_date', { ascending: false });

  if (error) throw error;
  return data;
}

// ===== WORKOUT OPERATIONS =====

export async function getUserWorkouts(userId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        *,
        exercises (*)
      )
    `)
    .eq('user_id', userId)
    .order('week_number', { ascending: true })
    .order('day_number', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getWorkout(workoutId: string) {
  const { data, error } = await supabase
    .from('workouts')
    .select(`
      *,
      workout_exercises (
        *,
        exercises (*)
      )
    `)
    .eq('id', workoutId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateWorkoutCompletion(workoutId: string, completed: boolean, rpe?: number) {
  const { data, error } = await supabase
    .from('workouts')
    .update({
      is_completed: completed,
      completed_at: completed ? new Date().toISOString() : null,
      rpe_rating: rpe,
    })
    .eq('id', workoutId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ===== WORKOUT LOGGING =====

export async function startWorkoutLog(userId: string, workoutId: string) {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: userId,
      workout_id: workoutId,
      started_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeWorkoutLog(
  logId: string,
  data: {
    rpe_rating?: number;
    notes?: string;
    total_exercises: number;
    total_sets: number;
    duration_minutes: number;
  }
) {
  const { data: result, error } = await supabase
    .from('workout_logs')
    .update({
      completed_at: new Date().toISOString(),
      ...data,
    })
    .eq('id', logId)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function logExercisePerformance(
  workoutLogId: string,
  exerciseId: string,
  data: {
    sets_completed: number;
    reps_completed?: number[];
    duration_seconds?: number[];
    weight_used?: number;
    notes?: string;
  }
) {
  const { data: result, error } = await supabase
    .from('exercise_logs')
    .insert({
      workout_log_id: workoutLogId,
      exercise_id: exerciseId,
      ...data,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

// ===== STATISTICS =====

export async function getUserStats(userId: string): Promise<UserStats> {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // If no stats exist, return default values
    if (error.code === 'PGRST116') {
      return {
        workoutStreak: 0,
        completedWorkouts: 0,
        totalWorkouts: 0,
        habitStreak: 0,
        averageRPE: 0,
        totalVolume: 0,
      };
    }
    throw error;
  }

  return {
    workoutStreak: data.current_workout_streak,
    completedWorkouts: data.total_workouts_completed,
    totalWorkouts: data.total_workouts_completed, // Will be updated when we have workout plans
    habitStreak: data.current_habit_streak,
    averageRPE: parseFloat(data.average_rpe) || 0,
    totalVolume: data.total_sets_completed,
  };
}

// ===== EXERCISES =====

export async function getExercises(equipmentFilter?: string[], difficultyFilter?: number) {
  let query = supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true);

  if (equipmentFilter && equipmentFilter.length > 0) {
    query = query.overlaps('equipment_required', equipmentFilter);
  }

  if (difficultyFilter) {
    query = query.lte('difficulty_level', difficultyFilter);
  }

  const { data, error } = await query.order('name');

  if (error) throw error;
  return data;
}

export async function getExercise(exerciseId: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', exerciseId)
    .single();

  if (error) throw error;
  return data;
}