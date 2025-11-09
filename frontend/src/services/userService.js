import api from './api';

const API_URL = '/api/users';
const FILE_API_URL = '/api/files';

const getUserProfile = () => {
  // THE FIX: Return response.data directly
  return api.get(`${API_URL}/me`).then(res => res.data);
};

const getPublicProfile = (id) => {
  // THE FIX: Return response.data directly
  return api.get(`${API_URL}/${id}`).then(res => res.data);
};

const updateUserProfile = (profileData) => {
  return api.patch(`${API_URL}/me`, profileData);
};

const uploadAvatar = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post(`${FILE_API_URL}/upload/avatar`, formData, {
        headers: {
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