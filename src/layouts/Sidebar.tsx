import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Divider } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { PATHS } from '@/routes/paths';

const SIDEBAR_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'License Management', path: PATHS.LICENSES, icon: <VpnKeyOutlinedIcon fontSize="small" /> },
  { label: 'Budget Analytics', path: PATHS.BUDGET, icon: <AccountBalanceWalletOutlinedIcon fontSize="small" /> },
  { label: 'General Analytics', path: PATHS.ANALYTICS, icon: <InsightsOutlinedIcon fontSize="small" /> },
  { label: 'User Management', path: PATHS.USERS, icon: <ManageAccountsOutlinedIcon fontSize="small" /> },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      className="shrink-0"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          top: 64,
          height: 'calc(100% - 64px)',
          borderRight: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Box className="overflow-auto py-4">
        <List disablePadding>
          {navItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding className="mb-1 px-3">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isSelected}
                  className={`rounded-lg py-2 px-3 transition-colors ${
                    isSelected
                      ? 'bg-sky-100 text-[#0F67B1] font-semibold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    px: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: '#E0F2FE',
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#BAE6FD',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    className="min-w-9"
                    sx={{
                      minWidth: 36,
                      color: isSelected ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Divider className="my-4 border-slate-200" />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
