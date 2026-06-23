export default function Select({
  label,
  error,
  id,
  options = [],
  placeholder = 'Select...',
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
      <select
        id={id}
        className={`w-full px-3 py-2 border rounded-md text-sm transition-colors bg-white
          ${error
            ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-sm text-danger-500">{error}</span>}
    </div>
  );
}
