import { useEffect, useState } from 'react';
import { listOpenSlots, bookFromSlot } from '../services/availabilityService';
import { useAuth } from '../context/AuthContext';
import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function AvailabilityPicker({ teacherId, listingId, onBooked }) {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await listOpenSlots(teacherId);
    setSlots(data);
    setLoading(false);
  };

  useEffect(() => { if (teacherId) load(); }, [teacherId]);

  const onRequest = async (slotId) => {
    const res = await bookFromSlot({ slotId, listingId }, token);
    onBooked?.(res);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>Available times</Typography>
      {loading && <Typography>Loading…</Typography>}
      {!loading && slots.length === 0 && <Typography color="text.secondary">No open slots.</Typography>}
      <List>
        {slots.map(s => (
          <ListItem key={s.id}
            secondaryAction={<Button variant="contained" onClick={() => onRequest(s.id)} disabled={!token}>Request</Button>}>
            <ListItemText
              primary={`${dayjs(s.startTime).format('MMM D, HH:mm')} → ${dayjs(s.endTime).format('HH:mm')}`}
              secondary={s.timeZone}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
