import { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, id, className = '', ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className={`space-y-1 ${className}`}>
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full rounded-lg border px-4 py-2.5 text-base bg-white
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400
            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300'}
          `}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
