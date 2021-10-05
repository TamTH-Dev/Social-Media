import axios from 'axios';

const apiService = axios.create({
  baseURL: process.env.REACT_APP_SERVER_API_URL,
  withCredentials: true,
});

export default apiService
