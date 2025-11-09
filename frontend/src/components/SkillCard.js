// frontend/src/components/SkillCard.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ComposeMessageDialog from './ComposeMessageDialog';

const SkillCard = ({ listing }) => {
  const navigate = useNavigate();
  const [composeOpen, setComposeOpen] = useState(false);

  const handleCardClick = () => navigate(`/listing/${listing.id}`);

  const presetRecipient = {
    id: listing.teacherId,
    name: listing.teacherName,
    avatarUrl: listing.teacherAvatarUrl
  };

  return (
    <>
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar alt={listing.teacherName} sx={{ width: 48, height: 48, mr: 2, border: '2px solid #4a4a4a' }} />
            <Box>
              <Typography sx={{ fontSize: '1.1rem', fontFamily: 'Inter', fontWeight: 500 }}>
                {listing.teacherName}
              </Typography>
              <Typography sx={{ fontSize: '0.9rem', fontFamily: 'Inter', color: 'text.secondary' }}>
                Offers to teach
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" component="div" sx={{ mb: 1.5 }}>
            {listing.title}
          </Typography>
        </CardContent>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '2px solid #4a4a4a' }}>
          <Typography variant="h6">
            {listing.tokenPrice.toFixed(2)} Tokens
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="primary" sx={{ boxShadow: 'none' }}
              onClick={(e) => { e.stopPropagation(); setComposeOpen(true); }}>
              Message
            </Button>
            <Button variant="contained" color="primary" sx={{ boxShadow: 'none' }}
              onClick={(e) => { e.stopPropagation(); handleCardClick(); }}>
              View
            </Button>
          </Box>
        </Box>
      </Card>

      <ComposeMessageDialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        presetRecipient={presetRecipient}
      />
    </>
  );
};

export default SkillCard;
