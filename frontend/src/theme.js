import { createTheme, alpha } from '@mui/material/styles';

const primaryColor = '#0a331c';
const primaryDark = '#051f10';
const primaryLight = '#eaf5ee';
const accentLime = '#cbf348';
const accentTerracotta = '#e25b39';
const accentGold = '#f59e0b';

const inkPrimary = '#111814';
const inkSecondary = '#4a5951';
const inkMuted = '#798a81';

const bgDefault = '#f6f4ee';
const bgPaper = '#ffffff';

const hairline = 'rgba(17, 24, 20, 0.09)';
const hairlineStrong = 'rgba(17, 24, 20, 0.18)';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor,
      dark: primaryDark,
      light: primaryLight,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2d3748',
      light: '#f7fafc',
      dark: '#1a202c',
      contrastText: '#ffffff',
    },
    background: {
      default: bgDefault,
      paper: bgPaper,
    },
    text: {
      primary: inkPrimary,
      secondary: inkSecondary,
      disabled: inkMuted,
    },
    success: {
      main: '#10b981',
      light: '#d1fae5',
      dark: '#047857',
    },
    warning: {
      main: accentGold,
      light: '#fef3c7',
      dark: '#b45309',
    },
    error: {
      main: accentTerracotta,
      light: '#fee2e2',
      dark: '#b91c1c',
    },
    info: {
      main: '#0284c7',
      light: '#e0f2fe',
      dark: '#0369a1',
    },
    divider: hairline,
    custom: {
      lime: accentLime,
      terracotta: accentTerracotta,
      gold: accentGold,
      goldLight: '#fef3c7',
      hairline: hairline,
      hairlineStrong: hairlineStrong,
      atelierDark: '#0d120f',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"Playfair Display", Georgia, serif',
      fontWeight: 700,
      color: inkPrimary,
      letterSpacing: '-0.025em',
      lineHeight: 1.05,
    },
    h2: {
      fontFamily: '"Syne", "Outfit", sans-serif',
      fontWeight: 800,
      color: inkPrimary,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h3: {
      fontFamily: '"Syne", "Outfit", sans-serif',
      fontWeight: 750,
      color: inkPrimary,
      letterSpacing: '-0.025em',
      lineHeight: 1.15,
    },
    h4: {
      fontFamily: '"Syne", "Outfit", sans-serif',
      fontWeight: 700,
      color: inkPrimary,
      letterSpacing: '-0.02em',
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"Syne", "Outfit", sans-serif',
      fontWeight: 700,
      color: inkPrimary,
      letterSpacing: '-0.015em',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: '"Syne", "Outfit", sans-serif',
      fontWeight: 700,
      color: inkPrimary,
      lineHeight: 1.35,
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      lineHeight: 1.5,
      color: inkSecondary,
    },
    subtitle2: {
      fontFamily: '"Space Mono", monospace',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      color: inkSecondary,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.65,
      color: inkPrimary,
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: inkSecondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontFamily: '"Syne", "Plus Jakarta Sans", sans-serif',
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Space Mono", monospace',
      fontSize: '0.75rem',
      color: inkMuted,
      letterSpacing: '0.03em',
    },
  },
  shape: {
    borderRadius: 18,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: bgDefault,
          color: inkPrimary,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: '10px 24px',
          fontSize: '0.925rem',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          backgroundColor: primaryColor,
          color: '#ffffff',
          boxShadow: '0 4px 14px rgba(10, 51, 28, 0.22)',
          '&:hover': {
            backgroundColor: primaryDark,
            boxShadow: '0 8px 22px rgba(10, 51, 28, 0.32)',
          },
        },
        outlinedPrimary: {
          borderColor: hairlineStrong,
          color: primaryColor,
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
            borderColor: primaryColor,
            backgroundColor: primaryLight,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          backgroundColor: bgPaper,
          border: `1px solid ${hairline}`,
          boxShadow: '0 4px 16px -4px rgba(17, 24, 20, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: '0 20px 48px -12px rgba(17, 24, 20, 0.12)',
            borderColor: 'rgba(10, 51, 28, 0.2)',
            transform: 'translateY(-3px)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: bgPaper,
          borderRadius: 22,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(bgDefault, 0.88),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          color: inkPrimary,
          boxShadow: 'none',
          borderBottom: `1px solid ${hairline}`,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          backgroundColor: bgPaper,
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: hairlineStrong,
            borderWidth: '1px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(17, 24, 20, 0.35)',
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(primaryColor, 0.12)}`,
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryColor,
              borderWidth: '1.5px',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          fontWeight: 700,
          fontSize: '0.8rem',
          height: '28px',
          border: `1px solid ${hairline}`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 26,
          padding: '8px',
          boxShadow: '0 32px 72px -16px rgba(17, 24, 20, 0.22)',
          border: `1px solid ${hairline}`,
        },
      },
    },
  },
});
