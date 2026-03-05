import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
  }, [visible]);

  return (
    <span className="relative inline-flex items-center">
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full bg-slate-300 text-slate-600 hover:bg-slate-400"
        aria-label={content}
        tabIndex={0}
      >
        ?
      </span>
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute z-50 max-w-xs rounded bg-slate-800 px-3 py-2 text-sm text-white shadow-lg"
          style={{ top: position.top, left: position.left }}
        >
          {content}
        </div>
      )}
      {children}
    </span>
  );
}
