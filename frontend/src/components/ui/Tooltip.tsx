import { useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        className="ml-1.5 text-gray-400 hover:text-primary-500 transition-colors"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Mehr Informationen"
      >
        <Info size={16} />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-lg bg-gray-800 text-white text-sm p-3 shadow-lg">
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-800" />
          {content}
        </div>
      )}
    </span>
  );
}
