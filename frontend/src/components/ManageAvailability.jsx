import { useEffect, useState } from 'react';
import { listMySlots, createSlot, deleteSlot } from '../services/availabilityService';
import { useAuth } from '../context/AuthContext';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function ManageAvailability() {
  const { token } = useAuth();
  const [slots, setSlots] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');

  const load = async () => {
    const data = await listMySlots(token);
    setSlots(data);
  };

  useEffect(() => { if (token) load(); }, [token]);

  const onCreate = async () => {
    await createSlot({ startTime: new Date(start).toISOString(), endTime: new Date(end).toISOString(), timeZone: tz }, token);
    setStart(''); setEnd('');
    load();
  };

  const onDelete = async (id) => {
    await deleteSlot(id, token);
    load();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Your availability</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField type="datetime-local" label="Start" value={start} onChange={e => setStart(e.target.value)} />
        <TextField type="datetime-local" label="End" value={end} onChange={e => setEnd(e.target.value)} />
        <TextField label="Time zone" value={tz} onChange={e => setTz(e.target.value)} />
        <Button variant="contained" onClick={onCreate} disabled={!start || !end}>Add slot</Button>
      </Stack>
      <Stack spacing={1}>
        {slots.map(s => (
          <Box key={s.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>
              {dayjs(s.startTime).format('MMM D, HH:mm')} → {dayjs(s.endTime).format('HH:mm')} ({s.timeZone}) {s.reserved ? '· reserved' : ''}
            </Typography>
            {!s.reserved && <Button color="error" onClick={() => onDelete(s.id)}>Delete</Button>}
          </Box>
        ))}
        {slots.length === 0 && <Typography color="text.secondary">No slots yet.</Typography>}
      </Stack>
    </Paper>
  );
}
