import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Star, Home } from 'lucide-react';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';

const WorkoutComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [rpe, setRpe] = useState(7);
  const workoutId = location.state?.workoutId;

  // Play celebration sound on component mount
  React.useEffect(() => {
    const timer = useWorkoutTimer({
      config: { prerollDuration: 0, restDuration: 0 },
    });
    timer.completeWorkout();
  }, []);

  const handleSubmit = () => {
    // Save workout completion with RPE
    console.log('Workout completed:', { workoutId, rpe });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <div className="bg-background-light rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-dark mb-2">
            Workout Complete! 🎉
          </h1>
          <p className="text-text-light">
            Great job crushing today's workout!
          </p>
        </div>

        {/* RPE Rating */}
        <div className="mb-8">
          <h3 className="font-semibold text-text-dark mb-4">
            How hard was that workout?
          </h3>
          <p className="text-sm text-text-light mb-4">
            Rate your perceived effort (1-10)
          </p>
          
          <div className="flex justify-center space-x-2 mb-4">
            {Array.from({ length: 10 }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setRpe(i + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  i + 1 === rpe
                    ? 'bg-primary text-white scale-110'
                    : 'bg-background-alternate text-text-light hover:bg-border'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="text-xs text-text-light">
            {rpe <= 3 && "Too easy - let's increase intensity next time"}
            {rpe >= 4 && rpe <= 6 && "Perfect effort level!"}
            {rpe >= 7 && rpe <= 8 && "Great workout intensity"}
            {rpe >= 9 && "Very challenging - consider reducing intensity"}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">+1</div>
            <div className="text-xs text-text-light">Workout</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">🔥</div>
            <div className="text-xs text-text-light">Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">⭐</div>
            <div className="text-xs text-text-light">Points</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
          >
            Complete Workout
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center space-x-2 bg-background-alternate text-text-dark py-3 px-6 rounded-xl font-medium hover:bg-border transition-colors"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutComplete;