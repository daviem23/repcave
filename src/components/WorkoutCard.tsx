import React from 'react';
import { Play, CheckCircle, Clock, Flame } from 'lucide-react';
import { Workout } from '../types';

interface WorkoutCardProps {
  workout: Workout;
  onStart: () => void;
  isToday?: boolean;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onStart, isToday = false }) => {
  const isRestDay = workout.exercises.length === 0;

  return (
    <div className={`bg-background-light rounded-xl p-4 shadow-sm border transition-all ${
      isToday ? 'border-primary bg-primary-light' : 'border-border'
    } ${workout.completed ? 'opacity-75' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-text-dark">
            Week {workout.week}, Day {workout.day}
          </h3>
          <p className="text-sm text-text-light">{workout.title}</p>
        </div>
        
        {workout.completed ? (
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" size={20} />
            {workout.rpe && (
              <div className="flex items-center space-x-1">
                <Flame size={14} className="text-orange-500" />
                <span className="text-xs font-medium text-text-light">RPE {workout.rpe}</span>
              </div>
            )}
          </div>
        ) : (
          !isRestDay && (
            <button
              onClick={onStart}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Play size={16} />
              <span className="text-sm font-medium">Start</span>
            </button>
          )
        )}
      </div>

      {!isRestDay && (
        <div className="flex items-center space-x-4 text-xs text-text-light">
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{workout.duration} min</span>
          </div>
          <div>{workout.exercises.length} exercises</div>
        </div>
      )}

      {isRestDay && (
        <div className="text-center py-4">
          <p className="text-text-light text-sm">Rest & Recovery Day</p>
          <p className="text-xs text-text-light mt-1">Focus on habits and recovery</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;