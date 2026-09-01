import React from 'react';
import { Container, Grid, Typography, Box, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import SkillCard from '../components/SkillCard';
import listingService from '../services/listingService';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const DiscoverPage = () => {
  const { data: listings, isLoading, isError, error } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const response = await listingService.getAllListings();
      return response.data;
    }
  });

  if (isError) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        {error.message || 'Could not fetch listings. Please try again later.'}
      </Typography>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#faf9f5', minHeight: '100vh' }} component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        {/* Page header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" component="h1"
            sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, color: '#1a3626' }}>
            Discover Skills
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', color: '#6b7280', mt: 1, fontSize: '1.05rem' }}>
            Find the perfect skill to learn from our community of teachers
          </Typography>
        </Box>

        {isLoading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((key) => (
              <Grid item key={key} xs={12} sm={6} md={4}>
                <Box sx={{ p: 3, borderRadius: '24px', bgcolor: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' }}>
                  <Skeleton variant="circular" width={44} height={44} sx={{ mb: 2 }} />
                  <Skeleton variant="text" sx={{ fontSize: '1.1rem', mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" />
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Skeleton variant="rounded" width={80} height={28} sx={{ borderRadius: '50px' }} />
                    <Skeleton variant="rounded" width={70} height={32} sx={{ borderRadius: '50px' }} />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="show">
            {listings.map((listing) => (
              <Grid item key={listing.id} xs={12} sm={6} md={4} component={motion.div} variants={itemVariants}>
                <SkillCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DiscoverPage;