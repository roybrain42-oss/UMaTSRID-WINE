import React from 'react';
import { Skeleton } from '../ui/Skeleton';

export const UserDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn" aria-busy="true" aria-label="Loading dashboard content">
      
      {/* 1. Hero Profile & Greeting Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-slate-900/90 border border-emerald-500/20 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5 w-full lg:w-auto">
            {/* Avatar skeleton */}
            <Skeleton variant="circular" className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 border-emerald-500/30" />
            
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 bg-slate-800" />
                <Skeleton className="h-5 w-20 rounded-full bg-emerald-950/60" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-32 bg-slate-800" />
                <Skeleton className="h-4 w-28 bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons Skeleton */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            <Skeleton className="h-11 w-36 rounded-xl bg-emerald-800/40" />
            <Skeleton className="h-11 w-36 rounded-xl bg-slate-800" />
          </div>
        </div>

        {/* Level & Milestone Progress Skeleton */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-2/3">
            <Skeleton className="h-4 w-24 bg-slate-800 shrink-0" />
            <Skeleton className="h-3 flex-1 rounded-full bg-slate-800" />
          </div>
          <Skeleton className="h-4 w-32 bg-slate-800 shrink-0" />
        </div>
      </div>

      {/* 2. Key Metrics 4-Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-800" />
              <Skeleton variant="rounded" className="w-10 h-10 bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-8 w-32 bg-slate-300 dark:bg-slate-700" />
              <Skeleton className="h-3.5 w-20 bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Navigation Tabs Skeleton */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
          <Skeleton className="h-9 w-32 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-9 w-28 rounded-xl bg-slate-200 dark:bg-slate-700" />
        </div>
        <Skeleton className="h-5 w-44 bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* 4. Dual Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Submissions & Activity (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40 bg-slate-300 dark:bg-slate-700" />
            <Skeleton className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>

          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Skeleton variant="rounded" className="w-14 h-14 bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-28 bg-slate-300 dark:bg-slate-700" />
                    <Skeleton className="h-4 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <Skeleton className="h-3 w-40 bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                <div className="text-right space-y-1">
                  <Skeleton className="h-5 w-16 bg-slate-300 dark:bg-slate-700" />
                  <Skeleton className="h-3 w-12 bg-slate-200 dark:bg-slate-800" />
                </div>
                <Skeleton variant="rounded" className="w-8 h-8 bg-slate-200 dark:bg-slate-800 shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Weekly Target & Badges (1 Col) */}
        <div className="space-y-5">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32 bg-slate-300 dark:bg-slate-700" />
              <Skeleton className="h-4 w-12 bg-slate-200 dark:bg-slate-800" />
            </div>
            <Skeleton className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16 bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-20 bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <Skeleton className="h-5 w-36 bg-slate-300 dark:bg-slate-700" />
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[1, 2, 3, 4].map(b => (
                <div key={b} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <Skeleton variant="circular" className="w-9 h-9 bg-slate-200 dark:bg-slate-700" />
                  <Skeleton className="h-2 w-8 bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
