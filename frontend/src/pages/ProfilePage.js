import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Grid,
  Divider,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  AlertTriangle,
  Edit2,
  Camera,
  BookOpen,
  GraduationCap,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Coins,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ProfileEditForm from '../components/ProfileEditForm';
import ReportModal from '../components/ReportModal';
import ComposeMessageDialog from '../components/ComposeMessageDialog';
import ManageAvailability from '../components/ManageAvailability';
import nftCoin from '../resources/nft.png';
import { getFullMediaUrl } from '../services/api';

const ProfilePage = () => {
  const { id } = useParams();
  const { userProfile, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  const isOwnProfile = !id || (userProfile && userProfile.id.toString() === id);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = isOwnProfile
        ? await userService.getUserProfile()
        : await userService.getPublicProfile(id);
      setProfileData(data);
    } catch (err) {
      setError('Could not load profile. The requested profile may not exist.');
      console.error(err);
    }
    setLoading(false);
  }, [id, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveChanges = async (formData) => {
    try {
      await userService.updateUserProfile(formData);
      await refreshUserProfile();
      await fetchProfile();
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to update profile', err);
      setError('Failed to save profile changes. Please try again.');
    }
  };

  const handleAvatarClick = () => {
    if (isOwnProfile) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await userService.uploadAvatar(file);
      await refreshUserProfile();
      await fetchProfile();
    } catch (err) {
      console.error('Failed to upload avatar', err);
      setError('Avatar upload failed. Please try a smaller image.');
    }
  };

  const presetRecipient = !isOwnProfile && profileData ? {
    id: profileData.id,
    name: profileData.name,
    avatarUrl: profileData.avatarUrl,
  } : null;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={44} thickness={4} />
      </Box>
    );
  }

  if (error || !profileData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 5, textAlign: 'center', borderRadius: '24px', border: '1px solid rgba(13, 30, 22, 0.08)' }}>
          <Typography color="error" sx={{ fontWeight: 700, mb: 2 }}>
            {error || 'Profile not found.'}
          </Typography>
          <Button component={RouterLink} to="/discover" variant="contained">
            Discover Community Mentors
          </Button>
        </Paper>
      </Container>
    );
  }

  const avatarUrl = getFullMediaUrl(profileData.avatarUrl);

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Profile Header Strip */}
      <Box
        sx={{
          height: 140,
          backgroundColor: '#0a331c',
          position: 'relative',
        }}
      />

      <Container maxWidth="lg" sx={{ mt: -10 }}>
        {/* Main Profile Info Card */}
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 48px -12px rgba(13, 30, 22, 0.08)',
            border: '1px solid rgba(13, 30, 22, 0.08)',
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: 3,
              mb: 4,
            }}
          >
            {/* Avatar & User Details */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatarUrl}
                  sx={{
                    width: { xs: 84, sm: 104 },
                    height: { xs: 84, sm: 104 },
                    border: '4px solid #ffffff',
                    boxShadow: '0 8px 24px rgba(13, 30, 22, 0.15)',
                    bgcolor: 'primary.main',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '2rem',
                    cursor: isOwnProfile ? 'pointer' : 'default',
                  }}
                  onClick={handleAvatarClick}
                >
                  {profileData.name?.charAt(0) || 'U'}
                </Avatar>

                {isOwnProfile && (
                  <Tooltip title="Update Profile Picture" arrow>
                    <IconButton
                      size="small"
                      onClick={handleAvatarClick}
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        right: 4,
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(13, 30, 22, 0.15)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        '&:hover': { backgroundColor: '#f4f5f1' },
                      }}
                    >
                      <Camera size={16} color="#0f3822" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Outfit", sans-serif',
                      fontWeight: 800,
                      fontSize: { xs: '1.6rem', sm: '2.1rem' },
                      color: '#0d1e16',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {profileData.name}
                  </Typography>
                  <ShieldCheck size={20} color="#10b981" />
                </Box>

                {profileData.email && (
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1 }}>
                    {profileData.email}
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    icon={<Sparkles size={12} color="#0f3822" />}
                    label="Peer Mentor"
                    sx={{
                      backgroundColor: '#eef5f1',
                      color: '#0f3822',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                    }}
                  />
                  {isOwnProfile && userProfile && (
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.6,
                        backgroundColor: '#fffbeb',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '50px',
                        px: 1.2,
                        py: 0.2,
                      }}
                    >
                      <Box component="img" src={nftCoin} alt="Token" sx={{ width: 14, height: 14 }} />
                      <Typography sx={{ fontWeight: 800, fontSize: '0.78rem', color: '#92400e' }}>
                        {Number(userProfile.tokenBalance || 0).toFixed(1)} Tokens
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Profile Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {!isOwnProfile && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MessageSquare size={16} />}
                  onClick={() => setComposeOpen(true)}
                  sx={{ borderRadius: '50px', px: 3, fontWeight: 700 }}
                >
                  Send Message
                </Button>
              )}

              {isOwnProfile ? (
                <>
                  <Button
                    variant={isEditMode ? 'outlined' : 'contained'}
                    color="primary"
                    startIcon={<Edit2 size={16} />}
                    onClick={() => setIsEditMode(!isEditMode)}
                    sx={{ borderRadius: '50px', px: 3, fontWeight: 600 }}
                  >
                    {isEditMode ? 'Close Editor' : 'Edit Profile'}
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/create-listing"
                    variant="outlined"
                    startIcon={<PlusCircle size={16} />}
                    sx={{ borderRadius: '50px', px: 2.5, fontWeight: 600 }}
                  >
                    New Listing
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<AlertTriangle size={15} />}
                  onClick={() => setReportModalOpen(true)}
                  sx={{ borderRadius: '50px' }}
                >
                  Report User
                </Button>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Conditional: Edit Mode vs View Mode */}
          {isEditMode ? (
            <ProfileEditForm
              profileData={profileData}
              onSave={handleSaveChanges}
              onCancel={() => setIsEditMode(false)}
            />
          ) : (
            <Grid container spacing={{ xs: 4, md: 5 }}>
              {/* Bio & Details */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#0d1e16',
                    mb: 1.5,
                  }}
                >
                  About {isOwnProfile ? 'You' : profileData.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#374151',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    backgroundColor: '#fbfbfa',
                    p: 2.5,
                    borderRadius: '16px',
                    border: '1px solid rgba(13, 30, 22, 0.06)',
                  }}
                >
                  {profileData.bio || 'This member has not written a personal bio yet.'}
                </Typography>
              </Grid>

              {/* Skills Wallet (Teach & Learn) */}
              <Grid item xs={12} md={6}>
                {/* Skills I Can Teach */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <BookOpen size={18} color="#0f3822" />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#0d1e16',
                      }}
                    >
                      Skills I Can Teach
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profileData.skillsOffered && profileData.skillsOffered.length > 0 ? (
                      profileData.skillsOffered.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          sx={{
                            backgroundColor: '#eef5f1',
                            color: '#0f3822',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            border: '1px solid rgba(15, 56, 34, 0.15)',
                          }}
                        />
                      ))
                    ) : (
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        No teaching skills listed yet.
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Skills I Want to Learn */}
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <GraduationCap size={18} color="#d97706" />
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontFamily: '"Outfit", sans-serif',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#0d1e16',
                      }}
                    >
                      Skills I Want to Learn
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profileData.skillsWanted && profileData.skillsWanted.length > 0 ? (
                      profileData.skillsWanted.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          variant="outlined"
                          sx={{
                            borderColor: 'rgba(245, 158, 11, 0.4)',
                            color: '#92400e',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            backgroundColor: '#fffbeb',
                          }}
                        />
                      ))
                    ) : (
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                        No learning goals listed yet.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Paper>

        {/* If own profile, render Availability Manager below */}
        {isOwnProfile && (
          <Box sx={{ mt: 4 }}>
            <ManageAvailability />
          </Box>
        )}
      </Container>

      {/* Hidden File Input for Avatar */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg"
      />

      {/* Report and Message Dialogs */}
      <ReportModal
        open={reportModalOpen}
        handleClose={() => setReportModalOpen(false)}
        reportedUser={profileData}
      />
      {presetRecipient && (
        <ComposeMessageDialog
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          presetRecipient={presetRecipient}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
