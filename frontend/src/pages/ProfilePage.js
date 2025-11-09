import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Paper, Avatar, Chip, IconButton } from '@mui/material';
import { AlertTriangle, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ProfileEditForm from '../components/ProfileEditForm';
import ReportModal from '../components/ReportModal';
import ComposeMessageDialog from '../components/ComposeMessageDialog';

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

  

  const isOwnProfile = !id || (userProfile && userProfile.id.toString() === id);
  
  const [composeOpen, setComposeOpen] = useState(false);

  const presetRecipient = !isOwnProfile && profileData ? {
    id: profileData.id,
    name: profileData.name,
    avatarUrl: profileData.avatarUrl
  } : null;
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = isOwnProfile 
        ? await userService.getUserProfile()
        : await userService.getPublicProfile(id);
      setProfileData(response.data);
    } catch (err) {
      setError('Could not load profile.');
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

        if (window.confirm("Profile saved! Would you like to create a new listing for one of your skills?")) {
            navigate('/create-listing');
        }
    } catch (err) {
        console.error("Failed to update profile", err);
        setError('Failed to save changes. Please try again.');
    }
  };

  const handleAvatarClick = () => {
    if (isOwnProfile && isEditMode) {
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
      console.error("Failed to upload avatar", err);
      setError("Avatar upload failed. Please try a smaller image.");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  if (error && !isEditMode) return <Typography color="error" align="center">{error}</Typography>;
  if (!profileData) return null;

  const avatarUrl = profileData.avatarUrl ? `${process.env.REACT_APP_API_URL}${profileData.avatarUrl}` : null;
  return (
    <>
      <Container sx={{ py: 4, maxWidth: '800px !important' }}>
        <Paper sx={{ p: 4, border: '2px solid #4a4a4a', borderRadius: '4px' }}>
          
          {/* --- THIS TOP SECTION IS NOW ALWAYS RENDERED --- */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              
              {/* Avatar with its own logic, outside the main toggle */}
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={avatarUrl} 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3, 
                    border: '2px solid #4a4a4a', 
                    cursor: (isOwnProfile && isEditMode) ? 'pointer' : 'default' 
                  }} 
                  onClick={handleAvatarClick}
                />
                {isOwnProfile && isEditMode && (
                  <IconButton 
                    size="small"
                    onClick={handleAvatarClick}
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, 
                      right: '20px', 
                      backgroundColor: 'white', 
                      border: '2px solid #4a4a4a', 
                      '&:hover': { backgroundColor: '#eee' } 
                    }}
                  >
                    <Edit2 size={16} />
                  </IconButton>
                )}
              </Box>

              <Box>
                <Typography variant="h3">{isEditMode ? 'Editing Profile' : profileData.name}</Typography>
                {isOwnProfile && <Typography sx={{fontFamily: 'Inter'}}>{profileData.email}</Typography>}
              </Box>
            </Box>

            {/* The main action button for the page */}
            
            {isOwnProfile ? (
              <Button variant="contained" onClick={() => setIsEditMode(!isEditMode)}>
                {isEditMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="error" 
                startIcon={<AlertTriangle />}
                onClick={() => setReportModalOpen(true)}
              >
                Report User
              </Button>
            )}
            {!isOwnProfile && (
              <Button variant="contained" color="primary" onClick={() => setComposeOpen(true)} sx={{ mr: 1 }}>
                Message
              </Button>
            )}
          </Box>
          
          {/* ---- CONDITIONAL RENDERING FOR THE REST OF THE PAGE ---- */}
          { isEditMode ? (
              <ProfileEditForm 
                  profileData={profileData}
                  onSave={handleSaveChanges}
                  onCancel={() => setIsEditMode(false)}
              />
          ) : (
              <>
                <Typography variant="h5" sx={{ mb: 1 }}>About Me</Typography>
                <Typography sx={{ fontFamily: 'Inter', mb: 4, whiteSpace: 'pre-wrap' }}>
                    {profileData.bio || 'This user has not written a bio yet.'}
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>Skills I Can Teach</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                {profileData.skillsOffered?.length > 0 ? profileData.skillsOffered.map(skill => (
                    <Chip key={skill} label={skill} />
                )) : <Typography sx={{fontFamily: 'Inter'}}>No skills offered yet.</Typography>}
                </Box>

                <Typography variant="h5" sx={{ mb: 2 }}>Skills I Want to Learn</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.skillsWanted?.length > 0 ? profileData.skillsWanted.map(skill => (
                    <Chip key={skill} label={skill} variant="outlined" />
                )) : <Typography sx={{fontFamily: 'Inter'}}>No skills wanted yet.</Typography>}
                </Box>
              </>
          )}
        </Paper>
      </Container>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png, image/jpeg"
      />

      <ReportModal
          open={reportModalOpen}
          handleClose={() => setReportModalOpen(false)}
          reportedUser={profileData}
      />
      <ComposeMessageDialog
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        presetRecipient={presetRecipient}
      />
    </>
  );
};

export default ProfilePage;