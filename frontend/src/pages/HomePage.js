import React from 'react';
import { Container, Typography, Box, Grid, Button } from '@mui/material'; // <-- ADDED BUTTON
import ScribbleUnderline from '../components/decorations/ScribbleUnderline';
import StickyNote from '../components/decorations/StickyNote';
import { Link as RouterLink } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center" justifyContent="center">
        
        <Grid item xs={12} md={7}>
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h2" component="h1">
              <ScribbleUnderline>
                Share a Skill.
              </ScribbleUnderline>
            </Typography>
            <Typography variant="h2" component="h1" sx={{ mb: 3 }}>
              Learn another.
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: 'Inter', mb: 4, maxWidth: '500px', mx: { xs: 'auto', md: 0 } }}>
              A friendly community where your knowledge becomes your currency. Teach what you love, and earn tokens to learn something new.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Button component={RouterLink} to="/discover" variant="contained" color="primary" sx={{py: 1.5, px: 4, fontSize: '1.2rem'}}>
                Discover Skills
              </Button>
              <Button component={RouterLink} to="/profile" variant="outlined" color="secondary" sx={{py: 1.5, px: 4, fontSize: '1.2rem'}}>
                Share a Skill
              </Button>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
          <StickyNote rotation={-3}>
            <Typography variant="h5" sx={{mb: 2}}>Welcome!</Typography>
            <Typography sx={{fontFamily: 'Inter', fontSize: '1rem'}}>
                Ready to start? <br/>
                1. Offer a skill you're good at. <br/>
                2. Earn tokens from teaching. <br/>
                3. Spend tokens to learn from others!
            </Typography>
          </StickyNote>
        </Grid>

      </Grid>
    </Container>
  );
};

export default HomePage;