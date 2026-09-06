import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';

interface AdminLoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  inline?: boolean;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSuccess,
  onCancel,
  inline = false
}) => {
  const { loginAsAdminWithCredentials, addToast } = useEcoSort();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAsAdminWithCredentials(username, password);
      setIsLoading(false);

      if (result.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 400);
  };

  return (
    <div className={`w-full ${inline ? '' : 'max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl'} text-left space-y-5 animate-in fade-in`}>
      
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="EcoSort" 
            className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-sm ring-1 ring-purple-200 dark:ring-purple-800"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              EPA Administrative Portal
            </h3>
            <p className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              UMaT SRID Command Grid
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
          Official Officer
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs animate-in shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Admin Username / Agency ID
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="admin-username-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. UMaT SRID"
              required
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Admin Access Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="admin-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all shadow-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            id="admin-login-submit-btn"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating UMaT SRID...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign In as EPA Admin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Security notice footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        <span>University of Mines & Technology (UMaT SRID) • EPA Ghana Security</span>
      </div>

    </div>
  );
};
