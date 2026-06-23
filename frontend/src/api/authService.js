import client from './client';

const authService = {
  login(credentials) {
    return client.post('/auth/login', credentials);
  },

  register(data) {
    return client.post('/auth/register', data);
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  getProfile() {
    return client.get('/auth/profile');
  },
};

export default authService;
