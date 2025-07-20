import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-alternate">
      <div className="max-w-md mx-auto bg-background-light min-h-screen shadow-lg">
        <main className="pb-20">
          <Outlet />
        </main>
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;