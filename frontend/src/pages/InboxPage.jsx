import { useEffect, useState, useMemo, useRef } from 'react';
import { getConversations, getConversation, sendMessage } from '../services/messageService';
import userService from '../services/userService';
import { createSignalClient } from '../services/signalClient'; // For WebSocket
import { useAuth } from '../context/AuthContext';
import {
  Box, List, ListItemButton, ListItemAvatar, Avatar, ListItemText,
  Typography, TextField, Button, Paper, CircularProgress, Container
} from '@mui/material';
import dayjs from 'dayjs';

export default function InboxPage() {
  const { token, userProfile } = useAuth();
  const [threads, setThreads] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [activePartnerId, setActivePartnerId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState('');
  
  const chatBottomRef = useRef(null); // Ref to auto-scroll

  // --- THE REAL-TIME FIX (FRONTEND) ---
  useEffect(() => {
    if (!token || !userProfile) return;

    const client = createSignalClient(process.env.REACT_APP_API_URL);

    client.onConnect = () => {
      console.log('Inbox WebSocket Connected!');
      // Subscribe to the private channel where the server will push messages for THIS user
      client.subscribe(`/user/${userProfile.email}/topic/messages`, (message) => {
        const newMessage = JSON.parse(message.body);
        
        // When a new message arrives:
        // 1. Update the threads list on the left
        setThreads(prevThreads => {
            const partnerId = newMessage.senderId;
            // Remove the old thread for this conversation
            const otherThreads = prevThreads.filter(t => 
                !((t.senderId === userProfile.id && t.recipientId === partnerId) || 
                  (t.recipientId === userProfile.id && t.senderId === partnerId))
            );
            // Add the new message summary to the top of the list
            return [newMessage, ...otherThreads];
        });
        
        // 2. If the user is currently viewing this chat, add the new message to the window
        if (newMessage.senderId === activePartnerId) {
          setMessages(prev => [...prev, newMessage]);
        }
      });
    };

    client.activate();

    // Disconnect when the component unmounts
    return () => { if (client) client.deactivate(); };
  }, [token, userProfile, activePartnerId]); // Dependency on activePartnerId is crucial

  // Initial fetch of threads
  useEffect(() => {
    if (!token || !userProfile) return;
    setLoadingThreads(true);
    getConversations().then(initialThreads => {
      setThreads(initialThreads);
      const userIds = new Set(initialThreads.map(t => t.senderId === userProfile.id ? t.recipientId : t.senderId));
      if (userIds.size > 0) {
        Promise.all(Array.from(userIds).map(id => userService.getPublicProfile(id)))
          .then(userProfiles => {
            setUsersMap(prev => userProfiles.reduce((map, profile) => ({ ...map, [profile.id]: profile }), {}));
          });
      }
    }).finally(() => setLoadingThreads(false));
  }, [token, userProfile]);

  // Fetch full conversation when a thread is clicked
  const selectThread = (partnerId) => {
    if (!token) return;
    setActivePartnerId(partnerId);
    setLoadingMessages(true);
    getConversation(partnerId).then(setMessages).finally(() => setLoadingMessages(false));
  };

  const activeChatPartner = useMemo(() => usersMap[activePartnerId] || null, [activePartnerId, usersMap]);

  // Auto-scroll to bottom of chat
  useEffect(() => { chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Function to handle sending a message
  const onSend = async () => {
    if (!draft.trim() || !activeChatPartner) return;
    try {
      // Send the message and get the saved object back from the server
      const sentMessage = await sendMessage({ recipientId: activeChatPartner.id, content: draft });
      
      // Optimistically update the UI immediately
      setMessages(prev => [...prev, sentMessage]); // Add to the bottom of the chat
      setDraft(''); // Clear the input box

      // Update the thread list to show the new message and move it to the top
      setThreads(prevThreads => {
        const otherThreads = prevThreads.filter(t => !((t.senderId === userProfile.id && t.recipientId === activeChatPartner.id) || (t.recipientId === userProfile.id && t.senderId === activeChatPartner.id)));
        return [sentMessage, ...otherThreads];
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Inbox</Typography>
      <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
        <Paper sx={{ width: 320, overflow: 'auto' }}>
          {loadingThreads ? (<CircularProgress sx={{ m: 2 }} />) : (
            <List>
              {threads.map((thread) => {
                const partnerId = thread.senderId === userProfile.id ? thread.recipientId : thread.senderId;
                const partner = usersMap[partnerId];
                if (!partner) return null; // Don't render if user data hasn't loaded yet
                return (
                  <ListItemButton key={partnerId} selected={activePartnerId === partnerId} onClick={() => selectThread(partnerId)}>
                    <ListItemAvatar><Avatar src={partner.avatarUrl} /></ListItemAvatar>
                    <ListItemText primary={partner.name} secondary={thread.content} secondaryTypographyProps={{ noWrap: true, textOverflow: 'ellipsis' }} />
                  </ListItemButton>
                );
              })}
            </List>
          )}
        </Paper>
        <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeChatPartner ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}><Typography variant="h6">{`Chat with ${activeChatPartner.name}`}</Typography></Box>
              <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
                {loadingMessages ? (<CircularProgress sx={{ display: 'block', m: 'auto' }} />) : (
                  <>
                    {messages.map(m => (
                      <Paper key={m.id} sx={{ p: 1.5, mb: 1, maxWidth: '70%', ml: m.senderId === userProfile.id ? 'auto' : 0, mr: m.senderId !== userProfile.id ? 'auto' : 0, bgcolor: m.senderId === userProfile.id ? 'primary.light' : 'grey.200' }}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{m.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7 }}>{dayjs(m.createdAt).format('h:mm A')}</Typography>
                      </Paper>
                    ))}
                    <div ref={chatBottomRef} />
                  </>
                )}
              </Box>
              <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: '1px solid #eee' }}>
                <TextField fullWidth size="small" placeholder="Type a message..." value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSend()}/>
                <Button variant="contained" onClick={onSend} disabled={!draft.trim()}>Send</Button>
              </Box>
            </>
          ) : (
            <Box sx={{ m: 'auto', textAlign: 'center', color: 'text.secondary' }}>
              <Typography variant="h6">Select a conversation</Typography>
              <Typography>Your messages with other users will appear here.</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}