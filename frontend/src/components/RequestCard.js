import React from 'react';
import { Paper, Typography, Box, Button, Chip, Avatar, Tooltip } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Video, Check, X, AlertCircle, Star, Coins, User } from 'lucide-react';
import nftCoin from '../resources/nft.png';

const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Awaiting Response',
        bg: '#fef3c7',
        color: '#92400e',
        borderColor: 'rgba(245, 158, 11, 0.3)',
      };
    case 'CONFIRMED':
      return {
        label: 'Confirmed • Ready to Connect',
        bg: '#d1fae5',
        color: '#065f46',
        borderColor: 'rgba(16, 185, 129, 0.3)',
      };
    case 'COMPLETED':
      return {
        label: 'Completed • Escrow Released',
        bg: '#e0f2fe',
        color: '#0369a1',
        borderColor: 'rgba(14, 165, 233, 0.3)',
      };
    case 'REJECTED':
      return {
        label: 'Declined',
        bg: '#fee2e2',
        color: '#991b1b',
        borderColor: 'rgba(239, 68, 68, 0.3)',
      };
    case 'IN_DISPUTE':
      return {
        label: 'Under Review / Disputed',
        bg: '#ffedd5',
        color: '#9a3412',
        borderColor: 'rgba(249, 115, 22, 0.3)',
      };
    case 'CANCELLED':
    default:
      return {
        label: 'Cancelled',
        bg: '#f1f5f9',
        color: '#475569',
        borderColor: 'rgba(100, 116, 139, 0.2)',
      };
  }
};

const RequestCard = ({ booking, type, onAccept, onReject, onComplete, onDispute, onReview }) => {
  const navigate = useNavigate();
  if (!booking) return null;

  const {
    id,
    listingTitle,
    teacherName,
    learnerName,
    status,
    listingId,
    teacherId,
    learnerId,
    tokenPrice,
    sessionRoomId,
  } = booking;

  const isTeacher = type === 'received';
  const partnerName = isTeacher ? learnerName : teacherName;
  const partnerId = isTeacher ? learnerId : teacherId;
  const badge = getStatusBadge(status);

  const renderActions = () => {
    if (isTeacher && status === 'PENDING') {
      return (
        <Box sx={{ display: 'flex', gap: 1.5, mt: { xs: 2, sm: 0 } }}>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<X size={15} />}
            onClick={() => onReject(id)}
            sx={{ borderRadius: '50px', px: 2 }}
          >
            Decline
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<Check size={15} />}
            onClick={() => onAccept(id)}
            sx={{ borderRadius: '50px', px: 2.5, fontWeight: 700 }}
          >
            Accept Request
          </Button>
        </Box>
      );
    }

    if (status === 'CONFIRMED') {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: { xs: 2, sm: 0 } }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<Video size={16} />}
            onClick={() => navigate(`/session/${sessionRoomId}`)}
            sx={{
              borderRadius: '50px',
              px: 2.5,
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(15, 56, 34, 0.2)',
            }}
          >
            Join Video Room
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="success"
            startIcon={<Check size={15} />}
            onClick={() => onComplete(id)}
            sx={{ borderRadius: '50px', px: 2, fontWeight: 600 }}
          >
            Mark Complete
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<AlertCircle size={15} />}
            onClick={() => onDispute(id)}
            sx={{ borderRadius: '50px', px: 1.5 }}
          >
            Dispute
          </Button>
        </Box>
      );
    }

    if (!isTeacher && status === 'COMPLETED' && onReview) {
      return (
        <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, sm: 0 } }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Star size={15} />}
            onClick={() => onReview(booking)}
            sx={{
              borderRadius: '50px',
              px: 2.5,
              fontWeight: 700,
              backgroundColor: '#d97706',
              '&:hover': { backgroundColor: '#b45309' },
            }}
          >
            Leave Review
          </Button>
        </Box>
      );
    }

    return null;
  };

  return (
    <Paper
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(13, 30, 22, 0.08)',
        boxShadow: '0 2px 8px -2px rgba(13, 30, 22, 0.04)',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'rgba(15, 56, 34, 0.18)',
          boxShadow: '0 8px 24px -4px rgba(13, 30, 22, 0.08)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
        }}
      >
        {/* Left Side: Status pill, Title & Partner */}
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={badge.label}
              size="small"
              sx={{
                backgroundColor: badge.bg,
                color: badge.color,
                fontWeight: 700,
                fontSize: '0.75rem',
                border: `1px solid ${badge.borderColor}`,
              }}
            />

            {tokenPrice && (
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.6,
                  backgroundColor: '#fbfbfa',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '50px',
                  px: 1.2,
                  py: 0.2,
                }}
              >
                <Box component="img" src={nftCoin} alt="Token" sx={{ width: 14, height: 14 }} />
                <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', color: '#92400e' }}>
                  {Number(tokenPrice || 0).toFixed(0)} Tokens
                </Typography>
              </Box>
            )}
          </Box>

          <Typography
            variant="h6"
            component={RouterLink}
            to={`/listing/${listingId}`}
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#0d1e16',
              textDecoration: 'none',
              display: 'block',
              mb: 0.8,
              '&:hover': { color: 'primary.main' },
            }}
          >
            {listingTitle}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.825rem', color: 'text.secondary' }}>
              {isTeacher ? 'Learner:' : 'Mentor:'}
            </Typography>
            <Typography
              component={RouterLink}
              to={`/profile/${partnerId}`}
              sx={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {partnerName}
            </Typography>
          </Box>
        </Box>

        {/* Right Side: Actions */}
        <Box sx={{ flexShrink: 0 }}>
          {renderActions()}
        </Box>
      </Box>
    </Paper>
  );
};

export default RequestCard;
