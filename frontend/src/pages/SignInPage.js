import React from 'react';
import { Box } from '@mui/material';
import SignInCard from '../components/SignInCard';

const SignInPage = () => {
  return (
    <Box 
      sx={{
        display: 'grid',
        placeItems: 'center',
        flexGrow: 1, // This makes it take up all available space
      }}
    >
      <SignInCard />
    </Box>
  );
};

export default SignInPage;