// src/pages/Profile.tsx (Final Complete Version)

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit2, Plus, Trash2, CreditCard, Settings, LogOut, User, Target } from 'lucide-react';
import { useHabits, useUser, useDatabaseWithFallback } from '../hooks/useDatabase';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockUser, mockHabits, type Habit } from '../lib/supabase';

const Profile: React.FC = () => {
  const location = useLocation();
  const { isConnected } = useDatabaseWithFallback();
  
  // Use real data if connected, fallback to localStorage
  const { user: dbUser, loading: userLoading } = useUser();
  const { habits: dbHabits, addHabit: dbAddHabit, deleteHabit: dbDeleteHabit, loading: habitsLoading } = useHabits();
  const [localHabits, setLocalHabits] = useLocalStorage<Habit[]>('habits', mockHabits);
  
  // Choose data source based on connection status
  const user = isConnected ? dbUser : mockUser;
  const habits = isConnected ? dbHabits : localHabits;
  const loading = isConnected ? (userLoading || habitsLoading) : false;
  
  const [activeTab, setActiveTab] = useState('profile');
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'Health' | 'Recovery' | 'Cardio' | 'Mental' | 'Nutrition'>('Health');
  const [unitPreference, setUnitPreference] = useState('imperial');
  const [timerPreference, setTimerPreference] = useState('auto');

  useEffect(() => {
    if (location.state?.openTab) {
      setActiveTab(location.state.openTab);
    }
  }, [location.state]);

  const handleAddHabit = () => {
    if (newHabitName.trim()) {
      if (isConnected) {
        dbAddHabit({
          name: newHabitName.trim(),
          category: newHabitCategory,
          completed: false,
          streak: 0,
          completionRate: 0
        });
      } else {
        const newHabit: Habit = {
          id: Date.now().toString(),
          name: newHabitName.trim(),
          category: newHabitCategory,
          completed: false,
          streak: 0,
          completionRate: 0,
          createdAt: new Date().toISOString(),
        };
        setLocalHabits(prev => [...prev, newHabit]);
      }
      setNewHabitName('');
      setNewHabitCategory('Health');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'habits', label: 'Habits', icon: Target },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleDeleteHabit = (habitId: string) => {
    if (isConnected) {
      dbDeleteHabit(habitId);
    } else {
      setLocalHabits(prev => prev.filter(habit => habit.id !== habitId));
    }
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark-text">Personal Information</h3>
          <button className="text-primary hover:text-primary-dark">
            <Edit2 size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-light-text">Name</span>
            <span className="text-dark-text font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text">Age</span>
            <span className="text-dark-text font-medium">{user?.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text">Weight</span>
            <span className="text-dark-text font-medium">{user?.weight} lbs</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light-text">Height</span>
            <span className="text-dark-text font-medium">{user?.height}</span>
          </div>
        </div>
      </div>
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark-text">Fitness Profile</h3>
          <button className="text-primary hover:text-primary-dark">
            <Edit2 size={20} />
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <span className="text-light-text text-sm">Fitness Level</span>
            <div className="mt-1">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {user?.fitnessLevel}
              </span>
            </div>
          </div>
          <div>
            <span className="text-light-text text-sm">Goals</span>
            <div className="mt-1 space-x-2">
              {user?.goals.map((goal, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {goal}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-light-text text-sm">Equipment</span>
            <div className="mt-1 space-x-2">
              {user?.equipment.map((item, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHabits = () => (
    <div className="space-y-6">
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-dark-text">My Habits</h3>
        </div>
        <div className="mb-4 p-4 bg-alt-bg rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="Enter habit name..."
              className="w-full p-3 border border-border-color rounded-lg"
            />
            <div className="flex space-x-3">
              <select
                value={newHabitCategory}
                onChange={(e) => setNewHabitCategory(e.target.value as any)}
                className="flex-1 p-3 border border-border-color rounded-lg"
              >
                <option value="Health">Health</option>
                <option value="Recovery">Recovery</option>
                <option value="Cardio">Cardio</option>
                <option value="Mental">Mental</option>
                <option value="Nutrition">Nutrition</option>
              </select>
              <button
                onClick={handleAddHabit}
                disabled={!newHabitName.trim()}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} className="flex items-center justify-between p-3 bg-alt-bg rounded-lg">
              <div>
                <div className="font-medium text-dark-text">{habit.name}</div>
                <div className="text-sm text-light-text">
                  {habit.category} • {habit.streak} day streak • {habit.completionRate}% completion
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-light-text hover:text-primary">
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="text-light-text hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-6">
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <h3 className="font-semibold text-dark-text mb-4">Current Plan</h3>
        <div className="bg-primary/10 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-dark-text">Premium Plan</span>
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">Active</span>
          </div>
          <div className="text-sm text-light-text mb-2">
            Next billing: March 15, 2024
          </div>
          <div className="text-2xl font-bold text-dark-text">$9.99/month</div>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Manage Subscription
          </button>
          <button className="w-full border border-border-color text-light-text py-3 rounded-lg font-medium hover:bg-alt-bg transition-colors">
            Cancel Subscription
          </button>
        </div>
      </div>
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <h3 className="font-semibold text-dark-text mb-4">Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Feb 15, 2024', amount: '$9.99', status: 'Paid' },
            { date: 'Jan 15, 2024', amount: '$9.99', status: 'Paid' },
            { date: 'Dec 15, 2023', amount: '$9.99', status: 'Paid' },
          ].map((bill, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-alt-bg rounded-lg">
              <div>
                <div className="font-medium text-dark-text">{bill.date}</div>
                <div className="text-sm text-light-text">{bill.status}</div>
              </div>
              <div className="font-medium text-dark-text">{bill.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <h3 className="font-semibold text-dark-text mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-dark-text">Email</span>
            <span className="text-light-text">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-text">Password</span>
            <button className="text-primary hover:text-primary-dark">Change</button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-text">Notifications</span>
            <div className="w-12 h-6 bg-primary rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-light-bg rounded-xl p-6 border border-border-color">
        <h3 className="font-semibold text-dark-text mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-dark-text">Units</span>
            <select 
              value={unitPreference}
              onChange={(e) => setUnitPreference(e.target.value)}
              className="bg-alt-bg border border-border-color rounded-lg px-3 py-2 text-dark-text"
            >
              <option value="imperial">Imperial (lbs, ft)</option>
              <option value="metric">Metric (kg, cm)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-dark-text">Rest Timer</span>
            <select 
              value={timerPreference}
              onChange={(e) => setTimerPreference(e.target.value)}
              className="bg-alt-bg border border-border-color rounded-lg px-3 py-2 text-dark-text"
            >
              <option value="auto">Auto-start</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
      </div>
      <button className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
        <LogOut size={20} />
        <span>Sign Out</span>
      </button>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfile();
      case 'habits': return renderHabits();
      case 'subscription': return renderSubscription();
      case 'settings': return renderSettings();
      default: return renderProfile();
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-light-bg rounded-xl p-2 border border-border-color">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-light-text hover:text-dark-text hover:bg-alt-bg'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Profile;