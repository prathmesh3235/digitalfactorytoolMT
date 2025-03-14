// utils/auth.js
import axiosInstance from './axiosInstance';

export const update = async (id, payload) => {
  const response = await axiosInstance.patch('/phases/'+id, payload);
  return response.data;
};

export const getPhases = async () => {
  const response = await axiosInstance.get('/phases');
  return response.data;
};


export const updatePhaseNo = async (id, payload) => {
  const response = await axiosInstance.patch('/'+id, { title: phase.description, phaseNo: phase.phaseNo });
  return response.data;
};

export const createPhase = async (payload) => {
  const response = await axiosInstance.post('/phases', payload);
  return response.data;
};