import axios from 'axios';
import authService from './authService';

const API_URL = process.env.REACT_APP_API_URL + '/api/reports';

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    if (user && user.accessToken) {
        return { Authorization: `Bearer ${user.accessToken}` };
    }
    return {};
};

const submitReport = (reportedUserId, reason) => {
    const reportData = {
        reportedUserId,
        reason,
    };
    return axios.post(API_URL, reportData, { headers: getAuthHeaders() });
};

const reportService = {
    submitReport,
};

export default reportService;