import React, { useState } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, TextField } from '@mui/material';
import reportService from '../services/reportService';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #4a4a4a',
  boxShadow: '4px 4px 0px 0px #4a4a4a',
  p: 4,
};

const ReportModal = ({ open, handleClose, reportedUser }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitReport = async () => {
    if (reason.length < 10) {
        setError('Please provide a reason with at least 10 characters.');
        return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        await reportService.submitReport(reportedUser.id, reason);
        setSuccess('Thank you. Your report has been submitted for review.');
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
    }, 300);
  };
  
  return (
    <Modal open={open} onClose={onModalClose}>
      <Box sx={style}>
        {success ? (
            <>
                <Typography variant="h4" component="h2" sx={{ mb: 2, color: 'primary.main' }}>
                    Report Submitted
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', mb: 3 }}>
                    {success}
                </Typography>
                <Button onClick={onModalClose} variant="contained" color="primary" sx={{fontSize: '1rem'}}>
                    Close
                </Button>
            </>
        ) : (
            <>
                <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
                    Report {reportedUser?.name}
                </Typography>
                <Typography sx={{ fontFamily: 'Inter', mb: 3, color: 'text.secondary' }}>
                    Please provide a detailed reason for your report. This will be reviewed by our moderation team.
                </Typography>
                
                <TextField
                    label="Reason for report"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    multiline
                    rows={5}
                    variant="standard"
                    sx={{ mb: 2 }}
                    error={!!error}
                    helperText={error}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button onClick={onModalClose} sx={{fontSize: '1rem'}}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error"
                        disabled={loading}
                        onClick={handleSubmitReport}
                        sx={{ fontSize: '1rem', px: 3, color: 'white' }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Report'}
                    </Button>
                </Box>
            </>
        )}
      </Box>
    </Modal>
  );
};

export default ReportModal;