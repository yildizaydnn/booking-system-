export default function Input({
  label,
  error,
  id,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-md text-sm transition-colors
          ${error
            ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${className}`}
        {...props}
      />
      {error && <span className="text-sm text-danger-500">{error}</span>}
    </div>
  );
}
