const variants = {
  success: 'bg-success-50 text-success-700 border-success-500',
  error: 'bg-danger-50 text-danger-700 border-danger-500',
  warning: 'bg-warning-50 text-warning-700 border-warning-500',
  info: 'bg-primary-50 text-primary-700 border-primary-500',
};

export default function Alert({ type = 'info', message, onClose }) {
  return (
    <div className={`flex items-center justify-between px-4 py-3 border-l-4 rounded-md ${variants[type]}`}>
      <span className="text-sm">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 opacity-60 hover:opacity-100 cursor-pointer">
          &#x2715;
        </button>
      )}
    </div>
  );
}
