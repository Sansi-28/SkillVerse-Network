import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Sparkles, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignUpCard = ({ onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err.response?.data?.message || 'Failed to sign up. The email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 8 },
        px: 2,
        background: 'linear-gradient(180deg, rgba(238, 245, 241, 0.4) 0%, #fbfbfa 100%)',
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSignUp}
        sx={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          p: { xs: 3.5, sm: 5 },
          boxShadow: '0 20px 48px -12px rgba(13, 30, 22, 0.1)',
          border: '1px solid rgba(13, 30, 22, 0.08)',
        }}
      >
        {/* Brand mark */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0f3822 0%, #175a37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(15, 56, 34, 0.25)',
            }}
          >
            <Sparkles size={24} color="#ffffff" />
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            fontSize: '1.8rem',
            color: '#0d1e16',
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          Create Your Account
        </Typography>

        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.9rem',
            mb: 4,
          }}
        >
          Join SkillVerse and receive starting tokens to explore mentorship
        </Typography>

        {error && (
          <Box
            sx={{
              mb: 3,
              p: 1.5,
              borderRadius: '12px',
              bgcolor: '#fee2e2',
              color: '#b91c1c',
              fontSize: '0.85rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {error}
          </Box>
        )}

        <TextField
          fullWidth
          variant="outlined"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2.5 }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2.5 }}
        />

        <TextField
          fullWidth
          variant="outlined"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          helperText="Must be at least 6 characters"
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          size="large"
          sx={{
            py: 1.4,
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: '50px',
            boxShadow: '0 4px 14px rgba(15, 56, 34, 0.2)',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Free Account'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Button
              onClick={onToggle}
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                fontSize: '0.875rem',
                p: 0,
                minWidth: 'auto',
                '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
              }}
            >
              Sign In
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default SignUpCard;
