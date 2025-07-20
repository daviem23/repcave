/*
  # Seed Exercise Database

  1. New Data
    - Populate exercises table with comprehensive exercise library
    - Include bodyweight, dumbbell, resistance band, and gym exercises
    - Categorize by muscle groups and difficulty levels
    - Set appropriate equipment requirements

  2. Exercise Categories
    - Upper body: chest, back, shoulders, arms
    - Lower body: legs, glutes, calves
    - Core: abs, obliques, lower back
    - Full body: compound movements

  3. Equipment Types
    - bodyweight: No equipment needed
    - dumbbells: Dumbbells or kettlebells
    - bands: Resistance bands
    - gym: Full gym equipment
    - diy: Household items
*/

-- Upper Body Exercises
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
-- Bodyweight Upper Body
('Push-ups', 'Standard push-ups targeting chest, shoulders, and triceps', '{}', '{"chest", "shoulders", "triceps"}', 2),
('Pike Push-ups', 'Inverted push-ups targeting shoulders and upper chest', '{}', '{"shoulders", "chest"}', 3),
('Diamond Push-ups', 'Close-grip push-ups emphasizing triceps', '{}', '{"triceps", "chest"}', 4),
('Wide-Grip Push-ups', 'Wide-stance push-ups targeting outer chest', '{}', '{"chest", "shoulders"}', 2),
('Decline Push-ups', 'Feet elevated push-ups for upper chest', '{}', '{"chest", "shoulders"}', 3),
('Tricep Dips', 'Chair or bench dips for triceps', '{}', '{"triceps", "shoulders"}', 3),
('Pull-ups', 'Overhand grip pull-ups for back and biceps', '{"pull-up bar"}', '{"back", "biceps"}', 5),
('Chin-ups', 'Underhand grip pull-ups emphasizing biceps', '{"pull-up bar"}', '{"biceps", "back"}', 4),

-- Dumbbell Upper Body
('Dumbbell Bench Press', 'Chest press with dumbbells', '{"dumbbells"}', '{"chest", "shoulders", "triceps"}', 3),
('Dumbbell Rows', 'Bent-over rows for back development', '{"dumbbells"}', '{"back", "biceps"}', 2),
('Dumbbell Shoulder Press', 'Overhead press for shoulders', '{"dumbbells"}', '{"shoulders", "triceps"}', 3),
('Dumbbell Bicep Curls', 'Isolation exercise for biceps', '{"dumbbells"}', '{"biceps"}', 1),
('Dumbbell Tricep Extensions', 'Overhead tricep extensions', '{"dumbbells"}', '{"triceps"}', 2),
('Dumbbell Flyes', 'Chest isolation exercise', '{"dumbbells"}', '{"chest"}', 3),
('Dumbbell Lateral Raises', 'Side raises for shoulder width', '{"dumbbells"}', '{"shoulders"}', 2),

-- Resistance Band Upper Body
('Band Pull-Aparts', 'Rear delt exercise with resistance band', '{"resistance bands"}', '{"shoulders", "back"}', 1),
('Band Chest Press', 'Chest press using resistance band', '{"resistance bands"}', '{"chest", "shoulders"}', 2),
('Band Rows', 'Seated rows with resistance band', '{"resistance bands"}', '{"back", "biceps"}', 2),
('Band Bicep Curls', 'Bicep curls with resistance band', '{"resistance bands"}', '{"biceps"}', 1),
('Band Tricep Extensions', 'Tricep extensions with band', '{"resistance bands"}', '{"triceps"}', 2);

-- Lower Body Exercises
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
-- Bodyweight Lower Body
('Bodyweight Squats', 'Basic squats for leg development', '{}', '{"legs", "glutes"}', 1),
('Jump Squats', 'Explosive squats for power', '{}', '{"legs", "glutes"}', 3),
('Lunges', 'Alternating forward lunges', '{}', '{"legs", "glutes"}', 2),
('Reverse Lunges', 'Backward stepping lunges', '{}', '{"legs", "glutes"}', 2),
('Side Lunges', 'Lateral lunges for inner thighs', '{}', '{"legs", "glutes"}', 2),
('Single-Leg Glute Bridges', 'Unilateral glute activation', '{}', '{"glutes", "hamstrings"}', 3),
('Calf Raises', 'Standing calf raises', '{}', '{"calves"}', 1),
('Wall Sit', 'Isometric quad exercise', '{}', '{"legs"}', 2),
('Step-ups', 'Step-ups using chair or bench', '{}', '{"legs", "glutes"}', 2),

