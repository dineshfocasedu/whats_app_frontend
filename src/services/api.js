import axios from 'axios';

const BASE = process.env.REACT_APP_API_URL || '';

const API = axios.create({ baseURL: `${BASE}/api` });

export const getContacts = (search = '') =>
  API.get('/chats', { params: search ? { search } : {} });

export const getChatByPhone = (phone) => API.get(`/chats/${phone}`);

export const deleteChat = (phone) => API.delete(`/chats/${phone}`);
