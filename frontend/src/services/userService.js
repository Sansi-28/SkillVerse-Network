import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api/users';
// This separate URL is essential
const FILE_API_URL = 'http://localhost:8080/api/files';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
};

const getUserProfile = () => {
  return axios.get(API_URL + '/me', { headers: getAuthHeaders() });
};

const getPublicProfile = (id) => {
  return axios.get(API_URL + '/' + id);
};

const updateUserProfile = (profileData) => {
  return axios.patch(API_URL + '/me', profileData, { headers: getAuthHeaders() });
};

// This function must use FILE_API_URL
const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return axios.post(`${FILE_API_URL}/upload/avatar`, formData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
        },
    });
};

const userService = {
  getUserProfile,
  getPublicProfile,
  updateUserProfile,
  uploadAvatar,
};

export default userService;