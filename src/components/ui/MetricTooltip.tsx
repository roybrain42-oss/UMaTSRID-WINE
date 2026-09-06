import React, { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle, X, Sparkles } from 'lucide-react';

export interface MetricTooltipProps {
  title: string;
  description: string;
  calculationFormula?: string;
  impactFactor?: string;
  badgeLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  children?: React.ReactNode;
  className?: string;
  interactiveCard?: boolean;
}

export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  title,
  description,
  calculationFormula,
  impactFactor,
  badgeLabel,
  icon: Icon = Info,
  position = 'top',
  align = 'center',
  children,
  className = '',
  interactiveCard = false
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 120);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  // Dynamic positioning classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2.5';
      case 'left':
        return 'right-full mr-2.5 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2.5 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2.5';
    }
  };

  const getAlignClasses = () => {
    if (position === 'left' || position === 'right') return '';
    switch (align) {
      case 'start':
        return 'left-0';
      case 'end':
        return 'right-0';
      case 'center':
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-flex items-center ${interactiveCard ? 'cursor-pointer' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* If children provided, render children; otherwise render standard info pill button */}
      {children ? (
        <div 
          onClick={interactiveCard ? handleToggle : undefined}
          className="inline-flex items-center gap-1.5 focus:outline-hidden"
          tabIndex={0}
          role="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(prev => !prev);
            }
          }}
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          aria-label={`Explain ${title}`}
          aria-expanded={isOpen}
          className="w-5 h-5 rounded-full bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Popover Card */}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute z-50 w-72 sm:w-80 p-4 rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-150 text-left ${getPositionClasses()} ${getAlignClasses()}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-black text-white tracking-tight leading-tight">
                  {title}
                </h5>
                {badgeLabel && (
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60 mt-0.5">
                    {badgeLabel}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Description */}
          <div className="py-2.5 space-y-2 text-xs">
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {description}
            </p>

            {calculationFormula && (
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-1">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>How it's calculated:</span>
                </div>
                <p className="text-[10px] font-mono text-emerald-300 leading-tight">
                  {calculationFormula}
                </p>
              </div>
            )}

            {impactFactor && (
              <div className="flex items-start gap-1.5 text-[10px] text-amber-300/90 font-medium pt-1">
                <span className="text-amber-400">💡</span>
                <span>{impactFactor}</span>
              </div>
            )}
          </div>

          {/* Mobile Tap Tip */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-400">
            <span>Tap card or Esc to dismiss</span>
            <span className="text-emerald-400 font-medium">EcoSort Verified</span>
          </div>

          {/* Pointer Caret Arrow */}
          {position === 'top' && (
            <div 
              className={`absolute top-full -mt-1 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700/80 rotate-45 ${
                align === 'start' ? 'left-4' : align === 'end' ? 'right-4' : 'left-1/2 -translate-x-1/2'
              }`} 
            />
          )}
          {position === 'bottom' && (
            <div 
              className={`absolute bottom-full -mb-1 w-2.5 h-2.5 bg-slate-900 border-l border-t border-slate-700/80 rotate-45 ${
                align === 'start' ? 'left-4' : align === 'end' ? 'right-4' : 'left-1/2 -translate-x-1/2'
              }`} 
            />
          )}
        </div>
      )}
    </div>
  );
};
