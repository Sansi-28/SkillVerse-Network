import { useEffect, useState } from 'react';
import { listOpenSlots, bookFromSlot } from '../services/availabilityService';
import { useAuth } from '../context/AuthContext';
import { Box, Button, List, ListItem, ListItemText, Paper, Typography, Chip } from '@mui/material';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';

export default function AvailabilityPicker({ teacherId, listingId, onBooked }) {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listOpenSlots(teacherId);
      setSlots(data || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (teacherId) load();
  }, [teacherId]);

  const onRequest = async (slotId) => {
    try {
      const res = await bookFromSlot({ slotId, listingId }, token);
      onBooked?.(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: '18px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(13, 30, 22, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Clock size={16} color="#0f3822" />
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#0d1e16',
          }}
        >
          Available Time Slots
        </Typography>
      </Box>

      {loading && <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>Loading availability…</Typography>}

      {!loading && slots.length === 0 && (
        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
          No scheduled open slots. You can still send a general booking request!
        </Typography>
      )}

      <List disablePadding>
        {slots.map((s) => (
          <ListItem
            key={s.id}
            disableGutters
            sx={{
              py: 1,
              borderBottom: '1px solid rgba(13, 30, 22, 0.04)',
            }}
            secondaryAction={
              <Button
                size="small"
                variant="contained"
                onClick={() => onRequest(s.id)}
                disabled={!token}
                sx={{ borderRadius: '50px', fontSize: '0.78rem', px: 2 }}
              >
                Request Slot
              </Button>
            }
          >
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0d1e16' }}>
                  {dayjs(s.startTime).format('MMM D • h:mm A')} → {dayjs(s.endTime).format('h:mm A')}
                </Typography>
              }
              secondary={<Chip size="small" label={s.timeZone || 'UTC'} sx={{ height: 18, fontSize: '0.68rem', mt: 0.3 }} />}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
