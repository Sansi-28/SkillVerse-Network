import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/api/search';

const search = (query) => {
    return axios.get(API_URL, { params: { q: query } });
};

const searchService = {
    search,
};

export default searchService;
