import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Badge, Menu, MenuItem, ListItemText, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
      setItems(list.slice(0, 10)); // Show latest 10
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000); // Poll for new notifications every minute
    return () => clearInterval(interval);
  }, [token]);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    refresh();
  };
  const handleClose = () => setAnchorEl(null);

  // --- THE FIX: Mark as read and navigate on click ---
  const onItemClick = async (n) => {
    // Optimistically update UI
    if (!n.readAt) {
      setCount(Math.max(0, count - 1));
      setItems(prevItems => prevItems.filter(item => item.id !== n.id));
    }
    handleClose();

    // Navigate to the relevant page
    if (n.type === 'MESSAGE') {
      navigate('/inbox');
    } else if (n.bookingId) {
      navigate('/dashboard');
    }

    // Mark as read on the backend
    try {
      await markNotificationRead(n.id, token);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Optional: Revert optimistic update if API call fails
      refresh();
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={count} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ sx: { minWidth: 320, maxWidth: 400 } }}>
        {items.length === 0 && <MenuItem disabled><ListItemText primary="No new notifications" /></MenuItem>}
        {items.map(n => (
          <MenuItem key={n.id} onClick={() => onItemClick(n)} sx={{ backgroundColor: n.readAt ? 'transparent' : 'background.highlight', whiteSpace: 'normal' }}>
            <ListItemText
              primary={n.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {n.body}
                  </Typography>
                  <Typography component="span" variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7 }}>
                    {dayjs(n.createdAt).fromNow()}
                  </Typography>
                </>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}