import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, Stack } from '@mui/material';
import bookingService from '../services/bookingService';
import RequestCard from '../components/RequestCard';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [tab, setTab] = useState(0); // 0 for Received, 1 for Sent
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshUserProfile } = useAuth();

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
  
  // --- HANDLER FUNCTIONS ---
  const handleAccept = async (bookingId) => {
    try {
      await bookingService.acceptBooking(bookingId);
      // No balance refresh here, money is in escrow.
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept booking.');
    }
  };
  
  const handleReject = async (bookingId) => {
     try {
      await bookingService.rejectBooking(bookingId);
      fetchRequests();
    } catch (error) {
      console.error("Failed to reject booking", error);
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await bookingService.completeBooking(bookingId);
      refreshUserProfile(); // Refresh balance NOW because funds are released to teacher.
      fetchRequests();
    } catch (error) {
      console.error("Failed to complete booking", error);
    }
  };

  // --- FILTERING LOGIC FOR TABS ---
  const { activeRequests, historicalRequests } = useMemo(() => {
      const active = requests.filter(r => r.status === 'PENDING' || r.status === 'CONFIRMED');
      const historical = requests.filter(r => r.status !== 'PENDING' && r.status !== 'CONFIRMED');
      return { activeRequests: active, historicalRequests: historical };
  }, [requests]);

  return (
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
            <Typography variant="h5" sx={{mb: 2}}>Active Requests</Typography>
            <Stack spacing={2}>
                {activeRequests.length > 0 ? activeRequests.map(booking => (
                    <RequestCard 
                        key={booking.id}
                        booking={booking}
                        type={tab === 0 ? 'received' : 'sent'}
                        onAccept={handleAccept}
                        onReject={handleReject}
                        onComplete={handleComplete}
                    />
                )) : <Typography sx={{fontFamily: 'Inter'}}>No active requests found.</Typography>}
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
                    />
                )) : <Typography sx={{fontFamily: 'Inter'}}>No historical requests found.</Typography>}
            </Stack>
          </Box>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;