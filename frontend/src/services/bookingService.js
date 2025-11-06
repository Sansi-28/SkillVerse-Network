import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL + '/api/bookings';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
};

const sendBookingRequest = (listingId) => {
  return axios.post(API_URL, { listingId }, { headers: getAuthHeaders() });
};

const acceptBooking = (bookingId) => {
    return axios.post(`${API_URL}/${bookingId}/accept`, {}, { headers: getAuthHeaders() });
};

const rejectBooking = (bookingId) => {
    return axios.post(`${API_URL}/${bookingId}/reject`, {}, { headers: getAuthHeaders() });
};

// --- NEW FUNCTION ---
const completeBooking = (bookingId) => {
    return axios.post(`${API_URL}/${bookingId}/complete`, {}, { headers: getAuthHeaders() });
};

const getSentRequests = () => {
    return axios.get(`${API_URL}/sent`, { headers: getAuthHeaders() });
};

const getReceivedRequests = () => {
    return axios.get(`${API_URL}/received`, { headers: getAuthHeaders() });
};

const bookingService = {
  sendBookingRequest,
  acceptBooking,
  rejectBooking,
  completeBooking, // <-- Add to export
  getSentRequests,
  getReceivedRequests
};

export default bookingService;