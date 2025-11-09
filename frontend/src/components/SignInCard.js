import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, TextField, Button, CircularProgress } from '@mui/material';
import { User, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignInCard = ({ onToggle }) => { // <-- Add onToggle prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Card component="form" onSubmit={handleSignIn} sx={{ width: 340, p: 1 }}>
      <CardContent>
        <Typography variant="h4" component="div" sx={{ textAlign: 'center', mb: 4 }}>
          Sign In
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
          <User size={32} style={{ marginRight: '12px', marginBottom: '4px' }}/>
          <TextField 
            fullWidth
            variant="standard"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 4 }}>
          <KeyRound size={32} style={{ marginRight: '12px', marginBottom: '4px' }}/>
          <TextField 
            fullWidth
            type="password"
            variant="standard"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{ disableUnderline: true }}
          />
        </Box>
        
        {error && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Inter' }}>
                {error}
            </Typography>
        )}

        <Button 
          type="submit"
          variant="contained" 
          color="primary" 
          fullWidth
          disabled={loading}
          sx={{ py: 1.5, fontSize: '1.3rem' }}
        >
          {loading ? <CircularProgress size={28} color="inherit" /> : 'Sign In'}
        </Button>
        <Button onClick={onToggle} fullWidth sx={{ mt: 2, textTransform: 'none' }}>
            Don't have an account? Sign Up
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignInCard;