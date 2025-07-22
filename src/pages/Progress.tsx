// src/pages/Progress.tsx (Final Complete Version)

import React from 'react';
import { Award, TrendingUp, Flame, Target, Activity } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useUserStats } from '../hooks/useDatabase';

const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { stats, loading } = useUserStats();

  const rpeData = [
    { day: 'Mon', rpe: 6 },
    { day: 'Tue', rpe: 7 },
    { day: 'Wed', rpe: 5 },
    { day: 'Thu', rpe: 8 },
    { day: 'Fri', rpe: 7 },
    { day: 'Sat', rpe: 6 },
    { day: 'Sun', rpe: 0 },
  ];

  const volumeData = [
    { week: 'W1', volume: 180 },
    { week: 'W2', volume: 220 },
    { week: 'W3', volume: 195 },
    { week: 'W4', volume: 240 },
  ];

  const personalRecords = [
    'Bench Press: 185 lbs', 
    'Squat: 225 lbs', 
    'Deadlift: 275 lbs'
  ];

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div>
      <Header title="Your Progress" />
      
      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Workout Streak"
            value={stats?.workoutStreak || 0}
            subtitle="current streak"
            icon={Flame}
            color="primary"
            onClick={() => navigate('/plan')}
          />
          <StatCard
            title="Habit Streak"
            value={stats?.habitStreak || 0}
            subtitle="days consistent"
            icon={Target}
            color="success"
            onClick={() => navigate('/profile', { state: { openTab: 'habits' } })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Avg. RPE"
            value={(stats?.averageRPE || 0).toFixed(1)}
            subtitle="this week"
            icon={Activity}
          />
          <StatCard
            title="Total Volume"
            value={`${stats?.totalVolume || 0}`}
            subtitle="reps completed"
            icon={TrendingUp}
          />
        </div>

        {/* RPE Trend Chart */}
        <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-text-dark mb-4">RPE Trend (This Week)</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rpeData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#5a6a7a' }}
                />
                <YAxis 
                  domain={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#5a6a7a' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rpe" 
                  stroke="#E53935" 
                  strokeWidth={3}
                  dot={{ fill: '#E53935', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#C62828' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-text-light mt-2">
            Your effort levels have been consistent. Great work!
          </p>
        </div>

        {/* Volume Progress */}
        <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-text-dark mb-4">Weekly Volume</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <XAxis 
                  dataKey="week" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#5a6a7a' }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="volume" 
                  fill="#E53935" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-text-light mt-2">
            Volume trending upward - progressive overload in action!
          </p>
        </div>

        {/* Personal Records */}
        <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
          <h2 className="font-semibold text-text-dark mb-4">Recent Personal Records</h2>
          <div className="space-y-3">
            {personalRecords.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background-alternate rounded-lg">
                <span className="text-text-dark">{record}</span>
                <Award size={16} className="text-yellow-500" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Achievement Badges */}
        <div className="bg-background-light rounded-xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-text-dark mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🔥</span>
              </div>
              <p className="text-xs text-text-light">Week Warrior</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">💪</span>
              </div>
              <p className="text-xs text-text-light">Strength Builder</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🎯</span>
              </div>
              <p className="text-xs text-text-light">Habit Master</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;