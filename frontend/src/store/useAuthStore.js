import { create } from 'zustand';
import { authService } from '../api';

const useAuthStore = create((set) => ({
  
  user: null,
  token: localStorage.getItem('access_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

 
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authService.login(credentials);
      localStorage.setItem('access_token', data.token);
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Login failed',
        loading: false,
      });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  fetchProfile: async () => {
    try {
      const { data } = await authService.getProfile();
      set({ user: data });
    } catch {
      set({ user: null, isAuthenticated: false, token: null });
      localStorage.removeItem('access_token');
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
