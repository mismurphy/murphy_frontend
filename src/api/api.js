import api from './index';

export const apiTable = {
  getAll: (table) => api.get(`/${table}`),
  getOne: (table, id) => api.get(`/${table}/${id}`),
  create: (table, data) => api.post(`/${table}`, data),
  update: (table, id, data) => api.put(`/${table}/${id}`, data),
  remove: (table, id) => api.delete(`/${table}/${id}`),
};