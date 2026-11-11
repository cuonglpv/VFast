import { createTheme } from '@mui/material/styles';

/**
 * VFast Minimal Ocean Design Tokens (IA v5.3 & Figma Specification)
 * Palette: Grey - White - Ocean Blue
 */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F67B1', // Ocean Blue
      dark: '#004F8B',
      light: '#3B82F6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#515F74', // Slate Grey Neutral
      light: '#64748B',
      dark: '#334155',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8FAFC', // Light Slate Grey canvas
      paper: '#FFFFFF',   // Pure White card surface
    },
    text: {
      primary: '#111C2D',   // Deep Slate Ink
      secondary: '#515F74', // Neutral Inks
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
      main: '#BA1A1A', // Crimson Red
      light: '#FFDAD6',
    },
    divider: '#E2E8F0', // Hairline Border
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.02em',
      color: '#111C2D',
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.125rem',
      letterSpacing: '-0.01em',
      color: '#111C2D',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#111C2D',
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.4,
      color: '#515F74',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#515F74',
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
          boxShadow: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '6px 14px',
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
