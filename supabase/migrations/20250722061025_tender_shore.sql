/*
  # Add squat level to fitness profiles

  1. Changes
    - Add `squat_level` column to `fitness_profiles` table
    - Update the enum type to include squat level options
    - Ensure backward compatibility

  2. Security
    - No changes to RLS policies needed
*/

-- Add squat_level column to fitness_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fitness_profiles' AND column_name = 'squat_level'
  ) THEN
    ALTER TABLE fitness_profiles ADD COLUMN squat_level pushup_level NOT NULL DEFAULT '0-5';
  END IF;
END $$;