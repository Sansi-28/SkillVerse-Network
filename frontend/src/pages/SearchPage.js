import React, { useState, useEffect } from 'react';
import { useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import { Search, User, Compass, ArrowLeft } from 'lucide-react';
import searchService from '../services/searchService';
import UserCard from '../components/UserCard';
import SkillCard from '../components/SkillCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ users: [], listings: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults({ users: [], listings: [] });
      setLoading(false);
      return;
    }
    setLoading(true);
    searchService
      .search(query)
      .then((response) => setResults(response.data || { users: [], listings: [] }))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [query]);

  const userCount = results.users?.length || 0;
  const listingCount = results.listings?.length || 0;
  const totalCount = userCount + listingCount;

  return (
    <Box sx={{ backgroundColor: '#fbfaf7', minHeight: '100vh', pb: 12 }}>
      {/* Search Header Banner */}
      <Box
        sx={{
          pt: { xs: 5, md: 7 },
          pb: 4,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(10, 51, 28, 0.08)',
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Button
            component={RouterLink}
            to="/discover"
            startIcon={<ArrowLeft size={16} />}
            sx={{
              color: '#55655c',
              fontWeight: 600,
              fontSize: '0.85rem',
              mb: 2,
              textTransform: 'none',
              '&:hover': { color: '#0a331c', backgroundColor: 'transparent' },
            }}
          >
            Back to Sessions
          </Button>

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
            Search Results
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: { xs: '1.8rem', sm: '2.4rem' },
              fontWeight: 700,
              color: '#0a331c',
              mb: 1,
            }}
          >
            "{query}"
          </Typography>

          <Typography sx={{ color: '#55655c', fontSize: '0.9rem' }}>
            {totalCount} result{totalCount === 1 ? '' : 's'} ({listingCount} session{listingCount === 1 ? '' : 's'}, {userCount} mentor{userCount === 1 ? '' : 's'})
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} thickness={4} />
          </Box>
        ) : totalCount > 0 ? (
          <Grid container spacing={4}>
            {/* Left: Mentors Column */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <User size={18} color="#0f3822" />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#0d1e16',
                  }}
                >
                  Mentors ({userCount})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {userCount > 0 ? (
                  results.users.map((user) => <UserCard key={user.id} user={user} />)
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(13, 30, 22, 0.06)' }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      No mentors found matching "{query}".
                    </Typography>
                  </Paper>
                )}
              </Box>
            </Grid>

            {/* Right: Listings Column */}
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Compass size={18} color="#0f3822" />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Outfit", sans-serif',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: '#0d1e16',
                  }}
                >
                  Skill Listings ({listingCount})
                </Typography>
              </Box>

              {listingCount > 0 ? (
                <Grid container spacing={3}>
                  {results.listings.map((listing) => (
                    <Grid item key={listing.id} xs={12} sm={6}>
                      <SkillCard listing={listing} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(13, 30, 22, 0.06)' }}>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                    No skill listings matched "{query}".
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        ) : (
          <Paper
            sx={{
              p: { xs: 5, md: 8 },
              textAlign: 'center',
              borderRadius: '24px',
              border: '1px solid rgba(13, 30, 22, 0.08)',
              maxWidth: 560,
              mx: 'auto',
              mt: 4,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '16px',
                backgroundColor: '#eef5f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              <Search size={26} color="#0f3822" />
            </Box>
            <Typography variant="h5" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, mb: 1 }}>
              No results for "{query}"
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3.5, lineHeight: 1.6 }}>
              Check for typos, try using broader keywords, or explore our full community directory.
            </Typography>
            <Button component={RouterLink} to="/discover" variant="contained" color="primary">
              Browse All Skills
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default SearchPage;
