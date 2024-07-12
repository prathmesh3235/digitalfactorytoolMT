// utils/axiosInstance.js
import axios from 'axios';
import Router from 'next/router';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  // other configurations if needed
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      Router.push('/Login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
