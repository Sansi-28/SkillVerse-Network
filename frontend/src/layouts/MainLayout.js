import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#faf9f5' }}>
      <Navbar />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;