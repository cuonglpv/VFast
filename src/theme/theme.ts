import { createTheme } from '@mui/material/styles';

/**
 * VFast Minimal Ocean Design Tokens (IA v5.3 Specification)
 * Palette: Grey - White - Ocean Blue
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F67B1', // Ocean Blue
      light: '#3B82F6',
      dark: '#0A4A80',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#475569', // Slate Grey
      light: '#64748B',
      dark: '#334155',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Light Slate Grey canvas
      paper: '#FFFFFF',   // Pure White card surface
    },
    text: {
      primary: '#0F172A',   // Deep Slate
      secondary: '#64748B', // Neutral Inks
    },
    success: {
      main: '#10B981', // Emerald Green
      light: '#D1FAE5',
    },
    warning: {
      main: '#F59E0B', // Warm Amber
      light: '#FEF3C7',
    },
    error: {
      main: '#EF4444', // Crimson / Rose
      light: '#FEE2E2',
    },
    divider: '#E2E8F0', // Hairline Border
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h6: {
      fontWeight: 700,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#64748B',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
