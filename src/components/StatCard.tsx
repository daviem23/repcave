import React from 'react';
import { DivideIcon as LucideIcon, ChevronRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  color?: 'primary' | 'success' | 'warning';
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary',
  onClick
}) => {
  const colorClasses = {
    primary: 'from-primary to-primary-dark',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
  };

  return (
    <div 
      className={`bg-background-light rounded-xl p-4 shadow-sm border border-border animate-fade-in ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-text-light">{title}</h3>
        <div className="flex items-center space-x-2">
          {Icon && (
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
              <Icon size={16} className="text-white" />
            </div>
          )}
          {onClick && (
            <ChevronRight size={16} className="text-text-light" />
          )}
        </div>
      </div>
      <div className="text-2xl font-bold text-text-dark mb-1">{value}</div>
      {subtitle && <p className="text-xs text-text-light">{subtitle}</p>}
    </div>
  );
};

export default StatCard;