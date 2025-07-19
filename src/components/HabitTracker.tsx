import React from 'react';
import { Check, Plus } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggleHabit, onAddHabit }) => {
  return (
    <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-dark">Today's Habits</h3>
        <button
          onClick={onAddHabit}
          className="p-2 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {habits.map((habit) => (
          <div key={habit.id} className="flex items-center space-x-3">
            <button
              onClick={() => onToggleHabit(habit.id)}
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                habit.completed
                  ? 'bg-primary border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              {habit.completed && <Check size={14} className="text-white" />}
            </button>
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                habit.completed ? 'text-text-light line-through' : 'text-text-dark'
              }`}>
                {habit.name}
              </p>
              <p className="text-xs text-text-light">
                {habit.streak} day streak 🔥
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker;