import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Avatar,
  Paper,
  Grid,
  Stack,
} from '@mui/material';
import {
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import listingService from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import ComposeMessageDialog from '../components/ComposeMessageDialog';
import nftCoin from '../resources/nft.png';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [composeOpen, setComposeOpen] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await listingService.getListingById(id);
        setListing(response.data);
      } catch (err) {
        setError('Could not find this skill listing.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={36} thickness={4} />
      </Box>
    );
  }

  if (error || !listing) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error || 'Listing not found.'}
        </Typography>
        <Button component={RouterLink} to="/discover" startIcon={<ArrowLeft size={16} />}>
          Back to Sessions
        </Button>
      </Container>
    );
  }

  const isOwnListing = userProfile && listing && userProfile.id === listing.teacherId;
  const presetRecipient = {
    id: listing.teacherId,
    name: listing.teacherName,
    avatarUrl: listing.teacherAvatarUrl,
  };

  const photo = listing.photoUrl || '/photos/m138547195-1200.webp';
  const guild = listing.guild || 'Craft';

  return (
    <Box sx={{ backgroundColor: '#fbfaf7', minHeight: '100vh', pb: 12 }}>
      {/* Back button */}
      <Container maxWidth="lg" sx={{ pt: 4, pb: 2 }}>
        <Button
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/discover')}
          sx={{
            color: '#55655c',
            fontWeight: 600,
            fontSize: '0.85rem',
            textTransform: 'none',
            '&:hover': { color: '#0a331c', backgroundColor: 'transparent' },
          }}
        >
          Back to Sessions
        </Button>
      </Container>

      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Left Column: Image & Details */}
          <Grid item xs={12} md={7.5}>
            {/* Main Visual */}
            <Box
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                aspectRatio: '16 / 10',
                backgroundColor: '#f1efe9',
                border: '1px solid rgba(10, 51, 28, 0.08)',
                mb: 4,
              }}
            >
              <Box
                component="img"
                src={photo}
                alt={listing.title}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.75rem',
                color: '#84968b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: 1,
              }}
            >
              {guild}
            </Typography>

            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: '2rem', sm: '2.6rem' },
                color: '#0a331c',
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              {listing.title}
            </Typography>

            {/* Mentor Bar */}
            <Box
              component={RouterLink}
              to={`/profile/${listing.teacherId}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                p: 1.2,
                pr: 2.5,
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(10, 51, 28, 0.08)',
                mb: 4,
                '&:hover': { borderColor: '#0a331c' },
              }}
            >
              <Avatar
                src={listing.teacherAvatarUrl}
                alt={listing.teacherName}
                sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.85rem' }}
              >
                {listing.teacherName?.charAt(0) || 'M'}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#0a331c', lineHeight: 1.2 }}>
                  {listing.teacherName}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#798a81' }}>
                  Mentor
                </Typography>
              </Box>
            </Box>

            {/* Description */}
            <Typography
              sx={{
                fontSize: '1.05rem',
                color: '#3d4d44',
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 620,
              }}
            >
              {listing.description}
            </Typography>
          </Grid>

          {/* Right Column: Sticky Booking Ticket */}
          <Grid item xs={12} md={4.5}>
            <Box sx={{ position: 'sticky', top: 96 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3.5, sm: 4 },
                  borderRadius: '20px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(10, 51, 28, 0.1)',
                }}
              >
                {/* Price */}
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Space Mono", monospace',
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: '#0a331c',
                      lineHeight: 1,
                    }}
                  >
                    {Number(listing.tokenPrice || 0).toFixed(0)}
                  </Typography>
                  <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: '0.9rem', color: '#68776f' }}>
                    TOKENS
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: '0.8rem', color: '#798a81', mb: 3 }}>
                  Internal token currency · Zero cash required
                </Typography>

                {/* Session specs */}
                <Stack spacing={1.5} sx={{ mb: 3, pt: 2, borderTop: '1px solid rgba(10, 51, 28, 0.08)' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#68776f' }}>Duration</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a331c' }}>
                      {listing.durationMinutes ? `${listing.durationMinutes} minutes` : '60 minutes'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#68776f' }}>Format</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0a331c' }}>
                      {listing.format || '1:1 Session'}
                    </Typography>
                  </Box>
                </Stack>

                {/* Primary CTA */}
                {isOwnListing ? (
                  <Button
                    fullWidth
                    disabled
                    variant="outlined"
                    sx={{ borderRadius: '50px', py: 1.2, mb: 1.5 }}
                  >
                    Your Listing
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleOpenModal}
                    sx={{
                      backgroundColor: '#0a331c',
                      color: '#ffffff',
                      borderRadius: '50px',
                      py: 1.2,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      mb: 1.5,
                      '&:hover': { backgroundColor: '#144627', boxShadow: 'none' },
                    }}
                  >
                    Request Session
                  </Button>
                )}

                {/* Message Mentor */}
                {!isOwnListing && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setComposeOpen(true)}
                    startIcon={<MessageSquare size={16} />}
                    sx={{
                      borderRadius: '50px',
                      py: 1,
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      borderColor: 'rgba(10, 51, 28, 0.2)',
                      color: '#0a331c',
                      textTransform: 'none',
                      mb: 3,
                      '&:hover': { borderColor: '#0a331c', backgroundColor: 'transparent' },
                    }}
                  >
                    Message Mentor
                  </Button>
                )}

                {/* Subtle Escrow Notice */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldCheck size={16} color="#0a331c" />
                  <Typography sx={{ fontSize: '0.75rem', color: '#68776f' }}>
                    Tokens held in escrow until session delivery.
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Booking and Messaging Modals */}
      <BookingModal open={modalOpen} handleClose={handleCloseModal} listing={listing} />
      <ComposeMessageDialog
        open={composeOpen}
        handleClose={() => setComposeOpen(false)}
        presetRecipient={presetRecipient}
        presetListing={listing}
      />
    </Box>
  );
};

export default ListingDetailPage;
