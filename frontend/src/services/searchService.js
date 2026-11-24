import api from './api';

const search = (query) => {
    return api.get('/api/search', { params: { q: query } });
};

const searchService = {
    search,
};

export default searchService;
