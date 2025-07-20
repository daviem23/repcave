import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { TimerState } from '../hooks/useWorkoutTimer';

interface WorkoutTimerProps {
  state: TimerState;
  timeRemaining: number;
  formatTime: string;
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onReset?: () => void;
  exerciseName?: string;
  currentSet?: number;
  totalSets?: number;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  state,
  timeRemaining,
  formatTime,
  isActive,
  onStart,
  onPause,
  onResume,
  onSkip,
  onReset,
  exerciseName,
  currentSet,
  totalSets,
}) => {
  const getStateDisplay = () => {
    switch (state) {
      case 'preroll':
        return {
          title: 'Get Ready!',
          subtitle: 'Prepare for your workout',
          bgColor: 'from-yellow-500 to-orange-500',
          textColor: 'text-white',
        };
      case 'exercising':
        return {
          title: exerciseName || 'Exercise Time',
          subtitle: currentSet && totalSets ? `Set ${currentSet} of ${totalSets}` : 'Push yourself!',
          bgColor: 'from-green-500 to-green-600',
          textColor: 'text-white',
        };
      case 'resting':
        return {
          title: 'Rest Time',
          subtitle: 'Catch your breath',
          bgColor: 'from-blue-500 to-blue-600',
          textColor: 'text-white',
        };
      case 'paused':
        return {
          title: 'Paused',
          subtitle: 'Workout paused',
          bgColor: 'from-gray-500 to-gray-600',
          textColor: 'text-white',
        };
      case 'complete':
        return {
          title: 'Complete!',
          subtitle: 'Great workout!',
          bgColor: 'from-purple-500 to-purple-600',
          textColor: 'text-white',
        };
      default:
        return {
          title: 'Ready',
          subtitle: 'Press start to begin',
          bgColor: 'from-primary to-primary-dark',
          textColor: 'text-white',
        };
    }
  };

  const stateDisplay = getStateDisplay();

  if (state === 'complete') {
    return (
      <div className={`bg-gradient-to-r ${stateDisplay.bgColor} rounded-xl p-6 text-center ${stateDisplay.textColor} animate-pulse-subtle`}>
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">{stateDisplay.title}</h2>
        <p className="text-lg opacity-90 mb-4">{stateDisplay.subtitle}</p>
        {onReset && (
          <button
            onClick={onReset}
            className="bg-white bg-opacity-20 text-white py-2 px-4 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center space-x-2 mx-auto"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r ${stateDisplay.bgColor} rounded-xl p-6 text-center ${stateDisplay.textColor} ${state === 'preroll' ? 'animate-pulse-subtle' : ''}`}>
      <h2 className="text-xl font-bold mb-2">{stateDisplay.title}</h2>
      <p className="text-sm opacity-90 mb-4">{stateDisplay.subtitle}</p>
      
      <div className="text-5xl font-bold mb-6 font-mono">
        {timeRemaining > 0 ? formatTime : (state === 'exercising' ? 'GO!' : formatTime)}
      </div>

      <div className="flex justify-center space-x-3">
        {state === 'preroll' && !isActive && (
          <button
            onClick={onStart}
            className="bg-white bg-opacity-20 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center space-x-2"
          >
            <Play size={20} />
            <span>Start</span>
          </button>
        )}

        {(state === 'exercising' || state === 'resting') && isActive && (
          <button
            onClick={onPause}
            className="bg-white bg-opacity-20 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center space-x-2"
          >
            <Pause size={20} />
            <span>Pause</span>
          </button>
        )}

        {state === 'paused' && (
          <button
            onClick={onResume}
            className="bg-white bg-opacity-20 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center space-x-2"
          >
            <Play size={20} />
            <span>Resume</span>
          </button>
        )}

        {(state === 'preroll' || state === 'resting' || state === 'exercising') && (
          <button
            onClick={onSkip}
            className="bg-white bg-opacity-20 text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center space-x-2"
          >
            <SkipForward size={20} />
            <span>Skip</span>
          </button>
        )}
      </div>

      {state === 'exercising' && timeRemaining === 0 && (
        <div className="mt-4">
          <p className="text-sm opacity-75">Complete the set when ready</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutTimer;