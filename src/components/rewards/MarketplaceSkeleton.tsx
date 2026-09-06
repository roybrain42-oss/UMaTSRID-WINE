import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const MarketplaceSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 animate-fadeIn" aria-busy="true" aria-label="Loading rewards marketplace">
      
      {/* 1. Hero Wallet & Balance Banner Skeleton */}
      <div className="bg-slate-900/90 text-white rounded-3xl p-6 md:p-8 border border-emerald-500/20 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <Skeleton className="h-5 w-48 rounded-full bg-emerald-950/60" />
            <Skeleton className="h-8 md:h-10 w-72 md:w-96 bg-slate-800" />
            <Skeleton className="h-4 w-full sm:w-80 bg-slate-800" />
          </div>

          {/* Dual Balance & Action Skeleton */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0 w-full sm:w-auto">
            {/* Balance Badge Skeleton */}
            <div className="bg-slate-850 border border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-md w-full sm:w-auto">
              <Skeleton variant="rounded" className="w-12 h-12 bg-emerald-900/40 shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-[120px]">
                <Skeleton className="h-3 w-20 bg-slate-700" />
                <Skeleton className="h-6 w-28 bg-slate-600" />
                <Skeleton className="h-3 w-24 bg-amber-900/40" />
              </div>
            </div>

            {/* MoMo Cash Out Action Skeleton */}
            <Skeleton className="h-14 sm:h-auto sm:w-44 rounded-2xl bg-amber-500/20 border border-amber-500/30" />
          </div>
        </div>
      </div>

      {/* 2. Tabs Navigation Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Skeleton className="h-10 w-40 rounded-xl bg-emerald-800/30 shrink-0" />
        <Skeleton className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <Skeleton className="h-10 w-36 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
        <Skeleton className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* 3. Category Filter Chips Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Skeleton className="h-8 w-20 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
        <Skeleton className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <Skeleton className="h-8 w-32 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <Skeleton className="h-8 w-28 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
        <Skeleton className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* 4. Rewards Card Grid (6 items) Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header with provider logo and tag */}
              <div className="flex items-start justify-between gap-3">
                <Skeleton variant="rounded" className="w-12 h-12 bg-slate-200 dark:bg-slate-800 shrink-0" />
                <Skeleton className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Title and details */}
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-3/4 bg-slate-300 dark:bg-slate-700" />
                <Skeleton className="h-3.5 w-full bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-3.5 w-4/5 bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>

            {/* Pricing and Action Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20 bg-emerald-200 dark:bg-emerald-900/50" />
                  <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-800" />
              </div>
              
              <Skeleton className="h-11 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
