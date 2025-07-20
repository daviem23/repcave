import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  action?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, action }) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 bg-background-light border-b border-border">
      <div className="flex items-center space-x-3">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-background-alternate transition-colors"
          >
            <ArrowLeft size={20} className="text-text-dark" />
          </button>
        )}
        <h1 className="text-xl font-bold text-text-dark">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </header>
  );
};

export default Header;