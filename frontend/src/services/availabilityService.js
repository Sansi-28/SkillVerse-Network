import axios from 'axios';
const BASE = process.env.REACT_APP_API_URL + '/api/availability';
const BOOK = process.env.REACT_APP_API_URL + '/api/bookings';

export const listOpenSlots = async (teacherId) => {
  const res = await axios.get(`${BASE}/teachers/${teacherId}/slots`);
  return res.data;
};

export const listMySlots = async (token) => {
  const res = await axios.get(`${BASE}/me/slots`, { headers: { Authorization: `Bearer ${token}` }});
  return res.data;
};

export const createSlot = async (slot, token) => {
  const res = await axios.post(`${BASE}/slots`, slot, { headers: { Authorization: `Bearer ${token}` }});
  return res.data;
};

export const deleteSlot = async (slotId, token) => {
  await axios.delete(`${BASE}/slots/${slotId}`, { headers: { Authorization: `Bearer ${token}` }});
};

export const bookFromSlot = async ({ slotId, listingId }, token) => {
  const res = await axios.post(`${BOOK}/from-slot`, { slotId, listingId }, { headers: { Authorization: `Bearer ${token}` }});
  return res.data;
};
