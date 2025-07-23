import type { FitnessProfile, Workout, Exercise } from '../types';

// Base exercises database
const EXERCISES_DATABASE = {
  pushups: {
    id: 'pushup-1',
    name: 'Push-ups',
    description: 'Standard push-ups with proper form',
    equipment: 'bodyweight',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    difficulty: 1,
  },
  squats: {
    id: 'squat-1',
    name: 'Squats',
    description: 'Bodyweight squats with proper form',
    equipment: 'bodyweight',
    muscleGroups: ['legs', 'glutes'],
    difficulty: 1,
  },
  plank: {
    id: 'plank-1',
    name: 'Plank',
    description: 'Hold plank position',
    equipment: 'bodyweight',
    muscleGroups: ['core'],
    difficulty: 1,
  },
  lunges: {
    id: 'lunge-1',
    name: 'Lunges',
    description: 'Alternating forward lunges',
    equipment: 'bodyweight',
    muscleGroups: ['legs', 'glutes'],
    difficulty: 2,
  },
  pikePushups: {
    id: 'pike-pushup-1',
    name: 'Pike Push-ups',
    description: 'Pike position push-ups for shoulders',
    equipment: 'bodyweight',
    muscleGroups: ['shoulders', 'triceps'],
    difficulty: 2,
  },
  mountainClimbers: {
    id: 'mountain-climber-1',
    name: 'Mountain Climbers',
    description: 'High-intensity mountain climbers',
    equipment: 'bodyweight',
    muscleGroups: ['core', 'cardio'],
    difficulty: 2,
  },
  burpees: {
    id: 'burpee-1',
    name: 'Burpees',
    description: 'Full body burpees',
    equipment: 'bodyweight',
    muscleGroups: ['full-body', 'cardio'],
    difficulty: 3,
  },
  jumpingJacks: {
    id: 'jumping-jack-1',
    name: 'Jumping Jacks',
    description: 'Classic jumping jacks for cardio',
    equipment: 'bodyweight',
    muscleGroups: ['cardio'],
    difficulty: 1,
  },
  bicycleCrunches: {
    id: 'bicycle-crunch-1',
    name: 'Bicycle Crunches',
    description: 'Alternating bicycle crunches',
    equipment: 'bodyweight',
    muscleGroups: ['core'],
    difficulty: 2,
  },
  wallSit: {
    id: 'wall-sit-1',
    name: 'Wall Sit',
    description: 'Hold wall sit position',
    equipment: 'bodyweight',
    muscleGroups: ['legs'],
    difficulty: 2,
  },
};

