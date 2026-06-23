import { create } from 'zustand';

let notificationId = 0;

const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = ++notificationId;
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id, duration: 3000, ...notification },
      ],
    }));

    // Auto-remove after duration
    const duration = notification.duration || 3000;
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

// Shortcut helpers — herhangi bir yerden çağırılabilir
export const toast = {
  success: (message) =>
    useNotificationStore.getState().addNotification({ type: 'success', message }),
  error: (message) =>
    useNotificationStore.getState().addNotification({ type: 'error', message }),
  warning: (message) =>
    useNotificationStore.getState().addNotification({ type: 'warning', message }),
  info: (message) =>
    useNotificationStore.getState().addNotification({ type: 'info', message }),
};

export default useNotificationStore;
