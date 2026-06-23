import useDialogStore from '../../store/useDialogStore';
import Button from './Button';

export default function ConfirmDialog() {
  const { isOpen, title, message, confirmLabel, cancelLabel, variant, onConfirm } =
    useDialogStore();
  const closeDialog = useDialogStore((state) => state.closeDialog);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={closeDialog} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={closeDialog}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
