import { useEffect, useState } from 'react';
import { IconButton, Badge, Menu, MenuItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { listNotifications, unreadCount, markNotificationRead } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';

export default function NotificationBell() {
  const { token } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);

  const refresh = async () => {
    if (!token) return;
    const [c, list] = await Promise.all([unreadCount(token), listNotifications(token)]);
    setCount(c);
    setItems(list.slice(0, 10));
  };

  useEffect(() => { refresh(); }, [token]);

  const open = Boolean(anchorEl);
  const handleOpen = (e) => { setAnchorEl(e.currentTarget); refresh(); };
  const handleClose = () => setAnchorEl(null);

  const onItemClick = async (n) => {
    await markNotificationRead(n.id, token);
    setCount(Math.max(0, count - 1));
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={count} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.length === 0 && <MenuItem><ListItemText primary="No notifications" /></MenuItem>}
        {items.map(n => (
          <MenuItem key={n.id} onClick={() => onItemClick(n)}>
            <ListItemText
              primary={n.title}
              secondary={n.body}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
