import { create } from 'zustand';

const useDialogStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel',
  variant: 'danger',
  onConfirm: null,

  openDialog: ({ title, message, confirmLabel, cancelLabel, variant, onConfirm }) =>
    set({
      isOpen: true,
      title,
      message,
      confirmLabel: confirmLabel || 'Confirm',
      cancelLabel: cancelLabel || 'Cancel',
      variant: variant || 'danger',
      onConfirm,
    }),

  closeDialog: () =>
    set({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
    }),
}));

// Shortcut — herhangi bir yerden çağırılabilir
export const confirm = ({ title, message, confirmLabel, cancelLabel, variant }) =>
  new Promise((resolve) => {
    useDialogStore.getState().openDialog({
      title,
      message,
      confirmLabel,
      cancelLabel,
      variant,
      onConfirm: () => {
        useDialogStore.getState().closeDialog();
        resolve(true);
      },
    });
  });

export default useDialogStore;
