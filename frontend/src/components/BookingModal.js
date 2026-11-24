import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import { ShieldCheck, Lock, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bookingService from '../services/bookingService';
import nftCoin from '../resources/nft.png';

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
      setSuccess('Your session request has been delivered to the teacher! You can track status on your Dashboard.');
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
    }, 250);
  };

  return (
    <Dialog
      open={open}
      onClose={onModalClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: { xs: 1.5, sm: 2 },
          boxShadow: '0 24px 64px -12px rgba(13, 30, 22, 0.2)',
          border: '1px solid rgba(13, 30, 22, 0.08)',
        },
      }}
    >
      {!success ? (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ShieldCheck size={18} color="#10b981" />
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.8rem', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Secure Escrow Booking
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontFamily: '"Outfit", sans-serif',
                fontWeight: 800,
                color: '#0d1e16',
                letterSpacing: '-0.02em',
              }}
            >
              Request Session with {listing?.teacherName}
            </Typography>
          </DialogTitle>

          <DialogContent>
            {/* Session summary box */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: '16px',
                backgroundColor: '#fbfbfa',
                border: '1px solid rgba(13, 30, 22, 0.06)',
                mb: 3,
              }}
            >
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#0d1e16', mb: 1 }}>
                {listing?.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid rgba(13, 30, 22, 0.06)' }}>
                <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                  Session Investment
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Box component="img" src={nftCoin} alt="Token" sx={{ width: 18, height: 18 }} />
                  <Typography sx={{ fontWeight: 800, color: '#92400e', fontSize: '0.95rem' }}>
                    {Number(listing?.tokenPrice || 0).toFixed(0)} Tokens
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Escrow explanation */}
            <Box
              sx={{
                p: 2,
                borderRadius: '14px',
                backgroundColor: '#eef5f1',
                border: '1px solid rgba(15, 56, 34, 0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Lock size={18} color="#0f3822" style={{ flexShrink: 0, marginTop: '2px' }} />
              <Typography sx={{ fontSize: '0.825rem', color: '#163a24', lineHeight: 1.55 }}>
                <strong>Zero immediate deduction:</strong> Tokens are only reserved when the mentor accepts, and released exclusively when you confirm session delivery.
              </Typography>
            </Box>

            {error && (
              <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onModalClose} sx={{ borderRadius: '50px', px: 2.5 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleSendRequest}
              sx={{
                borderRadius: '50px',
                px: 3.5,
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(15, 56, 34, 0.2)',
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Confirm & Send Request'}
            </Button>
          </DialogActions>
        </>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <CheckCircle2 size={30} color="#047857" />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              color: '#0d1e16',
              mb: 1,
            }}
          >
            Request Sent Successfully!
          </Typography>
          <Typography sx={{ fontSize: '0.925rem', color: 'text.secondary', mb: 3.5, maxWidth: 420, mx: 'auto' }}>
            {success}
          </Typography>
          <Button
            onClick={onModalClose}
            variant="contained"
            color="primary"
            sx={{ borderRadius: '50px', px: 4, fontWeight: 700 }}
          >
            Done
          </Button>
        </Box>
      )}
    </Dialog>
  );
};

export default BookingModal;
