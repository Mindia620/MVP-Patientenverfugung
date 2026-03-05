import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode
  error?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? String(label).toLowerCase().replace(/\s+/g, '-').slice(0, 30)

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="flex items-start gap-3 cursor-pointer group">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            aria-invalid={!!error}
            className={cn(
              'mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-600',
              'focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
              'transition-colors cursor-pointer',
              className
            )}
            {...props}
          />
          <span className="text-sm text-slate-700 group-hover:text-slate-900 leading-relaxed">
            {label}
          </span>
        </label>
        {error && <p role="alert" className="text-xs text-red-600 pl-7">⚠ {error}</p>}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
