import { useEffect, useState, useMemo, useRef } from 'react';
import { getConversations, getConversation, sendMessage } from '../services/messageService';
import userService from '../services/userService';
import { createSignalClient } from '../services/signalClient';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Container,
  IconButton,
  Divider,
} from '@mui/material';
import { MessageSquare, Send, User, Sparkles } from 'lucide-react';
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

  const chatBottomRef = useRef(null);

  // Real-time WebSocket connection
  useEffect(() => {
    if (!token || !userProfile) return;

    const client = createSignalClient(process.env.REACT_APP_API_URL);

    client.onConnect = () => {
      client.subscribe(`/user/${userProfile.email}/topic/messages`, (message) => {
        const newMessage = JSON.parse(message.body);

        setThreads((prevThreads) => {
          const partnerId = newMessage.senderId;
          const otherThreads = prevThreads.filter(
            (t) =>
              !(
                (t.senderId === userProfile.id && t.recipientId === partnerId) ||
                (t.recipientId === userProfile.id && t.senderId === partnerId)
              )
          );
          return [newMessage, ...otherThreads];
        });

        if (newMessage.senderId === activePartnerId) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    };

    client.activate();
    return () => {
      if (client) client.deactivate();
    };
  }, [token, userProfile, activePartnerId]);

  // Initial fetch of threads
  useEffect(() => {
    if (!token || !userProfile) return;
    setLoadingThreads(true);
    getConversations()
      .then((initialThreads) => {
        setThreads(initialThreads || []);
        const userIds = new Set(
          (initialThreads || []).map((t) =>
            t.senderId === userProfile.id ? t.recipientId : t.senderId
          )
        );
        if (userIds.size > 0) {
          Promise.all(Array.from(userIds).map((id) => userService.getPublicProfile(id))).then(
            (userProfiles) => {
              setUsersMap((prev) =>
                userProfiles.reduce((map, profile) => ({ ...map, [profile.id]: profile }), {})
              );
            }
          );
        }
      })
      .finally(() => setLoadingThreads(false));
  }, [token, userProfile]);

  // Fetch conversation
  const selectThread = (partnerId) => {
    if (!token) return;
    setActivePartnerId(partnerId);
    setLoadingMessages(true);
    getConversation(partnerId)
      .then(setMessages)
      .finally(() => setLoadingMessages(false));
  };

  const activeChatPartner = useMemo(
    () => usersMap[activePartnerId] || null,
    [activePartnerId, usersMap]
  );

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSend = async () => {
    if (!draft.trim() || !activeChatPartner) return;
    try {
      const sentMessage = await sendMessage({
        recipientId: activeChatPartner.id,
        content: draft.trim(),
      });

      setMessages((prev) => [...prev, sentMessage]);
      setDraft('');

      setThreads((prevThreads) => {
        const otherThreads = prevThreads.filter(
          (t) =>
            !(
              (t.senderId === userProfile.id && t.recipientId === activeChatPartner.id) ||
              (t.recipientId === userProfile.id && t.senderId === activeChatPartner.id)
            )
        );
        return [sentMessage, ...otherThreads];
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: 'calc(100vh - 140px)', py: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <MessageSquare size={20} color="#0f3822" />
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              color: '#0d1e16',
            }}
          >
            Direct Messages
          </Typography>
        </Box>

        <Paper
          sx={{
            display: 'flex',
            height: 'calc(100vh - 240px)',
            minHeight: 520,
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(13, 30, 22, 0.08)',
            boxShadow: '0 12px 32px -8px rgba(13, 30, 22, 0.08)',
          }}
        >
          {/* Threads List Sidebar */}
          <Box
            sx={{
              width: { xs: 260, sm: 320, md: 360 },
              borderRight: '1px solid rgba(13, 30, 22, 0.08)',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(13, 30, 22, 0.06)' }}>
              <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0d1e16' }}>
                Conversations ({threads.length})
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {loadingThreads ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : threads.length > 0 ? (
                <List disablePadding>
                  {threads.map((thread) => {
                    const partnerId =
                      thread.senderId === userProfile.id ? thread.recipientId : thread.senderId;
                    const partner = usersMap[partnerId];
                    if (!partner) return null;

                    const isSelected = activePartnerId === partnerId;

                    return (
                      <ListItemButton
                        key={partnerId}
                        selected={isSelected}
                        onClick={() => selectThread(partnerId)}
                        sx={{
                          py: 2,
                          px: 2.5,
                          borderBottom: '1px solid rgba(13, 30, 22, 0.04)',
                          backgroundColor: isSelected ? '#eef5f1 !important' : 'transparent',
                          '&:hover': { backgroundColor: '#fbfbfa' },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={partner.avatarUrl}
                            sx={{
                              width: 44,
                              height: 44,
                              bgcolor: 'primary.main',
                              fontWeight: 700,
                            }}
                          >
                            {partner.name?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={partner.name}
                          secondary={thread.content}
                          primaryTypographyProps={{
                            fontWeight: isSelected ? 700 : 600,
                            fontSize: '0.925rem',
                            color: '#0d1e16',
                          }}
                          secondaryTypographyProps={{
                            noWrap: true,
                            fontSize: '0.8rem',
                            color: 'text.secondary',
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                  <Typography sx={{ fontSize: '0.875rem' }}>No message threads yet.</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Active Conversation Pane */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fbfbfa',
            }}
          >
            {activeChatPartner ? (
              <>
                {/* Chat Partner Header */}
                <Box
                  sx={{
                    p: 2,
                    px: 3,
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid rgba(13, 30, 22, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    src={activeChatPartner.avatarUrl}
                    sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700 }}
                  >
                    {activeChatPartner.name?.charAt(0) || 'U'}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0d1e16' }}>
                      {activeChatPartner.name}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Peer Mentor • Active
                    </Typography>
                  </Box>
                </Box>

                {/* Message Stream */}
                <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                  {loadingMessages ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress size={32} />
                    </Box>
                  ) : (
                    <>
                      {messages.map((m) => {
                        const isMe = m.senderId === userProfile.id;
                        return (
                          <Box
                            key={m.id}
                            sx={{
                              display: 'flex',
                              justifyContent: isMe ? 'flex-end' : 'flex-start',
                              mb: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: '72%',
                                p: 1.8,
                                px: 2.2,
                                borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                backgroundColor: isMe ? 'primary.main' : '#ffffff',
                                color: isMe ? '#ffffff' : '#0d1e16',
                                border: isMe ? 'none' : '1px solid rgba(13, 30, 22, 0.08)',
                                boxShadow: '0 2px 8px -2px rgba(13, 30, 22, 0.04)',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  fontSize: '0.925rem',
                                  lineHeight: 1.55,
                                  color: isMe ? '#ffffff' : '#0d1e16',
                                }}
                              >
                                {m.content}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  textAlign: 'right',
                                  fontSize: '0.7rem',
                                  mt: 0.5,
                                  opacity: isMe ? 0.8 : 0.6,
                                  color: isMe ? '#ffffff' : 'text.secondary',
                                }}
                              >
                                {dayjs(m.createdAt).format('h:mm A')}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                      <div ref={chatBottomRef} />
                    </>
                  )}
                </Box>

                {/* Message Input Box */}
                <Box
                  sx={{
                    p: 2,
                    px: 3,
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid rgba(13, 30, 22, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                  }}
                >
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type your message..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        backgroundColor: '#fbfbfa',
                      },
                    }}
                  />
                  <IconButton
                    color="primary"
                    disabled={!draft.trim()}
                    onClick={onSend}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: '#ffffff',
                      p: 1.2,
                      '&:hover': { backgroundColor: 'primary.dark' },
                      '&.Mui-disabled': { backgroundColor: '#f1f5f9', color: '#94a3b8' },
                    }}
                  >
                    <Send size={18} />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  m: 'auto',
                  textAlign: 'center',
                  p: 4,
                  maxWidth: 360,
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: '#eef5f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  <MessageSquare size={26} color="#0f3822" />
                </Box>
                <Typography variant="h6" sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, mb: 1 }}>
                  Select a Conversation
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Choose a contact from the list on the left to review chat history or plan your next skill exchange session.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
