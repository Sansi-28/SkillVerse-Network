import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Bell, Sparkles, MessageSquare, Calendar } from 'lucide-react';
import { listNotifications, unreadCount, markNotificationRead } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NotificationBell() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);

  const refresh = async () => {
    if (!token) return;
    try {
      const [c, list] = await Promise.all([unreadCount(token), listNotifications(token)]);
      setCount(c);
      setItems((list || []).slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    refresh();
  };
  const handleClose = () => setAnchorEl(null);

  const onItemClick = async (n) => {
    if (!n.readAt) {
      setCount(Math.max(0, count - 1));
      setItems((prevItems) => prevItems.filter((item) => item.id !== n.id));
    }
    handleClose();

    if (n.type === 'MESSAGE') {
      navigate('/inbox');
    } else if (n.bookingId) {
      navigate('/dashboard');
    }

    try {
      await markNotificationRead(n.id, token);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      refresh();
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: 'text.secondary',
          p: 1,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: 'rgba(15, 56, 34, 0.06)',
            color: 'primary.main',
          },
        }}
      >
        <Badge
          badgeContent={count}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              height: 18,
              minWidth: 18,
              fontWeight: 700,
            },
          }}
        >
          <Bell size={20} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            minWidth: 340,
            maxWidth: 400,
            mt: 1.5,
            borderRadius: '20px',
            boxShadow: '0 16px 40px -8px rgba(13, 30, 22, 0.15)',
            border: '1px solid rgba(13, 30, 22, 0.08)',
            p: 1,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: '1rem', color: '#0d1e16' }}>
            Notifications
          </Typography>
        </Box>
        <Divider sx={{ my: 0.5 }} />

        {items.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              No new notifications right now.
            </Typography>
          </Box>
        ) : (
          items.map((n) => (
            <MenuItem
              key={n.id}
              onClick={() => onItemClick(n)}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                px: 2,
                mb: 0.5,
                backgroundColor: n.readAt ? 'transparent' : 'rgba(16, 185, 129, 0.08)',
                whiteSpace: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(15, 56, 34, 0.05)',
                },
              }}
            >
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0d1e16' }}>
                    {n.title}
                  </Typography>
                }
                secondary={
                  <Box component="span" sx={{ display: 'block', mt: 0.3 }}>
                    <Typography component="span" variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                      {n.body}
                    </Typography>
                    <Typography component="span" variant="caption" sx={{ display: 'block', mt: 0.5, color: '#73847b', fontSize: '0.72rem' }}>
                      {dayjs(n.createdAt).fromNow()}
                    </Typography>
                  </Box>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
}
