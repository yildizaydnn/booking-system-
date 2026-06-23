import client from './client';

const userService = {
  getAll() {
    return client.get('/users');
  },

  getById(id) {
    return client.get(`/users/${id}`);
  },

  update(id, data) {
    return client.put(`/users/${id}`, data);
  },

  delete(id) {
    return client.delete(`/users/${id}`);
  },

  updateRole(id, role) {
    return client.patch(`/users/${id}/role`, { role });
  },
};

export default userService;
