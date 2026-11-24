import api from './api';

const submitReport = (reportedUserId, reason) => {
    return api.post('/api/reports', {
        reportedUserId,
        reason,
    });
};

const reportService = {
    submitReport,
};

export default reportService;
