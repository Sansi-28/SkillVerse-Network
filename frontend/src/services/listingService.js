import axios from 'axios';
import authService from './authService'; // <-- 1. IMPORT authService to get user data

const API_URL = process.env.REACT_APP_API_URL + '/api/listings';

// --- 2. THE MISSING HELPER FUNCTION ---
// This function gets the current user's token and creates the required header object.
const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
};
// --- END OF MISSING PART ---

const getAllListings = () => {
  return axios.get(API_URL);
};

const getListingById = (id) => {
  return axios.get(API_URL + '/' + id);
};

const getPriceSuggestion = (skill) => {
    return axios.get(`${API_URL}/price-suggestion`, { params: { skill } });
};

// --- 3. THE CORRECTED FUNCTION ---
// This function now correctly uses getAuthHeaders() to attach the token.
const createListing = (listingData) => {
    return axios.post(API_URL, listingData, { headers: getAuthHeaders() });
};

const listingService = {
  getAllListings,
  getListingById,
  getPriceSuggestion,
  createListing,
};

export default listingService;