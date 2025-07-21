/*
  # User Statistics and Progress Tracking

  1. New Tables
    - `user_stats` - Aggregated user statistics
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `current_workout_streak` (integer)
      - `longest_workout_streak` (integer)
      - `current_habit_streak` (integer)
      - `longest_habit_streak` (integer)
      - `total_workouts_completed` (integer)
      - `total_exercises_completed` (integer)
      - `total_sets_completed` (integer)
      - `average_rpe` (decimal)
      - `total_workout_minutes` (integer)
      - `last_workout_date` (date)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Users can only access their own stats
*/

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  current_workout_streak integer DEFAULT 0,
  longest_workout_streak integer DEFAULT 0,
  current_habit_streak integer DEFAULT 0,
  longest_habit_streak integer DEFAULT 0,
  total_workouts_completed integer DEFAULT 0,
  total_exercises_completed integer DEFAULT 0,
  total_sets_completed integer DEFAULT 0,
  average_rpe decimal DEFAULT 0,
  total_workout_minutes integer DEFAULT 0,
  last_workout_date date,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- User stats policies
CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER handle_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to update user stats after workout completion
CREATE OR REPLACE FUNCTION update_user_stats_after_workout()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user stats when a workout is completed
  IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
    INSERT INTO user_stats (user_id, total_workouts_completed, last_workout_date)
    VALUES (NEW.user_id, 1, CURRENT_DATE)
    ON CONFLICT (user_id) DO UPDATE SET
      total_workouts_completed = user_stats.total_workouts_completed + 1,
      total_exercises_completed = user_stats.total_exercises_completed + NEW.total_exercises,
      total_sets_completed = user_stats.total_sets_completed + NEW.total_sets,
      total_workout_minutes = user_stats.total_workout_minutes + NEW.duration_minutes,
      average_rpe = CASE 
        WHEN NEW.rpe_rating IS NOT NULL THEN
          ((user_stats.average_rpe * (user_stats.total_workouts_completed - 1)) + NEW.rpe_rating) / user_stats.total_workouts_completed
        ELSE user_stats.average_rpe
      END,
      last_workout_date = CURRENT_DATE,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stats updates
CREATE TRIGGER update_stats_on_workout_completion
  AFTER UPDATE ON workout_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_after_workout();