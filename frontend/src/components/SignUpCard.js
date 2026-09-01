import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import { User, Mail, KeyRound } from 'lucide-react';
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
    console.log('handleSignUp: Firing'); // <-- DIAGNOSTIC LOG 1

    setError('');
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        console.log('handleSignUp: Bailed out due to password length.'); // <-- DIAGNOSTIC LOG
        return;
    }
    setLoading(true);
    try {
      console.log('handleSignUp: Calling signup from context...'); // <-- DIAGNOSTIC LOG 2
      await signup(name, email, password);
      console.log('handleSignUp: Signup call finished.'); // <-- DIAGNOSTIC LOG
      navigate('/');
    } catch (err) {
      console.error('handleSignUp: Error during signup:', err); // <-- DIAGNOSTIC LOG
      setError(err.response?.data?.message || 'Failed to sign up. The email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
      <Box
        component="form"
        onSubmit={handleSignUp}
        sx={{
          width: { xs: '90vw', sm: 420 },
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          p: 5,
          boxShadow: '0 16px 64px rgba(0,0,0,0.07)',
          border: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo mark */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: '14px', backgroundColor: '#163a24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="#ffffff" />
          </Box>
        </Box>

        <Typography variant="h5" sx={{ textAlign: 'center', fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a3626', mb: 0.5 }}>
          Create your account
        </Typography>
        <Typography sx={{ textAlign: 'center', fontFamily: 'Inter', color: '#6b7280', fontSize: '0.9rem', mb: 4 }}>
          Join the SkillVerse community today
        </Typography>

        <TextField fullWidth variant="outlined" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required sx={{ mb: 2 }} />
        <TextField fullWidth variant="outlined" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ mb: 2 }} />
        <TextField fullWidth variant="outlined" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required sx={{ mb: 3 }} />

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Inter', fontSize: '0.85rem' }}>
            {error}
          </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
        </Button>

        <Button onClick={onToggle} fullWidth sx={{ mt: 2, color: '#4b5563', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Box component="span" sx={{ color: '#163a24', fontWeight: 700, ml: 0.5 }}>Sign In</Box>
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpCard;