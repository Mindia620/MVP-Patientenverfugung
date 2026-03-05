import { forwardRef } from 'react'
import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { InfoIcon } from './Tooltip'

interface FieldWrapperProps {
  label: string
  htmlFor: string
  error?: string
  tooltip?: string
  required?: boolean
  children: ReactNode
  hint?: string
}

export function FieldWrapper({ label, htmlFor, error, tooltip, required, children, hint }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="input-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && <InfoIcon tooltip={tooltip} />}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      {error && (
        <p className="input-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  tooltip?: string
  hint?: string
}

export const FormInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, tooltip, hint, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} tooltip={tooltip} required={props.required} hint={hint}>
        <input
          ref={ref}
          id={fieldId}
          className={`input-field ${error ? 'error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...props}
        />
      </FieldWrapper>
    )
  }
)
FormInput.displayName = 'FormInput'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
  tooltip?: string
  options: { value: string; label: string }[]
}

export const FormSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, tooltip, options, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} tooltip={tooltip} required={props.required}>
        <select
          ref={ref}
          id={fieldId}
          className={`input-field ${error ? 'error' : ''}`}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </FieldWrapper>
    )
  }
)
FormSelect.displayName = 'FormSelect'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
  tooltip?: string
  maxLength?: number
  currentLength?: number
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, tooltip, maxLength, currentLength, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    const charsRemaining = maxLength !== undefined && currentLength !== undefined
      ? maxLength - currentLength
      : undefined

    return (
      <FieldWrapper label={label} htmlFor={fieldId} error={error} tooltip={tooltip}>
        <textarea
          ref={ref}
          id={fieldId}
          className={`input-field resize-none ${error ? 'error' : ''}`}
          rows={4}
          maxLength={maxLength}
          aria-invalid={!!error}
          {...props}
        />
        {charsRemaining !== undefined && (
          <p className={`mt-1 text-xs text-right ${charsRemaining < 50 ? 'text-amber-600' : 'text-gray-400'}`}>
            {charsRemaining} Zeichen verbleibend
          </p>
        )}
      </FieldWrapper>
    )
  }
)
FormTextarea.displayName = 'FormTextarea'
