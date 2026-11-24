import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Stack,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import listingService from '../services/listingService';
import SkillCard from '../components/SkillCard';

const DISCIPLINES = [
  { name: 'Acoustics & Sound', photo: '/photos/m138547195-1200.webp' },
  { name: 'Ceramics & Form', photo: '/photos/m138226685-1200.webp' },
  { name: 'Culinary Fermentation', photo: '/photos/m37164269-1200.webp' },
  { name: 'Mechanical & Frames', photo: '/photos/m11317510-1200.webp' },
];

const HomePage = () => {
  const { data: listingsResponse, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: listingService.getAllListings,
  });

  const listings = listingsResponse?.data || listingService.DEFAULT_CRAFT_LISTINGS;
  const displayListings = listings.slice(0, 6);

  return (
    <Box sx={{ backgroundColor: '#fbfaf7', minHeight: '100vh', pb: 12 }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 14 }, pb: { xs: 8, md: 12 } }}>
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box>
              <Typography
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#0a331c',
                  mb: 2.5,
                  display: 'inline-block',
                }}
              >
                P2P Skill Exchange
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 800,
                  fontSize: { xs: '2.75rem', sm: '3.6rem', md: '4.2rem' },
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: '#0a331c',
                  mb: 3,
                }}
              >
                Learn any craft. <br />
                <em>Teach your own.</em>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '1rem', md: '1.15rem' },
                  color: '#55655c',
                  lineHeight: 1.6,
                  maxWidth: 480,
                  mb: 4.5,
                }}
              >
                A decentralized marketplace where skills are traded directly through escrow tokens. Zero tuition, zero cash.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={RouterLink}
                  to="/discover"
                  variant="contained"
                  sx={{
                    backgroundColor: '#0a331c',
                    color: '#ffffff',
                    borderRadius: '50px',
                    px: 3.5,
                    py: 1.2,
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { backgroundColor: '#144627', boxShadow: 'none' },
                  }}
                >
                  Explore Sessions
                </Button>
                <Button
                  component={RouterLink}
                  to="/create-listing"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(10, 51, 28, 0.25)',
                    color: '#0a331c',
                    borderRadius: '50px',
                    px: 3.5,
                    py: 1.2,
                    fontSize: '0.925rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(10, 51, 28, 0.04)',
                      borderColor: '#0a331c',
                    },
                  }}
                >
                  Share a Skill
                </Button>
              </Stack>
            </Box>
          </Grid>

          {/* Hero Visual Plate */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                backgroundColor: '#f0ece3',
                border: '1px solid rgba(10, 51, 28, 0.1)',
                boxShadow: '0 24px 60px -16px rgba(10, 51, 28, 0.12)',
              }}
            >
              <Box
                component="img"
                src="/photos/m138547195-1200.webp"
                alt="Luthier Craft"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  px: 1.5,
                  py: 0.6,
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '0.72rem',
                    color: '#0a331c',
                    fontWeight: 700,
                  }}
                >
                  Acoustic Luthier Atelier · Silas Vance
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* 3 Pillars of Skillverse */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            pt: 6,
            borderTop: '1px solid rgba(10, 51, 28, 0.08)',
          }}
        >
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.8rem',
                  color: '#84968b',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                01 / TEACH
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#0a331c',
                  mb: 1,
                }}
              >
                Impart Your Discipline
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#5b6b61', lineHeight: 1.6 }}>
                Offer one-on-one sessions, workshops, or reviews. Choose your hourly token valuation.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.8rem',
                  color: '#84968b',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                02 / ESCROW
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#0a331c',
                  mb: 1,
                }}
              >
                Protected Exchange
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#5b6b61', lineHeight: 1.6 }}>
                Tokens are held securely upon booking and released only when both parties confirm completion.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                sx={{
                  fontFamily: '"Space Mono", monospace',
                  fontSize: '0.8rem',
                  color: '#84968b',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              >
                03 / REINVEST
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: '#0a331c',
                  mb: 1,
                }}
              >
                Learn from Peers
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', color: '#5b6b61', lineHeight: 1.6 }}>
                Spend earned tokens to learn any craft from other masters on the network.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Curated Sessions */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            mb: 5,
            borderBottom: '1px solid rgba(10, 51, 28, 0.08)',
            pb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.72rem',
                color: '#84968b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: 0.5,
              }}
            >
              Curated Directory
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: '1.75rem', md: '2.2rem' },
                color: '#0a331c',
              }}
            >
              Featured Sessions
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/discover"
            endIcon={<ArrowRight size={16} />}
            sx={{
              color: '#0a331c',
              fontWeight: 600,
              fontSize: '0.875rem',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'transparent', opacity: 0.7 },
            }}
          >
            View all
          </Button>
        </Box>

        <Grid container spacing={3.5}>
          {displayListings.map((listing) => (
            <Grid key={listing.id} item xs={12} sm={6} md={4}>
              <SkillCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Minimal Disciplines Gallery */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.72rem',
              color: '#84968b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              mb: 0.5,
            }}
          >
            Disciplines
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '1.9rem' },
              color: '#0a331c',
            }}
          >
            Explore by Craft
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {DISCIPLINES.map((d, i) => (
            <Grid key={i} item xs={6} sm={3}>
              <Box
                component={RouterLink}
                to="/discover"
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#f1efe9',
                  border: '1px solid rgba(10, 51, 28, 0.08)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    '& img': { transform: 'scale(1.04)' },
                  },
                }}
              >
                <Box
                  component="img"
                  src={d.photo}
                  alt={d.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(10,51,28,0.75) 100%)',
                  }}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    right: 12,
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {d.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Minimal Call to Action */}
      <Container maxWidth="md" sx={{ pt: { xs: 8, md: 10 } }}>
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 5, md: 7 },
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            border: '1px solid rgba(10, 51, 28, 0.08)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: { xs: '1.75rem', md: '2.2rem' },
              color: '#0a331c',
              mb: 1.5,
            }}
          >
            Have a craft to share?
          </Typography>
          <Typography
            sx={{
              color: '#55655c',
              fontSize: '0.95rem',
              maxWidth: 420,
              mx: 'auto',
              mb: 3.5,
              lineHeight: 1.6,
            }}
          >
            Create your listing in under two minutes. Start earning tokens to learn anything from peers worldwide.
          </Typography>
          <Button
            component={RouterLink}
            to="/create-listing"
            variant="contained"
            sx={{
              backgroundColor: '#0a331c',
              color: '#ffffff',
              borderRadius: '50px',
              px: 4,
              py: 1.2,
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#144627', boxShadow: 'none' },
            }}
          >
            Start Teaching
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
