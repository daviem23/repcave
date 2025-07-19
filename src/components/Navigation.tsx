import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, TrendingUp, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/plan', icon: Calendar, label: 'Plan' },
    { to: '/progress', icon: TrendingUp, label: 'Progress' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full bg-background-light border-t border-border">
      <div className="flex justify-around py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary-light'
                  : 'text-text-light hover:text-primary hover:bg-primary-light'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;