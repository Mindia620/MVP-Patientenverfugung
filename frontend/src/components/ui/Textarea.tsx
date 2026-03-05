import { cn } from '@/lib/utils'
import type { TextareaHTMLAttributes } from 'react'
import { forwardRef } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  currentLength?: number
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, currentLength, maxLength, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          maxLength={maxLength}
          aria-invalid={!!error}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors resize-y min-h-[120px]',
            'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
            error ? 'border-red-400' : 'border-slate-300 hover:border-slate-400',
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-center">
          {error ? (
            <p role="alert" className="text-xs text-red-600">⚠ {error}</p>
          ) : hint ? (
            <p className="text-xs text-slate-500">{hint}</p>
          ) : (
            <span />
          )}
          {maxLength !== undefined && currentLength !== undefined && (
            <p className="text-xs text-slate-400">
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
