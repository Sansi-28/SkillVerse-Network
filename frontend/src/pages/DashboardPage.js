import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, Stack, Modal, TextField, Rating } from '@mui/material';
import bookingService from '../services/bookingService';
import reviewService from '../services/reviewService';
import RequestCard from '../components/RequestCard';
import { useAuth } from '../context/AuthContext';
import { Button } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const DashboardPage = () => {
  const [tab, setTab] = useState(0); // 0 for Received, 1 for Sent
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshUserProfile } = useAuth();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = tab === 0 
        ? await bookingService.getReceivedRequests()
        : await bookingService.getSentRequests();
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
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
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setCurrentBooking(null);
    setRating(0);
    setComment('');
  };

  const handleSubmitReview = async () => {
    try {
        await reviewService.createReview({
            bookingId: currentBooking.id,
            rating: rating,
            comment: comment
        });
        handleCloseReviewModal();
        alert("Review submitted successfully!");
    } catch(error) {
        alert(error.response?.data?.message || "Failed to submit review.");
    }
  };

  const { activeRequests, historicalRequests } = useMemo(() => {
      const active = requests.filter(r => r.status === 'PENDING' || r.status === 'CONFIRMED' || r.status === 'IN_DISPUTE');
      const historical = requests.filter(r => r.status !== 'PENDING' && r.status !== 'CONFIRMED' && r.status !== 'IN_DISPUTE');
      return { activeRequests: active, historicalRequests: historical };
  }, [requests]);

  return (
    <>
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4 }}>
        My Dashboard
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Received Requests" />
          <Tab label="Sent Requests" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{display: 'flex', justifyContent: 'center', mt: 4}}><CircularProgress /></Box>
      ) : (
        <>
          <Box sx={{ pt: 3, mb: 5 }}>
            <Typography variant="h5" sx={{mb: 2}}>Active</Typography>
            <Stack spacing={2}>
                {activeRequests.length > 0 ? activeRequests.map(booking => (
                    <RequestCard 
                        key={booking.id}
                        booking={booking}
                        type={tab === 0 ? 'received' : 'sent'}
                        onAccept={(id) => handleAction(bookingService.acceptBooking, id, 'Booking accepted', 'Failed to accept booking')}
                        onReject={(id) => handleAction(bookingService.rejectBooking, id, 'Booking rejected', 'Failed to reject booking')}
                        onComplete={(id) => handleAction(bookingService.completeBooking, id, 'Booking marked complete', 'Failed to complete booking')}
                        onDispute={(id) => handleAction(bookingService.openDispute, id, 'Dispute opened', 'Failed to open dispute')}
                        onReview={handleOpenReviewModal}
                    />
                )) : <Typography sx={{fontFamily: 'Inter'}}>No active requests.</Typography>}
            </Stack>
          </Box>
          <Box sx={{ pt: 3 }}>
            <Typography variant="h5" sx={{mb: 2}}>History</Typography>
            <Stack spacing={2}>
                {historicalRequests.length > 0 ? historicalRequests.map(booking => (
                    <RequestCard 
                        key={booking.id}
                        booking={booking}
                        type={tab === 0 ? 'received' : 'sent'}
                        onReview={handleOpenReviewModal}
                    />
                )) : <Typography sx={{fontFamily: 'Inter'}}>No historical requests.</Typography>}
            </Stack>
          </Box>
        </>
      )}
    </Container>
    <Modal open={reviewModalOpen} onClose={handleCloseReviewModal}>
        <Box sx={modalStyle}>
            <Typography variant="h6" component="h2">Leave a Review for {currentBooking?.listingTitle}</Typography>
            <Rating name="rating" value={rating} onChange={(e, newValue) => setRating(newValue)} sx={{my: 2}}/>
            <TextField label="Comment (optional)" multiline rows={4} fullWidth value={comment} onChange={(e) => setComment(e.target.value)} />
            <Box sx={{mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1}}>
                <Button onClick={handleCloseReviewModal}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmitReview} disabled={!rating}>Submit</Button>
            </Box>
        </Box>
    </Modal>
    </>
  );
};

export default DashboardPage;