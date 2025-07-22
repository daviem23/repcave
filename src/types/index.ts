export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
}

export interface FitnessProfile {
  id?: string;
  pushupLevel: '0-5' | '6-15' | '16-30' | '31+';
  squatLevel: '0-5' | '6-15' | '16-30' | '31+';
  squatLevel: '0-5' | '6-15' | '16-30' | '31+';
  effortLevel: 'easy' | 'moderate' | 'tough' | 'limit';
  equipment: string[];
  workoutDuration: '10-20' | '30' | '45' | '60';
  goals: string[];
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  streak: number;
  createdAt: string;
}

export interface Workout {
  id: string;
  day: number;
  week: number;
  title: string;
  duration: number;
  exercises: Exercise[];
  completed: boolean;
  rpe?: number;
  completedAt?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  equipment: string;
  description: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  weeks: Workout[];
  createdAt: string;
  fitnessProfile: FitnessProfile;
}

export interface UserStats {
  workoutStreak: number;
  completedWorkouts: number;
  totalWorkouts: number;
  habitStreak: number;
  averageRPE: number;
  totalVolume: number;
}