import React from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#faf8f5',
        borderTop: '1px solid rgba(10, 51, 28, 0.08)',
        py: { xs: 5, md: 6 },
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 3,
            pb: 4,
            borderBottom: '1px solid rgba(10, 51, 28, 0.06)',
          }}
        >
          <Box>
            <Typography
              component={RouterLink}
              to="/"
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
                color: '#0a331c',
                textDecoration: 'none',
                display: 'block',
                mb: 0.5,
              }}
            >
              SKILLVERSE
            </Typography>
            <Typography sx={{ fontSize: '0.825rem', color: '#68776f' }}>
              Peer-to-peer knowledge exchange powered by token escrow.
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
            <Typography
              component={RouterLink}
              to="/discover"
              sx={{
                fontSize: '0.85rem',
                color: '#0a331c',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { opacity: 0.7 },
              }}
            >
              Explore
            </Typography>
            <Typography
              component={RouterLink}
              to="/create-listing"
              sx={{
                fontSize: '0.85rem',
                color: '#0a331c',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { opacity: 0.7 },
              }}
            >
              Teach
            </Typography>
            <Typography
              component={RouterLink}
              to="/dashboard"
              sx={{
                fontSize: '0.85rem',
                color: '#0a331c',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { opacity: 0.7 },
              }}
            >
              Dashboard
            </Typography>
            <Typography
              component={RouterLink}
              to="/inbox"
              sx={{
                fontSize: '0.85rem',
                color: '#0a331c',
                textDecoration: 'none',
                fontWeight: 600,
                '&:hover': { opacity: 0.7 },
              }}
            >
              Inbox
            </Typography>
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            pt: 3,
          }}
        >
          <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: '0.72rem', color: '#85958c' }}>
            © {new Date().getFullYear()} SkillVerse. All rights reserved.
          </Typography>

          <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: '0.72rem', color: '#85958c' }}>
            Internal Currency Escrow System
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
