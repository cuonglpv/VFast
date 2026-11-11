import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#111c2d]">
      <Sidebar />
      <Header />
      <main className="ml-60 pt-20 px-8 pb-12 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
