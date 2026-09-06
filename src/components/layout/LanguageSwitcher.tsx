import React, { useState, useRef, useEffect } from 'react';
import { 
  Globe, 
  ChevronDown, 
  Check, 
  Sparkles, 
  Volume2, 
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { SUPPORTED_LANGUAGES, AppLanguage, LanguageInfo } from '../../i18n/translations';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'pill' | 'expanded' | 'inline';
  className?: string;
  showRegion?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'compact',
  className = '',
  showRegion = false
}) => {
  const { language, setLanguage, currentLanguageInfo, addToast } = useEcoSort();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectLanguage = (lang: LanguageInfo) => {
    setLanguage(lang.code);
    setIsOpen(false);
    
    addToast({
      title: `${lang.flagEmoji} ${lang.nativeName}`,
      message: `${lang.greeting}! Interface switched to ${lang.name}.`,
      type: 'info'
    });
  };

  if (variant === 'inline') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Choose Preferred Language / Kasa / Gbegbɔgblɔ:
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelectLanguage(lang)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs ring-1 ring-blue-500/30'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{lang.flagEmoji}</span>
                    <span className="font-bold text-xs truncate">{lang.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block truncate">{lang.nativeName}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      {variant === 'pill' ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-xs cursor-pointer"
          title="Switch Ghanaian Language (Twi, Ga, Ewe, Frafra, Dagbani, Hausa, English)"
        >
          <span className="text-xs">{currentLanguageInfo.flagEmoji}</span>
          <span className="font-bold text-[11px] text-slate-200">{currentLanguageInfo.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-xs cursor-pointer group"
          title="Toggle Ghanaian Language (English, Twi, Ga, Ewe, Frafra, Dagbani, Hausa)"
        >
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform" />
            <span className="text-sm">{currentLanguageInfo.flagEmoji}</span>
            <span className="text-xs font-bold text-white hidden sm:inline">{currentLanguageInfo.name}</span>
            <span className="text-xs font-bold text-white sm:hidden">{currentLanguageInfo.code.toUpperCase()}</span>
          </div>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Language Selection Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#0F172A] border border-slate-700/90 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 space-y-2">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-1">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                Select Language / Kasa
              </span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
              7 Dialects 🇬🇭
            </span>
          </div>

          {/* Languages List */}
          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-600/20 text-white border border-blue-500/40 shadow-xs' 
                      : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{lang.flagEmoji}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs truncate ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                          {lang.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          ({lang.nativeName})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate">
                        📍 {lang.region}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 ml-1">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italic shrink-0 hidden sm:inline">
                      "{lang.greeting.split(' ')[0]}"
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 px-1 flex items-center justify-between">
            <span>Universal Ghana Accessibility</span>
            <span className="text-blue-400 font-semibold">EPA Certified</span>
          </div>

        </div>
      )}

    </div>
  );
};
