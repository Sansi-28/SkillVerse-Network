import api from './api';

export const listNotifications = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.get('/api/notifications', config);
  return res.data;
};

export const unreadCount = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.get('/api/notifications/unread-count', config);
  return res.data?.count || 0;
};

export const markNotificationRead = async (id, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  await api.post(`/api/notifications/${id}/read`, null, config);
};
