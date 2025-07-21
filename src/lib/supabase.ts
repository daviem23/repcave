// src/lib/supabase.ts (Final Version)

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- TYPE DEFINITIONS ---
// Defining the shape of our data helps prevent future errors and provides better autocompletion.
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  subscriptionStatus: 'active' | 'inactive';
  // Properties required by the new v2.1 component:
  age: number;
  weight: number;
  height: string; // e.g., "6'0\""
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string[];
  equipment: string[];
}

export interface Habit {
  id: string;
  name:string;
  completed: boolean;
  streak: number;
  createdAt: string;
  // Properties required by the new v2.1 component:
  category: 'Health' | 'Recovery' | 'Cardio' | 'Mental' | 'Nutrition';
  completionRate: number; // A percentage from 0-100
}


// --- UPDATED MOCK DATA ---

export const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  createdAt: '2024-01-01',
  subscriptionStatus: 'active',
  // --- NEW FIELDS ADDED ---
  age: 32,
  weight: 180,
  height: `6'0"`,
  fitnessLevel: 'Intermediate',
  goals: ['Build Muscle', 'Stay Consistent'],
  equipment: ['Bodyweight', 'Bands'],
};

export const mockHabits: Habit[] = [
  { 
    id: '1', 
    name: 'Drink 8 glasses of water', 
    completed: true, 
    streak: 7, 
    createdAt: '2024-01-01',
    // --- NEW FIELDS ADDED ---
    category: 'Nutrition',
    completionRate: 90,
  },
  { 
    id: '2', 
    name: 'Get 8 hours of sleep', 
    completed: false, 
    streak: 3, 
    createdAt: '2024-01-01',
    // --- NEW FIELDS ADDED ---
    category: 'Recovery',
    completionRate: 75,
  },
  { 
    id: '3', 
    name: 'Take vitamins', 
    completed: true, 
    streak: 12, 
    createdAt: '2024-01-01',
    // --- NEW FIELDS ADDED ---
    category: 'Health',
    completionRate: 100,
  },
];


// --- YOUR OTHER MOCK DATA (UNCHANGED) ---

export const mockStats = {
  workoutStreak: 8,
  completedWorkouts: 24,
  totalWorkouts: 28,
  habitStreak: 15,
  averageRPE: 7.2,
  totalVolume: 2840,
};

export const mockWorkouts = [
  {
    id: '1',
    day: 1,
    week: 1,
    title: 'Upper Body Foundation',
    duration: 30,
    completed: true,
    rpe: 7,
    exercises: [
      { id: '1', name: 'Push-ups', sets: 3, reps: 12, equipment: 'bodyweight', description: 'Standard push-ups' },
      { id: '2', name: 'Pike Push-ups', sets: 3, reps: 8, equipment: 'bodyweight', description: 'Pike position push-ups' },
    ],
    completedAt: '2024-01-15',
  },
  {
    id: '2',
    day: 2,
    week: 1,
    title: 'Lower Body Power',
    duration: 30,
    completed: true,
    rpe: 8,
    exercises: [
      { id: '3', name: 'Squats', sets: 3, reps: 15, equipment: 'bodyweight', description: 'Bodyweight squats' },
      { id: '4', name: 'Lunges', sets: 3, reps: 10, equipment: 'bodyweight', description: 'Alternating lunges' },
    ],
    completedAt: '2024-01-16',
  },
  {
    id: '3',
    day: 3,
    week: 1,
    title: 'Rest Day',
    duration: 0,
    completed: false,
    exercises: [],
  },
  {
    id: '4',
    day: 4,
    week: 1,
    title: 'Full Body Circuit',
    duration: 35,
    completed: false,
    exercises: [
      { id: '5', name: 'Burpees', sets: 3, reps: 8, equipment: 'bodyweight', description: 'Full burpees' },
      { id: '6', name: 'Mountain Climbers', sets: 3, duration: 30, equipment: 'bodyweight', description: '30 seconds each set' },
      { id: '7', name: 'Plank', sets: 3, duration: 45, equipment: 'bodyweight', description: 'Hold plank position' },
    ],
  },
  // Add more workouts for testing
  {
    id: '5',
    day: 5,
    week: 1,
    title: 'Core & Cardio',
    duration: 25,
    completed: false,
    exercises: [
      { id: '8', name: 'Bicycle Crunches', sets: 3, reps: 20, equipment: 'bodyweight', description: 'Alternating bicycle crunches' },
      { id: '9', name: 'Jumping Jacks', sets: 3, duration: 30, equipment: 'bodyweight', description: '30 seconds of jumping jacks' },
    ],
  },
];