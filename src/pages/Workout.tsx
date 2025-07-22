import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import WorkoutTimer from '../components/WorkoutTimer';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { useWorkouts } from '../hooks/useDatabase';

const Workout: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workouts: allWorkouts, completeWorkout, loading } = useWorkouts();
  const [workout] = useState(allWorkouts.find(w => w.id === id));
  
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const currentExerciseData = workout?.exercises[currentExercise];
  const isLastExercise = currentExercise === (workout?.exercises.length || 0) - 1;
  const isLastSet = currentSet === currentExerciseData?.sets;

  const timer = useWorkoutTimer({
    config: {
      prerollDuration: 10,
      exerciseDuration: currentExerciseData?.duration || 45,
      restDuration: 90,
    },
    onStateChange: (state) => {
      console.log('Timer state changed to:', state);
    },
    onTimerComplete: () => {
      if (timer.state === 'resting' || timer.state === 'exercising') {
        handleNextSetOrExercise();
      }
    },
  });

  if (loading) {
    return <div className="p-4 text-center">Loading workout...</div>;
  }

  if (!workout) {
    return <div>Workout not found</div>;
  }

  const handleStartWorkout = async () => {
    // TODO: Start workout log in database
    // await startWorkoutLog(userId, workout.id);
    
    setWorkoutStarted(true);
    timer.startTimer();
  };

  const handleCompleteSet = () => {
    const setKey = `${currentExercise}-${currentSet}`;
    setCompletedSets(prev => new Set([...prev, setKey]));

    if (isLastSet && isLastExercise) {
      // Complete the workout
      timer.completeWorkout();
      
      // Update database - RPE will be collected on the completion page
      completeWorkout(workout.id).catch(console.error);
      
      // Navigate to completion page
      navigate('/workout-complete', { 
        state: { 
          workoutId: workout.id,
          workoutTitle: workout.title,
          totalExercises: workout.exercises.length,
          totalSets: workout.exercises.reduce((acc, ex) => acc + ex.sets, 0)
        } 
      });
    } else {
      timer.startRest();
    }
  };

  const handleNextSetOrExercise = () => {
    // Don't proceed if this was the final set
    if (isLastSet && isLastExercise) {
      return;
    }
    
    if (isLastSet) {
      setCurrentExercise(prev => prev + 1);
      setCurrentSet(1);
    } else {
      setCurrentSet(prev => prev + 1);
    }

    timer.resetTimer();
    setTimeout(() => timer.startTimer(), 500);
  };

  // ✅ Safe progress calculation to prevent NaN
  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const currentExerciseSets = currentExerciseData?.sets || 0;

  const setsCompleted =
    currentExercise < workout.exercises.length
      ? currentExercise * currentExerciseSets + currentSet - 1
      : totalSets;

  const progress = (setsCompleted / totalSets) * 100;

  return (
    <div>
      <Header 
        title={workout.title} 
        showBack={true}
        action={
          <div className="text-sm text-text-light">
            {Math.min(currentExercise + 1, workout.exercises.length)} of {workout.exercises.length}
          </div>
        }
      />

      <div className="p-4 space-y-6">
        {/* Progress */}
        <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-dark">Workout Progress</span>
            <span className="text-sm text-text-light">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-background-alternate rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Workout Timer */}
        {workoutStarted && currentExerciseData && (
          <WorkoutTimer
            state={timer.state}
            timeRemaining={timer.timeRemaining}
            formatTime={timer.formatTime}
            isActive={timer.isActive}
            onStart={timer.startTimer}
            onPause={timer.pauseTimer}
            onResume={timer.resumeTimer}
            onSkip={timer.skipCurrentTimer}
            onReset={timer.resetTimer}
            exerciseName={currentExerciseData.name}
            currentSet={currentSet}
            totalSets={currentExerciseData.sets}
          />
        )}

        {/* Current Exercise */}
        {currentExerciseData && (
          <div className="bg-background-light rounded-xl p-6 shadow-sm border border-border">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-text-dark mb-2">
                {currentExerciseData.name}
              </h2>
              <p className="text-text-light mb-4">{currentExerciseData.description}</p>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-text-light mb-4">
                <span>Set {currentSet} of {currentExerciseData.sets}</span>
                <span>•</span>
                <span>
                  {currentExerciseData.reps 
                    ? `${currentExerciseData.reps} reps`
                    : `${currentExerciseData.duration}s`}
                </span>
              </div>

              <div className="flex justify-center space-x-2 mb-6">
                {Array.from({ length: currentExerciseData.sets }, (_, i) => {
                  const key = `${currentExercise}-${i + 1}`;
                  return (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        completedSets.has(key)
                          ? 'bg-green-500 text-white'
                          : i + 1 === currentSet
                          ? 'bg-primary text-white'
                          : 'bg-background-alternate text-text-light'
                      }`}
                    >
                      {completedSets.has(key) ? (
                        <CheckCircle size={16} />
                      ) : (
                        i + 1
                      )}
                    </div>
                  );
                })}
              </div>

              {!workoutStarted ? (
                <button
                  onClick={handleStartWorkout}
                  className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Workout</span>
                  <ArrowRight size={20} />
                </button>
              ) : (timer.state === 'exercising' && timer.timeRemaining === 0) || timer.state === 'paused' ? (
                <button
                  onClick={handleCompleteSet}
                  className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary-dark transition-colors"
                >
                  Complete Set
                </button>
              ) : null}
            </div>
          </div>
        )}

        {/* Exercise List */}
        <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-text-dark mb-4">Today's Exercises</h3>
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`p-3 rounded-lg ${
                  index === currentExercise
                    ? 'bg-primary-light border border-primary'
                    : index < currentExercise
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-background-alternate'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-dark text-sm">{exercise.name}</p>
                    <p className="text-xs text-text-light">
                      {exercise.sets} sets × {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration || 45}s`}
                    </p>
                  </div>
                  {index < currentExercise && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workout;