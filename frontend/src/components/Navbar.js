import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment, Container } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nftCoin from '../resources/nft.png';
import { Search, PlusCircle, Leaf } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '72px !important', py: 0.5 }}>
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', flexShrink: 0 }}
            >
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px',
                backgroundColor: 'primary.main',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Leaf size={20} color="#ffffff" />
              </Box>
              <Typography
                variant="h6"
                sx={{ color: 'primary.main', fontFamily: '"Outfit", sans-serif', fontWeight: 700, display: { xs: 'none', sm: 'block' } }}
              >
                SkillVerse
              </Typography>
            </Box>

            {/* Centered Search bar */}
            <Box sx={{ flexGrow: 1, maxWidth: { xs: '180px', sm: '280px', md: '420px' }, mx: 'auto' }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search for skills or people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} style={{ color: '#9ca3af' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Navigation Items */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', flexShrink: 0 }}>
              <Button
                component={RouterLink}
                to="/discover"
                sx={{ color: 'text.primary', fontWeight: 600, display: { xs: 'none', md: 'inline-flex' }, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
              >
                Discover
              </Button>

              {userProfile ? (
                <>
                  <Button
                    component={RouterLink}
                    to="/create-listing"
                    sx={{ color: 'text.secondary', display: { xs: 'none', lg: 'inline-flex' }, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
                  >
                    <PlusCircle size={16} style={{ marginRight: '4px' }} /> Create
                  </Button>

                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center',
                    backgroundColor: '#f1f4ec', borderRadius: '50px', px: 1.5, py: 0.5,
                  }}>
                    <img src={nftCoin} alt="Token" style={{ width: '18px', height: '18px', marginRight: '5px' }} />
                    <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '0.85rem', color: 'primary.main' }}>
                      {userProfile.tokenBalance.toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    sx={{ color: 'text.secondary', display: { xs: 'none', md: 'inline-flex' }, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/inbox"
                    sx={{ color: 'text.secondary', display: { xs: 'none', md: 'inline-flex' }, '&:hover': { backgroundColor: 'transparent', color: 'primary.main' } }}
                  >
                    Inbox
                  </Button>
                  <NotificationBell />
                  <Button
                    component={RouterLink}
                    to="/profile"
                    variant="contained"
                    color="primary"
                  >
                    My Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    sx={{ color: 'text.secondary', fontSize: '0.85rem', '&:hover': { backgroundColor: 'transparent', color: 'error.main' } }}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <Button component={RouterLink} to="/signin" variant="contained" color="primary">
                  Sign In
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;