import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SkillCard = ({ listing }) => {
  const navigate = useNavigate();

  // Function to handle clicking on a card
  const handleCardClick = () => {
    // Navigate to a detailed page for this listing
    navigate(`/listing/${listing.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-4px) translateX(4px)',
            boxShadow: '8px 8px 0px 0px #4a4a4a',
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Teacher Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar 
            // We'll add real avatars later
            alt={listing.teacherName} 
            sx={{ width: 48, height: 48, mr: 2, border: '2px solid #4a4a4a' }} 
          />
          <Box>
            <Typography sx={{ fontSize: '1.1rem', fontFamily: 'Inter', fontWeight: 500 }}>
              {listing.teacherName}
            </Typography>
            <Typography sx={{ fontSize: '0.9rem', fontFamily: 'Inter', color: 'text.secondary' }}>
              Offers to teach
            </Typography>
          </Box>
        </Box>

        {/* Listing Title */}
        <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
          {listing.title}
        </Typography>

        {/* We can add a short description here later if we add it to the DTO */}
      </CardContent>

      {/* Price and Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '2px solid #4a4a4a' }}>
        <Typography variant="h6">
          {listing.tokenPrice.toFixed(2)} Tokens
        </Typography>
        <Button variant="contained" color="primary" sx={{ boxShadow: 'none' }}>
          View
        </Button>
      </Box>
    </Card>
  );
};

export default SkillCard;