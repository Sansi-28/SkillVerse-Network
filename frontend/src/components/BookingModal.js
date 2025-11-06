import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #4a4a4a',
  boxShadow: '4px 4px 0px 0px #4a4a4a',
  p: 4,
  textAlign: 'center'
};

const BookingModal = ({ open, handleClose, listing }) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendRequest = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        await bookingService.sendBookingRequest(listing.id);
        setSuccess('Your request has been sent to the teacher!');
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to send request.';
        setError(errorMessage);
        console.error(err);
    }
    setLoading(false);
  };

  const onModalClose = () => {
    handleClose();
    setTimeout(() => {
        setError('');
        setSuccess('');
    }, 300);
  };
  
  return (
    <Modal
      open={open}
      onClose={onModalClose}
      aria-labelledby="booking-confirmation-modal"
    >
      <Box sx={style}>
        {!success ? (
            <>
                <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                    Send Booking Request
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', mb: 1 }}>
                    You are about to request: <strong>{listing?.title}</strong>
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', mb: 3 }}>
                    The teacher will be notified and can accept or decline your request. Tokens will only be spent upon acceptance.
                </Typography>
                
                {error && <Typography color="error" sx={{ mb: 2, fontFamily: 'Inter' }}>{error}</Typography>}
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button onClick={onModalClose} sx={{fontSize: '1rem'}}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary"
                        disabled={loading}
                        onClick={handleSendRequest}
                        sx={{ fontSize: '1rem', px: 3 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send Request'}
                    </Button>
                </Box>
            </>
        ) : (
            <>
                <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                    Request Sent!
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', mb: 3 }}>
                    {success}
                </Typography>
                <Button onClick={onModalClose} variant="contained" color="primary" sx={{fontSize: '1rem'}}>
                    Close
                </Button>
            </>
        )}
      </Box>
    </Modal>
  );
};

export default BookingModal;