import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, InputAdornment } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nftCoin from '../resources/nft.png';
import { Search, PlusCircle } from 'lucide-react';

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
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '2px solid #4a4a4a'
      }}
    >
      <Toolbar>
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2 
        }}>
          {/* Logo */}
          <Typography 
            variant="h4" 
            component={RouterLink} 
            to="/"
            sx={{ 
              color: 'text.primary', 
              textDecoration: 'none',
              flexShrink: 0,  // Prevent logo from shrinking
              mr: 2
            }}
          >
            SkillVerse-Network
          </Typography>

          {/* Search bar - grows to fill space */}
          <Box sx={{ 
            flexGrow: 1,  // Takes available space
            maxWidth: { xs: '200px', sm: '300px', md: '400px' },  // Responsive width
            display: 'flex',
            alignItems: 'center'
          }}>
            <TextField
              fullWidth
              size="small"
              variant="standard"
              placeholder="Search for skills or people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} style={{ color: '#4a4a4a' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-root': {
                  height: '40px',  // Match height with other elements
                }
              }}
            />
          </Box>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, ml: 'auto' }}>
            <Button 
              component={RouterLink} 
              to="/discover" 
              sx={{ 
                color: 'text.primary', 
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                display: { xs: 'none', sm: 'inline-flex' }  // Hide on mobile
              }}
            >
              Discover Skills
            </Button>

            {userProfile ? (
              <>
                {/* Create Listing Button */}
                <Button 
                  component={RouterLink} 
                  to="/create-listing" 
                  variant="contained" 
                  color="primary"
                  startIcon={<PlusCircle />}
                  sx={{
                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                  }}
                >
                  Create Listing
                </Button>

                {/* Token Balance */}
                <Box sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  border: '2px solid #4a4a4a', 
                  borderRadius: '10000px', 
                  px: 2, 
                  height: '40px',
                  flexShrink: 0  // Prevent shrinking
                }}>
                  <img
                    src={nftCoin}
                    alt="Token"
                    style={{ 
                      width: '24px', 
                      height: '24px',
                      marginRight: '8px',
                      display: 'block'
                    }}
                  />
                  <Typography sx={{ 
                    fontFamily: 'Inter', 
                    fontWeight: 500,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}>
                    {userProfile.tokenBalance.toFixed(2)}
                  </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Button 
                  component={RouterLink} 
                  to="/dashboard" 
                  sx={{
                    color: 'text.primary',
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                    display: { xs: 'none', md: 'inline-flex' }  // Hide on mobile
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  component={RouterLink} 
                  to="/profile" 
                  sx={{
                    color: 'text.primary',
                    fontSize: { xs: '0.9rem', sm: '1.1rem' }
                  }}
                >
                  My Profile
                </Button>
                <Button 
                  onClick={handleLogout} 
                  sx={{ 
                    color: 'white', 
                    backgroundColor: '#e97551b6',
                    fontSize: { xs: '0.9rem', sm: '1.1rem' },
                    '&:hover': {
                      backgroundColor: '#e97551b6',  
                    }
                  }}
                >
                  Log Out
                </Button>
              </>
            ) : (
              <Button 
                component={RouterLink} 
                to="/signin" 
                variant="contained" 
                color="primary"
                sx={{ fontSize: { xs: '0.9rem', sm: '1.1rem' } }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;