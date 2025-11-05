import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CircularProgress } from '@mui/material';
import SkillCard from '../components/SkillCard';
import listingService from '../services/listingService';

const DiscoverPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch listings when the component mounts
    const fetchListings = async () => {
      try {
        const response = await listingService.getAllListings();
        setListings(response.data);
      } catch (err) {
        setError('Could not fetch listings. Please try again later.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchListings();
  }, []); // The empty array ensures this runs only once

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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
        Discover Skills
      </Typography>
      
      <Grid container spacing={4}>
        {listings.map((listing) => (
          <Grid item key={listing.id} xs={12} sm={6} md={4}>
            <SkillCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DiscoverPage;