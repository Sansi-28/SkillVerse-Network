import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Avatar,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { MessageSquare, Send } from 'lucide-react';
import { sendMessage } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import searchService from '../services/searchService';

export default function ComposeMessageDialog({
  open,
  onClose,
  presetRecipient,
  defaultText = '',
  bookingId = null,
}) {
  const { token, userProfile } = useAuth();
  const [recip, setRecip] = useState(presetRecipient || null);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [content, setContent] = useState(defaultText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const showPicker = !presetRecipient;

  useEffect(() => {
    if (!showPicker || !query.trim()) {
      setOptions([]);
      return;
    }
    let active = true;
    searchService
      .search(query)
      .then((res) => {
        if (!active) return;
        const users = (res.data?.users || []).filter(
          (u) => String(u.id) !== String(userProfile?.id)
        );
        setOptions(users);
      })
      .catch(() => setOptions([]));
    return () => {
      active = false;
    };
  }, [query, showPicker, userProfile]);

  useEffect(() => {
    setRecip(presetRecipient || null);
  }, [presetRecipient]);

  const canSend = useMemo(() => {
    if (!token) return false;
    if (!content.trim()) return false;
    if (showPicker && !recip) return false;
    return true;
  }, [token, content, showPicker, recip]);

  const handleSend = async () => {
    if (!canSend) return;
    setSubmitting(true);
    setError('');
    try {
      await sendMessage(
        { recipientId: recip.id, bookingId, content: content.trim() },
        token
      );
      onClose?.({ recipient: recip });
      setContent('');
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose?.()}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          p: { xs: 1, sm: 2 },
          boxShadow: '0 24px 64px -12px rgba(13, 30, 22, 0.2)',
          border: '1px solid rgba(13, 30, 22, 0.08)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <MessageSquare size={18} color="#0f3822" />
          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '0.8rem', color: 'primary.main', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Direct Message
          </Typography>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            color: '#0d1e16',
            letterSpacing: '-0.02em',
          }}
        >
          {presetRecipient ? `Message ${presetRecipient.name}` : 'New Conversation'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {showPicker ? (
          <Autocomplete
            options={options}
            getOptionLabel={(o) => o.name || `User #${o.id}`}
            onChange={(_, val) => setRecip(val || null)}
            renderOption={(props, option) => (
              <Box
                component="li"
                {...props}
                key={option.id}
                sx={{ display: 'flex', gap: 1.5, alignItems: 'center', py: 1 }}
              >
                <Avatar src={option.avatarUrl} sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {option.name?.charAt(0) || 'U'}
                </Avatar>
                <Typography sx={{ fontWeight: 600 }}>{option.name || `User #${option.id}`}</Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Find Community Member"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by mentor name or topic..."
                sx={{ mb: 2.5, mt: 1 }}
              />
            )}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, mt: 1, p: 1.5, borderRadius: '14px', bgcolor: '#fbfbfa', border: '1px solid rgba(13, 30, 22, 0.06)' }}>
            <Avatar src={presetRecipient?.avatarUrl} sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
              {presetRecipient?.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0d1e16' }}>
                {presetRecipient?.name || `User #${presetRecipient?.id}`}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                Recipient
              </Typography>
            </Box>
          </Box>
        )}

        <TextField
          label="Your Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say hello, describe the skill you want to discuss, or propose a time..."
          fullWidth
          multiline
          minRows={4}
          variant="outlined"
        />

        {error && (
          <Box sx={{ mt: 2, p: 1.5, borderRadius: '12px', bgcolor: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
            {error}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={() => onClose?.()} disabled={submitting} sx={{ borderRadius: '50px', px: 2.5 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          color="primary"
          disabled={!canSend || submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Send size={15} />}
          sx={{
            borderRadius: '50px',
            px: 3.5,
            fontWeight: 700,
          }}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
}
