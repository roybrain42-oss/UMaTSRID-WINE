import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { AdminLoginForm } from './AdminLoginForm';

export const AdminAuthModal: React.FC = () => {
  const { showAdminAuthModal, setShowAdminAuthModal, setCurrentView } = useEcoSort();

  if (!showAdminAuthModal) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setShowAdminAuthModal(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <AdminLoginForm
          inline
          onSuccess={() => {
            setShowAdminAuthModal(false);
            setCurrentView('admin');
          }}
          onCancel={() => setShowAdminAuthModal(false)}
        />
      </div>
    </div>
  );
};
