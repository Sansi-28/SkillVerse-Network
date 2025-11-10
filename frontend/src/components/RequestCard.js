import React from 'react';
import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const getStatusStyles = (status) => {
    switch (status) {
        case 'PENDING':
            return { backgroundColor: '#FFB100', color: '#000000' };
        case 'CONFIRMED':
            return { backgroundColor: '#2E7D32', color: '#FFFFFF' };
        case 'COMPLETED':
            return { backgroundColor: '#80b3c2', color: '#FFFFFF' };
        case 'REJECTED':
            return { backgroundColor: '#D32F2F', color: '#FFFFFF' };
        case 'IN_DISPUTE':
            return { backgroundColor: '#f57c00', color: '#FFFFFF' };
        case 'CANCELLED':
        default:
            return { backgroundColor: '#696969', color: '#FFFFFF' };
    }
};

const RequestCard = ({ booking, type, onAccept, onReject, onComplete, onDispute, onReview }) => {
  const navigate = useNavigate();
  if (!booking) return null;
  
  const { id, listingTitle, teacherName, learnerName, status, listingId, teacherId, learnerId, tokenPrice, sessionRoomId } = booking;

  const renderActions = () => {
    const isTeacher = type === 'received';
    const isLearner = type === 'sent';

    if (isTeacher && status === 'PENDING') {
      return (
        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
          <Button size="small" variant="outlined" color="error" onClick={() => onReject(id)}>Decline</Button>
          <Button size="small" variant="contained" color="primary" onClick={() => onAccept(id)}>Accept</Button>
        </Box>
      );
    }
    
    if (status === 'CONFIRMED') {
      return (
         <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1}}>
            <Button size="small" variant="contained" color="primary" onClick={() => navigate(`/session/${sessionRoomId}`)}>
                Join Session Room
            </Button>
            <Button size="small" variant="outlined" color="success" onClick={() => onComplete(id)} sx={{color: 'success.main'}}>
                Mark as Complete
            </Button>
            <Button size="small" variant="outlined" color="warning" onClick={() => onDispute(id)}>
                Dispute
            </Button>
        </Box>
      );
    }

    if (isLearner && status === 'COMPLETED' && onReview) {
       return (
        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
            <Button size="small" variant="contained" color="secondary" onClick={() => onReview(booking)}>
                Leave a Review
            </Button>
        </Box>
       )
    }
    
    return null;
  };

  return (
    <Paper sx={{ p: 2, border: '2px solid #4a4a4a' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
            <Chip 
                label={status.replace('_', ' ')} 
                size="small" 
                sx={{ 
                  mb: 1, 
                  mr: 2,
                  fontFamily: 'Inter', 
                  fontWeight: 'bold',
                  ...getStatusStyles(status),
                  border: '1px solid #4a4a4a',
                }}
            />
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to={`/listing/${listingId}`} 
              sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
            >
              {listingTitle}
            </Typography>

            <Typography 
              component={RouterLink}
              to={`/profile/${type === 'sent' ? teacherId : learnerId}`}
              sx={{ fontFamily: 'Inter', fontSize: '0.9rem', textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
            >
              {type === 'sent' ? `To: ${teacherName}` : `From: ${learnerName}`}
            </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 500 }}>
            {tokenPrice ? `${tokenPrice.toFixed(2)} Tokens` : ''}
        </Typography>
      </Box>
      {renderActions()}
    </Paper>
  );
};

export default RequestCard;