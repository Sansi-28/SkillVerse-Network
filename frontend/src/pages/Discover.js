import React from 'react';
import SkillCard from '../components/SkillCard';
import { Grid } from '@mui/material';
import { motion } from 'framer-motion';

const sampleSkills = [
  {
    teacherName: 'Amina Patel',
    teacherAvatar: '',
    title: 'Intro to Watercolor Portraits',
    description: 'Learn the basics of watercolor portraiture — simple exercises to get you painting with confidence.',
    tokenPrice: 12,
  },
  {
    teacherName: 'Diego Ramos',
    teacherAvatar: '',
    title: 'Conversational Spanish for Travelers',
    description: 'Short, practical lessons to help you speak comfortably while traveling.',
    tokenPrice: 8,
  },
  {
    teacherName: 'Maya Chen',
    teacherAvatar: '',
    title: 'Productivity with Minimal Tools',
    description: 'Design a simple, timeless workflow using minimal apps and analog methods.',
    tokenPrice: 5,
  },
];

const Discover = () => {
  return (
    <div>
      <h2 className="page-title">Discover</h2>

      <Grid container spacing={3}>
        {sampleSkills.map((s, i) => (
          <Grid key={i} item xs={12} md={6} lg={4}>
            <motion.div whileHover={{ scale: 1.01 }} layout>
              <SkillCard skill={s} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Discover;
