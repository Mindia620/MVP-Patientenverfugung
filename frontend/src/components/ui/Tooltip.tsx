import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const scrollY = window.scrollY

      let top = rect.bottom + scrollY + 8
      let left = rect.left + rect.width / 2 - tooltipRect.width / 2

      if (left < 8) left = 8
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8
      }

      setPosition({ top, left })
    }
  }, [visible])

  return (
    <span className="relative inline-flex items-center">
      <span
        ref={triggerRef}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        tabIndex={0}
        className="cursor-help"
        aria-describedby={visible ? 'tooltip-content' : undefined}
      >
        {children}
      </span>
      {visible && (
        <div
          ref={tooltipRef}
          id="tooltip-content"
          role="tooltip"
          className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl max-w-xs animate-fade-in"
          style={{ top: position.top, left: position.left }}
        >
          {content}
        </div>
      )}
    </span>
  )
}

interface InfoIconProps {
  tooltip: string
  className?: string
}

export function InfoIcon({ tooltip, className = '' }: InfoIconProps) {
  return (
    <Tooltip content={tooltip}>
      <span
        className={`inline-flex items-center justify-center w-4 h-4 bg-primary-100 text-primary-700 rounded-full text-xs font-bold ml-1 cursor-help ${className}`}
        aria-label="More information"
      >
        ?
      </span>
    </Tooltip>
  )
}