// Workout templates based on fitness level and duration
const WORKOUT_TEMPLATES = {
  beginner: {
    '10-20': [
      { exercises: ['pushups', 'squats', 'plank'], focus: 'foundation' },
      { exercises: ['lunges', 'pikePushups', 'plank'], focus: 'strength' },
      { exercises: ['squats', 'pushups', 'mountainClimbers'], focus: 'cardio' },
    ],
    '30': [
      { exercises: ['pushups', 'squats', 'plank', 'jumpingJacks'], focus: 'foundation' },
      { exercises: ['lunges', 'pikePushups', 'bicycleCrunches', 'wallSit'], focus: 'strength' },
      { exercises: ['squats', 'pushups', 'mountainClimbers', 'plank'], focus: 'cardio' },
      { exercises: ['burpees', 'lunges', 'pushups', 'plank'], focus: 'full-body' },
    ],
    '45': [
      { exercises: ['pushups', 'squats', 'plank', 'jumpingJacks', 'lunges'], focus: 'foundation' },
      { exercises: ['pikePushups', 'wallSit', 'bicycleCrunches', 'mountainClimbers', 'squats'], focus: 'strength' },
      { exercises: ['burpees', 'pushups', 'lunges', 'plank', 'jumpingJacks'], focus: 'cardio' },
      { exercises: ['squats', 'pikePushups', 'mountainClimbers', 'bicycleCrunches', 'wallSit'], focus: 'full-body' },
    ],
    '60': [
      { exercises: ['pushups', 'squats', 'plank', 'jumpingJacks', 'lunges', 'pikePushups'], focus: 'foundation' },
      { exercises: ['wallSit', 'bicycleCrunches', 'mountainClimbers', 'squats', 'pushups', 'plank'], focus: 'strength' },
      { exercises: ['burpees', 'lunges', 'jumpingJacks', 'pushups', 'mountainClimbers', 'squats'], focus: 'cardio' },
      { exercises: ['pikePushups', 'wallSit', 'bicycleCrunches', 'burpees', 'lunges', 'plank'], focus: 'full-body' },
    ],
  },
  intermediate: {
    '10-20': [
      { exercises: ['pushups', 'squats', 'mountainClimbers'], focus: 'strength' },
      { exercises: ['burpees', 'lunges', 'plank'], focus: 'cardio' },
      { exercises: ['pikePushups', 'wallSit', 'bicycleCrunches'], focus: 'targeted' },
    ],
    '30': [
      { exercises: ['pushups', 'squats', 'mountainClimbers', 'plank'], focus: 'strength' },
      { exercises: ['burpees', 'lunges', 'pikePushups', 'bicycleCrunches'], focus: 'cardio' },
      { exercises: ['wallSit', 'pushups', 'jumpingJacks', 'mountainClimbers'], focus: 'endurance' },
      { exercises: ['squats', 'burpees', 'plank', 'lunges'], focus: 'power' },
    ],
    '45': [
      { exercises: ['pushups', 'squats', 'mountainClimbers', 'plank', 'lunges'], focus: 'strength' },
      { exercises: ['burpees', 'pikePushups', 'bicycleCrunches', 'jumpingJacks', 'wallSit'], focus: 'cardio' },
      { exercises: ['squats', 'pushups', 'mountainClimbers', 'burpees', 'plank'], focus: 'power' },
      { exercises: ['lunges', 'pikePushups', 'bicycleCrunches', 'wallSit', 'jumpingJacks'], focus: 'endurance' },
    ],
    '60': [
      { exercises: ['pushups', 'squats', 'mountainClimbers', 'plank', 'lunges', 'pikePushups'], focus: 'strength' },
      { exercises: ['burpees', 'bicycleCrunches', 'jumpingJacks', 'wallSit', 'pushups', 'squats'], focus: 'cardio' },
      { exercises: ['mountainClimbers', 'burpees', 'lunges', 'plank', 'pikePushups', 'squats'], focus: 'power' },
      { exercises: ['wallSit', 'bicycleCrunches', 'jumpingJacks', 'pushups', 'lunges', 'mountainClimbers'], focus: 'endurance' },
    ],
  },
  advanced: {
    '10-20': [
      { exercises: ['burpees', 'mountainClimbers', 'pikePushups'], focus: 'intensity' },
      { exercises: ['pushups', 'squats', 'plank'], focus: 'strength' },
      { exercises: ['lunges', 'bicycleCrunches', 'wallSit'], focus: 'endurance' },
    ],
    '30': [
      { exercises: ['burpees', 'mountainClimbers', 'pikePushups', 'squats'], focus: 'intensity' },
      { exercises: ['pushups', 'lunges', 'plank', 'bicycleCrunches'], focus: 'strength' },
      { exercises: ['wallSit', 'jumpingJacks', 'burpees', 'mountainClimbers'], focus: 'cardio' },
      { exercises: ['squats', 'pikePushups', 'plank', 'lunges'], focus: 'power' },
    ],
    '45': [
      { exercises: ['burpees', 'mountainClimbers', 'pikePushups', 'squats', 'plank'], focus: 'intensity' },
      { exercises: ['pushups', 'lunges', 'bicycleCrunches', 'wallSit', 'jumpingJacks'], focus: 'strength' },
      { exercises: ['burpees', 'squats', 'mountainClimbers', 'pushups', 'plank'], focus: 'power' },
      { exercises: ['pikePushups', 'lunges', 'bicycleCrunches', 'wallSit', 'burpees'], focus: 'endurance' },
    ],
    '60': [
      { exercises: ['burpees', 'mountainClimbers', 'pikePushups', 'squats', 'plank', 'lunges'], focus: 'intensity' },
      { exercises: ['pushups', 'bicycleCrunches', 'wallSit', 'jumpingJacks', 'squats', 'mountainClimbers'], focus: 'strength' },
      { exercises: ['burpees', 'pikePushups', 'plank', 'lunges', 'pushups', 'squats'], focus: 'power' },
      { exercises: ['mountainClimbers', 'bicycleCrunches', 'wallSit', 'jumpingJacks', 'burpees', 'lunges'], focus: 'endurance' },
    ],
  },
};

