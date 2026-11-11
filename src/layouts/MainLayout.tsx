import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <Box className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <Box className="flex flex-1">
        <Sidebar />
        <Box
          component="main"
          className="grow p-6 min-h-[calc(100vh-64px)] bg-slate-50 overflow-y-auto"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            minHeight: 'calc(100vh - 64px)',
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
