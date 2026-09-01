import { createTheme, alpha } from '@mui/material/styles';

const ANIMATION_TIMING = '0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';

const primaryGreen = '#163a24';
const darkGreenText = '#1a3626';
const softBeigeBg = '#faf9f5';
const cardBeige = '#ffffff'; // Keep cards white for contrast against beige background
const lightGreenAccent = '#f1f4ec';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryGreen,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4a4a4a', // Keeping this for neutral secondary buttons
    },
    background: {
      default: softBeigeBg,
      paper: cardBeige,
    },
    text: {
      primary: darkGreenText,
      secondary: '#4b5563', // Warm gray
    },
    success: {
      main: '#2e7d32',
    },
    custom: {
      accentLight: lightGreenAccent,
      cardBeige: cardBeige,
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: darkGreenText },
    h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: darkGreenText },
    h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: darkGreenText },
    h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: darkGreenText },
    h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: darkGreenText },
    h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600, color: darkGreenText },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontFamily: '"Outfit", sans-serif',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: alpha(primaryGreen, 0.2),
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shaped buttons
          padding: '10px 24px',
          boxShadow: 'none',
          transition: `all ${ANIMATION_TIMING}`,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(22, 58, 36, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          backgroundColor: primaryGreen,
          '&:hover': {
            backgroundColor: '#0f291e', // Darker green
          },
        },
        outlinedSecondary: {
          borderColor: primaryGreen,
          color: primaryGreen,
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            backgroundColor: 'rgba(22, 58, 36, 0.04)',
            borderColor: '#0f291e',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Extra soft rounded cards
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)', // Very soft shadow
          border: '1px solid rgba(0, 0, 0, 0.02)',
          transition: `all ${ANIMATION_TIMING}`,
          '&:hover': {
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-2px)',
          }
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: softBeigeBg,
          color: darkGreenText,
          boxShadow: 'none',
          borderBottom: 'none', // Remove harsh borders
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 50, // Pill shaped inputs for search
          backgroundColor: '#ffffff',
          transition: `all ${ANIMATION_TIMING}`,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e5e7eb', // Soft border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
            boxShadow: '0 0 0 4px rgba(22, 58, 36, 0.1)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryGreen,
              borderWidth: '1px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: cardBeige,
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        },
        elevation1: {
          boxShadow: '0 4px 24px -4px rgba(0, 0, 0, 0.04)',
        }
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: `2px solid ${softBeigeBg}`,
        }
      }
    }
  },
});