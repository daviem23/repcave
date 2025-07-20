/*
  # Seed Exercise Library

  1. Exercise Data
    - Populate the exercises table with a comprehensive library
    - Include bodyweight, dumbbell, resistance band, and gym exercises
    - Categorize by equipment and muscle groups
    - Set appropriate difficulty levels

  2. Exercise Categories
    - Bodyweight exercises for all fitness levels
    - Equipment-based exercises for different setups
    - Progressive difficulty scaling
*/

-- Insert bodyweight exercises
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
-- Push exercises
('Push-ups', 'Standard push-ups with proper form. Keep body straight from head to heels.', '{"bodyweight"}', '{"chest", "shoulders", "triceps"}', 2),
('Incline Push-ups', 'Push-ups with hands elevated on a surface. Easier variation for beginners.', '{"bodyweight"}', '{"chest", "shoulders", "triceps"}', 1),
('Decline Push-ups', 'Push-ups with feet elevated. More challenging variation.', '{"bodyweight"}', '{"chest", "shoulders", "triceps"}', 3),
('Pike Push-ups', 'Push-ups in pike position targeting shoulders. Great for shoulder strength.', '{"bodyweight"}', '{"shoulders", "triceps"}', 3),
('Diamond Push-ups', 'Push-ups with hands in diamond shape. Targets triceps heavily.', '{"bodyweight"}', '{"triceps", "chest"}', 4),

-- Pull exercises
('Pull-ups', 'Standard pull-ups using a bar. Full range of motion.', '{"pull-up bar"}', '{"back", "biceps"}', 4),
('Chin-ups', 'Pull-ups with underhand grip. Slightly easier than pull-ups.', '{"pull-up bar"}', '{"back", "biceps"}', 3),
('Inverted Rows', 'Horizontal pulling exercise using a bar or table.', '{"bar", "table"}', '{"back", "biceps"}', 2),

-- Leg exercises
('Squats', 'Bodyweight squats with proper depth and form.', '{"bodyweight"}', '{"quadriceps", "glutes"}', 1),
('Jump Squats', 'Explosive squat variation with jump at the top.', '{"bodyweight"}', '{"quadriceps", "glutes", "calves"}', 3),
('Lunges', 'Alternating forward lunges with proper form.', '{"bodyweight"}', '{"quadriceps", "glutes", "hamstrings"}', 2),
('Reverse Lunges', 'Lunges stepping backward. Easier on knees.', '{"bodyweight"}', '{"quadriceps", "glutes", "hamstrings"}', 2),
('Bulgarian Split Squats', 'Single-leg squats with rear foot elevated.', '{"bodyweight"}', '{"quadriceps", "glutes"}', 3),
('Single-leg Glute Bridges', 'Glute bridges performed one leg at a time.', '{"bodyweight"}', '{"glutes", "hamstrings"}', 2),
('Calf Raises', 'Standing calf raises for lower leg strength.', '{"bodyweight"}', '{"calves"}', 1),

-- Core exercises
('Plank', 'Standard plank hold maintaining straight body position.', '{"bodyweight"}', '{"core"}', 2),
('Side Plank', 'Plank performed on side targeting obliques.', '{"bodyweight"}', '{"core", "obliques"}', 2),
('Mountain Climbers', 'Dynamic core exercise alternating knee drives.', '{"bodyweight"}', '{"core", "shoulders"}', 2),
('Bicycle Crunches', 'Alternating elbow to knee crunches.', '{"bodyweight"}', '{"core", "obliques"}', 2),
('Dead Bug', 'Core stability exercise lying on back.', '{"bodyweight"}', '{"core"}', 1),
('Bird Dog', 'Quadruped exercise extending opposite arm and leg.', '{"bodyweight"}', '{"core", "back"}', 1),

-- Full body/cardio
('Burpees', 'Full body exercise combining squat, plank, and jump.', '{"bodyweight"}', '{"full body"}', 4),
('Jumping Jacks', 'Classic cardio exercise jumping feet apart and together.', '{"bodyweight"}', '{"full body", "cardio"}', 1),
('High Knees', 'Running in place bringing knees up high.', '{"bodyweight"}', '{"legs", "cardio"}', 2),

-- Resistance band exercises
('Band Pull-aparts', 'Pulling resistance band apart at chest level.', '{"resistance bands"}', '{"back", "shoulders"}', 1),
('Band Rows', 'Rowing motion with resistance band.', '{"resistance bands"}', '{"back", "biceps"}', 2),
('Band Chest Press', 'Chest press using resistance band.', '{"resistance bands"}', '{"chest", "shoulders", "triceps"}', 2),
('Band Squats', 'Squats with resistance band for added resistance.', '{"resistance bands"}', '{"quadriceps", "glutes"}', 2),
('Band Lateral Raises', 'Shoulder lateral raises with resistance band.', '{"resistance bands"}', '{"shoulders"}', 2),

-- Dumbbell exercises
('Dumbbell Chest Press', 'Chest press using dumbbells lying on floor or bench.', '{"dumbbells"}', '{"chest", "shoulders", "triceps"}', 2),
('Dumbbell Rows', 'Single-arm or bent-over rows with dumbbells.', '{"dumbbells"}', '{"back", "biceps"}', 2),
('Dumbbell Shoulder Press', 'Overhead press with dumbbells.', '{"dumbbells"}', '{"shoulders", "triceps"}', 2),
('Dumbbell Goblet Squats', 'Squats holding dumbbell at chest.', '{"dumbbells"}', '{"quadriceps", "glutes"}', 2),
('Dumbbell Lunges', 'Lunges holding dumbbells for added resistance.', '{"dumbbells"}', '{"quadriceps", "glutes", "hamstrings"}', 2),
('Dumbbell Deadlifts', 'Romanian deadlifts with dumbbells.', '{"dumbbells"}', '{"hamstrings", "glutes", "back"}', 3),
('Dumbbell Bicep Curls', 'Standard bicep curls with dumbbells.', '{"dumbbells"}', '{"biceps"}', 1),
('Dumbbell Tricep Extensions', 'Overhead tricep extensions with dumbbell.', '{"dumbbells"}', '{"triceps"}', 2);

-- Insert some gym/barbell exercises for advanced users
INSERT INTO exercises (name, description, equipment_required, muscle_groups, difficulty_level) VALUES
('Barbell Squats', 'Back squats with barbell for maximum leg development.', '{"barbell", "squat rack"}', '{"quadriceps", "glutes", "hamstrings"}', 4),
('Barbell Deadlifts', 'Conventional deadlifts with barbell.', '{"barbell"}', '{"hamstrings", "glutes", "back", "traps"}', 5),
('Barbell Bench Press', 'Chest press with barbell on bench.', '{"barbell", "bench"}', '{"chest", "shoulders", "triceps"}', 4),
('Barbell Rows', 'Bent-over rows with barbell.', '{"barbell"}', '{"back", "biceps"}', 3),
('Barbell Overhead Press', 'Standing overhead press with barbell.', '{"barbell"}', '{"shoulders", "triceps", "core"}', 4);