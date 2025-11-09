import { useEffect, useState } from 'react';
import { getConversations, getConversation, sendMessage } from '../services/messageService';
import { useAuth } from '../context/AuthContext';
import {
  Box, List, ListItemButton, ListItemText, Divider,
  Typography, TextField, Button, Paper
} from '@mui/material';

export default function InboxPage() {
  const { token } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeUserId, setActiveUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!token) return;
    getConversations(token).then(setThreads);
  }, [token]);

  useEffect(() => {
    if (!token || !activeUserId) return;
    getConversation(activeUserId, token).then(setMessages);
  }, [token, activeUserId]);

  const onSend = async () => {
    if (!draft.trim()) return;
    const msg = await sendMessage({ recipientId: activeUserId, content: draft }, token);
    setMessages(prev => [...prev, msg]);
    setDraft('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Paper sx={{ width: 320, height: '70vh', overflow: 'auto' }}>
        <List>
          {threads.map((m) => {
            const otherId = m.senderId === m.recipientId ? m.senderId
              : (m.senderId === activeUserId ? m.recipientId : (m.senderId));
            return (
              <ListItemButton key={m.id} selected={activeUserId === otherId}
                onClick={() => setActiveUserId(otherId)}>
                <ListItemText
                  primary={`User #${m.senderId === otherId ? m.senderId : m.recipientId}`}
                  secondary={m.content}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
      <Paper sx={{ flex: 1, height: '70vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h6">{activeUserId ? `Chat with #${activeUserId}` : 'Select a conversation'}</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          {messages.map(m => (
            <Box key={m.id} sx={{ mb: 1 }}>
              <Typography variant="caption">From #{m.senderId}</Typography>
              <Typography>{m.content}</Typography>
              <Divider sx={{ my: 1 }} />
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField fullWidth size="small" placeholder="Type a message..."
            value={draft} onChange={e => setDraft(e.target.value)} />
          <Button variant="contained" onClick={onSend} disabled={!activeUserId || !draft.trim()}>Send</Button>
        </Box>
      </Paper>
    </Box>
  );
}
