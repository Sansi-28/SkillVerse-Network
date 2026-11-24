import { useEffect, useState } from 'react';
import { listMySlots, createSlot, deleteSlot } from '../services/availabilityService';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Calendar, Trash2, Clock, Plus, Globe } from 'lucide-react';
import dayjs from 'dayjs';

export default function ManageAvailability() {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  const load = async () => {
    try {
      const data = await listMySlots(token);
      setSlots(data || []);
    } catch (err) {
      console.error('Failed to load slots', err);
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const onCreate = async () => {
    if (!start || !end) return;
    try {
      await createSlot(
        {
          startTime: new Date(start).toISOString(),
          endTime: new Date(end).toISOString(),
          timeZone: tz,
        },
        token
      );
      setStart('');
      setEnd('');
      load();
    } catch (err) {
      console.error('Failed to create slot', err);
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteSlot(id, token);
      load();
    } catch (err) {
      console.error('Failed to delete slot', err);
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 3, sm: 4 },
        borderRadius: '24px',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(13, 30, 22, 0.08)',
        boxShadow: '0 2px 8px -2px rgba(13, 30, 22, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
        <Calendar size={20} color="#0f3822" />
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 800,
            fontSize: '1.25rem',
            color: '#0d1e16',
          }}
        >
          Your Teaching Availability
        </Typography>
      </Box>
      <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', mb: 3 }}>
        Set open time slots when you are available for 1:1 sessions with learners.
      </Typography>

      {/* Add Slot Row */}
      <Box
        sx={{
          p: 2.5,
          borderRadius: '16px',
          backgroundColor: '#fbfbfa',
          border: '1px solid rgba(13, 30, 22, 0.06)',
          mb: 4,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d1e16', mb: 2 }}>
          Schedule New Session Slot
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            type="datetime-local"
            label="Start Time"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={start}
            onChange={(e) => setStart(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            type="datetime-local"
            label="End Time"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Time Zone"
            size="small"
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={onCreate}
            disabled={!start || !end}
            sx={{
              borderRadius: '50px',
              px: 3,
              fontWeight: 700,
              height: '40px',
              flexShrink: 0,
            }}
          >
            Add Slot
          </Button>
        </Stack>
      </Box>

      {/* Slots List */}
      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0d1e16', mb: 2 }}>
        Current Scheduled Slots ({slots.length})
      </Typography>

      <Stack spacing={1.5}>
        {slots.map((s) => (
          <Box
            key={s.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderRadius: '14px',
              backgroundColor: s.reserved ? '#f4f5f1' : '#ffffff',
              border: '1px solid rgba(13, 30, 22, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Clock size={16} color={s.reserved ? '#73847b' : '#0f3822'} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: '#0d1e16' }}>
                {dayjs(s.startTime).format('MMM D, YYYY • h:mm A')} → {dayjs(s.endTime).format('h:mm A')}
              </Typography>
              <Chip
                size="small"
                label={s.timeZone || 'UTC'}
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
              {s.reserved && (
                <Chip
                  size="small"
                  label="Reserved"
                  color="warning"
                  sx={{ fontSize: '0.7rem', height: 20, fontWeight: 700 }}
                />
              )}
            </Box>

            {!s.reserved && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(s.id)}
                sx={{
                  '&:hover': { backgroundColor: 'error.light' },
                }}
              >
                <Trash2 size={16} />
              </IconButton>
            )}
          </Box>
        ))}

        {slots.length === 0 && (
          <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', py: 2 }}>
            No upcoming availability slots added yet. Add slots above so learners can see when you are open to teach.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
