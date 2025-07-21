/*
  # Workout Logs and Progress Tracking

  1. New Tables
    - `workout_logs` - Individual workout session logs
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `workout_id` (uuid, references workouts)
      - `started_at` (timestamp)
      - `completed_at` (timestamp)
      - `rpe_rating` (integer 1-10)
      - `notes` (text, optional)
      - `total_exercises` (integer)
      - `total_sets` (integer)
      - `duration_minutes` (integer)
    
    - `exercise_logs` - Individual exercise performance within a workout
      - `id` (uuid, primary key)
      - `workout_log_id` (uuid, references workout_logs)
      - `exercise_id` (uuid, references exercises)
      - `sets_completed` (integer)
      - `reps_completed` (integer array, optional)
      - `duration_seconds` (integer array, optional)
      - `weight_used` (decimal, optional)
      - `notes` (text, optional)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own workout logs
*/

-- Create workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  rpe_rating integer CHECK (rpe_rating >= 1 AND rpe_rating <= 10),
  notes text,
  total_exercises integer DEFAULT 0,
  total_sets integer DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create exercise_logs table
CREATE TABLE IF NOT EXISTS exercise_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_log_id uuid NOT NULL REFERENCES workout_logs(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sets_completed integer DEFAULT 0,
  reps_completed integer[],
  duration_seconds integer[],
  weight_used decimal,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;

-- Workout logs policies
CREATE POLICY "Users can read own workout logs"
  ON workout_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workout logs"
  ON workout_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout logs"
  ON workout_logs
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own workout logs"
  ON workout_logs
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Exercise logs policies
CREATE POLICY "Users can read own exercise logs"
  ON exercise_logs
  FOR SELECT
  TO authenticated
  USING (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exercise logs"
  ON exercise_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exercise logs"
  ON exercise_logs
  FOR UPDATE
  TO authenticated
  USING (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own exercise logs"
  ON exercise_logs
  FOR DELETE
  TO authenticated
  USING (
    workout_log_id IN (
      SELECT id FROM workout_logs WHERE user_id = auth.uid()
    )
  );