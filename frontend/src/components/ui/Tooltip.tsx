import { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: string
  className?: string
}

export function Tooltip({ content, className }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        aria-label="Mehr Informationen"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => e.key === 'Escape' && setOpen(false)}
        className="text-slate-400 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded"
      >
        <HelpCircle size={16} />
      </button>
      {open && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl z-50 leading-relaxed"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  )
}
