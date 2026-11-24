import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Search, Plus } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import listingService from '../services/listingService';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'acoustic', label: 'Acoustics & Sound' },
  { id: 'computational', label: 'Computation' },
  { id: 'tactile', label: 'Wood & Joinery' },
  { id: 'culinary', label: 'Culinary & Baking' },
  { id: 'visual', label: 'Optics & Darkroom' },
];

const DiscoverPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { data: listings } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      const response = await listingService.getAllListings();
      return response.data;
    },
  });

  const allListings = listings || listingService.DEFAULT_CRAFT_LISTINGS;

  const filteredListings = useMemo(() => {
    let list = [...allListings];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (l) =>
          (l.title && l.title.toLowerCase().includes(q)) ||
          (l.description && l.description.toLowerCase().includes(q)) ||
          (l.teacherName && l.teacherName.toLowerCase().includes(q))
      );
    }

    if (activeCategory !== 'all') {
      list = list.filter((l) => {
        const text = `${l.guild || ''} ${l.title || ''} ${l.description || ''}`.toLowerCase();
        if (activeCategory === 'acoustic') return text.includes('acoustic') || text.includes('sonic') || text.includes('music') || text.includes('cello') || text.includes('sound');
        if (activeCategory === 'computational') return text.includes('computation') || text.includes('code') || text.includes('shader') || text.includes('webgl') || text.includes('software');
        if (activeCategory === 'tactile') return text.includes('tactile') || text.includes('wood') || text.includes('joinery') || text.includes('ceramic') || text.includes('clay');
        if (activeCategory === 'culinary') return text.includes('culinary') || text.includes('sourdough') || text.includes('baking') || text.includes('fermentation') || text.includes('coffee');
        if (activeCategory === 'visual') return text.includes('visual') || text.includes('darkroom') || text.includes('photo') || text.includes('chemistry') || text.includes('film');
        return true;
      });
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.tokenPrice - b.tokenPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.tokenPrice - a.tokenPrice);
    } else {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [allListings, searchTerm, activeCategory, sortBy]);

  return (
    <Box sx={{ backgroundColor: '#fbfaf7', minHeight: '100vh', pb: 12 }}>
      {/* Header */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.72rem',
                color: '#84968b',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: 0.5,
              }}
            >
              Directory
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: '2.2rem', md: '2.8rem' },
                color: '#0a331c',
              }}
            >
              Explore Sessions
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/create-listing"
            variant="contained"
            startIcon={<Plus size={16} />}
            sx={{
              backgroundColor: '#0a331c',
              color: '#ffffff',
              borderRadius: '50px',
              px: 3,
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#144627', boxShadow: 'none' },
            }}
          >
            Teach a Skill
          </Button>
        </Box>

        {/* Search & Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search craft, discipline, or mentor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#798a81" />
                </InputAdornment>
              ),
            }}
            sx={{
              flexGrow: 1,
              maxWidth: { xs: '100%', sm: 360 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                fontSize: '0.875rem',
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                borderRadius: '50px',
                backgroundColor: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              <MenuItem value="recent">Sort: Newest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Minimal Category Chips */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={cat.label}
              onClick={() => setActiveCategory(cat.id)}
              variant={activeCategory === cat.id ? 'filled' : 'outlined'}
              sx={{
                borderRadius: '50px',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: activeCategory === cat.id ? '#0a331c' : '#ffffff',
                color: activeCategory === cat.id ? '#ffffff' : '#4a5951',
                borderColor: activeCategory === cat.id ? '#0a331c' : 'rgba(10, 51, 28, 0.12)',
                '&:hover': {
                  backgroundColor: activeCategory === cat.id ? '#0a331c' : '#f1efe9',
                },
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Grid */}
      <Container maxWidth="lg">
        <Typography sx={{ fontSize: '0.825rem', color: '#798a81', mb: 3 }}>
          Showing {filteredListings.length} session{filteredListings.length === 1 ? '' : 's'}
        </Typography>

        <Grid container spacing={3.5}>
          {filteredListings.map((listing) => (
            <Grid key={listing.id} item xs={12} sm={6} md={4}>
              <SkillCard listing={listing} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DiscoverPage;
