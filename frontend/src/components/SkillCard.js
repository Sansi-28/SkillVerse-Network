import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import nftCoin from '../resources/nft.png';

const SkillCard = ({ listing }) => {
  const navigate = useNavigate();

  if (!listing) return null;

  const handleCardClick = () => navigate(`/listing/${listing.id}`);

  const photo = listing.photoUrl || '/photos/m138547195-1200.webp';
  const guildName = listing.guild || 'Craft';

  return (
    <Card
      onClick={handleCardClick}
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(17, 24, 20, 0.08)',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'rgba(10, 51, 28, 0.3)',
          boxShadow: '0 16px 36px -8px rgba(10, 51, 28, 0.08)',
          '& .craft-photo': {
            transform: 'scale(1.03)',
          },
        },
      }}
    >
      {/* Photograph Frame */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 10',
          overflow: 'hidden',
          backgroundColor: '#f1efe9',
        }}
      >
        <Box
          component="img"
          src={photo}
          alt={listing.title}
          className="craft-photo"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            px: 1,
            py: 0.3,
            borderRadius: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.68rem',
              color: '#0a331c',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {guildName}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.2, display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#0a331c',
              lineHeight: 1.35,
              mb: 1,
            }}
          >
            {listing.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar
              src={listing.teacherAvatarUrl}
              alt={listing.teacherName}
              sx={{ width: 22, height: 22, fontSize: '0.75rem', bgcolor: 'primary.main' }}
            >
              {listing.teacherName?.charAt(0) || 'M'}
            </Avatar>
            <Typography sx={{ fontSize: '0.825rem', color: '#57675e', fontWeight: 500 }}>
              {listing.teacherName}
            </Typography>
          </Box>
        </Box>

        {/* Minimal Footer Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1.5,
            borderTop: '1px solid rgba(17, 24, 20, 0.06)',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '0.75rem',
              color: '#718278',
            }}
          >
            {listing.durationMinutes ? `${listing.durationMinutes} min` : '1:1 Session'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box component="img" src={nftCoin} alt="Token" sx={{ width: 14, height: 14 }} />
            <Typography
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0a331c',
              }}
            >
              {Number(listing.tokenPrice || 0).toFixed(0)} Tokens
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SkillCard;
