import axios from 'axios';

const API = process.env.REACT_APP_API_URL + '/api/notifications';

export const listNotifications = async (token) => {
  const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const unreadCount = async (token) => {
  const res = await axios.get(`${API}/unread-count`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data.count;
};

export const markNotificationRead = async (id, token) => {
  await axios.post(`${API}/${id}/read`, null, { headers: { Authorization: `Bearer ${token}` } });
};
