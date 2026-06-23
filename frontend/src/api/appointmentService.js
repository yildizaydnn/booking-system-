import client from './client';

const appointmentService = {
  getAll(params) {
    return client.get('/appointments', { params });
  },

  getById(id) {
    return client.get(`/appointments/${id}`);
  },

  create(data) {
    return client.post('/appointments', data);
  },

  cancel(id) {
    return client.patch(`/appointments/${id}/cancel`);
  },
};

export default appointmentService;
