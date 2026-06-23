import client from './client';

const businessService = {
  getAll() {
    return client.get('/businesses');
  },

  getById(id) {
    return client.get(`/businesses/${id}`);
  },

  create(data) {
    return client.post('/businesses', data);
  },

  update(id, data) {
    return client.put(`/businesses/${id}`, data);
  },

  delete(id) {
    return client.delete(`/businesses/${id}`);
  },
};

export default businessService;
