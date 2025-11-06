import { createTheme, alpha } from '@mui/material/styles';

// Define reusable style constants
const BORDER_STYLE = '2px solid #4a4a4a';
const SHADOW_COLOR = '#4a4a4a';
const ANIMATION_TIMING = '200ms cubic-bezier(0.4, 0, 0.2, 1)';
const HOVER_LIFT = 'translateY(-2px)';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#80b3c2', // Pastel Blue
      light: '#a5c8d4',
      dark: '#5c8f9e',
    },
    secondary: {
      main: '#4a4a4a', // Ink/Pencil color
    },
    background: {
      default: '#f6eee3', // Lined paper page background
      paper: '#FFFFFF', // Card background
      highlight: alpha('#80b3c2', 0.08), // Subtle highlight for hover states
    },
    text: {
      primary: '#4a4a4a',
      secondary: alpha('#4a4a4a', 0.7),
    },
    error: {
      main: '#e57373', // Soft Red
      light: '#ef9a9a',
    },
    success: {
      main: '#81c784', // Soft Green
      light: '#a5d6a7',
    }
  },
  typography: {
    fontFamily: '"Patrick Hand", "Comic Sans MS", "Chalkboard SE", cursive',
    body1: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.57,
    },
    h1: { 
      fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
      marginBottom: '0.5em',
    },
    h2: { 
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      marginBottom: '0.5em',
    },
    h3: { 
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      marginBottom: '0.5em',
    },
    h4: { fontSize: '2rem' },
    h5: { fontSize: '1.5rem' },
    h6: { fontSize: '1.25rem' },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: alpha('#80b3c2', 0.2),
        },
        '@media (max-width:600px)': {
          html: {
            fontSize: '14px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: BORDER_STYLE,
          borderRadius: 8,
          boxShadow: '4px 4px 0px 0px #4a4a4a',
          transition: `all ${ANIMATION_TIMING}`,
          '&:hover': {
            transform: HOVER_LIFT,
            boxShadow: '6px 6px 0px 0px #4a4a4a',
          },
          '@media (max-width:600px)': {
            boxShadow: '3px 3px 0px 0px #4a4a4a',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          border: BORDER_STYLE,
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1rem',
          padding: '0.5rem 1.25rem',
          boxShadow: '2px 2px 0px 0px #4a4a4a',
          transition: `all ${ANIMATION_TIMING}`,
          '&:hover': {
            boxShadow: '3px 3px 0px 0px #4a4a4a',
            transform: 'translate(-1px, -1px)',
          },
          '&:active': {
            boxShadow: '1px 1px 0px 0px #4a4a4a',
            transform: 'translate(1px, 1px)',
          },
          '&.Mui-disabled': {
            border: `2px solid ${alpha('#4a4a4a', 0.3)}`,
            boxShadow: 'none',
          },
          '@media (max-width:600px)': {
            fontSize: '0.875rem',
            padding: '0.4rem 1rem',
          },
        },
        containedPrimary: {
          backgroundColor: '#80b3c2',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#5c8f9e',
          },
        },
        outlined: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '1rem',
          backgroundColor: '#FFFFFF',
          transition: `all ${ANIMATION_TIMING}`,
          '& .MuiOutlinedInput-notchedOutline': {
            border: BORDER_STYLE,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a4a4a',
          },
          '&.Mui-focused': {
            boxShadow: '3px 3px 0px 0px #80b3c2',
            '& .MuiOutlinedInput-notchedOutline': {
              border: '2px solid #80b3c2',
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          '&.Mui-focused': {
            color: '#4a4a4a',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #4a4a4a',
          backgroundColor: alpha('#80b3c2', 0.1),
          '&:hover': {
            backgroundColor: alpha('#80b3c2', 0.2),
          },
          '&.MuiChip-outlined': {
            backgroundColor: 'transparent',
          },
        },
        label: {
          fontFamily: '"Inter", sans-serif',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid #4a4a4a',
          transition: `all ${ANIMATION_TIMING}`,
          '&:hover': {
            transform: HOVER_LIFT,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          position: 'relative',
          overflow: 'hidden',  // To contain the decorations
          '& > .paper-decorations': {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          },
          '& > *:not(.paper-decorations)': {
            position: 'relative',
            zIndex: 1
          }
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: '1rem',
          '&.Mui-selected': {
            color: '#80b3c2',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: BORDER_STYLE,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          padding: '0.5rem 2rem',
          '@media (min-width:600px)': {
            padding: '0.75rem 3rem',
          },
          minHeight: '64px',
          gap: '2rem',
        },
      },
    },
  },
});