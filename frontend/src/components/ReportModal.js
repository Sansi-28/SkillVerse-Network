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
  TextField,
} from '@mui/material';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import reportService from '../services/reportService';

const ReportModal = ({ open, handleClose, reportedUser }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitReport = async () => {
    if (reason.trim().length < 10) {
      setError('Please provide a reason with at least 10 characters.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await reportService.submitReport(reportedUser.id, reason);
      setSuccess('Thank you. Your report has been submitted for platform review.');
    } catch (err) {
      setError('Failed to submit report. Please try again.');
      console.error(err);
    }
    setLoading(false);
  };

  const onModalClose = () => {
    handleClose();
    setTimeout(() => {
      setError('');
      setSuccess('');
      setReason('');
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
              <AlertTriangle size={18} color="#ef4444" />
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.8rem', color: 'error.main', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Trust & Safety
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
              Report User: {reportedUser?.name}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', mb: 2.5 }}>
              Please describe why you are reporting this account (e.g., inappropriate behavior, misleading listings, or spam).
            </Typography>

            <TextField
              label="Reason for Report"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Provide specific details so our moderation team can take appropriate action..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              helperText="Minimum 10 characters required."
            />

            {error && (
              <Box sx={{ mt: 2, p: 1.5, borderRadius: '12px', bgcolor: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
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
              color="error"
              disabled={loading || reason.trim().length < 10}
              onClick={handleSubmitReport}
              sx={{
                borderRadius: '50px',
                px: 3.5,
                fontWeight: 700,
              }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Submit Report'}
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
            Report Submitted
          </Typography>
          <Typography sx={{ fontSize: '0.925rem', color: 'text.secondary', mb: 3.5 }}>
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

export default ReportModal;
