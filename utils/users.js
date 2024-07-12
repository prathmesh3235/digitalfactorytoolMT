// utils/auth.js
import axiosInstance from './axiosInstance';

export const login = async (username, password) => {
  const response = await axiosInstance.post('/users/login', { username, password });
  return response.data;
};
