import React from 'react';
import { Paper, Box } from '@mui/material';

const StickyNote = ({ children, rotation = 2 }) => {
  return (
    <Paper 
        elevation={0}
        sx={{
            position: 'relative',
            width: 250,
            height: 250,
            backgroundColor: '#fffacd', // A nice, soft yellow
            p: 2,
            pt: 5, // More padding at the top
            border: 'none',
            boxShadow: '5px 5px 15px rgba(0,0,0,0.2)',
            transform: `rotate(${rotation}deg)`,
            fontFamily: '"Patrick Hand", cursive'
        }}
    >
        {/* The little darker "sticky" part at the top */}
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '30px',
            backgroundColor: 'rgba(239, 221, 138, 0.5)'
        }}/>
        {children}
    </Paper>
  );
};

export default StickyNote;