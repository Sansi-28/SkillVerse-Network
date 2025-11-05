import React from 'react';
import { Box } from '@mui/material';

const ScribbleUnderline = ({ children }) => {
  return (
    <Box sx={{ display: 'inline-block', position: 'relative' }}>
      {children}
      <Box 
        component="svg"
        sx={{ 
            position: 'absolute', 
            bottom: '-8px', 
            left: '0', 
            width: '100%', 
            height: '10px',
            color: 'primary.main' // Uses our theme's Teal color
        }}
        preserveAspectRatio="none" 
        viewBox="0 0 200 10"
      >
        <path 
          d="M0,5 Q25,8 50,5 T100,5 T150,5 T200,5" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Box>
    </Box>
  );
};

export default ScribbleUnderline;