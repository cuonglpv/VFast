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
      main: '#475569', // Slate Grey Neutral
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
      secondary: '#475569', // Neutral Inks
    },
    success: {
      main: '#166534',
      light: '#F0FDF4',
    },
    warning: {
      main: '#92400E',
      light: '#FFFBEB',
    },
    error: {
      main: '#B42318',
      light: '#FEF3F2',
    },
    divider: '#E2E8F0', // Hairline Border
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: {
      fontWeight: 700,
      fontSize: 'var(--type-page-size)',
      lineHeight: 'var(--type-page-line)',
      letterSpacing: '-0.02em',
      color: '#111C2D',
    },
    h6: {
      fontWeight: 600,
      fontSize: 'var(--type-section-size)',
      lineHeight: 'var(--type-section-line)',
      letterSpacing: '-0.01em',
      color: '#111C2D',
    },
    body1: {
      fontSize: 'var(--type-body-size)',
      lineHeight: 'var(--type-body-line)',
      color: '#111C2D',
    },
    body2: {
      fontSize: 'var(--type-body-size)',
      lineHeight: 'var(--type-body-line)',
      color: '#475569',
    },
    caption: {
      fontSize: 'var(--type-label-size)',
      lineHeight: 'var(--type-label-line)',
      color: '#515F74',
    },
    button: {
      fontSize: 'var(--type-body-size)',
      lineHeight: '20px',
      fontWeight: 600,
      textTransform: 'none',
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
          fontSize: 'var(--type-body-size)',
          padding: '6px 14px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: 'var(--type-label-size)',
          height: 24,
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
