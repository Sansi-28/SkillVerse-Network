import api from './api';

const API_URL = '/api/bookings';

const sendBookingRequest = (listingId) => {
  return api.post(API_URL, { listingId });
};

const acceptBooking = (bookingId) => {
    return api.post(`${API_URL}/${bookingId}/accept`);
};

const rejectBooking = (bookingId) => {
    return api.post(`${API_URL}/${bookingId}/reject`);
};

const completeBooking = (bookingId) => {
    return api.post(`${API_URL}/${bookingId}/complete`);
};

const openDispute = (bookingId) => {
    return api.post(`${API_URL}/${bookingId}/dispute`);
};

const getSentRequests = () => {
    return api.get(`${API_URL}/sent`);
};

const getReceivedRequests = () => {
    return api.get(`${API_URL}/received`);
};

const bookingService = {
  sendBookingRequest,
  acceptBooking,
  rejectBooking,
  completeBooking,
  openDispute,
  getSentRequests,
  getReceivedRequests
};

export default bookingService;