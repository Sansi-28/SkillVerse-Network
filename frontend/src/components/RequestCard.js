import React from 'react';
import { Paper, Typography, Box, Button, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const getStatusStyles = (status) => {
    switch (status) {
        case 'PENDING':
            return {
                backgroundColor: '#FFB100',  // Warm yellow
                color: '#000000'  // Black text for contrast
            };
        case 'CONFIRMED':
            return {
                backgroundColor: '#2E7D32',  // Deep green
                color: '#FFFFFF'
            };
        case 'COMPLETED':
            return {
                backgroundColor: '#80b3c2',  // Theme blue
                color: '#FFFFFF'
            };
        case 'REJECTED':
            return {
                backgroundColor: '#D32F2F',  // Deep red
                color: '#FFFFFF'
            };
        case 'CANCELLED':
            return {
                backgroundColor: '#696969',  // Dark gray
                color: '#FFFFFF'
            };
        default:
            return {
                backgroundColor: '#696969',
                color: '#FFFFFF'
            };
    }
};

const RequestCard = ({ booking, type, onAccept, onReject, onComplete }) => {
  if (!booking) return null;
  
  // Destructure all the flat properties we need, including the new tokenPrice
  const { id, listingTitle, teacherName, learnerName, status, listingId, teacherId, learnerId, tokenPrice } = booking;

  const renderActions = () => {
    if (type === 'received' && status === 'PENDING') {
      return (
        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
          <Button size="small" variant="outlined" color="error" onClick={() => onReject(id)}>Decline</Button>
          <Button size="small" variant="contained" color="primary" onClick={() => onAccept(id)}>Accept</Button>
        </Box>
      );
    }
    
    if (type === 'sent' && status === 'CONFIRMED') {
      return (
        <Box sx={{display: 'flex', gap: 1, mt: 1}}>
            <Button size="small" variant="contained" color="success" onClick={() => onComplete(id)} sx={{color: 'white'}}>
                Mark as Complete
            </Button>
        </Box>
      );
    }
    
    return null;
  };

  return (
    <Paper sx={{ p: 2, border: '2px solid #4a4a4a' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
            <Chip 
                label={status} 
                size="small" 
                sx={{ 
                  mb: 1, 
                  marginRight: '14px',
                  transform: 'translateY(5%)',
                  fontFamily: 'Inter', 
                  fontWeight: 'bold',
                  ...getStatusStyles(status),
                  border: '1px solid #4a4a4a',
                  '& .MuiChip-label': {
                    px: 1.5  // Add more horizontal padding
                  },
                  '&:hover': {
                    ...getStatusStyles(status),  // Maintain same colors on hover
                    opacity: 0.9  // Subtle hover effect
                  }
                }}
            />
            <Typography 
              variant="h6" 
              component={RouterLink} 
              to={`/listing/${listingId}`} 
              sx={{ textDecoration: 'none', marginRight: '14px', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
            >
              {listingTitle}
            </Typography>

            <Typography 
              component={RouterLink}
              to={`/profile/${type === 'sent' ? teacherId : learnerId}`}
              sx={{ 
                fontFamily: 'Inter', 
                fontSize: '0.9rem',
                textDecoration: 'none', 
                color: 'inherit', 
                '&:hover': { 
                  textDecoration: 'underline' 
                } 
              }}
            >
              {type === 'sent' ? `To: ${teacherName}` : `From: ${learnerName}`}
            </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontFamily: 'Inter', fontWeight: 500 }}>
            {/* --- THIS IS THE FIX --- */}
            {/* Access tokenPrice directly from the booking object */}
            {tokenPrice ? `${tokenPrice.toFixed(2)} Tokens` : ''}
        </Typography>
      </Box>
      {renderActions()}
    </Paper>
  );
};

export default RequestCard;