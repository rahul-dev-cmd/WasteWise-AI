import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const res = await axios.get('http://localhost:8001/');
  return res.data;
};

export const predictFootfall = async (data) => {
  const res = await api.post('/predict', data);
  return res.data;
};

export const simulateMarketing = async (data) => {
  const res = await api.post('/marketing/simulate', data);
  return res.data;
};

export const getNgoNetwork = async () => {
  const res = await api.get('/ngo/network');
  return res.data;
};
