import api from './api';

const API_URL = '/api/reviews';

const createReview = (reviewData) => {
    return api.post(API_URL, reviewData);
};

const getReviewsForUser = (userId) => {
    return api.get(`${API_URL}/user/${userId}`);
};

const reviewService = {
    createReview,
    getReviewsForUser,
};

export default reviewService;