-- Dumbbell Lower Body
('Dumbbell Squats', 'Goblet squats with dumbbell', '{"dumbbells"}', '{"legs", "glutes"}', 2),
('Dumbbell Lunges', 'Walking lunges with dumbbells', '{"dumbbells"}', '{"legs", "glutes"}', 3),
('Dumbbell Deadlifts', 'Romanian deadlifts with dumbbells', '{"dumbbells"}', '{"hamstrings", "glutes", "back"}', 3),
('Dumbbell Calf Raises', 'Weighted calf raises', '{"dumbbells"}', '{"calves"}', 2),
('Dumbbell Bulgarian Split Squats', 'Rear-foot elevated split squats', '{"dumbbells"}', '{"legs", "glutes"}', 4),

-- Resistance Band Lower Body
('Band Squats', 'Squats with resistance band', '{"resistance bands"}', '{"legs", "glutes"}', 2),
('Band Lateral Walks', 'Side steps with band around legs', '{"resistance bands"}', '{"glutes", "legs"}', 2),
('Band Glute Bridges', 'Glute bridges with band resistance', '{"resistance bands"}', '{"glutes"}', 2);

-- Core Exercises
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
-- Bodyweight Core
('Plank', 'Standard plank hold for core stability', '{}', '{"core"}', 2),
('Side Plank', 'Lateral plank for obliques', '{}', '{"core", "obliques"}', 3),
('Crunches', 'Basic abdominal crunches', '{}', '{"core"}', 1),
('Bicycle Crunches', 'Alternating knee-to-elbow crunches', '{}', '{"core", "obliques"}', 2),
('Russian Twists', 'Seated torso rotations', '{}', '{"core", "obliques"}', 2),
('Mountain Climbers', 'Dynamic core and cardio exercise', '{}', '{"core", "shoulders"}', 3),
('Dead Bug', 'Core stability exercise', '{}', '{"core"}', 2),
('Bird Dog', 'Opposite arm and leg extension', '{}', '{"core", "back"}', 2),
('Leg Raises', 'Lower abdominal exercise', '{}', '{"core"}', 3),
('Hollow Body Hold', 'Isometric core exercise', '{}', '{"core"}', 4),

-- Weighted Core
('Dumbbell Russian Twists', 'Weighted torso rotations', '{"dumbbells"}', '{"core", "obliques"}', 3),
('Dumbbell Side Bends', 'Lateral flexion with weight', '{"dumbbells"}', '{"obliques"}', 2);

-- Full Body/Compound Exercises
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
-- Bodyweight Full Body
('Burpees', 'Full body explosive movement', '{}', '{"legs", "chest", "shoulders", "core"}', 4),
('Bear Crawl', 'Quadrupedal movement pattern', '{}', '{"shoulders", "core", "legs"}', 3),
('Jumping Jacks', 'Full body cardio exercise', '{}', '{"legs", "shoulders"}', 1),
('High Knees', 'Running in place with high knees', '{}', '{"legs", "core"}', 2),

-- Dumbbell Full Body
('Dumbbell Thrusters', 'Squat to overhead press', '{"dumbbells"}', '{"legs", "shoulders", "core"}', 4),
('Dumbbell Man Makers', 'Burpee with dumbbell rows', '{"dumbbells"}', '{"chest", "back", "legs", "shoulders"}', 5),
('Dumbbell Renegade Rows', 'Plank position alternating rows', '{"dumbbells"}', '{"back", "core", "shoulders"}', 4);

-- DIY/Household Item Exercises
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
('Backpack Squats', 'Squats with loaded backpack', '{"backpack"}', '{"legs", "glutes"}', 2),
('Water Jug Carries', 'Farmer walks with water jugs', '{"water jugs"}', '{"shoulders", "core", "legs"}', 2),
('Towel Pull-ups', 'Pull-ups using towel over door', '{"towel"}', '{"back", "biceps"}', 4),
('Chair Step-ups', 'Step-ups using sturdy chair', '{"chair"}', '{"legs", "glutes"}', 2),
('Book Chest Press', 'Chest press using heavy books', '{"books"}', '{"chest", "shoulders"}', 2);