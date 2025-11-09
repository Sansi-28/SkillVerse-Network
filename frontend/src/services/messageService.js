import api from './api';

const API = '/api/messages';

export const sendMessage = async ({ recipientId, bookingId = null, content }) => {
  // THE FIX: Return response.data directly
  const response = await api.post(API, { recipientId, bookingId, content });
  return response.data;
};

export const getConversation = async (otherUserId) => {
  // THE FIX: Return response.data directly
  const response = await api.get(`${API}/with/${otherUserId}`);
  return response.data;
};

export const getConversations = async () => {
  // THE FIX: Return response.data directly
  const response = await api.get(`${API}/conversations`);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get(`${API}/unread-count`);
  return response.data.count;
};

export const markMessageRead = async (id) => {
  await api.post(`${API}/${id}/read`, null);
};