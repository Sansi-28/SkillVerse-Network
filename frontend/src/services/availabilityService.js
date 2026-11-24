import api from './api';

export const listOpenSlots = async (teacherId) => {
  const res = await api.get(`/api/availability/teachers/${teacherId}/slots`);
  return res.data;
};

export const listMySlots = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.get('/api/availability/me/slots', config);
  return res.data;
};

export const createSlot = async (slot, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.post('/api/availability/slots', slot, config);
  return res.data;
};

export const deleteSlot = async (slotId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  await api.delete(`/api/availability/slots/${slotId}`, config);
};

export const bookFromSlot = async ({ slotId, listingId }, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await api.post('/api/bookings/from-slot', { slotId, listingId }, config);
  return res.data;
};
