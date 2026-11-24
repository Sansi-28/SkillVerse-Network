import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Coins,
  Clock,
  User,
  ShieldCheck,
  Lightbulb,
} from 'lucide-react';
import listingService from '../services/listingService';
import debounce from 'lodash/debounce';
import nftCoin from '../resources/nft.png';

const CreateListingPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tokenPrice: '',
    format: '1:1 Interactive Mentorship',
    durationMinutes: 60,
  });
  const [suggestion, setSuggestion] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const debouncedFetchSuggestion = useCallback(
    debounce((skill) => {
      if (skill && skill.trim().length > 2) {
        listingService
          .getPriceSuggestion(skill)
          .then((res) => setSuggestion(res.data))
          .catch((err) => console.error(err));
      } else {
        setSuggestion(null);
      }
    }, 450),
    []
  );

  useEffect(() => {
    debouncedFetchSuggestion(formData.title);
  }, [formData.title, debouncedFetchSuggestion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplySuggestedPrice = (price) => {
    setFormData((prev) => ({ ...prev, tokenPrice: Math.round(price).toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.tokenPrice) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await listingService.createListing({
        ...formData,
        tokenPrice: parseFloat(formData.tokenPrice),
        durationMinutes: parseInt(formData.durationMinutes, 10),
      });
      navigate(`/listing/${response.data.id}`);
    } catch (err) {
      console.error('Failed to create listing', err);
      setError(err?.response?.data?.message || 'Failed to publish listing. Please verify inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', pb: 10 }}>
      {/* Breadcrumb Header */}
      <Box
        sx={{
          py: 2.5,
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(13, 30, 22, 0.06)',
          mb: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Button
            component={RouterLink}
            to="/discover"
            startIcon={<ArrowLeft size={16} />}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              '&:hover': { color: 'primary.main', backgroundColor: 'transparent' },
            }}
          >
            Back to Directory
          </Button>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: '24px',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 48px -12px rgba(13, 30, 22, 0.08)',
            border: '1px solid rgba(13, 30, 22, 0.08)',
          }}
        >
          {/* Minimal Header */}
          <Box sx={{ mb: 4 }}>
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
              New Listing
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                color: '#0a331c',
                mb: 1,
              }}
            >
              Teach a Skill
            </Typography>
            <Typography sx={{ color: '#55655c', fontSize: '0.95rem' }}>
              Offer a 1:1 craft session and set your token price.
            </Typography>
          </Box>

          {error && (
            <Box sx={{ mb: 3, p: 2, borderRadius: '12px', bgcolor: '#fee2e2', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 600 }}>
              {error}
            </Box>
          )}

          {/* Form Fields */}
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Skill Title"
                placeholder="e.g., Intro to Fullstack Web Development with React"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                helperText="Be specific about the topic, skill level, or framework you will cover."
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Session Description"
                placeholder="Explain what the learner will gain from this session, any prerequisites, and how you structure the time..."
                value={formData.description}
                onChange={handleChange}
                fullWidth
                required
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            {/* Format & Duration */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="format"
                label="Session Format"
                select
                fullWidth
                value={formData.format}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="1:1 Interactive Mentorship">1:1 Interactive Mentorship</MenuItem>
                <MenuItem value="Code Review & Consultation">Code Review & Consultation</MenuItem>
                <MenuItem value="Conversational Practice">Conversational Practice</MenuItem>
                <MenuItem value="Hands-on Project Help">Hands-on Project Help</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="durationMinutes"
                label="Duration (Minutes)"
                type="number"
                fullWidth
                value={formData.durationMinutes}
                onChange={handleChange}
                variant="outlined"
                InputProps={{ inputProps: { min: 15, max: 180, step: 15 } }}
              />
            </Grid>

            {/* Token Price */}
            <Grid item xs={12}>
              <TextField
                name="tokenPrice"
                label="Token Price"
                placeholder="e.g., 10"
                type="number"
                value={formData.tokenPrice}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                InputProps={{
                  inputProps: { min: 1 },
                  startAdornment: (
                    <Box component="img" src={nftCoin} alt="Token" sx={{ width: 20, height: 20, mr: 1 }} />
                  ),
                }}
              />
            </Grid>

            {/* Guided Pricing Recommendation Banner */}
            {suggestion && suggestion.count > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    backgroundColor: '#fffbeb',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Lightbulb size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#92400e', mb: 0.5 }}>
                      Community Pricing Guidance
                    </Typography>
                    <Typography sx={{ fontSize: '0.825rem', color: '#78350f', mb: 1 }}>
                      Based on {suggestion.count} similar listing{suggestion.count > 1 ? 's' : ''}, members charge between{' '}
                      <strong>{Number(suggestion.min || 0).toFixed(0)}</strong> and <strong>{Number(suggestion.max || 0).toFixed(0)} Tokens</strong> (Average:{' '}
                      <strong>{Number(suggestion.average || 0).toFixed(0)} Tokens</strong>).
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleApplySuggestedPrice(suggestion.average)}
                      sx={{
                        borderColor: 'rgba(245, 158, 11, 0.5)',
                        color: '#92400e',
                        fontSize: '0.75rem',
                        py: 0.3,
                        px: 1.5,
                        borderRadius: '50px',
                        '&:hover': { backgroundColor: 'rgba(245, 158, 11, 0.1)' },
                      }}
                    >
                      Use Average ({Number(suggestion.average || 0).toFixed(0)} Tokens)
                    </Button>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Action Row */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, alignItems: 'center' }}>
            <Button
              component={RouterLink}
              to="/discover"
              variant="outlined"
              sx={{ borderRadius: '50px', px: 3 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{
                borderRadius: '50px',
                px: 4,
                py: 1.3,
                fontWeight: 700,
                fontSize: '1rem',
              }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Publish Listing'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateListingPage;
