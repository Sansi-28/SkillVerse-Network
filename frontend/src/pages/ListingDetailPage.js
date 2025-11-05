import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Avatar, Paper } from '@mui/material';
import { Clock, Tag, User, ArrowLeft } from 'lucide-react';
import listingService from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal'; // Import the modal

const ListingDetailPage = () => {
  const { id } = useParams(); // Gets the listing ID from the URL (e.g., /listing/1)
  const navigate = useNavigate();
  const { userProfile } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State to control the modal
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await listingService.getListingById(id);
        setListing(response.data);
      } catch (err) {
        setError('Could not find this skill listing.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchListing();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!listing) {
      // This state can happen if loading is false but listing is still null
      return (
        <Typography align="center" sx={{ mt: 4 }}>
            Listing not found.
        </Typography>
      );
  }

  const isOwnListing = userProfile && listing && userProfile.id === listing.teacherId;

  return (
    <>
      <Container sx={{ py: 5, maxWidth: '800px !important' }}>
        <Button 
          startIcon={<ArrowLeft />} 
          onClick={() => navigate('/discover')}
          sx={{ mb: 3 }}
        >
          Back to Discover
        </Button>

        <Paper 
          elevation={0}
          sx={{ 
              border: '2px solid #4a4a4a',
              borderRadius: '4px',
              p: 4
          }}
        >
          {/* Header Section */}
          <Box sx={{ borderBottom: '2px solid #4a4a4a', pb: 3, mb: 3 }}>
              <Typography variant="h3" component="h1" gutterBottom>
                  {listing.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ width: 40, height: 40, mr: 2, border: '2px solid #4a4a4a' }} />
                  <Typography sx={{ fontFamily: 'Inter', fontSize: '1.2rem' }}>
                      Offered by <strong>{listing.teacherName}</strong>
                  </Typography>
              </Box>
          </Box>

          {/* Description */}
          <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
            {listing.description || 'No description provided.'}
          </Typography>

          {/* Details Section */}
          <Box sx={{ display: 'flex', gap: 4, mb: 4, fontFamily: 'Inter' }}>
              {listing.durationMinutes && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Clock size={20} style={{ marginRight: '8px' }}/>
                      <Typography>{listing.durationMinutes} minutes</Typography>
                  </Box>
              )}
              {listing.format && (
                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <User size={20} style={{ marginRight: '8px' }}/>
                      <Typography>{listing.format}</Typography>
                  </Box>
              )}
          </Box>

          {/* Action Area */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3, borderTop: '2px solid #4a4a4a' }}>
              <Box>
                  <Typography sx={{ fontFamily: 'Inter', color: 'text.secondary' }}>
                      Cost
                  </Typography>
                  <Typography variant="h5">
                      {listing.tokenPrice.toFixed(2)} Tokens
                  </Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary"
                disabled={!userProfile || isOwnListing} // Disable if not logged in OR it's their own listing
                onClick={handleOpenModal} // Open the modal on click
                sx={{ py: 1.5, px: 4, fontSize: '1.3rem' }}
              >
                Book Session
              </Button>
          </Box>
           {!userProfile && (
              <Typography sx={{ fontFamily: 'Inter', color: 'text.secondary', textAlign: 'right', mt: 1, fontSize: '0.9rem' }}>
                  Please sign in to book a session.
              </Typography>
          )}
           {isOwnListing && (
            <Typography sx={{ fontFamily: 'Inter', color: 'text.secondary', textAlign: 'right', mt: 1, fontSize: '0.9rem' }}>
                This is your own listing.
            </Typography>
        )}
        </Paper>
      </Container>
      
      {/* The Modal Component itself */}
      <BookingModal 
        open={modalOpen}
        handleClose={handleCloseModal}
        listing={listing}
      />
    </>
  );
};

export default ListingDetailPage;