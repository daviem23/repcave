/*
  # Workouts, Exercises, and Workout Plans

  1. New Tables
    - `workout_plans` - Generated 4-week plans for users
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `fitness_profile_id` (uuid, references fitness_profiles)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `exercises` - Exercise library
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `equipment_required` (text array)
      - `muscle_groups` (text array)
      - `difficulty_level` (integer 1-5)
      - `is_active` (boolean)
    
    - `workouts` - Individual workout sessions in a plan
      - `id` (uuid, primary key)
      - `workout_plan_id` (uuid, references workout_plans)
      - `user_id` (uuid, references user_profiles)
      - `week_number` (integer 1-4)
      - `day_number` (integer 1-7)
      - `title` (text)
      - `duration_minutes` (integer)
      - `is_rest_day` (boolean)
      - `is_completed` (boolean)
      - `completed_at` (timestamp)
      - `rpe_rating` (integer 1-10)
    
    - `workout_exercises` - Exercises within a specific workout
      - `id` (uuid, primary key)
      - `workout_id` (uuid, references workouts)
      - `exercise_id` (uuid, references exercises)
      - `sets` (integer)
      - `reps` (integer, optional)
      - `duration_seconds` (integer, optional)
      - `rest_seconds` (integer)
      - `order_index` (integer)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own workout data
    - Exercises table is readable by all authenticated users
*/

-- Create workout_plans table
CREATE TABLE IF NOT EXISTS workout_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  fitness_profile_id uuid NOT NULL REFERENCES fitness_profiles(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create exercises table (shared library)
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  equipment_required text[] DEFAULT '{}',
  muscle_groups text[] DEFAULT '{}',
  difficulty_level integer CHECK (difficulty_level >= 1 AND difficulty_level <= 5) DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create workouts table
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id uuid NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  week_number integer CHECK (week_number >= 1 AND week_number <= 4) NOT NULL,
  day_number integer CHECK (day_number >= 1 AND day_number <= 7) NOT NULL,
  title text NOT NULL,
  duration_minutes integer DEFAULT 30,
  is_rest_day boolean DEFAULT false,
  is_completed boolean DEFAULT false,
  completed_at timestamptz,
  rpe_rating integer CHECK (rpe_rating >= 1 AND rpe_rating <= 10),
  created_at timestamptz DEFAULT now()
);

-- Create workout_exercises table
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets integer NOT NULL DEFAULT 1,
  reps integer,
  duration_seconds integer,
  rest_seconds integer DEFAULT 90,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;

-- Workout plans policies
CREATE POLICY "Users can read own workout plans"
  ON workout_plans
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workout plans"
  ON workout_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout plans"
  ON workout_plans
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Exercises policies (readable by all authenticated users)
CREATE POLICY "Authenticated users can read exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (true);

-- Workouts policies
CREATE POLICY "Users can read own workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workouts"
  ON workouts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Workout exercises policies
CREATE POLICY "Users can read own workout exercises"
  ON workout_exercises
  FOR SELECT
  TO authenticated
  USING (
    workout_id IN (
      SELECT id FROM workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises"
  ON workout_exercises
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workout_id IN (
      SELECT id FROM workouts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises"
  ON workout_exercises
  FOR UPDATE
  TO authenticated
  USING (
    workout_id IN (
      SELECT id FROM workouts WHERE user_id = auth.uid()
    )
  );