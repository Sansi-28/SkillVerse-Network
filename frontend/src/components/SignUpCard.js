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
    <Card component="form" onSubmit={handleSignUp} sx={{ width: 340, p: 1 }}>
      <CardContent>
        <Typography variant="h4" component="div" sx={{ textAlign: 'center', mb: 4 }}>
          Create Account
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
          <User size={32} style={{ marginRight: '12px', marginBottom: '4px' }}/>
          <TextField fullWidth variant="standard" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} required InputProps={{ disableUnderline: true }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 3 }}>
          <Mail size={32} style={{ marginRight: '12px', marginBottom: '4px' }}/>
          <TextField fullWidth type="email" variant="standard" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required InputProps={{ disableUnderline: true }} />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 4 }}>
          <KeyRound size={32} style={{ marginRight: '12px', marginBottom: '4px' }}/>
          <TextField fullWidth type="password" variant="standard" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required InputProps={{ disableUnderline: true }} />
        </Box>
        
        {error && (
            <Typography color="error" sx={{ textAlign: 'center', mb: 2, fontFamily: 'Inter', fontSize: '0.9rem' }}>
                {error}
            </Typography>
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ py: 1.5, fontSize: '1.3rem' }}>
          {loading ? <CircularProgress size={28} color="inherit" /> : 'Sign Up'}
        </Button>
        <Button onClick={onToggle} fullWidth sx={{ mt: 2, textTransform: 'none' }}>
            Already have an account? Sign In
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;