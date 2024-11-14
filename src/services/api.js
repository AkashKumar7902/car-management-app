// src/services/api.js
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Replace with your backend URL
});

export default instance;
