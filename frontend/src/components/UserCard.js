import React from 'react';
import { Paper, Typography, Box, Avatar, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { getFullMediaUrl } from '../services/api';

const UserCard = ({ user }) => {
  if (!user) return null;

  const avatarUrl = getFullMediaUrl(user.avatarUrl);

  return (
    <Paper
      component={RouterLink}
      to={`/profile/${user.id}`}
      sx={{
        p: 2.5,
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(13, 30, 22, 0.08)',
        boxShadow: '0 2px 8px -2px rgba(13, 30, 22, 0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'rgba(15, 56, 34, 0.2)',
          boxShadow: '0 12px 32px -8px rgba(13, 30, 22, 0.08)',
          '& .user-arrow': {
            transform: 'translateX(3px)',
            color: 'primary.main',
          },
        },
      }}
    >
      <Avatar
        src={avatarUrl}
        alt={user.name}
        sx={{
          width: 50,
          height: 50,
          bgcolor: 'primary.main',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '1.1rem',
          flexShrink: 0,
        }}
      >
        {user.name?.charAt(0) || 'U'}
      </Avatar>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#0d1e16',
              lineHeight: 1.2,
            }}
          >
            {user.name}
          </Typography>
          <ShieldCheck size={14} color="#10b981" />
        </Box>

        <Typography
          sx={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: '0.825rem',
            color: 'text.secondary',
            mt: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {user.bio || 'SkillVerse Community Member'}
        </Typography>
      </Box>

      <ArrowRight
        size={18}
        className="user-arrow"
        style={{ color: '#73847b', flexShrink: 0, transition: 'all 0.2s ease' }}
      />
    </Paper>
  );
};

export default UserCard;
