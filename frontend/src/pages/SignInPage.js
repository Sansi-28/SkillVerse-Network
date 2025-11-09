import React, { useState } from 'react';
import { Box } from '@mui/material';
import SignInCard from '../components/SignInCard';
import SignUpCard from '../components/SignUpCard'; // <-- IMPORT

const SignInPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <Box 
      sx={{
        display: 'grid',
        placeItems: 'center',
        flexGrow: 1,
        py: 4
      }}
    >
      {isLoginView ? (
        <SignInCard onToggle={toggleView} />
      ) : (
        <SignUpCard onToggle={toggleView} />
      )}
    </Box>
  );
};

export default SignInPage;