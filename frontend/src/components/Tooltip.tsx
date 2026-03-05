import { useState, useRef, useEffect } from 'react'

interface TooltipProps {
  content: string
}

export function Tooltip({ content }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false)
      }
    }
    if (visible) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [visible])

  return (
    <div ref={ref} className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        onBlur={() => setTimeout(() => setVisible(false), 150)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
        aria-label="Information"
      >
        ?
      </button>
      {visible && (
        <div
          className="absolute z-10 left-0 top-full mt-1 p-2 bg-slate-800 text-white text-xs rounded shadow-lg max-w-xs"
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  )
}
