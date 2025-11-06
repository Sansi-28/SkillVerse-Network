import React from 'react';
import { Box } from '@mui/material';

// The full array of doodles, now including the new paper plane as #9.
const doodlesFull = [
  // 1. Top Left - Skill Exchange Arrows
  { styles: { top: '12vh', left: '8vw', width: 220, height: 220, transform: 'rotate(-15deg)' },
    color: 'primary.main',
    content: (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5,5"/>
        <path d="M35,40 L50,25 L65,40 M50,25 L50,50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M65,60 L50,75 L35,60 M50,75 L50,50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  // 2. Top Right - Bright Idea Lightbulb
  { styles: { top: '18vh', right: '10vw', width: 150, height: 150, transform: 'rotate(10deg)' },
    color: '#F39C12',
    content: (
      <svg viewBox="0 0 80 100">
        <circle cx="40" cy="45" r="20" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M28,63 L28,75 L52,75 L52,63" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20,35 L25,28 M30,20 L33,13 M40,15 L40,5 M50,20 L53,13 M60,35 L65,28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  // 3. Mid Left - Communication Bubbles (MOVED DOWN)
  { styles: { top: '70vh', left: '25vw', width: 250, height: 220, transform: 'rotate(5deg)' },
    color: 'primary.main',
    content: (
       <svg viewBox="0 0 100 100">
        <rect x="20" y="30" width="35" height="25" rx="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M30,55 L27,62 L35,55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="45" y="45" width="35" height="25" rx="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M70,70 L73,77 L65,70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  // 4. Bottom Right - Achievement Star
  { styles: { bottom: '10vh', right: '8vw', width: 180, height: 180, transform: 'rotate(-5deg)' },
    color: '#F39C12',
    content: (
      <svg viewBox="0 0 100 100">
        <path d="M50,20 L55,40 L75,45 L57,60 L60,80 L50,70 L40,80 L43,60 L25,45 L45,40 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  // 5. Bottom Left - Abstract Squiggle
  { styles: { bottom: '12vh', left: '5vw', width: 160, height: 120, transform: 'rotate(20deg)' },
    color: '#E74C3C',
    content: (
      <svg viewBox="0 0 160 120">
        <path d="M10,60 Q40,10 80,60 T150,60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    )
  },
  // 6. Center Right - Connecting Dots
  { styles: { top: '50%', right: '15vw', transform: 'translateY(-50%)', width: 150, height: 100 },
    color: 'primary.main',
    content: (
        <svg viewBox="0 0 150 100">
            <circle cx="20" cy="50" r="8" fill="currentColor" opacity="0.6"/>
            <circle cx="75" cy="50" r="8" fill="currentColor" opacity="0.6"/>
            <circle cx="130" cy="50" r="8" fill="currentColor" opacity="0.6"/>
            <path d="M28,50 L67,50 M83,50 L122,50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3"/>
        </svg>
    )
  },
  // 7. Top Center - Plus Pattern
  { styles: { top: '8vh', left: '50%', transform: 'translateX(-50%)', width: 120, height: 120 },
    color: '#E74C3C',
    content: (
        <svg viewBox="0 0 100 100">
             <path d="M20,30 L30,30 M25,25 L25,35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
             <path d="M70,20 L80,20 M75,15 L75,25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
             <path d="M30,80 L40,80 M35,75 L35,85" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
             <path d="M80,70 L90,70 M85,65 L85,75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
  },
  // 8. Book of Knowledge
  { styles: { top: '65vh', right: '18vw', width: 130, height: 130, transform: 'rotate(15deg)' },
    color: '#9B59B6',
    content: (
        <svg viewBox="0 0 100 100">
            <path d="M20,80 L20,20 Q50,10 80,20 L80,80 Q50,70 20,80 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M20,20 Q50,30 80,20" fill="none" stroke="currentColor" strokeWidth="2.5"/>
            <path d="M50,15 L50,80" fill="none" stroke="currentColor" strokeWidth="2.5"/>
        </svg>
    )
  },
  // --- 9. THE NEW DOODLE - LARGE PAPER PLANE ---
  { styles: { top: '40vh', left: '5vw', width: 200, height: 200, transform: 'rotate(20deg)' },
    color: '#3498DB', // A friendly, vibrant blue
    content: (
        <svg viewBox="0 0 100 100">
            <path d="M15,50 L95,10 L45,60 L55,90 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M50,55 L95,10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M10,55 Q20,60 30,55 T 50,55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    )
  },
];

const BackgroundDoodles = () => {
  return (
    <Box 
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.35, 
      }}
    >
      {doodlesFull.map((doodle, index) => (
        <Box 
          key={index} 
          sx={{
            position: 'absolute',
            color: doodle.color,
            ...doodle.styles
          }}
        >
          {doodle.content}
        </Box>
      ))}
    </Box>
  );
};

export default BackgroundDoodles;