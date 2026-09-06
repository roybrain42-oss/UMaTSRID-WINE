import React, { useState, useMemo } from 'react';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Coins, 
  CheckCircle2, 
  AlertTriangle,
  Gift,
  FileSpreadsheet,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useEcoSort } from '../../context/EcoSortContext';
import { AdminAuditLog } from '../../types';

export const AdminAuditFeed: React.FC = () => {
  const { 
    adminAuditLogs, 
    allUsers, 
    submissions, 
    transactions, 
    cashWithdrawals,
    triggerCelebration 
  } = useEcoSort();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return adminAuditLogs.filter(log => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        log.details.toLowerCase().includes(q) ||
        log.targetName.toLowerCase().includes(q) ||
        log.adminName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q);

      const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;
      return matchesSearch && matchesAction;
    });
  }, [adminAuditLogs, searchQuery, selectedAction]);

  const exportAuditCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Timestamp,Admin_ID,Admin_Name,Action,Target_Type,Target_Name,Details\n"
      + adminAuditLogs.map(l => `"${l.id}","${l.timestamp}","${l.adminId}","${l.adminName}","${l.action}","${l.targetType}","${l.targetName}","${l.details.replace(/"/g, '""')}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoSort_Ghana_Admin_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerCelebration();
  };

  const exportFinancialLedgerCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Timestamp,Recipient,Phone,Network,Points_Converted,Net_Payout_GHS,Status,Fee_GHS,Reference\n"
      + cashWithdrawals.map(w => `"${w.id}","${w.createdAt}","${w.accountHolderName}","${w.recipientPhone}","${w.network}",${w.pointsConverted},${w.netPayoutGhs},"${w.status}",${w.feeGhs},"${w.transactionRef}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `EcoSort_Ghana_MoMo_Financial_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerCelebration();
  };

  const getActionIcon = (action: AdminAuditLog['action']) => {
    switch (action) {
      case 'USER_CREATED':
        return <UserPlus className="w-4 h-4 text-emerald-500" />;
      case 'USER_DELETED':
        return <Trash2 className="w-4 h-4 text-rose-500" />;
      case 'POINTS_ADJUSTED':
        return <Coins className="w-4 h-4 text-amber-500" />;
      case 'REWARD_CREATED':
      case 'REWARD_UPDATED':
      case 'REWARD_DELETED':
        return <Gift className="w-4 h-4 text-purple-500" />;
      case 'JOB_VERIFIED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'JOB_CANCELLED':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            EPA Administrative Audit Trail & Compliance Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of user modifications, points subsidies, verified weigh-ins & security operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={exportFinancialLedgerCSV}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Export MoMo Ledger
          </button>
          <button
            onClick={exportAuditCSV}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Audit Trail
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search audit trail by admin, user, target, action or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'ALL', label: 'All Operations' },
              { id: 'USER_CREATED', label: 'User Created' },
              { id: 'USER_DELETED', label: 'User Deleted' },
              { id: 'POINTS_ADJUSTED', label: 'Points Adjusted' },
              { id: 'JOB_VERIFIED', label: 'Job Verified' },
              { id: 'REWARD_CREATED', label: 'Rewards' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedAction(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAction === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No audit logs found</h4>
            <p className="text-xs text-slate-500 mt-1">Actions performed by admins will be recorded here.</p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-slate-800 text-[10px] font-mono">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Target: {log.targetName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({log.targetType} #{log.targetId})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {log.details}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Officer: <strong className="text-slate-700 dark:text-slate-300">{log.adminName}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                {log.id}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
