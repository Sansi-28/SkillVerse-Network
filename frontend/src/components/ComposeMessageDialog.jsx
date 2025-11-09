// frontend/src/components/ComposeMessageDialog.jsx
import { useEffect, useMemo, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Autocomplete, Avatar, Box, Typography
} from '@mui/material';
import { sendMessage } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import searchService from '../services/searchService';

export default function ComposeMessageDialog({
  open,
  onClose,
  presetRecipient,        // { id, name, avatarUrl } optional
  defaultText = '',
  bookingId = null
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
    searchService.search(query)
      .then(res => {
        if (!active) return;
        const users = (res.data?.users || []).filter(u => String(u.id) !== String(userProfile?.id));
        setOptions(users);
      })
      .catch(() => setOptions([]));
    return () => { active = false; };
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
    <Dialog open={open} onClose={() => onClose?.()} fullWidth maxWidth="sm">
      <DialogTitle>New message</DialogTitle>
      <DialogContent dividers>
        {showPicker ? (
          <Autocomplete
            options={options}
            getOptionLabel={(o) => o.name || `User #${o.id}`}
            onChange={(_, val) => setRecip(val || null)}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar src={option.avatarUrl} sx={{ width: 28, height: 28 }} />
                <Typography>{option.name || `User #${option.id}`}</Typography>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search user"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a name or skill…"
                sx={{ mb: 2 }}
              />
            )}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar src={presetRecipient?.avatarUrl} />
            <Typography variant="subtitle1">
              {presetRecipient?.name || `User #${presetRecipient?.id}`}
            </Typography>
          </Box>
        )}

        <TextField
          label="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Say hello and share context for your session…"
          fullWidth
          multiline
          minRows={3}
        />
        {!!error && (
          <Typography color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSend} variant="contained" disabled={!canSend || submitting}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
