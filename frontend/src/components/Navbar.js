import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import nftCoin from '../resources/nft.png';
import {
  Compass,
  LayoutDashboard,
  MessageSquare,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Plus,
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { getFullMediaUrl } from '../services/api';

const Navbar = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(251, 250, 247, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(10, 51, 28, 0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                color: '#0a331c',
              }}
            >
              SKILLVERSE
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography
              component={RouterLink}
              to="/discover"
              sx={{
                fontSize: '0.875rem',
                fontWeight: isActive('/discover') ? 700 : 500,
                color: isActive('/discover') ? '#0a331c' : '#4f6055',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
                '&:hover': { color: '#0a331c' },
              }}
            >
              Explore
            </Typography>

            {userProfile && (
              <>
                <Typography
                  component={RouterLink}
                  to="/create-listing"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isActive('/create-listing') ? 700 : 500,
                    color: isActive('/create-listing') ? '#0a331c' : '#4f6055',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#0a331c' },
                  }}
                >
                  Teach
                </Typography>

                <Typography
                  component={RouterLink}
                  to="/inbox"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isActive('/inbox') ? 700 : 500,
                    color: isActive('/inbox') ? '#0a331c' : '#4f6055',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#0a331c' },
                  }}
                >
                  Inbox
                </Typography>

                <Typography
                  component={RouterLink}
                  to="/dashboard"
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: isActive('/dashboard') ? 700 : 500,
                    color: isActive('/dashboard') ? '#0a331c' : '#4f6055',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    '&:hover': { color: '#0a331c' },
                  }}
                >
                  Dashboard
                </Typography>
              </>
            )}
          </Box>

          {/* Right Action / Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {userProfile ? (
              <>
                {/* Minimal Token Pill */}
                <Box
                  component={RouterLink}
                  to="/dashboard"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.8,
                    px: 1.2,
                    py: 0.4,
                    borderRadius: '50px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(10, 51, 28, 0.12)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: '#0a331c' },
                  }}
                >
                  <Box component="img" src={nftCoin} alt="Token" sx={{ width: 14, height: 14 }} />
                  <Typography
                    sx={{
                      fontFamily: '"Space Mono", monospace',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#0a331c',
                    }}
                  >
                    {Number(userProfile.tokenBalance || 0).toFixed(0)}
                  </Typography>
                </Box>

                <NotificationBell />

                {/* Avatar menu */}
                <IconButton onClick={handleMenuOpen} sx={{ p: 0.3 }}>
                  <Avatar
                    src={getFullMediaUrl(userProfile.avatarUrl)}
                    alt={userProfile.name}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      bgcolor: '#0a331c',
                    }}
                  >
                    {userProfile.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/signin"
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: '#0a331c',
                  color: '#ffffff',
                  borderRadius: '50px',
                  px: 2.2,
                  py: 0.6,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': { backgroundColor: '#16482a', boxShadow: 'none' },
                }}
              >
                Sign In
              </Button>
            )}

            {/* Mobile menu trigger */}
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#0a331c' }}
            >
              <MenuIcon size={20} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* User Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            borderRadius: '16px',
            minWidth: 180,
            border: '1px solid rgba(10, 51, 28, 0.1)',
            boxShadow: '0 12px 32px -8px rgba(10, 51, 28, 0.1)',
            p: 0.5,
          },
        }}
      >
        <MenuItem
          component={RouterLink}
          to="/profile"
          onClick={handleMenuClose}
          sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          <ListItemIcon sx={{ minWidth: 30 }}><User size={16} /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem
          component={RouterLink}
          to="/dashboard"
          onClick={handleMenuClose}
          sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
        >
          <ListItemIcon sx={{ minWidth: 30 }}><LayoutDashboard size={16} /></ListItemIcon>
          Dashboard
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={handleLogout}
          sx={{ borderRadius: '8px', fontSize: '0.875rem', color: '#c02626' }}
        >
          <ListItemIcon sx={{ minWidth: 30, color: '#c02626' }}><LogOut size={16} /></ListItemIcon>
          Sign Out
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, p: 2.5, backgroundColor: '#fbfaf7' } }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, color: '#0a331c' }}>
            SKILLVERSE
          </Typography>
          <IconButton onClick={() => setMobileDrawerOpen(false)}><X size={18} /></IconButton>
        </Box>
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/discover"
              onClick={() => setMobileDrawerOpen(false)}
              sx={{ borderRadius: '8px', fontWeight: 600, color: '#0a331c' }}
            >
              Explore
            </ListItemButton>
          </ListItem>
          {userProfile && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/create-listing"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: '8px', fontWeight: 600, color: '#0a331c' }}
                >
                  Teach a Skill
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/inbox"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: '8px', fontWeight: 600, color: '#0a331c' }}
                >
                  Inbox
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to="/dashboard"
                  onClick={() => setMobileDrawerOpen(false)}
                  sx={{ borderRadius: '8px', fontWeight: 600, color: '#0a331c' }}
                >
                  Dashboard
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
