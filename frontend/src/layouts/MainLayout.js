import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import BackgroundDoodles from '../components/decorations/BackgroundDoodles'; // <-- IMPORT

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BackgroundDoodles /> {/* <-- ADD THE COMPONENT HERE */}
      <Navbar />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;