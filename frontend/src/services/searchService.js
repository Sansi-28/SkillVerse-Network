import axios from 'axios';

const API_URL = 'http://localhost:8080/api/search';

const search = (query) => {
    return axios.get(API_URL, { params: { q: query } });
};

const searchService = {
    search,
};

export default searchService;
