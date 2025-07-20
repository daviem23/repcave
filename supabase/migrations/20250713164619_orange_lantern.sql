/*
  # Fitness Profiles and Onboarding Data

  1. New Tables
    - `fitness_profiles` - User fitness assessment and preferences
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `pushup_level` (enum: 0-5, 6-15, 16-30, 31+)
      - `effort_level` (enum: easy, moderate, tough, limit)
      - `equipment` (text array)
      - `workout_duration` (enum: 10-20, 30, 45, 60)
      - `goals` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `fitness_profiles` table
    - Add policies for users to manage their own fitness profile
*/

-- Create enums for fitness profile
CREATE TYPE pushup_level AS ENUM ('0-5', '6-15', '16-30', '31+');
CREATE TYPE effort_level AS ENUM ('easy', 'moderate', 'tough', 'limit');
CREATE TYPE workout_duration AS ENUM ('10-20', '30', '45', '60');

-- Create fitness_profiles table
CREATE TABLE IF NOT EXISTS fitness_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  pushup_level pushup_level NOT NULL,
  effort_level effort_level NOT NULL,
  equipment text[] DEFAULT '{}',
  workout_duration workout_duration NOT NULL,
  goals text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE fitness_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own fitness profile"
  ON fitness_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own fitness profile"
  ON fitness_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own fitness profile"
  ON fitness_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own fitness profile"
  ON fitness_profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER handle_fitness_profiles_updated_at
  BEFORE UPDATE ON fitness_profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();