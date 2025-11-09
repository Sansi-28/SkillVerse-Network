import axios from 'axios';

const API = process.env.REACT_APP_API_URL + '/api/messages';

export const sendMessage = async ({ recipientId, bookingId = null, content }, token) => {
  const res = await axios.post(
    API,
    { recipientId, bookingId, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getConversation = async (otherUserId, token) => {
  const res = await axios.get(`${API}/with/${otherUserId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getConversations = async (token) => {
  const res = await axios.get(`${API}/conversations`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getUnreadCount = async (token) => {
  const res = await axios.get(`${API}/unread-count`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.count;
};

export const markMessageRead = async (id, token) => {
  await axios.post(`${API}/${id}/read`, null, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