function determineFitnessLevel(profile: FitnessProfile): 'beginner' | 'intermediate' | 'advanced' {
  const pushupScore = profile.pushupLevel === '0-5' ? 1 : profile.pushupLevel === '6-15' ? 2 : profile.pushupLevel === '16-30' ? 3 : 4;
  const squatScore = profile.squatLevel === '0-5' ? 1 : profile.squatLevel === '6-15' ? 2 : profile.squatLevel === '16-30' ? 3 : 4;
  const effortScore = profile.effortLevel === 'easy' ? 4 : profile.effortLevel === 'moderate' ? 3 : profile.effortLevel === 'tough' ? 2 : 1;
  
  const totalScore = pushupScore + squatScore + effortScore;
  
  if (totalScore <= 5) return 'beginner';
  if (totalScore <= 8) return 'intermediate';
  return 'advanced';
}

function calculateRepsAndSets(exerciseKey: string, profile: FitnessProfile, week: number): { sets: number; reps?: number; duration?: number } {
  const fitnessLevel = determineFitnessLevel(profile);
  const baseMultiplier = week * 0.1 + 1; // Progressive overload
  
  // Base values by fitness level
  const baseValues = {
    beginner: { sets: 2, reps: 8, duration: 20 },
    intermediate: { sets: 3, reps: 12, duration: 30 },
    advanced: { sets: 4, reps: 15, duration: 45 },
  };
  
  const base = baseValues[fitnessLevel];
  
  // Exercise-specific adjustments
  if (exerciseKey === 'plank' || exerciseKey === 'wallSit') {
    return {
      sets: base.sets,
      duration: Math.round(base.duration * baseMultiplier),
    };
  } else if (exerciseKey === 'mountainClimbers' || exerciseKey === 'jumpingJacks') {
    return {
      sets: base.sets,
      duration: Math.round((base.duration * 0.8) * baseMultiplier),
    };
  } else {
    return {
      sets: base.sets,
      reps: Math.round(base.reps * baseMultiplier),
    };
  }
}

export function generateWorkoutPlan(profile: FitnessProfile): Workout[] {
  const fitnessLevel = determineFitnessLevel(profile);
  const templates = WORKOUT_TEMPLATES[fitnessLevel][profile.workoutDuration];
  
  const workouts: Workout[] = [];
  let workoutId = 1;
  
  // Generate 4 weeks of workouts
  for (let week = 1; week <= 4; week++) {
    for (let day = 1; day <= 7; day++) {
      if (day === 7) {
        // Rest day
        workouts.push({
          id: `workout-${workoutId++}`,
          week,
          day,
          title: 'Rest & Recovery',
          duration: 0,
          exercises: [],
          completed: false,
        });
      } else {
        // Workout day
        const templateIndex = (day - 1) % templates.length;
        const template = templates[templateIndex];
        
        const exercises: Exercise[] = template.exercises.map((exerciseKey, index) => {
          const exerciseData = EXERCISES_DATABASE[exerciseKey as keyof typeof EXERCISES_DATABASE];
          const repsAndSets = calculateRepsAndSets(exerciseKey, profile, week);
          
          return {
            id: `${exerciseData.id}-${week}-${day}-${index}`,
            name: exerciseData.name,
            description: exerciseData.description,
            equipment: exerciseData.equipment,
            sets: repsAndSets.sets,
            reps: repsAndSets.reps,
            duration: repsAndSets.duration,
          };
        });
        
        const durationMap = {
          '10-20': 15,
          '30': 30,
          '45': 45,
          '60': 60,
        };
        
        workouts.push({
          id: `workout-${workoutId++}`,
          week,
          day,
          title: `${template.focus.charAt(0).toUpperCase() + template.focus.slice(1)} Training`,
          duration: durationMap[profile.workoutDuration],
          exercises,
          completed: false,
        });
      }
    }
  }
  
  return workouts;
}