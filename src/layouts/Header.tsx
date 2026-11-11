import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Chip } from '@mui/material';

export const Header: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      className="bg-white border-b border-slate-200 text-slate-900 z-30"
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar className="justify-between min-h-16 px-4">
        {/* Brand Logo & Portal Tag */}
        <Box className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#0F67B1] flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            V
          </div>
          <Typography variant="h6" className="font-bold tracking-tight text-slate-900">
            VFast ELMS
          </Typography>
          <Chip
            label="Executive Portal"
            size="small"
            className="bg-sky-100 text-[#0F67B1] font-semibold ml-2"
          />
        </Box>

        {/* User Info & Avatar */}
        <Box className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <Typography variant="body2" className="font-semibold text-slate-800">
              Alex Morgan
            </Typography>
            <Typography variant="caption" className="text-slate-500 block">
              Manager (P&L Operations)
            </Typography>
          </div>
          <Avatar className="bg-[#0F67B1] w-9 h-9 text-sm font-semibold">
            AM
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
