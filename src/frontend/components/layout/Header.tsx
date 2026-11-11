import React from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Chip } from '@mui/material';

export const Header: React.FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '1rem',
            }}
          >
            V
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '-0.02em' }}>
            VFast ELMS
          </Typography>
          <Chip label="Executive Portal" size="small" sx={{ bgcolor: '#E0F2FE', color: '#0F67B1', fontWeight: 600, ml: 1 }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Alex Morgan
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Manager (P&L Operations)
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36, fontSize: '0.875rem', fontWeight: 600 }}>
            AM
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
