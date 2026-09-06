import React, { useState } from 'react';
import { 
  User, 
  School, 
  Truck, 
  Factory, 
  ShieldCheck, 
  Check, 
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { UserRole } from '../../types';

export interface EcosystemRoleInfo {
  role: UserRole;
  title: string;
  shortTitle: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  personaName: string;
}

export const ECOSYSTEM_ROLES: EcosystemRoleInfo[] = [
  {
    role: 'USER',
    title: 'Citizen',
    shortTitle: 'Citizen',
    icon: <User className="w-3.5 h-3.5" />,
    accentColor: 'text-blue-500',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300',
    badgeBorder: 'border-blue-200 dark:border-blue-800',
    personaName: 'Bright (Household)',
  },
  {
    role: 'COMMUNITY_ADMIN',
    title: 'School / Community',
    shortTitle: 'Community',
    icon: <School className="w-3.5 h-3.5" />,
    accentColor: 'text-emerald-500',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    personaName: 'Mrs. Darko (Lead)',
  },
  {
    role: 'COLLECTION_AGENT',
    title: 'Collection Agent',
    shortTitle: 'Agent',
    icon: <Truck className="w-3.5 h-3.5" />,
    accentColor: 'text-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    personaName: 'Kwame (Fleet)',
  },
  {
    role: 'RECYCLER',
    title: 'Recycler Hub',
    shortTitle: 'Recycler',
    icon: <Factory className="w-3.5 h-3.5" />,
    accentColor: 'text-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    personaName: 'Accra Circular',
  },
  {
    role: 'ADMIN',
    title: 'EPA Ghana Admin',
    shortTitle: 'Admin',
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    accentColor: 'text-rose-500',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    personaName: 'EPA National',
  },
];

interface EcosystemRoleSwitcherProps {
  compact?: boolean;
}

export const EcosystemRoleSwitcher: React.FC<EcosystemRoleSwitcherProps> = () => {
  const { currentUser, switchRole, setCurrentView } = useEcoSort();

  const activeRole: UserRole = currentUser.role === 'USER' && (currentUser.entityType === 'SCHOOL' || currentUser.entityType === 'COMMUNITY' || currentUser.entityType === 'ORGANIZATION')
    ? 'COMMUNITY_ADMIN'
    : currentUser.role;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <span className="text-xs font-bold text-slate-900 dark:text-white block">
            Role View:
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Switch stakeholder perspective
          </span>
        </div>
      </div>

      {/* Role Selection Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {ECOSYSTEM_ROLES.map((roleInfo) => {
          const isSelected = activeRole === roleInfo.role;

          return (
            <button
              key={roleInfo.role}
              type="button"
              onClick={() => {
                switchRole(roleInfo.role);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                isSelected
                  ? `${roleInfo.badgeBg} ${roleInfo.badgeBorder} shadow-xs`
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className={roleInfo.accentColor}>{roleInfo.icon}</span>
              <span>{roleInfo.shortTitle}</span>
              {isSelected && <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 ml-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
