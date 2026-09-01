// frontend/src/components/SkillCard.js
import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Coins, MessageCircle, ArrowRight } from 'lucide-react';
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
          borderRadius: '24px',
          border: '1px solid rgba(0,0,0,0.03)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 60px rgba(22,58,36,0.1)',
          }
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Teacher info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
            <Avatar
              alt={listing.teacherName}
              src={listing.teacherAvatarUrl}
              sx={{
                width: 44, height: 44, mr: 1.5,
                border: '2px solid #f1f4ec',
                backgroundColor: '#d4edda',
                color: '#163a24',
                fontWeight: 700,
              }}
            >
              {listing.teacherName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 600, fontSize: '0.95rem', color: '#1a3626', lineHeight: 1.2 }}>
                {listing.teacherName}
              </Typography>
              <Typography sx={{ fontFamily: 'Inter', fontSize: '0.78rem', color: '#9ca3af' }}>
                Offers to teach
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a3626', mb: 1, lineHeight: 1.3 }}
          >
            {listing.title}
          </Typography>

          {listing.description && (
            <Typography sx={{ fontFamily: 'Inter', fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, mt: 1 }}
              noWrap>
              {listing.description}
            </Typography>
          )}
        </CardContent>

        {/* Footer */}
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          px: 3, pb: 3, pt: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{
              backgroundColor: '#f1f4ec', borderRadius: '50px',
              px: 1.5, py: 0.5, display: 'flex', alignItems: 'center', gap: 0.5,
            }}>
              <Coins size={14} color="#163a24" />
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.9rem', color: '#163a24' }}>
                {listing.tokenPrice.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="text"
              size="small"
              onClick={(e) => { e.stopPropagation(); setComposeOpen(true); }}
              sx={{ color: '#6b7280', minWidth: 0, p: 0.5, '&:hover': { color: '#163a24', backgroundColor: '#f1f4ec' } }}
            >
              <MessageCircle size={18} />
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={(e) => { e.stopPropagation(); handleCardClick(); }}
              endIcon={<ArrowRight size={14} />}
              sx={{ px: 2, py: 0.7, fontSize: '0.8rem' }}
            >
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
