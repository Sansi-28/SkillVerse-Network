import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { LayoutDashboard, Inbox, Send, Sparkles, Star, Clock, CheckCircle } from 'lucide-react';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import RequestCard from '../components/RequestCard';
import { useAuth } from '../context/AuthContext';
import nftCoin from '../resources/nft.png';

const DashboardPage = () => {
  const [tab, setTab] = useState(0); // 0 for Received (Teaching), 1 for Sent (Learning)
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, refreshUserProfile } = useAuth();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response =
        tab === 0
          ? await bookingService.getReceivedRequests()
          : await bookingService.getSentRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAction = async (action, bookingId, successMessage, errorMessage) => {
    try {
      await action(bookingId);
      fetchRequests();
      if (successMessage.includes('complete')) {
        refreshUserProfile();
      }
    } catch (error) {
      alert(error.response?.data?.message || errorMessage);
    }
  };

  const handleOpenReviewModal = (booking) => {
    setCurrentBooking(booking);
    setRating(5);
    setComment('');
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setCurrentBooking(null);
    setRating(5);
    setComment('');
  };

  const handleSubmitReview = async () => {
    try {
      await reviewService.createReview({
        bookingId: currentBooking.id,
        rating: rating,
        comment: comment,
      });
      handleCloseReviewModal();
      alert('Review submitted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review.');
    }
  };

  const { activeRequests, historicalRequests } = useMemo(() => {
    const active = requests.filter(
      (r) => r.status === 'PENDING' || r.status === 'CONFIRMED' || r.status === 'IN_DISPUTE'
    );
    const historical = requests.filter(
      (r) => r.status !== 'PENDING' && r.status !== 'CONFIRMED' && r.status !== 'IN_DISPUTE'
    );
    return { activeRequests: active, historicalRequests: historical };
  }, [requests]);

  return (
    <Box sx={{ backgroundColor: '#fbfaf7', minHeight: '100vh', pb: 12 }}>
      {/* Minimal Header */}
      <Box
        sx={{
          pt: { xs: 6, md: 8 },
          pb: 4,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(10, 51, 28, 0.08)',
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
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
            Overview
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              fontWeight: 700,
              color: '#0a331c',
              mb: 3,
            }}
          >
            Dashboard
          </Typography>

          {/* Quick Metrics */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: '16px',
                  backgroundColor: '#fbfaf7',
                  border: '1px solid rgba(10, 51, 28, 0.08)',
                }}
              >
                <Typography sx={{ fontSize: '0.8rem', color: '#68776f' }}>
                  Active Sessions
                </Typography>
                <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: '1.6rem', fontWeight: 800, color: '#0a331c', mt: 0.5 }}>
                  {activeRequests.length}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: '16px',
                  backgroundColor: '#fbfaf7',
                  border: '1px solid rgba(10, 51, 28, 0.08)',
                }}
              >
                <Typography sx={{ fontSize: '0.8rem', color: '#68776f' }}>
                  Completed Sessions
                </Typography>
                <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: '1.6rem', fontWeight: 800, color: '#0a331c', mt: 0.5 }}>
                  {historicalRequests.length}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  borderRadius: '16px',
                  backgroundColor: '#fbfaf7',
                  border: '1px solid rgba(10, 51, 28, 0.08)',
                }}
              >
                <Typography sx={{ fontSize: '0.8rem', color: '#68776f' }}>
                  Token Balance
                </Typography>
                <Typography sx={{ fontFamily: '"Space Mono", monospace', fontSize: '1.6rem', fontWeight: 800, color: '#0a331c', mt: 0.5 }}>
                  {Number(userProfile?.tokenBalance || 0).toFixed(0)} Tokens
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Tabs Container */}
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: '1px solid rgba(13, 30, 22, 0.08)', mb: 4 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontSize: '1rem',
                fontWeight: 700,
                px: 3,
                py: 1.5,
              },
            }}
          >
            <Tab
              icon={<Inbox size={18} style={{ marginRight: '8px' }} />}
              iconPosition="start"
              label="Teaching Requests (Received)"
            />
            <Tab
              icon={<Send size={18} style={{ marginRight: '8px' }} />}
              iconPosition="start"
              label="Learning Requests (Sent)"
            />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Active Requests Section */}
            <Grid item xs={12} lg={7}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    color: '#0d1e16',
                  }}
                >
                  Active Sessions ({activeRequests.length})
                </Typography>
              </Box>

              <Stack spacing={2}>
                {activeRequests.length > 0 ? (
                  activeRequests.map((booking) => (
                    <RequestCard
                      key={booking.id}
                      booking={booking}
                      type={tab === 0 ? 'received' : 'sent'}
                      onAccept={(id) =>
                        handleAction(bookingService.acceptBooking, id, 'Booking accepted', 'Failed to accept booking')
                      }
                      onReject={(id) =>
                        handleAction(bookingService.rejectBooking, id, 'Booking rejected', 'Failed to reject booking')
                      }
                      onComplete={(id) =>
                        handleAction(bookingService.completeBooking, id, 'Booking marked complete', 'Failed to complete booking')
                      }
                      onDispute={(id) =>
                        handleAction(bookingService.openDispute, id, 'Dispute opened', 'Failed to open dispute')
                      }
                      onReview={handleOpenReviewModal}
                    />
                  ))
                ) : (
                  <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '20px', border: '1px solid rgba(13, 30, 22, 0.06)' }}>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      No active requests currently in this view.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Grid>

            {/* Historical Requests Section */}
            <Grid item xs={12} lg={5}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    color: '#0d1e16',
                  }}
                >
                  History ({historicalRequests.length})
                </Typography>
              </Box>

              <Stack spacing={2}>
                {historicalRequests.length > 0 ? (
                  historicalRequests.map((booking) => (
                    <RequestCard
                      key={booking.id}
                      booking={booking}
                      type={tab === 0 ? 'received' : 'sent'}
                      onReview={handleOpenReviewModal}
                    />
                  ))
                ) : (
                  <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '20px', border: '1px solid rgba(13, 30, 22, 0.06)' }}>
                    <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      No past requests in record.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Modern Review Dialog */}
      <Dialog
        open={reviewModalOpen}
        onClose={handleCloseReviewModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1.3rem', pb: 1 }}>
          Leave a Review for {currentBooking?.listingTitle}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', mb: 2.5 }}>
            Your rating and feedback help maintain trust and quality across the peer network.
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>Rating:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
            />
          </Box>

          <TextField
            label="Comments / Feedback (Optional)"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Share how the session went, what you learned, and how helpful the mentor was..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseReviewModal} sx={{ borderRadius: '50px' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitReview}
            disabled={!rating}
            sx={{ borderRadius: '50px', px: 3, fontWeight: 700 }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
